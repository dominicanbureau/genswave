import express from 'express';
import crypto from 'crypto';
import fetch from 'node-fetch';
import db from '../database.js';

const router = express.Router();

// Instagram API Configuration
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const WEBHOOK_VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;

// Webhook verification (GET request from Meta)
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('📱 Instagram webhook verification request:', { mode, token });

  if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
    console.log('✅ Instagram webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Instagram webhook verification failed');
    res.sendStatus(403);
  }
});

// Webhook handler (POST request from Instagram)
router.post('/webhook', (req, res) => {
  const body = req.body;
  
  // Verify the request signature
  const signature = req.headers['x-hub-signature-256'];
  if (!verifySignature(JSON.stringify(body), signature)) {
    console.log('❌ Invalid Instagram webhook signature');
    return res.sendStatus(403);
  }

  console.log('📱 Instagram webhook received:', JSON.stringify(body, null, 2));

  // Process Instagram messages
  if (body.object === 'instagram') {
    body.entry?.forEach(entry => {
      entry.messaging?.forEach(async (messagingEvent) => {
        await handleInstagramMessage(messagingEvent);
      });
    });
  }

  res.status(200).send('EVENT_RECEIVED');
});

// OAuth callback handler
router.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided' });
  }

  try {
    // Exchange code for access token using Facebook Graph API
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: INSTAGRAM_APP_ID,
        client_secret: INSTAGRAM_APP_SECRET,
        redirect_uri: `https://genswave.onrender.com/api/instagram/auth/callback`,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('🔑 Facebook/Instagram access token received:', tokenData);

    if (tokenData.error) {
      console.error('❌ OAuth error:', tokenData.error);
      return res.status(400).json({ 
        error: 'Authorization failed', 
        details: tokenData.error.message 
      });
    }

    // Store the access token securely (you might want to save this to database)
    // For now, we'll just log it - you should save it to your environment variables
    
    res.json({
      success: true,
      message: 'Instagram connected successfully!',
      data: {
        access_token: tokenData.access_token,
        token_type: tokenData.token_type,
        expires_in: tokenData.expires_in
      }
    });
  } catch (error) {
    console.error('❌ Instagram OAuth error:', error);
    res.status(500).json({ error: 'Failed to connect Instagram' });
  }
});

// Handle incoming Instagram messages
async function handleInstagramMessage(messagingEvent) {
  const senderId = messagingEvent.sender?.id;
  const message = messagingEvent.message;
  
  if (!senderId || !message) return;

  console.log(`📨 Message from ${senderId}:`, message);

  try {
    // Get sender info
    const senderInfo = await getInstagramUserInfo(senderId);
    console.log('👤 Sender info:', senderInfo);

    // Process different message types
    if (message.text) {
      await handleTextMessage(senderId, message.text, senderInfo);
    } else if (message.attachments) {
      await handleAttachments(senderId, message.attachments, senderInfo);
    }
  } catch (error) {
    console.error('❌ Error handling Instagram message:', error);
  }
}

// Handle text messages with commands
async function handleTextMessage(senderId, text, senderInfo) {
  const lowerText = text.toLowerCase().trim();
  
  console.log(`📨 Received message from ${senderId}: "${text}"`);
  
  // IMPORTANTE: Guardar TODOS los mensajes del usuario primero
  await saveInstagramMessageToDatabase(senderId, text, senderInfo);
  
  // Get or create conversation state
  const conversationState = await getConversationState(senderId);
  console.log(`📊 Current conversation state:`, conversationState);
  
  // Handle conversation flow based on current state
  switch (conversationState.current_state) {
    case 'idle':
      console.log(`🔄 Handling idle state`);
      await handleIdleState(senderId, text, senderInfo, lowerText);
      break;
    case 'awaiting_name':
      console.log(`🔄 Handling name input`);
      await handleNameInput(senderId, text, senderInfo);
      break;
    case 'awaiting_email':
      console.log(`🔄 Handling email input`);
      await handleEmailInput(senderId, text, senderInfo);
      break;
    case 'awaiting_phone':
      console.log(`🔄 Handling phone input`);
      await handlePhoneInput(senderId, text, senderInfo);
      break;
    case 'awaiting_company':
      console.log(`🔄 Handling company input`);
      await handleCompanyInput(senderId, text, senderInfo);
      break;
    default:
      console.log(`🔄 Unknown state, handling as idle`);
      await handleIdleState(senderId, text, senderInfo, lowerText);
  }
}

