import express from 'express';
import crypto from 'crypto';
import db from '../database.js';

const router = express.Router();

// Instagram API configuration
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_WEBHOOK_VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;

// Status endpoint to check if Instagram is configured
router.get('/status', (req, res) => {
  const configured = !!(INSTAGRAM_APP_ID && INSTAGRAM_APP_SECRET && INSTAGRAM_ACCESS_TOKEN && INSTAGRAM_WEBHOOK_VERIFY_TOKEN);
  res.json({ 
    configured,
    hasAppId: !!INSTAGRAM_APP_ID,
    hasAppSecret: !!INSTAGRAM_APP_SECRET,
    hasAccessToken: !!INSTAGRAM_ACCESS_TOKEN,
    hasWebhookToken: !!INSTAGRAM_WEBHOOK_VERIFY_TOKEN
  });
});

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
        messaging.forEach(handleInstagramMessage);
      }
    });
  }

  res.status(200).send('EVENT_RECEIVED');
});
// Handle Instagram message
async function handleInstagramMessage(messagingEvent) {
  try {
    const senderId = messagingEvent.sender.id;
    const recipientId = messagingEvent.recipient?.id;
    const message = messagingEvent.message;

    console.log('📱 Raw messaging event:', JSON.stringify(messagingEvent, null, 2));

    // CRITICAL: Ignore echo messages (our own messages) - this is the primary filter
    if (message && (message.is_echo === true || message.is_echo === 'true')) {
      console.log('🔄 Ignoring echo message from bot');
      return;
    }

    // Additional check: ignore if sender is the same as recipient (page talking to itself)
    if (senderId === recipientId) {
      console.log('🔄 Ignoring message from our own page');
      return;
    }

    if (message && message.text) {
      console.log(`📨 Message from ${senderId} to ${recipientId}:`, { text: message.text, is_echo: message.is_echo });

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
    
    // Check if bot is enabled for this user
    const botSettings = await getBotUserSettings(senderId);
    if (!botSettings.bot_enabled) {
      console.log(`🔇 Bot disabled for user ${senderId}, ignoring message`);
      return;
    }
    
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
    
    // Check for "salir" command to cancel any process
    if (text.toLowerCase().trim() === 'salir' && state.current_state !== 'idle') {
      await sendInstagramMessage(senderId,
        `❌ *PROCESO CANCELADO*\n\n` +
        `Has cancelado el proceso actual.\n\n` +
        `📋 *COMANDOS DISPONIBLES:*\n` +
        `• "código" - Generar acceso rápido al portal\n` +
        `• "consulta" - Verificar estado de proyectos/solicitudes\n` +
        `• "hola" - Ver menú principal\n\n` +
        `¿En qué podemos asistirle?`
      );
      await updateConversationState(senderId, 'idle', {});
      return;
    }
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
        // Handle general commands
        const lowerText = text.toLowerCase().trim();
        
        if (lowerText.includes('hola') || lowerText.includes('hello') || lowerText.includes('hi')) {
          await sendInstagramMessage(senderId,
            `¡Hola! 👋 Bienvenido/a a *Genswave*\n\n` +
            `Somos especialistas en desarrollo de software y soluciones tecnológicas.\n\n` +
            `*NUESTROS SERVICIOS:*\n` +
            `🌐 Desarrollo web profesional\n` +
            `📱 Aplicaciones móviles\n` +
            `🤖 Automatización de procesos\n` +
            `☁️ Soluciones en la nube\n` +
            `🛡️ Ciberseguridad\n\n` +
            `*¿CÓMO PODEMOS AYUDARTE?*\n` +
            `🎫 Escriba "código" para generar acceso rápido\n` +
            `📋 Escriba "consulta" para verificar estado de proyectos\n` +
            `🆘 Escriba "ayuda" para ver más opciones\n\n` +
            `¡Estamos aquí para impulsar tu negocio! 🚀`
          );
        } else if (lowerText.includes('código') || lowerText.includes('codigo') || lowerText.includes('acceso')) {
          await sendInstagramMessage(senderId,
            `🎫 *GENERACIÓN DE CÓDIGO DE ACCESO*\n\n` +
            `Estimado/a cliente, procederemos a generar su código de acceso rápido, para cancelar escriba "salir".\n\n` +
            `*BENEFICIOS:*\n` +
            `✅ Acceso exclusivo a su dashboard\n` +
            `✅ Seguimiento de proyectos en tiempo real\n` +
            `✅ Comunicación directa con nuestro equipo\n\n` +
            `*PRIMERA PREGUNTA:*\n\n` +
            `¿Cuál es su *nombre completo*? 👤`
          );
          await updateConversationState(senderId, 'awaiting_name', {});
        } else if (lowerText.includes('consulta') || lowerText.includes('estado') || lowerText.includes('proyecto')) {
          await sendInstagramMessage(senderId,
            `🔍 *CONSULTA DE ESTADO*\n\n` +
            `Para verificar el estado de su proyecto o solicitud, necesito su ID único.\n\n` +
            `*FORMATO DE ID:*\n` +
            `• P123456 (Proyectos)\n` +
            `• S123456 (Solicitudes)\n\n` +
            `Por favor, ingrese su ID de consulta:`
          );
          await updateConversationState(senderId, 'awaiting_consultation_id', {});
        } else if (lowerText.includes('ayuda') || lowerText.includes('help') || lowerText.includes('comandos')) {
          await sendInstagramMessage(senderId,
            `🆘 *MENÚ DE AYUDA*\n\n` +
            `*COMANDOS DISPONIBLES:*\n\n` +
            `🎫 *"código"* - Generar acceso rápido al portal\n` +
            `📋 *"consulta"* - Verificar estado de proyectos/solicitudes\n` +
            `👋 *"hola"* - Ver mensaje de bienvenida\n` +
            `❌ *"salir"* - Cancelar proceso actual\n\n` +
            `*SERVICIOS:*\n` +
            `🌐 Desarrollo web y aplicaciones\n` +
            `🤖 Automatización de procesos\n` +
            `☁️ Soluciones en la nube\n` +
            `🛡️ Ciberseguridad\n\n` +
            `*CONTACTO DIRECTO:*\n` +
            `📧 info@genswave.com\n` +
            `🌐 https://genswave.onrender.com\n\n` +
            `¿En qué más podemos asistirle?`
          );
        } else {
          await sendInstagramMessage(senderId,
            `Gracias por su mensaje. 📝\n\n` +
            `Hemos recibido su consulta y nuestro equipo la revisará pronto.\n\n` +
            `*MIENTRAS TANTO:*\n` +
            `🎫 Escriba "código" para generar acceso rápido\n` +
            `📋 Escriba "consulta" para verificar estado\n` +
            `🆘 Escriba "ayuda" para ver opciones\n\n` +
            `¡Gracias por contactar a *Genswave*! 🚀`
          );
        }
        break;
    }
  } catch (error) {
    console.error('❌ Error handling text message:', error);
    await sendErrorMessage(senderId);
  }
}
// Process name input
async function processNameInput(senderId, text, state) {
  const name = text.trim();
  
  if (name.length < 2) {
    await sendInstagramMessage(senderId,
      `⚠️ *Nombre muy corto*\n\n` +
      `Por favor, ingrese su nombre completo.\n\n` +
      `*Pregunta actual:*\n` +
      `Su *nombre completo* 👤`
    );
    return;
  }
  
  const newData = { name: name };
  await updateConversationState(senderId, 'awaiting_email', newData);
  
  await sendInstagramMessage(senderId,
    `✅ *Nombre registrado correctamente*\n\n` +
    `👤 *Nombre:* ${name}\n\n` +
    `*SEGUNDA PREGUNTA:*\n\n` +
    `¿Cuál es su *dirección de correo electrónico*? 📧`
  );
}

