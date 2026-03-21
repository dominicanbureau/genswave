import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import './Hero.css';

function Hero() {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [businessName, setBusinessName] = useState('');
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    const handleAppointmentSubmitted = () => {
      setBusinessName('');
    };

    window.addEventListener('appointmentSubmitted', handleAppointmentSubmitted);

    // Enhanced video autoplay
    const startVideo = () => {
      const video = videoRef.current;
      if (!video) return;
      
      video.muted = true;
      video.volume = 0;
      video.defaultMuted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.loop = true;
      
      video.play().catch(() => {
        const forcePlay = () => {
          video.play().catch(() => {});
        };
        
        document.addEventListener('touchstart', forcePlay, { once: true, passive: true });
        document.addEventListener('click', forcePlay, { once: true, passive: true });
        document.addEventListener('scroll', forcePlay, { once: true, passive: true });
      });
    };

    const video = videoRef.current;
    if (video) {
      startVideo();
      video.addEventListener('loadedmetadata', startVideo);
      video.addEventListener('canplay', startVideo);
    }

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
    <section className="hero" ref={ref}>
      {/* Crystal Background Layer */}
      <div className="crystal-layer">
        <div className="crystal-orb crystal-orb-1"></div>
        <div className="crystal-orb crystal-orb-2"></div>
        <div className="crystal-orb crystal-orb-3"></div>
      </div>

      {/* Liquid Glass Background */}
      <div className="liquid-glass-bg">
        <div className="glass-bubble glass-bubble-1"></div>
        <div className="glass-bubble glass-bubble-2"></div>
        <div className="glass-bubble glass-bubble-3"></div>
        <div className="glass-bubble glass-bubble-4"></div>
      </div>

      {/* Video Background */}
      <video 
        ref={videoRef}
        className="hero-video"
        autoPlay 
        loop 
        muted 
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
      >
        <source src="/backgroundstudio.mp4" type="video/mp4" />
      </video>

      {/* Main Content */}
      <motion.div 
        className="hero-container"
        style={{ y, opacity }}
      >
        <div className="hero-content">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="badge-text">Desarrollo Digital Premium</span>
          </motion.div>

          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <span className="title-line">Desarrollamos el futuro</span>
            <span className="title-line title-accent">de tu negocio</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Creamos experiencias digitales excepcionales que transforman 
            ideas en soluciones tecnológicas de vanguardia
          </motion.p>
          
          <motion.div
            className="hero-input-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="input-container">
              <div className="input-wrapper">
                <input
                  type="text"
                  className="premium-input"
                  placeholder="Nombre de tu negocio"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStartProject()}
                />
                <div className="input-glow"></div>
              </div>
              <motion.button
                className="cta-button"
                onClick={handleStartProject}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="button-text">Comenzar</span>
                <div className="button-shine"></div>
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="hero-login-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <p className="login-text">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login" className="login-link">
                Iniciar sesión
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="scroll-indicator"
        onClick={scrollToServices}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="scroll-text">Explorar</div>
        <motion.div
          className="scroll-arrow"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;