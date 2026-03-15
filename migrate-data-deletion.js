import db from './database.js';

async function migrateDataDeletion() {
  console.log('🗑️ Setting up data deletion system...');
  
  try {
    // Create data_deletion_requests table
    await db.query(`
      CREATE TABLE IF NOT EXISTS data_deletion_requests (
        id SERIAL PRIMARY KEY,
        reference_number VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        instagram_username VARCHAR(255),
        request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('all', 'instagram', 'contact', 'projects')),
        reason VARCHAR(100),
        additional_info TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP
      )
    `);
    console.log('✅ Data deletion requests table created');

    // Create indexes for better performance
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_data_deletion_reference 
      ON data_deletion_requests(reference_number)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_data_deletion_status 
      ON data_deletion_requests(status)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_data_deletion_created_at 
      ON data_deletion_requests(created_at DESC)
    `);
    
    console.log('✅ Data deletion indexes created');
    console.log('🎉 Data deletion system setup completed!');
    
  } catch (error) {
    console.error('❌ Data deletion migration failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateDataDeletion()
    .then(() => {
      console.log('✅ Data deletion migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Data deletion migration failed:', error);
      process.exit(1);
    });
}

export default migrateDataDeletion;