const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected DB pool error:', err);
  // In serverless environments, we should not call process.exit
  if (process.env.NODE_ENV !== 'production') {
    process.exit(-1);
  }
});

// Startup test removed for serverless compatibility.
// Connections will be established on-demand.

module.exports = pool;
