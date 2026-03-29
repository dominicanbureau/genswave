import db from './database.js';

async function verifyTables() {
    try {
        console.log('🔍 Verificando estructura de tablas...\n');
        
        // Check messages table
        const messagesColumns = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'messages'
            ORDER BY ordinal_position
        `);
        console.log('📋 Tabla messages:');
        messagesColumns.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type}`);
        });
        
        // Check projects table
        const projectsColumns = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'projects'
            ORDER BY ordinal_position
        `);
        console.log('\n📋 Tabla projects:');
        projectsColumns.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type}`);
        });
        
        // Check requests table
        const requestsColumns = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'requests'
            ORDER BY ordinal_position
        `);
        console.log('\n📋 Tabla requests:');
        requestsColumns.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type}`);
        });
        
        console.log('\n✅ Verificación completada');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

verifyTables();