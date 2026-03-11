import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ResourcePage.css';

function CasesPage() {
  const cases = [
    {
      id: 1,
      title: 'E-Commerce Innovador',
      client: 'TechRetail Co.',
      category: 'Desarrollo Web',
      description: 'Plataforma de comercio electrónico completa con integración de pagos y gestión de inventario en tiempo real.',
      results: [
        '300% aumento en ventas online',
        '50% reducción en tiempo de carga',
        '95% satisfacción del cliente'
      ],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
    },
    {
      id: 2,
      title: 'App de Fitness Personalizada',
      client: 'FitLife App',
      category: 'Aplicación Móvil',
      description: 'Aplicación móvil con planes de entrenamiento personalizados, seguimiento de progreso y comunidad integrada.',
      results: [
        '100K+ descargas en 3 meses',
        '4.8 estrellas en App Store',
        '70% retención de usuarios'
      ],
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80'
    },
    {
      id: 3,
      title: 'Sistema de Gestión Empresarial',
      client: 'GlobalCorp Inc.',
      category: 'Solución a Medida',
      description: 'Sistema ERP personalizado para gestión de recursos, proyectos y análisis de datos empresariales.',
      results: [
        '40% mejora en eficiencia',
        '60% reducción en costos operativos',
        'ROI positivo en 6 meses'
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
    }
  ];

  return (
    <div className="resource-page">
      <Navbar />
      
      <section className="resource-hero">
        <motion.div
          className="resource-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>PROYECTOS</h1>
          <p>Proyectos que transformaron negocios y superaron expectativas</p>
        </motion.div>
      </section>

      <section className="cases-content">
        <div className="container">
          {cases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              className="case-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="case-image">
                <img src={caseItem.image} alt={caseItem.title} />
                <span className="case-category">{caseItem.category}</span>
              </div>
              <div className="case-content">
                <h2>{caseItem.title}</h2>
                <p className="case-client">{caseItem.client}</p>
                <p className="case-description">{caseItem.description}</p>
                <div className="case-results">
                  <h3>Resultados</h3>
                  <ul>
                    {caseItem.results.map((result, idx) => (
                      <li key={idx}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default CasesPage;
