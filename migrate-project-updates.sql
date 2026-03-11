-- Update projects table to add more fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create project_updates table for timeline updates
CREATE TABLE IF NOT EXISTS project_updates (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    update_type VARCHAR(50) DEFAULT 'general',
    images TEXT[],
    attachments TEXT[],
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_created_at ON project_updates(created_at DESC);
