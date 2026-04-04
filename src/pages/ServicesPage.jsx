import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './ServicesPage.css';

const services = [
  {
    id: 'plataformas-digitales',
    number: '01',
    title: 'Plataformas Digitales',
    subtitle: 'Sistemas empresariales completos',
    description: 'Plataformas robustas para gestionar todos los aspectos de tu negocio con tecnología de vanguardia.',
    features: [
      'Sistemas de registro y autenticación',
      'Bases de datos optimizadas',
      'Control de ventas en tiempo real',
      'Gestión de compras e inventario',
      'Reportes y analytics avanzados',
      'Panel de administración completo'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS']
  },
  {
    id: 'gestion-proyectos',
    number: '02',
    title: 'Gestión de Proyectos',
    subtitle: 'Asesoría integral para lanzar tu idea',
    description: 'Te acompañamos desde la conceptualización hasta el lanzamiento exitoso de tu proyecto digital.',
    features: [
      'Análisis y validación de ideas',
      'Planificación estratégica',
      'Roadmap de desarrollo',
      'Asesoría en modelo de negocio',
      'Gestión de recursos y timeline',
      'Acompañamiento en el lanzamiento'
    ],
    technologies: ['Metodologías Ágiles', 'Lean Startup', 'Design Thinking', 'Project Management']
  },
  {
    id: 'automatizacion-ia',
    number: '03',
    title: 'Automatización e IA',
    subtitle: 'Inteligencia artificial aplicada',
    description: 'Automatiza procesos y mejora la eficiencia con IA avanzada que transforma tu operación.',
    features: [
      'Chatbots inteligentes 24/7',
      'Automatización de redes sociales',
      'Análisis predictivo de datos',
      'Procesamiento de lenguaje natural',
      'Automatización de workflows',
      'Asistentes virtuales personalizados'
    ],
    technologies: ['OpenAI', 'ChatGPT', 'Python', 'TensorFlow']
  },
  {
    id: 'comercio-electronico',
    number: '04',
    title: 'Comercio Electrónico',
    subtitle: 'Tiendas online profesionales',
    description: 'Soluciones completas para vender online con todas las funcionalidades que tu negocio necesita.',
    features: [
      'Pasarelas de pago múltiples',
      'Sistema de estados de envío',
      'Gestión de productos y categorías',
      'Carrito de compras inteligente',
      'Sistema de cupones y descuentos',
      'Integración con logística'
    ],
    technologies: ['Shopify', 'WooCommerce', 'Stripe', 'PayPal']
  },
  {
    id: 'marketing-digital',
    number: '05',
    title: 'Marketing Digital',
    subtitle: 'Estrategias de crecimiento',
    description: 'Impulsa tu marca con campañas digitales efectivas y estrategias de marketing data-driven.',
    features: [
      'Campañas en redes sociales',
      'Email marketing automatizado',
      'SEO y posicionamiento web',
      'Publicidad programática',
      'Marketing de contenidos',
      'Analytics y métricas ROI'
    ],
    technologies: ['Google Ads', 'Facebook Ads', 'Mailchimp', 'HubSpot']
  },
  {
    id: 'gestion-empleados',
    number: '06',
    title: 'Gestión de Empleados',
    subtitle: 'RRHH digitalizado',
    description: 'Sistemas completos para administrar tu equipo de trabajo y optimizar recursos humanos.',
    features: [
      'Control de asistencia biométrico',
      'Gestión de nóminas',
      'Evaluaciones de desempeño',
      'Portal del empleado',
      'Gestión de vacaciones',
      'Capacitación y desarrollo'
    ],
    technologies: ['SAP', 'Workday', 'BambooHR', 'ADP']
  },
  {
    id: 'social-media-tools',
    number: '07',
    title: 'Social Media Tools',
    subtitle: 'Gestión de redes sociales',
    description: 'Herramientas avanzadas para gestionar presencia digital y maximizar engagement.',
    features: [
      'Programación de contenido',
      'Análisis de engagement',
      'Gestión de comunidades',
      'Influencer marketing',
      'Social listening',
      'Reportes de ROI social'
    ],
    technologies: ['Hootsuite', 'Buffer', 'Sprout Social', 'APIs Sociales']
  },
  {
    id: 'logistica-tracking',
    number: '08',
    title: 'Logística y Tracking',
    subtitle: 'Seguimiento en tiempo real',
    description: 'Optimiza la cadena de suministro con tecnología avanzada de rastreo y gestión logística.',
    features: [
      'Rastreo GPS en tiempo real',
      'Optimización de rutas',
      'Gestión de almacenes',
      'Control de inventarios',
      'Predicción de demanda',
      'Integración con transportistas'
    ],
    technologies: ['GPS', 'RFID', 'IoT', 'Machine Learning']
  },
  {
    id: 'suscripciones-membresias',
    number: '09',
    title: 'Suscripciones y Membresías',
    subtitle: 'Gestión de ingresos recurrentes',
    description: 'Administra y cobra membresías de forma automatizada con sistemas de gestión avanzados.',
    features: [
      'Cobros automáticos recurrentes',
      'Gestión de niveles de membresía',
      'Portal del cliente personalizado',
      'Análisis de retención',
      'Sistema de beneficios exclusivos',
      'Integración con CRM'
    ],
    technologies: ['Stripe', 'PayPal', 'Recurly', 'Chargebee']
  },
  {
    id: 'salud-digital',
    number: '10',
    title: 'Salud Digital',
    subtitle: 'Telemedicina y wellness',
    description: 'Plataformas de salud digital y telemedicina para modernizar la atención médica.',
    features: [
      'Consultas médicas virtuales',
      'Historiales clínicos digitales',
      'Recordatorios de medicamentos',
      'Monitoreo de signos vitales',
      'Agenda médica inteligente',
      'Integración con wearables'
    ],
    technologies: ['HL7', 'FHIR', 'Telemedicine APIs', 'IoT Health']
  },
  {
    id: 'inmobiliaria-tech',
    number: '11',
    title: 'InmobiliariaTech',
    subtitle: 'PropTech avanzado',
    description: 'Tecnología para el sector inmobiliario que revoluciona la compra, venta y gestión de propiedades.',
    features: [
      'Tours virtuales 360°',
      'CRM inmobiliario especializado',
      'Valuaciones automatizadas',
      'Gestión de propiedades',
      'Matching inteligente',
      'Documentación digital'
    ],
    technologies: ['VR/AR', 'AI Valuation', 'CRM', 'Blockchain']
  },
  {
    id: 'eventos-digitales',
    number: '12',
    title: 'Eventos Digitales',
    subtitle: 'Experiencias virtuales',
    description: 'Plataformas para eventos híbridos y virtuales que conectan audiencias globales.',
    features: [
      'Streaming de alta calidad',
      'Networking virtual',
      'Gamificación de eventos',
      'Registro y check-in digital',
      'Salas de breakout',
      'Analytics de participación'
    ],
    technologies: ['WebRTC', 'Streaming APIs', 'VR', 'Analytics']
  },
  {
    id: 'agricultura-tech',
    number: '13',
    title: 'AgriTech',
    subtitle: 'Agricultura inteligente',
    description: 'Tecnología para optimizar la producción agrícola con soluciones IoT y análisis de datos.',
    features: [
      'Monitoreo de cultivos IoT',
      'Predicción climática',
      'Optimización de riego',
      'Trazabilidad de productos',
      'Gestión de maquinaria',
      'Análisis de suelos'
    ],
    technologies: ['IoT', 'Drones', 'Satellite Data', 'AI']
  },
  {
    id: 'blockchain-crypto',
    number: '14',
    title: 'Blockchain y Crypto',
    subtitle: 'Tecnología descentralizada',
    description: 'Soluciones blockchain para diversos sectores con smart contracts y criptomonedas.',
    features: [
      'Smart contracts personalizados',
      'Tokenización de activos',
      'DeFi y staking',
      'NFT marketplaces',
      'Trazabilidad blockchain',
      'Wallets corporativas'
    ],
    technologies: ['Ethereum', 'Solidity', 'Web3', 'IPFS']
  },
  {
    id: 'iot-sensores',
    number: '15',
    title: 'IoT y Sensores',
    subtitle: 'Internet de las cosas',
    description: 'Conecta dispositivos para crear ecosistemas inteligentes y automatización avanzada.',
    features: [
      'Redes de sensores',
      'Monitoreo ambiental',
      'Automatización del hogar',
      'Ciudades inteligentes',
      'Mantenimiento predictivo',
      'Edge computing'
    ],
    technologies: ['Arduino', 'Raspberry Pi', 'LoRaWAN', 'MQTT']
  },
  {
    id: 'ciberseguridad',
    number: '16',
    title: 'Ciberseguridad',
    subtitle: 'Protección digital avanzada',
    description: 'Soluciones de seguridad para proteger activos digitales con tecnología de última generación.',
    features: [
      'Auditorías de seguridad',
      'Sistemas de detección',
      'Backup y recuperación',
      'Autenticación multifactor',
      'Monitoreo 24/7',
      'Compliance y certificaciones'
    ],
    technologies: ['Penetration Testing', 'SIEM', 'Zero Trust', 'AI Security']
  },
  {
    id: 'cloud-devops',
    number: '17',
    title: 'Cloud y DevOps',
    subtitle: 'Infraestructura moderna',
    description: 'Migración y optimización en la nube con prácticas DevOps para máxima eficiencia.',
    features: [
      'Migración a la nube',
      'CI/CD pipelines',
      'Containerización',
      'Microservicios',
      'Monitoreo y alertas',
      'Escalabilidad automática'
    ],
    technologies: ['AWS', 'Docker', 'Kubernetes', 'Jenkins']
  },
  {
    id: 'analytics-bi',
    number: '18',
    title: 'Analytics y BI',
    subtitle: 'Inteligencia de negocios',
    description: 'Transforma datos en decisiones estratégicas con análisis avanzado y visualización.',
    features: [
      'Dashboards interactivos',
      'Data warehousing',
      'Machine learning aplicado',
      'Reportes automatizados',
      'Predicciones de negocio',
      'Visualización avanzada'
    ],
    technologies: ['Tableau', 'Power BI', 'Python', 'R']
  },
  {
    id: 'api-integraciones',
    number: '19',
    title: 'APIs e Integraciones',
    subtitle: 'Conectividad empresarial',
    description: 'Conecta sistemas y automatiza flujos de trabajo con APIs robustas y integraciones.',
    features: [
      'APIs RESTful y GraphQL',
      'Integraciones ERP/CRM',
      'Webhooks y eventos',
      'Sincronización de datos',
      'Middleware empresarial',
      'Documentación interactiva'
    ],
    technologies: ['REST', 'GraphQL', 'Zapier', 'MuleSoft']
  },
  {
    id: 'fintech-pagos',
    number: '20',
    title: 'FinTech y Pagos',
    subtitle: 'Soluciones financieras',
    description: 'Tecnología financiera para modernizar transacciones y servicios bancarios digitales.',
    features: [
      'Wallets digitales',
      'Transferencias P2P',
      'Sistemas de crédito scoring',
      'Facturación electrónica',
      'Conciliación bancaria',
      'Compliance financiero'
    ],
    technologies: ['Plaid', 'Dwolla', 'Yodlee', 'Blockchain']
  },
  {
    id: 'educacion-online',
    number: '21',
    title: 'Educación Online',
    subtitle: 'Plataformas de aprendizaje',
    description: 'LMS y sistemas educativos interactivos para transformar la experiencia de aprendizaje.',
    features: [
      'Aulas virtuales interactivas',
      'Gestión de cursos y contenido',
      'Evaluaciones automatizadas',
      'Certificaciones digitales',
      'Gamificación del aprendizaje',
      'Analytics de progreso'
    ],
    technologies: ['Moodle', 'Canvas', 'Zoom', 'WebRTC']
  }
];

function ServicesPage() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [popupStep, setPopupStep] = useState('options'); // 'options' | 'form'
  const [selectedService, setSelectedService] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null); // Track which card is expanded
  const [isTransitioning, setIsTransitioning] = useState(false); // Track transition state
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    numero: '',
    nota: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

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

  const handleCardToggle = (serviceId) => {
    if (isTransitioning) return; // Prevent clicks during transition
    
    if (expandedCard === serviceId) {
      // Clicking on the same card - just close it
      setExpandedCard(null);
    } else if (expandedCard === null) {
      // No card is open - open the clicked card
      setExpandedCard(serviceId);
    } else {
      // Another card is open - close it first, then open the new one
      setIsTransitioning(true);
      setExpandedCard(null);
      
      // Wait for the close animation to complete before opening the new card
      setTimeout(() => {
        setExpandedCard(serviceId);
        setIsTransitioning(false);
      }, 400); // Match the CSS transition duration
    }
  };

  const handleSolicitarInfo = (service) => {
    setSelectedService(service);
    setPopupStep('options');
    setShowPopup(true);
  };

  const handleContactanos = (service) => {
    setSelectedService(service);
    setShowContactPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupStep('options');
    setSelectedService(null);
    setShowSuccess(false);
    setFormData({
      nombre: '',
      correo: '',
      numero: '',
      nota: ''
    });
  };

  const closeContactPopup = () => {
    setShowContactPopup(false);
    setSelectedService(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/requests/services-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          servicio: selectedService?.title || 'Servicio no especificado'
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        
        // Auto-close after 10 seconds
        setTimeout(() => {
          setShowSuccess(false);
          closePopup();
        }, 10000);
      } else {
        alert('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
    }
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
        
        <ServicesGrid 
          onSolicitarInfo={handleSolicitarInfo} 
          onContactanos={handleContactanos}
          expandedCard={expandedCard}
          onCardToggle={handleCardToggle}
        />
        
        <CTASection />
        
        <Footer />

        {/* Popup Modal */}
        {showPopup && (
          <motion.div 
            className="popup-overlay" 
            onClick={closePopup}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="popup-content" 
              style={{ maxWidth: '900px', padding: '2rem 3rem' }}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <button className="popup-close" onClick={closePopup}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {popupStep === 'options' ? (
                <motion.div 
                  className="popup-options"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h3>¿Cómo te gustaría proceder?</h3>
                  <p>Selecciona la opción que mejor se adapte a tus necesidades para el servicio de <strong>{selectedService?.title}</strong></p>
                  
                  <div className="popup-buttons">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Link 
                        to="/login?tab=register" 
                        className="popup-btn primary"
                        onClick={closePopup}
                      >
                        <div className="btn-content">
                          <span className="btn-title">Crear Cuenta</span>
                          <span className="btn-subtitle">Accede al panel y gestiona tus servicios</span>
                        </div>
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <button 
                        className="popup-btn secondary"
                        onClick={() => setPopupStep('form')}
                      >
                        <div className="btn-content">
                          <span className="btn-title">Solicitar Cotización</span>
                          <span className="btn-subtitle">Contáctanos directamente</span>
                        </div>
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              ) : showSuccess ? (
                <motion.div 
                  className="success-confirmation"
                  style={{ 
                    maxWidth: '600px', 
                    width: '100%', 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <motion.div 
                    className="success-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                  >
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="var(--accent)" strokeWidth="2" fill="none"/>
                      <path d="m9 12 2 2 4-4" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                  
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    ¡Solicitud Enviada!
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    Gracias por tu interés en <strong>{selectedService?.title}</strong>.<br />
                    Nos pondremos en contacto contigo muy pronto.
                  </motion.p>
                  
                  <motion.div 
                    className="success-details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <div className="detail-item">
                      <span className="detail-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span>Respuesta en menos de 24 horas</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span>Consulta personalizada gratuita</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="auto-close-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <span>Esta ventana se cerrará automáticamente</span>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div 
                  className="popup-form"
                  style={{ maxWidth: '900px', width: '100%' }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3>Solicitar Información</h3>
                  <p>Completa el formulario y nos pondremos en contacto contigo para el servicio de <strong>{selectedService?.title}</strong></p>
                  
                  <form onSubmit={handleFormSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="nombre">Nombre *</label>
                        <input
                          type="text"
                          id="nombre"
                          value={formData.nombre}
                          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="correo">Correo Electrónico *</label>
                        <input
                          type="email"
                          id="correo"
                          value={formData.correo}
                          onChange={(e) => setFormData({...formData, correo: e.target.value})}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="numero">Número de Teléfono *</label>
                        <input
                          type="tel"
                          id="numero"
                          value={formData.numero}
                          onChange={(e) => setFormData({...formData, numero: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label htmlFor="nota">Nota (Opcional)</label>
                      <textarea
                        id="nota"
                        rows="2"
                        value={formData.nota}
                        onChange={(e) => setFormData({...formData, nota: e.target.value})}
                        placeholder="Cuéntanos más detalles sobre tu proyecto..."
                      ></textarea>
                    </div>

                    <div className="form-actions">
                      <button type="button" className="btn-cancel" onClick={() => setPopupStep('options')}>
                        Volver
                      </button>
                      <button type="submit" className="btn-submit">
                        Enviar Solicitud
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Contact Popup Modal */}
        {showContactPopup && (
          <motion.div 
            className="popup-overlay" 
            onClick={closeContactPopup}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="popup-content contact-popup" 
              style={{ maxWidth: '600px', padding: '2.5rem' }}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <button className="popup-close" onClick={closeContactPopup}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <motion.div 
                className="contact-options"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3>Contáctanos</h3>
                <p>Elige tu método de contacto preferido para el servicio de <strong>{selectedService?.title}</strong></p>
                
                <div className="contact-methods">
                  <a 
                    href="https://instagram.com/genswave" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contact-method"
                  >
                    <div className="contact-icon instagram">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                      </svg>
                    </div>
                    <div className="contact-info">
                      <h4>Instagram</h4>
                      <p>@genswave</p>
                    </div>
                  </a>

                  <a 
                    href="https://wa.me/18094866678" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contact-method"
                  >
                    <div className="contact-icon whatsapp">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </div>
                    <div className="contact-info">
                      <h4>WhatsApp</h4>
                      <p>809-486-6678</p>
                    </div>
                  </a>

                  <a 
                    href="tel:+18094866678" 
                    className="contact-method"
                  >
                    <div className="contact-icon phone">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div className="contact-info">
                      <h4>Teléfono</h4>
                      <p>809-486-6678</p>
                    </div>
                  </a>

                  <a 
                    href="mailto:support@genswave.org" 
                    className="contact-method"
                  >
                    <div className="contact-icon email">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div className="contact-info">
                      <h4>Email</h4>
                      <p>support@genswave.org</p>
                    </div>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
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

  const scrollToServices = () => {
    const servicesGrid = document.querySelector('.services-grid-section');
    if (servicesGrid) {
      window.scrollTo({
        top: servicesGrid.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

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
          Catálogo Completo<br />Servicios Digitales
        </motion.h1>
        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Desde automatización hasta blockchain, ofrecemos 21 categorías<br />
          de soluciones empresariales para impulsar tu negocio
        </motion.p>
        <motion.button
          className="hero-ver-button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          onClick={scrollToServices}
        >
          VER
        </motion.button>
      </motion.div>

      {showScrollIndicator && (
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          onClick={scrollToServices}
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

function ServicesGrid({ onSolicitarInfo, onContactanos, expandedCard, onCardToggle }) {
  return (
    <section className="services-grid-section">
      <div className="services-grid">
        {services.map((service, index) => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            index={index} 
            onSolicitarInfo={onSolicitarInfo}
            onContactanos={onContactanos}
            isExpanded={expandedCard === service.id}
            onToggleExpanded={() => onCardToggle(service.id)}
          />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ service, index, onSolicitarInfo, onContactanos, isExpanded, onToggleExpanded }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={`service-card ${isExpanded ? 'expanded' : ''}`}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.05 }}
    >
      <div className="service-card-header" onClick={onToggleExpanded}>
        <span className="service-number">{service.number}</span>
        <div className="service-info">
          <h2>{service.title}</h2>
          <h3>{service.subtitle}</h3>
          <p className="service-description">{service.description}</p>
        </div>
        <div className="expand-icon">
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="service-details"
        initial={false}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ overflow: "hidden" }}
      >
        <div className="service-details-content">
          <div className="service-features">
            <h4>Características</h4>
            <ul>
              {service.features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isExpanded ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
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
                  animate={isExpanded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="service-actions">
            <button className="cta-button primary" onClick={() => onSolicitarInfo(service)}>
              Solicitar Servicio
            </button>
            <button className="cta-button secondary" onClick={() => onContactanos(service)}>
              Contáctanos
            </button>
          </div>
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
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          ¿Necesitas algo<br />más específico?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Con 21 categorías de servicios empresariales, seguramente tenemos la solución<br />
          perfecta para tu proyecto. Si no la encuentras, la creamos juntos.
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
