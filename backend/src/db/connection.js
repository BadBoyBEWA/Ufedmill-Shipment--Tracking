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
  process.exit(-1);
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
    process.exit(1);
  }
  console.log('✅ PostgreSQL connected successfully');
  release();
});

module.exports = pool;
