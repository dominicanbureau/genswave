import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ServicesPage.css';

const services = [
  {
    id: 'web',
    title: 'Páginas Web',
    subtitle: 'Experiencias digitales que convierten',
    description: 'Diseñamos y desarrollamos sitios web que no solo llaman la atencion, sino que generan resultados reales para tu negocio.',
    features: [
      'Diseño responsivo y adaptativo',
      'Optimización SEO avanzada',
      'Velocidad de carga optimizada',
      'Integración con analiticas',
      'Seguridad contra ataques',
      'Mantenimiento continuo'
    ],
    technologies: ['React', 'HTML/CSS/JS', 'Tailwind'],
    color: '#000000'
  },
  {
    id: 'app',
    title: 'Aplicaciones Móviles',
    subtitle: 'Apps comodas para tus clientes',
    description: 'Creamos aplicaciones móviles con interfaces intuitivas y rendimiento excepcional para tus servicios.',
    features: [
      'Desarrollo iOS y Android',
      'UI/UX centrado en el usuario',
      'Integraciónes importantes',
      'Notificaciones y Campañas',
      'Cumplimientos Regulatorios'
    ],
    technologies: ['React Native', 'iOS', 'Android', 'Kotlin'],
    color: '#1d1d1f'
  },
  {
    id: 'custom',
    title: 'Soluciones a Medida',
    subtitle: 'Planes adaptados a tu visión',
    description: 'Desarrollamos soluciones personalizadas que se ajustan perfectamente a los desafíos únicos de tu negocio.',
    features: [
      'Análisis de escalabilidad',
      'Mejoras Organizacionales',
      'Integración de sistemas',
      'Gestion de clientes',
      'SaaS Personalizados',
      'Automatización de procesos'
    ],
    technologies: ['Menus', 'Dashboards', 'BigData', 'Publicidad'],
    color: '#2d2d2f'
  }
];

function ServicesPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div className="services-page" ref={containerRef}>
      <Navbar />
      
      <HeroSection scrollYProgress={scrollYProgress} />
      
      {services.map((service, index) => (
        <ServiceSection key={service.id} service={service} index={index} />
      ))}
      
      <CTASection />
      
      <Footer />
    </div>
  );
}

function HeroSection({ scrollYProgress }) {
  const y = useTransform(scrollYProgress, [0, 0.2], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const scrollToFirstService = () => {
    const firstService = document.querySelector('.service-section');
    if (firstService) {
      firstService.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="services-hero">
      <motion.div className="services-hero-content" style={{ y, opacity }}>
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          TRANSFORMANDO IDEAS
          <br />
          EN REALIDADES
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Combinamos diseño excepcional con tecnología de vanguardia para crear
          experiencias digitales que impulsan tu negocio hacia el futuro
        </motion.p>

        <motion.div 
          className="discover-button-container"
          onClick={scrollToFirstService}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button className="discover-button">
            <span className="actual-text">&nbsp;DESCUBRIR&nbsp;</span>
            <span aria-hidden="true" className="hover-text">&nbsp;DESCUBRIR&nbsp;</span>
          </button>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="scroll-indicator-bottom"
        onClick={scrollToFirstService}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </motion.svg>
      </motion.div>
      
      <div className="floating-shapes">
        <FloatingShape delay={0} />
        <FloatingShape delay={2} />
        <FloatingShape delay={4} />
      </div>
    </section>
  );
}

function FloatingShape({ delay }) {
  return (
    <motion.div
      className="floating-shape"
      animate={{
        y: [0, -40, 0],
        rotate: [0, 180, 360],
        scale: [1, 1.2, 1]
      }}
      transition={{
        duration: 20,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

function ServiceSection({ service, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <section className={`service-section ${index % 2 === 0 ? 'dark' : 'light'}`} ref={ref}>
      <div className="service-container">
        <motion.div
          className="service-content"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            className="service-number"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            0{index + 1}
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {service.title}
          </motion.h2>
          
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {service.subtitle}
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {service.description}
          </motion.p>
          
          <motion.div 
            className="service-features"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {service.features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="feature-item"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.7 + idx * 0.1 }}
                onHoverStart={() => setHoveredFeature(idx)}
                onHoverEnd={() => setHoveredFeature(null)}
                whileHover={{ x: 10 }}
              >
                <motion.div 
                  className="feature-dot"
                  animate={{
                    scale: hoveredFeature === idx ? 1.5 : 1,
                    backgroundColor: hoveredFeature === idx ? service.color : '#86868b'
                  }}
                />
                <span>{feature}</span>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="service-tech"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <span className="tech-label">Tecnologías:</span>
            <div className="tech-tags">
              {service.technologies.map((tech, idx) => (
                <motion.span
                  key={idx}
                  className="tech-tag"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 1.1 + idx * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div
          className="service-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <ServiceVisual service={service} />
        </motion.div>
      </div>
    </section>
  );
}

function ServiceVisual({ service }) {
  return (
    <motion.div 
      className="visual-container"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="visual-card"
        animate={{
          rotateY: [0, 5, 0],
          rotateX: [0, 5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="visual-gradient" style={{ background: `linear-gradient(135deg, ${service.color}, #86868b)` }} />
        <div className="visual-grid">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="grid-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="services-cta" ref={ref}>
      <motion.div
        className="cta-content"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2>¿Listo para comenzar tu proyecto?</h2>
        <p>Hablemos sobre cómo podemos ayudarte a alcanzar tus objetivos</p>
        <motion.a
          href="/contacto"
          className="cta-button"
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          Iniciar conversación
        </motion.a>
      </motion.div>
    </section>
  );
}

export default ServicesPage;
