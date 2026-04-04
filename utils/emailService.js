import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resendApiKey = process.env.RESEND_KEY || process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.error('❌ RESEND_KEY environment variable is not set');
}
const resend = new Resend(resendApiKey || 're_X3jJKunz_Q9mhaz7QGsfksisiUzxqLUZE');

// Enterprise-level email templates with visual design like major companies
const getEmailTemplate = (type, data) => {
  const baseStyle = `
    <style>
      /* Reset styles for maximum email client compatibility */
      body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
      img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
      
      /* Base styles */
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
        min-height: 100vh !important;
      }
      
      .email-wrapper {
        width: 100% !important;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        padding: 60px 20px !important;
        min-height: 100vh !important;
      }
      
      .email-container {
        max-width: 650px !important;
        margin: 0 auto !important;
        background-color: #ffffff !important;
        border-radius: 24px !important;
        overflow: hidden !important;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
        position: relative !important;
      }
      
      .header {
        background: linear-gradient(135deg, #000000 0%, #2d3748 50%, #1a202c 100%) !important;
        padding: 50px 40px 70px !important;
        text-align: center !important;
        position: relative !important;
        overflow: hidden !important;
      }
      
      .header::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.03)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.03)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.02)"/><circle cx="20" cy="80" r="0.5" fill="rgba(255,255,255,0.02)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') !important;
        opacity: 0.4 !important;
      }
      
      .logo-container {
        position: relative !important;
        z-index: 2 !important;
        margin-bottom: 20px !important;
      }
      
      .logo {
        font-size: 36px !important;
        font-weight: 800 !important;
        color: #ffffff !important;
        letter-spacing: -1px !important;
        margin: 0 !important;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
      }
      
      .header-subtitle {
        color: rgba(255, 255, 255, 0.8) !important;
        font-size: 15px !important;
        font-weight: 500 !important;
        text-transform: uppercase !important;
        letter-spacing: 2px !important;
        margin: 0 !important;
        position: relative !important;
        z-index: 2 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
      }
      
      .header-decoration {
        position: absolute !important;
        bottom: -10px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: 80px !important;
        height: 4px !important;
        background: linear-gradient(90deg, transparent, #ffffff, transparent) !important;
        border-radius: 2px !important;
      }
      
      .content {
        padding: 60px 50px !important;
        position: relative !important;
      }
      
      .greeting {
        font-size: 28px !important;
        font-weight: 700 !important;
        color: #1a202c !important;
        margin: 0 0 20px 0 !important;
        letter-spacing: -0.5px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        line-height: 1.2 !important;
      }
      
      .message {
        font-size: 17px !important;
        color: #4a5568 !important;
        margin: 0 0 40px 0 !important;
        line-height: 1.7 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
      }
      
      .card {
        background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%) !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 16px !important;
        padding: 32px !important;
        margin: 32px 0 !important;
        position: relative !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
      }
      
      .card::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        height: 4px !important;
        background: linear-gradient(90deg, #667eea, #764ba2) !important;
        border-radius: 16px 16px 0 0 !important;
      }
      
      .card-title {
        font-size: 20px !important;
        font-weight: 700 !important;
        color: #1a202c !important;
        margin: 0 0 20px 0 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        display: flex !important;
        align-items: center !important;
      }
      
      .feature-list {
        margin: 24px 0 !important;
        padding: 0 !important;
        list-style: none !important;
      }
      
      .feature-list li {
        padding: 12px 0 !important;
        color: #4a5568 !important;
        font-size: 15px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        display: flex !important;
        align-items: center !important;
      }
      
      .feature-list li::before {
        content: '' !important;
        width: 20px !important;
        height: 20px !important;
        background: linear-gradient(135deg, #48bb78, #38a169) !important;
        border-radius: 50% !important;
        margin-right: 16px !important;
        flex-shrink: 0 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="12" height="12"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>') !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        background-size: 12px !important;
      }
      
      .cta-container {
        text-align: center !important;
        margin: 40px 0 !important;
      }
      
      .cta-button {
        display: inline-block !important;
        background: linear-gradient(135deg, #000000 0%, #2d3748 100%) !important;
        color: #ffffff !important;
        padding: 18px 40px !important;
        text-decoration: none !important;
        border-radius: 12px !important;
        font-weight: 600 !important;
        font-size: 16px !important;
        text-transform: uppercase !important;
        letter-spacing: 1px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2) !important;
        transition: all 0.3s ease !important;
        position: relative !important;
        overflow: hidden !important;
      }
      
      .highlight-box {
        background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%) !important;
        border-left: 6px solid #3182ce !important;
        padding: 24px !important;
        border-radius: 12px !important;
        margin: 32px 0 !important;
        position: relative !important;
        box-shadow: 0 4px 12px rgba(49, 130, 206, 0.1) !important;
      }
      
      .highlight-box::before {
        content: '💡' !important;
        position: absolute !important;
        top: 24px !important;
        left: 24px !important;
        font-size: 20px !important;
        margin-right: 12px !important;
      }
      
      .highlight-box-content {
        margin-left: 40px !important;
        color: #2d3748 !important;
        font-weight: 500 !important;
      }
      
      .detail-table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin: 24px 0 !important;
        background: #ffffff !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
      }
      
      .detail-row {
        border-bottom: 1px solid #e2e8f0 !important;
      }
      
      .detail-row:last-child {
        border-bottom: none !important;
      }
      
      .detail-label {
        padding: 16px 20px !important;
        font-weight: 600 !important;
        color: #4a5568 !important;
        font-size: 14px !important;
        width: 40% !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        background: #f7fafc !important;
      }
      
      .detail-value {
        padding: 16px 20px !important;
        font-weight: 500 !important;
        color: #1a202c !important;
        font-size: 15px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
      }
      
      .status-badge {
        display: inline-flex !important;
        align-items: center !important;
        padding: 8px 16px !important;
        border-radius: 20px !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        letter-spacing: 1px !important;
        background: linear-gradient(135deg, #48bb78, #38a169) !important;
        color: #ffffff !important;
        box-shadow: 0 2px 4px rgba(72, 187, 120, 0.3) !important;
      }
      
      .status-badge::before {
        content: '✓' !important;
        margin-right: 6px !important;
        font-weight: bold !important;
      }
      
      .message-bubble {
        background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%) !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 16px !important;
        padding: 24px !important;
        margin: 24px 0 !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
        position: relative !important;
      }
      
      .admin-message {
        background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%) !important;
        border-left: 4px solid #48bb78 !important;
        border-radius: 16px !important;
      }
      
      .message-meta {
        font-size: 13px !important;
        color: #718096 !important;
        margin: 0 0 12px 0 !important;
        font-weight: 600 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        display: flex !important;
        align-items: center !important;
      }
      
      .message-meta::before {
        content: '' !important;
        width: 16px !important;
        height: 16px !important;
        background: linear-gradient(135deg, #667eea, #764ba2) !important;
        border-radius: 50% !important;
        margin-right: 8px !important;
      }
      
      .message-text {
        color: #1a202c !important;
        font-size: 15px !important;
        line-height: 1.7 !important;
        margin: 0 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
      }
      
      .footer {
        background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%) !important;
        padding: 40px 50px !important;
        text-align: center !important;
        position: relative !important;
      }
      
      .footer::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: 100px !important;
        height: 2px !important;
        background: linear-gradient(90deg, transparent, #4a5568, transparent) !important;
      }
      
      .footer-content {
        color: #a0aec0 !important;
        font-size: 14px !important;
        line-height: 1.6 !important;
        margin: 0 0 20px 0 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
      }
      
      .footer-brand {
        color: #ffffff !important;
        font-weight: 700 !important;
        font-size: 16px !important;
        margin-bottom: 8px !important;
      }
      
      .footer-links {
        margin: 24px 0 0 0 !important;
        display: flex !important;
        justify-content: center !important;
        gap: 24px !important;
      }
      
      .footer-links a {
        color: #cbd5e0 !important;
        text-decoration: none !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        padding: 8px 16px !important;
        border-radius: 8px !important;
        transition: all 0.3s ease !important;
        background: rgba(255, 255, 255, 0.05) !important;
      }
      
      .footer-links a:hover {
        background: rgba(255, 255, 255, 0.1) !important;
        color: #ffffff !important;
      }
      
      .divider {
        height: 2px !important;
        background: linear-gradient(90deg, transparent, #e2e8f0, transparent) !important;
        margin: 40px 0 !important;
        border: none !important;
        border-radius: 1px !important;
      }
      
      /* Mobile responsive */
      @media only screen and (max-width: 640px) {
        .email-wrapper { padding: 20px 10px !important; }
        .email-container { margin: 0 !important; border-radius: 16px !important; }
        .header, .content, .footer { padding: 32px 24px !important; }
        .greeting { font-size: 24px !important; }
        .cta-button { padding: 16px 32px !important; font-size: 14px !important; }
        .footer-links { flex-direction: column !important; gap: 12px !important; }
        .card { padding: 24px !important; }
      }
    </style>
  `;

  switch (type) {
    case 'welcome':
      return `
        ${baseStyle}
        <div class="email-wrapper">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td>
                <div class="email-container">
                  <div class="header">
                    <div class="logo-container">
                      <h1 class="logo">GENSWAVE</h1>
                      <p class="header-subtitle">Desarrollo Digital de Próxima Generación</p>
                    </div>
                    <div class="header-decoration"></div>
                  </div>
                  <div class="content">
                    <h2 class="greeting">¡Bienvenido a bordo, ${data.name}! 🚀</h2>
                    <p class="message">
                      Nos emociona tenerte como parte de la familia Genswave. Tu cuenta ha sido creada exitosamente y ya puedes comenzar a explorar todas nuestras capacidades de desarrollo digital.
                    </p>
                    
                    <div class="card">
                      <h3 class="card-title">
                        <span style="background: linear-gradient(135deg, #667eea, #764ba2); width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px;">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </span>
                        Tu viaje digital comienza aquí
                      </h3>
                      <ul class="feature-list">
                        <li>Acceso completo a nuestro dashboard personalizado</li>
                        <li>Creación de solicitudes de proyectos detalladas</li>
                        <li>Seguimiento en tiempo real del progreso</li>
                        <li>Comunicación directa con nuestro equipo experto</li>
                        <li>Gestión completa de tus proyectos digitales</li>
                        <li>Soporte técnico prioritario 24/7</li>
                      </ul>
                    </div>
                    
                    <div class="highlight-box">
                      <div class="highlight-box-content">
                        <strong>Consejo Pro:</strong> Completa tu perfil para recibir recomendaciones personalizadas y acelerar el proceso de desarrollo de tus proyectos.
                      </div>
                    </div>
                    
                    <div class="cta-container">
                      <a href="https://genswave.org/dashboard" class="cta-button">Explorar Dashboard</a>
                    </div>
                    
                    <hr class="divider">
                    
                    <p class="message">
                      ¿Tienes preguntas? Nuestro equipo está aquí para ayudarte en cada paso del camino. No dudes en contactarnos.
                    </p>
                  </div>
                  <div class="footer">
                    <div class="footer-brand">GENSWAVE</div>
                    <p class="footer-content">
                      Transformando ideas en experiencias digitales excepcionales
                    </p>
                    <div class="footer-links">
                      <a href="https://genswave.org">Sitio Web</a>
                      <a href="https://genswave.org/services">Servicios</a>
                      <a href="mailto:support@genswave.org">Soporte</a>
                    </div>
                    <p class="footer-content" style="margin-top: 16px; font-size: 12px; opacity: 0.7;">
                      © 2024 Genswave. Todos los derechos reservados.
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      `;

    case 'request_approved':
      return `
        ${baseStyle}
        <div class="email-wrapper">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td>
                <div class="email-container">
                  <div class="header">
                    <div class="logo-container">
                      <h1 class="logo">GENSWAVE</h1>
                      <p class="header-subtitle">Actualización de Solicitud</p>
                    </div>
                    <div class="header-decoration"></div>
                  </div>
                  <div class="content">
                    <h2 class="greeting">¡Excelentes noticias, ${data.userName}! 🎉</h2>
                    <p class="message">
                      Tu solicitud ha sido <strong>aprobada</strong> por nuestro equipo. Estamos emocionados de trabajar contigo en este proyecto y convertir tu visión en realidad.
                    </p>
                    
                    <div class="card">
                      <h3 class="card-title">
                        <span style="background: linear-gradient(135deg, #48bb78, #38a169); width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px;">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        </span>
                        Detalles de tu Solicitud Aprobada
                      </h3>
                      <table class="detail-table" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr class="detail-row">
                          <td class="detail-label">ID de Solicitud</td>
                          <td class="detail-value">${data.request.unique_id}</td>
                        </tr>
                        <tr class="detail-row">
                          <td class="detail-label">Proyecto</td>
                          <td class="detail-value">${data.request.title}</td>
                        </tr>
                        <tr class="detail-row">
                          <td class="detail-label">Tipo</td>
                          <td class="detail-value">${data.request.project_type}</td>
                        </tr>
                        <tr class="detail-row">
                          <td class="detail-label">Estado</td>
                          <td class="detail-value"><span class="status-badge">APROBADA</span></td>
                        </tr>
                        ${data.request.budget_range ? `
                        <tr class="detail-row">
                          <td class="detail-label">Presupuesto</td>
                          <td class="detail-value">${data.request.budget_range}</td>
                        </tr>
                        ` : ''}
                      </table>
                    </div>
                    
                    <div class="highlight-box">
                      <div class="highlight-box-content">
                        <strong>🎯 Próximos pasos:</strong><br>
                        • Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas<br>
                        • Recibirás una propuesta detallada y cronograma del proyecto<br>
                        • Programaremos una reunión para discutir los detalles específicos
                      </div>
                    </div>
                    
                    <div class="cta-container">
                      <a href="https://genswave.org/dashboard" class="cta-button">Ver Detalles Completos</a>
                    </div>
                  </div>
                  <div class="footer">
                    <div class="footer-brand">GENSWAVE</div>
                    <p class="footer-content">
                      Transformando ideas en experiencias digitales excepcionales
                    </p>
                    <div class="footer-links">
                      <a href="https://genswave.org">Sitio Web</a>
                      <a href="https://genswave.org/services">Servicios</a>
                      <a href="mailto:support@genswave.org">Soporte</a>
                    </div>
                    <p class="footer-content" style="margin-top: 16px; font-size: 12px; opacity: 0.7;">
                      © 2024 Genswave. Todos los derechos reservados.
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      `;

    case 'admin_message_notification':
      return `
        ${baseStyle}
        <div class="email-wrapper">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td>
                <div class="email-container">
                  <div class="header">
                    <div class="logo-container">
                      <h1 class="logo">GENSWAVE</h1>
                      <p class="header-subtitle">Nuevo Mensaje del Equipo</p>
                    </div>
                    <div class="header-decoration"></div>
                  </div>
                  <div class="content">
                    <h2 class="greeting">Hola ${data.userName}, 💬</h2>
                    <p class="message">
                      Has recibido un nuevo mensaje de nuestro equipo. Te mantenemos informado sobre el progreso de tu proyecto y cualquier actualización importante.
                    </p>
                    
                    <div class="message-bubble admin-message">
                      <p class="message-meta">
                        ${data.adminName} • ${new Date(data.timestamp).toLocaleString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p class="message-text">${data.message}</p>
                    </div>
                    
                    <div class="card">
                      <h3 class="card-title">
                        <span style="background: linear-gradient(135deg, #667eea, #764ba2); width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px;">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          </svg>
                        </span>
                        Contexto de la Conversación
                      </h3>
                      <table class="detail-table" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr class="detail-row">
                          <td class="detail-label">Proyecto</td>
                          <td class="detail-value">${data.projectTitle || 'Consulta General'}</td>
                        </tr>
                        <tr class="detail-row">
                          <td class="detail-label">Miembro del Equipo</td>
                          <td class="detail-value">${data.adminName}</td>
                        </tr>
                        <tr class="detail-row">
                          <td class="detail-label">Fecha</td>
                          <td class="detail-value">${new Date(data.timestamp).toLocaleDateString('es-ES')}</td>
                        </tr>
                      </table>
                    </div>
                    
                    <div class="highlight-box">
                      <div class="highlight-box-content">
                        <strong>📱 Responde fácilmente:</strong> Accede a tu dashboard para continuar la conversación y mantener todo organizado en un solo lugar.
                      </div>
                    </div>
                    
                    <div class="cta-container">
                      <a href="https://genswave.org/dashboard" class="cta-button">Responder Mensaje</a>
                    </div>
                  </div>
                  <div class="footer">
                    <div class="footer-brand">GENSWAVE</div>
                    <p class="footer-content">
                      Transformando ideas en experiencias digitales excepcionales
                    </p>
                    <div class="footer-links">
                      <a href="https://genswave.org">Sitio Web</a>
                      <a href="https://genswave.org/services">Servicios</a>
                      <a href="mailto:support@genswave.org">Soporte</a>
                    </div>
                    <p class="footer-content" style="margin-top: 16px; font-size: 12px; opacity: 0.7;">
                      © 2024 Genswave. Todos los derechos reservados.
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      `;

    default:
      return '';
  }
};

