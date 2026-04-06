import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import db from '../database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Directories and files to index
const CONTENT_SOURCES = {
  pages: ['src/pages/*.jsx', 'src/components/*.jsx'],
  routes: ['routes/*.js'],
  docs: ['*.md', 'UI_FEATURES_REFERENCE.md'], // Include UI documentation
  config: ['package.json'],
  utils: ['utils/*.js'],
  database: ['database.js', 'migrate*.js']
};

// Extract text content from JSX files
function extractJSXContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const chunks = [];
  
  // Extract component name
  const componentMatch = content.match(/function\s+(\w+)|const\s+(\w+)\s*=/);
  const componentName = componentMatch ? (componentMatch[1] || componentMatch[2]) : path.basename(filePath);
  
  // Extract ALL text from JSX (strings, descriptions, etc.)
  const textMatches = content.matchAll(/['"`]([^'"`]{5,}?)['"`]/g);
  const texts = Array.from(textMatches).map(m => m[1]);
  
  // Extract comments
  const commentMatches = content.matchAll(/\/\*\*(.*?)\*\*\/|\/\/\s*(.+)/gs);
  const comments = Array.from(commentMatches).map(m => (m[1] || m[2] || '').replace(/\*/g, '').trim()).filter(c => c.length > 5);
  
  // Extract button texts and their onClick handlers
  const buttonMatches = content.matchAll(/<button[^>]*onClick=\{([^}]+)\}[^>]*>([^<]+)<\/button>/g);
  const buttons = Array.from(buttonMatches).map(m => ({
    handler: m[1].trim(),
    text: m[2].trim()
  }));
  
  // Extract form inputs and their purposes
  const inputMatches = content.matchAll(/<input[^>]*(?:placeholder|name|type)=["']([^"']+)["'][^>]*>/g);
  const inputs = Array.from(inputMatches).map(m => m[1]);
  
  // Extract all onClick, onChange, onSubmit handlers
  const eventHandlers = content.matchAll(/(?:onClick|onChange|onSubmit|onMouseDown|onHover)=\{([^}]+)\}/g);
  const handlers = Array.from(eventHandlers).map(m => m[1].trim());
  
  // Extract useState, useEffect, and other hooks
  const hookMatches = content.matchAll(/use\w+\([^)]*\)/g);
  const hooks = Array.from(hookMatches).map(m => m[0]);
  
  // Extract function names and their purposes
  const functionMatches = content.matchAll(/(?:const|function)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{|function\s+(\w+)\s*\([^)]*\)\s*\{/g);
  const functions = Array.from(functionMatches).map(m => m[1] || m[2]).filter(Boolean);
  
  // Extract SVG icons and their context (to understand what buttons do)
  const svgContexts = content.matchAll(/<button[^>]*title=["']([^"']+)["'][^>]*>[\s\S]*?<svg/g);
  const buttonTitles = Array.from(svgContexts).map(m => m[1]);
  
  // Extract className patterns to understand UI elements
  const classNames = content.matchAll(/className=["']([^"']+)["']/g);
  const classes = Array.from(classNames).map(m => m[1]).filter(c => c.includes('btn') || c.includes('button') || c.includes('toggle') || c.includes('icon'));
  
  // Create comprehensive chunk with ALL UI information
  if (texts.length > 0 || comments.length > 0 || buttons.length > 0) {
    const buttonInfo = buttons.map(b => `Botón "${b.text}" ejecuta ${b.handler}`).join('. ');
    const inputInfo = inputs.length > 0 ? `Campos de entrada: ${inputs.join(', ')}` : '';
    const handlerInfo = handlers.length > 0 ? `Manejadores de eventos: ${handlers.slice(0, 10).join(', ')}` : '';
    const titleInfo = buttonTitles.length > 0 ? `Títulos de botones: ${buttonTitles.join(', ')}` : '';
    const classInfo = classes.length > 0 ? `Clases de UI: ${classes.slice(0, 20).join(', ')}` : '';
    
    chunks.push({
      type: 'component',
      source: filePath,
      title: `Componente: ${componentName}`,
      content: `Componente React: ${componentName}. 
        Textos visibles: ${texts.join(' ')}. 
        ${buttonInfo}
        ${inputInfo}
        ${handlerInfo}
        ${titleInfo}
        ${classInfo}
        Comentarios: ${comments.join(' ')}. 
        Funciones: ${functions.join(', ')}. 
        Hooks usados: ${hooks.length}. 
        Archivo: ${filePath}`,
      metadata: { 
        component: componentName,
        functions: functions,
        buttons: buttons.length,
        inputs: inputs.length,
        handlers: handlers.length,
        hasHooks: hooks.length > 0,
        textCount: texts.length
      }
    });
  }
  
  // Create specific chunks for each button with its function
  buttons.forEach((button, index) => {
    if (button.text.length > 2) {
      chunks.push({
        type: 'ui_button',
        source: filePath,
        title: `Botón: ${button.text}`,
        content: `En ${componentName}, el botón "${button.text}" ejecuta la función ${button.handler}. Ubicación: ${filePath}`,
        metadata: { component: componentName, buttonText: button.text, handler: button.handler }
      });
    }
  });
  
  // Create chunks for button titles (tooltips)
  buttonTitles.forEach((title, index) => {
    chunks.push({
      type: 'ui_element',
      source: filePath,
      title: `Elemento UI: ${title}`,
      content: `En ${componentName}, hay un elemento con el título "${title}". Este es un botón o control interactivo. Ubicación: ${filePath}`,
      metadata: { component: componentName, elementTitle: title }
    });
  });
  
  // Create chunks for important text sections
  texts.forEach((text, index) => {
    if (text.length > 50 && !text.includes('http') && !text.includes('svg')) {
      chunks.push({
        type: 'ui_text',
        source: filePath,
        title: `Texto de ${componentName}`,
        content: `En ${componentName}: "${text}". Ubicación: ${filePath}`,
        metadata: { component: componentName, index }
      });
    }
  });
  
  // Create chunks for form inputs
  inputs.forEach((input, index) => {
    if (input.length > 3) {
      chunks.push({
        type: 'ui_input',
        source: filePath,
        title: `Campo de formulario: ${input}`,
        content: `En ${componentName}, hay un campo de entrada para "${input}". Ubicación: ${filePath}`,
        metadata: { component: componentName, inputName: input }
      });
    }
  });
  
  return chunks;
}

// Extract content from markdown files
function extractMarkdownContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.md');
  
  // Split by headers
  const sections = content.split(/^#{1,3}\s+/gm);
  const chunks = [];
  
  sections.forEach((section, index) => {
    if (section.trim().length > 50) {
      const lines = section.split('\n');
      const title = lines[0] || fileName;
      const text = lines.slice(1).join(' ').trim();
      
      if (text.length > 50) {
        chunks.push({
          type: 'documentation',
          source: filePath,
          title: title.substring(0, 100),
          content: text,
          metadata: { section: index }
        });
      }
    }
  });
  
  return chunks;
}

// Extract content from route files
function extractRouteContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const chunks = [];
  const fileName = path.basename(filePath, '.js');
  
  // Extract route definitions with more context
  const routeMatches = content.matchAll(/router\.(get|post|put|patch|delete)\(['"`]([^'"`]+)['"`][^{]*{([^}]*(?:{[^}]*}[^}]*)*)/gs);
  const routes = Array.from(routeMatches);
  
  // Extract all comments
  const commentMatches = content.matchAll(/\/\/\s*(.+)|\/\*\*(.*?)\*\//gs);
  const comments = Array.from(commentMatches).map(m => (m[1] || m[2] || '').trim()).filter(c => c.length > 10);
  
  // Extract function definitions
  const functionMatches = content.matchAll(/(?:async\s+)?function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g);
  const functions = Array.from(functionMatches).map(m => m[1] || m[2]).filter(Boolean);
  
  // Create detailed chunks for each route
  routes.forEach((route, index) => {
    const method = route[1].toUpperCase();
    const endpoint = route[2];
    const routeBody = route[3] || '';
    
    // Extract what the route does from comments or code
    const description = routeBody.substring(0, 300);
    
    chunks.push({
      type: 'api_endpoint',
      source: filePath,
      title: `${method} ${endpoint} - ${fileName}`,
      content: `Endpoint: ${method} ${endpoint}. Archivo: ${fileName}. Funcionalidad: ${description}. ${comments.join(' ')}`,
      metadata: { method, endpoint, file: fileName }
    });
  });
  
  // Add general file info
  if (routes.length > 0 || functions.length > 0) {
    const routeInfo = routes.map(r => `${r[1].toUpperCase()} ${r[2]}`).join(', ');
    const functionInfo = functions.join(', ');
    
    chunks.push({
      type: 'api_file',
      source: filePath,
      title: `API: ${fileName}`,
      content: `Archivo de rutas: ${fileName}. Endpoints disponibles: ${routeInfo}. Funciones: ${functionInfo}. Comentarios: ${comments.join(' ')}. Contenido completo: ${content.substring(0, 1000)}`,
      metadata: { routes: routes.map(r => r[2]), functions }
    });
  }
  
  return chunks;
}

// Get all files matching patterns
function getFiles(patterns, baseDir = process.cwd()) {
  const files = [];
  
  patterns.forEach(pattern => {
    const dir = path.join(baseDir, path.dirname(pattern));
    const ext = path.extname(pattern);
    
    if (fs.existsSync(dir)) {
      const dirFiles = fs.readdirSync(dir);
      dirFiles.forEach(file => {
        if (file.endsWith(ext)) {
          files.push(path.join(dir, file));
        }
      });
    }
  });
  
  return files;
}

// Generate embedding using Gemini
async function generateEmbedding(text) {
  // Use simple hash-based embedding (Gemini embeddings not available)
  return simpleEmbedding(text);
}

// Simple fallback embedding (hash-based)
function simpleEmbedding(text, dimensions = 768) {
  const embedding = new Array(dimensions).fill(0);
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    embedding[i % dimensions] += charCode;
  }
  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
}

// Index all content
export async function indexAllContent() {
  console.log('🔍 Starting COMPREHENSIVE RAG indexing...');
  
  const allChunks = [];
  
  // Index JSX files
  console.log('📄 Indexing pages and components...');
  const jsxFiles = getFiles(CONTENT_SOURCES.pages);
  jsxFiles.forEach(file => {
    try {
      const chunks = extractJSXContent(file);
      allChunks.push(...chunks);
      console.log(`  ✓ ${path.basename(file)}: ${chunks.length} chunks`);
    } catch (error) {
      console.error(`Error indexing ${file}:`, error.message);
    }
  });
  
  // Index routes
  console.log('🛣️  Indexing API routes...');
  const routeFiles = getFiles(CONTENT_SOURCES.routes);
  routeFiles.forEach(file => {
    try {
      const chunks = extractRouteContent(file);
      allChunks.push(...chunks);
      console.log(`  ✓ ${path.basename(file)}: ${chunks.length} chunks`);
    } catch (error) {
      console.error(`Error indexing ${file}:`, error.message);
    }
  });
  
  // Index markdown docs
  console.log('📚 Indexing documentation...');
  const mdFiles = getFiles(CONTENT_SOURCES.docs);
  mdFiles.forEach(file => {
    try {
      const chunks = extractMarkdownContent(file);
      allChunks.push(...chunks);
      console.log(`  ✓ ${path.basename(file)}: ${chunks.length} chunks`);
    } catch (error) {
      console.error(`Error indexing ${file}:`, error.message);
    }
  });
  
  // Index utils
  console.log('🔧 Indexing utilities...');
  const utilFiles = getFiles(CONTENT_SOURCES.utils);
  utilFiles.forEach(file => {
    try {
      const chunks = extractRouteContent(file); // Reuse route extraction for JS files
      allChunks.push(...chunks);
      console.log(`  ✓ ${path.basename(file)}: ${chunks.length} chunks`);
    } catch (error) {
      console.error(`Error indexing ${file}:`, error.message);
    }
  });
  
  // Index database files
  console.log('💾 Indexing database files...');
  const dbFiles = getFiles(CONTENT_SOURCES.database);
  dbFiles.forEach(file => {
    try {
      const chunks = extractRouteContent(file);
      allChunks.push(...chunks);
      console.log(`  ✓ ${path.basename(file)}: ${chunks.length} chunks`);
    } catch (error) {
      console.error(`Error indexing ${file}:`, error.message);
    }
  });
  
  console.log(`\n✅ Extracted ${allChunks.length} content chunks total`);
  
  // Generate embeddings and store
  console.log('🧠 Generating embeddings and storing...');
  let stored = 0;
  
  for (const chunk of allChunks) {
    try {
      const embedding = await generateEmbedding(chunk.content);
      
      await db.query(`
        INSERT INTO rag_knowledge_base (
          type, source, title, content, embedding, metadata, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (source, title) 
        DO UPDATE SET 
          content = EXCLUDED.content,
          embedding = EXCLUDED.embedding,
          metadata = EXCLUDED.metadata,
          updated_at = NOW()
      `, [
        chunk.type,
        chunk.source,
        chunk.title,
        chunk.content,
        JSON.stringify(embedding),
        JSON.stringify(chunk.metadata)
      ]);
      
      stored++;
      if (stored % 20 === 0) {
        console.log(`  Stored ${stored}/${allChunks.length} chunks...`);
      }
    } catch (error) {
      console.error(`Error storing chunk from ${chunk.source}:`, error.message);
    }
  }
  
  console.log(`\n✅ Successfully indexed ${stored} chunks into knowledge base`);
  console.log(`📊 Breakdown:`);
  console.log(`   - Components/Pages: ${allChunks.filter(c => c.type === 'component' || c.type === 'ui_text').length}`);
  console.log(`   - API Endpoints: ${allChunks.filter(c => c.type === 'api_endpoint' || c.type === 'api_file').length}`);
  console.log(`   - Documentation: ${allChunks.filter(c => c.type === 'documentation').length}`);
  console.log(`   - Other: ${allChunks.filter(c => !['component', 'ui_text', 'api_endpoint', 'api_file', 'documentation'].includes(c.type)).length}`);
  
  return stored;
}

// Search for relevant content
export async function searchKnowledge(query, limit = 5) {
  try {
    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query);
    
    // Search using cosine similarity
    const result = await db.query(`
      SELECT 
        id, type, source, title, content, metadata,
        (1 - (embedding::vector <=> $1::vector)) as similarity
      FROM rag_knowledge_base
      WHERE (1 - (embedding::vector <=> $1::vector)) > 0.3
      ORDER BY similarity DESC
      LIMIT $2
    `, [JSON.stringify(queryEmbedding), limit]);
    
    return result.rows;
  } catch (error) {
    console.error('Error searching knowledge base:', error);
    // Fallback to simple text search
    const result = await db.query(`
      SELECT id, type, source, title, content, metadata, 0.5 as similarity
      FROM rag_knowledge_base
      WHERE content ILIKE $1
      ORDER BY created_at DESC
      LIMIT $2
    `, [`%${query}%`, limit]);
    
    return result.rows;
  }
}

export default { indexAllContent, searchKnowledge };
