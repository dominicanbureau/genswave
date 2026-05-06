import express from 'express';
import db from '../database.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchKnowledge } from '../utils/ragIndexer.js';

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Refined Spanish names for support agents
const SUPPORT_NAMES = {
  firstNames: [
    'Sebastián', 'Valentina', 'Alejandro', 'Isabella', 'Nicolás',
    'Sofía', 'Matías', 'Camila', 'Santiago', 'Luciana',
    'Gabriel', 'Victoria', 'Leonardo', 'Catalina', 'Maximiliano',
    'Emilia', 'Rafael', 'Martina', 'Adrián', 'Antonella'
  ],
  lastNames: [
    'Mendoza', 'Castellanos', 'Valenzuela', 'Santamaría', 'Villarreal',
    'Montalvo', 'Cervantes', 'Delgado', 'Navarro', 'Quintero',
    'Salazar', 'Vega', 'Morales', 'Herrera', 'Rojas'
  ]
};

// Generate a random support agent name
function generateSupportAgentName(sessionId) {
  // Use sessionId as seed for consistency
  const seed = sessionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const firstNameIndex = seed % SUPPORT_NAMES.firstNames.length;
  const lastNameIndex = (seed * 7) % SUPPORT_NAMES.lastNames.length;
  
  return `${SUPPORT_NAMES.firstNames[firstNameIndex]} ${SUPPORT_NAMES.lastNames[lastNameIndex]}`;
}

// Helper function to convert markdown to HTML
function markdownToHtml(text) {
  if (!text) return '';
  
  let html = text;
  
  // First, convert numbered lists (1. item)
  html = html.replace(/^(\d+)\.\s+(.+)$/gm, '<li>$2</li>');
  
  // Wrap consecutive numbered <li> in <ol>
  html = html.replace(/(<li>.*?<\/li>\s*)+/gs, (match) => {
    return '<ol>' + match + '</ol>';
  });
  
  // Convert bullet points (- item or • item or * item)
  html = html.replace(/^[•\-\*]\s+(.+)$/gm, '<li>$1</li>');
  
  // Wrap remaining <li> in <ul>
  html = html.replace(/(<li>(?!.*<\/ol>).*?<\/li>\s*)+/gs, (match) => {
    if (match.includes('<ol>')) return match;
    return '<ul>' + match + '</ul>';
  });
  
  // Convert bold **text** to <strong>
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Convert italic *text* to <em> (but not if it's part of **)
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  
  // Convert double line breaks to paragraph breaks
  html = html.replace(/\n\n+/g, '</p><p>');
  
  // Convert single line breaks to <br>
  html = html.replace(/\n/g, '<br>');
  
  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<')) {
    html = '<p>' + html + '</p>';
  }
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>\s*<\/p>/g, '');
  
  return html;
}