// Process email input
async function processEmailInput(senderId, text, state) {
  const email = text.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    await sendInstagramMessage(senderId,
      `⚠️ *Email inválido*\n\n` +
      `Por favor, ingrese un email válido.\n\n` +
      `*Ejemplo:* usuario@empresa.com\n\n` +
      `*Pregunta actual:*\n` +
      `Su *dirección de correo electrónico* 📧`
    );
    return;
  }
  
  const newData = { ...state.collected_data, email: email };
  await updateConversationState(senderId, 'awaiting_phone', newData);
  
  await sendInstagramMessage(senderId,
    `✅ *Email registrado correctamente*\n\n` +
    `📧 *Email:* ${email}\n\n` +
    `*TERCERA PREGUNTA:*\n\n` +
    `¿Cuál es su *número de teléfono*? 📱\n\n` +
    `*Incluya el código de país si es posible*\n` +
    `*Ejemplo: +1 234 567 8900*`
  );
}
// Process phone input
async function processPhoneInput(senderId, text, state) {
  const phone = text.trim();
  
  if (phone.length < 8) {
    await sendInstagramMessage(senderId,
      `⚠️ *Número de teléfono muy corto*\n\n` +
      `Por favor, ingrese un número válido.\n\n` +
      `*Incluya el código de país si es posible*\n` +
      `*Ejemplo: +1 234 567 8900*\n\n` +
      `*Pregunta actual:*\n` +
      `Su *número de teléfono* 📱`
    );
    return;
  }
  
  const newData = { ...state.collected_data, phone: phone };
  await updateConversationState(senderId, 'awaiting_company', newData);
  
  await sendInstagramMessage(senderId,
    `✅ *Teléfono registrado correctamente*\n\n` +
    `📱 *Teléfono:* ${phone}\n\n` +
    `*ÚLTIMA PREGUNTA:*\n\n` +
    `¿Cuál es el nombre de su *empresa u organización*? 🏢\n\n` +
    `*Si es persona natural, puede indicar "Independiente"*`
  );
}

