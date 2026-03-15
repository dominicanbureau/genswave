import db from './database.js';

async function migrateInstagramConversations() {
  console.log('💬 Setting up Instagram conversation system...');
  
  try {
    // Create instagram_conversation_states table
    await db.query(`
      CREATE TABLE IF NOT EXISTS instagram_conversation_states (
        id SERIAL PRIMARY KEY,
        instagram_user_id VARCHAR(255) UNIQUE NOT NULL,
        conversation_type VARCHAR(50) DEFAULT 'none',
        current_step INTEGER DEFAULT 0,
        collected_data JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Instagram conversation states table created');

    // Create indexes for better performance
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_instagram_conversation_user_id 
      ON instagram_conversation_states(instagram_user_id)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_instagram_conversation_active 
      ON instagram_conversation_states(is_active)
    `);
    
    console.log('✅ Instagram conversation indexes created');
    console.log('🎉 Instagram conversation system setup completed!');
    
  } catch (error) {
    console.error('❌ Instagram conversation migration failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateInstagramConversations()
    .then(() => {
      console.log('✅ Instagram conversation migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Instagram conversation migration failed:', error);
      process.exit(1);
    });
}

export default migrateInstagramConversations;