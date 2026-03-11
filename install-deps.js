import { spawn } from 'child_process';
import { existsSync } from 'fs';

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

async function main() {
    try {
        console.log('📦 Instalando dependencias de Studio...\n');

        // Check if node_modules exists
        if (!existsSync('node_modules')) {
            console.log('📥 Instalando dependencias principales...');
            await runCommand('npm', ['install']);
        } else {
            console.log('✅ Dependencias principales ya instaladas');
        }

        // Install additional dependencies that might be missing
        console.log('\n📥 Instalando dependencias adicionales...');
        
        const additionalDeps = [
            'node-fetch@3.3.2'
        ];

        for (const dep of additionalDeps) {
            try {
                await runCommand('npm', ['install', dep]);
                console.log(`✅ ${dep} instalado correctamente`);
            } catch (error) {
                console.log(`⚠️  Error instalando ${dep}:`, error.message);
            }
        }

        console.log('\n🎉 Instalación completada!');
        console.log('\n📋 Próximos pasos:');
        console.log('1. Configura tu base de datos PostgreSQL');
        console.log('2. Crea el archivo .env con tus credenciales');
        console.log('3. Ejecuta las migraciones: npm run migrate');
        console.log('4. Inicia la aplicación: npm run dev');

    } catch (error) {
        console.error('❌ Error durante la instalación:', error.message);
        console.log('\n🔧 Intenta ejecutar manualmente:');
        console.log('npm install');
        process.exit(1);
    }
}

main();