import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.95)']
  );
  const boxShadow = useTransform(
    scrollY,
    [0, 100],
    ['0 0 0 rgba(0, 0, 0, 0)', '0 2px 20px rgba(0, 0, 0, 0.05)']
  );

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      
      if (data.authenticated) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const getDashboardLink = () => {
    if (!user) return '/login';
    return user.role === 'admin' ? '/admin' : '/dashboard';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Toggle body scroll
    if (!isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
  };

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, []);

  return (
    <>
      <motion.nav 
        className="navbar"
        style={{ backgroundColor, boxShadow }}
      >
        <div className="nav-container">
          <Link to="/">
            <motion.div 
              className="logo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src="/genswave.png" 
                alt="Genswave" 
                className="logo-image"
              />
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <motion.ul 
            className="nav-menu desktop-menu"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <li>
              <Link to="/servicios" className={isActive('/servicios') ? 'active' : ''}>
                Servicios
              </Link>
            </li>
            <li>
              <Link to="/proceso" className={isActive('/proceso') ? 'active' : ''}>
                Proceso
              </Link>
            </li>
            <li>
              <Link to="/contacto" className={isActive('/contacto') ? 'active' : ''}>
                Contacto
              </Link>
            </li>
            <li>
              {!loading && (
                <Link to={getDashboardLink()} className="login-btn">
                  {user ? 'Ir al Panel' : 'Login'}
                </Link>
              )}
            </li>
          </motion.ul>

          {/* Mobile Hamburger Button */}
          <motion.button
            className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.95 }}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            <motion.div
              className="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="mobile-menu-header">
                <motion.div 
                  className="mobile-logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <img 
                    src="/genswave.png" 
                    alt="Genswave" 
                    className="mobile-logo-image"
                  />
                </motion.div>
                <motion.button
                  className="close-btn"
                  onClick={closeMobileMenu}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </motion.button>
              </div>

              <motion.ul 
                className="mobile-nav-menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.li
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link 
                    to="/servicios" 
                    className={isActive('/servicios') ? 'active' : ''}
                    onClick={closeMobileMenu}
                  >
                    <span className="menu-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                    </span>
                    Servicios
                  </Link>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link 
                    to="/proceso" 
                    className={isActive('/proceso') ? 'active' : ''}
                    onClick={closeMobileMenu}
                  >
                    <span className="menu-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                      </svg>
                    </span>
                    Proceso
                  </Link>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link 
                    to="/contacto" 
                    className={isActive('/contacto') ? 'active' : ''}
                    onClick={closeMobileMenu}
                  >
                    <span className="menu-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22 6 12 13 2 6"/>
                      </svg>
                    </span>
                    Contacto
                  </Link>
                </motion.li>
                <motion.li
                  className="mobile-login-item"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  {!loading && (
                    <Link 
                      to={getDashboardLink()} 
                      className="mobile-login-btn"
                      onClick={closeMobileMenu}
                    >
                      <span className="menu-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                          <polyline points="10 17 15 12 10 7"/>
                          <line x1="15" y1="12" x2="3" y2="12"/>
                        </svg>
                      </span>
                      {user ? 'Ir al Panel' : 'Login'}
                    </Link>
                  )}
                </motion.li>
              </motion.ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
