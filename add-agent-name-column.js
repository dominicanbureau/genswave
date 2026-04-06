import db from './database.js';

async function addAgentNameColumn() {
  try {
    console.log('🔧 Adding assigned_agent_name column to ai_support_transfers...');

    // Add the column
    await db.query(`
      ALTER TABLE ai_support_transfers 
      ADD COLUMN IF NOT EXISTS assigned_agent_name VARCHAR(100)
    `);

    console.log('✅ Column added successfully');

    // Update existing transfers with random agent names
    const existingTransfers = await db.query(`
      SELECT id, session_id FROM ai_support_transfers 
      WHERE assigned_agent_name IS NULL
    `);

    if (existingTransfers.rows.length > 0) {
      console.log(`📝 Updating ${existingTransfers.rows.length} existing transfers...`);
      
      for (const transfer of existingTransfers.rows) {
        const seed = transfer.session_id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const firstNames = [
          'Sebastián', 'Valentina', 'Alejandro', 'Isabella', 'Nicolás',
          'Sofía', 'Matías', 'Camila', 'Santiago', 'Luciana',
          'Gabriel', 'Victoria', 'Leonardo', 'Catalina', 'Maximiliano',
          'Emilia', 'Rafael', 'Martina', 'Adrián', 'Antonella'
        ];
        const lastNames = [
          'Mendoza', 'Castellanos', 'Valenzuela', 'Santamaría', 'Villarreal',
          'Montalvo', 'Cervantes', 'Delgado', 'Navarro', 'Quintero',
          'Salazar', 'Vega', 'Morales', 'Herrera', 'Rojas'
        ];
        
        const firstNameIndex = seed % firstNames.length;
        const lastNameIndex = (seed * 7) % lastNames.length;
        const agentName = `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`;
        
        await db.query(`
          UPDATE ai_support_transfers 
          SET assigned_agent_name = $1 
          WHERE id = $2
        `, [agentName, transfer.id]);
      }
      
      console.log('✅ Existing transfers updated');
    }

    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

addAgentNameColumn();
