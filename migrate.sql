-- Migration script to add missing columns to existing database
-- Run this script directly in your PostgreSQL database

-- Add phone column to users table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='phone'
    ) THEN
        ALTER TABLE users ADD COLUMN phone VARCHAR(50);
        RAISE NOTICE 'Added phone column to users table';
    ELSE
        RAISE NOTICE 'phone column already exists in users table';
    END IF;
END $$;

-- Add avatar column to users table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='avatar'
    ) THEN
        ALTER TABLE users ADD COLUMN avatar VARCHAR(500);
        RAISE NOTICE 'Added avatar column to users table';
    ELSE
        RAISE NOTICE 'avatar column already exists in users table';
    END IF;
END $$;

-- Add role column to users table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='role'
    ) THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
        RAISE NOTICE 'Added role column to users table';
    ELSE
        RAISE NOTICE 'role column already exists in users table';
    END IF;
END $$;

-- Add business_name column to appointments table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='appointments' AND column_name='business_name'
    ) THEN
        ALTER TABLE appointments ADD COLUMN business_name VARCHAR(255);
        RAISE NOTICE 'Added business_name column to appointments table';
    ELSE
        RAISE NOTICE 'business_name column already exists in appointments table';
    END IF;
END $$;

-- Add user_id column to appointments table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='appointments' AND column_name='user_id'
    ) THEN
        ALTER TABLE appointments ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added user_id column to appointments table';
    ELSE
        RAISE NOTICE 'user_id column already exists in appointments table';
    END IF;
END $$;

-- Add admin_notes column to appointments table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='appointments' AND column_name='admin_notes'
    ) THEN
        ALTER TABLE appointments ADD COLUMN admin_notes TEXT;
        RAISE NOTICE 'Added admin_notes column to appointments table';
    ELSE
        RAISE NOTICE 'admin_notes column already exists in appointments table';
    END IF;
END $$;

-- Add updated_at column to appointments table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='appointments' AND column_name='updated_at'
    ) THEN
        ALTER TABLE appointments ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Added updated_at column to appointments table';
    ELSE
        RAISE NOTICE 'updated_at column already exists in appointments table';
    END IF;
END $$;

SELECT 'Migration completed successfully!' AS status;