// System prompt with REAL information extracted from the website
const SYSTEM_PROMPT = `Eres el asistente virtual de Genswave, empresa de desarrollo de software en Santo Domingo, República Dominicana.

🚨 REGLAS ABSOLUTAS - LÉELAS CUIDADOSAMENTE:

1. FORMATO DE RESPUESTA:
   - NO uses asteriscos (*) ni guiones bajos (_) para formato
   - Escribe texto plano y natural
   - Usa números para listas (1. 2. 3.)
   - Separa párrafos con doble salto de línea
   - Usa emojis con moderación

2. INFORMACIÓN:
   - SOLO responde con información que está EXPLÍCITAMENTE en este prompt
   - Si no sabes algo, di: "No tengo esa información específica, pero puedo conectarte con el equipo"
   - NUNCA inventes precios, servicios o características
   - NUNCA menciones cosas que no están aquí

3. ESTILO:
   - Conversacional y amigable
   - Respuestas estructuradas pero naturales
   - Párrafos cortos y fáciles de leer
   - Enfócate en VALOR, no en vender

EJEMPLO DE RESPUESTA CORRECTA:
"¡Claro! Te cuento sobre nuestro servicio de E-Commerce 🛒

Ofrecemos tiendas online completas que incluyen:

1. Pasarelas de pago múltiples (Stripe, PayPal)
2. Sistema de gestión de inventario en tiempo real
3. Carrito de compras inteligente
4. Sistema de cupones y descuentos automatizados

Los proyectos de e-commerce típicamente están en el rango de $5,000 a $50,000+ dependiendo de la complejidad y funcionalidades específicas que necesites.

¿Te gustaría que te cuente más sobre alguna característica en particular?"

---

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

🔑 CÓDIGOS QUICK (QUICK CODES):

¿Qué es un Código Quick?
• Es un código especial de acceso rápido que te permite crear una cuenta en Genswave sin necesidad de registro manual
• Te lo proporciona el equipo de Genswave después de una consulta o reunión
• Es un código alfanumérico único (ejemplo: ABC123)

¿Cómo usar un Código Quick?
1. Ve a la página de login/registro en genswave.org
2. Busca la opción "¿Tienes un código Quick?"
3. Ingresa tu código (en mayúsculas)
4. El sistema creará automáticamente tu cuenta con los datos que ya tenemos
5. Serás redirigido a tu dashboard personal

Características de los Códigos Quick:
• Son de un solo uso
• Tienen fecha de expiración
• Crean tu cuenta automáticamente
• Te dan acceso inmediato al dashboard
• No necesitas crear contraseña manualmente (se genera una temporal)

Si tienes un Código Quick:
• Úsalo lo antes posible antes de que expire
• Si no funciona, contacta a support@genswave.org
• Si lo perdiste, pide uno nuevo al equipo

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

// AI Assistant Chat endpoint with RAG
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId, context } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message and sessionId are required' 
      });
    }

    // Check if session is transferred to support
    const transferCheck = await db.query(`
      SELECT id, status FROM ai_support_transfers 
      WHERE session_id = $1 
      AND status IN ('pending', 'in_progress')
      ORDER BY created_at DESC 
      LIMIT 1
    `, [sessionId]);

    // If transferred, don't respond with AI - let admin handle it
    if (transferCheck.rows.length > 0) {
      // Store user message but don't generate AI response
      await db.query(`
        INSERT INTO ai_chat_sessions (session_id, message, sender, context, created_at)
        VALUES ($1, $2, 'user', $3, NOW())
      `, [sessionId, message, JSON.stringify(context)]);

      // Don't send any automatic response - just acknowledge receipt
      return res.json({
        success: true,
        transferred: true,
        silent: true // Flag to indicate no message should be shown
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

    // 🧠 RAG: Search for relevant knowledge
    console.log('🔍 Searching knowledge base for:', message);
    const relevantKnowledge = await searchKnowledge(message, 10);
    
    let ragContext = '';
    if (relevantKnowledge && relevantKnowledge.length > 0) {
      ragContext = '\n\n📚 CONTEXTO INTERNO (USA ESTO PARA ENTENDER, PERO NO MENCIONES DETALLES TÉCNICOS AL USUARIO):\n\n';
      relevantKnowledge.forEach((item, index) => {
        ragContext += `[${index + 1}] ${item.content.substring(0, 400)}...\n\n`;
      });
      console.log(`✅ Found ${relevantKnowledge.length} relevant knowledge chunks`);
    } else {
      console.log('ℹ️  No relevant knowledge found, using base prompt');
    }

    // Generate AI response using Gemini
    const model = genAI.getGenerativeModel({ 
      model: "models/gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.5,
        topP: 0.85,
        topK: 30,
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

    // Create the full prompt with RAG context
    const fullPrompt = `${SYSTEM_PROMPT}${ragContext}${conversationContext}

🚨 INSTRUCCIONES FINALES ABSOLUTAS:

1. NUNCA JAMÁS menciones al usuario:
   - Código (CSS, JavaScript, Python, etc.)
   - Nombres de modelos de IA (embeddings, GPT, etc.)
   - Nombres de funciones, variables o archivos
   - Implementaciones técnicas (useState, router, db.query, etc.)
   - Configuraciones de servidor o base de datos
   - Border-radius, estilos, o cualquier detalle de programación

2. El contexto interno puede contener código técnico - ÚSALO para entender el sistema, pero NUNCA lo menciones al usuario

3. SOLO habla al usuario sobre:
   - Servicios que ofrecemos
   - Precios y planes de pago
   - Proceso de trabajo
   - Beneficios para el cliente
   - Cómo contactarnos
   - Quick Codes (si pregunta)
   - Información de negocio

4. Si el usuario solo dice "hola" o saluda:
   - Responde con un saludo amigable y breve
   - Pregunta en qué puedes ayudar
   - NO des información no solicitada
   - Mantén la respuesta corta (2-3 líneas máximo)

5. NO uses asteriscos (*) ni guiones bajos (_) para formato
6. Escribe en texto plano, conversacional y natural
7. Sé COMPLETO solo cuando te hagan una pregunta específica
8. Responde de forma profesional pero amigable

Usuario: ${message}

