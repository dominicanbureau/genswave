import db from './database.js';

async function migrateAIAssistant() {
  try {
    console.log('🤖 Creating AI Assistant tables...');

    // Create ai_chat_sessions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS ai_chat_sessions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        sender VARCHAR(10) NOT NULL CHECK (sender IN ('user', 'ai')),
        context JSONB,
        transferred_to_support BOOLEAN DEFAULT FALSE,
        transfer_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for ai_chat_sessions
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_session_id ON ai_chat_sessions(session_id)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_created_at ON ai_chat_sessions(created_at)
    `);

    // Create ai_support_transfers table
    await db.query(`
      CREATE TABLE IF NOT EXISTS ai_support_transfers (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        messages_history JSONB NOT NULL,
        last_message TEXT,
        context JSONB,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP,
        resolved_by VARCHAR(255),
        resolution_notes TEXT
      )
    `);

    // Create indexes for ai_support_transfers
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_support_transfers_session_id ON ai_support_transfers(session_id)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_support_transfers_status ON ai_support_transfers(status)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_support_transfers_created_at ON ai_support_transfers(created_at)
    `);

    // Add foreign key constraint
    await db.query(`
      ALTER TABLE ai_chat_sessions 
      ADD CONSTRAINT fk_transfer_id 
      FOREIGN KEY (transfer_id) REFERENCES ai_support_transfers(id)
      ON DELETE SET NULL
    `);

    console.log('✅ AI Assistant tables created successfully!');

    // Insert sample data for testing
    console.log('📝 Inserting sample AI chat data...');
    
    const sampleSessionId = 'sample_session_' + Date.now();
    
    await db.query(`
      INSERT INTO ai_chat_sessions (session_id, message, sender, context) VALUES
      ($1, '¡Hola! Soy Genswave, tu asistente virtual. Conozco todo sobre nuestros servicios, procesos y funcionalidades. ¿En qué puedo ayudarte hoy?', 'ai', '{"url": "/", "timestamp": "${new Date().toISOString()}"}')
    `, [sampleSessionId]);

    console.log('✅ Sample data inserted successfully!');
    console.log('🎉 AI Assistant migration completed!');

  } catch (error) {
    console.error('❌ Error during AI Assistant migration:', error);
    throw error;
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateAIAssistant()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export default migrateAIAssistant;