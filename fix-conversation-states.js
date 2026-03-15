import db from './database.js';

async function fixConversationStates() {
    try {
        console.log('🔍 Checking conversation states...');
        
        // Check current states
        const result = await db.query('SELECT * FROM conversation_states ORDER BY updated_at DESC LIMIT 10');
        
        console.log('📊 Current conversation states:');
        result.rows.forEach(row => {
            console.log(`User: ${row.user_id}, State: ${row.current_state}`);
            try {
                const data = JSON.parse(row.collected_data || '{}');
                console.log('Data keys:', Object.keys(data));
                if (data.name && data.name.length > 100) {
                    console.log('⚠️ CORRUPTED: Name field contains full message text');
                }
            } catch (e) {
                console.log('❌ Invalid JSON in collected_data');
            }
            console.log('---');
        });

        // Clean corrupted states - reset all to idle
        console.log('🧹 Cleaning all conversation states...');
        await db.query(`
            UPDATE conversation_states 
            SET current_state = 'idle', 
                collected_data = '{}', 
                updated_at = CURRENT_TIMESTAMP
        `);

        console.log('✅ All conversation states reset to idle');

        // Verify cleanup
        const cleanResult = await db.query('SELECT COUNT(*) as count FROM conversation_states WHERE current_state != \'idle\'');
        console.log(`📊 Non-idle states remaining: ${cleanResult.rows[0].count}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing conversation states:', error);
        process.exit(1);
    }
}

fixConversationStates();