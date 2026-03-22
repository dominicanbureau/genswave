import { useRef, useEffect } from 'react';
import './Services.css';

const services = [
  {
    id: 'web',
    title: 'Desarrollo Web',
    description: 'Experiencias web modernas y optimizadas que convierten visitantes en clientes.',
    features: ['Diseño Responsivo', 'SEO Optimizado', 'Carga Ultrarrápida']
  },
  {
    id: 'mobile',
    title: 'Apps Móviles',
    description: 'Aplicaciones nativas iOS y Android con experiencias de usuario excepcionales.',
    features: ['Nativo iOS/Android', 'UI/UX Premium', 'Offline Ready']
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce',
    description: 'Plataformas de comercio electrónico con sistemas de pago seguros.',
    features: ['Pagos Seguros', 'Inventario Smart', 'Analytics Avanzado']
  },
  {
    id: 'custom',
    title: 'Soluciones Custom',
    description: 'Soluciones tecnológicas personalizadas para las necesidades de tu negocio.',
    features: ['Arquitectura Escalable', 'Integración API', 'Soporte 24/7']
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
      { threshold: 0.1 }
    );

    const cards = ref.current?.querySelectorAll('.service-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="servicios" className="services" ref={ref}>
      <div className="services-container">
        <div className="services-header">
          <h2 className="services-title">
            Transformamos ideas en<br />
            experiencias digitales.
          </h2>
          <p className="services-subtitle">
            Cada proyecto es único. Creamos soluciones tecnológicas personalizadas 
            que impulsan el crecimiento de tu negocio.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={service.id} className="service-card" style={{ '--delay': `${index * 0.1}s` }}>
              <div className="card-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="feature-item">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;