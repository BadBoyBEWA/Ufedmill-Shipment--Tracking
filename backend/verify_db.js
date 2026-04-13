require('dotenv').config();
const pool = require('./src/db/connection');

async function verify() {
  try {
    console.log('--- Verifying Database Schema ---');
    const shipmentsCols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'shipments'");
    console.log('Shipments Columns:', shipmentsCols.rows.map(r => r.column_name).join(', '));
    
    const messagesTable = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_name = 'messages'");
    console.log('Messages Table Exists:', messagesTable.rows.length > 0);
    
    process.exit(0);
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  }
}

verify();
