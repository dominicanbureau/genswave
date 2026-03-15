import db from './database.js';

async function fixUniqueIdFormat() {
    try {
        console.log('🔧 Fixing unique ID format to use numbers only...');
        
        // Fix appointments (S prefix + numbers)
        const appointments = await db.query('SELECT id, unique_id FROM appointments WHERE unique_id IS NOT NULL');
        console.log(`📊 Found ${appointments.rows.length} appointments to check`);
        
        for (const appointment of appointments.rows) {
            // Check if ID contains letters after the prefix
            if (appointment.unique_id && appointment.unique_id.length > 1) {
                const prefix = appointment.unique_id[0];
                const suffix = appointment.unique_id.substring(1);
                
                // If suffix contains non-numeric characters, generate new ID
                if (!/^\d+$/.test(suffix)) {
                    const newUniqueId = 'S' + Math.floor(Math.random() * 900000 + 100000).toString();
                    await db.query(
                        'UPDATE appointments SET unique_id = $1 WHERE id = $2',
                        [newUniqueId, appointment.id]
                    );
                    console.log(`📝 Updated appointment ${appointment.id}: ${appointment.unique_id} → ${newUniqueId}`);
                }
            }
        }
        
        // Fix projects (P prefix + numbers)
        const projects = await db.query('SELECT id, unique_id FROM projects WHERE unique_id IS NOT NULL');
        console.log(`📊 Found ${projects.rows.length} projects to check`);
        
        for (const project of projects.rows) {
            // Check if ID contains letters after the prefix
            if (project.unique_id && project.unique_id.length > 1) {
                const prefix = project.unique_id[0];
                const suffix = project.unique_id.substring(1);
                
                // If suffix contains non-numeric characters, generate new ID
                if (!/^\d+$/.test(suffix)) {
                    const newUniqueId = 'P' + Math.floor(Math.random() * 900000 + 100000).toString();
                    await db.query(
                        'UPDATE projects SET unique_id = $1 WHERE id = $2',
                        [newUniqueId, project.id]
                    );
                    console.log(`📝 Updated project ${project.id}: ${project.unique_id} → ${newUniqueId}`);
                }
            }
        }
        
        // Fix requests (S prefix + numbers)
        const requests = await db.query('SELECT id, unique_id FROM requests WHERE unique_id IS NOT NULL');
        console.log(`📊 Found ${requests.rows.length} requests to check`);
        
        for (const request of requests.rows) {
            // Check if ID contains letters after the prefix
            if (request.unique_id && request.unique_id.length > 1) {
                const prefix = request.unique_id[0];
                const suffix = request.unique_id.substring(1);
                
                // If suffix contains non-numeric characters, generate new ID
                if (!/^\d+$/.test(suffix)) {
                    const newUniqueId = 'S' + Math.floor(Math.random() * 900000 + 100000).toString();
                    await db.query(
                        'UPDATE requests SET unique_id = $1 WHERE id = $2',
                        [newUniqueId, request.id]
                    );
                    console.log(`📝 Updated request ${request.id}: ${request.unique_id} → ${newUniqueId}`);
                }
            }
        }
        
        console.log('✅ Unique ID format fixed successfully!');
        console.log('📋 All IDs now use format: [P|S] + 6 digits (e.g., P123456, S789012)');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing unique ID format:', error);
        process.exit(1);
    }
}

fixUniqueIdFormat();