import crypto from 'node:crypto';
import { appPool } from './appDb.js';

export async function ensureHistorySchema() {
  await appPool.query(`
    CREATE TABLE IF NOT EXISTS query_history (
      id CHAR(36) PRIMARY KEY,
      user_id CHAR(36) NOT NULL,
      sql_text TEXT NOT NULL,
      connection_name VARCHAR(120) NULL,
      status ENUM('success', 'error') NOT NULL,
      row_count INT NULL,
      duration_ms INT NULL,
      error_message TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX (user_id, created_at)
    )
  `);
}

// Fire-and-forget: a failed history write must never break a query response.
export async function recordQuery(userId, entry) {
  try {
    await appPool.query(
      `INSERT INTO query_history
        (id, user_id, sql_text, connection_name, status, row_count, duration_ms, error_message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        crypto.randomUUID(),
        userId,
        entry.sql,
        entry.connectionName ?? null,
        entry.status,
        entry.rowCount ?? null,
        entry.durationMs ?? null,
        entry.errorMessage ?? null,
      ]
    );
  } catch (err) {
    console.error('recordQuery failed:', err);
  }
}

export async function listHistory(userId, limit = 100) {
  const [rows] = await appPool.query(
    `SELECT id, sql_text, connection_name, status, row_count, duration_ms, error_message, created_at
       FROM query_history
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?`,
    [userId, limit]
  );
  return rows.map((r) => ({
    id: r.id,
    sql: r.sql_text,
    connectionName: r.connection_name,
    status: r.status,
    rowCount: r.row_count,
    durationMs: r.duration_ms,
    errorMessage: r.error_message,
    createdAt: r.created_at,
  }));
}

// Returns true if a row was deleted. Users can only delete their own history.
export async function removeHistoryItem(userId, id) {
  const [result] = await appPool.query(
    'DELETE FROM query_history WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result.affectedRows > 0;
}

export async function clearHistory(userId) {
  await appPool.query('DELETE FROM query_history WHERE user_id = ?', [userId]);
}