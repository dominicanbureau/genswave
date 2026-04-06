import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from './database.js';
import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import projectRoutes from './routes/projects.js';
import messageRoutes from './routes/messages.js';
import userRoutes from './routes/users.js';
import requestRoutes from './routes/requests.js';
import quickCodeRoutes from './routes/quickCodes.js';
import uploadRoutes from './routes/upload.js';
import instagramRoutes from './routes/instagram.js';
import passwordResetRoutes from './routes/passwordReset.js';
import dataDeletionRoutes from './routes/dataDeletion.js';
import notificationRoutes from './routes/notifications.js';
import migrateRoutes from './routes/migrate.js';
import aiAssistantRoutes from './routes/aiAssistant.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

console.log(`🚀 Starting server in ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} mode...`);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory');
}

// Run production migrations on startup if needed
if (isProduction) {
    try {
        const { default: runProductionMigrations } = await import('./migrate-production.js');
        await runProductionMigrations();
        console.log('✅ Production database setup completed');
    } catch (error) {
        console.error('⚠️  Database migration warning:', error.message);
        console.log('📋 Continuing with server startup...');
    }
}

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'studio-secret-key-' + Date.now(),
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Render maneja HTTPS automáticamente
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Initialize database
try {
    await db.initialize();
    console.log('✅ Database connection established');
} catch (err) {
    console.error('❌ Database initialization error:', err);
    if (isProduction) {
        console.log('⏳ Retrying database connection in 5 seconds...');
        setTimeout(async () => {
            try {
                await db.initialize();
                console.log('✅ Database connection established on retry');
            } catch (retryErr) {
                console.error('❌ Database retry failed:', retryErr);
            }
        }, 5000);
    }
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/data-deletion', dataDeletionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/migrate', migrateRoutes);
app.use('/api/ai-assistant', aiAssistantRoutes);
app.use('/api', quickCodeRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files in production
if (isProduction) {
    const distPath = path.join(__dirname, 'dist');
    
    // Check if dist directory exists
    if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        console.log('📦 Serving static files from dist/');
        
        // Handle client-side routing
        app.get('*', (req, res) => {
            // Don't serve index.html for API routes
            if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
                return res.status(404).json({ error: 'Not found' });
            }
            res.sendFile(path.join(distPath, 'index.html'));
        });
    } else {
        console.log('⚠️  dist/ directory not found. Run "npm run build" first.');
    }
} else {
    // Development mode - serve a simple message
    app.get('/', (req, res) => {
        res.json({ 
            message: 'Studio Backend API', 
            mode: 'development',
            endpoints: {
                auth: '/api/auth',
                projects: '/api/projects',
                messages: '/api/messages',
                uploads: '/api/upload'
            }
        });
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    console.log(`🌐 Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
    if (isProduction) {
        console.log(`🚀 Application: http://localhost:${PORT}`);
    }
});

