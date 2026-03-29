import db from './database.js';
import fs from 'fs';

async function runMigration() {
    try {
        console.log('🔄 Running requests migration...');
        
        // Read the SQL file
        const sql = fs.readFileSync('./migrate-requests.sql', 'utf8');
        
        // Split by semicolon and execute each statement
        const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
        
        for (const statement of statements) {
            if (statement.trim()) {
                await db.query(statement.trim());
                console.log('✅ Executed:', statement.trim().substring(0, 50) + '...');
            }
        }
        
        console.log('🚀 Requests migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();