// Process company input
async function processCompanyInput(senderId, text, state) {
  const company = text.trim();
  
  if (company.length < 2) {
    await sendInstagramMessage(senderId,
      `⚠️ *Nombre de empresa muy corto*\n\n` +
      `Por favor, indique el nombre de su empresa o "Independiente".\n\n` +
      `*Pregunta actual:*\n` +
      `Nombre de su *empresa u organización* 🏢`
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
      `🎉 *CÓDIGO GENERADO EXITOSAMENTE*\n\n` +
      `*RESUMEN DE SUS DATOS:*\n` +
      `👤 *Nombre:* ${state.collected_data.name}\n` +
      `📧 *Email:* ${state.collected_data.email}\n` +
      `📱 *Teléfono:* ${state.collected_data.phone}\n` +
      `🏢 *Empresa:* ${company}\n\n` +
      `🎫 *SU CÓDIGO:* ${code}\n\n` +
      `*INSTRUCCIONES:*\n` +
      `1️⃣ Visite: https://genswave.onrender.com\n` +
      `2️⃣ Haga clic en "Acceso Rápido"\n` +
      `3️⃣ Ingrese su código: ${code}\n\n` +
      `*Válido por 30 días*\n\n` +
      `¡Gracias por confiar en *Genswave*! 🚀`
    );
    
    console.log(`✅ Quick code generated: ${code} for user ${senderId}`);
    
  } catch (error) {
    console.error('❌ Error generating code:', error);
    await sendErrorMessage(senderId);
    await updateConversationState(senderId, 'idle', {});
  }
}

// Send error message
async function sendErrorMessage(senderId) {
  await sendInstagramMessage(senderId,
    `❌ *ERROR TÉCNICO*\n\n` +
    `Disculpe, ocurrió un error en nuestro sistema.\n\n` +
    `Por favor, escriba "código" para reiniciar.\n\n` +
    `Si persiste, contacte a nuestro equipo.`
  );
}