// Get or create conversation state
async function getConversationState(userId) {
  try {
    console.log(`🔍 Getting conversation state for user: ${userId}`);
    
    // Try to get existing state
    const result = await db.query(
      'SELECT * FROM conversation_states WHERE instagram_user_id = $1',
      [userId]
    );
    
    if (result.rows.length > 0) {
      console.log(`✅ Found existing state:`, result.rows[0]);
      return result.rows[0];
    }
    
    console.log(`📝 Creating new conversation state for user: ${userId}`);
    
    // Create new state if doesn't exist
    const newState = await db.query(
      `INSERT INTO conversation_states (instagram_user_id, current_state, collected_data) 
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, 'idle', '{}']
    );
    
    console.log(`✅ Created new state:`, newState.rows[0]);
    return newState.rows[0];
  } catch (error) {
    console.error('❌ Error managing conversation state:', error);
    return { current_state: 'idle', collected_data: {} };
  }
}

// Update conversation state
async function updateConversationState(userId, newState, collectedData = null) {
  try {
    console.log(`🔄 Updating state for ${userId}: ${newState}`, collectedData);
    
    const updateData = collectedData ? JSON.stringify(collectedData) : null;
    const query = updateData 
      ? 'UPDATE conversation_states SET current_state = $1, collected_data = $2, updated_at = CURRENT_TIMESTAMP WHERE instagram_user_id = $3'
      : 'UPDATE conversation_states SET current_state = $1, updated_at = CURRENT_TIMESTAMP WHERE instagram_user_id = $2';
    
    const params = updateData ? [newState, updateData, userId] : [newState, userId];
    const result = await db.query(query, params);
    
    console.log(`✅ State updated successfully. Rows affected: ${result.rowCount}`);
  } catch (error) {
    console.error('❌ Error updating conversation state:', error);
  }
}

// Handle idle state (initial commands)
async function handleIdleState(senderId, text, senderInfo, lowerText) {
  if (lowerText.includes('hola') || lowerText.includes('hello') || lowerText.includes('hi')) {
    await sendInstagramMessage(senderId, 
      `¡Hola ${senderInfo.name || 'estimado/a cliente'}! 👋\n\n` +
      `Bienvenido/a a **Genswave**, su socio estratégico en transformación digital.\n\n` +
      `Nuestros servicios especializados incluyen:\n\n` +
      `🌐 **Desarrollo Web Profesional**\n` +
      `📱 **Aplicaciones Móviles Nativas**\n` +
      `💼 **Consultoría en Proyectos Digitales**\n` +
      `📅 **Asesoramiento Personalizado**\n` +
      `🎫 **Acceso Rápido a su Portal Cliente**\n\n` +
      `¿En qué podemos asistirle hoy?`
    );
  } 
  else if (lowerText.includes('código') || lowerText.includes('codigo') || lowerText.includes('acceso') || lowerText.includes('portal')) {
    await sendInstagramMessage(senderId,
      `🎫 **GENERACIÓN DE CÓDIGO DE ACCESO**\n\n` +
      `Estimado/a cliente, procederemos a generar su código de acceso personalizado para nuestro portal cliente.\n\n` +
      `**Beneficios de su código:**\n` +
      `✅ Acceso exclusivo a su dashboard personalizado\n` +
      `✅ Seguimiento en tiempo real de sus proyectos\n` +
      `✅ Comunicación directa con nuestro equipo\n` +
      `✅ Historial completo de servicios\n\n` +
      `Para proceder, necesitaremos algunos datos. Le haré unas preguntas breves.\n\n` +
      `**Primera pregunta:**\n` +
      `Por favor, indíquenos su **nombre completo** 👤`
    );
    await updateConversationState(senderId, 'awaiting_name');
  }
  else if (lowerText.includes('cotización') || lowerText.includes('cotizacion') || lowerText.includes('precio') || lowerText.includes('presupuesto')) {
    await sendInstagramMessage(senderId,
      `💰 **SOLICITUD DE COTIZACIÓN PROFESIONAL**\n\n` +
      `Gracias por su interés en nuestros servicios de desarrollo digital.\n\n` +
      `Para elaborar una propuesta técnica y comercial precisa, necesitamos conocer:\n\n` +
      `📋 **Información requerida:**\n` +
      `• Nombre de su empresa u organización\n` +
      `• Tipo de proyecto (web, móvil, consultoría)\n` +
      `• Descripción detallada de sus requerimientos\n` +
      `• Cronograma estimado del proyecto\n` +
      `• Presupuesto aproximado disponible\n\n` +
      `**Opciones para continuar:**\n` +
      `🌐 Complete nuestro formulario: https://genswave.onrender.com\n` +
      `📞 O compártanos los detalles por este medio\n\n` +
      `¿Cómo prefiere proceder?`
    );
  }
  else if (lowerText.includes('cita') || lowerText.includes('reunión') || lowerText.includes('reunion') || lowerText.includes('consulta')) {
    await sendInstagramMessage(senderId,
      `📅 **PROGRAMACIÓN DE CONSULTA PROFESIONAL**\n\n` +
      `Será un placer atenderle en una consulta personalizada.\n\n` +
      `**Modalidades disponibles:**\n` +
      `🖥️ Videollamada (Google Meet/Zoom)\n` +
      `📞 Llamada telefónica\n` +
      `🏢 Reunión presencial (según ubicación)\n\n` +
      `**Para agendar su cita:**\n` +
      `🌐 Sistema automático: https://genswave.onrender.com\n\n` +
      `**O proporcione:**\n` +
      `📅 Fecha de preferencia\n` +
      `⏰ Horario conveniente\n` +
      `📱 Número de contacto\n` +
      `💼 Tema a tratar\n\n` +
      `¿Cuál sería su disponibilidad?`
    );
  }
  else if (lowerText.includes('servicios') || lowerText.includes('que hacen') || lowerText.includes('portfolio')) {
    await sendInstagramMessage(senderId,
      `🚀 **PORTAFOLIO DE SERVICIOS GENSWAVE**\n\n` +
      `**DESARROLLO WEB PROFESIONAL** 🌐\n` +
      `• Sitios web corporativos de alto impacto\n` +
      `• Plataformas e-commerce avanzadas\n` +
      `• Sistemas web personalizados\n` +
      `• Optimización SEO y rendimiento\n\n` +
      `**APLICACIONES MÓVILES** 📱\n` +
      `• Apps nativas iOS y Android\n` +
      `• Aplicaciones híbridas multiplataforma\n` +
      `• Integración con APIs y servicios\n` +
      `• Publicación en App Store y Play Store\n\n` +
      `**CONSULTORÍA DIGITAL** ⚙️\n` +
      `• Arquitectura de software\n` +
      `• Automatización de procesos\n` +
      `• Integración de sistemas\n` +
      `• Auditoría técnica y optimización\n\n` +
      `¿Le interesa conocer más detalles sobre algún servicio específico?`
    );
  }
  else if (lowerText.includes('ayuda') || lowerText.includes('help') || lowerText.includes('comandos')) {
    await sendInstagramMessage(senderId,
      `🆘 **CENTRO DE AYUDA GENSWAVE**\n\n` +
      `**Comandos disponibles:**\n\n` +
      `🎫 **"Código"** - Generar acceso a portal cliente\n` +
      `💰 **"Cotización"** - Solicitar presupuesto\n` +
      `📅 **"Cita"** - Agendar consulta profesional\n` +
      `🚀 **"Servicios"** - Ver portafolio completo\n` +
      `🆘 **"Ayuda"** - Mostrar este menú\n\n` +
      `**Contacto directo:**\n` +
      `🌐 Web: https://genswave.onrender.com\n` +
      `📧 Email: contacto@genswave.com\n\n` +
      `También puede escribirnos cualquier consulta y nuestro equipo le responderá a la brevedad.\n\n` +
      `¿En qué más podemos asistirle?`
    );
  }
  else {
    // Default response for unrecognized messages
    await sendInstagramMessage(senderId,
      `Gracias por contactar a **Genswave** 📨\n\n` +
      `Hemos recibido su mensaje:\n` +
      `"${text}"\n\n` +
      `Un especialista de nuestro equipo revisará su consulta y le responderá en el menor tiempo posible.\n\n` +
      `**Mientras tanto, puede:**\n` +
      `🌐 Explorar nuestros servicios: https://genswave.onrender.com\n` +
      `🆘 Escribir "ayuda" para ver opciones disponibles\n` +
      `🎫 Escribir "código" para acceso rápido al portal\n\n` +
      `Valoramos su confianza en nosotros.`
    );
  }
}