// Send email function
export const sendEmail = async (to, subject, type, data) => {
  try {
    const html = getEmailTemplate(type, data);
    
    const result = await resend.emails.send({
      from: 'Genswave <noreply@genswave.org>',
      to: [to],
      subject: subject,
      html: html,
    });

    console.log('✅ Email sent successfully:', result);
    return { success: true, id: result.id };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Specific email functions
export const sendWelcomeEmail = async (userEmail, userName) => {
  return await sendEmail(
    userEmail,
    '🚀 ¡Bienvenido a Genswave! Tu viaje digital comienza aquí',
    'welcome',
    { name: userName }
  );
};

export const sendRequestApprovedEmail = async (userEmail, userName, request) => {
  return await sendEmail(
    userEmail,
    `🎉 ¡Solicitud Aprobada! - ${request.title}`,
    'request_approved',
    { userName, request }
  );
};

export const sendAdminMessageNotification = async (userEmail, userName, messageData) => {
  return await sendEmail(
    userEmail,
    `💬 Nuevo mensaje del equipo Genswave`,
    'admin_message_notification',
    {
      userName,
      message: messageData.message,
      adminName: messageData.adminName,
      timestamp: messageData.timestamp,
      projectTitle: messageData.projectTitle
    }
  );
};

export const sendPasswordResetConfirmation = async (userEmail, userName, ip) => {
  return await sendEmail(
    userEmail,
    'Contraseña actualizada - Genswave',
    'password_reset_confirmation',
    { name: userName, ip }
  );
};

export const sendProfileUpdateConfirmation = async (userEmail, userName, changes) => {
  return await sendEmail(
    userEmail,
    'Perfil actualizado - Genswave',
    'profile_update_confirmation',
    { name: userName, changes }
  );
};

export const sendProjectCreatedEmail = async (userEmail, userName, project) => {
  return await sendEmail(
    userEmail,
    `🎉 Nuevo proyecto creado: ${project.title}`,
    'project_created',
    { userName, project }
  );
};

export const sendRequestCreatedEmail = async (userEmail, userName, request) => {
  return await sendEmail(
    userEmail,
    `✅ Solicitud recibida: ${request.title}`,
    'request_created',
    { userName, request }
  );
};

export const sendRequestStatusUpdateEmail = async (userEmail, userName, request, previousStatus) => {
  return await sendEmail(
    userEmail,
    `📢 Actualización de solicitud: ${request.title}`,
    'request_status_update',
    { userName, request, previousStatus }
  );
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendRequestApprovedEmail,
  sendAdminMessageNotification,
  sendPasswordResetConfirmation,
  sendProfileUpdateConfirmation,
  sendProjectCreatedEmail,
  sendRequestCreatedEmail,
  sendRequestStatusUpdateEmail
};