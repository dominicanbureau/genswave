import { useRef, useState, useEffect } from 'react';
import './Hero.css';

const floatingIcons = [
  'plus_code', 'file_copy', 'code_blocks', 'device_hub', 'keyboard_command_key',
  'terminal', 'spark', 'code', 'deployed_code', 'commit',
  'pen_spark', 'folder', 'search_spark', 'keyboard_return', 'dashboard_customize',
  'spark', 'merge', 'keyboard_tab', 'check_circle', 'refresh',
  'data_object', 'developer_mode_tv'
];

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

      {/* Floating Icons Background */}
      <div className="floating-icons-container">
        {floatingIcons.map((icon, index) => (
          <div 
            key={`${icon}-${index}`}
            className="floating-icon"
            style={{
              '--delay': `${index * 0.3}s`,
              '--duration': `${20 + (index % 5) * 5}s`,
              '--start-x': `${(index % 8) * 12}%`,
              '--start-y': `${Math.floor(index / 8) * 25}%`,
              '--end-x': `${((index + 3) % 8) * 12}%`,
              '--end-y': `${(Math.floor(index / 8) + 1) * 25}%`
            }}
          >
            <span className="material-icons">{icon}</span>
          </div>
        ))}
      </div>

      <div className="hero-content">
        <h1 className="hero-title">
          <span className="title-text">Desarrollamos el futuro</span>
          <span className="title-text">de tu negocio</span>
        </h1>
        
        <p className="hero-subtitle">
          Experience liftoff with next-generation development
        </p>

        <div className="hero-actions">
          <button className="hero-btn primary" onClick={handleStartProject}>
            <span>Comenzar proyecto</span>
          </button>
          <button className="hero-btn secondary">
            <span className="material-icons">play_arrow</span>
            <span>Play intro</span>
            <span className="material-icons">play_arrow</span>
          </button>
        </div>

        <div className="hero-input-section">
          <input
            type="text"
            className="hero-input"
            placeholder="Nombre de tu negocio"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStartProject()}
          />
        </div>

        <p className="hero-login">
          ¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
        </p>
      </div>
    </section>
  );
}

export default Hero;