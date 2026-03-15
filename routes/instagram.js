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
  
  // Command handlers
  if (lowerText.includes('hola') || lowerText.includes('hello') || lowerText.includes('hi')) {
    await sendInstagramMessage(senderId, 
      `¡Hola ${senderInfo.name || 'amigo'}! 👋\n\n` +
      `Soy el asistente de Genswave. Puedo ayudarte con:\n\n` +
      `🌐 Solicitar cotización para página web\n` +
      `📱 Información sobre apps móviles\n` +
      `💼 Consultas sobre proyectos\n` +
      `📞 Agendar una cita\n` +
      `🎫 Generar código de acceso\n\n` +
      `¿En qué puedo ayudarte hoy?`
    );
  } 
  else if (lowerText.includes('código') || lowerText.includes('codigo') || lowerText.includes('acceso') || lowerText.includes('login')) {
    await sendInstagramMessage(senderId,
      `🎫 ¡Perfecto! Te ayudo a generar un código de acceso.\n\n` +
      `Este código te permitirá:\n` +
      `✅ Acceder a nuestro sitio web\n` +
      `✅ Ver el estado de tus proyectos\n` +
      `✅ Comunicarte directamente con nosotros\n\n` +
      `Para generar tu código, necesito algunos datos:\n\n` +
      `📝 Responde con tu información en este formato:\n` +
      `DATOS: [Tu nombre] | [Tu email] | [Tu teléfono] | [Tu empresa]\n\n` +
      `Ejemplo:\n` +
      `DATOS: Juan Pérez | juan@email.com | +1234567890 | Mi Empresa\n\n` +
      `¿Listo para generar tu código?`
    );
  }
  else if (lowerText.startsWith('datos:')) {
    // Parse user data for quick code generation
    const dataString = text.substring(6).trim(); // Remove "DATOS:" prefix
    const dataParts = dataString.split('|').map(part => part.trim());
    
    if (dataParts.length >= 3) {
      const [name, email, phone, company] = dataParts;
      
      try {
        // Generate quick code
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

        // Save quick code to database
        const insertQuery = `
          INSERT INTO quick_codes (name, email, phone, company, code, expires_at, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
        `;

        const values = [
          name || senderInfo.name || 'Usuario de Instagram',
          email || `instagram_${senderId}@temp.com`,
          phone || 'No proporcionado',
          company || 'No especificada',
          code,
          expiresAt,
          new Date()
        ];

        const result = await db.query(insertQuery, values);

        // Send success message with code
        await sendInstagramMessage(senderId,
          `🎉 ¡Código generado exitosamente!\n\n` +
          `👤 Nombre: ${name}\n` +
          `📧 Email: ${email}\n` +
          `📱 Teléfono: ${phone}\n` +
          `🏢 Empresa: ${company || 'No especificada'}\n\n` +
          `🎫 Tu código de acceso: ${code}\n\n` +
          `👉 Visita: https://genswave.onrender.com\n` +
          `📝 Ingresa tu código en "Código Rápido"\n\n` +
          `⏰ Válido por 7 días\n` +
          `📞 ¿Necesitas ayuda? ¡Escríbeme!\n\n` +
          `¡Gracias por confiar en Genswave!`
        );

        console.log(`✅ Quick code generated via Instagram: ${code} for ${name}`);
        
      } catch (error) {
        console.error('Error generating quick code from Instagram:', error);
        await sendInstagramMessage(senderId,
          `❌ Hubo un error al generar tu código.\n\n` +
          `Por favor, inténtalo de nuevo o contacta a nuestro equipo.\n\n` +
          `📞 También puedes visitarnos en:\n` +
          `👉 https://genswave.onrender.com`
        );
      }
    } else {
      await sendInstagramMessage(senderId,
        `❌ Formato incorrecto.\n\n` +
        `Por favor, usa este formato:\n` +
        `DATOS: [Nombre] | [Email] | [Teléfono] | [Empresa]\n\n` +
        `Ejemplo:\n` +
        `DATOS: Juan Pérez | juan@email.com | +1234567890 | Mi Empresa\n\n` +
        `¡Inténtalo de nuevo!`
      );
    }
  }
  else if (lowerText.includes('cotización') || lowerText.includes('precio') || lowerText.includes('costo')) {
    await sendInstagramMessage(senderId,
      `💰 ¡Perfecto! Te ayudo con una cotización.\n\n` +
      `Para darte el mejor precio, necesito conocer:\n\n` +
      `🏢 Nombre de tu negocio\n` +
      `🎯 Tipo de proyecto (web, app, etc.)\n` +
      `📋 Descripción de lo que necesitas\n` +
      `📞 Tu número de contacto\n\n` +
      `También puedes llenar el formulario completo aquí:\n` +
      `👉 https://genswave.onrender.com\n\n` +
      `¿Me puedes contar más sobre tu proyecto?`
    );
  }
  else if (lowerText.includes('cita') || lowerText.includes('reunión') || lowerText.includes('meeting')) {
    await sendInstagramMessage(senderId,
      `📅 ¡Excelente! Agendemos una cita.\n\n` +
      `Puedes agendar directamente aquí:\n` +
      `👉 https://genswave.onrender.com\n\n` +
      `O si prefieres, dime:\n` +
      `📅 Fecha preferida\n` +
      `⏰ Hora preferida\n` +
      `📞 Tu número de contacto\n\n` +
      `¿Cuándo te viene mejor?`
    );
  }
  else if (lowerText.includes('servicios') || lowerText.includes('qué hacen')) {
    await sendInstagramMessage(senderId,
      `🚀 En Genswave ofrecemos:\n\n` +
      `🌐 **Desarrollo Web**\n` +
      `• Páginas web profesionales\n` +
      `• E-commerce\n` +
      `• Sistemas web personalizados\n\n` +
      `📱 **Apps Móviles**\n` +
      `• iOS y Android\n` +
      `• Apps nativas y híbridas\n\n` +
      `⚙️ **Soluciones Personalizadas**\n` +
      `• Automatización\n` +
      `• Integraciones\n` +
      `• Consultoría técnica\n\n` +
      `¿Te interesa algún servicio en particular?`
    );
  }
  else if (lowerText.includes('ayuda') || lowerText.includes('help')) {
    await sendInstagramMessage(senderId,
      `🆘 ¡Estoy aquí para ayudarte!\n\n` +
      `Comandos disponibles:\n` +
      `• "Cotización" - Para solicitar precios\n` +
      `• "Cita" - Para agendar reunión\n` +
      `• "Servicios" - Ver qué ofrecemos\n` +
      `• "Código" - Generar código de acceso\n` +
      `• "Ayuda" - Ver este menú\n\n` +
      `También puedes escribirme cualquier pregunta y te responderé lo antes posible.\n\n` +
      `🌐 Visita: https://genswave.onrender.com`
    );
  }
  else {
    // Default response for unrecognized messages
    await sendInstagramMessage(senderId,
      `Gracias por tu mensaje! 📨\n\n` +
      `He recibido: "${text}"\n\n` +
      `Un miembro de nuestro equipo te responderá pronto. Mientras tanto, puedes:\n\n` +
      `🌐 Visitar nuestra web: https://genswave.onrender.com\n` +
      `💬 Escribir "ayuda" para ver comandos disponibles\n` +
      `🎫 Escribir "código" para generar acceso rápido\n\n` +
      `¡Gracias por contactarnos!`
    );
    
    // Save message to database for admin review
    await saveInstagramMessageToDatabase(senderId, text, senderInfo);
  }
}

