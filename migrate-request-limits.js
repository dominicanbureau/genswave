import db from './database.js';

async function migrateRequestLimits() {
  try {
    console.log('🔄 Adding request limits and email tracking...');

    // Add last_request_at column to users table for 48h limit
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS last_request_at TIMESTAMP DEFAULT NULL
    `);

    // Add email tracking columns to requests table
    await db.query(`
      ALTER TABLE requests 
      ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS status_update_emails_sent JSONB DEFAULT '[]'::jsonb
    `);

    // Add email tracking columns to projects table
    await db.query(`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS creation_email_sent BOOLEAN DEFAULT FALSE
    `);

    // Add email tracking columns to appointments table
    await db.query(`
      ALTER TABLE appointments 
      ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS status_update_emails_sent JSONB DEFAULT '[]'::jsonb
    `);

    // Create email_logs table for tracking all emails
    await db.query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        email_type VARCHAR(50) NOT NULL,
        recipient_email VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resend_id VARCHAR(255),
        success BOOLEAN DEFAULT TRUE,
        error_message TEXT,
        metadata JSONB DEFAULT '{}'::jsonb
      )
    `);

    // Create index for performance
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
      CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);
      CREATE INDEX IF NOT EXISTS idx_users_last_request_at ON users(last_request_at);
    `);

    console.log('✅ Request limits and email tracking migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateRequestLimits()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export default migrateRequestLimits;