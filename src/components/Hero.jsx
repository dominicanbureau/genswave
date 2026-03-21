import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import './Hero.css';

function Hero() {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    // System initialization loading effect
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    // Listen for appointment submission to clear input
    const handleAppointmentSubmitted = () => {
      setBusinessName('');
      console.log('Hero input cleared after appointment submission');
    };

    window.addEventListener('appointmentSubmitted', handleAppointmentSubmitted);
    
    // Immediate video autoplay - bypass all browser restrictions
    const startVideoImmediately = () => {
      const video = videoRef.current;
      if (!video) return;
      
      console.log('🎬 Starting video immediately...');
      
      // Force all necessary properties
      video.muted = true;
      video.volume = 0;
      video.defaultMuted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.loop = true;
      
      // Set attributes directly on DOM
      video.setAttribute('muted', 'true');
      video.setAttribute('playsinline', 'true');
      video.setAttribute('autoplay', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      
      // Force play immediately without waiting
      video.play().then(() => {
        console.log('✅ Video playing successfully!');
      }).catch(() => {
        // If blocked, force play on any interaction
        const forcePlay = () => {
          video.play().then(() => {
            console.log('✅ Video started after interaction!');
          }).catch(() => {
            console.log('❌ Video play failed');
          });
        };
        
        // Listen for any user interaction
        document.addEventListener('touchstart', forcePlay, { once: true, passive: true });
        document.addEventListener('click', forcePlay, { once: true, passive: true });
        document.addEventListener('scroll', forcePlay, { once: true, passive: true });
        document.addEventListener('mousemove', forcePlay, { once: true, passive: true });
        
        // Also try periodically
        const interval = setInterval(() => {
          video.play().then(() => {
            console.log('✅ Video started via interval!');
            clearInterval(interval);
          }).catch(() => {
            // Keep trying
          });
        }, 500);
        
        // Stop trying after 10 seconds
        setTimeout(() => clearInterval(interval), 10000);
      });
    };

    // Start video as soon as possible
    const video = videoRef.current;
    if (video) {
      // Try immediately
      startVideoImmediately();
      
      // Also try when video loads
      video.addEventListener('loadedmetadata', startVideoImmediately);
      video.addEventListener('canplay', startVideoImmediately);
    }

    return () => {
      window.removeEventListener('appointmentSubmitted', handleAppointmentSubmitted);
      clearInterval(loadingInterval);
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
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        webkit-playsinline="true"
        x5-playsinline="true"
      >
        <source src="/backgroundstudio.mp4" type="video/mp4" />
      </video>
      <div className="hero-video-overlay"></div>

      {/* Loading Screen */}
      {isLoading && (
        <motion.div 
          className="system-loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loading-content">
            <motion.h1 
              className="loading-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              GENSWAVE // SYSTEM INIT
            </motion.h1>
            
            <div className="loading-bar-container">
              <div className="loading-bar">
                <motion.div 
                  className="loading-progress"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <motion.span 
                className="loading-percentage"
                key={Math.floor(loadingProgress)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {Math.floor(loadingProgress)}%
              </motion.span>
            </div>
            
            <motion.p 
              className="loading-status"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              &gt; inicializando sistemas digitales...
            </motion.p>
          </div>
        </motion.div>
      )}

      <motion.div 
        className="hero-content" 
        style={{ y, opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
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
