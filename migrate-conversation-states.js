import db from './database.js';

async function createConversationStatesTable() {
  try {
    console.log('🔄 Creating conversation_states table...');
    
    // Create conversation_states table
    await db.query(`
      CREATE TABLE IF NOT EXISTS conversation_states (
        id SERIAL PRIMARY KEY,
        instagram_user_id VARCHAR(255) NOT NULL,
        current_state VARCHAR(50) DEFAULT 'idle',
        collected_data JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(instagram_user_id)
      )
    `);

    // Create index for better performance
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_conversation_states_user_id 
      ON conversation_states(instagram_user_id)
    `);

    console.log('✅ conversation_states table created successfully');
    
    // Test the table
    const testResult = await db.query('SELECT COUNT(*) FROM conversation_states');
    console.log(`📊 Current conversation states: ${testResult.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error creating conversation_states table:', error);
    throw error;
  }
}

// Run migration
createConversationStatesTable()
  .then(() => {
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });