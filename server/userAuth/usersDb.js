import crypto from 'node:crypto';
import { appPool } from '../utility/appDb.js';

export async function createUser(username, passwordHash) {
  const id = crypto.randomUUID();
  
  await appPool.query(
    'INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)',
    [id, username, passwordHash]
  );
  return { id, username };
}

export async function findUserByUsername(username) {
  const [rows] = await appPool.query(
    'SELECT id, username, password_hash FROM users WHERE username = ?',
    [username]
  );
  return rows[0] ?? null;
}