import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './ServicesPage.css';

const services = [
  {
    id: 'web',
    number: '01',
    title: 'Desarrollo Web',
    subtitle: 'Sitios que convierten visitantes en clientes',
    description: 'Creamos experiencias web modernas y optimizadas que no solo se ven increíbles, sino que generan resultados medibles para tu negocio.',
    features: [
      'Diseño responsivo y adaptativo',
      'Optimización SEO avanzada',
      'Velocidad de carga optimizada',
      'Integración con analíticas',
      'Seguridad empresarial',
      'Mantenimiento continuo'
    ],
    technologies: ['React', 'Next.js', 'Tailwind', 'Node.js']
  },
  {
    id: 'mobile',
    number: '02',
    title: 'Aplicaciones Móviles',
    subtitle: 'Apps nativas con experiencia excepcional',
    description: 'Desarrollamos aplicaciones iOS y Android con interfaces intuitivas y rendimiento óptimo que tus usuarios amarán.',
    features: [
      'Desarrollo iOS y Android',
      'UI/UX centrado en el usuario',
      'Integración de APIs',
      'Notificaciones push',
      'Pagos in-app',
      'Analíticas y métricas'
    ],
    technologies: ['React Native', 'Swift', 'Kotlin', 'Firebase']
  },
  {
    id: 'ecommerce',
    number: '03',
    title: 'E-Commerce',
    subtitle: 'Tiendas digitales que impulsan ventas',
    description: 'Plataformas de comercio electrónico completas con sistemas de pago seguros y gestión avanzada de inventario.',
    features: [
      'Catálogo de productos',
      'Carrito y checkout',
      'Pasarelas de pago',
      'Gestión de inventario',
      'Panel de administración',
      'Marketing integrado'
    ],
    technologies: ['Shopify', 'WooCommerce', 'Stripe', 'PayPal']
  },
  {
    id: 'custom',
    number: '04',
    title: 'Soluciones Personalizadas',
    subtitle: 'Tecnología adaptada a tu visión',
    description: 'Desarrollamos soluciones a medida que se ajustan perfectamente a los desafíos únicos de tu negocio.',
    features: [
      'Análisis de requerimientos',
      'Arquitectura escalable',
      'Integración de sistemas',
      'Automatización de procesos',
      'Dashboards personalizados',
      'APIs y microservicios'
    ],
    technologies: ['Python', 'Node.js', 'PostgreSQL', 'AWS']
  },
  {
    id: 'automation',
    number: '05',
    title: 'Automatización e IA',
    subtitle: 'Inteligencia artificial al servicio de tu negocio',
    description: 'Implementamos soluciones de automatización inteligente que optimizan procesos, mejoran la atención al cliente y aumentan la eficiencia operativa.',
    features: [
      'Chatbots con IA',
      'Automatización de redes sociales',
      'Soporte automatizado 24/7',
      'Procesamiento de lenguaje natural',
      'Integración con sistemas',
      'Análisis predictivo'
    ],
    technologies: ['OpenAI', 'ChatGPT', 'Dialogflow', 'Python']
  },
  {
    id: 'consulting',
    number: '06',
    title: 'Consultoría Digital',
    subtitle: 'Estrategia para transformación digital',
    description: 'Acompañamiento experto en cada etapa de tu evolución digital con estrategia, implementación y optimización.',
    features: [
      'Auditoría tecnológica',
      'Estrategia digital',
      'Optimización de procesos',
      'Capacitación de equipos',
      'Roadmap tecnológico',
      'Soporte continuo'
    ],
    technologies: ['Agile', 'Scrum', 'DevOps', 'Best Practices']
  }
];

function ServicesPage() {
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

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <div className="services-page">
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
              <Link to="/servicios" className="nav-link active">
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
        
        <HeroSection />
        
        <ServicesGrid />
        
        <CTASection />
        
        <Footer />
      </div>
    </div>
  );
}

function HeroSection() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < window.innerHeight * 0.5);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="services-hero">
      <motion.div
        className="services-hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <motion.span 
          className="hero-label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          NUESTROS SERVICIOS
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Soluciones Digitales<br />Para cada necesidad
        </motion.h1>
        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Combinamos diseño excepcional con tecnología de vanguardia<br />
          para crear experiencias que impulsan tu negocio
        </motion.p>
      </motion.div>

      {showScrollIndicator && (
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          onClick={() => {
            const servicesGrid = document.querySelector('.services-grid-section');
            if (servicesGrid) {
              window.scrollTo({
                top: servicesGrid.offsetTop,
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
  );
}

function ServicesGrid() {
  return (
    <section className="services-grid-section">
      <div className="services-grid">
        {services.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ service, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="service-card"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <div className="service-card-header">
        <span className="service-number">{service.number}</span>
        <h2>{service.title}</h2>
        <h3>{service.subtitle}</h3>
      </div>

      <p className="service-description">{service.description}</p>

      <div className="service-features">
        <h4>Características</h4>
        <ul>
          {service.features.map((feature, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.05 }}
            >
              <span className="feature-dot"></span>
              {feature}
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="service-tech">
        <h4>Tecnologías</h4>
        <div className="tech-tags">
          {service.technologies.map((tech, idx) => (
            <motion.span
              key={idx}
              className="tech-tag"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + idx * 0.08 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
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
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          ¿No encuentras lo<br />que buscas?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Cuéntanos sobre tu proyecto y crearemos una<br />
          solución personalizada que se ajuste a tus necesidades
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link to="/contacto" className="cta-button">
            Hablar con un experto
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default ServicesPage;
