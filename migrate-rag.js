import db from './database.js';

async function migrateRAG() {
  try {
    console.log('🚀 Creating RAG knowledge base table...');

    // Create extension for vector operations (if using pgvector)
    // Note: This requires pgvector extension. If not available, we'll use JSON storage
    try {
      await db.query('CREATE EXTENSION IF NOT EXISTS vector');
      console.log('✅ Vector extension enabled');
    } catch (error) {
      console.log('ℹ️  Vector extension not available, using JSON storage');
    }

    // Create knowledge base table
    await db.query(`
      CREATE TABLE IF NOT EXISTS rag_knowledge_base (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        source TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        embedding TEXT NOT NULL,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(source, title)
      )
    `);

    // Create indexes for better performance
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_rag_type ON rag_knowledge_base(type)
    `);

    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_rag_content_search ON rag_knowledge_base USING gin(to_tsvector('spanish', content))
    `);

    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_rag_created ON rag_knowledge_base(created_at DESC)
    `);

    console.log('✅ RAG knowledge base table created successfully');
    console.log('');
    console.log('📊 Table structure:');
    console.log('  - id: Unique identifier');
    console.log('  - type: Content type (component, api, documentation)');
    console.log('  - source: File path');
    console.log('  - title: Content title');
    console.log('  - content: Actual text content');
    console.log('  - embedding: Vector embedding (JSON)');
    console.log('  - metadata: Additional information');
    console.log('');
    console.log('🎯 Next steps:');
    console.log('  1. Run: node index-knowledge.js');
    console.log('  2. This will index all your website content');
    console.log('  3. The AI will then have access to everything!');

  } catch (error) {
    console.error('❌ Error creating RAG tables:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

migrateRAG();
