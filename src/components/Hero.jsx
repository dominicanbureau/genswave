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

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    // Listen for appointment submission to clear input
    const handleAppointmentSubmitted = () => {
      setBusinessName('');
      console.log('Hero input cleared after appointment submission');
    };

    window.addEventListener('appointmentSubmitted', handleAppointmentSubmitted);
    
    // Force video play with multiple attempts
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.play()
          .then(() => {
            console.log('Video playing successfully');
          })
          .catch(error => {
            console.log('Video autoplay prevented, retrying...', error);
            // Retry after a short delay
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.play().catch(e => console.log('Retry failed:', e));
              }
            }, 1000);
          });
      }
    };

    // Try to play immediately
    playVideo();
    
    // Also try after a short delay
    const playTimeout = setTimeout(playVideo, 500);
    
    // Try on user interaction
    const handleInteraction = () => {
      playVideo();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('appointmentSubmitted', handleAppointmentSubmitted);
      clearTimeout(playTimeout);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  const scrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartProject = () => {
    // Store business name in sessionStorage
    if (businessName.trim()) {
      sessionStorage.setItem('businessName', businessName.trim());
      console.log('Business name saved:', businessName.trim());
      
      // Dispatch custom event to notify AppointmentForm
      window.dispatchEvent(new CustomEvent('businessNameSet', { 
        detail: { businessName: businessName.trim() } 
      }));
    }
    // Small delay to ensure sessionStorage is set before scrolling
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
      <video 
        ref={videoRef}
        className="hero-video-background"
        autoPlay 
        loop 
        muted 
        playsInline
        preload="auto"
        controls={false}
      >
        <source src="/backgroundstudio.mp4" type="video/mp4" />
      </video>
      <div className="hero-video-overlay"></div>

      <motion.div className="hero-content" style={{ y, opacity }}>
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.span 
            className="line"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            DISEÑAMOS EL FUTURO
          </motion.span>
          <motion.span 
            className="line"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            DE TU NEGOCIO
          </motion.span>
        </motion.h1>
        
        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Creamos páginas web y aplicaciones que transforman ideas en experiencias digitales excepcionales
        </motion.p>
        
        <motion.div
          className="hero-input-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="input-wrapper">
            <input
              type="text"
              className="styled-input-bar"
              placeholder=" "
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStartProject()}
            />
            <label className="input-label">Nombre de tu negocio</label>
          </div>
          <motion.button
            className="start-button"
            onClick={handleStartProject}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Iniciemos
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div 
        className="scroll-indicator"
        onClick={scrollToServices}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <span>VER MAS</span>
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </motion.svg>
      </motion.div>
    </section>
  );
}

export default Hero;
