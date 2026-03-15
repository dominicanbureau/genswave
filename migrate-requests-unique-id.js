import db from './database.js';

async function addUniqueIdToRequests() {
    try {
        console.log('🔧 Adding unique_id column to requests table...');
        
        // Add unique_id column to requests table
        await db.query(`
            ALTER TABLE requests 
            ADD COLUMN IF NOT EXISTS unique_id VARCHAR(10) UNIQUE
        `);
        
        // Generate unique IDs for existing requests
        const requests = await db.query('SELECT id FROM requests WHERE unique_id IS NULL');
        console.log(`📊 Found ${requests.rows.length} requests without unique_id`);
        
        for (const request of requests.rows) {
            const uniqueId = 'S' + Math.random().toString(36).substring(2, 8).toUpperCase();
            await db.query(
                'UPDATE requests SET unique_id = $1 WHERE id = $2',
                [uniqueId, request.id]
            );
        }
        
        console.log('✅ Unique IDs added to requests table successfully!');
        console.log(`📊 Updated ${requests.rows.length} existing requests`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding unique IDs to requests:', error);
        process.exit(1);
    }
}

addUniqueIdToRequests();