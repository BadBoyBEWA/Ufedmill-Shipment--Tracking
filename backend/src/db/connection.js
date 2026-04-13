const { neon } = require('@neondatabase/serverless');

// Create a single connection instance
let sql = null;

function getConnection() {
  if (!sql) {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.error('DATABASE_URL is not set');
      return null;
    }
    
    sql = neon(databaseUrl);
  }
  return sql;
}

async function query(text, params = []) {
  const client = getConnection();
  if (!client) {
    throw new Error('Database not configured');
  }
  
  try {
    const result = await client(text, params);
    return { rows: result };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

module.exports = {
  query,
  getConnection
};