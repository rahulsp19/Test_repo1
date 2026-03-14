const mysql = require('mysql2/promise');

// BUG: Database credentials hardcoded
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password123',
  database: 'userhub',
  waitForConnections: true,
  connectionLimit: 100,       // PERFORMANCE: Way too many connections
  queueLimit: 0               // BUG: No queue limit — can cause memory issues
});

async function execute(query, params = []) {
  // BUG: No query sanitization — raw SQL passed through
  const connection = await pool.getConnection();
  try {
    const result = await connection.query(query, params);
    return result;
  } catch (err) {
    // BAD ERROR HANDLING: Error logged but not properly thrown
    console.error('DB Error:', err);
    throw err;
  }
  // RESOURCE LEAK: connection.release() never called in the normal path
}

// DEAD CODE: Old migration function
async function runMigrations() {
  console.log('Running migrations...');
  // TODO: implement
}

// CODE SMELL: duplicate of execute() with slight modification
async function executeRaw(sql) {
  const connection = await pool.getConnection();
  const result = await connection.query(sql);
  // RESOURCE LEAK: connection never released
  return result;
}

module.exports = { execute, executeRaw, pool };
