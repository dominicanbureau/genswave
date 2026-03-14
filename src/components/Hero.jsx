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
    
    // Ultra-aggressive video autoplay for mobile
    const playVideo = async () => {
      if (videoRef.current) {
        const video = videoRef.current;
        
        // Set all possible video properties for mobile compatibility
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.defaultMuted = true;
        video.volume = 0;
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('muted', 'true');
        video.setAttribute('autoplay', 'true');
        video.setAttribute('loop', 'true');
        
        // Force properties directly
        Object.defineProperty(video, 'muted', { value: true, writable: false });
        Object.defineProperty(video, 'volume', { value: 0, writable: false });
        
        try {
          // Multiple immediate play attempts
          await video.play();
          console.log('Video playing successfully');
        } catch (error) {
          console.log('Initial autoplay failed, trying aggressive fallbacks...', error);
          
          // Immediate aggressive retries
          const retryAttempts = [50, 100, 200, 500, 1000];
          retryAttempts.forEach((delay, index) => {
            setTimeout(async () => {
              try {
                video.currentTime = 0;
                await video.play();
                console.log(`Video started on retry attempt ${index + 1}`);
              } catch (e) {
                console.log(`Retry ${index + 1} failed:`, e);
              }
            }, delay);
          });
          
          // Set up interaction listeners with immediate trigger
          const playOnAnyInteraction = async (event) => {
            try {
              video.currentTime = 0;
              await video.play();
              console.log('Video started on user interaction:', event.type);
              
              // Remove all listeners once successful
              document.removeEventListener('touchstart', playOnAnyInteraction, true);
              document.removeEventListener('touchend', playOnAnyInteraction, true);
              document.removeEventListener('touchmove', playOnAnyInteraction, true);
              document.removeEventListener('click', playOnAnyInteraction, true);
              document.removeEventListener('scroll', playOnAnyInteraction, true);
              document.removeEventListener('keydown', playOnAnyInteraction, true);
              document.removeEventListener('mousemove', playOnAnyInteraction, true);
              window.removeEventListener('focus', playOnAnyInteraction, true);
              window.removeEventListener('blur', playOnAnyInteraction, true);
              window.removeEventListener('resize', playOnAnyInteraction, true);
            } catch (e) {
              console.log('Interaction play failed:', e);
            }
          };
          
          // Add listeners with capture phase for maximum coverage
          document.addEventListener('touchstart', playOnAnyInteraction, { capture: true, passive: false });
          document.addEventListener('touchend', playOnAnyInteraction, { capture: true, passive: false });
          document.addEventListener('touchmove', playOnAnyInteraction, { capture: true, passive: false });
          document.addEventListener('click', playOnAnyInteraction, { capture: true, passive: false });
          document.addEventListener('scroll', playOnAnyInteraction, { capture: true, passive: false });
          document.addEventListener('keydown', playOnAnyInteraction, { capture: true, passive: false });
          document.addEventListener('mousemove', playOnAnyInteraction, { capture: true, passive: false });
          window.addEventListener('focus', playOnAnyInteraction, { capture: true, passive: false });
          window.addEventListener('blur', playOnAnyInteraction, { capture: true, passive: false });
          window.addEventListener('resize', playOnAnyInteraction, { capture: true, passive: false });
        }
      }
    };

    // Try to play immediately when component mounts
    playVideo();
    
    // Try multiple times with different delays
    const timeouts = [10, 50, 100, 250, 500, 1000, 2000, 3000];
    const timeoutIds = timeouts.map(delay => 
      setTimeout(playVideo, delay)
    );
    
    // Try on various browser events
    const handleVisibilityChange = () => {
      if (!document.hidden && videoRef.current) {
        setTimeout(playVideo, 100);
      }
    };
    
    const handleWindowFocus = () => {
      if (videoRef.current) {
        setTimeout(playVideo, 100);
      }
    };
    
    const handleOrientationChange = () => {
      setTimeout(playVideo, 500);
    };
    
    const handlePageShow = () => {
      setTimeout(playVideo, 100);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('DOMContentLoaded', playVideo);
    window.addEventListener('load', playVideo);

    return () => {
      window.removeEventListener('appointmentSubmitted', handleAppointmentSubmitted);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('DOMContentLoaded', playVideo);
      window.removeEventListener('load', playVideo);
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
