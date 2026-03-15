#!/usr/bin/env node

import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Database connection with retry logic
async function createDbConnection() {
    const maxRetries = 5;
    let retries = 0;
    
    while (retries < maxRetries) {
        try {
            const pool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
            });
            
            // Test connection
            await pool.query('SELECT NOW()');
            console.log('✅ Database connection established');
            return pool;
        } catch (error) {
            retries++;
            console.log(`⏳ Database connection attempt ${retries}/${maxRetries} failed`);
            if (retries === maxRetries) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

async function runProductionMigrations() {
    let db = null;
    
    try {
        console.log('🗄️  Starting database migrations...');
        
        db = await createDbConnection();
        
        // 1. Create users table
        console.log('📋 Creating users table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(20),
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                location VARCHAR(255),
                position VARCHAR(255),
                profile_photo TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Create appointments table
        console.log('📋 Creating appointments table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                service VARCHAR(255) NOT NULL,
                message TEXT,
                preferred_date DATE,
                preferred_time TIME,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. Create requests table
        console.log('📋 Creating requests table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS requests (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                budget DECIMAL(10,2) DEFAULT 300.00,
                timeline VARCHAR(100),
                additional_info TEXT,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 4. Create projects table
        console.log('📋 Creating projects table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                budget DECIMAL(10,2),
                start_date DATE,
                end_date DATE,
                cover_image TEXT,
                tags JSONB DEFAULT '[]',
                status VARCHAR(50) DEFAULT 'active',
                progress INTEGER DEFAULT 0,
                deadline TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days'),
                archived BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 5. Create project_updates table
        console.log('📋 Creating project_updates table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS project_updates (
                id SERIAL PRIMARY KEY,
                project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                update_type VARCHAR(50) DEFAULT 'general',
                images JSONB DEFAULT '[]',
                attachments JSONB DEFAULT '[]',
                created_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 6. Create messages table
        console.log('📋 Creating messages table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                message TEXT,
                attachments JSONB DEFAULT '[]',
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 7. Create quick_codes table
        console.log('📋 Creating quick_codes table...');
        
        // Check if the table exists and what columns it has
        const tableExists = await db.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'quick_codes'
            ORDER BY ordinal_position
        `);
        
        if (tableExists.rows.length === 0) {
            // Create new table with simple structure
            await db.query(`
                CREATE TABLE quick_codes (
                    id SERIAL PRIMARY KEY,
                    code VARCHAR(10) UNIQUE NOT NULL,
                    description TEXT NOT NULL,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
        } else {
            // Table exists, check if it has the old structure with name/email columns
            const hasNameColumn = tableExists.rows.some(row => row.column_name === 'name');
            const hasDescriptionColumn = tableExists.rows.some(row => row.column_name === 'description');
            
            if (hasNameColumn && !hasDescriptionColumn) {
                // Old structure, add description column
                await db.query(`
                    ALTER TABLE quick_codes 
                    ADD COLUMN IF NOT EXISTS description TEXT DEFAULT 'Código de acceso rápido'
                `);
            }
        }

        // 8. Create admin user if not exists
        console.log('👤 Creating admin user...');
        const adminExists = await db.query('SELECT id FROM users WHERE email = $1', ['admin@studio.com']);
        
        if (adminExists.rows.length === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await db.query(`
                INSERT INTO users (name, email, password, role) 
                VALUES ($1, $2, $3, $4)
            `, ['Administrator', 'admin@studio.com', hashedPassword, 'admin']);
            console.log('✅ Admin user created (admin@studio.com / admin123)');
        } else {
            console.log('✅ Admin user already exists');
        }

        // 9. Insert sample quick codes
        console.log('🔢 Setting up quick codes...');
        
        // Check table structure to determine how to insert
        const columns = await db.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'quick_codes'
            ORDER BY ordinal_position
        `);
        
        const columnNames = columns.rows.map(row => row.column_name);
        const hasNameColumn = columnNames.includes('name');
        const hasEmailColumn = columnNames.includes('email');
        const hasDescriptionColumn = columnNames.includes('description');
        
        const quickCodes = [
            { 
                code: 'WELCOME10', 
                description: '10% de descuento para nuevos clientes',
                name: 'Código de Bienvenida',
                email: 'admin@genswave.com'
            },
            { 
                code: 'PREMIUM20', 
                description: '20% de descuento en servicios premium',
                name: 'Código Premium',
                email: 'admin@genswave.com'
            },
            { 
                code: 'REFERRAL15', 
                description: '15% de descuento por referido',
                name: 'Código de Referido',
                email: 'admin@genswave.com'
            }
        ];

        for (const quickCode of quickCodes) {
            const exists = await db.query('SELECT id FROM quick_codes WHERE code = $1', [quickCode.code]);
            if (exists.rows.length === 0) {
                if (hasNameColumn && hasEmailColumn && hasDescriptionColumn) {
                    // Full structure with name, email, and description
                    await db.query(`
                        INSERT INTO quick_codes (code, name, email, description, expires_at) 
                        VALUES ($1, $2, $3, $4, $5)
                    `, [
                        quickCode.code, 
                        quickCode.name, 
                        quickCode.email, 
                        quickCode.description,
                        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
                    ]);
                } else if (hasDescriptionColumn) {
                    // Simple structure with just code and description
                    await db.query(
                        'INSERT INTO quick_codes (code, description) VALUES ($1, $2)',
                        [quickCode.code, quickCode.description]
                    );
                } else {
                    // Minimal structure with just code
                    await db.query(
                        'INSERT INTO quick_codes (code) VALUES ($1)',
                        [quickCode.code]
                    );
                }
            }
        }

        console.log('✅ Database migrations completed successfully!');
        
        // 10. Setup Instagram integration
        console.log('📱 Setting up Instagram integration...');
        try {
            const { default: migrateInstagram } = await import('./migrate-instagram.js');
            await migrateInstagram();
            console.log('✅ Instagram integration setup completed');
        } catch (error) {
            console.log('⚠️ Instagram migration warning:', error.message);
            console.log('📋 Instagram integration will be available after configuration');
        }
        
    } catch (error) {
        console.error('❌ Database migration failed:', error);
        throw error;
    } finally {
        if (db) {
            await db.end();
        }
    }
}

// Only run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runProductionMigrations()
        .then(() => {
            console.log('🎉 Production database setup completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Migration failed:', error);
            process.exit(1);
        });
}

export default runProductionMigrations;