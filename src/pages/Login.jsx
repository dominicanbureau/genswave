import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [direction, setDirection] = useState(0);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [quickCode, setQuickCode] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showAutoCreatedPopup, setShowAutoCreatedPopup] = useState(false);

  useEffect(() => {
    checkAuth();
    
    // Check URL parameters to determine initial mode
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'register') {
      setIsLogin(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      
      if (data.authenticated) {
        const redirect = data.user.role === 'admin' ? '/admin' : '/dashboard';
        navigate(redirect);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  const handlePasswordRecoverySubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ 
          text: 'Se ha enviado un código de recuperación a tu correo electrónico', 
          type: 'success' 
        });
        setRecoveryEmail('');
      } else {
        setMessage({ text: data.error || 'Error al enviar código de recuperación', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error al procesar solicitud. Intenta de nuevo.', type: 'error' });
    }
    
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleQuickAccessSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/quick-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: quickCode })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowAutoCreatedPopup(true);
        
        // Auto-hide popup after 2 seconds, fade out over 10 seconds
        setTimeout(() => {
          setShowAutoCreatedPopup(false);
        }, 12000);
        
        navigate(data.redirect || '/dashboard');
      } else {
        setMessage({ text: data.error || 'Código inválido o expirado', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error al procesar código. Intenta de nuevo.', type: 'error' });
    }
    
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const switchMode = (toLogin) => {
    setDirection(toLogin ? -1 : 1);
    setIsLogin(toLogin);
    setShowQuickAccess(false);
    setShowPasswordRecovery(false);
    setMessage({ text: '', type: '' });
  };

  const switchToQuickAccess = () => {
    setShowQuickAccess(true);
    setShowPasswordRecovery(false);
    setIsLogin(false);
    setMessage({ text: '', type: '' });
  };

  const switchToPasswordRecovery = () => {
    setShowPasswordRecovery(true);
    setShowQuickAccess(false);
    setIsLogin(false);
    setMessage({ text: '', type: '' });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        navigate(data.redirect || '/dashboard');
      } else {
        setMessage({ text: data.error || 'Error al iniciar sesión', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error al iniciar sesión. Intenta de nuevo.', type: 'error' });
    }
    
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      setMessage({ text: 'Las contraseñas no coinciden', type: 'error' });
      return;
    }
    
    if (registerData.password.length < 6) {
      setMessage({ text: 'La contraseña debe tener al menos 6 caracteres', type: 'error' });
      return;
    }
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          phone: registerData.phone,
          password: registerData.password
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        navigate(data.redirect || '/dashboard');
      } else {
        setMessage({ text: data.error || 'Error al registrarse', type: 'error' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({ text: 'Error al registrarse. Intenta de nuevo.', type: 'error' });
    }
    
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      position: 'absolute'
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'absolute'
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      position: 'absolute'
    })
  };

  return (
    <div className="auth-page">
      {/* Mobile back button */}
      <Link to="/" className="mobile-back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </Link>

      <div className="auth-container">
        <div className="auth-left">
          <Link to="/" className="back-home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Volver al inicio
          </Link>
          
          <motion.div 
            className="auth-branding"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1>Genswave</h1>
            <p>Transforma tus ideas en experiencias digitales excepcionales</p>
          </motion.div>
          
          <div className="auth-features">
            <Feature 
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              }
              title="Proyectos innovadores" 
              delay={0.4}
            />
            <Feature 
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              }
              title="Soluciones creativas" 
              delay={0.5}
            />
            <Feature 
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              }
              title="Resultados rápidos" 
              delay={0.6}
            />
          </div>
        </div>
        
        <div className="auth-right">
          <div className="auth-tabs">
            <motion.button
              className={`tab ${isLogin ? 'active' : ''}`}
              onClick={() => switchMode(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Iniciar sesión
            </motion.button>
            <motion.button
              className={`tab ${!isLogin ? 'active' : ''}`}
              onClick={() => switchMode(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Registrarse
            </motion.button>
            <motion.div 
              className="tab-indicator"
              animate={{ x: isLogin ? 0 : '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
          
          <div className="form-carousel">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {showPasswordRecovery ? (
                <motion.div
                  key="passwordrecovery"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 }
                  }}
                  className="form-wrapper"
                >
                  <PasswordRecoveryForm 
                    email={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    onSubmit={handlePasswordRecoverySubmit}
                    onBack={() => setShowPasswordRecovery(false)}
                  />
                </motion.div>
              ) : showQuickAccess ? (
                <motion.div
                  key="quickaccess"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 }
                  }}
                  className="form-wrapper"
                >
                  <QuickAccessForm 
                    code={quickCode}
                    onChange={(e) => setQuickCode(e.target.value)}
                    onSubmit={handleQuickAccessSubmit}
                    onBack={() => setShowQuickAccess(false)}
                  />
                </motion.div>
              ) : isLogin ? (
                <motion.div
                  key="login"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 }
                  }}
                  className="form-wrapper"
                >
                  <LoginForm 
                    data={loginData}
                    onChange={handleLoginChange}
                    onSubmit={handleLoginSubmit}
                    onQuickAccess={switchToQuickAccess}
                    onPasswordRecovery={switchToPasswordRecovery}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 }
                  }}
                  className="form-wrapper"
                >
                  <RegisterForm 
                    data={registerData}
                    onChange={handleRegisterChange}
                    onSubmit={handleRegisterSubmit}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {message.text && (
            <motion.div
              className={`auth-message ${message.type}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {message.text}
            </motion.div>
          )}
        </div>
      </div>
      
      <AnimatedBackground />
      
      {/* Auto-created account popup */}
      {showAutoCreatedPopup && (
        <motion.div
          className="auto-created-popup"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="popup-content"
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 1, 0] }}
            transition={{ duration: 12, times: [0, 0.83, 1] }}
          >
            <button 
              className="popup-close"
              onClick={() => setShowAutoCreatedPopup(false)}
            >
              ×
            </button>
            <div className="popup-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3>¡Cuenta Creada Automáticamente!</h3>
            <p>Tu cuenta ha sido creada exitosamente usando el código de acceso rápido. Ya puedes comenzar a usar la plataforma.</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function LoginForm({ data, onChange, onSubmit, onQuickAccess, onPasswordRecovery }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Bienvenido de nuevo
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Ingresa tus credenciales para continuar
      </motion.p>
      
      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label htmlFor="login-email">Email</label>
        <input
          type="email"
          id="login-email"
          name="email"
          value={data.email}
          onChange={onChange}
          placeholder="tu@email.com"
          required
        />
      </motion.div>
      
      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label htmlFor="login-password">Contraseña</label>
        <input
          type="password"
          id="login-password"
          name="password"
          value={data.password}
          onChange={onChange}
          placeholder="••••••••"
          required
        />
      </motion.div>
      
      <motion.button
        type="submit"
        className="submit-btn"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        Iniciar sesión
      </motion.button>

      <motion.div
        className="auth-links"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <button type="button" className="link-btn" onClick={onPasswordRecovery}>
          Olvidé mi contraseña
        </button>
        <button type="button" className="link-btn" onClick={onQuickAccess}>
          Ingresar con código Quick
        </button>
      </motion.div>
    </form>
  );
}

function PasswordRecoveryForm({ email, onChange, onSubmit, onBack }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <motion.button
        type="button"
        className="back-btn"
        onClick={onBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ x: -5 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Volver
      </motion.button>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Recuperar Contraseña
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Ingresa tu correo electrónico y te enviaremos un código de recuperación
      </motion.p>
      
      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label htmlFor="recovery-email">Correo Electrónico</label>
        <input
          type="email"
          id="recovery-email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="tu@email.com"
          required
        />
      </motion.div>
      
      <motion.button
        type="submit"
        className="submit-btn"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        Enviar Código
      </motion.button>
    </form>
  );
}

function QuickAccessForm({ code, onChange, onSubmit, onBack }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <motion.button
        type="button"
        className="back-btn"
        onClick={onBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ x: -5 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Volver
      </motion.button>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Acceso Rápido
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Ingresa tu código de acceso para crear tu cuenta automáticamente
      </motion.p>
      
      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label htmlFor="quick-code">Código de Acceso</label>
        <input
          type="text"
          id="quick-code"
          name="code"
          value={code}
          onChange={onChange}
          placeholder="Ej: ABC123"
          required
          style={{ 
            fontFamily: 'Courier New, monospace',
            fontSize: '1.1rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}
        />
      </motion.div>
      
      <motion.button
        type="submit"
        className="submit-btn"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        Acceder
      </motion.button>
    </form>
  );
}

function RegisterForm({ data, onChange, onSubmit }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Crea tu cuenta
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Únete a nuestra comunidad
      </motion.p>
      
      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label htmlFor="register-name">Nombre completo</label>
        <input
          type="text"
          id="register-name"
          name="name"
          value={data.name}
          onChange={onChange}
          placeholder="Juan Pérez"
          required
        />
      </motion.div>
      
      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label htmlFor="register-email">Email</label>
        <input
          type="email"
          id="register-email"
          name="email"
          value={data.email}
          onChange={onChange}
          placeholder="tu@email.com"
          required
        />
      </motion.div>
      
      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <label htmlFor="register-phone">Teléfono</label>
        <input
          type="tel"
          id="register-phone"
          name="phone"
          value={data.phone}
          onChange={onChange}
          placeholder="+1 (555) 123-4567"
          required
        />
      </motion.div>
      
      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <label htmlFor="register-password">Contraseña</label>
        <input
          type="password"
          id="register-password"
          name="password"
          value={data.password}
          onChange={onChange}
          placeholder="••••••••"
          required
          minLength={6}
        />
      </motion.div>
      
      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <label htmlFor="register-confirm">Confirmar contraseña</label>
        <input
          type="password"
          id="register-confirm"
          name="confirmPassword"
          value={data.confirmPassword}
          onChange={onChange}
          placeholder="••••••••"
          required
          minLength={6}
        />
      </motion.div>
      
      <motion.button
        type="submit"
        className="submit-btn"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        Crear cuenta
      </motion.button>
    </form>
  );
}

function Feature({ icon, title, delay }) {
  return (
    <motion.div
      className="feature"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="feature-icon">{icon}</div>
      <span className="feature-title">{title}</span>
    </motion.div>
  );
}

function AnimatedBackground() {
  return (
    <div className="auth-bg">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-circle"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
            scale: [1, 1.5, 1],
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0]
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${50 + Math.random() * 100}px`,
            height: `${50 + Math.random() * 100}px`
          }}
        />
      ))}
    </div>
  );
}

export default Login;
