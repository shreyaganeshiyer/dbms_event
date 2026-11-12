import crypto from 'node:crypto';
import { appPool } from '../utility/appDb.js';


const SESSION_DAYS = 7;

// Only a hash of the token is stored, so a leaked table can't be used as live sessions.
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await appPool.query(
    'INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)',
    [hashToken(token), userId, expires]
  );
  return { token, expires };
}

export async function findSession(token) {
  const [rows] = await appPool.query(
    `SELECT u.id, u.username
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ? AND s.expires_at > NOW()`,
    [hashToken(token)]
  );
  return rows[0] ?? null;
}

export async function deleteSession(token) {
  await appPool.query('DELETE FROM sessions WHERE token_hash = ?', [hashToken(token)]);
}