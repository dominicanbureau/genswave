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
    
    // Enhanced video play for mobile with aggressive strategies
    const playVideo = async () => {
      if (videoRef.current) {
        const video = videoRef.current;
        
        // Set video properties for maximum mobile compatibility
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.defaultMuted = true;
        video.volume = 0;
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('muted', 'true');
        
        // Force load the video
        video.load();
        
        try {
          // Force play immediately
          const playPromise = video.play();
          if (playPromise !== undefined) {
            await playPromise;
            console.log('Video playing successfully');
          }
        } catch (error) {
          console.log('Video autoplay prevented, setting up mobile fallbacks...', error);
          
          // Immediate retry without waiting for interaction
          setTimeout(async () => {
            try {
              await video.play();
              console.log('Video started on retry');
            } catch (e) {
              console.log('Retry failed, setting up interaction listeners');
            }
          }, 100);
          
          // Multiple mobile fallback strategies
          const playOnInteraction = async (event) => {
            try {
              event.preventDefault();
              await video.play();
              console.log('Video started on user interaction');
              // Remove all listeners once successful
              document.removeEventListener('touchstart', playOnInteraction);
              document.removeEventListener('touchend', playOnInteraction);
              document.removeEventListener('touchmove', playOnInteraction);
              document.removeEventListener('click', playOnInteraction);
              document.removeEventListener('scroll', playOnInteraction);
              document.removeEventListener('keydown', playOnInteraction);
              window.removeEventListener('focus', playOnInteraction);
              window.removeEventListener('load', playOnInteraction);
            } catch (e) {
              console.log('Mobile play attempt failed:', e);
            }
          };
          
          // Add multiple event listeners for maximum coverage
          document.addEventListener('touchstart', playOnInteraction, { passive: false });
          document.addEventListener('touchend', playOnInteraction, { passive: false });
          document.addEventListener('touchmove', playOnInteraction, { passive: false });
          document.addEventListener('click', playOnInteraction, { passive: false });
          document.addEventListener('scroll', playOnInteraction, { passive: false });
          document.addEventListener('keydown', playOnInteraction, { passive: false });
          window.addEventListener('focus', playOnInteraction, { passive: false });
          window.addEventListener('load', playOnInteraction, { passive: false });
        }
      }
    };

    // Try to play immediately
    playVideo();
    
    // Try multiple times with different delays for mobile browsers
    const timeouts = [100, 500, 1000, 2000];
    const timeoutIds = timeouts.map(delay => 
      setTimeout(playVideo, delay)
    );
    
    // Try on page visibility change (mobile browsers often pause videos)
    const handleVisibilityChange = () => {
      if (!document.hidden && videoRef.current) {
        playVideo();
      }
    };
    
    // Try on window focus (mobile browsers)
    const handleWindowFocus = () => {
      if (videoRef.current) {
        playVideo();
      }
    };
    
    // Try on orientation change (mobile)
    const handleOrientationChange = () => {
      setTimeout(playVideo, 500);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('appointmentSubmitted', handleAppointmentSubmitted);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('orientationchange', handleOrientationChange);
      timeoutIds.forEach(clearTimeout);
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
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        x-webkit-airplay="allow"
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        data-setup="{}"
        poster=""
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
