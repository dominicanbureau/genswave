import { useRef, useEffect, useState } from 'react';
import './Services.css';

const services = [
  {
    id: 'plataformas-digitales',
    title: 'Plataformas Digitales',
    subtitle: 'Sistemas empresariales completos',
    description: 'Plataformas robustas para gestionar todos los aspectos de tu negocio',
    icon: 'dashboard',
    features: [
      'Sistemas de registro y autenticación',
      'Bases de datos optimizadas',
      'Control de ventas en tiempo real',
      'Gestión de compras e inventario',
      'Reportes y analytics avanzados',
      'Panel de administración completo'
    ]
  },
  {
    id: 'comercio-electronico',
    title: 'Comercio Electrónico',
    subtitle: 'Tiendas online profesionales',
    description: 'Soluciones completas para vender online con todas las funcionalidades',
    icon: 'shopping_cart',
    features: [
      'Pasarelas de pago múltiples',
      'Sistema de estados de envío',
      'Gestión de productos y categorías',
      'Carrito de compras inteligente',
      'Sistema de cupones y descuentos',
      'Integración con logística'
    ]
  },
  {
    id: 'automatizacion-ia',
    title: 'Automatización e IA',
    subtitle: 'Inteligencia artificial aplicada',
    description: 'Automatiza procesos y mejora la eficiencia con IA avanzada',
    icon: 'smart_toy',
    features: [
      'Chatbots inteligentes 24/7',
      'Automatización de redes sociales',
      'Análisis predictivo de datos',
      'Procesamiento de lenguaje natural',
      'Automatización de workflows',
      'Asistentes virtuales personalizados'
    ]
  },
  {
    id: 'suscripciones-membresias',
    title: 'Suscripciones y Membresías',
    subtitle: 'Gestión de ingresos recurrentes',
    description: 'Administra y cobra membresías de forma automatizada',
    icon: 'card_membership',
    features: [
      'Cobros automáticos recurrentes',
      'Gestión de niveles de membresía',
      'Portal del cliente personalizado',
      'Análisis de retención',
      'Sistema de beneficios exclusivos',
      'Integración con CRM'
    ]
  },
  {
    id: 'marketing-digital',
    title: 'Marketing Digital',
    subtitle: 'Estrategias de crecimiento',
    description: 'Impulsa tu marca con campañas digitales efectivas',
    icon: 'campaign',
    features: [
      'Campañas en redes sociales',
      'Email marketing automatizado',
      'SEO y posicionamiento web',
      'Publicidad programática',
      'Marketing de contenidos',
      'Analytics y métricas ROI'
    ]
  },
  {
    id: 'gestion-empleados',
    title: 'Gestión de Empleados',
    subtitle: 'RRHH digitalizado',
    description: 'Sistemas completos para administrar tu equipo de trabajo',
    icon: 'groups',
    features: [
      'Control de asistencia biométrico',
      'Gestión de nóminas',
      'Evaluaciones de desempeño',
      'Portal del empleado',
      'Gestión de vacaciones',
      'Capacitación y desarrollo'
    ]
  },
  {
    id: 'fintech-pagos',
    title: 'FinTech y Pagos',
    subtitle: 'Soluciones financieras',
    description: 'Tecnología financiera para modernizar transacciones',
    icon: 'payments',
    features: [
      'Wallets digitales',
      'Transferencias P2P',
      'Sistemas de crédito scoring',
      'Facturación electrónica',
      'Conciliación bancaria',
      'Compliance financiero'
    ]
  },
  {
    id: 'logistica-tracking',
    title: 'Logística y Tracking',
    subtitle: 'Seguimiento en tiempo real',
    description: 'Optimiza la cadena de suministro con tecnología avanzada',
    icon: 'local_shipping',
    features: [
      'Rastreo GPS en tiempo real',
      'Optimización de rutas',
      'Gestión de almacenes',
      'Control de inventarios',
      'Predicción de demanda',
      'Integración con transportistas'
    ]
  },
  {
    id: 'salud-digital',
    title: 'Salud Digital',
    subtitle: 'Telemedicina y wellness',
    description: 'Plataformas de salud digital y telemedicina',
    icon: 'medical_services',
    features: [
      'Consultas médicas virtuales',
      'Historiales clínicos digitales',
      'Recordatorios de medicamentos',
      'Monitoreo de signos vitales',
      'Agenda médica inteligente',
      'Integración con wearables'
    ]
  },
  {
    id: 'educacion-online',
    title: 'Educación Online',
    subtitle: 'Plataformas de aprendizaje',
    description: 'LMS y sistemas educativos interactivos',
    icon: 'school',
    features: [
      'Aulas virtuales interactivas',
      'Gestión de cursos y contenido',
      'Evaluaciones automatizadas',
      'Certificaciones digitales',
      'Gamificación del aprendizaje',
      'Analytics de progreso'
    ]
  },
  {
    id: 'inmobiliaria-tech',
    title: 'InmobiliariaTech',
    subtitle: 'PropTech avanzado',
    description: 'Tecnología para el sector inmobiliario',
    icon: 'home_work',
    features: [
      'Tours virtuales 360°',
      'CRM inmobiliario especializado',
      'Valuaciones automatizadas',
      'Gestión de propiedades',
      'Matching inteligente',
      'Documentación digital'
    ]
  },
  {
    id: 'eventos-digitales',
    title: 'Eventos Digitales',
    subtitle: 'Experiencias virtuales',
    description: 'Plataformas para eventos híbridos y virtuales',
    icon: 'event',
    features: [
      'Streaming de alta calidad',
      'Networking virtual',
      'Gamificación de eventos',
      'Registro y check-in digital',
      'Salas de breakout',
      'Analytics de participación'
    ]
  },
  {
    id: 'agricultura-tech',
    title: 'AgriTech',
    subtitle: 'Agricultura inteligente',
    description: 'Tecnología para optimizar la producción agrícola',
    icon: 'agriculture',
    features: [
      'Monitoreo de cultivos IoT',
      'Predicción climática',
      'Optimización de riego',
      'Trazabilidad de productos',
      'Gestión de maquinaria',
      'Análisis de suelos'
    ]
  },
  {
    id: 'blockchain-crypto',
    title: 'Blockchain y Crypto',
    subtitle: 'Tecnología descentralizada',
    description: 'Soluciones blockchain para diversos sectores',
    icon: 'currency_bitcoin',
    features: [
      'Smart contracts personalizados',
      'Tokenización de activos',
      'DeFi y staking',
      'NFT marketplaces',
      'Trazabilidad blockchain',
      'Wallets corporativas'
    ]
  },
  {
    id: 'gaming-metaverso',
    title: 'Gaming y Metaverso',
    subtitle: 'Experiencias inmersivas',
    description: 'Desarrollo de juegos y experiencias en metaverso',
    icon: 'sports_esports',
    features: [
      'Juegos móviles y web',
      'Experiencias VR/AR',
      'Mundos virtuales',
      'Economías digitales',
      'Avatares personalizados',
      'Social gaming'
    ]
  },
  {
    id: 'iot-sensores',
    title: 'IoT y Sensores',
    subtitle: 'Internet de las cosas',
    description: 'Conecta dispositivos para crear ecosistemas inteligentes',
    icon: 'sensors',
    features: [
      'Redes de sensores',
      'Monitoreo ambiental',
      'Automatización del hogar',
      'Ciudades inteligentes',
      'Mantenimiento predictivo',
      'Edge computing'
    ]
  },
  {
    id: 'ciberseguridad',
    title: 'Ciberseguridad',
    subtitle: 'Protección digital avanzada',
    description: 'Soluciones de seguridad para proteger activos digitales',
    icon: 'security',
    features: [
      'Auditorías de seguridad',
      'Sistemas de detección',
      'Backup y recuperación',
      'Autenticación multifactor',
      'Monitoreo 24/7',
      'Compliance y certificaciones'
    ]
  },
  {
    id: 'cloud-devops',
    title: 'Cloud y DevOps',
    subtitle: 'Infraestructura moderna',
    description: 'Migración y optimización en la nube',
    icon: 'cloud',
    features: [
      'Migración a la nube',
      'CI/CD pipelines',
      'Containerización',
      'Microservicios',
      'Monitoreo y alertas',
      'Escalabilidad automática'
    ]
  },
  {
    id: 'analytics-bi',
    title: 'Analytics y BI',
    subtitle: 'Inteligencia de negocios',
    description: 'Transforma datos en decisiones estratégicas',
    icon: 'analytics',
    features: [
      'Dashboards interactivos',
      'Data warehousing',
      'Machine learning aplicado',
      'Reportes automatizados',
      'Predicciones de negocio',
      'Visualización avanzada'
    ]
  },
  {
    id: 'api-integraciones',
    title: 'APIs e Integraciones',
    subtitle: 'Conectividad empresarial',
    description: 'Conecta sistemas y automatiza flujos de trabajo',
    icon: 'api',
    features: [
      'APIs RESTful y GraphQL',
      'Integraciones ERP/CRM',
      'Webhooks y eventos',
      'Sincronización de datos',
      'Middleware empresarial',
      'Documentación interactiva'
    ]
  },
  {
    id: 'social-media-tools',
    title: 'Social Media Tools',
    subtitle: 'Gestión de redes sociales',
    description: 'Herramientas avanzadas para gestionar presencia digital',
    icon: 'share',
    features: [
      'Programación de contenido',
      'Análisis de engagement',
      'Gestión de comunidades',
      'Influencer marketing',
      'Social listening',
      'Reportes de ROI social'
    ]
  },
  {
    id: 'legal-tech',
    title: 'LegalTech',
    subtitle: 'Tecnología jurídica',
    description: 'Digitalización de procesos legales y compliance',
    icon: 'gavel',
    features: [
      'Gestión de contratos',
      'Automatización legal',
      'Due diligence digital',
      'Compliance automatizado',
      'Firma electrónica',
      'Gestión de casos'
    ]
  },
  {
    id: 'startup-mvp',
    title: 'Startup MVP',
    subtitle: 'Productos mínimos viables',
    description: 'Desarrollo rápido de MVPs para validar ideas de negocio',
    icon: 'rocket_launch',
    features: [
      'Prototipado rápido',
      'Validación de mercado',
      'Landing pages optimizadas',
      'A/B testing',
      'Analytics de usuario',
      'Escalabilidad planificada'
    ]
  }
];