Genswave (responde de forma APROPIADA al mensaje del usuario, SIN mencionar detalles técnicos):`;

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

    // Generate a unique support agent name for this transfer
    const agentName = generateSupportAgentName(sessionId);

    // Create a support ticket/conversation
    const result = await db.query(`
      INSERT INTO ai_support_transfers (
        session_id, 
        messages_history, 
        last_message, 
        context, 
        status,
        assigned_agent_name,
        created_at
      ) VALUES ($1, $2, $3, $4, 'pending', $5, NOW())
      RETURNING id
    `, [
      sessionId, 
      JSON.stringify(messages), 
      lastMessage, 
      JSON.stringify(context),
      agentName
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
      agentName: agentName,
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

    // Parse messages_history if it's a string, otherwise use as is
    let messagesHistory = transfer.messages_history;
    if (typeof messagesHistory === 'string') {
      try {
        messagesHistory = JSON.parse(messagesHistory);
      } catch (e) {
        messagesHistory = [];
      }
    }
    if (!Array.isArray(messagesHistory)) {
      messagesHistory = [];
    }

    res.json({
      success: true,
      messages: messagesHistory,
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

    console.log('🔧 Resolving transfer:', { transferId, resolvedBy });

    // Update transfer status
    await db.query(`
      UPDATE ai_support_transfers 
      SET 
        status = 'resolved',
        resolved_at = NOW(),
        resolved_by = $1,
        resolution_notes = $2
      WHERE id = $3
    `, [resolvedBy, notes, transferId]);

    console.log('✅ Transfer status updated');

    // Get session_id for this transfer
    const transferResult = await db.query(`
      SELECT session_id FROM ai_support_transfers WHERE id = $1
    `, [transferId]);

    if (transferResult.rows.length > 0) {
      const sessionId = transferResult.rows[0].session_id;
      
      console.log('📨 Sending resolution message to session:', sessionId);
      
      // Add resolution message to chat history
      await db.query(`
        INSERT INTO ai_chat_sessions (session_id, message, sender, context, created_at)
        VALUES ($1, $2, 'support', $3, NOW())
      `, [
        sessionId,
        '✅ Tu caso ha sido resuelto por nuestro equipo de soporte. Si necesitas más ayuda, no dudes en contactarnos nuevamente.',
        JSON.stringify({ type: 'resolution', resolved_by: resolvedBy })
      ]);

      console.log('✅ Resolution message sent');
    }

    res.json({
      success: true,
      message: 'Transfer resolved successfully'
    });

  } catch (error) {
    console.error('❌ Error resolving transfer:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor',
      details: error.message
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

    console.log('📤 Admin sending reply:', { transferId, sessionId, message: message.substring(0, 50) });

    // Get the assigned agent name for this transfer
    const transferData = await db.query(`
      SELECT assigned_agent_name FROM ai_support_transfers WHERE id = $1
    `, [transferId]);

    const agentName = transferData.rows[0]?.assigned_agent_name || 'Soporte Genswave';

    // Store admin reply in chat sessions with agent name
    const result = await db.query(`
      INSERT INTO ai_chat_sessions (session_id, message, sender, context, created_at)
      VALUES ($1, $2, 'support', $3, NOW())
      RETURNING id
    `, [sessionId, message, JSON.stringify({ 
      type: 'admin_reply', 
      transfer_id: parseInt(transferId),
      agent_name: agentName
    })]);

    console.log('✅ Reply stored with ID:', result.rows[0].id);

    res.json({
      success: true,
      message: 'Reply sent successfully',
      messageId: result.rows[0].id,
      agentName: agentName
    });

  } catch (error) {
    console.error('❌ Error sending reply:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor',
      details: error.message
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

    // Get the assigned agent name for this session if transferred
    const transferResult = await db.query(`
      SELECT assigned_agent_name FROM ai_support_transfers 
      WHERE session_id = $1 
      ORDER BY created_at DESC 
      LIMIT 1
    `, [sessionId]);

    const agentName = transferResult.rows[0]?.assigned_agent_name;

    // Add agent name to support messages
    const messagesWithAgent = result.rows.map(msg => {
      if (msg.sender === 'support') {
        return {
          ...msg,
          agent_name: agentName
        };
      }
      return msg;
    });

    res.json({
      success: true,
      messages: messagesWithAgent,
      agentName: agentName
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


// Mark session as inactive (chat closed)
router.post('/session/:sessionId/close', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Mark all transfers for this session as needing attention
    await db.query(`
      UPDATE ai_support_transfers 
      SET status = 'user_disconnected'
      WHERE session_id = $1 AND status != 'resolved'
    `, [sessionId]);

    res.json({
      success: true,
      message: 'Session marked as closed'
    });

  } catch (error) {
    console.error('Error closing session:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor'
    });
  }
});

// Check if session is still active
router.get('/session/:sessionId/status', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await db.query(`
      SELECT status FROM ai_support_transfers 
      WHERE session_id = $1 
      ORDER BY created_at DESC 
      LIMIT 1
    `, [sessionId]);

    res.json({
      success: true,
      active: result.rows.length === 0 || result.rows[0].status !== 'user_disconnected'
    });

  } catch (error) {
    console.error('Error checking session status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor'
    });
  }
});

// Delete disconnected transfer (admin action)
router.delete('/admin/transfers/:transferId', async (req, res) => {
  try {
    const { transferId } = req.params;

    // Get session_id before deleting
    const transferResult = await db.query(`
      SELECT session_id FROM ai_support_transfers WHERE id = $1
    `, [transferId]);

    if (transferResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Transfer not found'
      });
    }

    const sessionId = transferResult.rows[0].session_id;

    // Delete all messages for this session
    await db.query(`
      DELETE FROM ai_chat_sessions WHERE session_id = $1
    `, [sessionId]);

    // Delete the transfer
    await db.query(`
      DELETE FROM ai_support_transfers WHERE id = $1
    `, [transferId]);

    console.log(`✅ Deleted transfer ${transferId} and all messages for session ${sessionId}`);

    res.json({
      success: true,
      message: 'Transfer and messages deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting transfer:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor'
    });
  }
});

// Voice intent recognition endpoint
router.post('/voice-intent', async (req, res) => {
  try {
    const { command, context } = req.body;

    if (!command) {
      return res.status(400).json({ 
        success: false, 
        error: 'Command is required' 
      });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'models/gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500,
      }
    });

    const prompt = `Eres un asistente de navegación inteligente para Genswave, una empresa de desarrollo de software y tecnología.

