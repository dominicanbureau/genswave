import db from './database.js';
import bcrypt from 'bcryptjs';

async function checkAndFixAdmin() {
    try {
        console.log('🔍 Verificando usuario administrador...');
        
        // Check if admin user exists
        const adminCheck = await db.query(
            'SELECT * FROM users WHERE email = $1',
            ['admin@studio.com']
        );
        
        if (adminCheck.rows.length === 0) {
            console.log('❌ Usuario admin no encontrado. Creando...');
            
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const result = await db.query(
                'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
                ['admin@studio.com', hashedPassword, 'Administrador', 'admin']
            );
            
            console.log('✅ Usuario admin creado:', result.rows[0]);
        } else {
            const admin = adminCheck.rows[0];
            console.log('👤 Usuario admin encontrado:', {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role
            });
            
            // Check if role is set correctly
            if (admin.role !== 'admin') {
                console.log('🔧 Actualizando rol de administrador...');
                await db.query(
                    'UPDATE users SET role = $1 WHERE email = $2',
                    ['admin', 'admin@studio.com']
                );
                console.log('✅ Rol de administrador actualizado');
            }
            
            // Verify password
            const passwordValid = await bcrypt.compare('admin123', admin.password);
            if (!passwordValid) {
                console.log('🔧 Actualizando contraseña de administrador...');
                const hashedPassword = await bcrypt.hash('admin123', 10);
                await db.query(
                    'UPDATE users SET password = $1 WHERE email = $2',
                    [hashedPassword, 'admin@studio.com']
                );
                console.log('✅ Contraseña de administrador actualizada');
            }
        }
        
        // Show all users for debugging
        const allUsers = await db.query('SELECT id, email, name, role FROM users ORDER BY id');
        console.log('\n👥 Todos los usuarios:');
        allUsers.rows.forEach(user => {
            console.log(`   ${user.id}: ${user.email} (${user.name}) - Rol: ${user.role || 'user'}`);
        });
        
        console.log('\n🎉 Verificación completada!');
        console.log('📋 Credenciales de administrador:');
        console.log('   Email: admin@studio.com');
        console.log('   Contraseña: admin123');
        
    } catch (error) {
        console.error('❌ Error verificando admin:', error);
    }
}

checkAndFixAdmin();