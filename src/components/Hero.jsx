import { useRef, useState, useEffect } from 'react';
import './Hero.css';

function Hero() {
  const videoRef = useRef(null);
  const [businessName, setBusinessName] = useState('');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      
      const handleLoadedData = () => {
        setIsVideoLoaded(true);
        video.play().catch(console.log);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, []);

  useEffect(() => {
    const handleAppointmentSubmitted = () => {
      setBusinessName('');
    };

    window.addEventListener('appointmentSubmitted', handleAppointmentSubmitted);

    return () => {
      window.removeEventListener('appointmentSubmitted', handleAppointmentSubmitted);
    };
  }, []);

  const scrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartProject = () => {
    if (businessName.trim()) {
      sessionStorage.setItem('businessName', businessName.trim());
      window.dispatchEvent(new CustomEvent('businessNameSet', { 
        detail: { businessName: businessName.trim() } 
      }));
    }
    setTimeout(() => {
      scrollToContact();
    }, 100);
  };

  const scrollToServices = () => {
    const servicesSection = document.querySelector('.services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      {/* Video Background */}
      <div className="video-container">
        <video 
          ref={videoRef}
          className="hero-video"
          muted 
          playsInline
          loop
          preload="auto"
        >
          <source src="/genswave.mov" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Glass Container */}
      <div className={`glass-container ${isVideoLoaded ? 'visible' : ''}`}>
        <div className="hero-content">
          <div className="hero-badge">
            <span>Desarrollo Premium</span>
          </div>
          
          <h1 className="hero-title">
            Transformamos ideas en
            <span className="title-highlight"> experiencias digitales</span>
          </h1>
          
          <p className="hero-subtitle">
            Creamos soluciones tecnológicas excepcionales que impulsan 
            el crecimiento de tu negocio con la más alta calidad.
          </p>

          <div className="hero-actions">
            <div className="input-group">
              <input
                type="text"
                className="glass-input"
                placeholder="Nombre de tu negocio"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStartProject()}
              />
              <button
                className="glass-button"
                onClick={handleStartProject}
              >
                <span>Comenzar Proyecto</span>
                <div className="button-shine"></div>
              </button>
            </div>
            
            <p className="login-text">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login" className="login-link">
                Iniciar sesión
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator" onClick={scrollToServices}>
        <div className="scroll-line"></div>
        <span>Explorar</span>
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="float-element float-1"></div>
        <div className="float-element float-2"></div>
        <div className="float-element float-3"></div>
      </div>
    </section>
  );
}

export default Hero;