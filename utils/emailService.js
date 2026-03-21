import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resendApiKey = process.env.RESEND_KEY || process.env.RESEND_API_KEY || 're_X3jJKunz_Q9mhaz7QGsfksisiUzxqLUZE';
const resend = new Resend(resendApiKey);

// Email templates
const getEmailTemplate = (type, data) => {
  const baseStyle = `
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f7; }
      .container { max-width: 600px; margin: 0 auto; background: white; }
      .header { background: #000; color: white; padding: 2rem; text-align: center; }
      .content { padding: 2rem; }
      .footer { background: #f5f5f7; padding: 1.5rem; text-align: center; color: #666; }
      .button { display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 1rem 0; }
      .project-details { background: #f9f9f9; padding: 1.5rem; border-radius: 8px; margin: 1rem 0; }
      .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
      .status-pending { background: #fef3c7; color: #92400e; }
      .status-in_progress { background: #dbeafe; color: #1e40af; }
      .status-completed { background: #d1fae5; color: #065f46; }
    </style>
  `;

  switch (type) {
    case 'welcome':
      return `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido a Genswave!</h1>
          </div>
          <div class="content">
            <h2>Hola ${data.name},</h2>
            <p>¡Gracias por unirte a Genswave! Tu cuenta ha sido creada exitosamente.</p>
            
            <div class="project-details">
              <h3>🚀 ¿Qué puedes hacer ahora?</h3>
              <ul>
                <li>Explorar nuestros servicios de desarrollo</li>
                <li>Crear solicitudes de proyectos personalizadas</li>
                <li>Seguir el progreso de tus proyectos en tiempo real</li>
                <li>Comunicarte directamente con nuestro equipo</li>
              </ul>
            </div>
            
            <p>Accede a tu dashboard personal:</p>
            <a href="https://genswave.org/dashboard" class="button">Ir al Dashboard</a>
            
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          </div>
          <div class="footer">
            <p>© 2024 Genswave - Desarrollo Web y Aplicaciones Móviles</p>
            <p>📧 support@genswave.org | 🌐 genswave.org</p>
          </div>
        </div>
      `;

    case 'password_reset_confirmation':
      return `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>Contraseña Actualizada</h1>
          </div>
          <div class="content">
            <h2>Hola ${data.name},</h2>
            <p>✅ Tu contraseña ha sido actualizada exitosamente.</p>
            
            <div class="project-details">
              <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
              <p><strong>IP:</strong> ${data.ip || 'No disponible'}</p>
            </div>
            
            <p>Si no realizaste este cambio, contacta inmediatamente a nuestro equipo de soporte.</p>
            
            <a href="https://genswave.org/dashboard" class="button">Acceder a tu Cuenta</a>
          </div>
          <div class="footer">
            <p>© 2024 Genswave - Desarrollo Web y Aplicaciones Móviles</p>
            <p>📧 support@genswave.org | 🌐 genswave.org</p>
          </div>
        </div>
      `;

    case 'profile_update_confirmation':
      return `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>Perfil Actualizado</h1>
          </div>
          <div class="content">
            <h2>Hola ${data.name},</h2>
            <p>✅ Tu perfil ha sido actualizado exitosamente.</p>
            
            <div class="project-details">
              <h3>Cambios realizados:</h3>
              ${data.changes ? data.changes.map(change => `<p>• ${change}</p>`).join('') : '<p>Información general actualizada</p>'}
              <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
            </div>
            
            <a href="https://genswave.org/dashboard" class="button">Ver tu Perfil</a>
          </div>
          <div class="footer">
            <p>© 2024 Genswave - Desarrollo Web y Aplicaciones Móviles</p>
            <p>📧 support@genswave.org | 🌐 genswave.org</p>
          </div>
        </div>
      `;

    case 'project_created':
      return `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>🎉 Nuevo Proyecto Creado</h1>
          </div>
          <div class="content">
            <h2>Hola ${data.userName},</h2>
            <p>¡Excelentes noticias! Se ha creado un nuevo proyecto para ti.</p>
            
            <div class="project-details">
              <h3>📋 Detalles del Proyecto</h3>
              <p><strong>ID:</strong> ${data.project.unique_id}</p>
              <p><strong>Título:</strong> ${data.project.title}</p>
              <p><strong>Descripción:</strong> ${data.project.description}</p>
              <p><strong>Presupuesto:</strong> $${parseFloat(data.project.budget || 0).toLocaleString()}</p>
              <p><strong>Fecha de Inicio:</strong> ${data.project.start_date ? new Date(data.project.start_date).toLocaleDateString('es-ES') : 'Por definir'}</p>
              <p><strong>Fecha de Entrega:</strong> ${data.project.end_date ? new Date(data.project.end_date).toLocaleDateString('es-ES') : 'Por definir'}</p>
              <p><strong>Estado:</strong> <span class="status-badge status-${data.project.status}">${data.project.status.toUpperCase()}</span></p>
            </div>
            
            <p>Puedes seguir el progreso de tu proyecto en tiempo real desde tu dashboard.</p>
            
            <a href="https://genswave.org/dashboard" class="button">Ver Proyecto</a>
          </div>
          <div class="footer">
            <p>© 2024 Genswave - Desarrollo Web y Aplicaciones Móviles</p>
            <p>📧 support@genswave.org | 🌐 genswave.org</p>
          </div>
        </div>
      `;

    case 'request_created':
      return `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>✅ Solicitud Recibida</h1>
          </div>
          <div class="content">
            <h2>Hola ${data.userName},</h2>
            <p>Hemos recibido tu solicitud correctamente. Nuestro equipo la revisará pronto.</p>
            
            <div class="project-details">
              <h3>📋 Detalles de tu Solicitud</h3>
              <p><strong>ID:</strong> ${data.request.unique_id}</p>
              <p><strong>Título:</strong> ${data.request.title}</p>
              <p><strong>Tipo de Proyecto:</strong> ${data.request.project_type}</p>
              <p><strong>Presupuesto Estimado:</strong> ${data.request.budget_range}</p>
              <p><strong>Timeline:</strong> ${data.request.timeline}</p>
              <p><strong>Estado:</strong> <span class="status-badge status-pending">PENDIENTE</span></p>
            </div>
            
            <p><strong>Próximos pasos:</strong></p>
            <ul>
              <li>Revisaremos tu solicitud en las próximas 24 horas</li>
              <li>Te contactaremos para discutir los detalles</li>
              <li>Recibirás una cotización personalizada</li>
            </ul>
            
            <a href="https://genswave.org/dashboard" class="button">Seguir mi Solicitud</a>
          </div>
          <div class="footer">
            <p>© 2024 Genswave - Desarrollo Web y Aplicaciones Móviles</p>
            <p>📧 support@genswave.org | 🌐 genswave.org</p>
          </div>
        </div>
      `;

    case 'request_status_update':
      const statusTexts = {
        pending: 'Pendiente',
        confirmed: 'Confirmada',
        in_progress: 'En Progreso',
        completed: 'Completada',
        cancelled: 'Cancelada'
      };

      return `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>📢 Actualización de Solicitud</h1>
          </div>
          <div class="content">
            <h2>Hola ${data.userName},</h2>
            <p>El estado de tu solicitud ha sido actualizado.</p>
            
            <div class="project-details">
              <h3>📋 Información de la Solicitud</h3>
              <p><strong>ID:</strong> ${data.request.unique_id}</p>
              <p><strong>Título:</strong> ${data.request.title}</p>
              <p><strong>Estado Anterior:</strong> ${statusTexts[data.previousStatus] || data.previousStatus}</p>
              <p><strong>Estado Actual:</strong> <span class="status-badge status-${data.request.status}">${statusTexts[data.request.status] || data.request.status.toUpperCase()}</span></p>
              ${data.request.admin_notes ? `<p><strong>Notas del Equipo:</strong> ${data.request.admin_notes}</p>` : ''}
            </div>
            
            <a href="https://genswave.org/dashboard" class="button">Ver Detalles</a>
          </div>
          <div class="footer">
            <p>© 2024 Genswave - Desarrollo Web y Aplicaciones Móviles</p>
            <p>📧 support@genswave.org | 🌐 genswave.org</p>
          </div>
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
    '¡Bienvenido a Genswave! 🚀',
    'welcome',
    { name: userName }
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
  sendPasswordResetConfirmation,
  sendProfileUpdateConfirmation,
  sendProjectCreatedEmail,
  sendRequestCreatedEmail,
  sendRequestStatusUpdateEmail
};