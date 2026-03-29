import express from 'express';
import db from '../database.js';
import { createNotification } from './notifications.js';

const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    next();
};

// Create appointment
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, businessName, service, message, preferredDate } = req.body;

        // Generate unique ID for appointment
        const uniqueId = 'S' + Math.floor(Math.random() * 900000 + 100000).toString();

        const result = await db.query(
            `INSERT INTO appointments (name, email, phone, business_name, service, message, preferred_date, unique_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [name, email, phone, businessName || null, service, message, preferredDate, uniqueId]
        );

        res.json({ success: true, appointment: result.rows[0] });
    } catch (error) {
        console.error('Error al crear cita:', error);
        res.status(500).json({ error: 'Error al crear la cita' });
    }
});

// Get all appointments (admin only) or user appointments
router.get('/', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const isAdmin = req.session.user?.role === 'admin';
        
        let query, params;
        
        if (isAdmin) {
            query = 'SELECT * FROM appointments ORDER BY created_at DESC';
            params = [];
        } else {
            query = 'SELECT * FROM appointments WHERE user_id = $1 ORDER BY created_at DESC';
            params = [userId];
        }
        
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener citas:', error);
        res.status(500).json({ error: 'Error al obtener las citas' });
    }
});

// Update appointment status (admin only)
router.patch('/:id/status', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const isAdmin = req.session.user?.role === 'admin';

        if (!isAdmin) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        // Get current appointment data
        const currentAppointment = await db.query('SELECT * FROM appointments WHERE id = $1', [id]);
        if (currentAppointment.rows.length === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        const result = await db.query(
            'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        // Create notification if status changed and appointment has user_id
        const appointment = result.rows[0];
        if (appointment.user_id && status !== currentAppointment.rows[0].status) {
            const statusLabels = {
                'pending': 'Pendiente',
                'approved': 'Aprobada',
                'rejected': 'Rechazada',
                'completed': 'Completada',
                'confirmed': 'Confirmada'
            };

            await createNotification(
                appointment.user_id,
                'appointment_status_change',
                'Estado de Solicitud Actualizado',
                `El estado de tu solicitud "${appointment.service}" ha cambiado a: ${statusLabels[status] || status}`,
                id,
                'appointment'
            );
        }

        res.json({ success: true, appointment: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar cita:', error);
        res.status(500).json({ error: 'Error al actualizar la cita' });
    }
});

// Delete appointment (admin only)
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'DELETE FROM appointments WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar cita:', error);
        res.status(500).json({ error: 'Error al eliminar la cita' });
    }
});

export default router;
