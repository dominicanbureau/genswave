import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resendApiKey = process.env.RESEND_KEY || process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.error('❌ RESEND_KEY environment variable is not set');
}
const resend = new Resend(resendApiKey || 're_X3jJKunz_Q9mhaz7QGsfksisiUzxqLUZE');

// Website-identical email templates with exact design matching
const getEmailTemplate = (type, data) => {

  switch (type) {
    case 'welcome':
      return `
        <!DOCTYPE html>
        <html lang="es" style="margin: 0; padding: 0;">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido a Genswave</title>
          <!--[if mso]>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <![endif]-->
        </head>
        <body style="margin: 0; padding: 0; background-color: #080808; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; color: #ffffff; line-height: 1.6;">
          
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0; background-color: #080808; min-height: 100vh;">
            <tr>
              <td style="padding: 40px 20px;">
                
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #080808; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; overflow: hidden;">
                  
                  <!-- Header with Logo -->
                  <tr>
                    <td style="padding: 60px 50px 40px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                      <img src="https://genswave.org/genswave.png" alt="Genswave" style="height: 48px; width: auto; margin-bottom: 24px; filter: brightness(0) invert(1);">
                      <h1 style="font-size: 24px; font-weight: 300; color: #ffffff; letter-spacing: 0.2em; text-transform: uppercase; margin: 0; opacity: 0.8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">GENSWAVE</h1>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 50px;">
                      
                      <!-- Welcome Title -->
                      <h2 style="font-size: 48px; font-weight: 800; color: #ffffff; margin: 0 0 24px 0; line-height: 0.95; letter-spacing: -0.02em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">Bienvenido a bordo, ${data.name}</h2>
                      
                      <!-- Welcome Message -->
                      <p style="font-size: 18px; color: #888888; margin: 0 0 40px 0; line-height: 1.8; font-weight: 300; border-left: 3px solid #ffffff; padding-left: 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
                        Nos emociona tenerte como parte de la familia Genswave. Tu cuenta ha sido creada exitosamente y ya puedes comenzar a explorar todas nuestras capacidades de desarrollo digital.
                      </p>
                      
                      <!-- Features Section -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 40px 0; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; background-color: rgba(255, 255, 255, 0.02);">
                        <tr>
                          <td style="padding: 40px;">
                            <h3 style="font-size: 20px; font-weight: 600; color: #ffffff; margin: 0 0 24px 0; display: flex; align-items: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" style="margin-right: 12px; vertical-align: middle;">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              Tu viaje digital comienza aquí
                            </h3>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr><td style="padding: 8px 0; color: #888888; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; display: flex; align-items: center;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" style="margin-right: 12px; flex-shrink: 0;">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                Acceso completo a nuestro dashboard personalizado
                              </td></tr>
                              <tr><td style="padding: 8px 0; color: #888888; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; display: flex; align-items: center;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" style="margin-right: 12px; flex-shrink: 0;">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                Creación de solicitudes de proyectos detalladas
                              </td></tr>
                              <tr><td style="padding: 8px 0; color: #888888; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; display: flex; align-items: center;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" style="margin-right: 12px; flex-shrink: 0;">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                Seguimiento en tiempo real del progreso
                              </td></tr>
                              <tr><td style="padding: 8px 0; color: #888888; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; display: flex; align-items: center;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" style="margin-right: 12px; flex-shrink: 0;">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                Comunicación directa con nuestro equipo experto
                              </td></tr>
                              <tr><td style="padding: 8px 0; color: #888888; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; display: flex; align-items: center;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" style="margin-right: 12px; flex-shrink: 0;">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                Gestión completa de tus proyectos digitales
                              </td></tr>
                              <tr><td style="padding: 8px 0; color: #888888; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; display: flex; align-items: center;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" style="margin-right: 12px; flex-shrink: 0;">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                Soporte técnico prioritario 24/7
                              </td></tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Pro Tip -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0; border-left: 3px solid #ffffff; background-color: rgba(255, 255, 255, 0.02);">
                        <tr>
                          <td style="padding: 24px 32px;">
                            <p style="margin: 0; color: #888888; font-weight: 300; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; display: flex; align-items: flex-start;">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" style="margin-right: 12px; margin-top: 2px; flex-shrink: 0;">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                <line x1="12" y1="17" x2="12.01" y2="17"/>
                              </svg>
                              <span><strong style="color: #ffffff;">Consejo Pro:</strong> Completa tu perfil para recibir recomendaciones personalizadas y acelerar el proceso de desarrollo de tus proyectos.</span>
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- CTA Button -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding: 40px 0;">
                            <a href="https://genswave.org/dashboard" style="display: inline-block; background-color: transparent; color: #ffffff; padding: 16px 32px; text-decoration: none; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 50px; font-weight: 500; font-size: 15px; letter-spacing: 0.08em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; transition: all 0.3s ease;">EXPLORAR DASHBOARD</a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Divider -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="height: 1px; background-color: rgba(255, 255, 255, 0.1); margin: 40px 0;"></td>
                        </tr>
                      </table>
                      
                      <!-- Final Message -->
                      <p style="font-size: 16px; color: #888888; margin: 0; line-height: 1.8; font-weight: 300; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
                        ¿Tienes preguntas? Nuestro equipo está aquí para ayudarte en cada paso del camino. No dudes en contactarnos.
                      </p>
                      
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 40px 50px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                      
                      <h4 style="color: #ffffff; font-weight: 300; font-size: 16px; margin: 0 0 16px 0; letter-spacing: 0.2em; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">GENSWAVE</h4>
                      
                      <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; font-weight: 300; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
                        Construido para empresas de la era digital.
                      </p>
                      
                      <!-- Footer Links -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center;">
                            <a href="https://genswave.org" style="color: rgba(255, 255, 255, 0.6); text-decoration: none; font-size: 14px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; margin: 0 16px;">Sitio Web</a>
                            <a href="https://genswave.org/servicios" style="color: rgba(255, 255, 255, 0.6); text-decoration: none; font-size: 14px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; margin: 0 16px;">Servicios</a>
                            <a href="mailto:support@genswave.org" style="color: rgba(255, 255, 255, 0.6); text-decoration: none; font-size: 14px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; margin: 0 16px;">Soporte</a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Copyright -->
                      <p style="color: rgba(255, 255, 255, 0.4); font-size: 12px; margin: 24px 0 0 0; font-weight: 300; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
                        © 2024 Genswave. Todos los derechos reservados.
                      </p>
                      
                    </td>
                  </tr>
                  
                </table>
                
              </td>
            </tr>
          </table>
          
        </body>
        </html>
      `;

    case 'request_approved':
      return `
        <!DOCTYPE html>
        <html lang="es" style="margin: 0; padding: 0;">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Solicitud Aprobada - Genswave</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #080808; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; color: #ffffff; line-height: 1.6;">
          
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0; background-color: #080808; min-height: 100vh;">
            <tr>
              <td style="padding: 40px 20px;">
                
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #080808; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; overflow: hidden;">
                  
                  <!-- Header with Logo -->
                  <tr>
                    <td style="padding: 60px 50px 40px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                      <img src="https://genswave.org/genswave.png" alt="Genswave" style="height: 48px; width: auto; margin-bottom: 24px; filter: brightness(0) invert(1);">
                      <h1 style="font-size: 24px; font-weight: 300; color: #ffffff; letter-spacing: 0.2em; text-transform: uppercase; margin: 0; opacity: 0.8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">GENSWAVE</h1>
                      <p style="color: rgba(255, 255, 255, 0.6); font-size: 14px; font-weight: 300; margin: 8px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">Actualización de Solicitud</p>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 50px;">
                      
                      <!-- Success Title -->
                      <h2 style="font-size: 48px; font-weight: 800; color: #ffffff; margin: 0 0 24px 0; line-height: 0.95; letter-spacing: -0.02em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">Excelentes noticias, ${data.userName}</h2>
                      
                      <!-- Success Message -->
                      <p style="font-size: 18px; color: #888888; margin: 0 0 40px 0; line-height: 1.8; font-weight: 300; border-left: 3px solid #ffffff; padding-left: 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
                        Tu solicitud ha sido <strong style="color: #ffffff;">aprobada</strong> por nuestro equipo. Estamos emocionados de trabajar contigo en este proyecto y convertir tu visión en realidad.
                      </p>
                      
                      <!-- Request Details -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 40px 0; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; background-color: rgba(255, 255, 255, 0.02);">
                        <tr>
                          <td style="padding: 40px;">
                            <h3 style="font-size: 20px; font-weight: 600; color: #ffffff; margin: 0 0 24px 0; display: flex; align-items: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" style="margin-right: 12px; vertical-align: middle;">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              Detalles de tu Solicitud Aprobada
                            </h3>
                            
                            <!-- Details Table -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; overflow: hidden;">
                              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                <td style="padding: 16px 20px; font-weight: 500; color: #888888; font-size: 14px; width: 40%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: rgba(255, 255, 255, 0.02);">ID de Solicitud</td>
                                <td style="padding: 16px 20px; font-weight: 400; color: #ffffff; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">${data.request.unique_id}</td>
                              </tr>
                              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                <td style="padding: 16px 20px; font-weight: 500; color: #888888; font-size: 14px; width: 40%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: rgba(255, 255, 255, 0.02);">Proyecto</td>
                                <td style="padding: 16px 20px; font-weight: 400; color: #ffffff; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">${data.request.title}</td>
                              </tr>
                              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                <td style="padding: 16px 20px; font-weight: 500; color: #888888; font-size: 14px; width: 40%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: rgba(255, 255, 255, 0.02);">Tipo</td>
                                <td style="padding: 16px 20px; font-weight: 400; color: #ffffff; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">${data.request.project_type}</td>
                              </tr>
                              <tr ${data.request.budget_range ? 'style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);"' : ''}>
                                <td style="padding: 16px 20px; font-weight: 500; color: #888888; font-size: 14px; width: 40%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: rgba(255, 255, 255, 0.02);">Estado</td>
                                <td style="padding: 16px 20px; font-weight: 400; color: #ffffff; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
                                  <span style="display: inline-flex; align-items: center; padding: 6px 12px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; background-color: rgba(255, 255, 255, 0.05);">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" style="margin-right: 6px;">
                                      <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    APROBADA
                                  </span>
                                </td>
                              </tr>
                              ${data.request.budget_range ? `
                              <tr>
                                <td style="padding: 16px 20px; font-weight: 500; color: #888888; font-size: 14px; width: 40%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: rgba(255, 255, 255, 0.02);">Presupuesto</td>
                                <td style="padding: 16px 20px; font-weight: 400; color: #ffffff; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">${data.request.budget_range}</td>
                              </tr>
                              ` : ''}
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Next Steps -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0; border-left: 3px solid #ffffff; background-color: rgba(255, 255, 255, 0.02);">
                        <tr>
                          <td style="padding: 24px 32px;">
                            <p style="margin: 0; color: #888888; font-weight: 300; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; display: flex; align-items: flex-start;">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" style="margin-right: 12px; margin-top: 2px; flex-shrink: 0;">
                                <path d="M9 11H1v6h8v-6zM23 11h-8v6h8v-6zM16 3H8v6h8V3z"/>
                              </svg>
                              <span><strong style="color: #ffffff;">Próximos pasos:</strong><br>
                              • Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas<br>
                              • Recibirás una propuesta detallada y cronograma del proyecto<br>
                              • Programaremos una reunión para discutir los detalles específicos</span>
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- CTA Button -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding: 40px 0;">
                            <a href="https://genswave.org/dashboard" style="display: inline-block; background-color: transparent; color: #ffffff; padding: 16px 32px; text-decoration: none; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 50px; font-weight: 500; font-size: 15px; letter-spacing: 0.08em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">VER DETALLES COMPLETOS</a>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 40px 50px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                      <h4 style="color: #ffffff; font-weight: 300; font-size: 16px; margin: 0 0 16px 0; letter-spacing: 0.2em; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">GENSWAVE</h4>
                      <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; font-weight: 300; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
                        Construido para empresas de la era digital.
                      </p>
                      <p style="color: rgba(255, 255, 255, 0.4); font-size: 12px; margin: 0; font-weight: 300; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
                        © 2024 Genswave. Todos los derechos reservados.
                      </p>
                    </td>
                  </tr>
                  
                </table>
                
              </td>
            </tr>
          </table>
          
        </body>
        </html>
      `;

    case 'admin_message_notification':
      return `
        <!DOCTYPE html>
        <html lang="es" style="margin: 0; padding: 0;">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nuevo Mensaje - Genswave</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #080808; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; color: #ffffff; line-height: 1.6;">
          
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0; background-color: #080808; min-height: 100vh;">
            <tr>
              <td style="padding: 40px 20px;">
                
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #080808; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; overflow: hidden;">
                  
                  <!-- Header with Logo -->
                  <tr>
                    <td style="padding: 60px 50px 40px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                      <img src="https://genswave.org/genswave.png" alt="Genswave" style="height: 48px; width: auto; margin-bottom: 24px; filter: brightness(0) invert(1);">
                      <h1 style="font-size: 24px; font-weight: 300; color: #ffffff; letter-spacing: 0.2em; text-transform: uppercase; margin: 0; opacity: 0.8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">GENSWAVE</h1>
                      <p style="color: rgba(255, 255, 255, 0.6); font-size: 14px; font-weight: 300; margin: 8px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">Nuevo Mensaje del Equipo</p>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 50px;">
                      
                      <!-- Message Title -->
                      <h2 style="font-size: 48px; font-weight: 800; color: #ffffff; margin: 0 0 24px 0; line-height: 0.95; letter-spacing: -0.02em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">Hola ${data.userName}</h2>
                      
                      <!-- Message Intro -->
                      <p style="font-size: 18px; color: #888888; margin: 0 0 40px 0; line-height: 1.8; font-weight: 300; border-left: 3px solid #ffffff; padding-left: 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
                        Has recibido un nuevo mensaje de nuestro equipo. Te mantenemos informado sobre el progreso de tu proyecto y cualquier actualización importante.
                      </p>
                      
                      <!-- Message Content -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 40px 0; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; background-color: rgba(255, 255, 255, 0.02);">
                        <tr>
                          <td style="padding: 40px;">
                            
                            <!-- Message Header -->
                            <div style="display: flex; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" style="margin-right: 12px; flex-shrink: 0;">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                              </svg>
                              <div>
                                <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">${data.adminName}</p>
                                <p style="margin: 0; color: #666666; font-size: 13px; font-weight: 300; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">${new Date(data.timestamp).toLocaleString('es-ES', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}</p>
                              </div>
                            </div>
                            
                            <!-- Message Text -->
                            <p style="color: #ffffff; font-size: 16px; line-height: 1.7; margin: 0; font-weight: 300; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">${data.message}</p>
                            
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Context Information -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; background-color: rgba(255, 255, 255, 0.02);">
                        <tr>
                          <td style="padding: 32px;">
                            <h3 style="font-size: 18px; font-weight: 600; color: #ffffff; margin: 0 0 20px 0; display: flex; align-items: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" style="margin-right: 12px; vertical-align: middle;">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="16" x2="12" y2="12"/>
                                <line x1="12" y1="8" x2="12.01" y2="8"/>
                              </svg>
                              Contexto de la Conversación
                            </h3>
                            
                            <!-- Context Table -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; overflow: hidden;">
                              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                <td style="padding: 12px 16px; font-weight: 500; color: #888888; font-size: 14px; width: 35%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: rgba(255, 255, 255, 0.02);">Proyecto</td>
                                <td style="padding: 12px 16px; font-weight: 400; color: #ffffff; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">${data.projectTitle || 'Consulta General'}</td>
                              </tr>
                              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                <td style="padding: 12px 16px; font-weight: 500; color: #888888; font-size: 14px; width: 35%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: rgba(255, 255, 255, 0.02);">Miembro del Equipo</td>
                                <td style="padding: 12px 16px; font-weight: 400; color: #ffffff; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">${data.adminName}</td>
                              </tr>
                              <tr>
                                <td style="padding: 12px 16px; font-weight: 500; color: #888888; font-size: 14px; width: 35%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: rgba(255, 255, 255, 0.02);">Fecha</td>
                                <td style="padding: 12px 16px; font-weight: 400; color: #ffffff; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">${new Date(data.timestamp).toLocaleDateString('es-ES')}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Response Tip -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0; border-left: 3px solid #ffffff; background-color: rgba(255, 255, 255, 0.02);">
                        <tr>
                          <td style="padding: 24px 32px;">
                            <p style="margin: 0; color: #888888; font-weight: 300; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; display: flex; align-items: flex-start;">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" style="margin-right: 12px; margin-top: 2px; flex-shrink: 0;">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <circle cx="12" cy="16" r="1"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                              </svg>
                              <span><strong style="color: #ffffff;">Responde fácilmente:</strong> Accede a tu dashboard para continuar la conversación y mantener todo organizado en un solo lugar.</span>
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- CTA Button -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding: 40px 0;">
                            <a href="https://genswave.org/dashboard" style="display: inline-block; background-color: transparent; color: #ffffff; padding: 16px 32px; text-decoration: none; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 50px; font-weight: 500; font-size: 15px; letter-spacing: 0.08em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">RESPONDER MENSAJE</a>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 40px 50px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                      <h4 style="color: #ffffff; font-weight: 300; font-size: 16px; margin: 0 0 16px 0; letter-spacing: 0.2em; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">GENSWAVE</h4>
                      <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; font-weight: 300; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
                        Construido para empresas de la era digital.
                      </p>
                      <p style="color: rgba(255, 255, 255, 0.4); font-size: 12px; margin: 0; font-weight: 300; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
                        © 2024 Genswave. Todos los derechos reservados.
                      </p>
                    </td>
                  </tr>
                  
                </table>
                
              </td>
            </tr>
          </table>
          
        </body>
        </html>
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
    'Bienvenido a Genswave - Tu viaje digital comienza aquí',
    'welcome',
    { name: userName }
  );
};

export const sendRequestApprovedEmail = async (userEmail, userName, request) => {
  return await sendEmail(
    userEmail,
    `Solicitud Aprobada - ${request.title}`,
    'request_approved',
    { userName, request }
  );
};

export const sendAdminMessageNotification = async (userEmail, userName, messageData) => {
  return await sendEmail(
    userEmail,
    `Nuevo mensaje del equipo Genswave`,
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
    `Nuevo proyecto creado: ${project.title}`,
    'project_created',
    { userName, project }
  );
};

export const sendRequestCreatedEmail = async (userEmail, userName, request) => {
  return await sendEmail(
    userEmail,
    `Solicitud recibida: ${request.title}`,
    'request_created',
    { userName, request }
  );
};

export const sendRequestStatusUpdateEmail = async (userEmail, userName, request, previousStatus) => {
  return await sendEmail(
    userEmail,
    `Actualización de solicitud: ${request.title}`,
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