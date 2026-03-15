import db from './database.js';

async function migrateInstagram() {
  console.log('📱 Setting up Instagram integration...');
  
  try {
    // Create instagram_messages table
    await db.query(`
      CREATE TABLE IF NOT EXISTS instagram_messages (
        id SERIAL PRIMARY KEY,
        instagram_user_id VARCHAR(255) NOT NULL,
        instagram_username VARCHAR(255),
        sender_name VARCHAR(255),
        message_text TEXT,
        message_type VARCHAR(50) DEFAULT 'text',
        attachments JSONB,
        is_from_user BOOLEAN DEFAULT true,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Instagram messages table created');

    // Create instagram_config table for storing tokens and settings
    await db.query(`
      CREATE TABLE IF NOT EXISTS instagram_config (
        id SERIAL PRIMARY KEY,
        access_token TEXT,
        app_id VARCHAR(255),
        webhook_verify_token VARCHAR(255),
        is_active BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Instagram config table created');

    // Create indexes for better performance
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_instagram_messages_user_id 
      ON instagram_messages(instagram_user_id)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_instagram_messages_created_at 
      ON instagram_messages(created_at DESC)
    `);
    
    console.log('✅ Instagram database indexes created');
    console.log('🎉 Instagram integration setup completed!');
    
  } catch (error) {
    console.error('❌ Instagram migration failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateInstagram()
    .then(() => {
      console.log('✅ Instagram migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Instagram migration failed:', error);
      process.exit(1);
    });
}

export default migrateInstagram;