const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testConnection() {
  console.log('🔌 Testing database connection...');
  console.log(`📡 Connecting to: ${process.env.DATABASE_URL.replace(/:.+@/, ':****@')}\n`);
  
  try {
    // Test basic connection
    const result = await pool.query('SELECT NOW() as server_time, current_database() as database_name, current_user as user');
    
    console.log('✅ Connection successful!\n');
    console.log('📊 Database Info:');
    console.log(`   - Database: ${result.rows[0].database_name}`);
    console.log(`   - User: ${result.rows[0].user}`);
    console.log(`   - Server Time: ${result.rows[0].server_time}`);
    
    // Check tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`\n📋 Tables in database (${tables.rows.length}):`);
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // Check counts
    for (const row of tables.rows) {
      const count = await pool.query(`SELECT COUNT(*) FROM ${row.table_name}`);
      console.log(`   - ${row.table_name}: ${count.rows[0].count} records`);
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n💡 Troubleshooting tips:');
    console.error('   1. Check if PostgreSQL is running: net start postgresql-x64-18');
    console.error('   2. Verify password in .env file');
    console.error('   3. Check if database exists: psql -U postgres -l');
  } finally {
    await pool.end();
  }
}

testConnection();