// Get bot user settings
async function getBotUserSettings(userId) {
  try {
    const result = await db.query(
      'SELECT * FROM bot_user_settings WHERE instagram_user_id = $1',
      [userId]
    );
    
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    
    // Create new settings for new user (bot enabled by default)
    const newSettings = await db.query(
      `INSERT INTO bot_user_settings (instagram_user_id, bot_enabled) 
       VALUES ($1, $2) RETURNING *`,
      [userId, true]
    );
    
    return newSettings.rows[0];
  } catch (error) {
    console.error('❌ Error getting bot settings:', error);
    return { bot_enabled: true }; // Default to enabled if error
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
    
    // Create new state for new user
    const newState = await db.query(
      `INSERT INTO conversation_states (instagram_user_id, current_state, collected_data) 
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, 'idle', {}]
    );
    
    return newState.rows[0];
  } catch (error) {
    console.error('❌ Error getting conversation state:', error);
    return { current_state: 'idle', collected_data: {} };
  }
}

// Update conversation state
async function updateConversationState(userId, newState, newData) {
  try {
    await db.query(
      `INSERT INTO conversation_states (instagram_user_id, current_state, collected_data, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (instagram_user_id) 
       DO UPDATE SET 
         current_state = EXCLUDED.current_state,
         collected_data = EXCLUDED.collected_data,
         updated_at = EXCLUDED.updated_at`,
      [userId, newState, JSON.stringify(newData)]
    );
    
    console.log(`🔄 Updating ${userId} to ${newState}:`, newData);
    console.log('✅ State updated successfully');
  } catch (error) {
    console.error('❌ Error updating conversation state:', error);
  }
}

// Send Instagram message
async function sendInstagramMessage(recipientId, messageText) {
  try {
    if (!INSTAGRAM_ACCESS_TOKEN) {
      console.error('❌ No Instagram access token available');
      return false;
    }

    const response = await fetch(`https://graph.instagram.com/v18.0/me/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: messageText },
        access_token: INSTAGRAM_ACCESS_TOKEN
      })
    });
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Instagram message sent successfully:', result);
      
      // Save bot response to database
      await saveBotResponseToDatabase(recipientId, messageText);
      
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Error sending Instagram message:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending Instagram message:', error);
    return false;
  }
}

