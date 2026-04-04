import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resendApiKey = process.env.RESEND_KEY || process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.error('❌ RESEND_KEY environment variable is not set');
}
const resend = new Resend(resendApiKey || 're_X3jJKunz_Q9mhaz7QGsfksisiUzxqLUZE');

// Enterprise-level email templates with inline styles for maximum compatibility
const getEmailTemplate = (type, data) => {

  switch (type) {
    case 'welcome':
      return `
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
          <tr>
            <td style="padding: 60px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="650" style="margin: 0 auto; background: #ffffff; border-radius: 24px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25); overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #000000 0%, #2d3748 50%, #1a202c 100%); padding: 50px 40px 70px; text-align: center; position: relative;">
                    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px; margin: 0 0 10px 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">GENSWAVE</h1>
                    <p style="color: rgba(255, 255, 255, 0.8); font-size: 15px; font-weight: 500; text-transform: uppercase; letter-spacing: 2px; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">Desarrollo Digital de Próxima Generación</p>
                    <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 80px; height: 4px; background: linear-gradient(90deg, transparent, #ffffff, transparent); border-radius: 2px;"></div>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 60px 50px;">
                    <h2 style="font-size: 28px; font-weight: 700; color: #1a202c; margin: 0 0 20px 0; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.2;">¡Bienvenido a bordo, ${data.name}! 🚀</h2>
                    
                    <p style="font-size: 17px; color: #4a5568; margin: 0 0 40px 0; line-height: 1.7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                      Nos emociona tenerte como parte de la familia Genswave. Tu cuenta ha sido creada exitosamente y ya puedes comenzar a explorar todas nuestras capacidades de desarrollo digital.
                    </p>
                    
                    <!-- Feature Card -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 1px solid #e2e8f0; border-radius: 16px; margin: 32px 0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); position: relative;">
                      <tr>
                        <td style="height: 4px; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 16px 16px 0 0;"></td>
                      </tr>
                      <tr>
                        <td style="padding: 32px;">
                          <h3 style="font-size: 20px; font-weight: 700; color: #1a202c; margin: 0 0 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; display: flex; align-items: center;">
                            <span style="background: linear-gradient(135deg, #667eea, #764ba2); width: 24px; height: 24px; border-radius: 6px; display: inline-block; margin-right: 12px; text-align: center; line-height: 24px;">⭐</span>
                            Tu viaje digital comienza aquí
                          </h3>
                          
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr><td style="padding: 6px 0; color: #4a5568; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">✅ Acceso completo a nuestro dashboard personalizado</td></tr>
                            <tr><td style="padding: 6px 0; color: #4a5568; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">✅ Creación de solicitudes de proyectos detalladas</td></tr>
                            <tr><td style="padding: 6px 0; color: #4a5568; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">✅ Seguimiento en tiempo real del progreso</td></tr>
                            <tr><td style="padding: 6px 0; color: #4a5568; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">✅ Comunicación directa con nuestro equipo experto</td></tr>
                            <tr><td style="padding: 6px 0; color: #4a5568; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">✅ Gestión completa de tus proyectos digitales</td></tr>
                            <tr><td style="padding: 6px 0; color: #4a5568; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">✅ Soporte técnico prioritario 24/7</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Highlight Box -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%); border-left: 6px solid #3182ce; border-radius: 12px; margin: 32px 0; box-shadow: 0 4px 12px rgba(49, 130, 206, 0.1);">
                      <tr>
                        <td style="padding: 24px;">
                          <p style="margin: 0; color: #2d3748; font-weight: 500; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                            💡 <strong>Consejo Pro:</strong> Completa tu perfil para recibir recomendaciones personalizadas y acelerar el proceso de desarrollo de tus proyectos.
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- CTA Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="text-align: center; margin: 40px 0;">
                          <a href="https://genswave.org/dashboard" style="display: inline-block; background: linear-gradient(135deg, #000000 0%, #2d3748 100%); color: #ffffff; padding: 18px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);">EXPLORAR DASHBOARD</a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Divider -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="height: 2px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent); margin: 40px 0; border-radius: 1px;"></td>
                      </tr>
                    </table>
                    
                    <p style="font-size: 17px; color: #4a5568; margin: 0; line-height: 1.7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                      ¿Tienes preguntas? Nuestro equipo está aquí para ayudarte en cada paso del camino. No dudes en contactarnos.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%); padding: 40px 50px; text-align: center; position: relative;">
                    <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 100px; height: 2px; background: linear-gradient(90deg, transparent, #4a5568, transparent);"></div>
                    
                    <h4 style="color: #ffffff; font-weight: 700; font-size: 16px; margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">GENSWAVE</h4>
                    <p style="color: #a0aec0; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                      Transformando ideas en experiencias digitales excepcionales
                    </p>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="text-align: center;">
                          <a href="https://genswave.org" style="color: #cbd5e0; text-decoration: none; font-size: 14px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; padding: 8px 16px; border-radius: 8px; background: rgba(255, 255, 255, 0.05); margin: 0 8px;">Sitio Web</a>
                          <a href="https://genswave.org/services" style="color: #cbd5e0; text-decoration: none; font-size: 14px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; padding: 8px 16px; border-radius: 8px; background: rgba(255, 255, 255, 0.05); margin: 0 8px;">Servicios</a>
                          <a href="mailto:support@genswave.org" style="color: #cbd5e0; text-decoration: none; font-size: 14px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; padding: 8px 16px; border-radius: 8px; background: rgba(255, 255, 255, 0.05); margin: 0 8px;">Soporte</a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #a0aec0; font-size: 12px; margin: 16px 0 0 0; opacity: 0.7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                      © 2024 Genswave. Todos los derechos reservados.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;

    case 'request_approved':
      return `
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
          <tr>
            <td style="padding: 60px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="650" style="margin: 0 auto; background: #ffffff; border-radius: 24px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25); overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #000000 0%, #2d3748 50%, #1a202c 100%); padding: 50px 40px 70px; text-align: center; position: relative;">
                    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px; margin: 0 0 10px 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">GENSWAVE</h1>
                    <p style="color: rgba(255, 255, 255, 0.8); font-size: 15px; font-weight: 500; text-transform: uppercase; letter-spacing: 2px; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">Actualización de Solicitud</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 60px 50px;">
                    <h2 style="font-size: 28px; font-weight: 700; color: #1a202c; margin: 0 0 20px 0; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.2;">¡Excelentes noticias, ${data.userName}! 🎉</h2>
                    
                    <p style="font-size: 17px; color: #4a5568; margin: 0 0 40px 0; line-height: 1.7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                      Tu solicitud ha sido <strong>aprobada</strong> por nuestro equipo. Estamos emocionados de trabajar contigo en este proyecto y convertir tu visión en realidad.
                    </p>
                    
                    <!-- Details Card -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 1px solid #e2e8f0; border-radius: 16px; margin: 32px 0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                      <tr>
                        <td style="height: 4px; background: linear-gradient(90deg, #48bb78, #38a169); border-radius: 16px 16px 0 0;"></td>
                      </tr>
                      <tr>
                        <td style="padding: 32px;">
                          <h3 style="font-size: 20px; font-weight: 700; color: #1a202c; margin: 0 0 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                            ✅ Detalles de tu Solicitud Aprobada
                          </h3>
                          
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                              <td style="padding: 16px 20px; font-weight: 600; color: #4a5568; font-size: 14px; width: 40%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; background: #f7fafc;">ID de Solicitud</td>
                              <td style="padding: 16px 20px; font-weight: 500; color: #1a202c; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">${data.request.unique_id}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                              <td style="padding: 16px 20px; font-weight: 600; color: #4a5568; font-size: 14px; width: 40%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; background: #f7fafc;">Proyecto</td>
                              <td style="padding: 16px 20px; font-weight: 500; color: #1a202c; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">${data.request.title}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                              <td style="padding: 16px 20px; font-weight: 600; color: #4a5568; font-size: 14px; width: 40%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; background: #f7fafc;">Tipo</td>
                              <td style="padding: 16px 20px; font-weight: 500; color: #1a202c; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">${data.request.project_type}</td>
                            </tr>
                            <tr>
                              <td style="padding: 16px 20px; font-weight: 600; color: #4a5568; font-size: 14px; width: 40%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; background: #f7fafc;">Estado</td>
                              <td style="padding: 16px 20px; font-weight: 500; color: #1a202c; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                                <span style="display: inline-flex; align-items: center; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; background: linear-gradient(135deg, #48bb78, #38a169); color: #ffffff; box-shadow: 0 2px 4px rgba(72, 187, 120, 0.3);">✓ APROBADA</span>
                              </td>
                            </tr>
                            ${data.request.budget_range ? `
                            <tr>
                              <td style="padding: 16px 20px; font-weight: 600; color: #4a5568; font-size: 14px; width: 40%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; background: #f7fafc;">Presupuesto</td>
                              <td style="padding: 16px 20px; font-weight: 500; color: #1a202c; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">${data.request.budget_range}</td>
                            </tr>
                            ` : ''}
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Next Steps -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%); border-left: 6px solid #3182ce; border-radius: 12px; margin: 32px 0; box-shadow: 0 4px 12px rgba(49, 130, 206, 0.1);">
                      <tr>
                        <td style="padding: 24px;">
                          <p style="margin: 0; color: #2d3748; font-weight: 500; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                            🎯 <strong>Próximos pasos:</strong><br>
                            • Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas<br>
                            • Recibirás una propuesta detallada y cronograma del proyecto<br>
                            • Programaremos una reunión para discutir los detalles específicos
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- CTA Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="text-align: center; margin: 40px 0;">
                          <a href="https://genswave.org/dashboard" style="display: inline-block; background: linear-gradient(135deg, #000000 0%, #2d3748 100%); color: #ffffff; padding: 18px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);">VER DETALLES COMPLETOS</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%); padding: 40px 50px; text-align: center;">
                    <h4 style="color: #ffffff; font-weight: 700; font-size: 16px; margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">GENSWAVE</h4>
                    <p style="color: #a0aec0; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                      Transformando ideas en experiencias digitales excepcionales
                    </p>
                    <p style="color: #a0aec0; font-size: 12px; margin: 16px 0 0 0; opacity: 0.7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                      © 2024 Genswave. Todos los derechos reservados.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;

    case 'admin_message_notification':
      return `
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
          <tr>
            <td style="padding: 60px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="650" style="margin: 0 auto; background: #ffffff; border-radius: 24px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25); overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #000000 0%, #2d3748 50%, #1a202c 100%); padding: 50px 40px 70px; text-align: center; position: relative;">
                    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px; margin: 0 0 10px 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">GENSWAVE</h1>
                    <p style="color: rgba(255, 255, 255, 0.8); font-size: 15px; font-weight: 500; text-transform: uppercase; letter-spacing: 2px; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">Nuevo Mensaje del Equipo</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 60px 50px;">
                    <h2 style="font-size: 28px; font-weight: 700; color: #1a202c; margin: 0 0 20px 0; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.2;">Hola ${data.userName}, 💬</h2>
                    
                    <p style="font-size: 17px; color: #4a5568; margin: 0 0 40px 0; line-height: 1.7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                      Has recibido un nuevo mensaje de nuestro equipo. Te mantenemos informado sobre el progreso de tu proyecto y cualquier actualización importante.
                    </p>
                    
                    <!-- Message Bubble -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%); border-left: 4px solid #48bb78; border-radius: 16px; margin: 24px 0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
                      <tr>
                        <td style="padding: 24px;">
                          <p style="font-size: 13px; color: #718096; margin: 0 0 12px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                            <span style="display: inline-block; width: 16px; height: 16px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; margin-right: 8px; vertical-align: middle;"></span>
                            ${data.adminName} • ${new Date(data.timestamp).toLocaleString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p style="color: #1a202c; font-size: 15px; line-height: 1.7; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">${data.message}</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Context Card -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 1px solid #e2e8f0; border-radius: 16px; margin: 32px 0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                      <tr>
                        <td style="height: 4px; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 16px 16px 0 0;"></td>
                      </tr>
                      <tr>
                        <td style="padding: 32px;">
                          <h3 style="font-size: 20px; font-weight: 700; color: #1a202c; margin: 0 0 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                            💬 Contexto de la Conversación
                          </h3>
                          
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                              <td style="padding: 16px 20px; font-weight: 600; color: #4a5568; font-size: 14px; width: 40%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; background: #f7fafc;">Proyecto</td>
                              <td style="padding: 16px 20px; font-weight: 500; color: #1a202c; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">${data.projectTitle || 'Consulta General'}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                              <td style="padding: 16px 20px; font-weight: 600; color: #4a5568; font-size: 14px; width: 40%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; background: #f7fafc;">Miembro del Equipo</td>
                              <td style="padding: 16px 20px; font-weight: 500; color: #1a202c; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">${data.adminName}</td>
                            </tr>
                            <tr>
                              <td style="padding: 16px 20px; font-weight: 600; color: #4a5568; font-size: 14px; width: 40%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; background: #f7fafc;">Fecha</td>
                              <td style="padding: 16px 20px; font-weight: 500; color: #1a202c; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">${new Date(data.timestamp).toLocaleDateString('es-ES')}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Tip Box -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%); border-left: 6px solid #3182ce; border-radius: 12px; margin: 32px 0; box-shadow: 0 4px 12px rgba(49, 130, 206, 0.1);">
                      <tr>
                        <td style="padding: 24px;">
                          <p style="margin: 0; color: #2d3748; font-weight: 500; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                            📱 <strong>Responde fácilmente:</strong> Accede a tu dashboard para continuar la conversación y mantener todo organizado en un solo lugar.
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- CTA Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="text-align: center; margin: 40px 0;">
                          <a href="https://genswave.org/dashboard" style="display: inline-block; background: linear-gradient(135deg, #000000 0%, #2d3748 100%); color: #ffffff; padding: 18px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);">RESPONDER MENSAJE</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%); padding: 40px 50px; text-align: center;">
                    <h4 style="color: #ffffff; font-weight: 700; font-size: 16px; margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">GENSWAVE</h4>
                    <p style="color: #a0aec0; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                      Transformando ideas en experiencias digitales excepcionales
                    </p>
                    <p style="color: #a0aec0; font-size: 12px; margin: 16px 0 0 0; opacity: 0.7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                      © 2024 Genswave. Todos los derechos reservados.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
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