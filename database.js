import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const initialize = async () => {
    try {
        // Create users table with role
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                role VARCHAR(20) DEFAULT 'user',
                avatar VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create appointments table with user_id
        await pool.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                business_name VARCHAR(255),
                service VARCHAR(100) NOT NULL,
                message TEXT,
                preferred_date DATE NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                admin_notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create projects table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                status VARCHAR(50) DEFAULT 'active',
                progress INTEGER DEFAULT 0,
                start_date DATE,
                end_date DATE,
                budget DECIMAL(10, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create messages table for chat
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create quick_codes table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS quick_codes (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                position VARCHAR(255),
                company VARCHAR(255),
                code VARCHAR(10) UNIQUE NOT NULL,
                used BOOLEAN DEFAULT false,
                used_at TIMESTAMP,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Add role column if it doesn't exist (for existing databases)
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name='users' AND column_name='role') THEN
                    ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
                END IF;
            END $$;
        `);

        // Create default admin user if not exists
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@studio.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        
        const existingAdmin = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [adminEmail]
        );

        if (existingAdmin.rows.length === 0) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await pool.query(
                'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
                [adminEmail, hashedPassword, 'Administrador', 'admin']
            );
            console.log('Usuario administrador creado');
        } else {
            // Update existing admin to have admin role
            await pool.query(
                'UPDATE users SET role = $1 WHERE email = $2',
                ['admin', adminEmail]
            );
        }

        console.log('Base de datos inicializada correctamente');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        throw error;
    }
};

export default {
    query: (text, params) => pool.query(text, params),
    initialize
};
