import db from './database.js';

async function testConsultation() {
    try {
        console.log('🧪 Testing consultation function...\n');
        
        // Get a sample request ID
        const requests = await db.query('SELECT unique_id, title, status FROM requests LIMIT 1');
        if (requests.rows.length > 0) {
            const testId = requests.rows[0].unique_id;
            console.log(`Testing with request ID: ${testId}`);
            
            // Test the same logic as the bot
            let result = null;
            let type = '';
            
            if (testId.startsWith('S')) {
                // First check appointments
                const appointmentResult = await db.query(
                    'SELECT * FROM appointments WHERE unique_id = $1',
                    [testId]
                );
                console.log(`Appointment search: ${appointmentResult.rows.length} results`);
                
                if (appointmentResult.rows.length > 0) {
                    result = appointmentResult.rows[0];
                    type = 'appointment';
                } else {
                    // Check requests
                    const requestResult = await db.query(
                        'SELECT * FROM requests WHERE unique_id = $1',
                        [testId]
                    );
                    console.log(`Request search: ${requestResult.rows.length} results`);
                    
                    if (requestResult.rows.length > 0) {
                        result = requestResult.rows[0];
                        type = 'request';
                    }
                }
            }
            
            if (result) {
                console.log(`✅ Found ${type}: ${result.title} (Status: ${result.status})`);
            } else {
                console.log(`❌ Not found`);
            }
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testConsultation();