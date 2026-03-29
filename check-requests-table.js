import db from './database.js';

async function checkRequestsTable() {
  try {
    const result = await db.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'requests' 
      ORDER BY ordinal_position;
    `);
    
    console.log('Requests table structure:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkRequestsTable();