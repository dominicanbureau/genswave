import express from 'express';
import db from '../database.js';

const router = express.Router();

// Get notifications for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        const result = await db.query(`
            SELECT * FROM notifications 
            WHERE user_id = $1 
            ORDER BY created_at DESC 
            LIMIT 20
        `, [userId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
    try {
        const userId = req.session.userId;
        const notificationId = req.params.id;

        if (!userId) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        await db.query(`
            UPDATE notifications 
            SET is_read = true 
            WHERE id = $1 AND user_id = $2
        `, [notificationId, userId]);

        res.json({ success: true });
    } catch (error) {
        console.error('Error al marcar notificación como leída:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Mark all notifications as read
router.put('/read-all', async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        await db.query(`
            UPDATE notifications 
            SET is_read = true 
            WHERE user_id = $1 AND is_read = false
        `, [userId]);

        res.json({ success: true });
    } catch (error) {
        console.error('Error al marcar todas las notificaciones como leídas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Create notification (internal function)
export const createNotification = async (userId, type, title, message, relatedId = null, relatedType = null) => {
    try {
        await db.query(`
            INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [userId, type, title, message, relatedId, relatedType]);
    } catch (error) {
        console.error('Error al crear notificación:', error);
    }
};

export default router;