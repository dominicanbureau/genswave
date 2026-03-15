# Sistema de Chat de Instagram Integrado

## Descripción General

Este sistema permite a los administradores gestionar conversaciones de Instagram directamente desde el panel de administración web, así como generar códigos de acceso rápido a través de Instagram de forma automatizada.

## Características Principales

### 1. Chat Integrado en Panel de Admin

- **Visualización Dual**: Alternar entre chats web tradicionales y conversaciones de Instagram
- **Interfaz Unificada**: Misma experiencia de usuario para ambos tipos de chat
- **Respuestas Directas**: Los administradores pueden responder a mensajes de Instagram desde la web
- **Indicadores Visuales**: Diferenciación clara entre mensajes de Instagram y web

### 2. Generación Automática de Códigos Rápidos

- **Comando por Chat**: Los usuarios pueden solicitar códigos escribiendo "código" o "acceso"
- **Proceso Guiado**: El bot guía al usuario paso a paso para recopilar información
- **Formato Estructurado**: Sistema de datos con formato específico para evitar errores
- **Envío Automático**: El código se genera y envía automáticamente por Instagram

### 3. Bot de Instagram Mejorado

#### Comandos Disponibles:
- `hola/hello/hi` - Saludo inicial con menú de opciones
- `código/codigo/acceso` - Inicia proceso de generación de código
- `cotización/precio/costo` - Información sobre cotizaciones
- `cita/reunión/meeting` - Agendar citas
- `servicios` - Lista de servicios disponibles
- `ayuda/help` - Menú de comandos

#### Proceso de Generación de Código:
1. Usuario escribe "código"
2. Bot explica el proceso y solicita datos
3. Usuario responde con formato: `DATOS: Nombre | Email | Teléfono | Empresa`
4. Sistema valida y genera código
5. Código se envía automáticamente al usuario
6. Código válido por 7 días

## Implementación Técnica

### Frontend (Admin Panel)

#### Nuevos Estados:
```javascript
const [chatType, setChatType] = useState('web'); // 'web' o 'instagram'
const [instagramConversations, setInstagramConversations] = useState([]);
const [instagramMessages, setInstagramMessages] = useState([]);
const [selectedInstagramConversation, setSelectedInstagramConversation] = useState(null);
```

#### Funciones Principales:
- `loadInstagramConversations()` - Carga conversaciones de Instagram
- `loadInstagramMessages(userId)` - Carga mensajes de un usuario específico
- `generateQuickCodeForInstagram(userId)` - Genera código para usuario de Instagram

### Backend (API Routes)

#### Nuevos Endpoints:
- `GET /api/instagram/conversations` - Lista conversaciones de Instagram
- `GET /api/instagram/messages/:userId` - Mensajes de usuario específico
- `POST /api/instagram/send-message` - Enviar mensaje desde admin
- `POST /api/instagram/generate-quick-code` - Generar código rápido

### Base de Datos

#### Tabla `instagram_messages`:
```sql
CREATE TABLE instagram_messages (
  id SERIAL PRIMARY KEY,
  instagram_user_id VARCHAR(255) NOT NULL,
  instagram_username VARCHAR(255),
  sender_name VARCHAR(255) NOT NULL,
  message_text TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text',
  attachments JSONB,
  is_from_user BOOLEAN DEFAULT true,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabla `quick_codes` (existente, mejorada):
- Ahora acepta usuarios de Instagram con emails temporales
- Formato: `instagram_[user_id]@temp.com`

## Flujo de Trabajo

### Para Administradores:

1. **Acceder al Panel**:
   - Ir a sección "Chats de Soporte"
   - Alternar entre "Chat Web" e "Instagram"

2. **Gestionar Conversaciones de Instagram**:
   - Ver lista de conversaciones con indicadores de no leídos
   - Seleccionar conversación para ver historial completo
   - Responder directamente desde la interfaz web

3. **Generar Códigos Rápidos**:
   - Hacer clic en "Generar Código" en cualquier conversación
   - El código se crea y envía automáticamente
   - Confirmación visual del proceso

### Para Usuarios de Instagram:

1. **Solicitar Código**:
   - Enviar mensaje con "código" o "acceso"
   - Seguir instrucciones del bot

2. **Proporcionar Datos**:
   - Usar formato: `DATOS: Juan Pérez | juan@email.com | +1234567890 | Mi Empresa`
   - Recibir código inmediatamente

3. **Usar Código**:
   - Visitar https://genswave.onrender.com
   - Ingresar código en sección "Código Rápido"
   - Acceder al dashboard personalizado

## Estilos CSS

### Nuevas Clases:
- `.chat-type-toggle` - Botones de alternancia entre tipos de chat
- `.conversation-avatar.instagram` - Avatar específico para Instagram
- `.message.instagram` - Estilos para mensajes de Instagram
- `.btn-generate-code` - Botón de generación de código
- `.instagram-username` - Estilo para nombres de usuario de Instagram

## Seguridad y Validación

### Validaciones Implementadas:
- Verificación de formato de datos del usuario
- Validación de campos requeridos en backend
- Sanitización de mensajes
- Verificación de tokens de Instagram

### Medidas de Seguridad:
- Códigos con expiración automática (7 días)
- Emails temporales para usuarios de Instagram
- Validación de permisos de administrador
- Rate limiting en endpoints sensibles

## Monitoreo y Logs

### Logs Implementados:
- Generación exitosa de códigos rápidos
- Errores en envío de mensajes
- Conversaciones nuevas de Instagram
- Respuestas de administradores

### Métricas Disponibles:
- Número de códigos generados por Instagram
- Tasa de respuesta de administradores
- Conversaciones activas por día
- Uso de comandos del bot

## Mantenimiento

### Tareas Regulares:
- Limpiar códigos expirados
- Revisar logs de errores
- Actualizar comandos del bot según necesidades
- Monitorear uso de API de Instagram

### Actualizaciones Futuras:
- Soporte para imágenes en respuestas de admin
- Plantillas de respuestas rápidas
- Estadísticas avanzadas de conversaciones
- Integración con CRM

## Troubleshooting

### Problemas Comunes:

1. **Mensajes no se envían**:
   - Verificar token de Instagram
   - Comprobar permisos de la app
   - Revisar logs del servidor

2. **Códigos no se generan**:
   - Verificar conexión a base de datos
   - Comprobar formato de datos del usuario
   - Revisar logs de errores

3. **Conversaciones no aparecen**:
   - Verificar webhook de Instagram
   - Comprobar tabla instagram_messages
   - Revisar configuración de la app

### Comandos de Diagnóstico:
```bash
# Verificar estado de Instagram
node check-instagram-connection.js

# Limpiar códigos expirados
node clean-expired-codes.js

# Verificar webhooks
curl -X GET https://genswave.onrender.com/api/instagram/webhook
```

## Conclusión

Este sistema proporciona una solución completa para la gestión de comunicaciones de Instagram, automatizando la generación de códigos de acceso y centralizando todas las conversaciones en una interfaz administrativa unificada.