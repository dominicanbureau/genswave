import fs from 'fs';
import db from './database.js';

async function runMigration() {
    try {
        console.log('Ejecutando migración de características finales...');
        
        const sql = fs.readFileSync('./migrate-final-features.sql', 'utf8');
        await db.query(sql);
        
        console.log('✅ Migración completada exitosamente');
        console.log('- Columna attachments agregada a messages');
        console.log('- Tabla quick_codes creada');
        console.log('- Columna position agregada a users');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en la migración:', error);
        process.exit(1);
    }
}

runMigration();