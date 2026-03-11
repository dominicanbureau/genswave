import db from './database.js';

async function fixMessagesTable() {
    try {
        console.log('🔧 Verificando y arreglando tabla de mensajes...');
        
        // Check if attachments column exists
        const columnCheck = await db.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'messages' AND column_name = 'attachments'
        `);
        
        if (columnCheck.rows.length > 0) {
            console.log('📝 Eliminando columna attachments temporalmente...');
            await db.query('ALTER TABLE messages DROP COLUMN IF EXISTS attachments');
            console.log('✅ Columna attachments eliminada');
        } else {
            console.log('✅ Tabla messages ya está en el formato correcto');
        }
        
        // Verify table structure
        const tableStructure = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'messages' 
            ORDER BY ordinal_position
        `);
        
        console.log('📋 Estructura actual de la tabla messages:');
        tableStructure.rows.forEach(row => {
            console.log(`   - ${row.column_name}: ${row.data_type}`);
        });
        
        console.log('\n🎉 Tabla de mensajes arreglada correctamente!');
        console.log('💬 El chat ahora funcionará solo con mensajes de texto');
        console.log('📎 Los archivos adjuntos se pueden agregar más tarde');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al arreglar tabla de mensajes:', error);
        process.exit(1);
    }
}

fixMessagesTable();