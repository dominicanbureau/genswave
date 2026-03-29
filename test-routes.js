import db from './database.js';

async function testRoutes() {
    try {
        console.log('🧪 Probando creación de datos...\n');
        
        // Get a test user
        const userResult = await db.query('SELECT id FROM users WHERE role = $1 LIMIT 1', ['user']);
        
        if (userResult.rows.length === 0) {
            console.log('❌ No hay usuarios de prueba. Creando uno...');
            const bcrypt = (await import('bcryptjs')).default;
            const hashedPassword = await bcrypt.hash('test123', 10);
            const newUser = await db.query(
                'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id',
                ['test@test.com', hashedPassword, 'Usuario Test', 'user']
            );
            console.log('✅ Usuario de prueba creado con ID:', newUser.rows[0].id);
        }
        
        const userId = userResult.rows.length > 0 ? userResult.rows[0].id : (await db.query('SELECT id FROM users WHERE role = $1 LIMIT 1', ['user'])).rows[0].id;
        
        // Test 1: Create a request
        console.log('📝 Test 1: Creando solicitud...');
        try {
            const uniqueId = 'S' + Math.floor(Math.random() * 900000 + 100000).toString();
            const requestResult = await db.query(
                `INSERT INTO requests (
                    user_id, title, description, project_type, budget_range, 
                    timeline, budget, attachments, preferred_start_date,
                    technical_requirements, target_audience, additional_notes, unique_id
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
                RETURNING *`,
                [
                    userId, 
                    'Test Request', 
                    'Test Description', 
                    'web', 
                    '1000-5000',
                    '1-3 months', 
                    1500, 
                    ['file1.pdf', 'file2.jpg'], 
                    '2026-04-01',
                    'React, Node.js', 
                    'Empresas', 
                    'Notas adicionales', 
                    uniqueId
                ]
            );
            console.log('✅ Solicitud creada:', requestResult.rows[0].unique_id);
        } catch (error) {
            console.error('❌ Error al crear solicitud:', error.message);
        }
        
        // Test 2: Create a project
        console.log('\n📝 Test 2: Creando proyecto...');
        try {
            const uniqueId = 'P' + Math.floor(Math.random() * 900000 + 100000).toString();
            const projectResult = await db.query(
                `INSERT INTO projects (user_id, title, description, budget, start_date, end_date, cover_image, tags, unique_id) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
                [userId, 'Test Project', 'Test Description', 2000, '2026-04-01', '2026-06-01', 'https://example.com/image.jpg', ['web', 'design'], uniqueId]
            );
            console.log('✅ Proyecto creado:', projectResult.rows[0].unique_id);
        } catch (error) {
            console.error('❌ Error al crear proyecto:', error.message);
        }
        
        // Test 3: Create a message
        console.log('\n📝 Test 3: Creando mensaje...');
        try {
            const messageResult = await db.query(
                'INSERT INTO messages (user_id, sender_id, message, attachments) VALUES ($1, $2, $3, $4) RETURNING *',
                [userId, userId, 'Test message', JSON.stringify(['file1.pdf'])]
            );
            console.log('✅ Mensaje creado con ID:', messageResult.rows[0].id);
        } catch (error) {
            console.error('❌ Error al crear mensaje:', error.message);
        }
        
        console.log('\n🎉 Pruebas completadas');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error general:', error);
        process.exit(1);
    }
}

testRoutes();