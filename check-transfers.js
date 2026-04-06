import db from './database.js';

async function checkTransfers() {
  try {
    const result = await db.query(`
      SELECT id, session_id, assigned_agent_name, status, created_at
      FROM ai_support_transfers 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log('Recent transfers:');
    console.table(result.rows);
    
    if (result.rows.length > 0) {
      const latestSession = result.rows[0].session_id;
      console.log('\nMessages for latest session:', latestSession);
      
      const messages = await db.query(`
        SELECT id, message, sender, context, created_at
        FROM ai_chat_sessions
        WHERE session_id = $1
        ORDER BY created_at DESC
        LIMIT 10
      `, [latestSession]);
      
      console.table(messages.rows);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkTransfers();
