import express from 'express';
import db from '../database.js';

const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    next();
};

// Get messages for user or all conversations for admin
router.get('/', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const isAdmin = req.session.user.role === 'admin';

        if (isAdmin) {
            // Get all conversations grouped by user
            const result = await db.query(`
                SELECT DISTINCT ON (m.user_id) 
                    m.user_id as id,
                    u.name as user_name,
                    u.email as user_email,
                    m.message as last_message,
                    m.created_at as last_message_at,
                    (SELECT COUNT(*) FROM messages WHERE user_id = m.user_id AND is_read = false AND sender_id != $1) as unread_count
                FROM messages m
                JOIN users u ON m.user_id = u.id
                WHERE m.user_id != $1
                ORDER BY m.user_id, m.created_at DESC
            `, [userId]);
            
            res.json(result.rows);
        } else {
            // Get user's conversation with admin
            const result = await db.query(`
                SELECT m.*, 
                    sender.name as sender_name,
                    sender.role as sender_role,
                    sender.profile_photo as sender_photo
                FROM messages m
                JOIN users sender ON m.sender_id = sender.id
                WHERE m.user_id = $1
                ORDER BY m.created_at ASC
            `, [userId]);
            
            res.json(result.rows);
        }
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Get all conversations for admin (specific route)
router.get('/admin/conversations', requireAuth, async (req, res) => {
    try {
        if (req.session.user.role !== 'admin') {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const userId = req.session.userId;
        
        const result = await db.query(`
            SELECT DISTINCT ON (m.user_id) 
                m.user_id as id,
                u.name as user_name,
                u.email as user_email,
                m.message as last_message,
                m.created_at as last_message_at,
                (SELECT COUNT(*) FROM messages WHERE user_id = m.user_id AND is_read = false AND sender_id != $1) as unread_count
            FROM messages m
            JOIN users u ON m.user_id = u.id
            WHERE m.user_id != $1
            ORDER BY m.user_id, m.created_at DESC
        `, [userId]);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener conversaciones:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Get conversation with specific user (admin only)
router.get('/conversation/:userId', requireAuth, async (req, res) => {
    try {
        if (req.session.user.role !== 'admin') {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const { userId } = req.params;
        
        const result = await db.query(`
            SELECT m.*, 
                sender.name as sender_name,
                sender.role as sender_role,
                sender.profile_photo as sender_photo
            FROM messages m
            JOIN users sender ON m.sender_id = sender.id
            WHERE m.user_id = $1
            ORDER BY m.created_at ASC
        `, [userId]);
        
        // Mark messages as read
        await db.query(
            'UPDATE messages SET is_read = true WHERE user_id = $1 AND sender_id != $2',
            [userId, req.session.userId]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener conversación:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Send message
router.post('/', requireAuth, async (req, res) => {
    try {
        const { message, user_id, attachments } = req.body;
        const senderId = req.session.userId;
        const isAdmin = req.session.user.role === 'admin';

        // Determine the user_id for the conversation
        const conversationUserId = isAdmin ? user_id : senderId;

        // Validate that we have either message or attachments
        if (!message?.trim() && (!attachments || attachments.length === 0)) {
            return res.status(400).json({ error: 'Mensaje o archivos requeridos' });
        }

        // Insert message with attachments
        const result = await db.query(
            'INSERT INTO messages (user_id, sender_id, message, attachments) VALUES ($1, $2, $3, $4) RETURNING *',
            [conversationUserId, senderId, message || '', JSON.stringify(attachments || [])]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Mark messages as read
router.patch('/read', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        
        await db.query(
            'UPDATE messages SET is_read = true WHERE user_id = $1 AND sender_id != $1',
            [userId]
        );
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al marcar mensajes como leídos:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Mark messages as read
router.post('/mark-read', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        
        if (!userId) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        
        // Use a more robust approach with explicit admin ID lookup
        const adminUsersResult = await db.query('SELECT id FROM users WHERE role = $1', ['admin']);
        const adminIds = adminUsersResult.rows.map(user => user.id);
        
        if (adminIds.length === 0) {
            // No admin users found, nothing to mark as read
            return res.json({ success: true, message: 'No admin messages to mark' });
        }
        
        // Mark messages as read using explicit admin IDs
        const updateResult = await db.query(`
            UPDATE messages 
            SET is_read = true 
            WHERE user_id = $1 
            AND sender_id = ANY($2::int[])
            AND is_read = false
        `, [userId, adminIds]);
        
        console.log(`✅ Marked ${updateResult.rowCount} messages as read for user ${userId}`);
        res.json({ success: true, markedCount: updateResult.rowCount });
        
    } catch (error) {
        console.error('Error marking messages as read:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            position: error.position,
            routine: error.routine
        });
        
        // Return success anyway to prevent UI issues
        res.json({ success: true, error: 'Partial failure but continuing' });
    }
});

// Delete single message (admin only)
router.delete('/:messageId', requireAuth, async (req, res) => {
    try {
        if (req.session.user.role !== 'admin') {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const { messageId } = req.params;
        
        const result = await db.query(
            'DELETE FROM messages WHERE id = $1 RETURNING *',
            [messageId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Mensaje no encontrado' });
        }
        
        res.json({ success: true, message: 'Mensaje eliminado' });
    } catch (error) {
        console.error('Error al eliminar mensaje:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Delete all messages from a conversation (admin only)
router.delete('/conversation/:userId/all', requireAuth, async (req, res) => {
    try {
        if (req.session.user.role !== 'admin') {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const { userId } = req.params;
        
        const result = await db.query(
            'DELETE FROM messages WHERE user_id = $1 RETURNING *',
            [userId]
        );
        
        res.json({ 
            success: true, 
            message: `${result.rows.length} mensajes eliminados`,
            deletedCount: result.rows.length
        });
    } catch (error) {
        console.error('Error al eliminar conversación:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

export default router;
