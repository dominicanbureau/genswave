import express from 'express';
import db from '../database.js';
import { sendRequestCreatedEmail, sendRequestStatusUpdateEmail } from '../utils/emailService.js';

const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    next();
};

// Middleware to check admin
const requireAdmin = (req, res, next) => {
    if (!req.session.userId || req.session.user.role !== 'admin') {
        return res.status(403).json({ error: 'No autorizado' });
    }
    next();
};

// Get all requests (admin only)
router.get('/admin/requests', requireAdmin, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT r.*, u.name as user_name, u.email as user_email
            FROM requests r
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
        `);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Update request status (admin only)
router.patch('/admin/requests/:id/status', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Get current request data for comparison
        const currentRequest = await db.query(
            'SELECT r.*, u.name as user_name, u.email as user_email FROM requests r JOIN users u ON r.user_id = u.id WHERE r.id = $1',
            [id]
        );

        if (currentRequest.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        const previousStatus = currentRequest.rows[0].status;

        const result = await db.query(
            'UPDATE requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        // Send status update email if status changed
        if (previousStatus !== status) {
            try {
                const user = currentRequest.rows[0];
                const updatedRequest = { ...result.rows[0], title: user.title };
                await sendRequestStatusUpdateEmail(user.user_email, user.user_name, updatedRequest, previousStatus);
                console.log(`✅ Request status update email sent to ${user.user_email} for request ${updatedRequest.unique_id}`);
            } catch (emailError) {
                console.error('❌ Failed to send request status update email:', emailError);
                // Don't fail update if email fails
            }
        }

        res.json({ success: true, request: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ error: 'Error al actualizar la solicitud' });
    }
});

// Delete request (admin only)
router.delete('/admin/requests/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'DELETE FROM requests WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar solicitud:', error);
        res.status(500).json({ error: 'Error al eliminar la solicitud' });
    }
});

// Get user requests
router.get('/', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        
        const result = await db.query(
            'SELECT * FROM requests WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Check request limit
router.get('/check-limit', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        
        const result = await db.query(
            'SELECT last_request_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0 || !result.rows[0].last_request_at) {
            return res.json({ canCreate: true, hoursRemaining: 0 });
        }

        const lastRequestTime = new Date(result.rows[0].last_request_at);
        const now = new Date();
        const hoursDiff = (now - lastRequestTime) / (1000 * 60 * 60);

        if (hoursDiff >= 48) {
            return res.json({ canCreate: true, hoursRemaining: 0 });
        }

        const hoursRemaining = Math.ceil(48 - hoursDiff);
        res.json({ canCreate: false, hoursRemaining });
    } catch (error) {
        console.error('Error al verificar límite:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Create request
router.post('/', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { 
            title, 
            description, 
            projectType, 
            budgetRange, 
            timeline, 
            budget,
            attachments,
            preferredStartDate,
            technicalRequirements,
            targetAudience,
            additionalNotes
        } = req.body;

        // Check 48-hour limit
        const lastRequestCheck = await db.query(
            'SELECT last_request_at FROM users WHERE id = $1',
            [userId]
        );

        if (lastRequestCheck.rows.length > 0 && lastRequestCheck.rows[0].last_request_at) {
            const lastRequestTime = new Date(lastRequestCheck.rows[0].last_request_at);
            const now = new Date();
            const hoursDiff = (now - lastRequestTime) / (1000 * 60 * 60);

            if (hoursDiff < 48) {
                const hoursRemaining = Math.ceil(48 - hoursDiff);
                return res.status(429).json({ 
                    error: `Debes esperar ${hoursRemaining} horas antes de crear otra solicitud detallada`,
                    hoursRemaining 
                });
            }
        }

        // Generate unique ID for request
        const uniqueId = 'S' + Math.floor(Math.random() * 900000 + 100000).toString();

        const result = await db.query(
            `INSERT INTO requests (
                user_id, title, description, project_type, budget_range, 
                timeline, budget, attachments, preferred_start_date,
                technical_requirements, target_audience, additional_notes, unique_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
            RETURNING *`,
            [
                userId, title, description, projectType, budgetRange,
                timeline, budget, Array.isArray(attachments) ? attachments : (attachments || []), preferredStartDate,
                technicalRequirements, targetAudience, additionalNotes, uniqueId
            ]
        );

        // Update user's last_request_at
        await db.query(
            'UPDATE users SET last_request_at = CURRENT_TIMESTAMP WHERE id = $1',
            [userId]
        );

        // Get user info for email
        const userResult = await db.query(
            'SELECT name, email FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            
            // Send request creation email
            try {
                await sendRequestCreatedEmail(user.email, user.name, result.rows[0]);
                console.log(`✅ Request creation email sent to ${user.email} for request ${result.rows[0].unique_id}`);
            } catch (emailError) {
                console.error('❌ Failed to send request creation email:', emailError);
                // Don't fail request creation if email fails
            }
        }

        res.json({ success: true, request: result.rows[0] });
    } catch (error) {
        console.error('Error al crear solicitud:', error);
        res.status(500).json({ error: 'Error al crear la solicitud' });
    }
});

// Update request
router.patch('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.userId;
        const updates = req.body;

        // Verify ownership
        const checkResult = await db.query(
            'SELECT * FROM requests WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        const fields = [];
        const values = [];
        let paramCount = 1;

        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(updates[key]);
                paramCount++;
            }
        });

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const result = await db.query(
            `UPDATE requests SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        res.json({ success: true, request: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar solicitud:', error);
        res.status(500).json({ error: 'Error al actualizar la solicitud' });
    }
});

// Delete request
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.userId;

        const result = await db.query(
            'DELETE FROM requests WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar solicitud:', error);
        res.status(500).json({ error: 'Error al eliminar la solicitud' });
    }
});

export default router;
