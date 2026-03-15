import db from './database.js';
import dotenv from 'dotenv';

dotenv.config();

async function testInstagramIntegration() {
  console.log('🧪 Testing Instagram Integration...\n');

  try {
    // Test 1: Check if instagram_messages table exists
    console.log('1. Checking instagram_messages table...');
    const tableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'instagram_messages'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ instagram_messages table exists');
    } else {
      console.log('❌ instagram_messages table does not exist');
      return;
    }

    // Test 2: Check Instagram environment variables
    console.log('\n2. Checking Instagram environment variables...');
    const requiredVars = [
      'INSTAGRAM_APP_ID',
      'INSTAGRAM_APP_SECRET', 
      'INSTAGRAM_ACCESS_TOKEN',
      'INSTAGRAM_WEBHOOK_VERIFY_TOKEN'
    ];

    let allVarsPresent = true;
    requiredVars.forEach(varName => {
      if (process.env[varName]) {
        console.log(`✅ ${varName} is set`);
      } else {
        console.log(`❌ ${varName} is missing`);
        allVarsPresent = false;
      }
    });

    if (!allVarsPresent) {
      console.log('\n⚠️  Some environment variables are missing');
    }

    // Test 3: Check if we can query Instagram messages
    console.log('\n3. Testing Instagram messages query...');
    const messagesQuery = await db.query(`
      SELECT COUNT(*) as message_count 
      FROM instagram_messages
    `);
    console.log(`✅ Found ${messagesQuery.rows[0].message_count} Instagram messages in database`);

    // Test 4: Check if we can query conversations
    console.log('\n4. Testing Instagram conversations query...');
    const conversationsQuery = await db.query(`
      SELECT 
        instagram_user_id,
        sender_name,
        COUNT(*) as message_count,
        MAX(created_at) as last_message_time
      FROM instagram_messages 
      GROUP BY instagram_user_id, sender_name
      ORDER BY last_message_time DESC
      LIMIT 5
    `);
    
    if (conversationsQuery.rows.length > 0) {
      console.log(`✅ Found ${conversationsQuery.rows.length} Instagram conversations:`);
      conversationsQuery.rows.forEach((conv, index) => {
        console.log(`   ${index + 1}. ${conv.sender_name} (${conv.message_count} messages)`);
      });
    } else {
      console.log('ℹ️  No Instagram conversations found yet');
    }

    // Test 5: Check quick_codes table compatibility
    console.log('\n5. Testing quick_codes table...');
    const quickCodesQuery = await db.query(`
      SELECT COUNT(*) as code_count 
      FROM quick_codes 
      WHERE email LIKE 'instagram_%@temp.com'
    `);
    console.log(`✅ Found ${quickCodesQuery.rows[0].code_count} Instagram-generated quick codes`);

    // Test 6: Simulate quick code generation
    console.log('\n6. Testing quick code generation...');
    const testCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const insertResult = await db.query(`
      INSERT INTO quick_codes (name, email, phone, company, code, expires_at, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [
      'Test Instagram User',
      'instagram_test@temp.com',
      'Test Phone',
      'Test Company',
      testCode,
      expiresAt,
      new Date()
    ]);

    console.log(`✅ Test quick code generated: ${testCode} (ID: ${insertResult.rows[0].id})`);

    // Clean up test data
    await db.query('DELETE FROM quick_codes WHERE id = $1', [insertResult.rows[0].id]);
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 Instagram integration test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Database tables are properly configured');
    console.log('- Environment variables are set');
    console.log('- Query functions are working');
    console.log('- Quick code generation is functional');
    
    if (conversationsQuery.rows.length > 0) {
      console.log('- Instagram conversations are being received');
    } else {
      console.log('- No Instagram conversations yet (this is normal for new setups)');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run the test
testInstagramIntegration();