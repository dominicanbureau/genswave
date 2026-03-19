import db from './database.js';
import dotenv from 'dotenv';

dotenv.config();

async function diagnoseIssues() {
  console.log('🔍 DIAGNÓSTICO DE PROBLEMAS\n');
  console.log('=' .repeat(50));

  // 1. Check Admin Login
  console.log('\n1. 👤 VERIFICANDO LOGIN DE ADMIN');
  console.log('-'.repeat(30));
  
  try {
    const adminUsers = await db.query('SELECT email, role FROM users WHERE role = $1', ['admin']);
    if (adminUsers.rows.length > 0) {
      console.log('✅ Usuario admin encontrado:');
      adminUsers.rows.forEach(user => {
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🔑 Role: ${user.role}`);
      });
      console.log('\n💡 Credenciales por defecto:');
      console.log(`   📧 Email: ${process.env.ADMIN_EMAIL || 'admin@studio.com'}`);
      console.log(`   🔐 Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    } else {
      console.log('❌ No se encontró usuario admin');
      console.log('💡 Ejecuta: node migrate.js para crear el usuario admin');
    }
  } catch (error) {
    console.log('❌ Error verificando admin:', error.message);
  }

  // 2. Check Instagram Messages
  console.log('\n2. 📱 VERIFICANDO MENSAJES DE INSTAGRAM');
  console.log('-'.repeat(30));
  
  try {
    const messageCount = await db.query('SELECT COUNT(*) FROM instagram_messages');
    console.log(`📊 Total mensajes: ${messageCount.rows[0].count}`);
    
    const userMessages = await db.query('SELECT COUNT(*) FROM instagram_messages WHERE is_from_user = true');
    console.log(`👤 Mensajes de usuarios: ${userMessages.rows[0].count}`);
    
    const botMessages = await db.query('SELECT COUNT(*) FROM instagram_messages WHERE is_from_user = false');
    console.log(`🤖 Mensajes del bot: ${botMessages.rows[0].count}`);
    
    if (parseInt(messageCount.rows[0].count) > 0) {
      console.log('\n📋 Últimos 3 mensajes:');
      const recentMessages = await db.query(`
        SELECT sender_name, message_text, is_from_user, created_at 
        FROM instagram_messages 
        ORDER BY created_at DESC 
        LIMIT 3
      `);
      
      recentMessages.rows.forEach((msg, index) => {
        const type = msg.is_from_user ? '👤 Usuario' : '🤖 Bot';
        const time = new Date(msg.created_at).toLocaleString('es-ES');
        console.log(`   ${index + 1}. ${type}: ${msg.sender_name}`);
        console.log(`      💬 "${msg.message_text.substring(0, 50)}..."`);
        console.log(`      ⏰ ${time}\n`);
      });
    } else {
      console.log('ℹ️  No hay mensajes de Instagram aún');
    }
  } catch (error) {
    console.log('❌ Error verificando mensajes:', error.message);
  }

  // 3. Check Instagram Environment Variables
  console.log('\n3. 🔧 VERIFICANDO VARIABLES DE ENTORNO DE INSTAGRAM');
  console.log('-'.repeat(30));
  
  const instagramVars = [
    'INSTAGRAM_APP_ID',
    'INSTAGRAM_APP_SECRET',
    'INSTAGRAM_ACCESS_TOKEN',
    'INSTAGRAM_WEBHOOK_VERIFY_TOKEN'
  ];

  let missingVars = [];
  instagramVars.forEach(varName => {
    if (process.env[varName]) {
      const value = process.env[varName];
      const masked = value.substring(0, 8) + '...' + value.substring(value.length - 4);
      console.log(`✅ ${varName}: ${masked}`);
    } else {
      console.log(`❌ ${varName}: NO CONFIGURADA`);
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.log('\n⚠️  Variables faltantes:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n💡 Para configurar en Render:');
    console.log('   1. Ve a tu dashboard de Render');
    console.log('   2. Selecciona tu servicio');
    console.log('   3. Ve a "Environment"');
    console.log('   4. Agrega las variables faltantes');
  }

  // 4. Test Instagram API Endpoints
  console.log('\n4. 🌐 PROBANDO ENDPOINTS DE INSTAGRAM');
  console.log('-'.repeat(30));
  
  try {
    console.log('🔄 Probando /api/instagram/conversations...');
    const conversationsResponse = await fetch('https://genswave.org/api/instagram/conversations');
    if (conversationsResponse.ok) {
      const conversations = await conversationsResponse.json();
      console.log(`✅ Endpoint funciona - ${conversations.length} conversaciones`);
    } else {
      console.log(`❌ Endpoint falló - Status: ${conversationsResponse.status}`);
    }
  } catch (error) {
    console.log('❌ Error probando endpoint:', error.message);
  }

  // 5. Check Instagram Conversations
  console.log('\n5. 💬 VERIFICANDO CONVERSACIONES DE INSTAGRAM');
  console.log('-'.repeat(30));
  
  try {
    const conversationsQuery = `
      SELECT 
        instagram_user_id,
        COALESCE(sender_name, 'Usuario de Instagram') as sender_name,
        COUNT(*) as message_count,
        MAX(created_at) as last_message_time,
        SUM(CASE WHEN is_from_user = true AND is_read = false THEN 1 ELSE 0 END) as unread_count
      FROM instagram_messages 
      GROUP BY instagram_user_id, sender_name
      ORDER BY last_message_time DESC
      LIMIT 5
    `;
    
    const conversations = await db.query(conversationsQuery);
    
    if (conversations.rows.length > 0) {
      console.log(`📊 ${conversations.rows.length} conversaciones encontradas:`);
      conversations.rows.forEach((conv, index) => {
        console.log(`   ${index + 1}. ${conv.sender_name}`);
        console.log(`      📱 ID: ${conv.instagram_user_id}`);
        console.log(`      💬 Mensajes: ${conv.message_count}`);
        console.log(`      🔔 No leídos: ${conv.unread_count}`);
        console.log(`      ⏰ Último: ${new Date(conv.last_message_time).toLocaleString('es-ES')}\n`);
      });
    } else {
      console.log('ℹ️  No hay conversaciones de Instagram');
      console.log('💡 Esto es normal si no has recibido mensajes aún');
    }
  } catch (error) {
    console.log('❌ Error verificando conversaciones:', error.message);
  }

  // 6. Summary and Recommendations
  console.log('\n6. 📋 RESUMEN Y RECOMENDACIONES');
  console.log('-'.repeat(30));
  
  console.log('\n🔧 PROBLEMAS IDENTIFICADOS:');
  
  if (missingVars.length > 0) {
    console.log('❌ Variables de Instagram no configuradas');
    console.log('   → Configura las variables en Render para activar Instagram');
  }
  
  console.log('\n✅ SOLUCIONES:');
  console.log('1. 👤 Para login de admin:');
  console.log('   → Usa: admin@studio.com / admin123');
  console.log('   → Si no funciona, ejecuta: node migrate.js');
  
  console.log('\n2. 📱 Para mensajes de Instagram:');
  console.log('   → Los mensajes ahora se guardan correctamente');
  console.log('   → Escribe al Instagram para probar');
  console.log('   → Ve al panel admin → Chats → Instagram');
  
  console.log('\n3. 🔗 Para conexión de Instagram:');
  console.log('   → La URL de Facebook es CORRECTA (Instagram Business usa Facebook OAuth)');
  console.log('   → Configura las variables de entorno primero');
  console.log('   → Luego usa el botón "Conectar Instagram"');
  
  console.log('\n4. 🎫 Para códigos rápidos:');
  console.log('   → Escribe "código" en Instagram');
  console.log('   → Sigue el formato: DATOS: Nombre | Email | Teléfono | Empresa');
  console.log('   → El código se genera automáticamente');

  console.log('\n' + '='.repeat(50));
  console.log('🎯 PRÓXIMOS PASOS:');
  console.log('1. Configura las variables de Instagram en Render');
  console.log('2. Prueba el login con admin@studio.com / admin123');
  console.log('3. Envía un mensaje a tu Instagram para probar');
  console.log('4. Ve al panel admin para ver las conversaciones');
  console.log('=' .repeat(50));

  process.exit(0);
}

// Run diagnosis
diagnoseIssues().catch(console.error);