// Handle name input
async function handleNameInput(senderId, text, senderInfo) {
  const name = text.trim();
  
  if (name.length < 2) {
    await sendInstagramMessage(senderId,
      `Por favor, proporcione un nombre válido con al menos 2 caracteres.\n\n` +
      `**Pregunta actual:**\n` +
      `Indíquenos su **nombre completo** 👤`
    );
    return;
  }
  
  // Save name and move to next step
  const currentState = await getConversationState(senderId);
  const collectedData = { ...currentState.collected_data, name: name };
  
  await updateConversationState(senderId, 'awaiting_email', collectedData);
  
  await sendInstagramMessage(senderId,
    `Perfecto, **${name}**. Gracias por la información.\n\n` +
    `**Segunda pregunta:**\n` +
    `Por favor, proporcione su **dirección de correo electrónico** 📧\n\n` +
    `*Este será su usuario para acceder al portal cliente*`
  );
}

// Handle email input
async function handleEmailInput(senderId, text, senderInfo) {
  const email = text.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  console.log(`📧 Processing email input: "${email}" for user ${senderId}`);
  
  if (!emailRegex.test(email)) {
    console.log(`❌ Invalid email format: ${email}`);
    await sendInstagramMessage(senderId,
      `Por favor, proporcione una dirección de correo electrónico válida.\n\n` +
      `**Formato esperado:** usuario@dominio.com\n\n` +
      `**Pregunta actual:**\n` +
      `Su **dirección de correo electrónico** 📧`
    );
    return;
  }
  
  console.log(`✅ Valid email format: ${email}`);
  
  try {
    // Save email and move to next step
    const currentState = await getConversationState(senderId);
    console.log(`📊 Current state before update:`, currentState);
    
    const collectedData = { ...currentState.collected_data, email: email };
    console.log(`📊 New collected data:`, collectedData);
    
    await updateConversationState(senderId, 'awaiting_phone', collectedData);
    console.log(`✅ State updated to awaiting_phone`);
    
    await sendInstagramMessage(senderId,
      `Excelente. Email registrado: **${email}**\n\n` +
      `**Tercera pregunta:**\n` +
      `Indique su **número de teléfono** con código de país 📱\n\n` +
      `*Ejemplo: +1 234 567 8900*`
    );
    
    console.log(`✅ Email response sent successfully`);
    
  } catch (error) {
    console.error('❌ Error in handleEmailInput:', error);
    await sendInstagramMessage(senderId,
      `❌ **ERROR TÉCNICO**\n\n` +
      `Disculpe, ocurrió un error al procesar su email.\n\n` +
      `Por favor, escriba "código" para reiniciar el proceso.`
    );
  }
}

