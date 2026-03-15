import fs from 'fs';

// Read the current file
let content = fs.readFileSync('routes/instagram.js', 'utf8');

// Replace the appointment-only search with appointment + requests search
const oldPattern = `      if (appointmentResult.rows.length > 0) {
        result = appointmentResult.rows[0];
        type = 'appointment';
      }`;

const newPattern = `      if (appointmentResult.rows.length > 0) {
        result = appointmentResult.rows[0];
        type = 'appointment';
      } else {
        // If not found in appointments, check requests table
        const requestResult = await db.query(
          'SELECT * FROM requests WHERE unique_id = $1',
          [consultationId]
        );
        if (requestResult.rows.length > 0) {
          result = requestResult.rows[0];
          type = 'request';
        }
      }`;

// Replace the pattern
content = content.replace(oldPattern, newPattern);

// Add the request response handling after appointment response
const appointmentEndPattern = `        \`Para más detalles, visite su dashboard en:\\nhttps://genswave.onrender.com\`
      );
    }`;

const requestResponsePattern = `        \`Para más detalles, visite su dashboard en:\\nhttps://genswave.onrender.com\`
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
      const budget = result.budget ? \`$\${parseFloat(result.budget).toLocaleString()}\` : 'No definido';
      
      await sendInstagramMessage(senderId,
        \`📋 *ESTADO DE SOLICITUD DETALLADA*\\n\\n\` +
        \`🆔 ID: \${result.unique_id}\\n\` +
        \`📋 Título: \${result.title}\\n\` +
        \`\${statusEmoji[result.status] || '⚪'} Estado: \${result.status.toUpperCase()}\\n\\n\` +
        \`🛠️ Tipo: \${result.project_type || 'No especificado'}\\n\` +
        \`💰 Presupuesto: \${budget}\\n\` +
        \`📅 Solicitud creada: \${createdDate}\\n\\n\` +
        \`📝 Descripción:\\n\${result.description || 'Sin descripción'}\\n\\n\` +
        \`Para más detalles, visite su dashboard en:\\nhttps://genswave.onrender.com\`
      );
    }`;

content = content.replace(appointmentEndPattern, requestResponsePattern);

// Write the updated file
fs.writeFileSync('routes/instagram.js', content);

console.log('✅ Instagram consultation function patched successfully!');
console.log('📋 Added requests table search for S-prefixed IDs');
console.log('📝 Added request response formatting');