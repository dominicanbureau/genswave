import { motion, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Process.css';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Descubrimiento',
    subtitle: 'Análisis profundo',
    description: 'Entendemos tu visión, analizamos el mercado y definimos objetivos claros para tu proyecto digital.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    duration: '1-2 semanas',
    glowColor: '#00ffff'
  },
  {
    number: '02',
    title: 'Diseño',
    subtitle: 'Experiencia visual',
    description: 'Creamos prototipos interactivos y diseños que combinan estética moderna con funcionalidad excepcional.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    duration: '2-3 semanas',
    glowColor: '#ff00ff'
  },
  {
    number: '03',
    title: 'Desarrollo',
    subtitle: 'Construcción técnica',
    description: 'Desarrollamos con las tecnologías más avanzadas, asegurando código limpio, escalable y optimizado.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    duration: '3-6 semanas',
    glowColor: '#ffff00'
  },
  {
    number: '04',
    title: 'Lanzamiento',
    subtitle: 'Despliegue y optimización',
    description: 'Desplegamos tu proyecto con monitoreo continuo, optimizaciones de rendimiento y soporte completo.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
    ),
    duration: '1-2 semanas',
    glowColor: '#00ff80'
  }
];

function Process() {
  const ref = useRef(null);
  const processStepsRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Advanced timeline animation
      const steps = processStepsRef.current?.children;
      if (steps) {
        gsap.set(steps, {
          x: -100,
          opacity: 0,
          rotationY: -45,
          transformPerspective: 1000
        });

        ScrollTrigger.create({
          trigger: processStepsRef.current,
          start: "top 70%",
          end: "bottom 30%",
          onEnter: () => {
            gsap.to(steps, {
              x: 0,
              opacity: 1,
              rotationY: 0,
              duration: 1.5,
              ease: "power3.out",
              stagger: {
                each: 0.3,
                from: "start"
              }
            });
          }
        });

        // Interactive hover effects
        Array.from(steps).forEach((step, index) => {
          const stepData = steps[index];
          
          step.addEventListener('mouseenter', () => {
            gsap.to(step, {
              scale: 1.05,
              rotationY: 5,
              z: 50,
              duration: 0.5,
              ease: "power2.out"
            });

            gsap.to(step.querySelector('.step-icon'), {
              rotation: 360,
              scale: 1.3,
              duration: 1,
              ease: "power2.out"
            });

            gsap.to(step.querySelector('.step-glow'), {
              opacity: 1,
              scale: 1.2,
              duration: 0.3
            });
          });

          step.addEventListener('mouseleave', () => {
            gsap.to(step, {
              scale: 1,
              rotationY: 0,
              z: 0,
              duration: 0.5,
              ease: "power2.out"
            });

            gsap.to(step.querySelector('.step-icon'), {
              rotation: 0,
              scale: 1,
              duration: 1,
              ease: "power2.out"
            });

            gsap.to(step.querySelector('.step-glow'), {
              opacity: 0,
              scale: 1,
              duration: 0.3
            });
          });
        });
      }

      // Animated connectors
      const connectors = document.querySelectorAll('.step-connector');
      connectors.forEach((connector, index) => {
        gsap.to(connector, {
          scaleY: 1,
          duration: 1,
          delay: index * 0.3 + 1,
          ease: "power2.out"
        });

        // Flowing data effect
        gsap.to(connector.querySelector('.connector-flow'), {
          y: "100%",
          duration: 2,
          repeat: -1,
          ease: "none",
          delay: index * 0.5
        });
      });

    }, ref);

    return () => ctx.revert();
  }, []);

  const handleNavigate = () => {
    navigate('/proceso');
    window.scrollTo(0, 0);
  };

  return (
    <section id="proceso" className="process advanced-process" ref={ref}>
      {/* Advanced Background Effects */}
      <div className="process-bg-effects">
        <div className="circuit-pattern"></div>
        <div className="data-nodes">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="data-node" />
          ))}
        </div>
      </div>

      <div className="process-container">
        {/* Section Header */}
        <motion.div
          className="process-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="header-badge holographic-badge">
            <span>Metodología de Élite</span>
            <div className="badge-pulse"></div>
          </div>
          <h2 className="process-title">
            <span className="title-main">Un proceso diseñado para</span>
            <span className="title-accent holographic-text"> resultados excepcionales</span>
          </h2>
          <p className="process-subtitle">
            Cada proyecto sigue nuestra metodología revolucionaria que garantiza 
            calidad suprema, transparencia total y entrega puntual.
          </p>
        </motion.div>

        {/* Advanced Process Steps */}
        <div className="process-steps" ref={processStepsRef}>
          {steps.map((step, index) => (
            <ProcessStep 
              key={step.number} 
              step={step} 
              index={index} 
              isInView={isInView}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="process-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            className="process-button magnetic-btn"
            onClick={handleNavigate}
            whileHover={{ 
              scale: 1.02, 
              y: -2,
              boxShadow: "0 12px 40px rgba(0, 255, 255, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="button-text">Ver proceso completo</span>
            <div className="button-shine"></div>
            <div className="button-particles"></div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

function ProcessStep({ step, index, isInView, isLast }) {
  return (
    <div className="process-step advanced-step">
      {/* Step Glow Effect */}
      <div 
        className="step-glow" 
        style={{ 
          background: `radial-gradient(circle, ${step.glowColor}20 0%, transparent 70%)` 
        }}
      ></div>

      {/* Holographic Frame */}
      <div className="holographic-frame"></div>

      <div className="step-content">
        <div className="step-header">
          <div className="step-icon-container">
            <div 
              className="step-icon"
              style={{ 
                background: `linear-gradient(135deg, ${step.glowColor}, ${step.glowColor}80)`,
                boxShadow: `0 0 20px ${step.glowColor}40`
              }}
            >
              {step.icon}
            </div>
            <div className="icon-orbit"></div>
          </div>
          <div 
            className="step-number"
            style={{ 
              color: step.glowColor,
              textShadow: `0 0 10px ${step.glowColor}`
            }}
          >
            {step.number}
          </div>
        </div>

        <div className="step-info">
          <h3 className="step-title">{step.title}</h3>
          <p className="step-subtitle">{step.subtitle}</p>
          <p className="step-description">{step.description}</p>
          <div className="step-duration">
            <div 
              className="duration-dot"
              style={{ 
                background: step.glowColor,
                boxShadow: `0 0 8px ${step.glowColor}`
              }}
            ></div>
            <span>{step.duration}</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="step-progress">
          <div 
            className="progress-bar"
            style={{ background: step.glowColor }}
          ></div>
        </div>
      </div>

      {!isLast && (
        <div className="step-connector">
          <div className="connector-line"></div>
          <div 
            className="connector-flow"
            style={{ background: step.glowColor }}
          ></div>
        </div>
      )}
    </div>
  );
}

export default Process;