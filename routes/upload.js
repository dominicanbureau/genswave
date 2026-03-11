import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
    console.log('🧪 Upload test endpoint hit');
    res.json({ message: 'Upload routes are working!', timestamp: new Date().toISOString() });
});

// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    next();
};

// Create uploads directory if it doesn't exist
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check if file is an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'), false);
        }
    }
});

// Configure multer for chat attachments (more file types allowed)
const chatUpload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit for chat files
    },
    fileFilter: (req, file, cb) => {
        // Allow images, documents, and common file types
        const allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain', 'text/csv',
            'application/zip',
            'application/x-zip-compressed',
            'application/rar',
            'video/mp4', 'video/avi', 'video/mov'
        ];
        
        console.log('🔍 File filter check:', file.originalname, file.mimetype);
        
        if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
            console.log('✅ File type allowed');
            cb(null, true);
        } else {
            console.log('❌ File type not allowed:', file.mimetype);
            cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
        }
    }
});

// Upload single image
router.post('/image', requireAuth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
        }

        // Return the file URL
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ 
            success: true, 
            url: fileUrl,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Error al subir la imagen' });
    }
});

// Upload multiple images
router.post('/images', requireAuth, upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron archivos' });
        }

        // Return array of file URLs
        const fileUrls = req.files.map(file => ({
            url: `/uploads/${file.filename}`,
            filename: file.filename,
            originalName: file.originalname,
            size: file.size
        }));

        res.json({ 
            success: true, 
            files: fileUrls
        });
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ error: 'Error al subir las imágenes' });
    }
});

// Delete uploaded file
router.delete('/image/:filename', requireAuth, (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(uploadsDir, filename);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ success: true, message: 'Archivo eliminado' });
        } else {
            res.status(404).json({ error: 'Archivo no encontrado' });
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Error al eliminar el archivo' });
    }
});

// Upload chat attachments (multiple files, various types)
router.post('/chat-attachments', requireAuth, (req, res) => {
    console.log('📎 Chat attachments upload request received');
    console.log('Files in request:', req.files ? req.files.length : 0);
    
    const uploadHandler = chatUpload.array('attachments', 5);
    
    uploadHandler(req, res, (err) => {
        if (err) {
            console.error('❌ Multer error:', err);
            return res.status(400).json({ error: err.message });
        }
        
        try {
            if (!req.files || req.files.length === 0) {
                console.log('❌ No files received');
                return res.status(400).json({ error: 'No se proporcionaron archivos' });
            }

            console.log('✅ Files processed:', req.files.length);

            // Return array of file information in the format expected by frontend
            const files = req.files.map(file => ({
                url: `/uploads/${file.filename}`,
                name: file.originalname,
                type: file.mimetype,
                size: file.size
            }));

            console.log('📤 Sending response with files:', files);

            res.json({ 
                success: true, 
                files: files
            });
        } catch (error) {
            console.error('❌ Error uploading chat attachments:', error);
            res.status(500).json({ error: 'Error al subir los archivos' });
        }
    });
});

export default router;