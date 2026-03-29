import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ResourcePage.css';

function CasesPage() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < window.innerHeight * 0.5);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cases = [
    {
      id: 1,
      title: 'Trading Collectives DQ',
      client: 'Trading Collectives',
      category: 'Plataforma de Trading',
      description: 'Plataforma completa de trading con sistema de gestión de cuentas, análisis en tiempo real y herramientas avanzadas para traders profesionales.',
      results: [
        'Sistema de gestión de cuentas',
        'Dashboard de análisis en tiempo real',
        'Integración con APIs de trading'
      ],
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      url: 'https://tradingcollectivesdq.com'
    },
    {
      id: 2,
      title: 'Hazzlo',
      client: 'Hazzlo',
      category: 'Plataforma de Servicios',
      description: 'Plataforma digital innovadora que conecta profesionales con clientes, facilitando la contratación de servicios de manera eficiente y segura.',
      results: [
        'Sistema de matching inteligente',
        'Gestión de pagos integrada',
        'Panel de control para profesionales'
      ],
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      url: 'https://hazzlo.com'
    },
    {
      id: 3,
      title: 'Trade Array',
      client: 'Trade Array',
      category: 'Solución Financiera',
      description: 'Sistema avanzado de análisis y gestión de operaciones financieras con herramientas de automatización y reportes detallados para traders institucionales.',
      results: [
        'Automatización de operaciones',
        'Reportes y análisis avanzados',
        'Integración multi-exchange'
      ],
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      url: 'https://tradearray.org'
    }
  ];

  return (
    <div className="resource-page">
      <Navbar />
      
      <section className="resource-hero">
        <motion.div
          className="resource-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>PROYECTOS</h1>
          <p>Proyectos que transformaron negocios y superaron expectativas</p>
        </motion.div>

        {showScrollIndicator && (
          <motion.div
            className="scroll-indicator"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            onClick={() => {
              const casesContent = document.querySelector('.cases-content');
              if (casesContent) {
                window.scrollTo({
                  top: casesContent.offsetTop,
                  behavior: 'smooth'
                });
              }
            }}
          >
            <motion.div
              className="scroll-arrow"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </motion.div>
        )}
      </section>

      <section className="cases-content">
        <div className="container">
          {cases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              className="case-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="case-image" style={{ background: caseItem.gradient }}>
                <div className="case-image-overlay">
                  <div className="case-number">0{caseItem.id}</div>
                </div>
                <span className="case-category">{caseItem.category}</span>
              </div>
              <div className="case-content">
                <h2>{caseItem.title}</h2>
                <p className="case-client">{caseItem.client}</p>
                <p className="case-description">{caseItem.description}</p>
                <div className="case-results">
                  <h3>Características</h3>
                  <ul>
                    {caseItem.results.map((result, idx) => (
                      <li key={idx}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
                <a 
                  href={caseItem.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="case-link"
                >
                  Visitar sitio
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default CasesPage;
