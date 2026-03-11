#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Setting up production environment...\n');

async function setupProduction() {
    try {
        // 1. Create uploads directory
        console.log('📁 Creating uploads directory...');
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log('✅ Uploads directory created');
        } else {
            console.log('✅ Uploads directory already exists');
        }

        // 2. Build frontend
        console.log('\n🏗️  Building frontend...');
        const { spawn } = await import('child_process');
        
        await new Promise((resolve, reject) => {
            const buildProcess = spawn('npm', ['run', 'build'], {
                stdio: 'inherit',
                shell: true
            });

            buildProcess.on('close', (code) => {
                if (code === 0) {
                    console.log('✅ Frontend build completed');
                    resolve();
                } else {
                    console.error('❌ Frontend build failed');
                    reject(new Error(`Build failed with code ${code}`));
                }
            });

            buildProcess.on('error', (error) => {
                console.error('❌ Build process error:', error);
                reject(error);
            });
        });

        // 3. Run database migrations
        console.log('\n🗄️  Setting up database...');
        await runMigrations();

        console.log('\n🎉 Production setup completed successfully!');
        console.log('📋 Next steps:');
        console.log('   - Set environment variables in Render dashboard');
        console.log('   - Deploy with: npm start');
        
    } catch (error) {
        console.error('❌ Production setup failed:', error);
        process.exit(1);
    }
}

async function runMigrations() {
    try {
        // Import and run the migration script
        const { default: runProductionMigrations } = await import('./migrate-production.js');
        await runProductionMigrations();
    } catch (error) {
        console.log('⚠️  Database migration will run on first server start');
        console.log('   This is normal for first-time deployment');
    }
}

// Only run if this script is executed directly
if (process.argv[1] === __filename) {
    setupProduction();
}

export default setupProduction;