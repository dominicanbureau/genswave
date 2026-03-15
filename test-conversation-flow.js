import db from './database.js';

async function testConversationFlow() {
  console.log('🧪 Testing Conversation Flow...\n');

  try {
    const userId = '1418733329331765';
    
    // 1. Check current state
    console.log('1. Checking current conversation state...');
    const currentState = await db.query(
      'SELECT * FROM conversation_states WHERE instagram_user_id = $1',
      [userId]
    );
    
    if (currentState.rows.length > 0) {
      console.log('✅ Current state:', currentState.rows[0]);
    } else {
      console.log('❌ No conversation state found');
      return;
    }

    // 2. Test state transitions
    console.log('\n2. Testing state transitions...');
    
    // Test moving to awaiting_name
    await db.query(
      'UPDATE conversation_states SET current_state = $1, updated_at = CURRENT_TIMESTAMP WHERE instagram_user_id = $2',
      ['awaiting_name', userId]
    );
    console.log('✅ Updated to awaiting_name');

    // Test moving to awaiting_email with collected data
    const testData = { name: 'Test User' };
    await db.query(
      'UPDATE conversation_states SET current_state = $1, collected_data = $2, updated_at = CURRENT_TIMESTAMP WHERE instagram_user_id = $3',
      ['awaiting_email', JSON.stringify(testData), userId]
    );
    console.log('✅ Updated to awaiting_email with data:', testData);

    // 3. Verify data persistence
    console.log('\n3. Verifying data persistence...');
    const updatedState = await db.query(
      'SELECT * FROM conversation_states WHERE instagram_user_id = $1',
      [userId]
    );
    console.log('✅ Final state:', updatedState.rows[0]);

    // 4. Reset to idle for actual testing
    console.log('\n4. Resetting to idle for testing...');
    await db.query(
      'UPDATE conversation_states SET current_state = $1, collected_data = $2, updated_at = CURRENT_TIMESTAMP WHERE instagram_user_id = $3',
      ['idle', '{}', userId]
    );
    console.log('✅ Reset to idle state');

    console.log('\n🎉 Conversation flow test completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Wait for Render deployment to complete (2-3 minutes)');
    console.log('2. Write "código" in Instagram to test');
    console.log('3. Check server logs for debugging output');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

testConversationFlow();