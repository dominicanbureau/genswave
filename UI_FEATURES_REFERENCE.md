# Referencia Completa de Funcionalidades de UI - Genswave

## NAVEGACIÓN Y ELEMENTOS GLOBALES

### Navbar (Barra de Navegación)
- **Logo de Genswave**: Lleva a la página principal (/)
- **Menú Desktop**: Servicios, Proceso, Contacto, Login/Panel
- **Botón Hamburguesa (Mobile)**: Abre menú lateral en dispositivos móviles
- **Botón "Login" o "Ir al Panel"**: 
  - Si no estás logueado: te lleva a /login
  - Si estás logueado como usuario: te lleva a /dashboard
  - Si estás logueado como admin: te lleva a /admin

### Dashboard (Panel de Usuario)
- **Botón de Tema (Sol/Luna)**: Cambia entre modo claro y modo oscuro
  - Icono de Sol: Activa modo claro
  - Icono de Luna: Activa modo oscuro
  - Se encuentra en el header del dashboard
- **Sidebar**: Navegación entre secciones (Proyectos, Solicitudes, Mensajes, Perfil)
- **Notificaciones**: Campana con contador de notificaciones no leídas
- **Botón de Logout**: Cierra sesión y regresa al login

### Footer
- **Redes Sociales**: Instagram, Email
- **Enlaces**: Términos, Privacidad, Cookies, FAQ
- **Información de Contacto**: Email, ubicación

## PÁGINAS PRINCIPALES

### Página de Inicio (/)
- **Hero Section**: Presentación principal con animaciones
- **Sección de Servicios**: Vista previa de servicios
- **Sección de Proceso**: Cómo trabajamos
- **Call to Action**: Botones para contactar o ver servicios

### Página de Servicios (/servicios)
- **21 Categorías de Servicios**: Cada una con descripción detallada
- **Botón "Solicitar Información"**: Abre modal de contacto
- **Modal de Formulario**: Para solicitar información sobre un servicio específico

### Página de Proceso (/proceso)
- **4 Etapas del Proceso**: Descubrimiento, Estrategia, Desarrollo, Finalización
- **Timeline Visual**: Muestra el flujo de trabajo
- **Detalles de cada etapa**: Duración y actividades

### Página de Contacto (/contacto)
- **Formulario de Contacto**: Nombre, email, teléfono, mensaje
- **Información de Contacto**: Email, ubicación, redes sociales
- **Botón "Enviar"**: Envía el formulario de contacto

## SISTEMA DE AUTENTICACIÓN

### Página de Login (/login)
- **Formulario de Login**: Email y contraseña
- **Botón "Iniciar Sesión"**: Autentica al usuario
- **Link "¿Olvidaste tu contraseña?"**: Lleva a recuperación
- **Link "Crear cuenta"**: Lleva a registro
- **Sección "¿Tienes un código Quick?"**: Para acceso rápido con código

### Página de Registro
- **Formulario de Registro**: Nombre, email, teléfono, contraseña
- **Botón "Registrarse"**: Crea nueva cuenta
- **Link "Ya tengo cuenta"**: Regresa al login

### Quick Code Access
- **Campo de Código**: Ingresa código alfanumérico
- **Botón "Acceder"**: Valida código y crea cuenta automáticamente
- **Función**: Acceso rápido sin registro manual

## DASHBOARD DE USUARIO

### Sección de Proyectos
- **Lista de Proyectos**: Todos los proyectos del usuario
- **Botón "Nueva Solicitud"**: Crea nueva solicitud de proyecto
- **Tarjetas de Proyecto**: Muestran estado, título, descripción
- **Estados**: Pendiente, En Progreso, Completado, Cancelado

### Sección de Solicitudes
- **Historial de Solicitudes**: Todas las solicitudes enviadas
- **Detalles**: Tipo de proyecto, presupuesto, timeline
- **Estado**: Pendiente, Confirmada, Rechazada

### Sección de Mensajes
- **Chat con Soporte**: Comunicación directa con el equipo
- **Adjuntar Archivos**: Botón para subir documentos/imágenes
- **Historial de Mensajes**: Conversación completa
- **Indicador de Lectura**: Muestra si el mensaje fue leído

### Sección de Perfil
- **Información Personal**: Nombre, email, teléfono, ubicación
- **Botón "Editar Perfil"**: Permite modificar datos
- **Cambiar Contraseña**: Formulario para actualizar contraseña
- **Avatar**: Imagen de perfil del usuario

## PANEL DE ADMINISTRACIÓN

### Gestión de Usuarios
- **Lista de Usuarios**: Todos los usuarios registrados
- **Botón "Editar"**: Modifica información del usuario
- **Botón "Resetear Contraseña"**: Genera nueva contraseña
- **Botón "Eliminar"**: Elimina cuenta de usuario
- **Búsqueda**: Filtra usuarios por nombre o email

### Gestión de Proyectos
- **Lista de Proyectos**: Todos los proyectos del sistema
- **Cambiar Estado**: Actualiza estado del proyecto
- **Asignar a Usuario**: Vincula proyecto con cliente
- **Ver Detalles**: Información completa del proyecto

### Gestión de Solicitudes
- **Solicitudes de Citas**: Del formulario principal
- **Solicitudes del Dashboard**: De usuarios registrados
- **Botón "Aprobar"**: Confirma la solicitud
- **Botón "Archivar"**: Mueve a archivadas (mantener presionado 1 segundo)
- **Ver Archivadas**: Toggle para ver solicitudes archivadas

### Chat de Instagram
- **Lista de Conversaciones**: Todos los chats de Instagram
- **Responder**: Envía mensaje por Instagram
- **Generar Quick Code**: Crea código de acceso para el usuario
- **Resetear Conversación**: Limpia el estado del chat
- **Deshabilitar Bot**: Termina mensaje con ".." para desactivar respuestas automáticas

### Transfers del AI Bot
- **Lista de Transfers**: Casos transferidos del AI a soporte humano
- **Ver Mensajes**: Historial completo de la conversación
- **Responder**: Envía mensaje al usuario
- **Marcar como Resuelto**: Cierra el caso y notifica al usuario
- **Estados**: Pendiente, En Progreso, Resuelto

### Quick Codes
- **Lista de Códigos**: Todos los códigos generados
- **Crear Nuevo**: Genera código para un usuario
- **Estado**: Usado/No usado, Expirado/Vigente
- **Eliminar**: Invalida un código

## AI ASSISTANT (CHATBOT)

### Botón Flotante
- **Ubicación**: Esquina inferior derecha
- **Icono**: Burbuja de chat
- **Función**: Abre/cierra el chat del AI
- **Indicador**: Punto rojo para nuevas funciones

### Ventana de Chat
- **Header**: Logo de Genswave, estado "Asistente Virtual"
- **Área de Mensajes**: Historial de conversación
- **Input**: Campo para escribir mensajes
- **Botón Enviar**: Envía el mensaje al AI
- **Botones de Acción**: Acciones sugeridas (Ver servicios, Solicitar cotización, etc.)
- **Botón "Hablar con soporte"**: Transfiere a agente humano

### Funcionalidades del AI
- **Responde preguntas**: Sobre servicios, precios, procesos
- **Información de Quick Codes**: Explica cómo usarlos
- **Transferencia a soporte**: Conecta con equipo humano
- **Acciones sugeridas**: Botones para navegar o contactar
- **Polling**: Actualiza cada 3 segundos para nuevos mensajes de soporte

## ELEMENTOS INTERACTIVOS COMUNES

### Botones
- **Primarios**: Fondo negro, texto blanco (acciones principales)
- **Secundarios**: Borde, fondo transparente (acciones secundarias)
- **Hover**: Animación de escala y cambio de color
- **Disabled**: Opacidad reducida, no clickeable

### Formularios
- **Validación**: Campos requeridos marcados con *
- **Errores**: Mensajes en rojo debajo del campo
- **Éxito**: Mensaje de confirmación verde
- **Loading**: Spinner mientras se procesa

### Modales
- **Overlay**: Fondo oscuro semi-transparente
- **Contenido**: Centrado con animación de entrada
- **Botón Cerrar**: X en la esquina superior derecha
- **Click fuera**: Cierra el modal

### Notificaciones
- **Toast**: Mensajes temporales en esquina superior derecha
- **Tipos**: Éxito (verde), Error (rojo), Info (azul), Warning (amarillo)
- **Duración**: 3-5 segundos, auto-cierre

## CARACTERÍSTICAS ESPECIALES

### Modo Oscuro (Dark Mode)
- **Toggle**: Botón con icono de sol/luna en dashboard
- **Persistencia**: Se guarda la preferencia del usuario
- **Colores**: Fondo oscuro, texto claro, acentos ajustados
- **Transición**: Animación suave al cambiar

### Responsive Design
- **Desktop**: Layout completo con sidebar
- **Tablet**: Layout adaptado, menú colapsable
- **Mobile**: Menú hamburguesa, stack vertical

### Animaciones
- **Scroll**: Parallax y efectos de profundidad
- **Hover**: Escala, color, sombra
- **Entrada**: Fade in, slide in
- **Loading**: Spinners, skeleton screens

### Accesibilidad
- **Keyboard Navigation**: Tab, Enter, Escape
- **Focus States**: Indicadores visuales claros
- **ARIA Labels**: Para lectores de pantalla
- **Contraste**: Cumple estándares WCAG

## FUNCIONALIDADES TÉCNICAS (NO MENCIONAR AL USUARIO)

### Sistema de Archivado
- **Hold to Archive**: Mantener presionado 1 segundo para archivar
- **Toggle View**: Botón para ver archivadas/activas
- **Contador**: Muestra cantidad de items archivados

### Polling y Real-time
- **Mensajes**: Actualización cada 3 segundos
- **Notificaciones**: Check periódico de nuevas notificaciones
- **Estado de sesión**: Verificación de autenticación

### Gestión de Archivos
- **Upload**: Drag & drop o click para seleccionar
- **Preview**: Vista previa de imágenes
- **Límites**: Tamaño máximo, tipos permitidos
- **Progreso**: Barra de carga durante upload

---

## INSTRUCCIONES PARA EL AI

Cuando un usuario pregunte sobre un botón, elemento o funcionalidad:
1. Busca en este documento la información
2. Explica la función de forma clara y concisa
3. Si es relevante, menciona dónde se encuentra
4. Si no está en este documento, admite que no tienes esa información específica
5. NUNCA menciones detalles técnicos de implementación
6. Enfócate en QUÉ hace, no en CÓMO está programado
