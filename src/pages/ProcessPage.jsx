import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProcessPage.css';

const processSteps = [
  {
    number: '01',
    title: 'Descubrimiento',
    subtitle: 'Entendemos tu visión',
    description: 'Comenzamos con una inmersión profunda en tu negocio, objetivos y desafíos. Realizamos investigación de mercado y análisis competitivo',
    activities: [
      'Reunión inicial y briefing',
      'Investigación de mercado',
      'Análisis de competencia',
      'Definición de objetivos',
      'Identificación de audiencia',
      'Propuesta de valor'
    ],
    deliverables: ['Fecha de Reunion', 'Roadmap inicial', 'Propuesta técnica'],
    duration: '5 Horas'
  },
  {
    number: '02',
    title: 'Estrategia',
    subtitle: 'Planificamos el camino',
    description: 'Diseñamos la arquitectura de información, definimos la experiencia de usuario y creamos un plan detallado que guiará todo el desarrollo del proyecto.',
    activities: [
      'Arquitectura de información',
      'Estrategias de adaptacion',
      'Definición de tecnologías',
      'Planificación de proyecto',
      'Estimación de recursos'
    ],
    deliverables: ['Arquitectura técnica', 'Cronograma detallado'],
    duration: '2 Dias'
  },
  {
    number: '03',
    title: 'Diseño',
    subtitle: 'Creamos la experiencia',
    description: 'Transformamos la estrategia en al palpable. Creamos prototipos interactivos que permiten validar la experiencia antes del desarrollo.',
    activities: [
      'Sistema de creacion',
      'UI mockups de alta calidad',
      'Prototipos interactivos',
      'Ajustes de diseño',
    ],
    deliverables: ['Modelo de demostracion', 'Recomendaciones', 'Detalles finales'],
    duration: '4 Dias'
  },
  {
    number: '05',
    title: 'Finalizacion',
    subtitle: 'Garantizamos la calidad y tomamos lo nuestro',
    description: 'Realizamos pruebas exhaustivas en caso de haber solicitado sitios/apps. Optimizamos y te hacemos entrega',
    activities: [
      'Prueba de funcionalidad',
      'Prueba de rendimiento',
      'Prueba de seguridad',
      'Reajustes de servicio',
      'Pago de cuotas restantes',
      'Proceso de Fidelizacion'
    ],
    deliverables: ['Reporte de resultados', 'Muestra de rendimiento', 'Certificaciones Correspondientes'],
    duration: '4 Dias'
  }
];

function ProcessPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div className="process-page" ref={containerRef}>
      <Navbar />
      
      <HeroSection />
      
      <TimelineSection scrollYProgress={scrollYProgress} />
      
      <MethodologySection />
      
      <CTASection />
      
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="process-hero">
      <motion.div
        className="process-hero-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1>DESCUBRE COMO TRABAJAMOS</h1>
      </motion.div>
    </section>
  );
}

function TimelineSection({ scrollYProgress }) {
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="timeline-section">
      <div className="timeline-container">
        <motion.div 
          className="timeline-line"
          style={{ height: lineHeight }}
        />
        
        {processSteps.map((step, index) => (
          <ProcessStep key={step.number} step={step} index={index} />
        ))}
      </div>
    </section>
  );
}

function ProcessStep({ step, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-150px" });

  return (
    <motion.div
      ref={ref}
      className={`process-step ${index % 2 === 0 ? 'left' : 'right'}`}
      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <motion.div 
        className="step-marker"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.2 }}
      >
        <span>{step.number}</span>
      </motion.div>
      
      <motion.div 
        className="step-card"
        whileHover={{ y: -10, boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)' }}
        transition={{ duration: 0.3 }}
      >
        <div className="step-header">
          <h2>{step.title}</h2>
          <h3>{step.subtitle}</h3>
          <span className="step-duration">{step.duration}</span>
        </div>
        
        <p className="step-description">{step.description}</p>
        
        <div className="step-activities">
          <h4>Actividades clave</h4>
          <div className="activities-grid">
            {step.activities.map((activity, idx) => (
              <motion.div
                key={idx}
                className="activity-item"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <div className="activity-dot" />
                <span>{activity}</span>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="step-deliverables">
          <h4>Entregables</h4>
          <div className="deliverables-list">
            {step.deliverables.map((deliverable, idx) => (
              <motion.span
                key={idx}
                className="deliverable-tag"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.8 + idx * 0.1 }}
                whileHover={{ scale: 1.1, y: -3 }}
              >
                {deliverable}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MethodologySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const methodologies = [
    {
      title: 'Estrategia',
      description: 'Definimos las metas para trabajar con un norte.'
    },
    {
      title: 'Cooperacion',
      description: 'Eres la cabeza de la idea, nosotros le damos vida.'
    },
    {
      title: 'Desarrollo',
      description: 'Integración continua para entregas más rápidas'
    },
    {
      title: 'Flexibilidad',
      description: 'Entregamos tu proyecto y flexibilizamos tus pagos'
    }
  ];

  return (
    <section className="methodology-section" ref={ref}>
      <motion.div
        className="methodology-content"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2>Nuestra metodología</h2>
        <p>Combinamos las mejores prácticas de la industria para entregar resultados excepcionales</p>
        
        <div className="methodology-grid">
          {methodologies.map((method, index) => (
            <motion.div
              key={index}
              className="methodology-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <h3>{method.title}</h3>
              <p>{method.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="process-cta" ref={ref}>
      <motion.div
        className="cta-content"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2>¿Quieres saber más sobre nuestro proceso?</h2>
        <p>Agenda una llamada y te explicaremos cómo podemos adaptar nuestro proceso a tu proyecto</p>
        <motion.a
          href="/contacto"
          className="cta-button"
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          Agendar llamada
        </motion.a>
      </motion.div>
    </section>
  );
}

export default ProcessPage;
