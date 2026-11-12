import { appPool } from '../utility/appDb.js';

async function columnExists(table, column) {
  const [rows] = await appPool.query(
    `SELECT 1 FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  return rows.length > 0;
}

// Creates the users and sessions tables, and adds user_id to saved_connections.
export async function ensureAuthSchema() {
  await appPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id CHAR(36) PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await appPool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash CHAR(64) PRIMARY KEY,
      user_id CHAR(36) NOT NULL,
      expires_at DATETIME NOT NULL,
      INDEX (user_id)
    )
  `);

  if (!(await columnExists('saved_connections', 'user_id'))) {
    await appPool.query(
      'ALTER TABLE saved_connections ADD COLUMN user_id CHAR(36) NULL, ADD INDEX (user_id)'
    );
  }
  
}   