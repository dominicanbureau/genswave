import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../database.js';
import { sendWelcomeEmail, sendProfileUpdateConfirmation } from '../utils/emailService.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if user already exists
        const existingUser = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await db.query(
            'INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, phone, hashedPassword]
        );

        const user = result.rows[0];

        // Send welcome email
        try {
            await sendWelcomeEmail(user.email, user.name);
            console.log(`✅ Welcome email sent to ${user.email}`);
        } catch (emailError) {
            console.error('❌ Failed to send welcome email:', emailError);
            // Don't fail registration if email fails
        }

        // Create session
        req.session.userId = user.id;
        req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || 'user'
        };

        const redirect = user.role === 'admin' ? '/admin' : '/dashboard';
        res.json({ success: true, redirect });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        req.session.userId = user.id;
        req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || 'user'
        };

        const redirect = user.role === 'admin' ? '/admin' : '/dashboard';
        res.json({ success: true, redirect });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Check auth status
router.get('/status', (req, res) => {
    console.log('🔍 Auth status check:', {
        sessionId: req.sessionID,
        userId: req.session.userId,
        user: req.session.user
    });
    
    if (req.session.userId) {
        res.json({ authenticated: true, user: req.session.user });
    } else {
        res.json({ authenticated: false });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Password recovery (mock implementation)
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'No se encontró una cuenta con ese correo electrónico' 
            });
        }

        // In a real implementation, you would:
        // 1. Generate a secure recovery token
        // 2. Store it in the database with expiration
        // 3. Send email with recovery link
        
        // For now, we'll just return a success message
        res.json({ 
            success: true, 
            message: 'Se ha enviado un código de recuperación a tu correo electrónico' 
        });
        
    } catch (error) {
        console.error('Error en recuperación de contraseña:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error en el servidor' 
        });
    }
});

export default router;
// Get current user profile
router.get('/profile', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'No autorizado' });
        }
        
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
router.put('/profile', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'No autorizado' });
        }
        
        const { name, profile_photo } = req.body;
        
        // Get current user data for comparison
        const currentUser = await db.query(
            'SELECT name, profile_photo FROM users WHERE id = $1',
            [req.session.userId]
        );
        
        const result = await db.query(
            'UPDATE users SET name = $1, profile_photo = $2 WHERE id = $3 RETURNING id, name, email, profile_photo',
            [name, profile_photo, req.session.userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Send profile update confirmation email
        try {
            const changes = [];
            if (currentUser.rows[0].name !== name) {
                changes.push(`Nombre actualizado a: ${name}`);
            }
            if (currentUser.rows[0].profile_photo !== profile_photo) {
                changes.push('Foto de perfil actualizada');
            }
            
            if (changes.length > 0) {
                await sendProfileUpdateConfirmation(result.rows[0].email, result.rows[0].name, changes);
                console.log(`✅ Profile update email sent to ${result.rows[0].email}`);
            }
        } catch (emailError) {
            console.error('❌ Failed to send profile update email:', emailError);
            // Don't fail update if email fails
        }
        
        // Update session data
        req.session.user = { ...req.session.user, name, profile_photo };
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});