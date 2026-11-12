import crypto from 'node:crypto';
import { appPool } from './appDb.js';

function getKey() {
    if (!process.env.CONNECTIONS_SECRET) throw new Error('secret is missing from .env');
    return crypto.createHash('sha256').update(process.env.CONNECTIONS_SECRET).digest();
}

function encrypt(text) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', getKey(), iv);
    const data = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return Buffer.concat([iv, cipher.getAuthTag(), data]).toString('base64');
}

function decrypt(payload) {
    const buf = Buffer.from(payload, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', getKey(), buf.subarray(0, 12));
    decipher.setAuthTag(buf.subarray(12, 28));
    return Buffer.concat([decipher.update(buf.subarray(28)), decipher.final()]).toString('utf8');
}

// Converts a database row to the shape the frontend expects. No password.
function toSafe(row) {
    return {
        id: row.id,
        name: row.name,
        host: row.host,
        port: row.port,
        database: row.database_name,
        username: row.username,
    };
}

// Safe to send to the browser: no password.
export async function listSaved() {
    const [rows] = await appPool.query(
        'SELECT id, name, host, port, database_name, username FROM saved_connections ORDER BY created_at'
    );
    return rows.map(toSafe);
}

export async function addSaved(details) {
    const id = crypto.randomUUID();
    const name = details.name || details.database;
    await appPool.query(
        'INSERT INTO saved_connections (id, name, host, port, database_name, username, password_enc) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, name, details.host, Number(details.port) || 3306, details.database, details.username, encrypt(details.password)]
    );
    return { id, name, host: details.host, port: Number(details.port) || 3306, database: details.database, username: details.username };
}

export async function removeSaved(id) {
    await appPool.query('DELETE FROM saved_connections WHERE id = ?', [id]);
}

// Server-side only: returns the decrypted details so the app can connect.
export async function getSavedDetails(id) {
    const [rows] = await appPool.query('SELECT * FROM saved_connections WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
        name: row.name,
        host: row.host,
        port: row.port,
        database: row.database_name,
        username: row.username,
        password: decrypt(row.password_enc),
    };
}