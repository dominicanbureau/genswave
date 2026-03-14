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
    
    // Simplified but more effective video autoplay
    const playVideo = () => {
      const video = videoRef.current;
      if (!video) return;
      
      // Ensure video is properly configured
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.loop = true;
      video.volume = 0;
      
      // Force play immediately
      const attemptPlay = async () => {
        try {
          video.currentTime = 0;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            await playPromise;
            console.log('✅ Video playing successfully');
            return true;
          }
        } catch (error) {
          console.log('❌ Video play failed:', error.message);
          return false;
        }
      };
      
      // Try to play immediately
      attemptPlay();
      
      // Set up single interaction listener that removes itself
      const playOnInteraction = async (event) => {
        console.log('🎬 Attempting video play on:', event.type);
        const success = await attemptPlay();
        if (success) {
          // Remove listener after successful play
          document.removeEventListener('touchstart', playOnInteraction);
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('scroll', playOnInteraction);
          document.removeEventListener('keydown', playOnInteraction);
        }
      };
      
      // Add minimal interaction listeners
      document.addEventListener('touchstart', playOnInteraction, { once: true, passive: true });
      document.addEventListener('click', playOnInteraction, { once: true, passive: true });
      document.addEventListener('scroll', playOnInteraction, { once: true, passive: true });
      document.addEventListener('keydown', playOnInteraction, { once: true, passive: true });
    };

    // Try to play when video loads
    const video = videoRef.current;
    if (video) {
      if (video.readyState >= 3) {
        // Video is already loaded
        playVideo();
      } else {
        // Wait for video to load
        video.addEventListener('loadeddata', playVideo, { once: true });
        video.addEventListener('canplay', playVideo, { once: true });
      }
    }
    
    // Also try after component mount
    const mountTimeout = setTimeout(playVideo, 100);

    return () => {
      window.removeEventListener('appointmentSubmitted', handleAppointmentSubmitted);
      clearTimeout(mountTimeout);
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
        preload="metadata"
        controls={false}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
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
            DESARROLLAMOS EL FUTURO
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

        <motion.div
          className="hero-login-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <p>
            ¿Ya tienes una cuenta?{' '}
            <a href="/login" className="login-link">
              <strong>Inicia sesión</strong>
            </a>
          </p>
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
