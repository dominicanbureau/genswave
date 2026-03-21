import { motion, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: 'web',
    title: 'Desarrollo Web',
    subtitle: 'Sitios web de vanguardia',
    description: 'Experiencias web modernas, responsivas y optimizadas que convierten visitantes en clientes leales.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    features: ['Diseño Responsivo', 'SEO Optimizado', 'Carga Ultrarrápida'],
    gradient: 'linear-gradient(135deg, #00ffff 0%, #0080ff 100%)',
    glowColor: '#00ffff'
  },
  {
    id: 'mobile',
    title: 'Apps Móviles',
    subtitle: 'Aplicaciones nativas',
    description: 'Apps iOS y Android con experiencias de usuario intuitivas y rendimiento excepcional.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    features: ['Nativo iOS/Android', 'UI/UX Premium', 'Offline Ready'],
    gradient: 'linear-gradient(135deg, #ff00ff 0%, #8000ff 100%)',
    glowColor: '#ff00ff'
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce',
    subtitle: 'Tiendas digitales',
    description: 'Plataformas de comercio electrónico completas con sistemas de pago seguros y gestión avanzada.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="21" r="1"/>
        <circle cx="19" cy="21" r="1"/>
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
      </svg>
    ),
    features: ['Pagos Seguros', 'Inventario Smart', 'Analytics Avanzado'],
    gradient: 'linear-gradient(135deg, #ffff00 0%, #ff8000 100%)',
    glowColor: '#ffff00'
  },
  {
    id: 'custom',
    title: 'Soluciones Custom',
    subtitle: 'Desarrollo a medida',
    description: 'Soluciones tecnológicas personalizadas diseñadas específicamente para las necesidades de tu negocio.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    features: ['Arquitectura Escalable', 'Integración API', 'Soporte 24/7'],
    gradient: 'linear-gradient(135deg, #00ff80 0%, #0080ff 100%)',
    glowColor: '#00ff80'
  }
];

function Services() {
  const ref = useRef(null);
  const servicesGridRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Advanced card animations
      const cards = servicesGridRef.current?.children;
      if (cards) {
        gsap.set(cards, {
          y: 100,
          opacity: 0,
          rotationX: 45,
          transformPerspective: 1000
        });

        ScrollTrigger.create({
          trigger: servicesGridRef.current,
          start: "top 80%",
          end: "bottom 20%",
          onEnter: () => {
            gsap.to(cards, {
              y: 0,
              opacity: 1,
              rotationX: 0,
              duration: 1.2,
              ease: "power3.out",
              stagger: {
                each: 0.2,
                from: "start"
              }
            });
          }
        });

        // Hover effects for cards
        Array.from(cards).forEach((card, index) => {
          const service = services[index];
          
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -20,
              rotationY: 5,
              scale: 1.05,
              duration: 0.5,
              ease: "power2.out"
            });
            
            gsap.to(card.querySelector('.service-icon'), {
              rotation: 360,
              scale: 1.2,
              duration: 0.8,
              ease: "power2.out"
            });

            gsap.to(card.querySelector('.card-glow'), {
              opacity: 1,
              scale: 1.1,
              duration: 0.3
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              rotationY: 0,
              scale: 1,
              duration: 0.5,
              ease: "power2.out"
            });
            
            gsap.to(card.querySelector('.service-icon'), {
              rotation: 0,
              scale: 1,
              duration: 0.8,
              ease: "power2.out"
            });

            gsap.to(card.querySelector('.card-glow'), {
              opacity: 0,
              scale: 1,
              duration: 0.3
            });
          });
        });
      }

      // Floating particles for each service
      const particles = document.querySelectorAll('.service-particle');
      particles.forEach(particle => {
        gsap.to(particle, {
          y: () => gsap.utils.random(-50, 50),
          x: () => gsap.utils.random(-30, 30),
          rotation: () => gsap.utils.random(0, 360),
          duration: () => gsap.utils.random(3, 6),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });

    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="servicios" className="services advanced-services" ref={ref}>
      {/* Advanced Background Effects */}
      <div className="services-bg-effects">
        <div className="neural-grid"></div>
        <div className="floating-orbs">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="floating-orb" />
          ))}
        </div>
      </div>

      <div className="services-container">
        {/* Section Header */}
        <motion.div
          className="services-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="header-badge holographic-badge">
            <span>Servicios de Élite</span>
            <div className="badge-scanner"></div>
          </div>
          <h2 className="services-title">
            <span className="title-main">Transformamos ideas en</span>
            <span className="title-accent holographic-text"> experiencias digitales</span>
          </h2>
          <p className="services-subtitle">
            Cada proyecto es único. Creamos soluciones tecnológicas revolucionarias 
            que impulsan el crecimiento exponencial de tu negocio.
          </p>
        </motion.div>

        {/* Advanced Services Grid */}
        <div className="services-grid" ref={servicesGridRef}>
          {services.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={index} 
              isInView={isInView} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index, isInView }) {
  const cardRef = useRef(null);

  return (
    <div
      ref={cardRef}
      className="service-card advanced-card"
      data-service={service.id}
    >
      {/* Card Glow Effect */}
      <div 
        className="card-glow" 
        style={{ 
          background: `radial-gradient(circle, ${service.glowColor}20 0%, transparent 70%)` 
        }}
      ></div>

      {/* Floating Particles */}
      <div className="card-particles">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="service-particle"
            style={{ 
              background: service.glowColor,
              boxShadow: `0 0 10px ${service.glowColor}`
            }}
          />
        ))}
      </div>

      {/* Holographic Border */}
      <div className="holographic-border"></div>

      <div className="card-content">
        <div className="service-icon-container">
          <div 
            className="service-icon"
            style={{ 
              background: service.gradient,
              boxShadow: `0 0 20px ${service.glowColor}40`
            }}
          >
            {service.icon}
          </div>
          <div className="icon-ripple"></div>
        </div>

        <div className="service-info">
          <h3 className="service-title">{service.title}</h3>
          <p className="service-subtitle">{service.subtitle}</p>
          <p className="service-description">{service.description}</p>
          
          <ul className="service-features">
            {service.features.map((feature, idx) => (
              <li key={idx} className="feature-item">
                <div 
                  className="feature-dot"
                  style={{ 
                    background: service.glowColor,
                    boxShadow: `0 0 8px ${service.glowColor}`
                  }}
                ></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Data Stream Effect */}
        <div className="data-stream">
          <div className="stream-line"></div>
          <div className="stream-line"></div>
          <div className="stream-line"></div>
        </div>
      </div>
    </div>
  );
}

export default Services;