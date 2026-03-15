# 📱 Instagram DM Integration Setup

Esta guía te ayudará a configurar la integración de Instagram DMs con tu proyecto Genswave.

## 🔧 Configuración en Meta for Developers

### Paso 1: Crear App en Meta for Developers

1. Ve a [developers.facebook.com](https://developers.facebook.com)
2. Haz clic en **"My Apps"** → **"Create App"**
3. Selecciona **"Business"** como tipo de app
4. Completa la información:
   - **App Name**: `Genswave Instagram Bot`
   - **App Contact Email**: tu email
   - **Business Account**: tu cuenta de negocio

### Paso 2: Configurar Instagram Basic Display

1. En tu app, ve a **"Add Products"**
2. Busca **"Instagram Basic Display"** y haz clic en **"Set Up"**
3. Ve a **"Basic Display"** → **"Settings"**
4. Configura las URLs:

#### URLs de Callback Requeridas:
```
OAuth Redirect URI: https://genswave.onrender.com/api/instagram/auth/callback
Deauthorize Callback URL: https://genswave.onrender.com/api/instagram/auth/deauthorize
Data Deletion Request URL: https://genswave.onrender.com/api/instagram/auth/data-deletion
```

### Paso 3: Configurar Instagram Messaging API

1. En tu app, busca **"Messenger"** y haz clic en **"Set Up"**
2. Ve a **"Messenger"** → **"Settings"**
3. En **"Webhooks"**, haz clic en **"Add Callback URL"**

#### Configuración de Webhook:
```
Callback URL: https://genswave.onrender.com/api/instagram/webhook
Verify Token: tu-token-secreto-aqui (guárdalo para después)
```

4. Suscríbete a estos eventos:
   - `messages`
   - `messaging_postbacks`
   - `messaging_optins`
   - `message_deliveries`
   - `message_reads`

### Paso 4: Obtener Tokens de Acceso

1. Ve a **"Tools"** → **"Graph API Explorer**
2. Selecciona tu app
3. Genera un token de acceso con estos permisos:
   - `instagram_basic`
   - `instagram_manage_messages`
   - `pages_messaging`

## 🔐 Variables de Entorno

Agrega estas variables a tu archivo `.env` en Render:

```bash
# Instagram Integration
INSTAGRAM_APP_ID=tu-app-id-aqui
INSTAGRAM_APP_SECRET=tu-app-secret-aqui
INSTAGRAM_ACCESS_TOKEN=tu-access-token-aqui
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=tu-webhook-verify-token-aqui
```

### Cómo obtener cada variable:

#### INSTAGRAM_APP_ID
- Ve a tu app en Meta for Developers
- Está en **"Settings"** → **"Basic"**

#### INSTAGRAM_APP_SECRET
- En la misma página de **"Settings"** → **"Basic"**
- Haz clic en **"Show"** junto a "App Secret"

#### INSTAGRAM_ACCESS_TOKEN
- Usa el Graph API Explorer para generar un token de larga duración
- O usa el endpoint: `/api/instagram/auth/url` para obtener la URL de autorización

#### INSTAGRAM_WEBHOOK_VERIFY_TOKEN
- Es un token que tú creas (puede ser cualquier string seguro)
- Ejemplo: `mi-webhook-token-super-secreto-2024`

## 🚀 Activación

### Paso 1: Configurar Variables en Render

1. Ve a tu dashboard de Render
2. Selecciona tu servicio `genswave`
3. Ve a **"Environment"**
4. Agrega las 4 variables de Instagram

### Paso 2: Ejecutar Migración

La migración se ejecutará automáticamente al hacer deploy, pero puedes ejecutarla manualmente:

```bash
node migrate-instagram.js
```

### Paso 3: Verificar Webhook

1. En Meta for Developers, ve a tu app
2. En **"Messenger"** → **"Settings"** → **"Webhooks"**
3. Haz clic en **"Verify and Save"**
4. Deberías ver un ✅ verde si todo está configurado correctamente

## 🤖 Funcionalidades del Bot

### Comandos Automáticos

El bot responde automáticamente a estos mensajes:

- **"Hola"** / **"Hello"** / **"Hi"** → Mensaje de bienvenida
- **"Cotización"** / **"Precio"** / **"Costo"** → Solicitud de cotización
- **"Cita"** / **"Reunión"** → Agendar cita
- **"Servicios"** → Lista de servicios
- **"Ayuda"** / **"Help"** → Menú de comandos

### Respuestas Inteligentes

- Respuestas automáticas personalizadas
- Redirección a la web para formularios completos
- Guardado de mensajes para revisión del admin
- Manejo de archivos adjuntos

## 🛠️ Endpoints Disponibles

### Para Usuarios
- `GET /api/instagram/auth/url` - Obtener URL de autorización
- `POST /api/instagram/webhook` - Webhook para recibir mensajes
- `GET /api/instagram/webhook` - Verificación de webhook

### Para Administradores
- `POST /api/instagram/send-message` - Enviar mensaje manual
- `GET /api/instagram/auth/callback` - Callback de OAuth

## 📊 Monitoreo

### Logs del Sistema
Los mensajes de Instagram aparecerán en los logs de Render:
- `📱 Instagram webhook received`
- `📨 Message from [user_id]`
- `✅ Instagram message sent successfully`

### Base de Datos
Los mensajes se guardan en la tabla `instagram_messages`:
- Mensajes de usuarios
- Respuestas del bot
- Archivos adjuntos
- Información del remitente

## 🔧 Troubleshooting

### Webhook no funciona
1. Verifica que la URL sea exactamente: `https://genswave.onrender.com/api/instagram/webhook`
2. Confirma que el `INSTAGRAM_WEBHOOK_VERIFY_TOKEN` coincida
3. Revisa los logs de Render para errores

### Bot no responde
1. Verifica que `INSTAGRAM_ACCESS_TOKEN` sea válido
2. Confirma que los permisos incluyan `instagram_manage_messages`
3. Revisa que la app esté en modo "Live" (no Development)

### Errores de autenticación
1. Regenera el access token
2. Verifica que el App Secret sea correcto
3. Confirma que la app tenga los productos correctos activados

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Render dashboard
2. Verifica la configuración en Meta for Developers
3. Confirma que todas las variables de entorno estén configuradas
4. Prueba el webhook con la herramienta de Meta

## 🎉 ¡Listo!

Una vez configurado, los usuarios podrán:
- Enviar mensajes a tu Instagram
- Recibir respuestas automáticas
- Solicitar cotizaciones
- Agendar citas
- Obtener información sobre servicios

¡Tu bot de Instagram estará funcionando 24/7 para atender a tus clientes!