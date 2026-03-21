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
  const particlesRef = useRef(null);
  const morphingShapeRef = useRef(null);
  const hologramRef = useRef(null);
  const [businessName, setBusinessName] = useState('');
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Advanced particle system
      const particles = particlesRef.current?.children;
      if (particles) {
        gsap.set(particles, {
          x: () => gsap.utils.random(-200, 200),
          y: () => gsap.utils.random(-200, 200),
          scale: () => gsap.utils.random(0.1, 1),
          opacity: () => gsap.utils.random(0.1, 0.8),
        });

        gsap.to(particles, {
          duration: () => gsap.utils.random(3, 8),
          x: () => gsap.utils.random(-400, 400),
          y: () => gsap.utils.random(-400, 400),
          rotation: () => gsap.utils.random(0, 360),
          scale: () => gsap.utils.random(0.2, 1.2),
          opacity: () => gsap.utils.random(0.2, 1),
          repeat: -1,
          yoyo: true,
          ease: "none",
          stagger: {
            each: 0.1,
            from: "random"
          }
        });
      }

      // Holographic text effect
      if (hologramRef.current) {
        gsap.to(hologramRef.current, {
          duration: 2,
          textShadow: "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff",
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut"
        });
      }

      // Advanced scroll-triggered animations
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(".hero-content", {
            y: progress * 100,
            scale: 1 - progress * 0.2,
            opacity: 1 - progress * 0.8,
            duration: 0.3
          });
          
          gsap.to(".floating-elements", {
            rotation: progress * 360,
            scale: 1 + progress * 0.5,
            duration: 0.3
          });
        }
      });

      // Magnetic cursor effect for buttons
      const buttons = document.querySelectorAll('.magnetic-btn');
      buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
          });
        });
      });

      // Liquid morphing background
      const liquidTl = gsap.timeline({ repeat: -1 });
      liquidTl.to(".liquid-blob", {
        duration: 8,
        ease: "power1.inOut"
      })
      .to(".liquid-blob", {
        duration: 8,
        ease: "power1.inOut"
      });

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
      <div className="hero-container" ref={heroRef}>
        {/* Advanced Particle System */}
        <div className="particle-system" ref={particlesRef}>
          {[...Array(50)].map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>

        {/* Morphing Geometric Shapes */}
        <div className="morphing-shapes">
          <svg className="morphing-svg" viewBox="0 0 100 100">
            <path
              ref={morphingShapeRef}
              d="M50,20 C70,20 80,30 80,50 C80,70 70,80 50,80 C30,80 20,70 20,50 C20,30 30,20 50,20 Z"
              className="morphing-path"
            />
          </svg>
        </div>

        {/* Liquid Morphing Background */}
        <div className="liquid-background">
          <svg className="liquid-svg" viewBox="0 0 100 100">
            <path
              className="liquid-blob"
              d="M50,20 C70,20 80,30 80,50 C80,70 70,80 50,80 C30,80 20,70 20,50 C20,30 30,20 50,20 Z"
            />
          </svg>
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-cube"></div>
          <div className="floating-sphere"></div>
          <div className="floating-pyramid"></div>
        </div>

        {/* Neural Network Background */}
        <div className="neural-network">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="neural-node" />
          ))}
        </div>

        {/* Video Background with Advanced Effects */}
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

        {/* Main Content with Advanced Effects */}
        <motion.div 
          className="hero-content"
          style={{ y, opacity }}
        >
          <motion.div
            className="hero-badge holographic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="badge-text">Desarrollo Digital de Élite</span>
            <div className="badge-glow"></div>
          </motion.div>

          <motion.h1 
            className="hero-title"
            ref={hologramRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <span className="title-line glitch-text">Creamos el futuro</span>
            <span className="title-line title-accent holographic-text">de tu negocio</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Experiencias digitales revolucionarias que transforman 
            ideas en soluciones tecnológicas de vanguardia
          </motion.p>
          
          <motion.div
            className="hero-input-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="input-container">
              <div className="input-wrapper advanced-input">
                <input
                  type="text"
                  className="premium-input"
                  placeholder="Nombre de tu negocio"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStartProject()}
                />
                <div className="input-glow"></div>
                <div className="input-particles"></div>
              </div>
              <motion.button
                className="cta-button magnetic-btn"
                onClick={handleStartProject}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="button-text">Comenzar</span>
                <div className="button-shine"></div>
                <div className="button-ripple"></div>
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
              <a href="/login" className="login-link holographic-link">
                Iniciar sesión
              </a>
            </p>
          </motion.div>
        </motion.div>

        {/* Advanced Scroll Indicator */}
        <motion.div 
          className="scroll-indicator advanced-scroll"
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
          <div className="scroll-ripple"></div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;