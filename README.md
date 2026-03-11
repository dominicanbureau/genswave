# Studio - Landing Page con Sistema de Citas (React)

Landing page moderna y minimalista construida con React y Framer Motion, con sistema de gestión de citas y panel de administración.

## Características

- 🎨 Diseño moderno estilo Apple con animaciones fluidas usando Framer Motion
- ⚛️ Construido con React 18 y Vite
- 📱 Totalmente responsive
- 📅 Sistema de reserva de citas
- 🔐 Panel de administración protegido
- 💾 Base de datos PostgreSQL (Neon)
- 🚀 Listo para desplegar en Render

## Tecnologías

- **Frontend**: React 18, Framer Motion, React Router
- **Build Tool**: Vite
- **Backend**: Node.js, Express
- **Base de datos**: PostgreSQL (Neon)
- **Autenticación**: Express Session + bcrypt

## Instalación Local

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```

3. El archivo `.env` ya está configurado con tu base de datos Neon

4. Inicia el proyecto en modo desarrollo:
```bash
npm run dev
```

Esto iniciará:
- Frontend (React + Vite): http://localhost:5173
- Backend (Express): http://localhost:3000

## Scripts Disponibles

```bash
npm run dev        # Inicia frontend y backend en modo desarrollo
npm run client     # Solo frontend (Vite)
npm run server     # Solo backend (Express)
npm run build      # Build de producción
npm start          # Inicia servidor de producción
```

## Credenciales por Defecto

- Email: `admin@studio.com`
- Password: `admin123`

**⚠️ IMPORTANTE**: Cambia estas credenciales en producción usando las variables de entorno.

## Despliegue en Render

### Opción 1: Usando render.yaml (Recomendado)

El proyecto incluye un archivo `render.yaml` configurado. Solo necesitas:

1. Sube el código a GitHub
2. En Render, selecciona "New" → "Blueprint"
3. Conecta tu repositorio
4. Render desplegará automáticamente usando la configuración del archivo

### Opción 2: Manual

1. En Render Dashboard, click en "New +" → "Web Service"
2. Conecta tu repositorio
3. Configura:
   - Name: `studio-landing`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Free

4. Agrega las variables de entorno:
   - `DATABASE_URL`: (ya configurada en .env)
   - `SESSION_SECRET`: Genera un string aleatorio seguro
   - `ADMIN_EMAIL`: admin@studio.com
   - `ADMIN_PASSWORD`: admin123
   - `NODE_ENV`: `production`

## Estructura del Proyecto

```
.
├── src/
│   ├── components/         # Componentes React
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Services.jsx
│   │   ├── Process.jsx
│   │   ├── AppointmentForm.jsx
│   │   ├── Footer.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/             # Páginas
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Admin.jsx
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Entry point
│   └── index.css          # Estilos globales
├── routes/                # Rutas de la API
│   ├── auth.js
│   └── appointments.js
├── database.js            # Configuración de base de datos
├── server.js              # Servidor Express
├── vite.config.js         # Configuración de Vite
└── package.json
```

## Animaciones

El proyecto utiliza Framer Motion para animaciones fluidas:

- Parallax scrolling en el hero
- Fade in/out con scroll
- Hover effects en cards y botones
- Transiciones suaves entre páginas
- Animaciones de entrada escalonadas
- Efectos de glassmorphism

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/status` - Verificar estado de autenticación
- `POST /api/auth/logout` - Cerrar sesión

### Citas
- `POST /api/appointments` - Crear nueva cita (público)
- `GET /api/appointments` - Obtener todas las citas (requiere auth)
- `PATCH /api/appointments/:id/status` - Actualizar estado (requiere auth)
- `DELETE /api/appointments/:id` - Eliminar cita (requiere auth)

## Personalización

### Colores
Edita las variables CSS en `src/index.css`:
```css
:root {
    --black: #000000;
    --white: #ffffff;
    --gray-light: #f5f5f7;
    --gray-medium: #86868b;
    --gray-dark: #1d1d1f;
}
```

### Contenido
- Edita los componentes en `src/components/` para cambiar textos
- Modifica los servicios en `src/components/Services.jsx`
- Actualiza el proceso en `src/components/Process.jsx`

## Licencia

Todos los derechos reservados © 2024 Studio
