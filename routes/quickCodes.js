import express from 'express';
import db from '../database.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Debug route to check session (temporary)
router.get('/debug/session', (req, res) => {
    res.json({
        sessionId: req.sessionID,
        userId: req.session.userId,
        user: req.session.user,
        hasSession: !!req.session.userId,
        isAdmin: req.session.user?.role === 'admin'
    });
});

// Middleware to check admin authentication
const requireAdmin = (req, res, next) => {
    console.log('🔍 Checking admin auth:', {
        userId: req.session.userId,
        user: req.session.user,
        sessionId: req.sessionID
    });
    
    if (!req.session.userId) {
        console.log('❌ No userId in session');
        return res.status(403).json({ error: 'No autenticado - sin sesión' });
    }
    
    if (!req.session.user) {
        console.log('❌ No user object in session');
        return res.status(403).json({ error: 'No autenticado - sin datos de usuario' });
    }
    
    if (req.session.user.role !== 'admin') {
        console.log('❌ User is not admin:', req.session.user.role);
        return res.status(403).json({ error: 'No autorizado - no es administrador' });
    }
    
    console.log('✅ Admin auth successful');
    next();
};

// Get all quick codes (admin only)
router.get('/admin/quick-codes', requireAdmin, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM quick_codes 
            ORDER BY created_at DESC
        `);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener códigos quick:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Create new quick code (admin only)
router.post('/admin/quick-codes', requireAdmin, async (req, res) => {
    try {
        const { name, email, phone, position, company, code, expiresAt } = req.body;
        
        const result = await db.query(`
            INSERT INTO quick_codes (name, email, phone, position, company, code, expires_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [name, email, phone, position, company, code, expiresAt]);
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear código quick:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Delete quick code (admin only)
router.delete('/admin/quick-codes/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        await db.query('DELETE FROM quick_codes WHERE id = $1', [id]);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar código quick:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Use quick code to create account
router.post('/auth/quick-access', async (req, res) => {
    try {
        const { code } = req.body;
        
        // Find the quick code
        const quickCodeResult = await db.query(`
            SELECT * FROM quick_codes 
            WHERE code = $1 AND used = false AND expires_at > NOW()
        `, [code.toUpperCase()]);
        
        if (quickCodeResult.rows.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Código inválido o expirado' 
            });
        }
        
        const quickCodeData = quickCodeResult.rows[0];
        
        // Check if user already exists
        const existingUser = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [quickCodeData.email]
        );
        
        let user;
        if (existingUser.rows.length > 0) {
            user = existingUser.rows[0];
        } else {
            // Create new user with temporary password
            const tempPassword = Math.random().toString(36).substring(2, 15);
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            
            const userResult = await db.query(`
                INSERT INTO users (name, email, phone, password, role)
                VALUES ($1, $2, $3, $4, 'user')
                RETURNING *
            `, [
                quickCodeData.name,
                quickCodeData.email,
                quickCodeData.phone,
                hashedPassword
            ]);
            
            user = userResult.rows[0];
        }
        
        // Mark quick code as used
        await db.query(
            'UPDATE quick_codes SET used = true, used_at = NOW() WHERE id = $1',
            [quickCodeData.id]
        );
        
        // Set session
        req.session.userId = user.id;
        req.session.user = user;
        
        res.json({
            success: true,
            redirect: '/dashboard',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        console.error('Error en acceso rápido:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error en el servidor' 
        });
    }
});

export default router;