// Handle phone input
async function handlePhoneInput(senderId, text, senderInfo) {
  const phone = text.trim();
  
  if (phone.length < 8) {
    await sendInstagramMessage(senderId,
      `Por favor, proporcione un número de teléfono válido.\n\n` +
      `**Incluya el código de país si es posible**\n` +
      `*Ejemplo: +1 234 567 8900*\n\n` +
      `**Pregunta actual:**\n` +
      `Su **número de teléfono** 📱`
    );
    return;
  }
  
  // Save phone and move to final step
  const currentState = await getConversationState(senderId);
  const collectedData = { ...currentState.collected_data, phone: phone };
  
  await updateConversationState(senderId, 'awaiting_company', collectedData);
  
  await sendInstagramMessage(senderId,
    `Perfecto. Teléfono registrado: **${phone}**\n\n` +
    `**Última pregunta:**\n` +
    `¿Cuál es el nombre de su **empresa u organización**? 🏢\n\n` +
    `*Si es persona natural, puede indicar "Independiente"*`
  );
}

// Handle company input and generate code
async function handleCompanyInput(senderId, text, senderInfo) {
  const company = text.trim();
  
  if (company.length < 2) {
    await sendInstagramMessage(senderId,
      `Por favor, indique el nombre de su empresa o "Independiente".\n\n` +
      `**Pregunta actual:**\n` +
      `Nombre de su **empresa u organización** 🏢`
    );
    return;
  }
  
  // Get all collected data
  const currentState = await getConversationState(senderId);
  const collectedData = { ...currentState.collected_data, company: company };
  
  try {
    // Generate quick code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days validity
    
    // Save to database
    const insertQuery = `
      INSERT INTO quick_codes (name, email, phone, company, code, expires_at, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    
    const values = [
      collectedData.name,
      collectedData.email,
      collectedData.phone,
      company,
      code,
      expiresAt,
      new Date()
    ];
    
    const result = await db.query(insertQuery, values);
    
    // Reset conversation state
    await updateConversationState(senderId, 'idle', {});
    
    // Send success message with code
    await sendInstagramMessage(senderId,
      `🎉 **CÓDIGO DE ACCESO GENERADO EXITOSAMENTE**\n\n` +
      `**Datos registrados:**\n` +
      `👤 **Nombre:** ${collectedData.name}\n` +
      `📧 **Email:** ${collectedData.email}\n` +
      `📱 **Teléfono:** ${collectedData.phone}\n` +
      `🏢 **Empresa:** ${company}\n\n` +
      `🎫 **SU CÓDIGO DE ACCESO:** \`${code}\`\n\n` +
      `**Instrucciones de uso:**\n` +
      `1️⃣ Visite: https://genswave.onrender.com\n` +
      `2️⃣ Haga clic en "Código Rápido"\n` +
      `3️⃣ Ingrese el código: **${code}**\n` +
      `4️⃣ Acceda a su dashboard personalizado\n\n` +
      `⏰ **Válido por 30 días**\n` +
      `🔒 **Código único y seguro**\n\n` +
      `¡Gracias por confiar en **Genswave**!\n` +
      `¿Necesita alguna asistencia adicional?`
    );
    
    console.log(`✅ Quick code generated via Instagram: ${code} for ${collectedData.name} (${collectedData.email})`);
    
  } catch (error) {
    console.error('Error generating quick code from Instagram:', error);
    
    // Reset conversation state on error
    await updateConversationState(senderId, 'idle', {});
    
    await sendInstagramMessage(senderId,
      `❌ **ERROR EN LA GENERACIÓN**\n\n` +
      `Disculpe, ocurrió un error técnico al generar su código de acceso.\n\n` +
      `**Opciones disponibles:**\n` +
      `🔄 Escriba "código" para intentar nuevamente\n` +
      `🌐 Visite: https://genswave.onrender.com\n` +
      `📧 Contacte: contacto@genswave.com\n\n` +
      `Nuestro equipo técnico ha sido notificado del inconveniente.`
    );
  }
}

