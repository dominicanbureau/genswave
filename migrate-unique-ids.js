import db from './database.js';

async function addUniqueIds() {
    try {
        console.log('🔧 Adding unique IDs to projects and appointments...');
        
        // Add unique_id column to projects table
        await db.query(`
            ALTER TABLE projects 
            ADD COLUMN IF NOT EXISTS unique_id VARCHAR(10) UNIQUE
        `);
        
        // Add unique_id column to appointments table  
        await db.query(`
            ALTER TABLE appointments 
            ADD COLUMN IF NOT EXISTS unique_id VARCHAR(10) UNIQUE
        `);
        
        // Generate unique IDs for existing projects
        const projects = await db.query('SELECT id FROM projects WHERE unique_id IS NULL');
        for (const project of projects.rows) {
            const uniqueId = 'P' + Math.random().toString(36).substring(2, 8).toUpperCase();
            await db.query(
                'UPDATE projects SET unique_id = $1 WHERE id = $2',
                [uniqueId, project.id]
            );
        }
        
        // Generate unique IDs for existing appointments
        const appointments = await db.query('SELECT id FROM appointments WHERE unique_id IS NULL');
        for (const appointment of appointments.rows) {
            const uniqueId = 'S' + Math.random().toString(36).substring(2, 8).toUpperCase();
            await db.query(
                'UPDATE appointments SET unique_id = $1 WHERE id = $2',
                [uniqueId, appointment.id]
            );
        }
        
        console.log('✅ Unique IDs added successfully!');
        console.log(`📊 Updated ${projects.rows.length} projects and ${appointments.rows.length} appointments`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding unique IDs:', error);
        process.exit(1);
    }
}

addUniqueIds();