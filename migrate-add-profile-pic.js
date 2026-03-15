import db from './database.js';

async function addProfilePicColumn() {
    try {
        console.log('🔧 Adding profile_pic column to bot_user_settings table...');
        
        // Add profile_pic column if it doesn't exist
        await db.query(`
            ALTER TABLE bot_user_settings 
            ADD COLUMN IF NOT EXISTS profile_pic TEXT
        `);
        
        console.log('✅ Profile pic column added successfully!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding profile_pic column:', error);
        process.exit(1);
    }
}

addProfilePicColumn();