import mysql from 'mysql2/promise';

// The one active pool connection. It lives only in server memory.
let activePool = null;
let activeMeta = null; 

// build the pool!
function buildPool({ host, port, database, username, password }) {
  return mysql.createPool({
    host,
    port: Number(port) || 3306,
    database,
    user: username,
    password,
    connectionLimit: 5,
    connectTimeout: 5000,
    waitForConnections: true,
  });
}

// is my credentials crt to connect(create pool?) to an alive db sever??
export async function testConnection(details) {
  const pool = buildPool(details);
  try {
    const [rows] = await pool.query('SELECT VERSION() AS version');
    return { version: rows[0].version };
  } finally {
    await pool.end();
  }
}

// * imp fun! this is not an individual connection!
// whole pool thing going on!

export async function activate_pool(details) {
  const pool = buildPool(details);
  // lightweight test query!
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    await pool.end().catch(() => {});
    throw err;
  }

  // older active pools?
  if (activePool) await activePool.end().catch(() => {});

  activePool = pool; 
  
  // details about the pool itself
  activeMeta = {
    name: details.name || details.database,
    host: details.host,
    port: Number(details.port) || 3306,
    database: details.database,
    username: details.username,
  };
  return activeMeta;
}

// Closes the active pool connection.
export async function rm_active_pool() {
  if (activePool) await activePool.end().catch(() => {});
  activePool = null;
  activeMeta = null;
}

// Used by the query routes to run SQL on the active database.
export function getActivePool() {
  return activePool;
}

// Used by the UI to show which database is connected.
// yup needed!
export function getActiveMeta() {
  return activeMeta;
}