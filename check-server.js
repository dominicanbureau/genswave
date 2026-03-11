import fetch from 'node-fetch';

async function checkServer() {
    try {
        console.log('🔍 Verificando servidor backend...');
        
        const response = await fetch('http://localhost:3000/api/auth/status', {
            method: 'GET',
            signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
            console.log('✅ Servidor backend funcionando correctamente en puerto 3000');
        } else {
            console.log('⚠️  Servidor responde pero con error:', response.status);
        }
    } catch (error) {
        console.log('❌ Error de conexión al servidor backend:');
        console.log('   - Asegúrate de que el servidor esté ejecutándose en puerto 3000');
        console.log('   - Ejecuta: npm run server');
        console.log('   - O verifica la configuración de la base de datos');
        console.log('\n📋 Pasos para solucionar:');
        console.log('   1. Verifica que PostgreSQL esté ejecutándose');
        console.log('   2. Verifica las variables de entorno en .env');
        console.log('   3. Ejecuta las migraciones: node migrate-final-features.js');
        console.log('   4. Inicia el servidor: npm run server');
        console.log('   5. O usa el script mejorado: npm run dev');
    }
}

checkServer();