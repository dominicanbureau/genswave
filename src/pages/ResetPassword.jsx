import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Login.css'; // Usar el mismo CSS que Login

function ResetPassword() {
  const [step, setStep] = useState('request'); // 'request', 'reset', 'success'
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a token in the URL
    const urlParams = new URLSearchParams(location.search);
    const urlToken = urlParams.get('token');
    
    if (urlToken) {
      setToken(urlToken);
      verifyToken(urlToken);
    }
  }, [location]);

  const verifyToken = async (tokenToVerify) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/password-reset/verify/${tokenToVerify}`);
      const data = await response.json();
      
      if (data.success) {
        setStep('reset');
        setEmail(data.email);
      } else {
        setError(data.message);
        setStep('request');
      }
    } catch (error) {
      setError('Error verificando el token');
      setStep('request');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/password-reset/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage(data.message);
        setStep('success');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error enviando solicitud de restablecimiento');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/password-reset/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Contraseña restablecida exitosamente');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error restableciendo la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Mobile back button */}
      <Link to="/login" className="mobile-back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </Link>

      <div className="auth-container">
        <div className="auth-left">
          <Link to="/login" className="back-home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Volver al login
          </Link>
          
          <motion.div 
            className="auth-branding"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1>Genswave</h1>
            <p>Restablece tu contraseña de forma segura</p>
          </motion.div>
          
          <div className="auth-features">
            <Feature 
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                  <path d="M3 12h6m6 0h6"/>
                </svg>
              }
              title="Proceso seguro" 
              delay={0.4}
            />
            <Feature 
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              }
              title="Enlace temporal" 
              delay={0.5}
            />
            <Feature 
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              }
              title="Confirmación por email" 
              delay={0.6}
            />
          </div>
        </div>
        
        <div className="auth-right">
          <div className="form-carousel">
            {step === 'request' && (
              <motion.div
                className="form-wrapper"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <RequestResetForm 
                  email={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onSubmit={handleRequestReset}
                  loading={loading}
                />
              </motion.div>
            )}

            {step === 'reset' && (
              <motion.div
                className="form-wrapper"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <NewPasswordForm 
                  email={email}
                  newPassword={newPassword}
                  confirmPassword={confirmPassword}
                  onNewPasswordChange={(e) => setNewPassword(e.target.value)}
                  onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
                  onSubmit={handleResetPassword}
                  loading={loading}
                />
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                className="form-wrapper"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <SuccessStep message={message} />
              </motion.div>
            )}
          </div>
          
          {(error || message) && (
            <motion.div
              className={`auth-message ${error ? 'error' : 'success'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error || message}
            </motion.div>
          )}
        </div>
      </div>
      
      <AnimatedBackground />
    </div>
  );
}

function RequestResetForm({ email, onChange, onSubmit, loading }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Restablecer Contraseña
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
      </motion.p>
      
      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label htmlFor="reset-email">Correo Electrónico</label>
        <input
          type="email"
          id="reset-email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="tu@correo.com"
          required
        />
      </motion.div>
      
      <motion.button
        type="submit"
        className="submit-btn"
        disabled={loading}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? 'Enviando...' : 'Enviar Enlace de Restablecimiento'}
      </motion.button>

      <motion.div
        className="auth-links"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link to="/login" className="link-btn">
          ← Volver al Login
        </Link>
      </motion.div>
    </form>
  );
}

function NewPasswordForm({ email, newPassword, confirmPassword, onNewPasswordChange, onConfirmPasswordChange, onSubmit, loading }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Nueva Contraseña
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Ingresa tu nueva contraseña para: <strong>{email}</strong>
      </motion.p>
      
      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label htmlFor="new-password">Nueva Contraseña</label>
        <input
          type="password"
          id="new-password"
          name="newPassword"
          value={newPassword}
          onChange={onNewPasswordChange}
          placeholder="Mínimo 6 caracteres"
          required
          minLength="6"
        />
      </motion.div>

      <motion.div 
        className="form-group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label htmlFor="confirm-password">Confirmar Contraseña</label>
        <input
          type="password"
          id="confirm-password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          placeholder="Repite la contraseña"
          required
          minLength="6"
        />
      </motion.div>
      
      <motion.button
        type="submit"
        className="submit-btn"
        disabled={loading}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
      </motion.button>
    </form>
  );
}

function SuccessStep({ message }) {
  return (
    <div className="auth-form">
      <motion.div
        className="success-icon"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        ¡Solicitud Enviada!
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {message}
      </motion.p>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Revisa tu bandeja de entrada y sigue las instrucciones del correo.
      </motion.p>
      
      <motion.div
        className="auth-links"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Link to="/login" className="link-btn">
          ← Volver al Login
        </Link>
      </motion.div>
    </div>
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

export default ResetPassword;