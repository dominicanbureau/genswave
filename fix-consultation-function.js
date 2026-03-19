// This is the correct processConsultationInput function
// Copy this to replace the corrupted one in routes/instagram.js

async function processConsultationInput(senderId, text, state) {
  const consultationId = text.trim().toUpperCase();
  
  if (consultationId.length < 3) {
    await sendInstagramMessage(senderId,
      `⚠️ ID muy corto\n\n` +
      `Por favor, proporcione un ID válido.\n\n` +
      `Formato esperado: P123456 (proyectos) o S123456 (solicitudes)\n\n` +
      `Pregunta actual:\n` +
      `Su ID de consulta:`
    );
    return;
  }
  
  try {
    let result = null;
    let type = '';
    
    console.log(`🔍 Searching for consultation ID: ${consultationId}`);
    
    // Check if it's a project (starts with P)
    if (consultationId.startsWith('P')) {
      const projectResult = await db.query(
        'SELECT * FROM projects WHERE unique_id = $1',
        [consultationId]
      );
      console.log(`📊 Project search result: ${projectResult.rows.length} rows`);
      if (projectResult.rows.length > 0) {
        result = projectResult.rows[0];
        type = 'project';
      }
    }
    // Check if it's a solicitud (starts with S) - search in both appointments and requests
    else if (consultationId.startsWith('S')) {
      // First check appointments table
      const appointmentResult = await db.query(
        'SELECT * FROM appointments WHERE unique_id = $1',
        [consultationId]
      );
      console.log(`📋 Appointment search result: ${appointmentResult.rows.length} rows`);
      
      if (appointmentResult.rows.length > 0) {
        result = appointmentResult.rows[0];
        type = 'appointment';
      } else {
        // If not found in appointments, check requests table
        const requestResult = await db.query(
          'SELECT * FROM requests WHERE unique_id = $1',
          [consultationId]
        );
        console.log(`📝 Request search result: ${requestResult.rows.length} rows`);
        
        if (requestResult.rows.length > 0) {
          result = requestResult.rows[0];
          type = 'request';
        }
      }
    }
    // Try all tables if no prefix
    else {
      const projectResult = await db.query(
        'SELECT * FROM projects WHERE unique_id = $1',
        [consultationId]
      );
      if (projectResult.rows.length > 0) {
        result = projectResult.rows[0];
        type = 'project';
      } else {
        const appointmentResult = await db.query(
          'SELECT * FROM appointments WHERE unique_id = $1',
          [consultationId]
        );
        if (appointmentResult.rows.length > 0) {
          result = appointmentResult.rows[0];
          type = 'appointment';
        } else {
          const requestResult = await db.query(
            'SELECT * FROM requests WHERE unique_id = $1',
            [consultationId]
          );
          if (requestResult.rows.length > 0) {
            result = requestResult.rows[0];
            type = 'request';
          }
        }
      }
    }
    
    if (!result) {
      await sendInstagramMessage(senderId,
        `❌ *ID NO ENCONTRADO*\n\n` +
        `No se encontró ningún proyecto o solicitud con el ID: ${consultationId}\n\n` +
        `Verifique que:\n` +
        `• El ID esté escrito correctamente\n` +
        `• Sea un ID válido de Genswave\n\n` +
        `Para nueva consulta, escriba "consulta"`
      );
    } else if (type === 'project') {
      // Format project status
      const statusEmoji = {
        'active': '🟢',
        'completed': '✅',
        'paused': '⏸️',
        'cancelled': '❌'
      };
      
      const startDate = result.start_date ? new Date(result.start_date).toLocaleDateString('es-ES') : 'No definida';
      const endDate = result.end_date ? new Date(result.end_date).toLocaleDateString('es-ES') : 'No definida';
      const budget = result.budget ? `$${parseFloat(result.budget).toLocaleString()}` : 'No definido';
      
      await sendInstagramMessage(senderId,
        `📊 *ESTADO DEL PROYECTO*\n\n` +
        `🆔 ID: ${result.unique_id}\n` +
        `📋 Título: ${result.title}\n` +
        `${statusEmoji[result.status] || '⚪'} Estado: ${result.status.toUpperCase()}\n` +
        `📈 Progreso: ${result.progress || 0}%\n\n` +
        `📅 Fecha inicio: ${startDate}\n` +
        `📅 Fecha fin: ${endDate}\n` +
        `💰 Presupuesto: ${budget}\n\n` +
        `📝 Descripción:\n${result.description || 'Sin descripción'}\n\n` +
        `Para más detalles, visite su dashboard en:\nhttps://genswave.org`
      );
    } else if (type === 'appointment') {
      // Format appointment status
      const statusEmoji = {
        'pending': '⏳',
        'approved': '✅',
        'rejected': '❌',
        'completed': '🎉',
        'confirmed': '✅'
      };
      
      const preferredDate = new Date(result.preferred_date).toLocaleDateString('es-ES');
      const createdDate = new Date(result.created_at).toLocaleDateString('es-ES');
      
      await sendInstagramMessage(senderId,
        `📋 *ESTADO DE SOLICITUD (CITA)*\n\n` +
        `🆔 ID: ${result.unique_id}\n` +
        `👤 Cliente: ${result.name}\n` +
        `${statusEmoji[result.status] || '⚪'} Estado: ${result.status.toUpperCase()}\n\n` +
        `🛠️ Servicio: ${result.service}\n` +
        `🏢 Empresa: ${result.business_name || 'No especificada'}\n` +
        `📅 Fecha preferida: ${preferredDate}\n` +
        `📅 Solicitud creada: ${createdDate}\n\n` +
        `📝 Mensaje:\n${result.message || 'Sin mensaje'}\n\n` +
        `${result.admin_notes ? `📋 Notas del equipo:\n${result.admin_notes}\n\n` : ''}` +
        `Para más detalles, visite su dashboard en:\nhttps://genswave.org`
      );
    } else if (type === 'request') {
      // Format request status
      const statusEmoji = {
        'pending': '⏳',
        'approved': '✅',
        'rejected': '❌',
        'completed': '🎉',
        'confirmed': '✅'
      };
      
      const createdDate = new Date(result.created_at).toLocaleDateString('es-ES');
      const budget = result.budget ? `$${parseFloat(result.budget).toLocaleString()}` : 'No definido';
      
      await sendInstagramMessage(senderId,
        `📋 *ESTADO DE SOLICITUD DETALLADA*\n\n` +
        `🆔 ID: ${result.unique_id}\n` +
        `📋 Título: ${result.title}\n` +
        `${statusEmoji[result.status] || '⚪'} Estado: ${result.status.toUpperCase()}\n\n` +
        `🛠️ Tipo: ${result.project_type || 'No especificado'}\n` +
        `💰 Presupuesto: ${budget}\n` +
        `📅 Solicitud creada: ${createdDate}\n\n` +
        `📝 Descripción:\n${result.description || 'Sin descripción'}\n\n` +
        `${result.admin_notes ? `📋 Notas del equipo:\n${result.admin_notes}\n\n` : ''}` +
        `Para más detalles, visite su dashboard en:\nhttps://genswave.org`
      );
    }
    
    // Reset state
    await updateConversationState(senderId, 'idle', {});
    
  } catch (error) {
    console.error('❌ Error processing consultation:', error);
    await sendErrorMessage(senderId);
    await updateConversationState(senderId, 'idle', {});
  }
}