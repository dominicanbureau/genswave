import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ResourcePage.css';

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < window.innerHeight * 0.5);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="resource-page">
      <Navbar />
      
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
  );
}

export default FAQPage;
