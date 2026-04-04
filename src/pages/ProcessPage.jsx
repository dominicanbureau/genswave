import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './ProcessPage.css';

const processSteps = [
  {
    number: '01',
    title: 'Descubrimiento',
    subtitle: 'Entendemos tu visión',
    description: 'Analizamos tu negocio y objetivos para establecer bases sólidas.',
    activities: [
      'Reunión inicial',
      'Investigación de mercado',
      'Análisis de competencia'
    ]
  },
  {
    number: '02',
    title: 'Estrategia',
    subtitle: 'Planificamos el camino',
    description: 'Diseñamos la arquitectura y creamos un plan detallado del proyecto.',
    activities: [
      'Arquitectura de información',
      'Definición de tecnologías',
      'Planificación de proyecto'
    ]
  },
  {
    number: '03',
    title: 'Diseño',
    subtitle: 'Creamos la experiencia',
    description: 'Transformamos la estrategia en prototipos interactivos.',
    activities: [
      'Sistema de diseño',
      'UI mockups',
      'Prototipos interactivos'
    ]
  },
  {
    number: '04',
    title: 'Finalización',
    subtitle: 'Garantizamos la calidad',
    description: 'Realizamos pruebas exhaustivas y entregamos el proyecto completo.',
    activities: [
      'Pruebas de funcionalidad',
      'Optimización',
      'Entrega final'
    ]
  }
];

function ProcessPage() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <div className="process-page" ref={containerRef}>
        <nav className={`main-navbar ${scrolled ? 'scrolled' : ''}`}>
          <div className="navbar-container">
            <Link to="/" className="navbar-logo">
              <img src="/genswave.png" alt="Genswave" className="navbar-logo-image" />
            </Link>

            <div className="navbar-center">
              <Link to="/proceso" className="nav-link active">
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
                  <a href="mailto:support@genswave.org" className="mobile-social-icon" aria-label="Email">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
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
        
        <TimelineSection scrollYProgress={scrollYProgress} />
        
        <MethodologySection />
        
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
    <section className="process-hero">
      <motion.div
        className="process-hero-content"
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
          NUESTRO PROCESO
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          De la idea a<br />hacerlo realidad
        </motion.h1>
        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Un enfoque estructurado y transparente que transforma<br />
          tu visión en experiencias digitales excepcionales
        </motion.p>
      </motion.div>

      {showScrollIndicator && (
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          onClick={() => {
            const timelineSection = document.querySelector('.timeline-section');
            if (timelineSection) {
              window.scrollTo({
                top: timelineSection.offsetTop,
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

function TimelineSection({ scrollYProgress }) {
  return (
    <section className="timeline-section">
      <div className="timeline-container">
        <div className="timeline-header">
          <h2>Nuestro Proceso</h2>
          <p>De la idea a la realidad en 4 pasos estructurados</p>
        </div>
        
        <div className="process-timeline">
          <div className="timeline-line">
            <motion.div 
              className="timeline-progress"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
          
          <div className="timeline-steps">
            {processSteps.map((step, index) => (
              <ProcessTimelineStep key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessTimelineStep({ step, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="timeline-step"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      <motion.div 
        className="step-marker"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.2 + 0.3, type: "spring" }}
      >
        <span className="step-number">{step.number}</span>
      </motion.div>
      
      <div className="step-content">
        <h3 className="step-title">{step.title}</h3>
        <p className="step-subtitle">{step.subtitle}</p>
        
        <div className="step-details">
          <div className="step-description">
            {step.description}
          </div>
          
          <div className="activities-list">
            {step.activities.map((activity, idx) => (
              <span key={idx} className="activity-item">
                {activity}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MethodologySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const methodologies = [
    {
      title: 'Estrategia',
      description: 'Definimos las metas para trabajar con un norte claro y objetivos medibles.'
    },
    {
      title: 'Cooperación',
      description: 'Eres la cabeza de la idea, nosotros le damos vida con nuestra experiencia.'
    },
    {
      title: 'Desarrollo',
      description: 'Integración continua y entregas incrementales para resultados más rápidos.'
    },
    {
      title: 'Flexibilidad',
      description: 'Entregamos tu proyecto y flexibilizamos tus pagos según tus necesidades.'
    }
  ];

  return (
    <section className="methodology-section" ref={ref}>
      <motion.div
        className="methodology-content"
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <motion.span 
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          METODOLOGÍA
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Principios que guían<br />nuestro trabajo
        </motion.h2>
        
        <div className="methodology-grid">
          {methodologies.map((method, index) => (
            <motion.div
              key={index}
              className="methodology-card"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <span className="method-number">0{index + 1}</span>
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
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          ¿Listo para comenzar<br />tu proyecto?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Agenda una llamada y te explicaremos cómo podemos<br />
          adaptar nuestro proceso a tus necesidades específicas
        </motion.p>
        <motion.div
          className="cta-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link to="/contacto" className="cta-button primary">
            Agendar llamada
          </Link>
          <Link to="/servicios" className="cta-button secondary">
            Ver Servicios
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default ProcessPage;
