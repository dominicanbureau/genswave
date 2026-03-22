import { useRef, useEffect } from 'react';
import './Services.css';

const services = [
  {
    id: 'web',
    title: 'Desarrollo Web',
    description: 'Experiencias web modernas y optimizadas que convierten visitantes en clientes.',
    features: ['Diseño Responsivo', 'SEO Optimizado', 'Carga Ultrarrápida'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    )
  },
  {
    id: 'mobile',
    title: 'Apps Móviles',
    description: 'Aplicaciones nativas iOS y Android con experiencias de usuario excepcionales.',
    features: ['Nativo iOS/Android', 'UI/UX Premium', 'Offline Ready'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    )
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce',
    description: 'Plataformas de comercio electrónico con sistemas de pago seguros.',
    features: ['Pagos Seguros', 'Inventario Smart', 'Analytics Avanzado'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="21" r="1"/>
        <circle cx="19" cy="21" r="1"/>
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
      </svg>
    )
  },
  {
    id: 'custom',
    title: 'Soluciones Custom',
    description: 'Soluciones tecnológicas personalizadas para las necesidades de tu negocio.',
    features: ['Arquitectura Escalable', 'Integración API', 'Soporte 24/7'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    )
  }
];

function Services() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    const elements = ref.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="servicios" className="services" ref={ref}>
      <div className="services-container">
        <div className="services-header animate-on-scroll">
          <div className="section-badge">
            <span>Nuestros Servicios</span>
          </div>
          <h2 className="services-title">
            Soluciones tecnológicas que
            <span className="title-gradient"> impulsan tu negocio</span>
          </h2>
          <p className="services-subtitle">
            Cada proyecto es único. Creamos experiencias digitales personalizadas 
            que transforman ideas en resultados excepcionales.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="service-card animate-on-scroll"
              style={{ '--delay': `${index * 0.15}s` }}
            >
              <div className="card-glass">
                <div className="service-icon">
                  {service.icon}
                </div>
                
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="feature-item">
                      <div className="feature-dot"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="card-shine"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Background Elements */}
        <div className="bg-elements">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-gradient"></div>
        </div>
      </div>
    </section>
  );
}

export default Services;