import db from './database.js';

async function migrateServicesForm() {
    try {
        console.log('🔄 Iniciando migración para formulario de servicios...');

        // Agregar nuevas columnas a la tabla requests
        const alterQueries = [
            `ALTER TABLE requests ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255)`,
            `ALTER TABLE requests ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255)`,
            `ALTER TABLE requests ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50)`,
            `ALTER TABLE requests ADD COLUMN IF NOT EXISTS request_type VARCHAR(50) DEFAULT 'panel'`,
            `ALTER TABLE requests ALTER COLUMN user_id DROP NOT NULL`
        ];

        for (const query of alterQueries) {
            try {
                await db.query(query);
                console.log('✅ Ejecutado:', query);
            } catch (error) {
                if (error.message.includes('already exists')) {
                    console.log('⚠️  Columna ya existe:', query);
                } else {
                    console.error('❌ Error en query:', query, error.message);
                }
            }
        }

        console.log('✅ Migración completada exitosamente');
        
    } catch (error) {
        console.error('❌ Error en migración:', error);
        process.exit(1);
    }
}

// Ejecutar migración
migrateServicesForm()
    .then(() => {
        console.log('🎉 Migración finalizada');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Error fatal:', error);
        process.exit(1);
    });