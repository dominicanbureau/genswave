import db from './database.js';

async function createPasswordResetTable() {
  try {
    console.log('🔄 Creating password_reset_tokens table...');
    
    await db.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ password_reset_tokens table created successfully');
    
    // Create index for faster lookups
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token 
      ON password_reset_tokens(token)
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email 
      ON password_reset_tokens(email)
    `);
    
    console.log('✅ Indexes created successfully');
    
  } catch (error) {
    console.error('❌ Error creating password_reset_tokens table:', error);
    throw error;
  }
}

// Run migration
createPasswordResetTable()
  .then(() => {
    console.log('🎉 Password reset migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });