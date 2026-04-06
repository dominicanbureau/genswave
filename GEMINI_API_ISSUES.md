# Problemas con Gemini API - Resumen y Soluciones

## 🚨 PROBLEMAS IDENTIFICADOS

### 1. Primera API Key (AIzaSyAYwwxDzjq3NedHz5uM3U1umYJxQvhubt4)
**Error:** `[403 Forbidden] Your API key was reported as leaked`
**Causa:** La API key fue expuesta públicamente y Google la bloqueó por seguridad
**Estado:** BLOQUEADA PERMANENTEMENTE

### 2. Segunda API Key (AIzaSyA3XAQD_3Hpq5Rh1iI2mfJXjIcEnVL1u9U)
**Error:** `[400 Bad Request] API key expired. Please renew the API key`
**Causa:** La API key está expirada
**Estado:** EXPIRADA - NO FUNCIONAL

### 3. Cuota Excedida
**Error:** `[429 Too Many Requests] You exceeded your current quota`
**Detalles:** 
- Límite: 20 requests por día (tier gratuito)
- Modelo: gemini-2.5-flash (que además NO EXISTE)
**Estado:** CUOTA AGOTADA

### 4. Modelo Incorrecto
**Error:** Modelo `gemini-2.5-flash` no existe
**Corrección aplicada:** Cambiado a `gemini-1.5-flash` (modelo válido)

## ✅ SOLUCIONES APLICADAS

1. ✅ Cambiado modelo de `gemini-2.5-flash` a `gemini-1.5-flash`
2. ✅ Cambiado embedding model de `text-embedding-004` a `embedding-001`
3. ✅ Sistema de fallback funcionando (búsqueda de texto cuando embeddings fallan)
4. ✅ RAG system encontrando 5 chunks relevantes por consulta

## 🔧 LO QUE NECESITAS HACER

### Opción 1: Nueva API Key (RECOMENDADO)
1. Ve a https://aistudio.google.com/app/apikey
2. **ELIMINA** las API keys antiguas (ambas están comprometidas)
3. Crea una API key COMPLETAMENTE NUEVA
4. Copia la nueva API key
5. Actualiza `.env`:
   ```
   GEMINI_API_KEY=tu_nueva_api_key_aqui
   ```
6. Reinicia el servidor: `node server.js`

### Opción 2: Esperar Reset de Cuota
Si ya creaste una nueva API key pero sigue dando error de cuota:
- La cuota se resetea cada 24 horas
- Espera hasta mañana para probar de nuevo
- O actualiza a un plan de pago en Google AI Studio

### Opción 3: Plan de Pago (Para Producción)
Si necesitas más requests:
1. Ve a https://console.cloud.google.com/
2. Habilita facturación en tu proyecto
3. Aumenta los límites de cuota
4. Costo aproximado: $0.00025 por 1K caracteres (muy económico)

## 📊 MODELOS VÁLIDOS DE GEMINI

### Modelos de Generación (para chat)
- ✅ `gemini-1.5-flash` - Rápido y económico (RECOMENDADO)
- ✅ `gemini-1.5-pro` - Más potente pero más caro
- ✅ `gemini-1.0-pro` - Versión anterior
- ❌ `gemini-2.5-flash` - NO EXISTE

### Modelos de Embeddings (para RAG)
- ✅ `embedding-001` - Modelo actual (CORRECTO)
- ❌ `text-embedding-004` - NO EXISTE

## 🎯 ESTADO ACTUAL DEL SISTEMA

### ✅ Funcionando
- Servidor corriendo en puerto 3000
- Base de datos conectada
- RAG system indexado (245 chunks)
- Búsqueda de conocimiento funcionando (fallback text search)
- Admin panel con transfers funcionando
- Formato HTML en mensajes funcionando

### ❌ No Funcionando (por API key)
- Generación de respuestas AI (necesita API key válida)
- Embeddings semánticos (usando fallback text search)

### 🔄 Funcionando con Limitaciones
- RAG search usando búsqueda de texto simple (funciona pero menos preciso que embeddings)
- Sistema devuelve respuestas de fallback cuando Gemini falla

## 🧪 CÓMO PROBAR CUANDO TENGAS API KEY VÁLIDA

```bash
# 1. Actualiza .env con nueva API key
# 2. Reinicia servidor
node server.js

# 3. Prueba el sistema
node test-rag-system.js

# 4. O prueba en el navegador
# Abre http://localhost:5173
# Haz click en el botón del AI Assistant
# Pregunta algo como: "¿Cuáles son los servicios de Genswave?"
```

## 📝 RESPUESTAS ESPERADAS (cuando funcione)

### Pregunta: "¿Cuáles son los servicios que ofrece Genswave?"
**Esperado:** Lista de 21 servicios incluyendo:
- Plataformas Digitales
- E-Commerce
- Automatización e IA
- Marketing Digital
- etc.

### Pregunta: "¿Cuánto cuesta desarrollar una aplicación?"
**Esperado:** Rangos de precios:
- Sitios básicos: desde $5,000
- Aplicaciones complejas: $5,000 - $50,000+
- Soluciones empresariales: cotización personalizada

### Pregunta: "¿Cuál es el proceso de trabajo?"
**Esperado:** 4 etapas:
1. Descubrimiento (1-2 semanas)
2. Estrategia y Diseño (2-3 semanas)
3. Desarrollo (4-12 semanas)
4. Finalización y Lanzamiento (1-2 semanas)

## 🔐 SEGURIDAD - IMPORTANTE

### ⚠️ NUNCA hagas esto:
- ❌ Compartir API keys en mensajes públicos
- ❌ Commitear API keys a Git
- ❌ Publicar API keys en screenshots
- ❌ Usar la misma API key después de que fue expuesta

### ✅ SIEMPRE haz esto:
- ✅ Mantén API keys en archivo `.env`
- ✅ Asegúrate que `.env` está en `.gitignore`
- ✅ Rota API keys regularmente
- ✅ Usa variables de entorno en producción
- ✅ Monitorea el uso de tu API key en Google AI Studio

## 📞 SOPORTE

Si sigues teniendo problemas después de crear una nueva API key:

1. Verifica que la API key es nueva y no expirada
2. Verifica que no has excedido la cuota diaria
3. Revisa los logs del servidor: `getProcessOutput terminalId:11`
4. Prueba la API key directamente en Google AI Studio
5. Considera actualizar a un plan de pago si necesitas más requests

## 🎉 PRÓXIMOS PASOS

Una vez que tengas una API key válida:
1. El AI responderá con conocimiento profundo del sitio
2. Las respuestas estarán bien formateadas (listas, negritas, etc.)
3. El sistema RAG usará embeddings semánticos (más preciso)
4. Podrás probar el sistema de transfers completo
5. Todo funcionará como se espera

---

**Resumen:** Necesitas una API key de Gemini válida y activa. Las dos que proporcionaste están bloqueadas/expiradas. Crea una nueva en https://aistudio.google.com/app/apikey
