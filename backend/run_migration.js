require('dotenv').config();
const pool = require('./src/db/connection');
const fs = require('fs');
const path = require('path');

async function migrate() {
  try {
    const migrationPath = path.join(__dirname, 'src', 'db', 'migrations', '002_add_customer_and_chat.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('--- Applying Migration 002 ---');
    await pool.query(sql);
    console.log('✅ Migration applied successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();
