import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const migrateNotifications = async () => {
    try {
        console.log('Creando tabla de notificaciones...');

        // Create notifications table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                type VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                related_id INTEGER,
                related_type VARCHAR(50),
                is_read BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Add unique_id columns to existing tables if they don't exist
        await pool.query(`
            ALTER TABLE appointments 
            ADD COLUMN IF NOT EXISTS unique_id VARCHAR(20) UNIQUE
        `);

        await pool.query(`
            ALTER TABLE projects 
            ADD COLUMN IF NOT EXISTS unique_id VARCHAR(20) UNIQUE
        `);

        // Add requests table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS requests (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                project_type VARCHAR(100),
                budget_range VARCHAR(100),
                timeline VARCHAR(100),
                budget DECIMAL(10, 2),
                preferred_start_date DATE,
                technical_requirements TEXT,
                target_audience TEXT,
                additional_notes TEXT,
                attachments TEXT[],
                status VARCHAR(50) DEFAULT 'pending',
                admin_notes TEXT,
                unique_id VARCHAR(20) UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Generate unique IDs for existing records
        const appointments = await pool.query('SELECT id FROM appointments WHERE unique_id IS NULL');
        for (const appointment of appointments.rows) {
            const uniqueId = 'APT-' + String(appointment.id).padStart(4, '0');
            await pool.query('UPDATE appointments SET unique_id = $1 WHERE id = $2', [uniqueId, appointment.id]);
        }

        const projects = await pool.query('SELECT id FROM projects WHERE unique_id IS NULL');
        for (const project of projects.rows) {
            const uniqueId = 'PRJ-' + String(project.id).padStart(4, '0');
            await pool.query('UPDATE projects SET unique_id = $1 WHERE id = $2', [uniqueId, project.id]);
        }

        const requests = await pool.query('SELECT id FROM requests WHERE unique_id IS NULL');
        for (const request of requests.rows) {
            const uniqueId = 'REQ-' + String(request.id).padStart(4, '0');
            await pool.query('UPDATE requests SET unique_id = $1 WHERE id = $2', [uniqueId, request.id]);
        }

        console.log('Migración de notificaciones completada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('Error en la migración:', error);
        process.exit(1);
    }
};

migrateNotifications();