function Services() {
  const ref = useRef(null);
  const [expandedService, setExpandedService] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.05, rootMargin: '50px' }
    );

    const elements = ref.current?.querySelectorAll('.fade-in');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const toggleService = (serviceId) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  return (
    <section id="servicios" className="services" ref={ref}>
      <div className="services-container">
        <div className="services-header fade-in">
          <h2 className="services-title">
            Catálogo completo de
            <span className="title-highlight">servicios digitales</span>
          </h2>
          <p className="services-subtitle">
            Desde automatización hasta blockchain, ofrecemos soluciones tecnológicas 
            para impulsar tu negocio en la era digital
          </p>
        </div>

        <div className="services-catalog">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className={`service-item fade-in ${expandedService === service.id ? 'expanded' : ''}`}
              style={{ '--delay': `${index * 0.05}s` }}
            >
              <div 
                className="service-header"
                onClick={() => toggleService(service.id)}
              >
                <div className="service-icon">
                  <span className="material-icons">{service.icon}</span>
                </div>
                <div className="service-info">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-subtitle">{service.subtitle}</p>
                  <p className="service-description">{service.description}</p>
                </div>
                <div className="service-toggle">
                  <span className="material-icons">
                    {expandedService === service.id ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              </div>
              
              {expandedService === service.id && (
                <div className="service-details">
                  <div className="features-grid">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="feature-item">
                        <span className="material-icons">check_circle</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="service-actions">
                    <button className="btn-primary">
                      <span>Solicitar Cotización</span>
                      <span className="material-icons">arrow_forward</span>
                    </button>
                    <button className="btn-secondary">
                      <span>Ver Casos de Éxito</span>
                      <span className="material-icons">visibility</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;