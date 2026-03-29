import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './ResourcePage.css';

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollIndicator(window.scrollY < window.innerHeight * 0.5);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const faqs = [
    {
      question: '¿Cuánto tiempo toma desarrollar un proyecto?',
      answer: 'El tiempo de desarrollo varía según la complejidad del proyecto. Un sitio web básico puede tomar 2-4 semanas, mientras que aplicaciones más complejas pueden requerir 2-6 meses. Proporcionamos un cronograma detallado en la propuesta inicial.'
    },
    {
      question: '¿Cuál es el costo de sus servicios?',
      answer: 'Nuestros precios varían según el alcance y complejidad del proyecto. Ofrecemos presupuestos personalizados después de una consulta inicial gratuita. Los proyectos típicamente comienzan desde $5,000 para sitios web básicos hasta $50,000+ para soluciones empresariales complejas.'
    },
    {
      question: '¿Ofrecen mantenimiento después del lanzamiento?',
      answer: 'Sí, ofrecemos planes de mantenimiento mensuales que incluyen actualizaciones de seguridad, corrección de errores, actualizaciones de contenido y soporte técnico. También proporcionamos 30 días de soporte gratuito después del lanzamiento.'
    },
    {
      question: '¿Trabajan con clientes internacionales?',
      answer: 'Absolutamente. Trabajamos con clientes de todo el mundo. Utilizamos herramientas de comunicación modernas y tenemos experiencia en gestión de proyectos remotos para asegurar una colaboración fluida sin importar la ubicación.'
    },
    {
      question: '¿Qué tecnologías utilizan?',
      answer: 'Utilizamos tecnologías modernas y probadas como React, Node.js, Python, y bases de datos como PostgreSQL y MongoDB. Seleccionamos la stack tecnológica más apropiada para cada proyecto según sus necesidades específicas.'
    },
    {
      question: '¿Puedo ver ejemplos de su trabajo anterior?',
      answer: 'Por supuesto. Puede ver nuestros casos de éxito en la sección correspondiente. También podemos proporcionar referencias de clientes anteriores y demos de proyectos similares durante la consulta inicial.'
    },
    {
      question: '¿Cómo es el proceso de pago?',
      answer: 'Generalmente requerimos un depósito del 50% para comenzar el proyecto, con el 50% restante al completar. Para proyectos más grandes, podemos establecer hitos de pago. Aceptamos transferencias bancarias, tarjetas de crédito y PayPal.'
    },
    {
      question: '¿Qué pasa si no estoy satisfecho con el resultado?',
      answer: 'Su satisfacción es nuestra prioridad. Incluimos revisiones en cada fase del proyecto y trabajamos estrechamente con usted para asegurar que el resultado final cumpla con sus expectativas. Si hay problemas, los resolveremos sin costo adicional dentro del alcance acordado.'
    },
    {
      question: '¿Proporcionan capacitación para usar el sistema?',
      answer: 'Sí, incluimos sesiones de capacitación para su equipo y documentación completa. También ofrecemos videos tutoriales y soporte continuo para asegurar que pueda usar efectivamente la solución desarrollada.'
    },
    {
      question: '¿Puedo solicitar cambios después del lanzamiento?',
      answer: 'Sí, puede solicitar cambios y mejoras en cualquier momento. Los cambios menores dentro del primer mes suelen estar cubiertos. Para cambios mayores o nuevas funcionalidades, proporcionamos presupuestos adicionales.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <div className="resource-page">
        <nav className={`main-navbar ${scrolled ? 'scrolled' : ''}`}>
          <div className="navbar-container">
            <Link to="/" className="navbar-logo">
              <img src="/genswave.png" alt="Genswave" className="navbar-logo-image" />
            </Link>

            <div className="navbar-center">
              <Link to="/proceso" className="nav-link">
                <span className="link-text">Proceso</span>
                <span className="link-indicator"></span>
              </Link>
              <Link to="/servicios" className="nav-link">
                <span className="link-text">Servicios</span>
                <span className="link-indicator"></span>
              </Link>
              <Link to="/contacto" className="nav-link">
                <span className="link-text">Contactar</span>
                <span className="link-indicator"></span>
              </Link>
            </div>

            <div className="navbar-actions">
              <div className="icon-trio">
                <Link to="/contacto" className="icon-btn icon-left" aria-label="Contacto">
                  <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                
                <button onClick={toggleTheme} className="icon-btn icon-center" aria-label="Toggle theme">
                  <svg className="icon" width="18" height="18" viewBox="0 0 20 20" fill="none">
                    {isDarkMode ? (
                      <path d="M10 2V4M10 16V18M4 10H2M18 10H16M15.657 4.343L14.243 5.757M5.757 14.243L4.343 15.657M15.657 15.657L14.243 14.243M5.757 5.757L4.343 4.343M13 10C13 11.657 11.657 13 10 13C8.343 13 7 11.657 7 10C7 8.343 8.343 7 10 7C11.657 7 13 8.343 13 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    ) : (
                      <path d="M17 10C17 13.866 13.866 17 10 17C6.134 17 3 13.866 3 10C3 6.134 6.134 3 10 3C10.395 3 10.782 3.034 11.158 3.099C9.838 4.034 9 5.415 9 7C9 9.761 11.239 12 14 12C15.585 12 16.966 11.162 17.901 9.842C17.966 10.218 18 10.605 18 11C18 10.667 17.667 10.333 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                  </svg>
                </button>

                <Link to="/login" className="icon-btn icon-right" aria-label="Login">
                  <svg className="icon" width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M10 11C12.2091 11 14 9.20914 14 7C14 4.79086 12.2091 3 10 3C7.79086 3 6 4.79086 6 7C6 9.20914 7.79086 11 10 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>

              <button className="hamburger" onClick={toggleMobileMenu} aria-label="Menu">
                <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
                <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
                <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
              </button>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
              <div className="mobile-menu-header">
                <img src="/genswave.png" alt="Genswave" className="mobile-menu-logo" />
              </div>
              
              <nav className="mobile-menu-nav">
                <Link to="/proceso" className="mobile-menu-link" onClick={toggleMobileMenu}>Proceso</Link>
                <Link to="/servicios" className="mobile-menu-link" onClick={toggleMobileMenu}>Servicios</Link>
                <Link to="/contacto" className="mobile-menu-link" onClick={toggleMobileMenu}>Contactar</Link>
              </nav>

              <div className="mobile-menu-footer">
                <div className="mobile-menu-contact">
                  <a href="mailto:info@genswave.org">info@genswave.org</a>
                  <span className="mobile-menu-location">Distrito Nacional, Santo Domingo</span>
                </div>
                <div className="mobile-menu-social">
                  <a href="https://instagram.com/genswave" target="_blank" rel="noopener noreferrer" className="mobile-social-icon" aria-label="Instagram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </a>
                  <a href="#" className="mobile-social-icon" aria-label="Dribbble">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.5m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
                    </svg>
                  </a>
                  <a href="#" className="mobile-social-icon" aria-label="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  </a>
                </div>
                <Link to="/login" className="mobile-menu-login-btn" onClick={toggleMobileMenu}>
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
        </nav>
      
        <section className="resource-hero">
        <motion.div
          className="resource-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>PREGUNTAS FRECUENTES</h1>
          <p>Respuestas a las preguntas más comunes sobre nuestros servicios</p>
        </motion.div>

        {showScrollIndicator && (
          <motion.div
            className="scroll-indicator"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            onClick={() => {
              const faqContent = document.querySelector('.faq-content');
              if (faqContent) {
                window.scrollTo({
                  top: faqContent.offsetTop,
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

      <section className="faq-content">
        <div className="container">
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className={`faq-item ${openIndex === index ? 'open' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <motion.svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      className="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="faq-cta"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>¿No encontraste tu respuesta?</h2>
            <p>Contáctanos y estaremos encantados de ayudarte</p>
            <motion.a
              href="/contacto"
              className="cta-button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Contactar Soporte
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
    </div>
  );
}

export default FAQPage;
