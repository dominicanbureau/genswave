import express from 'express';
import db from '../database.js';
import { sendProjectCreatedEmail } from '../utils/emailService.js';

const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'No autenticado' });
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

// Get user projects
router.get('/', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.role === 'admin' ? null : req.session.userId;
        const { archived } = req.query; // Add archived filter
        
        const archivedFilter = archived === 'true' ? 'AND p.archived = true' : 'AND (p.archived = false OR p.archived IS NULL)';
        
        const query = userId 
            ? `SELECT p.*, 
                      (SELECT COUNT(*) FROM project_updates pu WHERE pu.project_id = p.id) as updates_count,
                      p.deadline
               FROM projects p 
               WHERE p.user_id = $1 ${archivedFilter}
               ORDER BY p.created_at DESC`
            : `SELECT p.*, u.name as user_name, u.email as user_email,
                      (SELECT COUNT(*) FROM project_updates pu WHERE pu.project_id = p.id) as updates_count,
                      p.deadline
               FROM projects p 
               JOIN users u ON p.user_id = u.id 
               WHERE 1=1 ${archivedFilter}
               ORDER BY p.created_at DESC`;
        
        const params = userId ? [userId] : [];
        const result = await db.query(query, params);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Get single project with updates
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.userId;
        const isAdmin = req.session.user.role === 'admin';
        
        // Get project
        const projectQuery = isAdmin
            ? 'SELECT p.*, u.name as user_name, u.email as user_email FROM projects p JOIN users u ON p.user_id = u.id WHERE p.id = $1'
            : 'SELECT * FROM projects WHERE id = $1 AND user_id = $2';
        
        const projectParams = isAdmin ? [id] : [id, userId];
        const projectResult = await db.query(projectQuery, projectParams);
        
        if (projectResult.rows.length === 0) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        
        // Get updates
        const updatesResult = await db.query(
            `SELECT pu.*, u.name as created_by_name 
             FROM project_updates pu 
             LEFT JOIN users u ON pu.created_by = u.id 
             WHERE pu.project_id = $1 
             ORDER BY pu.created_at DESC`,
            [id]
        );
        
        res.json({
            project: projectResult.rows[0],
            updates: updatesResult.rows
        });
    } catch (error) {
        console.error('Error al obtener proyecto:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Create project (admin only)
router.post('/', requireAdmin, async (req, res) => {
    try {
        const { user_id, title, description, budget, start_date, end_date, cover_image, tags } = req.body;

        // Generate unique ID for project
        const uniqueId = 'P' + Math.floor(Math.random() * 900000 + 100000).toString();

        const result = await db.query(
            `INSERT INTO projects (user_id, title, description, budget, start_date, end_date, cover_image, tags, unique_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [user_id, title, description, budget, start_date, end_date, cover_image, tags || [], uniqueId]
        );

        const project = result.rows[0];

        // Get user info for email
        const userResult = await db.query(
            'SELECT name, email FROM users WHERE id = $1',
            [user_id]
        );

        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            
            // Send project creation email
            try {
                await sendProjectCreatedEmail(user.email, user.name, project);
                console.log(`✅ Project creation email sent to ${user.email} for project ${project.unique_id}`);
            } catch (emailError) {
                console.error('❌ Failed to send project creation email:', emailError);
                // Don't fail project creation if email fails
            }
        }

        res.json(project);
    } catch (error) {
        console.error('Error al crear proyecto:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Create project update (admin only)
router.post('/:id/updates', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, update_type, images, attachments } = req.body;
        const createdBy = req.session.userId;

        const result = await db.query(
            `INSERT INTO project_updates (project_id, title, description, update_type, images, attachments, created_by) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [id, title, description, update_type || 'general', images || [], attachments || [], createdBy]
        );

        // Update project's updated_at
        await db.query('UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear actualización:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Update project
router.patch('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

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
            `UPDATE projects SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar proyecto:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Archive/Unarchive project (admin only)
router.patch('/:id/archive', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { archived } = req.body;

        const result = await db.query(
            'UPDATE projects SET archived = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [archived, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }

        res.json({ 
            success: true, 
            project: result.rows[0],
            message: archived ? 'Proyecto archivado' : 'Proyecto restaurado'
        });
    } catch (error) {
        console.error('Error al archivar/desarchivar proyecto:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Delete project (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM projects WHERE id = $1', [id]);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Delete project update (admin only)
router.delete('/:id/updates/:updateId', requireAdmin, async (req, res) => {
    try {
        const { updateId } = req.params;
        await db.query('DELETE FROM project_updates WHERE id = $1', [updateId]);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar actualización:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

export default router;
