-- Remove attachments column from messages table if it exists (temporary fix)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name='messages' AND column_name='attachments') THEN
        ALTER TABLE messages DROP COLUMN attachments;
    END IF;
END $$;

-- Create quick_codes table
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
);

-- Add position column to users table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='users' AND column_name='position') THEN
        ALTER TABLE users ADD COLUMN position VARCHAR(255);
    END IF;
END $$;