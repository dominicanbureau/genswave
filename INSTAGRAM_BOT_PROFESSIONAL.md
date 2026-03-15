# Bot de Instagram Profesional - Sistema Conversacional

## 🎯 Resumen de Mejoras

Hemos transformado completamente el bot de Instagram de Genswave para ofrecer una experiencia profesional y conversacional que guía a los usuarios paso a paso.

## ✨ Características Principales

### 1. **Sistema de Estados Conversacionales**
- **Base de datos**: Nueva tabla `conversation_states` para manejar el flujo
- **Estados disponibles**: 
  - `idle` - Estado inicial
  - `awaiting_name` - Esperando nombre del usuario
  - `awaiting_email` - Esperando email (con validación)
  - `awaiting_phone` - Esperando teléfono
  - `awaiting_company` - Esperando empresa
- **Persistencia**: Los estados se mantienen entre mensajes
- **Limpieza automática**: Estados antiguos se limpian cada hora

### 2. **Mensajes Profesionales y Corporativos**
- **Tono empresarial**: Lenguaje formal y profesional
- **Branding consistente**: Siempre menciona "Genswave"
- **Formato estructurado**: Mensajes bien organizados con emojis profesionales
- **Información clara**: Instrucciones paso a paso

### 3. **Flujo Conversacional Mejorado**

#### Proceso de Generación de Código:
```
Usuario: "código"
Bot: Explica beneficios + solicita nombre
Usuario: "Juan Pérez"
Bot: Confirma nombre + solicita email
Usuario: "juan@email.com"
Bot: Valida email + solicita teléfono
Usuario: "+1234567890"
Bot: Confirma teléfono + solicita empresa
Usuario: "Mi Empresa"
Bot: Genera código + envía instrucciones completas
```

### 4. **Validaciones Inteligentes**
- **Email**: Validación de formato con regex
- **Nombre**: Mínimo 2 caracteres
- **Teléfono**: Mínimo 8 caracteres
- **Empresa**: Acepta "Independiente" para personas naturales
- **Reintentos**: Permite corregir datos incorrectos

### 5. **Códigos de Acceso Mejorados**
- **Validez extendida**: 30 días (antes 7 días)
- **Formato profesional**: Código en formato `XXXXXX`
- **Instrucciones claras**: Pasos numerados para usar el código
- **Confirmación completa**: Resumen de todos los datos registrados

## 🛠️ Implementación Técnica

