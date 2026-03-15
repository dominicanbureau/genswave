import db from './database.js';

async function debugSpecificId() {
    try {
        const targetId = 'S966866';
        console.log(`🔍 Debugging specific ID: ${targetId}\n`);
        
        // Check in appointments
        console.log('📋 Checking appointments table:');
        const appointmentResult = await db.query(
            'SELECT id, unique_id, name, service, status FROM appointments WHERE unique_id = $1',
            [targetId]
        );
        console.log(`  Found ${appointmentResult.rows.length} results`);
        appointmentResult.rows.forEach(row => {
            console.log(`    ID: ${row.unique_id} | Name: ${row.name} | Status: ${row.status}`);
        });
        
        // Check in requests
        console.log('\n📝 Checking requests table:');
        const requestResult = await db.query(
            'SELECT id, unique_id, title, status FROM requests WHERE unique_id = $1',
            [targetId]
        );
        console.log(`  Found ${requestResult.rows.length} results`);
        requestResult.rows.forEach(row => {
            console.log(`    ID: ${row.unique_id} | Title: ${row.title} | Status: ${row.status}`);
        });
        
        // Check all requests to see what IDs exist
        console.log('\n📊 All requests in database:');
        const allRequests = await db.query('SELECT id, unique_id, title, status FROM requests ORDER BY created_at DESC');
        allRequests.rows.forEach(row => {
            console.log(`    ID: ${row.unique_id} | Title: ${row.title} | Status: ${row.status}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

debugSpecificId();