// Handle attachments (images, videos, etc.)
async function handleAttachments(senderId, attachments, senderInfo) {
  // Save user message first
  await saveInstagramMessageToDatabase(senderId, '[Archivo adjunto]', senderInfo);
  
  await sendInstagramMessage(senderId,
    `📎 **ARCHIVO RECIBIDO**\n\n` +
    `Hemos recibido su archivo adjunto correctamente.\n\n` +
    `Un especialista de nuestro equipo lo revisará y le responderá a la brevedad.\n\n` +
    `**Mientras tanto:**\n` +
    `🌐 Explore nuestros servicios: https://genswave.onrender.com\n` +
    `🆘 Escriba "ayuda" para ver opciones disponibles\n` +
    `🎫 Escriba "código" para generar acceso rápido\n\n` +
    `Gracias por contactar a **Genswave**.`
  );
  
  // Save attachment info to database
  await saveInstagramAttachmentToDatabase(senderId, attachments, senderInfo);
}

// Clean old conversation states (run periodically)
async function cleanOldConversationStates() {
  try {
    // Clean states older than 24 hours that are not in 'idle' state
    const result = await db.query(`
      DELETE FROM conversation_states 
      WHERE updated_at < NOW() - INTERVAL '24 hours' 
      AND current_state != 'idle'
    `);
    
    if (result.rowCount > 0) {
      console.log(`🧹 Cleaned ${result.rowCount} old conversation states`);
    }
  } catch (error) {
    console.error('Error cleaning old conversation states:', error);
  }
}

