import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const morphContainerRef = useRef(null);
  const [businessName, setBusinessName] = useState('');
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Professional morphing text effect
      const words = document.querySelectorAll('.morph-word');
      if (words.length > 0) {
        gsap.set(words, {
          opacity: 0,
          filter: 'blur(20px)',
          scale: 0.8
        });

        const tl = gsap.timeline({ repeat: -1 });
        
        words.forEach((word, index) => {
          tl.to(word, {
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1,
            duration: 0.8,
            ease: "power2.out"
          }, index * 3)
          .to(word, {
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1,
            duration: 1.4
          })
          .to(word, {
            opacity: 0,
            filter: 'blur(20px)',
            scale: 1.2,
            duration: 0.8,
            ease: "power2.in"
          });
        });
      }

      // Subtle floating elements
      const floatingElements = document.querySelectorAll('.floating-element');
      floatingElements.forEach((element, index) => {
        gsap.to(element, {
          y: () => gsap.utils.random(-20, 20),
          x: () => gsap.utils.random(-15, 15),
          rotation: () => gsap.utils.random(-5, 5),
          duration: () => gsap.utils.random(4, 8),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.5
        });
      });

      // Professional scroll-triggered animations
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(".hero-content", {
            y: progress * 50,
            scale: 1 - progress * 0.1,
            opacity: 1 - progress * 0.5,
            duration: 0.3
          });
        }
      });

      // Magnetic button effect
      const magneticBtn = document.querySelector('.magnetic-btn');
      if (magneticBtn) {
        magneticBtn.addEventListener('mousemove', (e) => {
          const rect = magneticBtn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          gsap.to(magneticBtn, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        magneticBtn.addEventListener('mouseleave', () => {
          gsap.to(magneticBtn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
          });
        });
      }

    }, heroRef);

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
      ctx.revert();
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
      {/* Noise Texture */}
      <div className="noise"></div>

      {/* SVG Filters for Morphing */}
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

      <div className="hero-container" ref={heroRef}>
        {/* Subtle Floating Elements */}
        <div className="floating-elements">
          <div className="floating-element floating-dot"></div>
          <div className="floating-element floating-line"></div>
          <div className="floating-element floating-circle"></div>
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
          className="hero-content"
          style={{ y, opacity }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="badge-text">Desarrollo Digital Premium</span>
          </motion.div>

          {/* Morphing Title */}
          <div className="morph-container" ref={morphContainerRef}>
            <div className="word-rotator">
              <div className="morph-word">CREAMOS</div>
              <div className="morph-word">DISEÑAMOS</div>
              <div className="morph-word">DESARROLLAMOS</div>
            </div>
          </div>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            El futuro de tu negocio
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
                className="cta-button magnetic-btn"
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
        </motion.div>

        {/* Professional Scroll Indicator */}
        <motion.div 
          className="scroll-indicator"
          onClick={scrollToServices}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="mouse">
            <div className="wheel"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;