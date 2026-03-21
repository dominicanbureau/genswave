import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import './AppointmentForm.css';

function AppointmentForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    service: '',
    preferredDate: '',
    message: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    // Check for business name when component mounts
    const storedBusinessName = sessionStorage.getItem('businessName');
    if (storedBusinessName) {
      console.log('Found business name in sessionStorage:', storedBusinessName);
      setFormData(prev => ({ ...prev, businessName: storedBusinessName }));
      sessionStorage.removeItem('businessName');
    }

    // Listen for custom event from Hero component
    const handleBusinessNameSet = (event) => {
      console.log('Received businessNameSet event:', event.detail.businessName);
      setFormData(prev => ({ ...prev, businessName: event.detail.businessName }));
    };

    window.addEventListener('businessNameSet', handleBusinessNameSet);

    return () => {
      window.removeEventListener('businessNameSet', handleBusinessNameSet);
    };
  }, []);

  useEffect(() => {
    // Also check when the section comes into view
    if (isInView) {
      const storedBusinessName = sessionStorage.getItem('businessName');
      if (storedBusinessName) {
        console.log('Found business name when in view:', storedBusinessName);
        setFormData(prev => ({ ...prev, businessName: storedBusinessName }));
        sessionStorage.removeItem('businessName');
      }
    }
  }, [isInView]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ text: '¡Solicitud enviada con éxito! Te contactaremos pronto.', type: 'success' });
        setFormData({ name: '', email: '', phone: '', businessName: '', service: '', preferredDate: '', message: '' });
        
        // Dispatch event to clear Hero input
        window.dispatchEvent(new CustomEvent('appointmentSubmitted'));
        
        // Redirect to login after 1.5 seconds
        setTimeout(() => {
          window.location.href = '/login?mode=register';
        }, 1500);
      } else {
        setMessage({ text: 'Error al enviar la solicitud. Intenta de nuevo.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error al enviar la solicitud. Intenta de nuevo.', type: 'error' });
    }
    
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="contacto" className="appointment-section" ref={ref}>
      {/* Crystal Background Layer */}
      <div className="crystal-layer">
        <div className="crystal-orb crystal-orb-1"></div>
        <div className="crystal-orb crystal-orb-2"></div>
      </div>

      {/* Liquid Glass Background */}
      <div className="liquid-glass-bg">
        <div className="glass-bubble glass-bubble-1"></div>
        <div className="glass-bubble glass-bubble-2"></div>
        <div className="glass-bubble glass-bubble-3"></div>
      </div>

      <div className="appointment-container">
        {/* Section Header */}
        <motion.div
          className="appointment-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="header-badge">
            <span>Comienza tu Proyecto</span>
          </div>
          <h2 className="appointment-title">
            Transformemos tu idea en
            <span className="title-accent"> realidad digital</span>
          </h2>
          <p className="appointment-subtitle">
            Cuéntanos sobre tu proyecto y nuestro equipo te contactará 
            para crear una solución personalizada.
          </p>
        </motion.div>
        
        <motion.form 
          className="appointment-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="form-grid">
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="input-wrapper">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  required
                  className="premium-input"
                />
                <div className="input-glow"></div>
              </div>
            </motion.div>

            <motion.div 
              className="form-group"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email corporativo"
                  required
                  className="premium-input"
                />
                <div className="input-glow"></div>
              </div>
            </motion.div>

            <motion.div 
              className="form-group form-group-full"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="input-wrapper">
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Nombre de tu empresa"
                  className="premium-input"
                />
                <div className="input-glow"></div>
              </div>
            </motion.div>

            <motion.div 
              className="form-group"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="input-wrapper">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Teléfono de contacto"
                  required
                  className="premium-input"
                />
                <div className="input-glow"></div>
              </div>
            </motion.div>

            <motion.div 
              className="form-group"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="input-wrapper">
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="premium-select"
                >
                  <option value="">Tipo de proyecto</option>
                  <option value="web">Desarrollo Web</option>
                  <option value="app">Aplicación Móvil</option>
                  <option value="custom">Solución Custom</option>
                  <option value="consultation">Consultoría Técnica</option>
                </select>
                <div className="select-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                <div className="input-glow"></div>
              </div>
            </motion.div>

            <motion.div 
              className="form-group form-group-full"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <div className="input-wrapper">
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={today}
                  required
                  className="premium-input"
                />
                <div className="input-glow"></div>
              </div>
            </motion.div>

            <motion.div 
              className="form-group form-group-full"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="input-wrapper">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe tu proyecto, objetivos y cualquier detalle relevante..."
                  rows="4"
                  className="premium-textarea"
                />
                <div className="input-glow"></div>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            className="form-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <motion.button 
              type="submit" 
              className="submit-button"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="button-text">Enviar Solicitud</span>
              <div className="button-shine"></div>
            </motion.button>
            
            <div className="alternative-section">
              <span className="alternative-text">¿Ya tienes una cuenta?</span>
              <motion.button
                type="button"
                className="login-button"
                onClick={() => window.location.href = '/login?mode=register'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Iniciar Sesión
              </motion.button>
            </div>
          </motion.div>
        </motion.form>
        
        {message.text && (
          <motion.div 
            className={`form-message ${message.type}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="message-icon">
              {message.type === 'success' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
            </div>
            <span>{message.text}</span>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default AppointmentForm;