// Handle attachments (images, videos, etc.)
async function handleAttachments(senderId, attachments, senderInfo) {
  await sendInstagramMessage(senderId,
    `📎 He recibido tu archivo adjunto.\n\n` +
    `Un miembro de nuestro equipo lo revisará y te responderá pronto.\n\n` +
    `Si necesitas una respuesta inmediata, puedes:\n` +
    `🌐 Visitar: https://genswave.onrender.com\n` +
    `💬 Escribir "ayuda" para comandos disponibles`
  );
  
  // Save attachment info to database
  await saveInstagramAttachmentToDatabase(senderId, attachments, senderInfo);
}

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
        instagram_username,
        sender_name,
        message_text as last_message,
        MAX(created_at) as last_message_time,
        SUM(CASE WHEN is_from_user = true AND is_read = false THEN 1 ELSE 0 END) as unread_count
      FROM instagram_messages 
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
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

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
    const message = `🎉 ¡Tu código de acceso ha sido generado!\n\n` +
                   `Código: ${code}\n\n` +
                   `Este código te permite acceder a nuestro sitio web y ver el estado de tus proyectos.\n\n` +
                   `👉 Visita: https://genswave.onrender.com\n` +
                   `📝 Ingresa tu código en la sección "Código Rápido"\n\n` +
                   `⏰ Válido por 7 días\n\n` +
                   `¡Gracias por contactarnos!`;

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

export default router;