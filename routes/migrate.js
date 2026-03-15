import express from 'express';
import db from '../database.js';

const router = express.Router();

// Endpoint to run the profile_pic migration
router.post('/add-profile-pic', async (req, res) => {
  try {
    console.log('🔧 Adding profile_pic column to bot_user_settings table...');
    
    // Add profile_pic column if it doesn't exist
    await db.query(`
      ALTER TABLE bot_user_settings 
      ADD COLUMN IF NOT EXISTS profile_pic TEXT
    `);
    
    console.log('✅ Profile pic column added successfully!');
    
    res.json({ 
      success: true, 
      message: 'Profile pic column added successfully to bot_user_settings table' 
    });
  } catch (error) {
    console.error('❌ Error adding profile_pic column:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error adding profile_pic column',
      details: error.message 
    });
  }
});

// Endpoint to check if migration is needed
router.get('/check-profile-pic', async (req, res) => {
  try {
    // Check if profile_pic column exists
    const result = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'bot_user_settings' 
      AND column_name = 'profile_pic'
    `);
    
    const columnExists = result.rows.length > 0;
    
    res.json({ 
      columnExists,
      migrationNeeded: !columnExists,
      message: columnExists ? 'Profile pic column already exists' : 'Migration needed'
    });
  } catch (error) {
    console.error('❌ Error checking profile_pic column:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error checking migration status',
      details: error.message 
    });
  }
});

export default router;