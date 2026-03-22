import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Process.css';

const steps = [
  {
    number: '01',
    title: 'Descubrimiento',
    description: 'Entendemos tu visión y definimos objetivos claros',
    duration: '1-2 semanas'
  },
  {
    number: '02',
    title: 'Diseño',
    description: 'Creamos prototipos y diseños funcionales',
    duration: '2-3 semanas'
  },
  {
    number: '03',
    title: 'Desarrollo',
    description: 'Construimos con tecnologías avanzadas',
    duration: '3-6 semanas'
  },
  {
    number: '04',
    title: 'Lanzamiento',
    description: 'Desplegamos y optimizamos tu proyecto',
    duration: '1-2 semanas'
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
      { threshold: 0.1 }
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
            Proceso probado para resultados excepcionales
          </h2>
          <p className="process-subtitle">
            Metodología que garantiza calidad y transparencia
          </p>
        </div>

        <div className="process-steps">
          {steps.map((step, index) => (
            <div key={step.number} className="process-step fade-in" style={{ transitionDelay: `${index * 100}ms` }}>
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                <span className="step-duration">{step.duration}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="process-cta fade-in">
          <button className="process-button" onClick={handleNavigate}>
            Ver proceso completo
          </button>
        </div>
      </div>
    </section>
  );
}

export default Process;