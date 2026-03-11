import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ContactPage.css';

function ContactPage() {
  return (
    <div className="contact-page">
      <Navbar />
      <HeroSection />
      <ContactFormSection />
      <InfoSection />
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="contact-hero">
      <motion.div
        className="contact-hero-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          HABLEMOS SOBRE
          <span className="gradient-text"> TU PRÓXIMO PROYECTO</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Estamos aquí para ayudarte a transformar tus ideas en realidad.
          Cuéntanos sobre tu proyecto y te responderemos en menos de 24 horas.
        </motion.p>
      </motion.div>
      
      <AnimatedBackground />
    </section>
  );
}

function AnimatedBackground() {
  return (
    <div className="animated-background">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-particle"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.5, 1],
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}
    </div>
  );
}

function ContactFormSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    preferredDate: '',
    message: '',
    howFound: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [focusedField, setFocusedField] = useState(null);

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
        setMessage({ text: '¡Mensaje enviado! Te contactaremos pronto.', type: 'success' });
        setFormData({
          name: '', email: '', phone: '', company: '', service: '',
          budget: '', preferredDate: '', message: '', howFound: ''
        });
      } else {
        setMessage({ text: 'Error al enviar. Intenta de nuevo.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error al enviar. Intenta de nuevo.', type: 'error' });
    }
    
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="contact-form-section" ref={ref}>
      <div className="form-container">
        <motion.div
          className="form-intro"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2>Cuéntanos sobre tu proyecto</h2>
          <p>Completa el formulario y nos pondremos en contacto contigo para discutir cómo podemos ayudarte.</p>
          
          <div className="contact-benefits">
            <BenefitItem 
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              }
              title="Respuesta rápida" 
              description="Te respondemos en menos de 24 horas"
              delay={0.2}
              isInView={isInView}
            />
            <BenefitItem 
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
              title="Consulta gratuita" 
              description="Primera sesión sin compromiso"
              delay={0.3}
              isInView={isInView}
            />
            <BenefitItem 
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              }
              title="Propuesta personalizada" 
              description="Solución adaptada a tus necesidades"
              delay={0.4}
              isInView={isInView}
            />
          </div>
        </motion.div>
        
        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="form-grid">
            <FormField
              label="Nombre completo"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              focused={focusedField === 'name'}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
            />
            
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              focused={focusedField === 'email'}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
            
            <FormField
              label="Teléfono"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              focused={focusedField === 'phone'}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
            />
            
            <FormField
              label="Empresa"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              focused={focusedField === 'company'}
              onFocus={() => setFocusedField('company')}
              onBlur={() => setFocusedField(null)}
            />
          </div>
          
          <FormField
            label="Servicio de interés"
            name="service"
            type="select"
            value={formData.service}
            onChange={handleChange}
            required
            options={[
              { value: '', label: 'Selecciona un servicio' },
              { value: 'web', label: 'Página Web' },
              { value: 'app', label: 'Aplicación Móvil' },
              { value: 'custom', label: 'Solución a Medida' },
              { value: 'consultation', label: 'Consultoría' }
            ]}
            focused={focusedField === 'service'}
            onFocus={() => setFocusedField('service')}
            onBlur={() => setFocusedField(null)}
          />
          
          <div className="form-grid">
            <FormField
              label="Presupuesto estimado"
              name="budget"
              type="select"
              value={formData.budget}
              onChange={handleChange}
              options={[
                { value: '', label: 'Selecciona un rango' },
                { value: '5k-10k', label: '$5,000 - $10,000' },
                { value: '10k-25k', label: '$10,000 - $25,000' },
                { value: '25k-50k', label: '$25,000 - $50,000' },
                { value: '50k+', label: '$50,000+' }
              ]}
              focused={focusedField === 'budget'}
              onFocus={() => setFocusedField('budget')}
              onBlur={() => setFocusedField(null)}
            />
            
            <FormField
              label="Fecha preferida para iniciar"
              name="preferredDate"
              type="date"
              value={formData.preferredDate}
              onChange={handleChange}
              min={today}
              required
              focused={focusedField === 'preferredDate'}
              onFocus={() => setFocusedField('preferredDate')}
              onBlur={() => setFocusedField(null)}
            />
          </div>
          
          <FormField
            label="Cuéntanos sobre tu proyecto"
            name="message"
            type="textarea"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            focused={focusedField === 'message'}
            onFocus={() => setFocusedField('message')}
            onBlur={() => setFocusedField(null)}
          />
          
          <FormField
            label="¿Cómo nos encontraste?"
            name="howFound"
            type="select"
            value={formData.howFound}
            onChange={handleChange}
            options={[
              { value: '', label: 'Selecciona una opción' },
              { value: 'google', label: 'Google' },
              { value: 'social', label: 'Redes sociales' },
              { value: 'referral', label: 'Recomendación' },
              { value: 'other', label: 'Otro' }
            ]}
            focused={focusedField === 'howFound'}
            onFocus={() => setFocusedField('howFound')}
            onBlur={() => setFocusedField(null)}
          />
          
          <motion.button
            type="submit"
            className="submit-button"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Enviar mensaje
          </motion.button>
          
          {message.text && (
            <motion.div
              className={`form-message ${message.type}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message.text}
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
}

function FormField({ label, name, type, value, onChange, required, options, focused, onFocus, onBlur, ...props }) {
  return (
    <motion.div 
      className={`form-field ${focused ? 'focused' : ''}`}
      animate={{ scale: focused ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <label htmlFor={name}>
        {label} {required && <span className="required">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          {...props}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          {...props}
        />
      )}
    </motion.div>
  );
}

function BenefitItem({ icon, title, description, delay, isInView }) {
  return (
    <motion.div
      className="benefit-item"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ x: 10 }}
    >
      <div className="benefit-icon">{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </motion.div>
  );
}

function InfoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="info-section" ref={ref}>
      <motion.div
        className="info-content"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2>Otras formas de contactarnos</h2>
        
        <div className="info-grid">
          <InfoCard
            title="Email"
            content="contacto@genswave.com"
            description="Respuesta en 24 horas"
            delay={0.2}
            isInView={isInView}
          />
          <InfoCard
            title="Teléfono"
            content="+1 (555) 123-4567"
            description="Lun - Vie, 9am - 6pm"
            delay={0.3}
            isInView={isInView}
          />
          <InfoCard
            title="Ubicación"
            content="San Francisco, CA"
            description="Trabajamos remotamente"
            delay={0.4}
            isInView={isInView}
          />
        </div>
      </motion.div>
    </section>
  );
}

function InfoCard({ title, content, description, delay, isInView }) {
  return (
    <motion.div
      className="info-card"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
    >
      <h3>{title}</h3>
      <p className="info-main">{content}</p>
      <p className="info-sub">{description}</p>
    </motion.div>
  );
}

export default ContactPage;
