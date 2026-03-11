import { spawn } from 'child_process';
import fetch from 'node-fetch';

let serverProcess = null;
let clientProcess = null;

async function checkServer() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch('http://localhost:3000/api/auth/status', {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        return false;
    }
}

async function startServer() {
    console.log('🚀 Iniciando servidor backend...');
    
    serverProcess = spawn('npm', ['run', 'server'], {
        stdio: 'inherit',
        shell: true
    });

    serverProcess.on('error', (error) => {
        console.error('❌ Error al iniciar servidor:', error);
    });

    // Wait for server to be ready
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
        const isReady = await checkServer();
        if (isReady) {
            console.log('✅ Servidor backend listo en puerto 3000');
            return true;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
        
        if (attempts % 5 === 0) {
            console.log(`⏳ Esperando servidor... (${attempts}/${maxAttempts})`);
        }
    }
    
    console.log('❌ Timeout esperando servidor backend');
    return false;
}

async function startClient() {
    console.log('🎨 Iniciando cliente frontend...');
    
    clientProcess = spawn('npm', ['run', 'client'], {
        stdio: 'inherit',
        shell: true
    });

    clientProcess.on('error', (error) => {
        console.error('❌ Error al iniciar cliente:', error);
    });
}

async function main() {
    console.log('🔧 Iniciando aplicación Studio...\n');
    
    // Check if server is already running
    const serverRunning = await checkServer();
    
    if (serverRunning) {
        console.log('✅ Servidor backend ya está ejecutándose');
    } else {
        const serverStarted = await startServer();
        if (!serverStarted) {
            console.log('\n📋 Pasos para solucionar problemas de conexión:');
            console.log('1. Verifica que PostgreSQL esté ejecutándose');
            console.log('2. Verifica las variables de entorno en .env');
            console.log('3. Ejecuta las migraciones: npm run migrate');
            console.log('4. Intenta iniciar manualmente: npm run server');
            process.exit(1);
        }
    }
    
    // Start client
    await startClient();
    
    console.log('\n🌟 Aplicación iniciada correctamente!');
    console.log('📱 Frontend: http://localhost:5173');
    console.log('🔧 Backend: http://localhost:3000');
    console.log('\n💡 Presiona Ctrl+C para detener ambos servicios');
}

// Handle cleanup
process.on('SIGINT', () => {
    console.log('\n🛑 Deteniendo servicios...');
    
    if (serverProcess) {
        serverProcess.kill('SIGINT');
    }
    
    if (clientProcess) {
        clientProcess.kill('SIGINT');
    }
    
    setTimeout(() => {
        process.exit(0);
    }, 2000);
});

process.on('SIGTERM', () => {
    if (serverProcess) serverProcess.kill('SIGTERM');
    if (clientProcess) clientProcess.kill('SIGTERM');
    process.exit(0);
});

main().catch(error => {
    console.error('❌ Error al iniciar aplicación:', error);
    process.exit(1);
});