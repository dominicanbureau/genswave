import { useRef, useEffect } from 'react';
import './Services.css';

const services = [
  {
    id: 'web',
    title: 'Desarrollo Web',
    subtitle: 'Sitios modernos y optimizados',
    description: 'Experiencias web que convierten visitantes en clientes con tecnología de vanguardia',
    icon: 'code'
  },
  {
    id: 'mobile',
    title: 'Apps Móviles',
    subtitle: 'Aplicaciones nativas',
    description: 'Apps iOS y Android con experiencias de usuario excepcionales y rendimiento óptimo',
    icon: 'phone_iphone'
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce',
    subtitle: 'Tiendas digitales',
    description: 'Plataformas de comercio con sistemas de pago seguros y gestión avanzada',
    icon: 'shopping_cart'
  },
  {
    id: 'custom',
    title: 'Soluciones Custom',
    subtitle: 'Desarrollo a medida',
    description: 'Soluciones tecnológicas personalizadas para necesidades específicas de tu negocio',
    icon: 'auto_awesome'
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
            Construido para empresas
            <span className="title-highlight">de la era digital</span>
          </h2>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="service-card fade-in"
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className="service-icon">
                <span className="material-icons">{service.icon}</span>
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-subtitle">{service.subtitle}</p>
              <p className="service-description">{service.description}</p>
              <button className="service-link">
                <span>Explorar</span>
                <span className="material-icons">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;