import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const createTestNotifications = async () => {
    try {
        console.log('Creando notificaciones de prueba...');

        // Get a user ID (assuming there's at least one user)
        const userResult = await pool.query('SELECT id FROM users WHERE role = $1 LIMIT 1', ['user']);
        
        if (userResult.rows.length === 0) {
            console.log('No se encontraron usuarios. Creando notificaciones para el admin...');
            const adminResult = await pool.query('SELECT id FROM users WHERE role = $1 LIMIT 1', ['admin']);
            if (adminResult.rows.length === 0) {
                console.log('No se encontraron usuarios en la base de datos.');
                return;
            }
            var userId = adminResult.rows[0].id;
        } else {
            var userId = userResult.rows[0].id;
        }

        // Create test notifications
        const notifications = [
            {
                type: 'project_created',
                title: 'Nuevo Proyecto Creado',
                message: 'Se ha creado el proyecto "Sitio Web Corporativo" para ti.',
                related_type: 'project'
            },
            {
                type: 'project_update',
                title: 'Actualización de Proyecto',
                message: 'Tu proyecto "E-commerce" ha recibido una nueva actualización: Diseño completado',
                related_type: 'project'
            },
            {
                type: 'project_status_change',
                title: 'Estado de Proyecto Actualizado',
                message: 'El estado de tu proyecto "App Móvil" ha cambiado a: Completado',
                related_type: 'project'
            },
            {
                type: 'appointment_status_change',
                title: 'Estado de Solicitud Actualizado',
                message: 'El estado de tu solicitud "Desarrollo Web" ha cambiado a: Aprobada',
                related_type: 'appointment'
            }
        ];

        for (const notif of notifications) {
            await pool.query(`
                INSERT INTO notifications (user_id, type, title, message, related_type)
                VALUES ($1, $2, $3, $4, $5)
            `, [userId, notif.type, notif.title, notif.message, notif.related_type]);
        }

        console.log(`✅ Se crearon ${notifications.length} notificaciones de prueba para el usuario ${userId}`);
        process.exit(0);
    } catch (error) {
        console.error('Error creando notificaciones de prueba:', error);
        process.exit(1);
    }
};

createTestNotifications();