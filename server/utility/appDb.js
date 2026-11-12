import mysql from 'mysql2/promise';

export const appPool = mysql.createPool({
  host: process.env.APP_DB_HOST,
  port: Number(process.env.APP_DB_PORT) || 3306,
  database: process.env.APP_DB_NAME,
  user: process.env.APP_DB_USER,
  password: process.env.APP_DB_PASSWORD,
  connectionLimit: 5,
  waitForConnections: true,
  queueLimit: 0,
});

// Creates the table on startup if it doesn't exist yet.
export async function ensureSchema() {
  await appPool.query(`
    CREATE TABLE IF NOT EXISTS saved_connections (
      id CHAR(36) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      host VARCHAR(255) NOT NULL,
      port INT NOT NULL,
      database_name VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL,
      password_enc TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}