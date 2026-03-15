import express from 'express';
import crypto from 'crypto';
import db from '../database.js';

const router = express.Router();

// Instagram API configuration
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_WEBHOOK_VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;

// Webhook verification
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
      console.log('✅ Instagram webhook verified');
      res.status(200).send(challenge);
    } else {
      console.log('❌ Instagram webhook verification failed');
      res.sendStatus(403);
    }
  }
});

// Webhook handler
router.post('/webhook', async (req, res) => {
  const body = req.body;
  
  console.log('📱 Instagram webhook received:', JSON.stringify(body));

  if (body.object === 'instagram') {
    body.entry.forEach(async (entry) => {
      const messaging = entry.messaging;
      if (messaging) {
        messaging.forEach(async (messagingEvent) => {
          await handleInstagramMessage(messagingEvent);
        });
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Handle Instagram message
async function handleInstagramMessage(messagingEvent) {
  try {
    const senderId = messagingEvent.sender.id;
    const recipientId = messagingEvent.recipient?.id;
    const message = messagingEvent.message;

    // CRITICAL: Ignore echo messages (our own messages) - this is the primary filter
    if (message && (message.is_echo === true || message.is_echo === 'true')) {
      console.log('🔄 Ignoring echo message from bot');
      return;
    }

    if (message && message.text) {
      console.log(`📨 Message from ${senderId}:`, { text: message.text, is_echo: message.is_echo });

      // Get sender info
      const senderInfo = await getInstagramUserInfo(senderId);
      console.log('👤 Sender info:', senderInfo);

      await handleTextMessage(senderId, message.text, senderInfo);
    } else if (message && message.attachments) {
      const senderInfo = await getInstagramUserInfo(senderId);
      await handleAttachments(senderId, message.attachments, senderInfo);
    }
  } catch (error) {
    console.error('❌ Error handling Instagram message:', error);
  }
}

// Main text message handler
async function handleTextMessage(senderId, text, senderInfo) {
  try {
    console.log(`📨 Processing text: "${text}" from ${senderId}`);
    
    // Additional safety check - ignore very long messages that might be bot responses
    if (text.length > 500) {
      console.log('⚠️ Ignoring very long message (likely bot response)');
      return;
    }
    
    // Save user message first
    await saveInstagramMessageToDatabase(senderId, text, senderInfo);
    
    // Get conversation state
    const state = await getConversationState(senderId);
    console.log(`📊 Current state: ${state.current_state}`);
    
    // Route to appropriate handler
    switch (state.current_state) {
      case 'awaiting_name':
        await processNameInput(senderId, text, state);
        break;
      case 'awaiting_email':
        await processEmailInput(senderId, text, state);
        break;
      case 'awaiting_phone':
        await processPhoneInput(senderId, text, state);
        break;
      case 'awaiting_company':
        await processCompanyInput(senderId, text, state);
        break;
      case 'awaiting_consultation_id':
        await processConsultationInput(senderId, text, state);
        break;
      default:
        await processIdleInput(senderId, text, senderInfo);
    }
  } catch (error) {
    console.error('❌ Error in handleTextMessage:', error);
    await sendErrorMessage(senderId);
  }
}

// Process idle state (commands)
async function processIdleInput(senderId, text, senderInfo) {
  const lowerText = text.toLowerCase().trim();
  
  if (lowerText.includes('código') || lowerText.includes('codigo') || lowerText.includes('acceso')) {
    await sendInstagramMessage(senderId,
      `🎫 *GENERACIÓN DE CÓDIGO DE ACCESO*\n\n` +
      `Estimado/a cliente, procederemos a generar su código de acceso personalizado.\n\n` +
      `*BENEFICIOS:*\n` +
      `✅ Acceso exclusivo a su dashboard\n` +
      `✅ Seguimiento de proyectos en tiempo real\n` +
      `✅ Comunicación directa con nuestro equipo\n\n` +
      `*PRIMERA PREGUNTA:*\n` +
      `Por favor, indíquenos su *nombre completo* 👤`
    );
    await updateConversationState(senderId, 'awaiting_name', {});
  }
  else if (lowerText.includes('consulta') || lowerText.includes('estado') || lowerText.includes('seguimiento')) {
    await sendInstagramMessage(senderId,
      `🔍 *CONSULTA DE ESTADO*\n\n` +
      `Para consultar el estado de su proyecto o solicitud, necesito el ID único.\n\n` +
      `📋 Puede encontrar su ID en:\n` +
      `• Panel de usuario (dashboard)\n` +
      `• Email de confirmación\n\n` +
      `Por favor, envíe su ID de consulta:`
    );
    await updateConversationState(senderId, 'awaiting_consultation_id', {});
  }
  else if (lowerText.includes('hola') || lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('buenos') || lowerText.includes('buenas')) {
    await sendInstagramMessage(senderId,
      `¡Hola ${senderInfo.name || 'estimado/a cliente'}! 👋\n\n` +
      `Bienvenido/a a *Genswave*, su socio estratégico en transformación digital.\n\n` +
      `🚀 *NUESTROS SERVICIOS:*\n` +
      `🌐 Desarrollo Web Profesional\n` +
      `📱 Aplicaciones Móviles iOS/Android\n` +
      `💼 Consultoría Digital Empresarial\n` +
      `🎨 Diseño UI/UX Avanzado\n` +
      `⚙️ Automatización de Procesos\n\n` +
      `📋 *COMANDOS DISPONIBLES:*\n` +
      `• "código" - Generar acceso rápido al portal\n` +
      `• "consulta" - Verificar estado de proyectos/solicitudes\n` +
      `• "servicios" - Ver catálogo completo\n\n` +
      `💬 También puede escribir cualquier consulta y nuestro equipo le responderá personalmente.\n\n` +
      `¿En qué podemos asistirle hoy?`
    );
  }
  else {
    await sendInstagramMessage(senderId,
      `Gracias por contactar a **Genswave** 📨\n\n` +
      `Un especialista revisará su consulta y le responderá pronto.\n\n` +
      `**Opciones disponibles:**\n` +
      `🎫 Escriba **"código"** para acceso rápido\n` +
      `🌐 Visite: https://genswave.onrender.com\n\n` +
      `¡Valoramos su confianza!`
    );
  }
}

// Process name input
async function processNameInput(senderId, text, state) {
  const name = text.trim();
  
  if (name.length < 2) {
    await sendInstagramMessage(senderId,
      `⚠️ **Nombre muy corto**\n\n` +
      `Por favor, proporcione su nombre completo.\n\n` +
      `**Pregunta actual:**\n` +
      `Su **nombre completo** 👤`
    );
    return;
  }
  
  const newData = { name: name };
  await updateConversationState(senderId, 'awaiting_email', newData);
  
  await sendInstagramMessage(senderId,
    `✅ **Nombre registrado correctamente**\n\n` +
    `**Segunda pregunta:**\n` +
    `Indique su **dirección de correo electrónico** 📧\n\n` +
    `*Ejemplo: usuario@empresa.com*`
  );
}

// Process email input
async function processEmailInput(senderId, text, state) {
  const email = text.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  console.log(`📧 Validating email: "${email}"`);
  
  if (!emailRegex.test(email)) {
    console.log(`❌ Invalid email format`);
    await sendInstagramMessage(senderId,
      `⚠️ **Formato de email incorrecto**\n\n` +
      `Por favor, proporcione una dirección de correo electrónico válida.\n\n` +
      `**Formato esperado:** usuario@dominio.com\n\n` +
      `**Pregunta actual:**\n` +
      `Su **dirección de correo electrónico** 📧`
    );
    return;
  }
  
  console.log(`✅ Valid email format`);
  
  const newData = { ...state.collected_data, email: email };
  await updateConversationState(senderId, 'awaiting_phone', newData);
  
  await sendInstagramMessage(senderId,
    `✅ **Email registrado correctamente**\n\n` +
    `**Tercera pregunta:**\n` +
    `Indique su **número de teléfono** con código de país 📱\n\n` +
    `*Ejemplo: +1 234 567 8900*`
  );
}

// Process phone input
async function processPhoneInput(senderId, text, state) {
  const phone = text.trim();
  
  if (phone.length < 8) {
    await sendInstagramMessage(senderId,
      `⚠️ **Número de teléfono muy corto**\n\n` +
      `Por favor, proporcione un número de teléfono válido.\n\n` +
      `**Incluya el código de país si es posible**\n` +
      `*Ejemplo: +1 234 567 8900*\n\n` +
      `**Pregunta actual:**\n` +
      `Su **número de teléfono** 📱`
    );
    return;
  }
  
  const newData = { ...state.collected_data, phone: phone };
  await updateConversationState(senderId, 'awaiting_company', newData);
  
  await sendInstagramMessage(senderId,
    `✅ **Teléfono registrado correctamente**\n\n` +
    `**Última pregunta:**\n` +
    `¿Cuál es el nombre de su **empresa u organización**? 🏢\n\n` +
    `*Si es persona natural, puede indicar "Independiente"*`
  );
}

// Process company input and generate code
async function processCompanyInput(senderId, text, state) {
  const company = text.trim();
  
  if (company.length < 2) {
    await sendInstagramMessage(senderId,
      `⚠️ **Nombre de empresa muy corto**\n\n` +
      `Por favor, indique el nombre de su empresa o "Independiente".\n\n` +
      `**Pregunta actual:**\n` +
      `Nombre de su **empresa u organización** 🏢`
    );
    return;
  }
  
  try {
    // Generate code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    // Save to database
    await db.query(
      `INSERT INTO quick_codes (name, email, phone, company, code, expires_at, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        state.collected_data.name,
        state.collected_data.email,
        state.collected_data.phone,
        company,
        code,
        expiresAt,
        new Date()
      ]
    );
    
    // Reset state
    await updateConversationState(senderId, 'idle', {});
    
    // Send success message
    await sendInstagramMessage(senderId,
      `🎉 **CÓDIGO GENERADO EXITOSAMENTE**\n\n` +
      `**Datos registrados:**\n` +
      `👤 **Nombre:** ${state.collected_data.name}\n` +
      `📧 **Email:** ${state.collected_data.email}\n` +
      `📱 **Teléfono:** ${state.collected_data.phone}\n` +
      `🏢 **Empresa:** ${company}\n\n` +
      `🎫 **SU CÓDIGO:** \`${code}\`\n\n` +
      `**Instrucciones:**\n` +
      `1️⃣ Visite: https://genswave.onrender.com\n` +
      `2️⃣ Haga clic en "Código Rápido"\n` +
      `3️⃣ Ingrese el código: **${code}**\n\n` +
      `⏰ **Válido por 30 días**\n\n` +
      `¡Gracias por confiar en **Genswave**!`
    );
    
    console.log(`✅ Code generated: ${code} for ${state.collected_data.name}`);
    
  } catch (error) {
    console.error('❌ Error generating code:', error);
    await sendErrorMessage(senderId);
    await updateConversationState(senderId, 'idle', {});
  }
}

// Get conversation state
async function getConversationState(userId) {
  try {
    const result = await db.query(
      'SELECT * FROM conversation_states WHERE instagram_user_id = $1',
      [userId]
    );
    
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    
    // Create new state
    const newState = await db.query(
      `INSERT INTO conversation_states (instagram_user_id, current_state, collected_data) 
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, 'idle', '{}']
    );
    
    return newState.rows[0];
  } catch (error) {
    console.error('❌ Error getting state:', error);
    return { current_state: 'idle', collected_data: {} };
  }
}

// Update conversation state
async function updateConversationState(userId, newState, collectedData) {
  try {
    console.log(`🔄 Updating ${userId} to ${newState}:`, collectedData);
    
    await db.query(
      `INSERT INTO conversation_states (instagram_user_id, current_state, collected_data) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (instagram_user_id) 
       DO UPDATE SET current_state = $2, collected_data = $3, updated_at = CURRENT_TIMESTAMP`,
      [userId, newState, JSON.stringify(collectedData)]
    );
    
    console.log(`✅ State updated successfully`);
  } catch (error) {
    console.error('❌ Error updating state:', error);
  }
}

// Send Instagram message
async function sendInstagramMessage(recipientId, messageText) {
  try {
    if (!INSTAGRAM_ACCESS_TOKEN) {
      console.log('⚠️ Instagram access token not configured');
      return false;
    }

    const response = await fetch(`https://graph.instagram.com/v18.0/me/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${INSTAGRAM_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: messageText }
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Instagram message sent successfully:', result);
      await saveBotResponseToDatabase(recipientId, messageText);
      return true;
    } else {
      const error = await response.text();
      console.log('❌ Failed to send Instagram message:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending Instagram message:', error);
    return false;
  }
}

// Send error message
async function sendErrorMessage(senderId) {
  await sendInstagramMessage(senderId,
    `❌ **ERROR TÉCNICO**\n\n` +
    `Disculpe, ocurrió un error en nuestro sistema.\n\n` +
    `Por favor, escriba "código" para reiniciar.\n\n` +
    `Si persiste, contacte a nuestro equipo.`
  );
}

// Get Instagram user info
async function getInstagramUserInfo(userId) {
  try {
    if (!INSTAGRAM_ACCESS_TOKEN) {
      return { id: userId, name: 'Usuario' };
    }

    const response = await fetch(
      `https://graph.instagram.com/v18.0/${userId}?fields=id,name,username,profile_pic&access_token=${INSTAGRAM_ACCESS_TOKEN}`
    );
    
    if (response.ok) {
      const userInfo = await response.json();
      console.log('👤 Instagram user info retrieved:', userInfo);
      return userInfo;
    } else {
      console.log('⚠️ Could not retrieve Instagram user info');
      return { id: userId, name: 'Usuario' };
    }
  } catch (error) {
    console.error('❌ Error getting Instagram user info:', error);
    return { id: userId, name: 'Usuario' };
  }
}

// Save user message to database
async function saveInstagramMessageToDatabase(senderId, messageText, senderInfo) {
  try {
    const query = `
      INSERT INTO instagram_messages (
        instagram_user_id, instagram_username, sender_name, message_text,
        message_type, is_from_user, is_read, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    await db.query(query, [
      senderId,
      senderInfo.username || null,
      senderInfo.name || 'Usuario de Instagram',
      messageText,
      'text',
      true,
      false,
      new Date()
    ]);
    
    console.log('💾 User message saved to database');
  } catch (error) {
    console.error('❌ Error saving user message:', error);
  }
}

// Save bot response to database
async function saveBotResponseToDatabase(recipientId, messageText) {
  try {
    const query = `
      INSERT INTO instagram_messages (
        instagram_user_id, instagram_username, sender_name, message_text,
        message_type, is_from_user, is_read, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    await db.query(query, [
      recipientId,
      null,
      'Genswave Bot',
      messageText,
      'text',
      false,
      true,
      new Date()
    ]);
    
    console.log('💾 Bot response saved to database');
  } catch (error) {
    console.error('❌ Error saving bot response:', error);
  }
}

// Process consultation ID input
async function processConsultationInput(senderId, text, state) {
  const consultationId = text.trim().toUpperCase();
  
  if (consultationId.length < 3) {
    await sendInstagramMessage(senderId,
      `⚠️ ID muy corto\n\n` +
      `Por favor, proporcione un ID válido.\n\n` +
      `Formato esperado: P123ABC (proyectos) o S123ABC (solicitudes)\n\n` +
      `Pregunta actual:\n` +
      `Su ID de consulta:`
    );
    return;
  }
  
  try {
    let result = null;
    let type = '';
    
    // Check if it's a project (starts with P)
    if (consultationId.startsWith('P')) {
      const projectResult = await db.query(
        'SELECT * FROM projects WHERE unique_id = $1',
        [consultationId]
      );
      if (projectResult.rows.length > 0) {
        result = projectResult.rows[0];
        type = 'project';
      }
    }
    // Check if it's an appointment/solicitud (starts with S)
    else if (consultationId.startsWith('S')) {
      const appointmentResult = await db.query(
        'SELECT * FROM appointments WHERE unique_id = $1',
        [consultationId]
      );
      if (appointmentResult.rows.length > 0) {
        result = appointmentResult.rows[0];
        type = 'appointment';
      }
    }
    // Try both tables if no prefix
    else {
      const projectResult = await db.query(
        'SELECT * FROM projects WHERE unique_id = $1',
        [consultationId]
      );
      if (projectResult.rows.length > 0) {
        result = projectResult.rows[0];
        type = 'project';
      } else {
        const appointmentResult = await db.query(
          'SELECT * FROM appointments WHERE unique_id = $1',
          [consultationId]
        );
        if (appointmentResult.rows.length > 0) {
          result = appointmentResult.rows[0];
          type = 'appointment';
        }
      }
    }
    
    if (!result) {
      await sendInstagramMessage(senderId,
        `❌ *ID NO ENCONTRADO*\n\n` +
        `No se encontró ningún proyecto o solicitud con el ID: ${consultationId}\n\n` +
        `Verifique que:\n` +
        `• El ID esté escrito correctamente\n` +
        `• Sea un ID válido de Genswave\n\n` +
        `Para nueva consulta, escriba "consulta"`
      );
    } else if (type === 'project') {
      // Format project status
      const statusEmoji = {
        'active': '🟢',
        'completed': '✅',
        'paused': '⏸️',
        'cancelled': '❌'
      };
      
      const startDate = result.start_date ? new Date(result.start_date).toLocaleDateString('es-ES') : 'No definida';
      const endDate = result.end_date ? new Date(result.end_date).toLocaleDateString('es-ES') : 'No definida';
      const budget = result.budget ? `$${parseFloat(result.budget).toLocaleString()}` : 'No definido';
      
      await sendInstagramMessage(senderId,
        `📊 *ESTADO DEL PROYECTO*\n\n` +
        `🆔 ID: ${result.unique_id}\n` +
        `📋 Título: ${result.title}\n` +
        `${statusEmoji[result.status] || '⚪'} Estado: ${result.status.toUpperCase()}\n` +
        `📈 Progreso: ${result.progress}%\n\n` +
        `📅 Fecha inicio: ${startDate}\n` +
        `📅 Fecha fin: ${endDate}\n` +
        `💰 Presupuesto: ${budget}\n\n` +
        `📝 Descripción:\n${result.description || 'Sin descripción'}\n\n` +
        `Para más detalles, visite su dashboard en:\nhttps://genswave.onrender.com`
      );
    } else if (type === 'appointment') {
      // Format appointment status
      const statusEmoji = {
        'pending': '⏳',
        'approved': '✅',
        'rejected': '❌',
        'completed': '🎉'
      };
      
      const preferredDate = new Date(result.preferred_date).toLocaleDateString('es-ES');
      const createdDate = new Date(result.created_at).toLocaleDateString('es-ES');
      
      await sendInstagramMessage(senderId,
        `📋 *ESTADO DE SOLICITUD*\n\n` +
        `🆔 ID: ${result.unique_id}\n` +
        `👤 Cliente: ${result.name}\n` +
        `${statusEmoji[result.status] || '⚪'} Estado: ${result.status.toUpperCase()}\n\n` +
        `🛠️ Servicio: ${result.service}\n` +
        `🏢 Empresa: ${result.business_name || 'No especificada'}\n` +
        `📅 Fecha preferida: ${preferredDate}\n` +
        `📅 Solicitud creada: ${createdDate}\n\n` +
        `📝 Mensaje:\n${result.message || 'Sin mensaje'}\n\n` +
        `${result.admin_notes ? `📋 Notas del equipo:\n${result.admin_notes}\n\n` : ''}` +
        `Para más detalles, visite su dashboard en:\nhttps://genswave.onrender.com`
      );
    }
    
    // Reset state
    await updateConversationState(senderId, 'idle', {});
    
  } catch (error) {
    console.error('❌ Error processing consultation:', error);
    await sendErrorMessage(senderId);
    await updateConversationState(senderId, 'idle', {});
  }
}

// Handle attachments
async function handleAttachments(senderId, attachments, senderInfo) {
  await saveInstagramMessageToDatabase(senderId, '[Archivo adjunto]', senderInfo);
  
  await sendInstagramMessage(senderId,
    `📎 **ARCHIVO RECIBIDO**\n\n` +
    `Hemos recibido su archivo correctamente.\n\n` +
    `Un especialista lo revisará y le responderá pronto.\n\n` +
    `🎫 Escriba "código" para generar acceso rápido\n\n` +
    `Gracias por contactar a **Genswave**.`
  );
}

// API endpoints
router.get('/conversations', async (req, res) => {
  try {
    const query = `
      SELECT 
        instagram_user_id,
        COALESCE(instagram_username, 'Sin username') as instagram_username,
        COALESCE(sender_name, 'Usuario de Instagram') as sender_name,
        (
          SELECT message_text 
          FROM instagram_messages im2 
          WHERE im2.instagram_user_id = im.instagram_user_id 
          ORDER BY created_at DESC 
          LIMIT 1
        ) as last_message,
        MAX(created_at) as last_message_time,
        SUM(CASE WHEN is_from_user = true AND is_read = false THEN 1 ELSE 0 END) as unread_count
      FROM instagram_messages im
      GROUP BY instagram_user_id, instagram_username, sender_name
      ORDER BY last_message_time DESC
    `;

    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching conversations:', error);
    res.status(500).json({ error: 'Error al cargar conversaciones' });
  }
});

router.get('/messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await db.query(`
      SELECT * FROM instagram_messages 
      WHERE instagram_user_id = $1 
      ORDER BY created_at ASC
    `, [userId]);
    
    await db.query(
      'UPDATE instagram_messages SET is_read = true WHERE instagram_user_id = $1 AND is_from_user = true',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: 'Error al cargar mensajes' });
  }
});

router.post('/send-message', async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    
    if (!recipientId || !message) {
      return res.status(400).json({ error: 'recipientId y message son requeridos' });
    }

    const success = await sendInstagramMessage(recipientId, message);
    
    if (success) {
      res.json({ success: true, message: 'Mensaje enviado correctamente' });
    } else {
      res.status(500).json({ error: 'Error al enviar mensaje' });
    }
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

router.post('/reset-conversation', async (req, res) => {
  try {
    const { instagramUserId } = req.body;
    
    if (!instagramUserId) {
      return res.status(400).json({ error: 'instagramUserId es requerido' });
    }

    await updateConversationState(instagramUserId, 'idle', {});
    
    await sendInstagramMessage(instagramUserId,
      `🔄 **CONVERSACIÓN REINICIADA**\n\n` +
      `Su conversación ha sido reiniciada.\n\n` +
      `🎫 Escriba "código" para generar acceso\n` +
      `🆘 Escriba "ayuda" para ver opciones\n\n` +
      `¿En qué podemos asistirle?`
    );

    res.json({ success: true, message: 'Conversación reiniciada' });
  } catch (error) {
    console.error('❌ Error resetting conversation:', error);
    res.status(500).json({ error: 'Error al reiniciar conversación' });
  }
});

export default router;