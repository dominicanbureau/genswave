import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './LegalPage.css';

function TermsPage() {
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
      <div className="legal-page">
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
        
        <section className="legal-hero">
          <motion.div
            className="legal-hero-content"
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
              LEGAL
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Términos y<br />Condiciones
            </motion.h1>
            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </motion.p>
          </motion.div>
        </section>

        <section className="legal-content">
          <motion.div
            className="legal-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="legal-section">
              <h2>1. Aceptación de los Términos</h2>
              <p>
                Al acceder y utilizar los servicios de Genswave, usted acepta estar sujeto a estos Términos y Condiciones. 
                Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
              </p>
            </div>

            <div className="legal-section">
              <h2>2. Descripción de Servicios</h2>
              <p>
                Genswave proporciona servicios de desarrollo web, aplicaciones móviles y soluciones digitales personalizadas. 
                Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto de nuestros servicios 
                en cualquier momento sin previo aviso.
              </p>
            </div>

            <div className="legal-section">
              <h2>3. Uso Aceptable</h2>
              <p>Usted se compromete a:</p>
              <ul>
                <li>Proporcionar información precisa y actualizada</li>
                <li>Mantener la confidencialidad de sus credenciales de acceso</li>
                <li>No utilizar nuestros servicios para actividades ilegales o no autorizadas</li>
                <li>No intentar acceder a áreas restringidas de nuestros sistemas</li>
                <li>Respetar los derechos de propiedad intelectual</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>4. Propiedad Intelectual</h2>
              <p>
                Todo el contenido, diseños, código y materiales desarrollados por Genswave permanecen como propiedad 
                intelectual de Genswave hasta que se complete el pago total del proyecto. Una vez completado el pago, 
                los derechos de uso se transfieren al cliente según lo acordado en el contrato específico del proyecto.
              </p>
            </div>

            <div className="legal-section">
              <h2>5. Pagos y Facturación</h2>
              <p>
                Los términos de pago se establecen en cada propuesta o contrato individual. Generalmente, requerimos:
              </p>
              <ul>
                <li>Un depósito inicial del 50% antes de comenzar el trabajo</li>
                <li>El 50% restante al completar el proyecto</li>
                <li>Los pagos deben realizarse dentro de los 15 días posteriores a la facturación</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>6. Garantías y Limitaciones</h2>
              <p>
                Garantizamos que nuestros servicios se realizarán con habilidad profesional y cuidado razonable. 
                Sin embargo, no garantizamos resultados específicos de negocio o tráfico web. Nuestros servicios 
                se proporcionan "tal cual" sin garantías implícitas.
              </p>
            </div>

            <div className="legal-section">
              <h2>7. Limitación de Responsabilidad</h2>
              <p>
                Genswave no será responsable de daños indirectos, incidentales, especiales o consecuentes que resulten 
                del uso o la imposibilidad de usar nuestros servicios. Nuestra responsabilidad total no excederá el 
                monto pagado por los servicios en cuestión.
              </p>
            </div>

            <div className="legal-section">
              <h2>8. Cancelación y Reembolsos</h2>
              <p>
                Los proyectos pueden cancelarse por cualquiera de las partes con notificación por escrito. 
                Los reembolsos se calcularán en función del trabajo completado hasta la fecha de cancelación. 
                Los depósitos iniciales no son reembolsables una vez que el trabajo ha comenzado.
              </p>
            </div>

            <div className="legal-section">
              <h2>9. Confidencialidad</h2>
              <p>
                Ambas partes acuerdan mantener confidencial toda información propietaria compartida durante 
                el curso del proyecto. Esta obligación continúa incluso después de la finalización del proyecto.
              </p>
            </div>

            <div className="legal-section">
              <h2>10. Modificaciones</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán 
                en vigor inmediatamente después de su publicación en nuestro sitio web. El uso continuado de 
                nuestros servicios constituye la aceptación de los términos modificados.
              </p>
            </div>

            <div className="legal-section">
              <h2>11. Ley Aplicable</h2>
              <p>
                Estos términos se regirán e interpretarán de acuerdo con las leyes aplicables, sin tener en 
                cuenta sus disposiciones sobre conflictos de leyes.
              </p>
            </div>

            <div className="legal-section">
              <h2>12. Contacto</h2>
              <p>
                Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos en:
              </p>
              <ul>
                <li>Email: legal@genswave.org</li>
                <li>Ubicación: Distrito Nacional, Dominican Republic</li>
              </ul>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

export default TermsPage;
