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
    features: ['Diseño Responsivo', 'SEO Optimizado', 'Carga Ultrarrápida']
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
    features: ['Nativo iOS/Android', 'UI/UX Premium', 'Offline Ready']
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
    features: ['Pagos Seguros', 'Inventario Smart', 'Analytics Avanzado']
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
    features: ['Arquitectura Escalable', 'Integración API', 'Soporte 24/7']
  }
];

function Services() {
  const ref = useRef(null);
  const servicesGridRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Professional card animations
      const cards = servicesGridRef.current?.children;
      if (cards) {
        gsap.set(cards, {
          y: 60,
          opacity: 0
        });

        ScrollTrigger.create({
          trigger: servicesGridRef.current,
          start: "top 80%",
          end: "bottom 20%",
          onEnter: () => {
            gsap.to(cards, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              stagger: {
                each: 0.15,
                from: "start"
              }
            });
          }
        });

        // Subtle hover effects for cards
        Array.from(cards).forEach((card) => {
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -8,
              duration: 0.3,
              ease: "power2.out"
            });
            
            gsap.to(card.querySelector('.service-icon'), {
              scale: 1.1,
              duration: 0.3,
              ease: "power2.out"
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              duration: 0.3,
              ease: "power2.out"
            });
            
            gsap.to(card.querySelector('.service-icon'), {
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            });
          });
        });
      }

    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="servicios" className="services" ref={ref}>
      <div className="services-container">
        {/* Section Header */}
        <motion.div
          className="services-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="header-badge">
            <span>Servicios Premium</span>
          </div>
          <h2 className="services-title">
            Transformamos ideas en
            <span className="title-accent"> experiencias digitales</span>
          </h2>
          <p className="services-subtitle">
            Cada proyecto es único. Creamos soluciones tecnológicas personalizadas 
            que impulsan el crecimiento de tu negocio.
          </p>
        </motion.div>

        {/* Services Grid */}
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
  return (
    <div className="service-card">
      <div className="card-content">
        <div className="service-icon-container">
          <div className="service-icon">
            {service.icon}
          </div>
        </div>

        <div className="service-info">
          <h3 className="service-title">{service.title}</h3>
          <p className="service-subtitle">{service.subtitle}</p>
          <p className="service-description">{service.description}</p>
          
          <ul className="service-features">
            {service.features.map((feature, idx) => (
              <li key={idx} className="feature-item">
                <div className="feature-dot"></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Services;