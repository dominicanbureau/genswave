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
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Agenda una cita
        </motion.h2>
        
        <motion.p 
          className="appointment-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Cuéntanos sobre tu proyecto y te contactaremos pronto
        </motion.p>
        
        <motion.form 
          className="appointment-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="form-row">
            <motion.div className="form-group" whileFocus={{ scale: 1.02 }}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre completo"
                required
              />
            </motion.div>
            <motion.div className="form-group" whileFocus={{ scale: 1.02 }}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </motion.div>
          </div>
          
          <div className="form-row">
            <motion.div className="form-group form-group-full" whileFocus={{ scale: 1.02 }}>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Nombre del negocio"
              />
            </motion.div>
          </div>
          
          <div className="form-row">
            <motion.div className="form-group" whileFocus={{ scale: 1.02 }}>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Teléfono"
                required
              />
            </motion.div>
            <motion.div className="form-group" whileFocus={{ scale: 1.02 }}>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un servicio</option>
                <option value="web">Página Web</option>
                <option value="app">Aplicación Móvil</option>
                <option value="custom">Solución a Medida</option>
                <option value="consultation">Consultoría</option>
              </select>
            </motion.div>
          </div>
          
          <div className="form-row">
            <motion.div className="form-group" whileFocus={{ scale: 1.02 }}>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                min={today}
                required
              />
            </motion.div>
          </div>
          
          <motion.div className="form-group" whileFocus={{ scale: 1.02 }}>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Cuéntanos sobre tu proyecto"
              rows="5"
            />
          </motion.div>
          
          <motion.button 
            type="submit" 
            className="cta-button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Enviar solicitud
          </motion.button>
          
          <motion.div 
            className="alternative-option"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <span className="alternative-text">O crea una cuenta</span>
            <motion.button
              type="button"
              className="create-account-btn"
              onClick={() => window.location.href = '/login?mode=register'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Registrarse
            </motion.button>
          </motion.div>
        </motion.form>
        
        {message.text && (
          <motion.div 
            className={`form-message ${message.type}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {message.text}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default AppointmentForm;