Analiza el siguiente comando de voz del usuario y determina su intención:

Comando: "${command}"
Contexto actual: ${context.currentUrl}

ACCIONES DISPONIBLES:
1. NAVEGACIÓN a páginas:
   - "/" (inicio/home)
   - "/servicios" (servicios, qué hacemos, ofertas)
   - "/proceso" (proceso, metodología, cómo trabajamos)
   - "/contacto" (contacto, ubicación, información)
   - "/login" (login, registro, autenticación, crear cuenta, sign up)
   - "/privacidad" (privacidad, datos personales)
   - "/terminos" (términos, condiciones, legal)
   - "/cookies" (cookies, política de cookies)
   - "/preguntas-frecuentes" (FAQ, preguntas comunes)

2. ACCIONES ESPECIALES:
   - "openChat" - Abrir chat de soporte (para dudas, preguntas, ayuda, soporte, consultas, problemas)
   - "mailto" - Abrir correo electrónico (para enviar email, escribir correo)
   - "instagram" - Abrir Instagram (para redes sociales, IG, Instagram)

REGLAS:
- Si el usuario tiene una duda o pregunta sin especificar dónde ir → openChat
- Si menciona "registrarse" o "crear cuenta" → /login
- Si menciona "correo" o "email" → mailto
- Si menciona "instagram" o "redes" → instagram
- Si no entiendes bien → openChat (como fallback)

Responde SOLO con un JSON válido en este formato exacto:
{
  "destination": "/ruta" o null,
  "action": "openChat" o "mailto" o "instagram" o null,
  "response": "Mensaje corto y natural en español para el usuario",
  "confidence": 0.0 a 1.0
}

Ejemplo 1:
Comando: "quiero registrarme"
Respuesta: {"destination": "/login", "action": null, "response": "Te llevaré al registro", "confidence": 0.95}

Ejemplo 2:
Comando: "tengo una duda sobre precios"
Respuesta: {"destination": null, "action": "openChat", "response": "Abriendo el chat para ayudarte con tu consulta", "confidence": 0.9}

Ejemplo 3:
Comando: "quiero enviar un correo"
Respuesta: {"destination": null, "action": "mailto", "response": "Abriendo tu cliente de correo", "confidence": 0.95}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const intent = JSON.parse(jsonMatch[0]);

    res.json({
      success: true,
      intent: intent,
      rawCommand: command
    });

  } catch (error) {
    console.error('Error processing voice intent:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error processing voice command',
      details: error.message 
    });
  }
});

module.exports = router;
