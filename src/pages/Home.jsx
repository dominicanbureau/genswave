import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import HeroVisual from '../components/HeroVisual';
import Footer from '../components/Footer';
import './Home.css';

// Register GSAP plugin
gsap.registerPlugin(ScrollToPlugin);

function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, default to light mode (false)
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const isScrollingRef = useRef(false);
  const sectionsRef = useRef([]);

  useEffect(() => {
    // Get all sections including closing section
    sectionsRef.current = [
      document.querySelector('header'),
      ...document.querySelectorAll('.scroll-section'),
      document.querySelector('.closing-section')
    ].filter(Boolean);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Hide scroll indicator after scrolling past first section
      setShowScrollIndicator(window.scrollY < window.innerHeight * 0.5);

      const sections = document.querySelectorAll('.scroll-section');
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 400) {
          current = section.classList[1];
        }
      });
      
      setActiveSection(current);

      // Update current section index
      if (!isScrollingRef.current) {
        const currentScroll = window.scrollY;
        sectionsRef.current.forEach((section, index) => {
          if (section && Math.abs(section.offsetTop - currentScroll) < 100) {
            setCurrentSectionIndex(index);
          }
        });
      }
    };

    // Wheel event for immediate direction detection
    const handleWheel = (e) => {
      if (isScrollingRef.current) {
        e.preventDefault();
        return;
      }

      const delta = e.deltaY;
      let targetIndex = currentSectionIndex;

      if (delta > 0) {
        // Scrolling down
        targetIndex = Math.min(currentSectionIndex + 1, sectionsRef.current.length - 1);
      } else {
        // Scrolling up
        targetIndex = Math.max(currentSectionIndex - 1, 0);
      }

      if (targetIndex !== currentSectionIndex && sectionsRef.current[targetIndex]) {
        e.preventDefault();
        isScrollingRef.current = true;
        setCurrentSectionIndex(targetIndex);

        const targetSection = sectionsRef.current[targetIndex];
        const sectionHeight = targetSection.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Calculate offset to center content vertically
        // For sections taller than viewport, scroll to top
        // For header, scroll to exact top
        let scrollTarget;
        if (targetIndex === 0) {
          // Header - scroll to top
          scrollTarget = 0;
        } else if (sectionHeight > viewportHeight) {
          // Tall section - center the content area
          scrollTarget = targetSection.offsetTop + (sectionHeight - viewportHeight) / 2;
        } else {
          // Short section - scroll to top
          scrollTarget = targetSection.offsetTop;
        }

        // Use GSAP for smoother scroll animation
        gsap.to(window, {
          scrollTo: scrollTarget,
          duration: 1.3,
          ease: 'power4.out',
          onComplete: () => {
            isScrollingRef.current = false;
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentSectionIndex]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleExploreClick = (e) => {
    e.preventDefault();
    if (isTransitioning) return;
    
    setIsTransitioning(true);

    // Detect if mobile
    const isMobile = window.innerWidth <= 991;
    console.log('Is Mobile:', isMobile, 'Width:', window.innerWidth);

    if (isMobile) {
      // MOBILE: Animate the GENSWAVE text
      const genswaveText = document.querySelector('header h1');
      console.log('GENSWAVE text element:', genswaveText);
      
      if (!genswaveText) {
        console.error('GENSWAVE text not found!');
        navigate('/servicios');
        return;
      }

      // Get current position of text
      const rect = genswaveText.getBoundingClientRect();
      console.log('Text position:', rect);
      
      // Fix text in its current position
      genswaveText.style.position = 'fixed';
      genswaveText.style.left = rect.left + 'px';
      genswaveText.style.top = rect.top + 'px';
      genswaveText.style.margin = '0';
      genswaveText.style.zIndex = '10000';
      genswaveText.style.transformOrigin = 'center center';
      genswaveText.style.whiteSpace = 'nowrap';

      // Create GSAP timeline
      const tl = gsap.timeline({
        onStart: () => console.log('Animation started'),
        onComplete: () => {
          console.log('Animation complete, navigating...');
          navigate('/servicios');
        }
      });

      // Phase 1: Fade out everything except GENSWAVE text
      tl.to('.main-navbar, .title-large, .explore-btn, .scroll-section, .closing-section, .sticky-visual, .mobile-progress, footer', {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });

      // Phase 2: Move text to center
      tl.to(genswaveText, {
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        duration: 1.2,
        ease: 'power2.inOut'
      }, '+=0.2');

      // Phase 3: Scale up
      tl.to(genswaveText, {
        scale: 2,
        duration: 0.4,
        ease: 'power2.out'
      });

      // Phase 3: Expand with burst effect
      tl.to(genswaveText, {
        scale: 10,
        opacity: 0,
        duration: 0.6,
        ease: 'power4.in'
      });

    } else {
      // DESKTOP: Animate the WebGL element
      const heroVisual = document.querySelector('.hero-visual-container');
      
      if (!heroVisual) return;

      // Get current position
      const rect = heroVisual.getBoundingClientRect();
      
      // Remove all CSS animations and transitions
      heroVisual.style.animation = 'none';
      heroVisual.style.transition = 'none';
      heroVisual.style.willChange = 'auto';
      heroVisual.style.position = 'fixed';
      heroVisual.style.left = rect.left + 'px';
      heroVisual.style.top = rect.top + 'px';
      heroVisual.style.width = rect.width + 'px';
      heroVisual.style.height = rect.height + 'px';
      heroVisual.style.margin = '0';
      heroVisual.style.zIndex = '10000';
      heroVisual.style.transformOrigin = 'center center';

      // Create GSAP timeline
      const tl = gsap.timeline({
        onComplete: () => {
          navigate('/servicios');
        }
      });

      // Phase 1: Fade out everything except hero visual
      tl.to('.main-navbar, .content, .sticky-visual .shape-container, .mobile-progress, footer', {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });

      // Also fade out the sticky visual background
      tl.to('.sticky-visual', {
        background: 'transparent',
        borderLeft: 'none',
        duration: 0.8,
        ease: 'power2.out'
      }, 0);

      // Phase 2: Move to center
      tl.to(heroVisual, {
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        scale: 1.3,
        duration: 1.2,
        ease: 'power2.inOut'
      }, '+=0.2');

      // Phase 3: Expand with burst effect
      tl.to(heroVisual, {
        scale: 8,
        opacity: 0,
        duration: 0.6,
        ease: 'power4.in'
      });
    }
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <div className="scroll-landing">
        <nav className={`main-navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
              <div className="navbar-logo">
                <img src="/genswave.png" alt="Genswave" className="navbar-logo-image" />
              </div>

              <div className="navbar-center">
                <a href="/proceso" className="nav-link">
                  <span className="link-text">Proceso</span>
                  <span className="link-indicator"></span>
                </a>
                <a href="/servicios" className="nav-link">
                  <span className="link-text">Servicios</span>
                  <span className="link-indicator"></span>
                </a>
                <a href="/contacto" className="nav-link">
                  <span className="link-text">Contactar</span>
                  <span className="link-indicator"></span>
                </a>
              </div>

              <div className="navbar-actions">
                <div className="icon-trio">
                  <a href="/contacto" className="icon-btn icon-left" aria-label="Contacto">
                    <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  
                  <button onClick={toggleTheme} className="icon-btn icon-center" aria-label="Toggle theme">
                    <svg className="icon" width="18" height="18" viewBox="0 0 20 20" fill="none">
                      {isDarkMode ? (
                        <path d="M10 2V4M10 16V18M4 10H2M18 10H16M15.657 4.343L14.243 5.757M5.757 14.243L4.343 15.657M15.657 15.657L14.243 14.243M5.757 5.757L4.343 4.343M13 10C13 11.657 11.657 13 10 13C8.343 13 7 11.657 7 10C7 8.343 8.343 7 10 7C11.657 7 13 8.343 13 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      ) : (
                        <path d="M17 10C17 13.866 13.866 17 10 17C6.134 17 3 13.866 3 10C3 6.134 6.134 3 10 3C10.395 3 10.782 3.034 11.158 3.099C9.838 4.034 9 5.415 9 7C9 9.761 11.239 12 14 12C15.585 12 16.966 11.162 17.901 9.842C17.966 10.218 18 10.605 18 11C18 10.667 17.667 10.333 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      )}
                    </svg>
                  </button>

                  <a href="/login" className="icon-btn icon-right" aria-label="Login">
                    <svg className="icon" width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d="M10 11C12.2091 11 14 9.20914 14 7C14 4.79086 12.2091 3 10 3C7.79086 3 6 4.79086 6 7C6 9.20914 7.79086 11 10 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>

                <button className="hamburger" onClick={toggleMobileMenu} aria-label="Menu">
                  <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
                  <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
                  <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
                </button>
              </div>

              <div className="navbar-progress">
                <div className="progress-fill"></div>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
              <div className="mobile-menu-header">
                <img src="/genswave.png" alt="Genswave" className="mobile-menu-logo" />
              </div>
              
              <nav className="mobile-menu-nav">
                <a href="/proceso" className="mobile-menu-link" onClick={toggleMobileMenu}>Proceso</a>
                <a href="/servicios" className="mobile-menu-link" onClick={toggleMobileMenu}>Servicios</a>
                <a href="/contacto" className="mobile-menu-link" onClick={toggleMobileMenu}>Contactar</a>
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
                <a href="/login" className="mobile-menu-login-btn" onClick={toggleMobileMenu}>
                  Iniciar Sesión
                </a>
              </div>
            </div>
          </nav>

          <div className="mobile-progress">
            <svg viewBox="0 0 100 100">
              <circle className="track-circle" cx="50" cy="50" r="40" />
              <circle className="progress-circle" cx="50" cy="50" r="40" pathLength="1" />
            </svg>
        </div>

        <div className="sticky-visual">
            {/* Hero Visual - WebGL Component */}
            <div className="hero-visual-container">
              <HeroVisual isDarkMode={isDarkMode} />
            </div>

            <div className="shape-container shape-1">
              <div className="web-icon">
                <div className="browser-window">
                  <div className="browser-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <div className="browser-content">
                    <div className="code-line"></div>
                    <div className="code-line short"></div>
                    <div className="code-line"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="shape-container shape-2">
              <div className="mobile-icon">
                <div className="phone-frame">
                  <div className="phone-notch"></div>
                  <div className="phone-screen">
                    <div className="app-bar"></div>
                    <div className="app-content">
                      <div className="app-card"></div>
                      <div className="app-card"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="shape-container shape-3">
              <div className="ecommerce-icon">
                <div className="cart-container">
                  <div className="cart-body">
                    <div className="cart-item"></div>
                    <div className="cart-item"></div>
                  </div>
                  <div className="cart-wheels">
                    <div className="wheel"></div>
                    <div className="wheel"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="shape-container shape-4">
              <div className="custom-icon">
                <div className="puzzle-grid">
                  <div className="puzzle-piece p1"></div>
                  <div className="puzzle-piece p2"></div>
                  <div className="puzzle-piece p3"></div>
                  <div className="puzzle-piece p4"></div>
                </div>
              </div>
            </div>

            <div className="shape-container shape-5">
              <div className="cloud-icon">
                <div className="cloud-shape">
                  <div className="cloud-circle c1"></div>
                  <div className="cloud-circle c2"></div>
                  <div className="cloud-circle c3"></div>
                  <div className="cloud-base"></div>
                </div>
                <div className="cloud-data">
                  <div className="data-stream"></div>
                  <div className="data-stream"></div>
                  <div className="data-stream"></div>
                </div>
              </div>
            </div>

            <div className="shape-container shape-6">
              <div className="consulting-icon">
                <div className="chart-container">
                  <div className="chart-bars">
                    <div className="bar" style={{height: '40%'}}></div>
                    <div className="bar" style={{height: '70%'}}></div>
                    <div className="bar" style={{height: '55%'}}></div>
                    <div className="bar" style={{height: '85%'}}></div>
                  </div>
                  <div className="trend-line"></div>
                </div>
              </div>
            </div>
        </div>

        <div className="content">
        <header>
          <div>
            <h1>GENSWAVE</h1>
            <span className="title-large">Construido para<br />empresas de la<br />era digital.</span>
            <button onClick={handleExploreClick} className="explore-btn" disabled={isTransitioning}>
              <span>Explorar</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
          
          {showScrollIndicator && (
            <div className="scroll-indicator" onClick={() => {
              const firstSection = document.querySelector('.scroll-section');
              if (firstSection) {
                gsap.to(window, {
                  scrollTo: firstSection.offsetTop,
                  duration: 1.5,
                  ease: 'power2.inOut'
                });
              }
            }}>
              <div className="scroll-arrow">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          )}
        </header>

        <section className="scroll-section s1" id="s1">
          <div className="mobile-icon-container">
            <div className="mobile-service-icon">
              <svg viewBox="0 0 100 100" className="mobile-icon-svg">
                <rect x="20" y="25" width="60" height="45" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/>
                <line x1="20" y1="35" x2="80" y2="35" stroke="currentColor" strokeWidth="2"/>
                <circle cx="25" cy="30" r="1.5" fill="currentColor"/>
                <circle cx="30" cy="30" r="1.5" fill="currentColor"/>
                <circle cx="35" cy="30" r="1.5" fill="currentColor"/>
                <line x1="30" y1="45" x2="70" y2="45" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
                <line x1="30" y1="52" x2="60" y2="52" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
                <line x1="30" y1="59" x2="65" y2="59" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
              </svg>
            </div>
          </div>
          <p className="focus-text">Desarrollo Web que convierte visitantes en clientes.</p>
          <p className="description">Sitios modernos y optimizados con tecnología de vanguardia. Experiencias web que no solo se ven bien, sino que generan resultados medibles para tu negocio.</p>
        </section>

        <section className="scroll-section s2" id="s2">
          <div className="mobile-icon-container">
            <div className="mobile-service-icon">
              <svg viewBox="0 0 100 100" className="mobile-icon-svg">
                <rect x="35" y="15" width="30" height="55" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/>
                <line x1="45" y1="65" x2="55" y2="65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <rect x="40" y="22" width="20" height="35" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
                <line x1="43" y1="28" x2="57" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
                <line x1="43" y1="33" x2="52" y2="33" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
                <circle cx="50" cy="45" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
              </svg>
            </div>
          </div>
          <p className="focus-text">Apps móviles nativas con experiencia excepcional.</p>
          <p className="description">Aplicaciones iOS y Android diseñadas para el rendimiento óptimo. Interfaces intuitivas que tus usuarios amarán y tecnología que escala con tu crecimiento.</p>
        </section>

        <section className="scroll-section s3" id="s3">
          <div className="mobile-icon-container">
            <div className="mobile-service-icon">
              <svg viewBox="0 0 100 100" className="mobile-icon-svg">
                <path d="M 30 40 L 40 30 L 60 30 L 70 40 L 70 55 L 60 65 L 40 65 L 30 55 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="50" cy="47.5" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
                <line x1="50" y1="35.5" x2="50" y2="40" stroke="currentColor" strokeWidth="2"/>
                <line x1="50" y1="55" x2="50" y2="59.5" stroke="currentColor" strokeWidth="2"/>
                <circle cx="35" cy="70" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="65" cy="70" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          <p className="focus-text">E-Commerce que impulsa tus ventas digitales.</p>
          <p className="description">Tiendas digitales completas con sistemas de pago seguros y gestión avanzada. Plataformas de comercio diseñadas para maximizar conversiones y facilitar operaciones.</p>
        </section>

        <section className="scroll-section s4" id="s4">
          <div className="mobile-icon-container">
            <div className="mobile-service-icon">
              <svg viewBox="0 0 100 100" className="mobile-icon-svg">
                <rect x="25" y="25" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                <rect x="55" y="25" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                <rect x="25" y="55" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                <rect x="55" y="55" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="35" cy="35" r="3" fill="currentColor" opacity="0.6"/>
                <circle cx="65" cy="35" r="3" fill="currentColor" opacity="0.6"/>
                <circle cx="35" cy="65" r="3" fill="currentColor" opacity="0.6"/>
                <circle cx="65" cy="65" r="3" fill="currentColor" opacity="0.6"/>
              </svg>
            </div>
          </div>
          <p className="focus-text">Soluciones personalizadas para desafíos únicos.</p>
          <p className="description">Desarrollo a medida que se adapta exactamente a tus necesidades. Tecnología personalizada que resuelve problemas específicos de tu industria y negocio.</p>
        </section>

        <section className="scroll-section s5" id="s5">
          <div className="mobile-icon-container">
            <div className="mobile-service-icon">
              <svg viewBox="0 0 100 100" className="mobile-icon-svg">
                <ellipse cx="50" cy="35" rx="25" ry="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                <ellipse cx="50" cy="50" rx="25" ry="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                <ellipse cx="50" cy="65" rx="25" ry="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                <line x1="25" y1="35" x2="25" y2="65" stroke="currentColor" strokeWidth="2"/>
                <line x1="75" y1="35" x2="75" y2="65" stroke="currentColor" strokeWidth="2"/>
                <path d="M 45 25 L 50 20 L 55 25" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
                <path d="M 45 72 L 50 77 L 55 72" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
              </svg>
            </div>
          </div>
          <p className="focus-text">Infraestructura cloud escalable y segura.</p>
          <p className="description">Arquitectura moderna en la nube que crece contigo. Sistemas robustos con alta disponibilidad, seguridad empresarial y rendimiento garantizado.</p>
        </section>

        <section className="scroll-section s6" id="s6">
          <div className="mobile-icon-container">
            <div className="mobile-service-icon">
              <svg viewBox="0 0 100 100" className="mobile-icon-svg">
                <rect x="20" y="60" width="10" height="20" rx="1" fill="none" stroke="currentColor" strokeWidth="2"/>
                <rect x="35" y="50" width="10" height="30" rx="1" fill="none" stroke="currentColor" strokeWidth="2"/>
                <rect x="50" y="45" width="10" height="35" rx="1" fill="none" stroke="currentColor" strokeWidth="2"/>
                <rect x="65" y="30" width="10" height="50" rx="1" fill="none" stroke="currentColor" strokeWidth="2"/>
                <polyline points="25,55 40,45 55,40 70,25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                <circle cx="25" cy="55" r="2" fill="currentColor"/>
                <circle cx="40" cy="45" r="2" fill="currentColor"/>
                <circle cx="55" cy="40" r="2" fill="currentColor"/>
                <circle cx="70" cy="25" r="2" fill="currentColor"/>
              </svg>
            </div>
          </div>
          <p className="focus-text">Consultoría estratégica para transformación digital.</p>
          <p className="description">Acompañamiento experto en cada etapa de tu evolución digital. Estrategia, implementación y optimización continua para mantener tu ventaja competitiva.</p>
        </section>

        <div className="closing-section">
          <div className="closer">
            <strong>Comienza tu proyecto hoy.</strong><br />
            info@genswave.org<br />
            Distrito Nacional, Santo Domingo
          </div>
          
          <Link to="/login" className="start-project-btn">
            Comenzar
          </Link>
        </div>
      </div>

      <Footer />
    </div>
    </div>
  );
}

export default Home;
