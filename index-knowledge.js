import { indexAllContent } from './utils/ragIndexer.js';
import db from './database.js';

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   🧠 GENSWAVE RAG KNOWLEDGE BASE INDEXER             ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  
  try {
    const count = await indexAllContent();
    
    console.log('');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   ✅ INDEXING COMPLETE!                               ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`📊 Total chunks indexed: ${count}`);
    console.log('');
    console.log('🎉 Your AI assistant now has access to:');
    console.log('  ✓ All website pages and components');
    console.log('  ✓ All API routes and endpoints');
    console.log('  ✓ All documentation files');
    console.log('  ✓ Service descriptions and features');
    console.log('');
    console.log('💡 The AI can now answer questions about:');
    console.log('  • How your website works');
    console.log('  • What services you offer');
    console.log('  • Technical implementation details');
    console.log('  • Pricing and processes');
    console.log('  • Any content from your site');
    console.log('');
    console.log('🚀 Restart your server to activate the RAG system!');
    console.log('');
    
  } catch (error) {
    console.error('');
    console.error('❌ Error during indexing:', error);
    console.error('');
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
