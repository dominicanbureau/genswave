import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

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
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h1>🔐 Restablecer Contraseña</h1>
          <p>Genswave - Soluciones Tecnológicas</p>
        </div>

        {step === 'request' && (
          <form onSubmit={handleRequestReset} className="reset-password-form">
            <h2>Solicitar Restablecimiento</h2>
            <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
            
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@correo.com"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <button type="submit" disabled={loading} className="reset-button">
              {loading ? 'Enviando...' : 'Enviar Enlace de Restablecimiento'}
            </button>

            <div className="reset-links">
              <a href="/login">← Volver al Login</a>
            </div>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="reset-password-form">
            <h2>Nueva Contraseña</h2>
            <p>Ingresa tu nueva contraseña para la cuenta: <strong>{email}</strong></p>
            
            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Mínimo 6 caracteres"
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repite la contraseña"
                minLength="6"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <button type="submit" disabled={loading} className="reset-button">
              {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="success-step">
            <div className="success-icon">✅</div>
            <h2>¡Solicitud Enviada!</h2>
            <p>{message}</p>
            <p>Revisa tu bandeja de entrada y sigue las instrucciones del correo.</p>
            <div className="reset-links">
              <a href="/login">← Volver al Login</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;