### Base de Datos
```sql
CREATE TABLE conversation_states (
  id SERIAL PRIMARY KEY,
  instagram_user_id VARCHAR(255) NOT NULL UNIQUE,
  current_state VARCHAR(50) DEFAULT 'idle',
  collected_data JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Funciones Principales
- `getConversationState(userId)` - Obtiene o crea estado
- `updateConversationState(userId, state, data)` - Actualiza estado
- `handleIdleState()` - Maneja comandos iniciales
- `handleNameInput()` - Procesa y valida nombre
- `handleEmailInput()` - Procesa y valida email
- `handlePhoneInput()` - Procesa y valida teléfono
- `handleCompanyInput()` - Procesa empresa y genera código

### Panel de Administración
- **Botón "Reiniciar"**: Resetea conversación de usuario
- **Botón "Generar Código"**: Genera código manualmente
- **Indicadores visuales**: Diferencia mensajes de Instagram
- **Estilos mejorados**: Colores y diseño específico para Instagram

## 📱 Comandos Disponibles

### Comandos Principales:
- **"Hola/Hello/Hi"** - Saludo profesional con opciones
- **"Código/Acceso/Portal"** - Inicia proceso de generación
- **"Cotización/Presupuesto"** - Información sobre cotizaciones
- **"Cita/Consulta"** - Agendar reuniones
- **"Servicios/Portfolio"** - Portafolio completo
- **"Ayuda/Help"** - Centro de ayuda

### Respuestas Automáticas:
- **Archivos adjuntos**: Confirmación profesional de recepción
- **Mensajes no reconocidos**: Respuesta cortés con opciones
- **Errores**: Mensajes de error informativos con soluciones

## 🎨 Experiencia de Usuario

### Antes:
```
Usuario: "código"
Bot: "Responde con formato: DATOS: Nombre | Email | Teléfono | Empresa"
Usuario: [formato complejo]
Bot: [código o error]
```

### Ahora:
```
Usuario: "código"
Bot: [Explicación profesional de beneficios]
Bot: "Primera pregunta: ¿Cuál es su nombre completo?"
Usuario: "Juan Pérez"
Bot: "Perfecto, Juan. Segunda pregunta: ¿Su email?"
Usuario: "juan@email.com"
Bot: "Excelente. Tercera pregunta: ¿Su teléfono?"
Usuario: "+1234567890"
Bot: "Perfecto. Última pregunta: ¿Su empresa?"
Usuario: "Mi Empresa"
Bot: [Código generado + instrucciones completas]
```

## 🔧 Funciones de Administración

### Nuevos Endpoints:
- `POST /api/instagram/reset-conversation` - Reinicia conversación
- `POST /api/instagram/generate-quick-code` - Genera código manual

### Panel Admin:
- **Toggle Web/Instagram**: Alterna entre tipos de chat
- **Botón Reiniciar**: Resetea estado de conversación
- **Botón Generar Código**: Crea código manualmente
- **Indicadores visuales**: Estados de conversación

## 📊 Beneficios del Nuevo Sistema

### Para Usuarios:
- ✅ **Proceso más fácil**: Preguntas una por una
- ✅ **Menos errores**: Validación en cada paso
- ✅ **Experiencia profesional**: Tono corporativo
- ✅ **Instrucciones claras**: Pasos numerados
- ✅ **Códigos más duraderos**: 30 días de validez

### Para Administradores:
- ✅ **Control total**: Reiniciar conversaciones
- ✅ **Generación manual**: Códigos desde admin
- ✅ **Visibilidad completa**: Ver estados de conversación
- ✅ **Mantenimiento automático**: Limpieza de estados antiguos

### Para el Negocio:
- ✅ **Imagen profesional**: Comunicación corporativa
- ✅ **Menos soporte**: Proceso más claro
- ✅ **Mejor conversión**: Flujo más fácil de completar
- ✅ **Datos más precisos**: Validación en cada campo

## 🚀 Próximos Pasos

### Para Activar Completamente:
1. **Configurar variables de entorno** en Render:
   - `INSTAGRAM_APP_ID`
   - `INSTAGRAM_APP_SECRET`
   - `INSTAGRAM_ACCESS_TOKEN`
   - `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`

2. **Ejecutar migración** (automática en próximo deploy):
   ```bash
   node migrate-conversation-states.js
   ```

3. **Probar el sistema**:
   - Escribir "código" en Instagram
   - Seguir el proceso paso a paso
   - Verificar en panel admin

### Mejoras Futuras Sugeridas:
- **Plantillas de respuesta**: Respuestas rápidas para admin
- **Estadísticas de conversión**: Métricas del proceso
- **Notificaciones push**: Alertas de nuevos mensajes
- **Integración CRM**: Sincronizar con sistema de clientes

## 📝 Notas Técnicas

### Mantenimiento:
- Estados antiguos se limpian automáticamente cada hora
- Conversaciones inactivas por 24h se resetean a 'idle'
- Logs detallados para debugging

### Seguridad:
- Validación de todos los inputs
- Sanitización de datos
- Códigos únicos y seguros
- Expiración automática

### Performance:
- Índices en tabla de estados
- Consultas optimizadas
- Limpieza automática de datos antiguos

---

## 🎉 Resultado Final

El bot de Instagram de Genswave ahora ofrece una experiencia profesional, conversacional y fácil de usar que refleja la calidad de la empresa y facilita la generación de códigos de acceso para los clientes.