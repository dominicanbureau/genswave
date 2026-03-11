# 🚀 Instrucciones de Uso - Studio Landing Page

## ✅ Tu proyecto está listo y funcionando!

### 🎯 Estado Actual

- ✅ Proyecto React con Vite configurado
- ✅ Backend Express con API REST
- ✅ Base de datos Neon PostgreSQL conectada
- ✅ Animaciones con Framer Motion
- ✅ Sistema de autenticación funcionando
- ✅ Panel de administración completo

### 🌐 Acceso Local

El proyecto está corriendo en:

- **Frontend (React)**: http://localhost:5173
- **Backend (API)**: http://localhost:3000

### 🔐 Credenciales de Administrador

- **Email**: admin@studio.com
- **Password**: admin123

### 📱 Cómo Usar

1. **Landing Page**: Abre http://localhost:5173
   - Navega por las secciones
   - Completa el formulario de citas
   - Haz clic en "Login" para acceder al panel

2. **Panel de Administración**: http://localhost:5173/login
   - Ingresa con las credenciales
   - Ve las estadísticas de citas
   - Gestiona las solicitudes (confirmar, completar, eliminar)

### 🛠️ Comandos Disponibles

```bash
# Desarrollo (inicia frontend y backend)
npm run dev

# Solo frontend
npm run client

# Solo backend
npm run server

# Build para producción
npm run build

# Iniciar en producción
npm start
```

### 🎨 Características de Diseño

- **Animaciones suaves** con Framer Motion
- **Parallax scrolling** en el hero
- **Glassmorphism** en la navegación
- **Hover effects** en todos los elementos interactivos
- **Transiciones fluidas** entre páginas
- **Diseño responsive** para móviles y tablets

### 📦 Desplegar en Render

1. Sube tu código a GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin TU_REPO_URL
git push -u origin main
```

2. En Render:
   - New → Blueprint
   - Conecta tu repositorio
   - Render usará el archivo `render.yaml` automáticamente

3. Tu sitio estará en: `https://studio-landing.onrender.com`

### 🔧 Personalización

**Colores**: Edita `src/index.css`
```css
:root {
    --black: #000000;
    --white: #ffffff;
    --gray-light: #f5f5f7;
    --gray-medium: #86868b;
    --gray-dark: #1d1d1f;
}
```

**Contenido**: 
- Hero: `src/components/Hero.jsx`
- Servicios: `src/components/Services.jsx`
- Proceso: `src/components/Process.jsx`
- Formulario: `src/components/AppointmentForm.jsx`

### 📊 Base de Datos

Tu base de datos Neon ya está configurada y tiene:
- Tabla `users` (administradores)
- Tabla `appointments` (citas)
- Usuario admin creado automáticamente

### 🐛 Solución de Problemas

**Si el servidor no inicia:**
```bash
# Detén todos los procesos
Ctrl + C

# Reinstala dependencias
rm -rf node_modules package-lock.json
npm install

# Inicia de nuevo
npm run dev
```

**Si hay errores de base de datos:**
- Verifica que el archivo `.env` tenga la URL correcta
- La base de datos se inicializa automáticamente al iniciar el servidor

### 📞 Soporte

Si necesitas ayuda:
1. Revisa los logs en la terminal
2. Verifica que ambos servidores estén corriendo
3. Asegúrate de que los puertos 3000 y 5173 estén libres

### 🎉 ¡Listo para usar!

Tu landing page profesional está lista. Solo necesitas:
1. Personalizar el contenido
2. Cambiar las credenciales de admin
3. Desplegar en Render

¡Disfruta tu nueva landing page con animaciones tipo Apple! 🚀
