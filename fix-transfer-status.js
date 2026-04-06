import db from './database.js';

async function fixTransferStatus() {
  try {
    console.log('🔧 Adding user_disconnected status to ai_support_transfers...');

    // Drop old constraint
    await db.query(`
      ALTER TABLE ai_support_transfers 
      DROP CONSTRAINT IF EXISTS ai_support_transfers_status_check
    `);

    console.log('✅ Old constraint dropped');

    // Add new constraint with user_disconnected
    await db.query(`
      ALTER TABLE ai_support_transfers 
      ADD CONSTRAINT ai_support_transfers_status_check 
      CHECK (status IN ('pending', 'in_progress', 'resolved', 'user_disconnected'))
    `);

    console.log('✅ New constraint added with user_disconnected status');
    console.log('🎉 Fix completed successfully!');

  } catch (error) {
    console.error('❌ Error fixing constraint:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

fixTransferStatus();
