import db from './database.js';

async function testConversationFlow() {
    try {
        console.log('🧪 Testing Instagram conversation flow...');
        
        // Test user ID
        const testUserId = '17841444731790462';
        
        // 1. Reset conversation state
        console.log('1️⃣ Resetting conversation state...');
        await db.query(`
            DELETE FROM conversation_states WHERE instagram_user_id = $1
        `, [testUserId]);
        
        // 2. Check initial state
        console.log('2️⃣ Checking initial state...');
        const initialState = await db.query(
            'SELECT * FROM conversation_states WHERE instagram_user_id = $1',
            [testUserId]
        );
        console.log('Initial state rows:', initialState.rows.length);
        
        // 3. Simulate conversation flow
        console.log('3️⃣ Simulating conversation flow...');
        
        // Create initial state
        const newState = await db.query(
            `INSERT INTO conversation_states (instagram_user_id, current_state, collected_data) 
             VALUES ($1, $2, $3) RETURNING *`,
            [testUserId, 'idle', '{}']
        );
        console.log('Created state:', newState.rows[0]);
        
        // Update to awaiting_name
        await db.query(
            `UPDATE conversation_states 
             SET current_state = $1, collected_data = $2, updated_at = CURRENT_TIMESTAMP
             WHERE instagram_user_id = $3`,
            ['awaiting_name', '{}', testUserId]
        );
        
        // Update to awaiting_email with name
        await db.query(
            `UPDATE conversation_states 
             SET current_state = $1, collected_data = $2, updated_at = CURRENT_TIMESTAMP
             WHERE instagram_user_id = $3`,
            ['awaiting_email', JSON.stringify({name: 'Juan Pérez'}), testUserId]
        );
        
        // Update to awaiting_phone with email
        await db.query(
            `UPDATE conversation_states 
             SET current_state = $1, collected_data = $2, updated_at = CURRENT_TIMESTAMP
             WHERE instagram_user_id = $3`,
            ['awaiting_phone', JSON.stringify({name: 'Juan Pérez', email: 'juan@empresa.com'}), testUserId]
        );
        
        // Update to awaiting_company with phone
        await db.query(
            `UPDATE conversation_states 
             SET current_state = $1, collected_data = $2, updated_at = CURRENT_TIMESTAMP
             WHERE instagram_user_id = $3`,
            ['awaiting_company', JSON.stringify({name: 'Juan Pérez', email: 'juan@empresa.com', phone: '+1234567890'}), testUserId]
        );
        
        // Final state check
        const finalState = await db.query(
            'SELECT * FROM conversation_states WHERE instagram_user_id = $1',
            [testUserId]
        );
        console.log('Final state:', finalState.rows[0]);
        
        // 4. Test quick code generation
        console.log('4️⃣ Testing quick code generation...');
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        
        await db.query(
            `INSERT INTO quick_codes (name, email, phone, company, code, expires_at, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                'Juan Pérez',
                'juan@empresa.com',
                '+1234567890',
                'Empresa Test',
                code,
                expiresAt,
                new Date()
            ]
        );
        
        console.log(`✅ Test code generated: ${code}`);
        
        // 5. Reset to idle
        await db.query(
            `UPDATE conversation_states 
             SET current_state = 'idle', collected_data = '{}', updated_at = CURRENT_TIMESTAMP
             WHERE instagram_user_id = $1`,
            [testUserId]
        );
        
        console.log('✅ Conversation flow test completed successfully!');
        
        // 6. Clean up test data
        await db.query('DELETE FROM quick_codes WHERE code = $1', [code]);
        await db.query('DELETE FROM conversation_states WHERE instagram_user_id = $1', [testUserId]);
        
        console.log('🧹 Test data cleaned up');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

testConversationFlow();