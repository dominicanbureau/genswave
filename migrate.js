import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigration() {
    try {
        console.log('Starting database migration...\n');

        // Add phone column to users table
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='users' AND column_name='phone'
                ) THEN
                    ALTER TABLE users ADD COLUMN phone VARCHAR(50);
                    RAISE NOTICE 'Added phone column to users table';
                END IF;
            END $$;
        `);
        console.log('✓ Checked phone column in users table');

        // Add avatar column to users table
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='users' AND column_name='avatar'
                ) THEN
                    ALTER TABLE users ADD COLUMN avatar VARCHAR(500);
                    RAISE NOTICE 'Added avatar column to users table';
                END IF;
            END $$;
        `);
        console.log('✓ Checked avatar column in users table');

        // Add role column to users table
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='users' AND column_name='role'
                ) THEN
                    ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
                    RAISE NOTICE 'Added role column to users table';
                END IF;
            END $$;
        `);
        console.log('✓ Checked role column in users table');

        // Add business_name column to appointments table
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='appointments' AND column_name='business_name'
                ) THEN
                    ALTER TABLE appointments ADD COLUMN business_name VARCHAR(255);
                    RAISE NOTICE 'Added business_name column to appointments table';
                END IF;
            END $$;
        `);
        console.log('✓ Checked business_name column in appointments table');

        // Add user_id column to appointments table
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='appointments' AND column_name='user_id'
                ) THEN
                    ALTER TABLE appointments ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
                    RAISE NOTICE 'Added user_id column to appointments table';
                END IF;
            END $$;
        `);
        console.log('✓ Checked user_id column in appointments table');

        // Add admin_notes column to appointments table
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='appointments' AND column_name='admin_notes'
                ) THEN
                    ALTER TABLE appointments ADD COLUMN admin_notes TEXT;
                    RAISE NOTICE 'Added admin_notes column to appointments table';
                END IF;
            END $$;
        `);
        console.log('✓ Checked admin_notes column in appointments table');

        // Add updated_at column to appointments table
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='appointments' AND column_name='updated_at'
                ) THEN
                    ALTER TABLE appointments ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
                    RAISE NOTICE 'Added updated_at column to appointments table';
                END IF;
            END $$;
        `);
        console.log('✓ Checked updated_at column in appointments table');

        console.log('\n✅ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
