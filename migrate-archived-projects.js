#!/usr/bin/env node

import db from './database.js';

async function addArchivedColumn() {
    try {
        console.log('🔄 Agregando columna archived a la tabla projects...');
        
        // Check if column already exists
        const checkColumn = await db.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'projects' AND column_name = 'archived'
        `);
        
        if (checkColumn.rows.length > 0) {
            console.log('✅ La columna archived ya existe');
            return;
        }
        
        // Add archived column as boolean with default false
        await db.query(`
            ALTER TABLE projects 
            ADD COLUMN archived BOOLEAN DEFAULT FALSE
        `);
        
        console.log('✅ Columna archived agregada exitosamente');
        
        // Verify the column was added
        const verify = await db.query(`
            SELECT column_name, data_type, column_default
            FROM information_schema.columns 
            WHERE table_name = 'projects' AND column_name = 'archived'
        `);
        
        if (verify.rows.length > 0) {
            console.log('✅ Verificación exitosa:', verify.rows[0]);
        }
        
    } catch (error) {
        console.error('❌ Error al agregar columna archived:', error);
        throw error;
    }
}

async function main() {
    try {
        await addArchivedColumn();
        console.log('🚀 Migración completada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en la migración:', error);
        process.exit(1);
    }
}

main();