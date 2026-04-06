import express from 'express';
import db from '../database.js';

const router = express.Router();

// AI Assistant Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId, context } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message and sessionId are required' 
      });
    }

    // Store user message
    await db.query(`
      INSERT INTO ai_chat_sessions (session_id, message, sender, context, created_at)
      VALUES ($1, $2, 'user', $3, NOW())
    `, [sessionId, message, JSON.stringify(context)]);

    // Generate AI response based on message content
    const aiResponse = await generateAIResponse(message, context);

    // Store AI response
    await db.query(`
      INSERT INTO ai_chat_sessions (session_id, message, sender, context, created_at)
      VALUES ($1, $2, 'ai', $3, NOW())
    `, [sessionId, aiResponse.response, JSON.stringify(context)]);

    res.json({
      success: true,
      response: aiResponse.response,
      actions: aiResponse.actions || [],
      transferToSupport: aiResponse.transferToSupport || false
    });

  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Transfer to support endpoint
router.post('/transfer-to-support', async (req, res) => {
  try {
    const { sessionId, messages, lastMessage, context } = req.body;

    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'SessionId is required' 
      });
    }

    // Create a support ticket/conversation
    const result = await db.query(`
      INSERT INTO ai_support_transfers (
        session_id, 
        messages_history, 
        last_message, 
        context, 
        status, 
        created_at
      ) VALUES ($1, $2, $3, $4, 'pending', NOW())
      RETURNING id
    `, [
      sessionId, 
      JSON.stringify(messages), 
      lastMessage, 
      JSON.stringify(context)
    ]);

    // Mark session as transferred
    await db.query(`
      UPDATE ai_chat_sessions 
      SET transferred_to_support = true, transfer_id = $1
      WHERE session_id = $2
    `, [result.rows[0].id, sessionId]);

    res.json({
      success: true,
      transferId: result.rows[0].id,
      message: 'Conversación transferida al equipo de soporte'
    });

  } catch (error) {
    console.error('Error transferring to support:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Get support transfers for admin
router.get('/admin/transfers', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        id,
        session_id,
        last_message,
        context,
        status,
        created_at,
        resolved_at,
        resolved_by
      FROM ai_support_transfers 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      transfers: result.rows
    });

  } catch (error) {
    console.error('Error getting support transfers:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Get chat history for a transfer
router.get('/admin/transfers/:transferId/messages', async (req, res) => {
  try {
    const { transferId } = req.params;

    const result = await db.query(`
      SELECT messages_history, session_id
      FROM ai_support_transfers 
      WHERE id = $1
    `, [transferId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Transfer not found' 
      });
    }

    const transfer = result.rows[0];
    
    // Also get any additional messages from the session
    const sessionMessages = await db.query(`
      SELECT message, sender, created_at
      FROM ai_chat_sessions
      WHERE session_id = $1
      ORDER BY created_at ASC
    `, [transfer.session_id]);

    res.json({
      success: true,
      messages: JSON.parse(transfer.messages_history),
      sessionMessages: sessionMessages.rows
    });

  } catch (error) {
    console.error('Error getting transfer messages:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Resolve support transfer
router.patch('/admin/transfers/:transferId/resolve', async (req, res) => {
  try {
    const { transferId } = req.params;
    const { resolvedBy, notes } = req.body;

    await db.query(`
      UPDATE ai_support_transfers 
      SET 
        status = 'resolved',
        resolved_at = NOW(),
        resolved_by = $1,
        resolution_notes = $2
      WHERE id = $3
    `, [resolvedBy, notes, transferId]);

    res.json({
      success: true,
      message: 'Transfer resolved successfully'
    });

  } catch (error) {
    console.error('Error resolving transfer:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// AI Response Generation Function
async function generateAIResponse(message, context) {
  const lowerMessage = message.toLowerCase();
  
  // Knowledge base responses
  const responses = {
    // Greetings
    greeting: {
      keywords: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos', 'hey'],
      response: '¡Hola! Soy Genswave, tu asistente virtual. Estoy aquí para ayudarte con cualquier pregunta sobre nuestros servicios, procesos, precios o funcionalidades de la plataforma. ¿En qué puedo asistirte hoy?'
    },

    // Services
    services: {
      keywords: ['servicios', 'que ofrecen', 'que hacen', 'productos', 'soluciones'],
      response: 'Ofrecemos más de 20 servicios empresariales especializados:\n\n• **Plataformas Digitales** - Sistemas empresariales completos\n• **Gestión de Proyectos** - Asesoría integral para lanzar tu idea\n• **Automatización e IA** - Chatbots y asistentes virtuales\n• **Comercio Electrónico** - Tiendas online profesionales\n• **Marketing Digital** - Estrategias de crecimiento\n• **Gestión de Empleados** - RRHH digitalizado\n• **Social Media** - Gestión de redes sociales\n• **Logística y Tracking** - Seguimiento en tiempo real\n\nY muchos más. ¿Te interesa algún servicio en particular?',
      actions: [
        { type: 'navigate', url: '/servicios', label: 'Ver todos los servicios' }
      ]
    },

    // Pricing
    pricing: {
      keywords: ['precio', 'costo', 'cuanto cuesta', 'presupuesto', 'cotización', 'tarifa'],
      response: 'Nuestros precios varían según la complejidad y alcance del proyecto:\n\n• **Sitios web básicos**: Desde $5,000\n• **Aplicaciones web**: $15,000 - $50,000\n• **Sistemas empresariales**: $25,000 - $100,000+\n• **Soluciones personalizadas**: Cotización personalizada\n\nTodos los proyectos incluyen:\n✓ Consulta inicial gratuita\n✓ 30 días de soporte post-lanzamiento\n✓ Documentación completa\n✓ Capacitación del equipo\n\n¿Te gustaría una cotización personalizada?',
      actions: [
        { type: 'navigate', url: '/contacto', label: 'Solicitar cotización' }
      ]
    },

    // Process
    process: {
      keywords: ['proceso', 'como trabajan', 'metodología', 'pasos', 'etapas'],
      response: 'Nuestro proceso de trabajo consta de 5 etapas principales:\n\n**1. Consulta y Análisis** (1-2 semanas)\n• Reunión inicial para entender tus necesidades\n• Análisis de requerimientos técnicos\n• Propuesta detallada con cronograma\n\n**2. Diseño y Planificación** (2-3 semanas)\n• Wireframes y mockups\n• Arquitectura del sistema\n• Aprobación del diseño\n\n**3. Desarrollo** (4-12 semanas)\n• Desarrollo iterativo\n• Revisiones semanales\n• Testing continuo\n\n**4. Testing y Optimización** (1-2 semanas)\n• Pruebas exhaustivas\n• Optimización de rendimiento\n• Corrección de errores\n\n**5. Lanzamiento y Soporte** (1 semana)\n• Despliegue en producción\n• Capacitación del equipo\n• Soporte post-lanzamiento\n\n¿Te gustaría conocer más detalles sobre alguna etapa?',
      actions: [
        { type: 'navigate', url: '/proceso', label: 'Ver proceso completo' }
      ]
    },

    // Technologies
    technologies: {
      keywords: ['tecnologías', 'tecnologia', 'stack', 'herramientas', 'frameworks'],
      response: 'Utilizamos tecnologías modernas y probadas:\n\n**Frontend:**\n• React, Vue.js, Angular\n• HTML5, CSS3, JavaScript\n• Responsive Design\n\n**Backend:**\n• Node.js, Python, PHP\n• Express, Django, Laravel\n• APIs RESTful y GraphQL\n\n**Bases de Datos:**\n• PostgreSQL, MySQL, MongoDB\n• Redis para caché\n• Elasticsearch para búsquedas\n\n**Cloud & DevOps:**\n• AWS, Google Cloud, Azure\n• Docker, Kubernetes\n• CI/CD pipelines\n\n**IA y Machine Learning:**\n• OpenAI, TensorFlow\n• Procesamiento de lenguaje natural\n• Análisis predictivo\n\nSeleccionamos la stack más apropiada para cada proyecto según sus necesidades específicas.'
    },

    // Contact
    contact: {
      keywords: ['contacto', 'contactar', 'hablar', 'comunicar', 'telefono', 'email'],
      response: 'Puedes contactarnos de varias formas:\n\n📧 **Email:** info@genswave.org\n📧 **Soporte:** support@genswave.org\n📍 **Ubicación:** Distrito Nacional, Santo Domingo\n📱 **Instagram:** @genswave\n\n**Horarios de atención:**\nLunes a Viernes: 9:00 AM - 6:00 PM\nSábados: 9:00 AM - 2:00 PM\n\n¿Prefieres que te conecte con nuestro equipo de soporte humano?',
      actions: [
        { type: 'navigate', url: '/contacto', label: 'Formulario de contacto' },
        { type: 'transfer', label: 'Hablar con soporte' }
      ]
    },

    // Login/Account
    account: {
      keywords: ['login', 'cuenta', 'registrar', 'acceso', 'panel', 'dashboard'],
      response: 'Para acceder a tu panel de usuario:\n\n1. **Si ya tienes cuenta:** Haz clic en "Iniciar Sesión" en la esquina superior derecha\n2. **Si eres nuevo:** Puedes registrarte desde la misma página de login\n\n**En tu panel podrás:**\n• Ver el estado de tus proyectos\n• Comunicarte con nuestro equipo\n• Descargar documentos y recursos\n• Gestionar tus solicitudes\n• Acceder a reportes de progreso\n\n¿Necesitas ayuda para acceder a tu cuenta?',
      actions: [
        { type: 'navigate', url: '/login', label: 'Ir al login' }
      ]
    },

    // FAQ
    faq: {
      keywords: ['preguntas', 'faq', 'dudas', 'frecuentes', 'ayuda'],
      response: 'Aquí tienes respuestas a las preguntas más frecuentes:\n\n**¿Cuánto tiempo toma un proyecto?**\nDepende de la complejidad: 2-4 semanas para sitios básicos, 2-6 meses para aplicaciones complejas.\n\n**¿Ofrecen mantenimiento?**\nSí, tenemos planes mensuales de mantenimiento y 30 días de soporte gratuito post-lanzamiento.\n\n**¿Trabajan con clientes internacionales?**\nAbsolutamente, trabajamos con clientes de todo el mundo.\n\n**¿Qué pasa si no estoy satisfecho?**\nTrabajamos contigo hasta que estés completamente satisfecho con el resultado.\n\n¿Tienes alguna pregunta específica que no esté aquí?',
      actions: [
        { type: 'navigate', url: '/faq', label: 'Ver todas las FAQ' }
      ]
    },

    // Support request
    support: {
      keywords: ['soporte', 'ayuda', 'problema', 'error', 'no funciona', 'bug'],
      response: 'Entiendo que necesitas ayuda técnica. Puedo asistirte con:\n\n• Problemas de acceso a tu cuenta\n• Dudas sobre funcionalidades\n• Reportar errores o bugs\n• Solicitar nuevas características\n• Consultas sobre tu proyecto\n\n¿Podrías describir específicamente qué problema estás experimentando? Si es algo técnico complejo, puedo conectarte directamente con nuestro equipo de soporte.',
      actions: [
        { type: 'transfer', label: 'Conectar con soporte técnico' }
      ]
    }
  };

  // Find matching response
  let matchedResponse = null;
  let maxMatches = 0;

  for (const [key, responseData] of Object.entries(responses)) {
    const matches = responseData.keywords.filter(keyword => 
      lowerMessage.includes(keyword)
    ).length;

    if (matches > maxMatches) {
      maxMatches = matches;
      matchedResponse = responseData;
    }
  }

  // Default response if no match found
  if (!matchedResponse || maxMatches === 0) {
    // Check if user is asking for human support
    if (lowerMessage.includes('humano') || lowerMessage.includes('persona') || 
        lowerMessage.includes('agente') || lowerMessage.includes('operador')) {
      return {
        response: 'Por supuesto, te conectaré con nuestro equipo de soporte humano. Un agente revisará tu consulta y te responderá pronto.',
        transferToSupport: true
      };
    }

    return {
      response: 'Gracias por tu mensaje. Puedo ayudarte con información sobre:\n\n• Nuestros servicios y soluciones\n• Precios y cotizaciones\n• Proceso de trabajo\n• Tecnologías que utilizamos\n• Contacto y soporte\n• Preguntas frecuentes\n\n¿Sobre qué te gustaría saber más? O si prefieres, puedo conectarte con nuestro equipo de soporte humano.',
      actions: [
        { type: 'transfer', label: 'Hablar con soporte humano' }
      ]
    };
  }

  return {
    response: matchedResponse.response,
    actions: matchedResponse.actions || []
  };
}

export default router;