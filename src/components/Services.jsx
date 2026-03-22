import { useRef, useEffect } from 'react';
import './Services.css';

const services = [
  {
    id: 'web',
    title: 'Desarrollo Web',
    description: 'Sitios web modernos y optimizados que convierten visitantes en clientes',
    features: ['Diseño Responsivo', 'SEO Optimizado', 'Performance']
  },
  {
    id: 'mobile',
    title: 'Apps Móviles',
    description: 'Aplicaciones nativas iOS y Android con experiencias excepcionales',
    features: ['iOS & Android', 'UI/UX Premium', 'Offline Ready']
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce',
    description: 'Plataformas de comercio con sistemas de pago seguros',
    features: ['Pagos Seguros', 'Inventario', 'Analytics']
  },
  {
    id: 'custom',
    title: 'Soluciones Custom',
    description: 'Desarrollo personalizado para necesidades específicas',
    features: ['Escalable', 'Integración API', 'Soporte 24/7']
  }
];

function Services() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = ref.current?.querySelectorAll('.fade-in');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="servicios" className="services" ref={ref}>
      <div className="services-container">
        <div className="services-header fade-in">
          <h2 className="services-title">
            Soluciones para cada necesidad
          </h2>
          <p className="services-subtitle">
            Tecnología adaptada a tu negocio
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={service.id} className="service-card fade-in" style={{ transitionDelay: `${index * 100}ms` }}>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;