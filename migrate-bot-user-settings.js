import db from './database.js';

async function createBotUserSettingsTable() {
    try {
        console.log('🔧 Creating bot_user_settings table...');
        
        // Create table for bot user settings
        await db.query(`
            CREATE TABLE IF NOT EXISTS bot_user_settings (
                id SERIAL PRIMARY KEY,
                instagram_user_id VARCHAR(50) UNIQUE NOT NULL,
                instagram_username VARCHAR(100),
                sender_name VARCHAR(100),
                bot_enabled BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Populate with existing users from instagram_messages
        console.log('📊 Populating with existing Instagram users...');
        
        const existingUsers = await db.query(`
            SELECT DISTINCT 
                instagram_user_id,
                COALESCE(instagram_username, 'Sin username') as instagram_username,
                COALESCE(sender_name, 'Usuario de Instagram') as sender_name
            FROM instagram_messages 
            WHERE is_from_user = true
        `);
        
        console.log(`📋 Found ${existingUsers.rows.length} existing users`);
        
        for (const user of existingUsers.rows) {
            await db.query(`
                INSERT INTO bot_user_settings (instagram_user_id, instagram_username, sender_name, bot_enabled)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (instagram_user_id) DO NOTHING
            `, [user.instagram_user_id, user.instagram_username, user.sender_name, true]);
        }
        
        console.log('✅ Bot user settings table created successfully!');
        console.log('📋 All existing users have bot enabled by default');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating bot user settings table:', error);
        process.exit(1);
    }
}

createBotUserSettingsTable();