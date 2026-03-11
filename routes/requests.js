import express from 'express';
import db from '../database.js';

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

        const result = await db.query(
            'UPDATE requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
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

        const result = await db.query(
            `INSERT INTO requests (
                user_id, title, description, project_type, budget_range, 
                timeline, budget, attachments, preferred_start_date,
                technical_requirements, target_audience, additional_notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
            RETURNING *`,
            [
                userId, title, description, projectType, budgetRange,
                timeline, budget, attachments || [], preferredStartDate,
                technicalRequirements, targetAudience, additionalNotes
            ]
        );

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
