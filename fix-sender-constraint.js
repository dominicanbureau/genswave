import db from './database.js';

async function fixSenderConstraint() {
  try {
    console.log('🔧 Fixing sender constraint in ai_chat_sessions...');

    // Drop the old constraint
    await db.query(`
      ALTER TABLE ai_chat_sessions 
      DROP CONSTRAINT IF EXISTS ai_chat_sessions_sender_check
    `);

    console.log('✅ Old constraint dropped');

    // Add new constraint that includes 'support'
    await db.query(`
      ALTER TABLE ai_chat_sessions 
      ADD CONSTRAINT ai_chat_sessions_sender_check 
      CHECK (sender IN ('user', 'ai', 'support'))
    `);

    console.log('✅ New constraint added with support for "support" sender');
    console.log('🎉 Fix completed successfully!');

  } catch (error) {
    console.error('❌ Error fixing constraint:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

fixSenderConstraint();
