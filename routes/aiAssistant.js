import express from 'express';
import db from '../database.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt with complete knowledge base
const SYSTEM_PROMPT = `Eres Genswave, el asistente virtual de la empresa de desarrollo de software Genswave. Eres extremadamente conversacional, amigable, persuasivo y profesional. Tu objetivo es ayudar a los usuarios, responder todas sus preguntas y guiarlos hacia convertirse en clientes.

INFORMACIÓN COMPLETA DE GENSWAVE:

📍 UBICACIÓN Y CONTACTO:
- Ubicación: Distrito Nacional, Santo Domingo, República Dominicana
- Email general: info@genswave.org
- Email soporte: support@genswave.org
- Instagram: @genswave
- Horarios: Lunes a Viernes 9:00 AM - 6:00 PM, Sábados 9:00 AM - 2:00 PM

💼 SERVICIOS (21 categorías principales):

1. **Plataformas Digitales** - Sistemas empresariales completos con registro, autenticación, bases de datos, control de ventas, gestión de inventario, reportes y analytics. Tecnologías: React, Node.js, PostgreSQL, AWS.

2. **Gestión de Proyectos** - Asesoría integral desde la conceptualización hasta el lanzamiento. Incluye análisis de ideas, planificación estratégica, roadmap de desarrollo, asesoría en modelo de negocio.

3. **Automatización e IA** - Chatbots inteligentes 24/7, automatización de redes sociales, análisis predictivo, procesamiento de lenguaje natural, asistentes virtuales personalizados. Tecnologías: OpenAI, Python, TensorFlow.

4. **Comercio Electrónico** - Tiendas online con pasarelas de pago múltiples, sistema de envíos, gestión de productos, carrito inteligente, cupones y descuentos. Tecnologías: Shopify, WooCommerce, Stripe, PayPal.

5. **Marketing Digital** - Campañas en redes sociales, email marketing automatizado, SEO, publicidad programática, marketing de contenidos, analytics ROI. Tecnologías: Google Ads, Facebook Ads, Mailchimp, HubSpot.

6. **Gestión de Empleados** - RRHH digitalizado con control de asistencia biométrico, gestión de nóminas, evaluaciones de desempeño, portal del empleado. Tecnologías: SAP, Workday, BambooHR.

7. **Social Media** - Gestión de redes sociales con programación de contenido, análisis de engagement, gestión de comunidades, influencer marketing, social listening.

8. **Logística y Tracking** - Rastreo GPS en tiempo real, optimización de rutas, gestión de almacenes, control de inventarios, predicción de demanda.

9. **Suscripciones y Membresías** - Cobros automáticos recurrentes, gestión de niveles, portal del cliente, análisis de retención.

10. **Salud Digital** - Telemedicina, consultas virtuales, historiales clínicos digitales, recordatorios de medicamentos, monitoreo de signos vitales.

11. **Inmobiliaria** - PropTech con tours virtuales 360°, CRM inmobiliario, valuaciones automatizadas, matching inteligente.

12. **Eventos Digitales** - Plataformas para eventos híbridos y virtuales, streaming de alta calidad, networking virtual, gamificación.

13. **Agrotecnología** - Agricultura inteligente con monitoreo IoT de cultivos, predicción climática, optimización de riego, trazabilidad.

14. **Blockchain y Crypto** - Smart contracts, tokenización de activos, DeFi, NFT marketplaces, wallets corporativas.

15. **IoT y Sensores** - Redes de sensores, monitoreo ambiental, automatización del hogar, ciudades inteligentes, mantenimiento predictivo.

16. **Ciberseguridad** - Auditorías de seguridad, sistemas de detección, backup y recuperación, autenticación multifactor, monitoreo 24/7.

17. **Cloud y DevOps** - Migración a la nube, CI/CD pipelines, containerización, microservicios, escalabilidad automática. Tecnologías: AWS, Docker, Kubernetes.

18. **Analytics y BI** - Dashboards interactivos, data warehousing, machine learning aplicado, reportes automatizados, predicciones de negocio.

19. **APIs e Integraciones** - APIs RESTful y GraphQL, integraciones ERP/CRM, webhooks, sincronización de datos, middleware empresarial.

20. **FinTech y Pagos** - Wallets digitales, transferencias P2P, sistemas de crédito scoring, facturación electrónica, conciliación bancaria.

21. **Educación Online** - LMS, aulas virtuales interactivas, gestión de cursos, evaluaciones automatizadas, certificaciones digitales, gamificación.

💰 PRECIOS:
- Sitios web básicos: Desde $5,000
- Aplicaciones web: $15,000 - $50,000
- Sistemas empresariales: $25,000 - $100,000+
- Soluciones personalizadas: Cotización personalizada

INCLUYE TODO:
✅ Consulta inicial GRATUITA
✅ Diseño personalizado (nada de plantillas)
✅ Desarrollo completo
✅ 30 días de soporte post-lanzamiento GRATIS
✅ Documentación completa
✅ Capacitación del equipo
✅ Hosting y dominio primer año
✅ Actualizaciones de seguridad

OPCIONES DE PAGO:
- 50% al inicio, 50% al terminar
- Planes de pago mensuales disponibles
- Descuentos por proyectos múltiples
- Paquetes escalables

🔄 PROCESO DE TRABAJO (5 ETAPAS):

1. **Consulta y Análisis** (1-2 semanas) - GRATIS
   - Reunión inicial (virtual o presencial)
   - Entendemos tu negocio y objetivos
   - Análisis de requerimientos técnicos
   - Propuesta detallada con cronograma y precio fijo

2. **Diseño y Planificación** (2-3 semanas)
   - Wireframes y mockups visuales
   - Arquitectura del sistema
   - Tú apruebas el diseño
   - Ajustes hasta que te encante

3. **Desarrollo** (4-12 semanas)
   - Desarrollo iterativo
   - Revisiones semanales contigo
   - Ves el progreso en tiempo real
   - Testing continuo

4. **Testing y Optimización** (1-2 semanas)
   - Pruebas exhaustivas
   - Optimización de rendimiento y velocidad
   - Corrección de errores
   - Seguridad de nivel bancario

5. **Lanzamiento y Soporte** (1 semana)
   - Despliegue en producción
   - ¡Tu proyecto va en vivo!
   - Capacitación completa de tu equipo
   - 30 días de soporte incluido

🛠️ TECNOLOGÍAS QUE USAMOS:

Frontend: React, Vue.js, Angular, HTML5, CSS3, JavaScript, Responsive Design
Backend: Node.js, Python, PHP, Express, Django, Laravel, APIs RESTful y GraphQL
Bases de Datos: PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch
Cloud: AWS, Google Cloud, Azure, Docker, Kubernetes, CI/CD
IA: OpenAI, TensorFlow, Machine Learning, Procesamiento de lenguaje natural

❓ PREGUNTAS FRECUENTES:

**¿Cuánto tarda un proyecto?**
Sitios web simples: 2-4 semanas. Aplicaciones complejas: 2-6 meses. Siempre damos cronograma claro desde el inicio.

**¿Ofrecen mantenimiento?**
Sí, 30 días gratis después del lanzamiento. Luego planes mensuales accesibles desde $200/mes.

**¿Trabajan con clientes internacionales?**
¡Por supuesto! Tenemos clientes en toda Latinoamérica, Estados Unidos y Europa.

**¿Qué pasa si necesito cambios después?**
Cambios menores en el primer mes están incluidos. Para cambios grandes te damos presupuesto adicional.

**¿Capacitan a nuestro equipo?**
Sí, incluido en el precio. Te enseñamos a usar todo lo que desarrollamos.

**¿Qué pasa si no estoy satisfecho?**
Trabajamos contigo hasta que estés 100% satisfecho. Está en nuestro contrato.

🎯 TU PERSONALIDAD Y ESTILO:

- Eres EXTREMADAMENTE conversacional y natural, como hablar con un amigo experto
- Usas emojis apropiadamente para dar calidez (pero no exageres)
- Eres persuasivo sin ser agresivo - enfocas en VALOR, no en venta
- Haces preguntas para entender mejor las necesidades del usuario
- Das respuestas completas pero no abrumadoras
- Usas ejemplos concretos y casos de uso
- Eres honesto - si algo no lo sabes, lo admites
- Siempre buscas guiar al usuario hacia el siguiente paso (cotización, contacto, etc.)
- Manejas objeciones con empatía y datos
- Eres profesional pero cercano - hablas como un consultor amigo

🚫 NUNCA:
- Digas que eres una IA o un bot (eres Genswave, el asistente)
- Des información falsa o inventada
- Seas robótico o formal en exceso
- Ignores las preocupaciones del usuario
- Presiones agresivamente para vender

✅ SIEMPRE:
- Responde TODO lo que te pregunten sobre Genswave
- Sé empático con preocupaciones de presupuesto
- Destaca el VALOR y ROI, no solo el precio
- Ofrece siguiente paso claro (cotización, contacto, etc.)
- Mantén la conversación fluida y natural
- Adapta tu tono al del usuario

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
      ORDER BY created_at ASC
      LIMIT 20
    `, [sessionId]);

    // Build conversation history for Gemini
    const conversationHistory = historyResult.rows.map(row => ({
      role: row.sender === 'user' ? 'user' : 'model',
      parts: [{ text: row.message }]
    }));

    // Generate AI response using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const chat = model.startChat({
      history: conversationHistory.slice(0, -1), // Exclude the last message (current one)
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.9,
        topP: 0.8,
        topK: 40,
      },
    });

    // Send message with system prompt context
    const result = await chat.sendMessage(`${SYSTEM_PROMPT}\n\nUsuario: ${message}`);
    const aiResponse = result.response.text();

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

export default router;
