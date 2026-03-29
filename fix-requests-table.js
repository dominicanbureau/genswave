import db from './database.js';

async function fixRequestsTable() {
    try {
        console.log('🔄 Adding missing fields to requests table...');
        
        // Add budget field if it doesn't exist
        await db.query(`
            ALTER TABLE requests 
            ADD COLUMN IF NOT EXISTS budget DECIMAL(10, 2)
        `);
        console.log('✅ Added budget field');
        
        // Add unique_id field if it doesn't exist
        await db.query(`
            ALTER TABLE requests 
            ADD COLUMN IF NOT EXISTS unique_id VARCHAR(20) UNIQUE
        `);
        console.log('✅ Added unique_id field');
        
        console.log('🚀 Requests table fix completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Fix failed:', error);
        process.exit(1);
    }
}

fixRequestsTable();