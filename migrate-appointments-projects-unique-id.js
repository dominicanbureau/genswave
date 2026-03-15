import db from './database.js';

async function addUniqueIdToAppointmentsAndProjects() {
    try {
        console.log('🔧 Adding unique_id columns to appointments and projects tables...');
        
        // Add unique_id column to appointments table
        await db.query(`
            ALTER TABLE appointments 
            ADD COLUMN IF NOT EXISTS unique_id VARCHAR(10) UNIQUE
        `);
        
        // Add unique_id column to projects table
        await db.query(`
            ALTER TABLE projects 
            ADD COLUMN IF NOT EXISTS unique_id VARCHAR(10) UNIQUE
        `);
        
        // Generate unique IDs for existing appointments
        const appointments = await db.query('SELECT id FROM appointments WHERE unique_id IS NULL');
        console.log(`📊 Found ${appointments.rows.length} appointments without unique_id`);
        
        for (const appointment of appointments.rows) {
            const uniqueId = 'S' + Math.floor(Math.random() * 900000 + 100000).toString();
            await db.query(
                'UPDATE appointments SET unique_id = $1 WHERE id = $2',
                [uniqueId, appointment.id]
            );
        }
        
        // Generate unique IDs for existing projects
        const projects = await db.query('SELECT id FROM projects WHERE unique_id IS NULL');
        console.log(`📊 Found ${projects.rows.length} projects without unique_id`);
        
        for (const project of projects.rows) {
            const uniqueId = 'P' + Math.floor(Math.random() * 900000 + 100000).toString();
            await db.query(
                'UPDATE projects SET unique_id = $1 WHERE id = $2',
                [uniqueId, project.id]
            );
        }
        
        console.log('✅ Unique IDs added to appointments and projects tables successfully!');
        console.log(`📊 Updated ${appointments.rows.length} existing appointments`);
        console.log(`📊 Updated ${projects.rows.length} existing projects`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding unique IDs:', error);
        process.exit(1);
    }
}

addUniqueIdToAppointmentsAndProjects();