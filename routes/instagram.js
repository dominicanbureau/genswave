import express from 'express';
import crypto from 'crypto';
import fetch from 'node-fetch';

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
      `📞 Agendar una cita\n\n` +
      `¿En qué puedo ayudarte hoy?`
    );
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
      `💬 Escribir "ayuda" para ver comandos disponibles\n\n` +
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
    } else {
      console.error('❌ Failed to send Instagram message:', result);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error sending Instagram message:', error);
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
    // This would integrate with your existing messages system
    // For now, we'll log it - you can integrate with your database later
    console.log('💾 Saving Instagram message to database:', {
      senderId,
      messageText,
      senderInfo,
      platform: 'instagram',
      timestamp: new Date()
    });
    
    // TODO: Integrate with your existing messages table
    // You might want to create a new table for Instagram messages
    // or add a platform field to your existing messages table
    
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
    return res.status(400).json({ error: 'recipientId and message are required' });
  }

  try {
    const result = await sendInstagramMessage(recipientId, message);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;