import { useRef, useEffect, useState } from 'react';
import './Services.css';

const services = [
  {
    id: 'web',
    title: 'Desarrollo Web',
    description: 'Experiencias web modernas y optimizadas que convierten visitantes en clientes.',
    features: ['Diseño Responsivo', 'SEO Optimizado', 'Carga Ultrarrápida'],
    icon: '🌐'
  },
  {
    id: 'mobile',
    title: 'Apps Móviles',
    description: 'Aplicaciones nativas iOS y Android con experiencias de usuario excepcionales.',
    features: ['Nativo iOS/Android', 'UI/UX Premium', 'Offline Ready'],
    icon: '📱'
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce',
    description: 'Plataformas de comercio electrónico con sistemas de pago seguros.',
    features: ['Pagos Seguros', 'Inventario Smart', 'Analytics Avanzado'],
    icon: '🛒'
  },
  {
    id: 'custom',
    title: 'Soluciones Custom',
    description: 'Soluciones tecnológicas personalizadas para las necesidades de tu negocio.',
    features: ['Arquitectura Escalable', 'Integración API', 'Soporte 24/7'],
    icon: '⚡'
  }
];

function Services() {
  const ref = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = ref.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="servicios" className="services" ref={ref}>
      <div className="services-container">
        <div className="services-header animate-on-scroll">
          <div className="header-badge">
            <span>Servicios Premium</span>
            <div className="badge-glow"></div>
          </div>
          <h2 className="services-title">
            Transformamos ideas en<br />
            <span className="title-gradient">experiencias digitales</span>
          </h2>
          <p className="services-subtitle">
            Cada proyecto es único. Creamos soluciones tecnológicas personalizadas 
            que impulsan el crecimiento de tu negocio con la más alta calidad.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="service-card animate-on-scroll"
              style={{ '--delay': `${index * 0.15}s` }}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="card-content">
                <div className="service-icon">
                  <span>{service.icon}</span>
                  <div className="icon-glow"></div>
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

                <div className="card-hover-effect"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Background Elements */}
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
    </section>
  );
}

export default Services;