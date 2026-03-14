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
  const getServiceIcon = () => {
    switch (service.id) {
      case 'web':
        return (
          <motion.div 
            className="service-icon-3d web-icon"
            whileHover={{ rotateY: 15, rotateX: 10 }}
            transition={{ duration: 0.4 }}
          >
            <svg viewBox="0 0 200 200" className="icon-3d">
              <defs>
                <linearGradient id="webGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#000000" />
                  <stop offset="100%" stopColor="#333333" />
                </linearGradient>
                <filter id="shadow">
                  <feDropShadow dx="4" dy="8" stdDeviation="4" floodOpacity="0.3"/>
                </filter>
              </defs>
              
              {/* Monitor Base */}
              <rect x="20" y="140" width="160" height="8" fill="url(#webGradient)" rx="4" filter="url(#shadow)" />
              <rect x="80" y="148" width="40" height="20" fill="url(#webGradient)" rx="2" />
              
              {/* Monitor Screen */}
              <rect x="30" y="40" width="140" height="100" fill="url(#webGradient)" rx="8" filter="url(#shadow)" />
              <rect x="40" y="50" width="120" height="80" fill="#f5f5f7" rx="4" />
              
              {/* Browser Elements */}
              <circle cx="50" cy="60" r="3" fill="#ff5f57" />
              <circle cx="62" cy="60" r="3" fill="#ffbd2e" />
              <circle cx="74" cy="60" r="3" fill="#28ca42" />
              
              {/* Content Lines */}
              <rect x="50" y="75" width="80" height="3" fill="#000000" opacity="0.2" rx="1.5" />
              <rect x="50" y="85" width="100" height="3" fill="#000000" opacity="0.2" rx="1.5" />
              <rect x="50" y="95" width="60" height="3" fill="#000000" opacity="0.2" rx="1.5" />
              
              {/* Code Brackets */}
              <text x="50" y="115" fontSize="20" fill="#000000" opacity="0.3" fontFamily="monospace">{"<>"}</text>
              <text x="120" y="115" fontSize="20" fill="#000000" opacity="0.3" fontFamily="monospace">{"</>"}</text>
            </svg>
          </motion.div>
        );
        
      case 'app':
        return (
          <motion.div 
            className="service-icon-3d app-icon"
            whileHover={{ rotateY: -15, rotateX: 10 }}
            transition={{ duration: 0.4 }}
          >
            <svg viewBox="0 0 200 200" className="icon-3d">
              <defs>
                <linearGradient id="appGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1d1d1f" />
                  <stop offset="100%" stopColor="#000000" />
                </linearGradient>
                <filter id="phoneShadow">
                  <feDropShadow dx="6" dy="12" stdDeviation="6" floodOpacity="0.4"/>
                </filter>
              </defs>
              
              {/* Phone Body */}
              <rect x="60" y="20" width="80" height="160" fill="url(#appGradient)" rx="20" filter="url(#phoneShadow)" />
              <rect x="65" y="25" width="70" height="150" fill="#000000" rx="15" />
              
              {/* Screen */}
              <rect x="70" y="40" width="60" height="120" fill="#f5f5f7" rx="8" />
              
              {/* Notch */}
              <rect x="90" y="30" width="20" height="4" fill="#000000" rx="2" />
              
              {/* App Icons Grid */}
              <rect x="75" y="50" width="12" height="12" fill="#007AFF" rx="3" />
              <rect x="92" y="50" width="12" height="12" fill="#FF3B30" rx="3" />
              <rect x="109" y="50" width="12" height="12" fill="#34C759" rx="3" />
              
              <rect x="75" y="67" width="12" height="12" fill="#FF9500" rx="3" />
              <rect x="92" y="67" width="12" height="12" fill="#AF52DE" rx="3" />
              <rect x="109" y="67" width="12" height="12" fill="#FF2D92" rx="3" />
              
              <rect x="75" y="84" width="12" height="12" fill="#5AC8FA" rx="3" />
              <rect x="92" y="84" width="12" height="12" fill="#FFCC00" rx="3" />
              <rect x="109" y="84" width="12" height="12" fill="#32D74B" rx="3" />
              
              {/* Bottom Navigation */}
              <rect x="75" y="140" width="50" height="2" fill="#000000" opacity="0.3" rx="1" />
              
              {/* Home Indicator */}
              <rect x="90" y="165" width="20" height="3" fill="#ffffff" opacity="0.6" rx="1.5" />
            </svg>
          </motion.div>
        );
        
      case 'custom':
        return (
          <motion.div 
            className="service-icon-3d custom-icon"
            whileHover={{ rotateY: 10, rotateX: -10 }}
            transition={{ duration: 0.4 }}
          >
            <svg viewBox="0 0 200 200" className="icon-3d">
              <defs>
                <linearGradient id="customGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2d2d2f" />
                  <stop offset="100%" stopColor="#000000" />
                </linearGradient>
                <filter id="customShadow">
                  <feDropShadow dx="5" dy="10" stdDeviation="5" floodOpacity="0.35"/>
                </filter>
              </defs>
              
              {/* Main Gear */}
              <circle cx="100" cy="100" r="40" fill="url(#customGradient)" filter="url(#customShadow)" />
              <circle cx="100" cy="100" r="25" fill="none" stroke="#f5f5f7" strokeWidth="2" />
              <circle cx="100" cy="100" r="8" fill="#f5f5f7" />
              
              {/* Gear Teeth */}
              {[...Array(8)].map((_, i) => {
                const angle = (i * 45) * Math.PI / 180;
                const x1 = 100 + Math.cos(angle) * 35;
                const y1 = 100 + Math.sin(angle) * 35;
                const x2 = 100 + Math.cos(angle) * 45;
                const y2 = 100 + Math.sin(angle) * 45;
                return (
                  <rect
                    key={i}
                    x={x2 - 3}
                    y={y2 - 3}
                    width="6"
                    height="6"
                    fill="url(#customGradient)"
                    transform={`rotate(${i * 45} ${x2} ${y2})`}
                  />
                );
              })}
              
              {/* Secondary Gear */}
              <circle cx="140" cy="70" r="25" fill="url(#customGradient)" opacity="0.8" filter="url(#customShadow)" />
              <circle cx="140" cy="70" r="15" fill="none" stroke="#f5f5f7" strokeWidth="1.5" />
              <circle cx="140" cy="70" r="5" fill="#f5f5f7" />
              
              {/* Small Gear Teeth */}
              {[...Array(6)].map((_, i) => {
                const angle = (i * 60) * Math.PI / 180;
                const x2 = 140 + Math.cos(angle) * 28;
                const y2 = 70 + Math.sin(angle) * 28;
                return (
                  <rect
                    key={i}
                    x={x2 - 2}
                    y={y2 - 2}
                    width="4"
                    height="4"
                    fill="url(#customGradient)"
                    transform={`rotate(${i * 60} ${x2} ${y2})`}
                  />
                );
              })}
              
              {/* Third Gear */}
              <circle cx="60" cy="130" r="20" fill="url(#customGradient)" opacity="0.7" filter="url(#customShadow)" />
              <circle cx="60" cy="130" r="12" fill="none" stroke="#f5f5f7" strokeWidth="1" />
              <circle cx="60" cy="130" r="4" fill="#f5f5f7" />
              
              {/* Connecting Lines */}
              <line x1="75" y1="115" x2="125" y2="85" stroke="#f5f5f7" strokeWidth="1" opacity="0.4" strokeDasharray="2,2" />
              <line x1="125" y1="115" x2="125" y2="85" stroke="#f5f5f7" strokeWidth="1" opacity="0.4" strokeDasharray="2,2" />
            </svg>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="visual-container-3d"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="icon-wrapper"
        animate={{
          rotateY: [0, 5, 0],
          rotateX: [0, 3, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {getServiceIcon()}
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
