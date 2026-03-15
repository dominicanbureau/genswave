import db from './database.js';

async function debugConsultationIds() {
    try {
        console.log('🔍 Debugging consultation IDs...\n');
        
        // Check appointments
        console.log('📋 APPOINTMENTS:');
        const appointments = await db.query('SELECT id, unique_id, name, service, status FROM appointments ORDER BY created_at DESC');
        appointments.rows.forEach(apt => {
            console.log(`  ID: ${apt.unique_id} | Name: ${apt.name} | Service: ${apt.service} | Status: ${apt.status}`);
        });
        
        console.log('\n📊 PROJECTS:');
        const projects = await db.query('SELECT id, unique_id, title, status FROM projects ORDER BY created_at DESC');
        projects.rows.forEach(proj => {
            console.log(`  ID: ${proj.unique_id} | Title: ${proj.title} | Status: ${proj.status}`);
        });
        
        console.log('\n📝 REQUESTS:');
        const requests = await db.query('SELECT id, unique_id, title, status FROM requests ORDER BY created_at DESC');
        requests.rows.forEach(req => {
            console.log(`  ID: ${req.unique_id} | Title: ${req.title} | Status: ${req.status}`);
        });
        
        console.log('\n🔍 Testing consultation logic...');
        
        // Test with a sample ID
        if (appointments.rows.length > 0) {
            const testId = appointments.rows[0].unique_id;
            console.log(`\n🧪 Testing with appointment ID: ${testId}`);
            
            // Test appointment lookup
            const appointmentResult = await db.query(
                'SELECT * FROM appointments WHERE unique_id = $1',
                [testId]
            );
            console.log(`  Appointment found: ${appointmentResult.rows.length > 0 ? 'YES' : 'NO'}`);
            
            // Test requests lookup (should be empty)
            const requestResult = await db.query(
                'SELECT * FROM requests WHERE unique_id = $1',
                [testId]
            );
            console.log(`  Request found: ${requestResult.rows.length > 0 ? 'YES' : 'NO'}`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error debugging consultation IDs:', error);
        process.exit(1);
    }
}

debugConsultationIds();