// Process consultation ID input
async function processConsultationInput(senderId, text, state) {
  const consultationId = text.trim().toUpperCase();
  
  if (consultationId.length < 3) {
    await sendInstagramMessage(senderId,
      `⚠️ *ID muy corto*\n\n` +
      `Por favor, ingrese un ID válido.\n\n` +
      `*Formato esperado:*\n` +
      `• P123456 (Proyectos)\n` +
      `• S123456 (Solicitudes)\n\n` +
      `*Pregunta actual:*\n` +
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
      // First check appointments table
      const appointmentResult = await db.query(
        'SELECT * FROM appointments WHERE unique_id = $1',
        [consultationId]
      );
      if (appointmentResult.rows.length > 0) {
        result = appointmentResult.rows[0];
        type = 'appointment';
      } else {
        // If not found in appointments, check requests table
        const requestResult = await db.query(
          'SELECT * FROM requests WHERE unique_id = $1',
          [consultationId]
        );
        if (requestResult.rows.length > 0) {
          result = requestResult.rows[0];
          type = 'request';
        }
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
        } else {
          const requestResult = await db.query(
            'SELECT * FROM requests WHERE unique_id = $1',
            [consultationId]
          );
          if (requestResult.rows.length > 0) {
            result = requestResult.rows[0];
            type = 'request';
          }
        }
      }
    }
    
    if (result) {
      const statusEmoji = {
        'pending': '🟡',
        'in_progress': '🔵', 
        'completed': '🟢',
        'cancelled': '🔴',
        'on_hold': '🟠'
      };
      
      if (type === 'project') {
        const startDate = result.start_date ? new Date(result.start_date).toLocaleDateString() : 'No definida';
        const endDate = result.end_date ? new Date(result.end_date).toLocaleDateString() : 'No definida';
        const createdDate = new Date(result.created_at).toLocaleDateString();
        
        await sendInstagramMessage(senderId,
          `✅ *PROYECTO ENCONTRADO*\n\n` +
          `🆔 *ID:* ${result.unique_id}\n` +
          `📋 *Título:* ${result.title}\n` +
          `${statusEmoji[result.status] || '⚪'} *Estado:* ${result.status.toUpperCase()}\n\n` +
          `💰 *Presupuesto:* $${result.budget || 'No definido'}\n` +
          `📅 *Fecha inicio:* ${startDate}\n` +
          `📅 *Fecha fin:* ${endDate}\n` +
          `📅 *Proyecto creado:* ${createdDate}\n\n` +
          `📝 *Descripción:*\n${result.description || 'Sin descripción'}\n\n` +
          `${result.admin_notes ? `📋 *Notas del equipo:*\n${result.admin_notes}\n\n` : ''}` +
          `Para más detalles, visite su dashboard en:\nhttps://genswave.onrender.com`
        );
      } else if (type === 'appointment') {
        const preferredDate = result.preferred_date ? new Date(result.preferred_date).toLocaleDateString() : 'No especificada';
        const createdDate = new Date(result.created_at).toLocaleDateString();
        
        await sendInstagramMessage(senderId,
          `✅ *CITA ENCONTRADA*\n\n` +
          `🆔 *ID:* ${result.unique_id}\n` +
          `${statusEmoji[result.status] || '⚪'} *Estado:* ${result.status.toUpperCase()}\n\n` +
          `🛠️ *Servicio:* ${result.service}\n` +
          `🏢 *Empresa:* ${result.business_name || 'No especificada'}\n` +
          `📅 *Fecha preferida:* ${preferredDate}\n` +
          `📅 *Solicitud creada:* ${createdDate}\n\n` +
          `📝 *Mensaje:*\n${result.message || 'Sin mensaje'}\n\n` +
          `${result.admin_notes ? `📋 *Notas del equipo:*\n${result.admin_notes}\n\n` : ''}` +
          `Para más detalles, visite su dashboard en:\nhttps://genswave.onrender.com`
        );
      }
      else if (type === 'request') {
        const createdDate = new Date(result.created_at).toLocaleDateString();
        
        await sendInstagramMessage(senderId,
          `✅ *SOLICITUD ENCONTRADA*\n\n` +
          `🆔 *ID:* ${result.unique_id}\n` +
          `${statusEmoji[result.status] || '⚪'} *Estado:* ${result.status.toUpperCase()}\n\n` +
          `🛠️ *Servicio:* ${result.service}\n` +
          `🏢 *Empresa:* ${result.business_name || 'No especificada'}\n` +
          `📅 *Solicitud creada:* ${createdDate}\n\n` +
          `📝 *Mensaje:*\n${result.message || 'Sin mensaje'}\n\n` +
          `${result.admin_notes ? `📋 *Notas del equipo:*\n${result.admin_notes}\n\n` : ''}` +
          `Para más detalles, visite su dashboard en:\nhttps://genswave.onrender.com`
        );
      }
    } else {
      await sendInstagramMessage(senderId,
        `❌ *ID NO ENCONTRADO*\n\n` +
        `No se encontró ningún proyecto o solicitud con el ID: ${consultationId}\n\n` +
        `Verifique que:\n` +
        `• El ID esté escrito correctamente\n` +
        `• Sea un ID válido de Genswave\n\n` +
        `Para nueva consulta, escriba "consulta"`
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

// Get Instagram user info
async function getInstagramUserInfo(userId) {
  try {
    if (!INSTAGRAM_ACCESS_TOKEN) {
      console.log('⚠️ No Instagram access token available');
      return { id: userId, username: 'Usuario', name: 'Usuario de Instagram' };
    }

    const response = await fetch(`https://graph.instagram.com/${userId}?fields=id,username,name,profile_picture_url&access_token=${INSTAGRAM_ACCESS_TOKEN}`);
    
    if (response.ok) {
      const userInfo = await response.json();
      console.log('👤 Instagram user info retrieved:', userInfo);
      
      // Update bot_user_settings with latest user info
      await db.query(`
        INSERT INTO bot_user_settings (instagram_user_id, instagram_username, sender_name, profile_pic, bot_enabled)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (instagram_user_id) 
        DO UPDATE SET 
          instagram_username = EXCLUDED.instagram_username,
          sender_name = EXCLUDED.sender_name,
          profile_pic = EXCLUDED.profile_pic,
          updated_at = CURRENT_TIMESTAMP
      `, [
        userId, 
        userInfo.username || 'Usuario', 
        userInfo.name || 'Usuario de Instagram',
        userInfo.profile_picture_url || null,
        true
      ]);
      return {
        id: userId,
        username: userInfo.username || 'Usuario',
        name: userInfo.name || 'Usuario de Instagram',
        profile_pic: userInfo.profile_picture_url || null
      };
    } else {
      console.log('⚠️ Could not retrieve Instagram user info');
      return { id: userId, username: 'Usuario', name: 'Usuario de Instagram' };
    }
  } catch (error) {
    console.error('❌ Error getting Instagram user info:', error);
    return { id: userId, username: 'Usuario', name: 'Usuario de Instagram' };
  }
}

// Handle attachments
async function handleAttachments(senderId, attachments, senderInfo) {
  await saveInstagramMessageToDatabase(senderId, '[Archivo adjunto]', senderInfo);
  
  await sendInstagramMessage(senderId,
    `📎 *ARCHIVO RECIBIDO*\n\n` +
    `Hemos recibido su archivo correctamente.\n\n` +
    `Un especialista lo revisará y le responderá pronto.\n\n` +
    `🎫 Escriba "código" para generar acceso rápido\n\n` +
    `Gracias por contactar a *Genswave*.`
  );
}

// Save user message to database
async function saveInstagramMessageToDatabase(senderId, messageText, senderInfo) {
  try {
    const query = `
      INSERT INTO instagram_messages (
        instagram_user_id, 
        instagram_username, 
        sender_name, 
        message_text, 
        is_from_user, 
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `;
    
    await db.query(query, [
      senderId,
      senderInfo?.username || 'Usuario',
      senderInfo?.name || 'Usuario de Instagram',
      messageText,
      true,
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
        instagram_user_id, 
        instagram_username, 
        sender_name, 
        message_text, 
        is_from_user, 
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `;
    
    await db.query(query, [
      recipientId,
      'genswave_bot',
      'Genswave Bot',
      messageText,
      false,
      new Date()
    ]);
    
    console.log('💾 Bot response saved to database');
  } catch (error) {
    console.error('❌ Error saving bot response:', error);
  }
}
// API endpoints
router.get('/bot-users', async (req, res) => {
  try {
    const query = `
      SELECT 
        bus.instagram_user_id,
        bus.instagram_username as username,
        bus.sender_name,
        bus.profile_pic,
        bus.bot_enabled,
        bus.created_at,
        bus.updated_at,
        (
          SELECT MAX(created_at) 
          FROM instagram_messages im 
          WHERE im.instagram_user_id = bus.instagram_user_id 
        ) as last_message_at,
        (
          SELECT COUNT(*) 
          FROM instagram_messages im 
          WHERE im.instagram_user_id = bus.instagram_user_id 
          AND im.is_from_user = true
        ) as message_count
      FROM bot_user_settings bus
      ORDER BY bus.updated_at DESC
    `;

    const result = await db.query(query);
    res.json({ users: result.rows });
  } catch (error) {
    console.error('❌ Error fetching bot users:', error);
    res.status(500).json({ error: 'Error al cargar usuarios del bot' });
  }
});

router.patch('/bot-users/:userId/toggle', async (req, res) => {
  try {
    const { userId } = req.params;
    const { enabled } = req.body;
    
    const result = await db.query(
      'UPDATE bot_user_settings SET bot_enabled = $1, updated_at = CURRENT_TIMESTAMP WHERE instagram_user_id = $2 RETURNING *',
      [enabled, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('❌ Error toggling bot for user:', error);
    res.status(500).json({ error: 'Error al actualizar configuración del bot' });
  }
});

// Get messages for a specific user
router.get('/messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const query = `
      SELECT 
        message_text,
        is_from_user,
        created_at,
        CASE 
          WHEN is_from_user = true THEN false 
          ELSE true 
        END as is_from_bot
      FROM instagram_messages 
      WHERE instagram_user_id = $1 
      ORDER BY created_at ASC
    `;

    const result = await db.query(query, [userId]);
    res.json({ messages: result.rows });
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: 'Error al cargar mensajes' });
  }
});

// Admin reply endpoint
router.post('/admin-reply', async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    
    if (!recipientId || !message) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    const success = await sendInstagramMessage(recipientId, message);
    
    if (success) {
      res.json({ success: true, message: 'Mensaje enviado correctamente' });
    } else {
      res.status(500).json({ error: 'Error al enviar mensaje' });
    }
  } catch (error) {
    console.error('❌ Error sending admin reply:', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

export default router;