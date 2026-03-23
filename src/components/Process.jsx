import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Process.css';

const steps = [
  {
    number: '01',
    title: 'Descubrimiento',
    description: 'Entendemos tu visión y definimos objetivos claros',
    icon: 'search'
  },
  {
    number: '02',
    title: 'Diseño',
    description: 'Creamos prototipos y diseños funcionales',
    icon: 'palette'
  },
  {
    number: '03',
    title: 'Desarrollo',
    description: 'Construimos con tecnologías avanzadas',
    icon: 'code'
  },
  {
    number: '04',
    title: 'Lanzamiento',
    description: 'Desplegamos y optimizamos tu proyecto',
    icon: 'rocket_launch'
  }
];

function Process() {
  const ref = useRef(null);
  const navigate = useNavigate();

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

  const handleNavigate = () => {
    navigate('/proceso');
    window.scrollTo(0, 0);
  };

  return (
    <section id="proceso" className="process" ref={ref}>
      <div className="process-container">
        <div className="process-header fade-in">
          <h2 className="process-title">
            Alcanza nuevas alturas
            <span className="title-highlight">con nuestro proceso probado</span>
          </h2>
          <p className="process-subtitle">
            Metodología que garantiza calidad y transparencia en cada fase
          </p>
        </div>

        <div className="process-timeline">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="process-step fade-in"
              style={{ '--delay': `${index * 0.15}s` }}
            >
              <div className="step-icon">
                <span className="material-icons">{step.icon}</span>
              </div>
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="process-cta fade-in">
          <button className="process-button" onClick={handleNavigate}>
            <span>Explorar Producto</span>
            <span className="material-icons">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Process;