// Run cleanup every hour
setInterval(cleanOldConversationStates, 60 * 60 * 1000);

// Send message to Instagram user
async function sendInstagramMessage(recipientId, messageText) {
  if (!INSTAGRAM_ACCESS_TOKEN) {
    console.error('❌ Instagram access token not configured');
    return;
  }

  try {
    const response = await fetch(`https://graph.instagram.com/v18.0/me/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${INSTAGRAM_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: messageText }
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Instagram message sent successfully:', result);
      
      // Save bot response to database
      await saveBotResponseToDatabase(recipientId, messageText);
      
    } else {
      console.error('❌ Failed to send Instagram message:', result);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error sending Instagram message:', error);
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
        message_type,
        is_from_user,
        is_read,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    const values = [
      recipientId,
      null,
      'Genswave Bot',
      messageText,
      'text',
      false, // is_from_user (this is from bot)
      true, // is_read (bot messages are automatically read)
      new Date()
    ];

    await db.query(query, values);
    console.log('💾 Bot response saved to database');
    
  } catch (error) {
    console.error('❌ Error saving bot response to database:', error);
  }
}

// Get Instagram user information
async function getInstagramUserInfo(userId) {
  if (!INSTAGRAM_ACCESS_TOKEN) {
    return { id: userId, name: 'Usuario' };
  }

  try {
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

// Save Instagram message to database for admin review
async function saveInstagramMessageToDatabase(senderId, messageText, senderInfo) {
  try {
    // Save to instagram_messages table
    const query = `
      INSERT INTO instagram_messages (
        instagram_user_id,
        instagram_username,
        sender_name,
        message_text,
        message_type,
        is_from_user,
        is_read,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;

    const values = [
      senderId,
      senderInfo.username || null,
      senderInfo.name || 'Usuario de Instagram',
      messageText,
      'text',
      true, // is_from_user
      false, // is_read
      new Date()
    ];

    const result = await db.query(query, values);
    console.log('💾 Instagram message saved to database:', result.rows[0].id);
    
  } catch (error) {
    console.error('❌ Error saving Instagram message to database:', error);
  }
}

// Save Instagram attachment to database
async function saveInstagramAttachmentToDatabase(senderId, attachments, senderInfo) {
  try {
    console.log('💾 Saving Instagram attachment to database:', {
      senderId,
      attachments,
      senderInfo,
      platform: 'instagram',
      timestamp: new Date()
    });
    
    // TODO: Integrate with your existing messages/attachments system
    
  } catch (error) {
    console.error('❌ Error saving Instagram attachment to database:', error);
  }
}

// Verify webhook signature
function verifySignature(payload, signature) {
  if (!INSTAGRAM_APP_SECRET || !signature) {
    return false;
  }

  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', INSTAGRAM_APP_SECRET)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Get Instagram authorization URL
router.get('/auth/url', (req, res) => {
  // For Instagram Business, we need to use Facebook's OAuth with Instagram permissions
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
    `client_id=${INSTAGRAM_APP_ID}&` +
    `redirect_uri=https://genswave.onrender.com/api/instagram/auth/callback&` +
    `scope=instagram_basic,instagram_manage_messages,pages_messaging,business_management&` +
    `response_type=code&` +
    `state=instagram_auth`;
  
  res.json({ authUrl });
});

// Test endpoint to send a message (for admin use)
router.post('/send-message', async (req, res) => {
  const { recipientId, message } = req.body;
  
  if (!recipientId || !message) {
    return res.status(400).json({ error: 'recipientId y message son requeridos' });
  }

  try {
    const result = await sendInstagramMessage(recipientId, message);
    if (result) {
      // Save admin message to database
      await saveBotResponseToDatabase(recipientId, message);
      res.json({ success: true, message: 'Mensaje enviado correctamente' });
    } else {
      res.status(500).json({ error: 'Error al enviar mensaje por Instagram' });
    }
  } catch (error) {
    console.error('Error sending Instagram message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Instagram conversations for admin
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
    console.error('❌ Error fetching Instagram conversations:', error);
    res.status(500).json({ error: 'Error al cargar conversaciones de Instagram' });
  }
});

// Get messages for a specific Instagram user
router.get('/messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const query = `
      SELECT 
        id,
        instagram_user_id,
        instagram_username,
        sender_name,
        message_text,
        message_type,
        attachments,
        is_from_user,
        is_read,
        created_at
      FROM instagram_messages 
      WHERE instagram_user_id = $1
      ORDER BY created_at ASC
    `;

    const result = await db.query(query, [userId]);
    
    // Mark user messages as read
    await db.query(
      'UPDATE instagram_messages SET is_read = true WHERE instagram_user_id = $1 AND is_from_user = true',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching Instagram messages:', error);
    res.status(500).json({ error: 'Error al cargar mensajes de Instagram' });
  }
});

// Send message from admin to Instagram user
router.post('/admin-reply', async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    
    if (!recipientId || !message) {
      return res.status(400).json({ error: 'recipientId and message are required' });
    }

    // Send message via Instagram API
    const result = await sendInstagramMessage(recipientId, message);
    
    if (result) {
      res.json({ success: true, message: 'Message sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send message' });
    }
  } catch (error) {
    console.error('❌ Error sending admin reply:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Generate quick code for Instagram user
router.post('/generate-quick-code', async (req, res) => {
  try {
    const { instagramUserId } = req.body;

    if (!instagramUserId) {
      return res.status(400).json({ error: 'instagramUserId es requerido' });
    }

    // Get Instagram user info
    const userInfo = await getInstagramUserInfo(instagramUserId);
    
    if (!userInfo) {
      return res.status(404).json({ error: 'Usuario de Instagram no encontrado' });
    }

    // Generate quick code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days validity

    // Save quick code to database
    const insertQuery = `
      INSERT INTO quick_codes (name, email, phone, company, code, expires_at, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const values = [
      userInfo.name || 'Usuario de Instagram',
      `instagram_${instagramUserId}@temp.com`, // Temporary email
      userInfo.phone || 'No proporcionado',
      'Instagram User',
      code,
      expiresAt,
      new Date()
    ];

    const result = await db.query(insertQuery, values);

    // Send code to user via Instagram
    const message = `🎉 **CÓDIGO DE ACCESO GENERADO**\n\n` +
                   `Su código ha sido generado por nuestro equipo:\n\n` +
                   `🎫 **Código:** \`${code}\`\n\n` +
                   `**Instrucciones:**\n` +
                   `1️⃣ Visite: https://genswave.onrender.com\n` +
                   `2️⃣ Haga clic en "Código Rápido"\n` +
                   `3️⃣ Ingrese su código\n\n` +
                   `⏰ **Válido por 30 días**\n\n` +
                   `¡Gracias por confiar en **Genswave**!`;

    await sendInstagramMessage(instagramUserId, message);
    await saveBotResponseToDatabase(instagramUserId, message);

    res.json({ 
      success: true, 
      code: code,
      message: 'Código generado y enviado correctamente' 
    });

  } catch (error) {
    console.error('Error generating quick code:', error);
    res.status(500).json({ error: 'Error al generar código rápido' });
  }
});

// Reset conversation state for a user
router.post('/reset-conversation', async (req, res) => {
  try {
    const { instagramUserId } = req.body;

    if (!instagramUserId) {
      return res.status(400).json({ error: 'instagramUserId es requerido' });
    }

    // Reset conversation state to idle
    await db.query(
      'UPDATE conversation_states SET current_state = $1, collected_data = $2, updated_at = CURRENT_TIMESTAMP WHERE instagram_user_id = $3',
      ['idle', '{}', instagramUserId]
    );

    // Send reset message to user
    const message = `🔄 **CONVERSACIÓN REINICIADA**\n\n` +
                   `Su conversación ha sido reiniciada por nuestro equipo.\n\n` +
                   `Puede comenzar nuevamente escribiendo:\n` +
                   `🎫 **"Código"** - Para generar acceso\n` +
                   `🆘 **"Ayuda"** - Para ver opciones\n\n` +
                   `¿En qué podemos asistirle?`;

    await sendInstagramMessage(instagramUserId, message);
    await saveBotResponseToDatabase(instagramUserId, message);

    res.json({ 
      success: true, 
      message: 'Estado de conversación reiniciado correctamente' 
    });

  } catch (error) {
    console.error('Error resetting conversation:', error);
    res.status(500).json({ error: 'Error al reiniciar conversación' });
  }
});

export default router;