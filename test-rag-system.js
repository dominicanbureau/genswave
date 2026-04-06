import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';

async function testRAGSystem() {
  console.log('🧪 Testing RAG System...\n');

  const testQuestions = [
    {
      question: "¿Cuáles son los servicios que ofrece Genswave?",
      expected: "Should mention multiple services like Plataformas Digitales, E-Commerce, IA, etc."
    },
    {
      question: "¿Cuánto cuesta desarrollar una aplicación?",
      expected: "Should mention price ranges like $5,000 - $50,000+"
    },
    {
      question: "¿Cuál es el proceso de trabajo?",
      expected: "Should mention 4 stages: Descubrimiento, Estrategia y Diseño, Desarrollo, Finalización"
    },
    {
      question: "¿Qué tecnologías usan?",
      expected: "Should mention React, Node.js, Python, PostgreSQL, AWS, etc."
    },
    {
      question: "¿Ofrecen soporte después del lanzamiento?",
      expected: "Should mention 30 días de soporte gratuito"
    }
  ];

  const sessionId = `test_${Date.now()}`;

  for (const test of testQuestions) {
    console.log(`\n📝 Pregunta: ${test.question}`);
    console.log(`✅ Esperado: ${test.expected}\n`);

    try {
      const response = await fetch(`${API_URL}/api/ai-assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: test.question,
          sessionId: sessionId,
          context: { test: true }
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log(`💬 Respuesta del AI:\n${data.response.substring(0, 300)}...\n`);
        console.log('---'.repeat(30));
      } else {
        console.error(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error(`❌ Error en la petición: ${error.message}`);
    }

    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n✅ Test completado!');
}

testRAGSystem().catch(console.error);
