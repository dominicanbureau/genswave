import { useRef, useState, useEffect } from 'react';
import './Hero.css';

function Hero() {
  const videoRef = useRef(null);
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleAppointmentSubmitted = () => setBusinessName('');
    window.addEventListener('appointmentSubmitted', handleAppointmentSubmitted);
    return () => window.removeEventListener('appointmentSubmitted', handleAppointmentSubmitted);
  }, []);

  const handleStartProject = () => {
    if (businessName.trim()) {
      sessionStorage.setItem('businessName', businessName.trim());
      window.dispatchEvent(new CustomEvent('businessNameSet', { 
        detail: { businessName: businessName.trim() } 
      }));
    }
    setTimeout(() => {
      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section className="hero">
      <video 
        ref={videoRef}
        className="hero-video"
        muted 
        playsInline
        loop
        autoPlay
      >
        <source src="/genswave.mov" type="video/mp4" />
      </video>

      <div className="hero-content">
        <h1 className="hero-title">
          Desarrollamos el futuro de tu negocio
        </h1>
        
        <p className="hero-subtitle">
          Transformamos ideas en experiencias digitales excepcionales con tecnología de vanguardia
        </p>

        <div className="hero-actions">
          <input
            type="text"
            className="hero-input"
            placeholder="Nombre de tu negocio"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStartProject()}
          />
          <button className="hero-button" onClick={handleStartProject}>
            Comenzar proyecto
          </button>
        </div>

        <p className="hero-login">
          ¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
        </p>
      </div>
    </section>
  );
}

export default Hero;