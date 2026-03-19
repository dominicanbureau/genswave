import express from 'express';
import db from '../database.js';

const router = express.Router();

// Handle data deletion requests
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      instagramUsername,
      requestType,
      reason,
      additionalInfo
    } = req.body;

    // Validate required fields
    if (!name || !email || !requestType) {
      return res.status(400).json({
        error: 'Name, email, and request type are required'
      });
    }

    // Generate reference number
    const referenceNumber = `DEL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store the deletion request in database
    const query = `
      INSERT INTO data_deletion_requests (
        reference_number,
        name,
        email,
        instagram_username,
        request_type,
        reason,
        additional_info,
        status,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, reference_number
    `;

    const values = [
      referenceNumber,
      name,
      email,
      instagramUsername || null,
      requestType,
      reason || null,
      additionalInfo || null,
      'pending',
      new Date()
    ];

    const result = await db.query(query, values);

    // Log the request for admin notification
    console.log(`📋 New data deletion request: ${referenceNumber}`, {
      name,
      email,
      requestType,
      timestamp: new Date().toISOString()
    });

    // Send email notification to admin (you can implement this later)
    // await sendAdminNotification(referenceNumber, name, email, requestType);

    res.status(200).json({
      success: true,
      message: 'Data deletion request submitted successfully',
      referenceNumber: referenceNumber
    });

  } catch (error) {
    console.error('❌ Error processing data deletion request:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get deletion request status (for admin or user verification)
router.get('/status/:referenceNumber', async (req, res) => {
  try {
    const { referenceNumber } = req.params;

    const query = `
      SELECT 
        reference_number,
        name,
        email,
        request_type,
        status,
        created_at,
        processed_at,
        admin_notes
      FROM data_deletion_requests 
      WHERE reference_number = $1
    `;

    const result = await db.query(query, [referenceNumber]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Deletion request not found'
      });
    }

    res.json({
      success: true,
      request: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error fetching deletion request status:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Admin endpoint to list all deletion requests
router.get('/admin/list', async (req, res) => {
  try {
    // Simple auth check - in production, use proper admin authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const query = `
      SELECT 
        id,
        reference_number,
        name,
        email,
        instagram_username,
        request_type,
        reason,
        status,
        created_at,
        processed_at
      FROM data_deletion_requests 
      ORDER BY created_at DESC
    `;

    const result = await db.query(query);

    res.json({
      success: true,
      requests: result.rows
    });

  } catch (error) {
    console.error('❌ Error fetching deletion requests:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Admin endpoint to update deletion request status
router.put('/admin/:id/status', async (req, res) => {
  try {
    // Simple auth check - in production, use proper admin authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['pending', 'in_progress', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const query = `
      UPDATE data_deletion_requests 
      SET 
        status = $1,
        admin_notes = $2,
        processed_at = CASE WHEN $1 IN ('completed', 'rejected') THEN NOW() ELSE processed_at END,
        updated_at = NOW()
      WHERE id = $3
      RETURNING reference_number, name, email
    `;

    const result = await db.query(query, [status, adminNotes || null, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Deletion request not found'
      });
    }

    console.log(`📋 Data deletion request ${result.rows[0].reference_number} updated to: ${status}`);

    res.json({
      success: true,
      message: 'Deletion request status updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating deletion request status:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Instagram-specific data deletion endpoint (for Meta compliance)
router.post('/instagram', async (req, res) => {
  try {
    const { signed_request } = req.body;
    
    // Parse the signed request from Instagram
    // This is a simplified version - in production, verify the signature
    if (!signed_request) {
      return res.status(400).json({
        error: 'Missing signed_request parameter'
      });
    }

    // Extract user ID from signed request
    const [signature, payload] = signed_request.split('.');
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
    const userId = decodedPayload.user_id;

    console.log(`📱 Instagram data deletion request for user: ${userId}`);

    // Create deletion request for Instagram user
    const referenceNumber = `IG-DEL-${Date.now()}-${userId}`;
    
    const query = `
      INSERT INTO data_deletion_requests (
        reference_number,
        name,
        email,
        instagram_username,
        request_type,
        reason,
        additional_info,
        status,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING reference_number
    `;

    const values = [
      referenceNumber,
      'Instagram User',
      `instagram_user_${userId}@temp.com`,
      userId,
      'instagram',
      'Instagram platform request',
      `Automatic deletion request from Instagram for user ID: ${userId}`,
      'pending',
      new Date()
    ];

    await db.query(query, values);

    // Return the required response format for Instagram
    res.json({
      url: `https://genswave.org/data-deletion/status/${referenceNumber}`,
      confirmation_code: referenceNumber
    });

  } catch (error) {
    console.error('❌ Error processing Instagram data deletion:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;