import { spawn } from 'child_process';
import db from './database.js';

function runCommand(command, args = []) {
    return new Promise((resolve, reject) => {
        console.log(`🔧 Ejecutando: ${command} ${args.join(' ')}`);
        
        const process = spawn(command, args, {
            stdio: 'inherit',
            shell: true
        });

        process.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Comando falló con código ${code}`));
            }
        });

        process.on('error', (error) => {
            reject(error);
        });
    });
}

async function checkDatabase() {
    try {
        console.log('🔍 Verificando conexión a la base de datos...');
        await db.query('SELECT 1');
        console.log('✅ Conexión a la base de datos exitosa');
        return true;
    } catch (error) {
        console.log('❌ Error de conexión a la base de datos:', error.message);
        return false;
    }
}

async function fixMessagesTable() {
    try {
        console.log('🔧 Arreglando tabla de mensajes...');
        
        // Check if attachments column exists and remove it
        const columnCheck = await db.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'messages' AND column_name = 'attachments'
        `);
        
        if (columnCheck.rows.length > 0) {
            await db.query('ALTER TABLE messages DROP COLUMN attachments');
            console.log('✅ Columna attachments eliminada');
        }
        
        return true;
    } catch (error) {
        console.log('⚠️  Error arreglando tabla de mensajes:', error.message);
        return false;
    }
}

async function runMigrations() {
    try {
        console.log('📊 Ejecutando migraciones...');
        
        // Run the migration SQL
        const fs = await import('fs');
        const sql = fs.readFileSync('./migrate-final-features.sql', 'utf8');
        await db.query(sql);
        
        console.log('✅ Migraciones completadas');
        return true;
    } catch (error) {
        console.log('⚠️  Error en migraciones:', error.message);
        return false;
    }
}

async function main() {
    console.log('🚀 Configuración completa de Studio...\n');
    
    try {
        // Step 1: Check database connection
        const dbConnected = await checkDatabase();
        if (!dbConnected) {
            console.log('\n📋 Para solucionar problemas de base de datos:');
            console.log('1. Asegúrate de que PostgreSQL esté ejecutándose');
            console.log('2. Verifica las credenciales en el archivo .env');
            console.log('3. Crea la base de datos si no existe');
            return;
        }
        
        // Step 2: Initialize database
        console.log('\n🏗️  Inicializando base de datos...');
        await db.initialize();
        
        // Step 3: Fix messages table
        await fixMessagesTable();
        
        // Step 4: Run migrations
        await runMigrations();
        
        console.log('\n🎉 Configuración completada exitosamente!');
        console.log('\n📱 Para iniciar la aplicación:');
        console.log('   npm run dev');
        console.log('\n🔧 Comandos útiles:');
        console.log('   npm run check-server  - Verificar estado del servidor');
        console.log('   npm run server        - Solo backend');
        console.log('   npm run client        - Solo frontend');
        
    } catch (error) {
        console.error('❌ Error durante la configuración:', error.message);
        console.log('\n🔧 Intenta ejecutar paso a paso:');
        console.log('1. npm run fix-messages');
        console.log('2. npm run migrate');
        console.log('3. npm run dev');
    }
}

main();