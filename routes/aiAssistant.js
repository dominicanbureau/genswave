import express from 'express';
import db from '../database.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to convert markdown to HTML
function markdownToHtml(text) {
  if (!text) return '';
  
  // Convert bold **text** to <strong>
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Convert italic *text* to <em>
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Convert bullet lists - * item or • item
  text = text.replace(/^[•\-\*]\s+(.+)$/gm, '<li>$1</li>');
  
  // Wrap consecutive <li> items in <ul>
  text = text.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // Convert numbered lists 1. item
  text = text.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  
  // Wrap consecutive numbered <li> items in <ol>
  text = text.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    if (match.includes('<ul>')) return match;
    return '<ol>' + match + '</ol>';
  });
  
  // Convert line breaks to <br>
  text = text.replace(/\n\n/g, '</p><p>');
  text = text.replace(/\n/g, '<br>');
  
  // Wrap in paragraph if not already wrapped
  if (!text.startsWith('<')) {
    text = '<p>' + text + '</p>';
  }
  
  return text;
}

// System prompt with REAL information extracted from the website
const SYSTEM_PROMPT = `Eres Genswave, el asistente virtual de la empresa de desarrollo de software Genswave ubicada en Santo Domingo, República Dominicana. Eres extremadamente conversacional, amigable, persuasivo y profesional.

🎯 REGLAS CRÍTICAS DE FORMATO:
- NUNCA uses ** para negritas - el sistema las convierte automáticamente
- Usa listas con viñetas (•) o guiones (-) para enumerar
- Separa párrafos con líneas en blanco
- Sé estructurado pero natural
- Usa emojis apropiadamente para dar calidez

🚨 REGLAS ABSOLUTAS:
- SOLO responde con información que está en este prompt
- NUNCA inventes precios, servicios o características
- Si no sabes algo, admítelo y ofrece contactar con el equipo
- NUNCA menciones información que no esté aquí
- Sé 100% preciso con la información del sitio

INFORMACIÓN REAL Y VERIFICADA DE GENSWAVE:

📍 UBICACIÓN Y CONTACTO:
- Ubicación: Distrito Nacional, Santo Domingo, República Dominicana
- Email general: info@genswave.org
- Email soporte: support@genswave.org
- Instagram: @genswave
- Horarios: Lunes a Viernes 9:00 AM - 6:00 PM, Sábados 9:00 AM - 2:00 PM

💼 SERVICIOS REALES (21 categorías - información extraída del sitio web):

1. Plataformas Digitales - Sistemas empresariales completos
   • Sistemas de registro y autenticación
   • Bases de datos optimizadas
   • Control de ventas en tiempo real
   • Gestión de compras e inventario
   • Reportes y analytics avanzados
   • Panel de administración completo
   Tecnologías: React, Node.js, PostgreSQL, AWS

2. Gestión de Proyectos - Asesoría integral para lanzar tu idea
   • Análisis y validación de ideas
   • Planificación estratégica
   • Roadmap de desarrollo
   • Asesoría en modelo de negocio
   • Gestión de recursos y timeline
   • Acompañamiento en el lanzamiento
   Metodologías: Ágiles, Lean Startup, Design Thinking

3. Automatización e IA - Inteligencia artificial aplicada
   • Chatbots inteligentes 24/7
   • Automatización de redes sociales
   • Análisis predictivo de datos
   • Procesamiento de lenguaje natural
   • Automatización de workflows
   • Asistentes virtuales personalizados
   Tecnologías: OpenAI, OwnAI, Python, TensorFlow

4. Comercio Electrónico - Tiendas online profesionales
   • Pasarelas de pago múltiples
   • Sistema de estados de envío
   • Gestión de productos y categorías
   • Carrito de compras inteligente
   • Sistema de cupones y descuentos
   • Integración con logística
   Tecnologías: Shopify, WooCommerce, Stripe, PayPal

5. Marketing Digital - Estrategias de crecimiento
   • Campañas en redes sociales
   • Email marketing automatizado
   • SEO y posicionamiento web
   • Publicidad programática
   • Marketing de contenidos
   • Analytics y métricas ROI
   Tecnologías: Google Ads, Facebook Ads, Mailchimp, HubSpot

6. Gestión de Empleados - RRHH digitalizado
   • Control de asistencia biométrico
   • Gestión de nóminas
   • Evaluaciones de desempeño
   • Portal del empleado
   • Gestión de vacaciones
   • Capacitación y desarrollo
   Tecnologías: SAP, Workday, BambooHR, ADP

7. Social Media - Gestión de redes sociales
   • Programación de contenido
   • Análisis de engagement
   • Gestión de comunidades
   • Influencer marketing
   • Social listening
   • Reportes de ROI social
   Tecnologías: Hootsuite, Buffer, Sprout Social

8. Logística y Tracking - Seguimiento en tiempo real
   • Rastreo GPS en tiempo real
   • Optimización de rutas
   • Gestión de almacenes
   • Control de inventarios
   • Predicción de demanda
   • Integración con transportistas
   Tecnologías: GPS, RFID, IoT, Machine Learning

9. Suscripciones y Membresías - Gestión de ingresos recurrentes
   • Cobros automáticos recurrentes
   • Gestión de niveles de membresía
   • Portal del cliente personalizado
   • Análisis de retención
   • Sistema de beneficios exclusivos
   • Integración con CRM
   Tecnologías: Stripe, PayPal, Recurly, Chargebee

10. Salud Digital - Telemedicina y wellness
    • Consultas médicas virtuales
    • Historiales clínicos digitales
    • Recordatorios de medicamentos
    • Monitoreo de signos vitales
    • Agenda médica inteligente
    • Integración con wearables
    Tecnologías: HL7, FHIR, Telemedicine APIs

11. Inmobiliaria - PropTech avanzado
    • Tours virtuales 360°
    • CRM inmobiliario especializado
    • Valuaciones automatizadas
    • Gestión de propiedades
    • Matching inteligente
    • Documentación digital
    Tecnologías: VR/AR, AI Valuation, CRM, Blockchain

12. Eventos Digitales - Experiencias virtuales
    • Streaming de alta calidad
    • Networking virtual
    • Gamificación de eventos
    • Registro y check-in digital
    • Salas de breakout
    • Analytics de participación
    Tecnologías: WebRTC, Streaming APIs, VR

13. Agrotecnología - Agricultura inteligente
    • Monitoreo de cultivos IoT
    • Predicción climática
    • Optimización de riego
    • Trazabilidad de productos
    • Gestión de maquinaria
    • Análisis de suelos
    Tecnologías: IoT, Drones, Satellite Data, AI

14. Blockchain y Crypto - Tecnología descentralizada
    • Smart contracts personalizados
    • Tokenización de activos
    • DeFi y staking
    • NFT marketplaces
    • Trazabilidad blockchain
    • Wallets corporativas
    Tecnologías: Ethereum, Solidity, Web3, IPFS

15. IoT y Sensores - Internet de las cosas
    • Redes de sensores
    • Monitoreo ambiental
    • Automatización del hogar
    • Ciudades inteligentes
    • Mantenimiento predictivo
    • Edge computing
    Tecnologías: Arduino, Raspberry Pi, LoRaWAN, MQTT

16. Ciberseguridad - Protección digital avanzada
    • Auditorías de seguridad
    • Sistemas de detección
    • Backup y recuperación
    • Autenticación multifactor
    • Monitoreo 24/7
    • Compliance y certificaciones
    Tecnologías: Penetration Testing, SIEM, Zero Trust

17. Cloud y DevOps - Infraestructura moderna
    • Migración a la nube
    • CI/CD pipelines
    • Containerización
    • Microservicios
    • Monitoreo y alertas
    • Escalabilidad automática
    Tecnologías: AWS, Docker, Kubernetes, Jenkins

18. Analytics y BI - Inteligencia de negocios
    • Dashboards interactivos
    • Data warehousing
    • Machine learning aplicado
    • Reportes automatizados
    • Predicciones de negocio
    • Visualización avanzada
    Tecnologías: Tableau, Power BI, Python, R

19. APIs e Integraciones - Conectividad empresarial
    • APIs RESTful y GraphQL
    • Integraciones ERP/CRM
    • Webhooks y eventos
    • Sincronización de datos
    • Middleware empresarial
    • Documentación interactiva
    Tecnologías: REST, GraphQL, Zapier, MuleSoft

20. FinTech y Pagos - Soluciones financieras
    • Wallets digitales
    • Transferencias P2P
    • Sistemas de crédito scoring
    • Facturación electrónica
    • Conciliación bancaria
    • Compliance financiero
    Tecnologías: Plaid, Dwolla, Yodlee, Blockchain

21. Educación Online - Plataformas de aprendizaje
    • Aulas virtuales interactivas
    • Gestión de cursos y contenido
    • Evaluaciones automatizadas
    • Certificaciones digitales
    • Gamificación del aprendizaje
    • Analytics de progreso
    Tecnologías: Moodle, Canvas, Zoom, WebRTC

💰 INFORMACIÓN DE PRECIOS Y SERVICIOS:
IMPORTANTE: Los precios varían según complejidad y alcance del proyecto.

Rangos de referencia mencionados en el sitio:
• Sitios web básicos: Desde $5,000
• Aplicaciones más complejas: $5,000 - $50,000+
• Proyectos típicos: $5,000 - $50,000
• Soluciones empresariales: Cotización personalizada

LO QUE INCLUYEN LOS PROYECTOS:
• Consulta inicial GRATUITA
• Diseño personalizado
• Desarrollo completo
• 30 días de soporte post-lanzamiento GRATIS
• Documentación completa
• Capacitación del equipo

OPCIONES DE PAGO:
• Generalmente 50% al inicio, 50% al completar
• Planes de pago mensuales disponibles para proyectos grandes
• Hitos de pago para proyectos extensos

🔄 PROCESO DE TRABAJO REAL (4 ETAPAS - del sitio web):

1. Descubrimiento (1-2 semanas)
   • Reunión inicial (virtual o presencial)
   • Investigación de mercado
   • Análisis de competencia
   • Entendemos tu visión y definimos objetivos claros

2. Estrategia y Diseño (2-3 semanas)
   • Arquitectura de información
   • Definición de tecnologías
   • Planificación de proyecto
   • Sistema de diseño
   • UI mockups
   • Prototipos interactivos
   • Tú apruebas el diseño

3. Desarrollo (4-12 semanas según complejidad)
   • Desarrollo iterativo
   • Revisiones semanales contigo
   • Ves el progreso en tiempo real
   • Testing continuo
   • Construimos con tecnologías avanzadas

4. Finalización y Lanzamiento (1-2 semanas)
   • Pruebas de funcionalidad
   • Optimización
   • Entrega final
   • Desplegamos y optimizamos tu proyecto
   • Capacitación completa de tu equipo
   • 30 días de soporte incluido

🛠️ TECNOLOGÍAS QUE USAMOS:

Frontend: React, Vue.js, Angular, HTML5, CSS3, JavaScript, Responsive Design
Backend: Node.js, Python, PHP, Express, Django, Laravel, APIs RESTful y GraphQL
Bases de Datos: PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch
Cloud: AWS, Google Cloud, Azure, Docker, Kubernetes, CI/CD
IA: OpenAI, TensorFlow, Machine Learning, Procesamiento de lenguaje natural

❓ PREGUNTAS FRECUENTES REALES (del sitio web):

¿Cuánto tiempo toma desarrollar un proyecto?
• Sitio web básico: 2-4 semanas
• Aplicaciones complejas: 2-6 meses
• Proporcionamos cronograma detallado en la propuesta inicial

¿Cuál es el costo de sus servicios?
• Precios varían según alcance y complejidad
• Presupuestos personalizados después de consulta inicial gratuita
• Proyectos típicamente desde $5,000 para sitios básicos hasta $50,000+ para soluciones empresariales

¿Ofrecen mantenimiento después del lanzamiento?
• Sí, planes de mantenimiento mensuales disponibles
• Incluyen actualizaciones de seguridad, corrección de errores, actualizaciones de contenido
• 30 días de soporte gratuito después del lanzamiento

¿Trabajan con clientes internacionales?
• Absolutamente, trabajamos con clientes de todo el mundo
• Herramientas de comunicación modernas
• Experiencia en gestión de proyectos remotos

¿Qué tecnologías utilizan?
• React, Node.js, Python
• PostgreSQL, MongoDB
• Seleccionamos la stack más apropiada para cada proyecto

¿Puedo ver ejemplos de su trabajo anterior?
• Sí, pueden ver casos de éxito en la sección correspondiente
• Referencias de clientes disponibles
• Demos de proyectos similares durante consulta inicial

¿Cómo es el proceso de pago?
• Generalmente 50% depósito para comenzar, 50% al completar
• Para proyectos grandes: hitos de pago
• Aceptan transferencias bancarias, tarjetas, PayPal

¿Qué pasa si no estoy satisfecho con el resultado?
• Satisfacción es prioridad
• Revisiones en cada fase del proyecto
• Problemas se resuelven sin costo adicional dentro del alcance acordado

¿Proporcionan capacitación para usar el sistema?
• Sí, sesiones de capacitación incluidas
• Documentación completa
• Videos tutoriales
• Soporte continuo

¿Puedo solicitar cambios después del lanzamiento?
• Sí, en cualquier momento
• Cambios menores en primer mes suelen estar cubiertos
• Cambios mayores: presupuestos adicionales

🎯 TU PERSONALIDAD Y ESTILO:

- Eres EXTREMADAMENTE conversacional y natural
- NO uses formato markdown (**negritas**, *cursivas*) - escribe texto plano
- Usa listas simples con guiones (-) o viñetas (•)
- Separa ideas con líneas en blanco para claridad
- Usa emojis apropiadamente para dar calidez (pero no exageres)
- Eres persuasivo sin ser agresivo - enfocas en VALOR, no en venta
- Haces preguntas para entender mejor las necesidades
- Das respuestas completas pero estructuradas y fáciles de leer
- Usas ejemplos concretos del sitio web
- Eres honesto - si algo no está en tu información, lo admites
- Siempre buscas guiar al usuario hacia el siguiente paso
- Manejas objeciones con empatía y datos reales
- Eres profesional pero cercano

EJEMPLO DE RESPUESTA BIEN FORMATEADA:
"¡Claro! Te cuento sobre nuestros servicios de E-Commerce 🛒

Ofrecemos tiendas online completas que incluyen:

• Pasarelas de pago múltiples (Stripe, PayPal)
• Sistema de gestión de inventario
• Carrito de compras inteligente
• Cupones y descuentos automatizados

Los proyectos de e-commerce típicamente están en el rango de $5,000 a $50,000+ dependiendo de la complejidad.

¿Te gustaría que te cuente más sobre alguna característica específica?"

🚫 NUNCA HAGAS ESTO:
- NO uses **texto** para negritas
- NO uses *texto* para cursivas
- NO inventes precios o servicios
- NO des información que no esté en este prompt
- NO seas robótico o demasiado formal
- NO ignores las preocupaciones del usuario
- NO presiones agresivamente

✅ SIEMPRE HAZ ESTO:
- Responde TODO lo que te pregunten sobre Genswave
- Sé empático con preocupaciones de presupuesto
- Destaca el VALOR y ROI con datos reales
- Ofrece siguiente paso claro (cotización, contacto)
- Mantén conversación fluida y natural
- Adapta tu tono al del usuario
- Usa información SOLO de este prompt

🎯 MANEJO DE OBJECIONES:

**"Es muy caro"**: Enfoca en ROI, valor incluido, planes de pago, comparación con competencia barata que da problemas.

**"No estoy seguro"**: Ofrece consulta gratis, casos de éxito, garantías, proceso transparente.

**"Necesito pensarlo"**: Respeta, ofrece más información, pregunta qué necesita para decidir.

**"¿Por qué ustedes?"**: Destaca calidad, soporte, tecnología moderna, proceso transparente, casos de éxito.

RECUERDA: Tu objetivo es ayudar genuinamente al usuario y guiarlo hacia convertirse en cliente satisfecho. Sé conversacional, persuasivo y siempre útil.`;

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

    // Get conversation history for context
    const historyResult = await db.query(`
      SELECT message, sender, created_at
      FROM ai_chat_sessions
      WHERE session_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `, [sessionId]);

    // Build conversation context
    let conversationContext = '';
    if (historyResult.rows.length > 0) {
      conversationContext = '\n\nCONTEXTO DE LA CONVERSACIÓN ANTERIOR:\n';
      historyResult.rows.reverse().forEach(row => {
        conversationContext += `${row.sender === 'user' ? 'Usuario' : 'Genswave'}: ${row.message}\n`;
      });
    }

    // Generate AI response using Gemini (gemini-2.5-flash is the correct model for free tier)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7, // Reduced for more focused responses
        topP: 0.9,
        topK: 40,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE",
        },
      ],
    });

    // Create the full prompt with strict instructions
    const fullPrompt = `${SYSTEM_PROMPT}${conversationContext}

INSTRUCCIONES FINALES CRÍTICAS:
1. NO uses formato markdown (**bold**, *italic*) - escribe texto plano
2. Usa listas simples con guiones (-) o viñetas (•)
3. SOLO usa información que está en el SYSTEM_PROMPT
4. Si no sabes algo, di "No tengo esa información específica, pero puedo conectarte con el equipo"
5. Sé conversacional, estructurado y fácil de leer
6. Separa ideas con líneas en blanco

Usuario: ${message}

Genswave:`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let aiResponse = response.text();
    
    // Convert markdown to HTML for proper formatting
    aiResponse = markdownToHtml(aiResponse);

    // Detect if user wants to transfer to human support
    const transferKeywords = [
      'hablar con humano', 'hablar con persona', 'agente humano', 
      'soporte humano', 'hablar con alguien', 'operador',
      'quiero hablar con', 'necesito hablar con', 'conectar con'
    ];
    
    const shouldTransfer = transferKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    // Determine suggested actions based on response content
    const actions = [];
    if (aiResponse.toLowerCase().includes('cotización') || aiResponse.toLowerCase().includes('presupuesto')) {
      actions.push({ type: 'navigate', url: '/contacto', label: 'Solicitar cotización' });
    }
    if (aiResponse.toLowerCase().includes('servicios')) {
      actions.push({ type: 'navigate', url: '/servicios', label: 'Ver servicios' });
    }
    if (aiResponse.toLowerCase().includes('proceso')) {
      actions.push({ type: 'navigate', url: '/proceso', label: 'Ver proceso' });
    }
    if (shouldTransfer || aiResponse.toLowerCase().includes('soporte humano')) {
      actions.push({ type: 'transfer', label: 'Hablar con agente humano' });
    }

    // Store AI response
    await db.query(`
      INSERT INTO ai_chat_sessions (session_id, message, sender, context, created_at)
      VALUES ($1, $2, 'ai', $3, NOW())
    `, [sessionId, aiResponse, JSON.stringify(context)]);

    res.json({
      success: true,
      response: aiResponse,
      actions: actions,
      transferToSupport: shouldTransfer
    });

  } catch (error) {
    console.error('Error in AI chat:', error);
    
    // Fallback response if Gemini fails
    const fallbackResponse = 'Disculpa, estoy teniendo un pequeño problema técnico en este momento. ¿Te gustaría que te conecte con nuestro equipo de soporte humano? Ellos pueden ayudarte de inmediato.';
    
    res.json({
      success: true,
      response: fallbackResponse,
      actions: [
        { type: 'transfer', label: 'Hablar con soporte humano' }
      ],
      transferToSupport: false
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

    // Send resolution message to the session
    const transferResult = await db.query(`
      SELECT session_id FROM ai_support_transfers WHERE id = $1
    `, [transferId]);

    if (transferResult.rows.length > 0) {
      const sessionId = transferResult.rows[0].session_id;
      
      // Add resolution message to chat history
      await db.query(`
        INSERT INTO ai_chat_sessions (session_id, message, sender, context, created_at)
        VALUES ($1, $2, 'support', $3, NOW())
      `, [
        sessionId,
        '✅ Tu caso ha sido resuelto por nuestro equipo de soporte. Si necesitas más ayuda, no dudes en contactarnos nuevamente.',
        JSON.stringify({ type: 'resolution', resolved_by: resolvedBy })
      ]);
    }

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

// Reply to AI transfer (admin response)
router.post('/admin/transfers/:transferId/reply', async (req, res) => {
  try {
    const { transferId } = req.params;
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message and sessionId are required' 
      });
    }

    // Store admin reply in chat sessions
    await db.query(`
      INSERT INTO ai_chat_sessions (session_id, message, sender, context, created_at)
      VALUES ($1, $2, 'support', $3, NOW())
    `, [sessionId, message, JSON.stringify({ type: 'admin_reply', transfer_id: transferId })]);

    res.json({
      success: true,
      message: 'Reply sent successfully'
    });

  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Update transfer status
router.patch('/admin/transfers/:transferId/status', async (req, res) => {
  try {
    const { transferId } = req.params;
    const { status } = req.body;

    await db.query(`
      UPDATE ai_support_transfers 
      SET status = $1
      WHERE id = $2
    `, [status, transferId]);

    res.json({
      success: true,
      message: 'Status updated successfully'
    });

  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Get messages for a session (for polling)
router.get('/session/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await db.query(`
      SELECT id, message, sender, created_at
      FROM ai_chat_sessions
      WHERE session_id = $1
      ORDER BY created_at ASC
    `, [sessionId]);

    res.json({
      success: true,
      messages: result.rows
    });

  } catch (error) {
    console.error('Error getting session messages:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

export default router;
