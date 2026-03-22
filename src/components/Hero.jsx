import { useRef, useState, useEffect } from 'react';
import './Hero.css';

function Hero() {
  const videoRef = useRef(null);
  const [businessName, setBusinessName] = useState('');
  const [currentWord, setCurrentWord] = useState(0);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const words = ['CREAR', 'DISEÑAR', 'DESARROLLAR'];

  useEffect(() => {
    // Video intro logic
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      
      const handleVideoEnd = () => {
        setIsVideoEnded(true);
        video.pause();
      };

      video.addEventListener('ended', handleVideoEnd);
      
      // Start video
      video.play().catch(() => {
        // Fallback if autoplay fails
        setIsVideoEnded(true);
      });

      return () => {
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, []);

  useEffect(() => {
    // Word rotation after video ends
    if (isVideoEnded) {
      const interval = setInterval(() => {
        setCurrentWord((prev) => (prev + 1) % words.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isVideoEnded, words.length]);

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
    <>
      {/* Noise Texture */}
      <div className="noise"></div>

      {/* SVG Filters */}
      <svg className="filters">
        <defs>
          <filter id="threshold">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 25 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <section className="hero">
        {/* Video Background */}
        <video 
          ref={videoRef}
          className={`hero-video ${isVideoEnded ? 'ended' : ''}`}
          muted 
          playsInline
          preload="auto"
        >
          <source src="/genswave.mov" type="video/mp4" />
        </video>

        {/* Hero Content - Shows after video */}
        <div className={`hero-content ${isVideoEnded ? 'visible' : ''}`}>
          <div className="morph-container">
            <div className="word-rotator">
              {words.map((word, index) => (
                <div 
                  key={word} 
                  className={`word ${index === currentWord ? 'active' : ''}`}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
          
          <p className="subtext">El Arte del Código</p>

          <div className="hero-actions">
            <div className="input-container">
              <input
                type="text"
                className="business-input"
                placeholder="Nombre de tu negocio"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStartProject()}
              />
              <button
                className="cta-button"
                onClick={handleStartProject}
              >
                <span>Comenzar</span>
                <div className="button-glow"></div>
              </button>
            </div>
            
            <p className="login-text">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login" className="login-link">
                Iniciar sesión
              </a>
            </p>
          </div>

          <div className="scroll-indicator" onClick={scrollToServices}>
            <div className="mouse">
              <div className="wheel"></div>
            </div>
            <span>Explorar</span>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="bg-elements">
          <div className="floating-dot"></div>
          <div className="floating-line"></div>
          <div className="floating-circle"></div>
        </div>
      </section>
    </>
  );
}

export default Hero;