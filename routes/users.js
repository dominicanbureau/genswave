import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import db from '../database.js';

const router = express.Router();

// Configure multer for avatar uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, 'avatar-' + uniqueSuffix + extension);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'), false);
        }
    }
});

// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    next();
};

// Middleware to check admin authentication
const requireAdmin = (req, res, next) => {
    if (!req.session.userId || req.session.user.role !== 'admin') {
        return res.status(403).json({ error: 'No autorizado' });
    }
    next();
};

// Update user profile (for logged-in users)
router.put('/update', requireAuth, upload.single('avatar'), async (req, res) => {
    try {
        const userId = req.session.userId;
        const { name, email, phone, location, position, currentPassword, newPassword } = req.body;

        // If changing password, verify current password
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ error: 'Se requiere la contraseña actual para cambiarla' });
            }

            const userResult = await db.query('SELECT password FROM users WHERE id = $1', [userId]);
            const isValidPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password);
            
            if (!isValidPassword) {
                return res.status(400).json({ error: 'Contraseña actual incorrecta' });
            }
        }

        const updates = [];
        const values = [];
        let paramCount = 1;

        if (name) {
            updates.push(`name = $${paramCount++}`);
            values.push(name);
        }
        if (email) {
            updates.push(`email = $${paramCount++}`);
            values.push(email);
        }
        if (phone !== undefined) {
            updates.push(`phone = $${paramCount++}`);
            values.push(phone);
        }
        if (location !== undefined) {
            updates.push(`location = $${paramCount++}`);
            values.push(location);
        }
        if (position !== undefined) {
            updates.push(`position = $${paramCount++}`);
            values.push(position);
        }
        if (req.file) {
            const avatarUrl = `/uploads/${req.file.filename}`;
            updates.push(`avatar = $${paramCount++}`);
            values.push(avatarUrl);
        }
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updates.push(`password = $${paramCount++}`);
            values.push(hashedPassword);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        values.push(userId);

        const result = await db.query(
            `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, name, email, phone, location, position, avatar, role, created_at`,
            values
        );

        res.json({ success: true, user: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Get all users
router.get('/', requireAdmin, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                u.id, u.name, u.email, u.phone, u.role, u.created_at,
                COUNT(DISTINCT p.id) as project_count,
                COUNT(DISTINCT a.id) as appointment_count
            FROM users u
            LEFT JOIN projects p ON u.id = p.user_id
            LEFT JOIN appointments a ON u.id = a.user_id
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Get user by ID
router.get('/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        const userResult = await db.query('SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1', [id]);
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const projectsResult = await db.query('SELECT * FROM projects WHERE user_id = $1', [id]);
        const appointmentsResult = await db.query('SELECT * FROM appointments WHERE user_id = $1', [id]);
        
        res.json({
            user: userResult.rows[0],
            projects: projectsResult.rows,
            appointments: appointmentsResult.rows
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Update user (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, location, position, role } = req.body;

        const updates = [];
        const values = [];
        let paramCount = 1;

        if (name) {
            updates.push(`name = $${paramCount++}`);
            values.push(name);
        }
        if (email) {
            updates.push(`email = $${paramCount++}`);
            values.push(email);
        }
        if (phone !== undefined) {
            updates.push(`phone = $${paramCount++}`);
            values.push(phone);
        }
        if (location !== undefined) {
            updates.push(`location = $${paramCount++}`);
            values.push(location);
        }
        if (position !== undefined) {
            updates.push(`position = $${paramCount++}`);
            values.push(position);
        }
        if (role) {
            updates.push(`role = $${paramCount++}`);
            values.push(role);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        values.push(id);

        const result = await db.query(
            `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, name, email, phone, location, position, role, created_at`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ success: true, user: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Update user (legacy endpoint)
router.patch('/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, role } = req.body;

        const updates = [];
        const values = [];
        let paramCount = 1;

        if (name) {
            updates.push(`name = $${paramCount++}`);
            values.push(name);
        }
        if (email) {
            updates.push(`email = $${paramCount++}`);
            values.push(email);
        }
        if (phone !== undefined) {
            updates.push(`phone = $${paramCount++}`);
            values.push(phone);
        }
        if (role) {
            updates.push(`role = $${paramCount++}`);
            values.push(role);
        }

        values.push(id);

        const result = await db.query(
            `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, name, email, phone, role, created_at`,
            values
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Delete user
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prevent deleting yourself
        if (parseInt(id) === req.session.userId) {
            return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
        }

        await db.query('DELETE FROM users WHERE id = $1', [id]);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Reset user password
router.post('/:id/reset-password', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id]);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al resetear contraseña:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

export default router;
// Get current user profile
router.get('/profile', requireAuth, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, name, email, profile_photo FROM users WHERE id = $1',
            [req.session.userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Update current user profile
router.put('/profile', requireAuth, async (req, res) => {
    try {
        const { name, profile_photo } = req.body;
        
        const result = await db.query(
            'UPDATE users SET name = $1, profile_photo = $2 WHERE id = $3 RETURNING id, name, email, profile_photo',
            [name, profile_photo, req.session.userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        // Update session data
        req.session.user = { ...req.session.user, name, profile_photo };
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});