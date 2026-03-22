import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Process.css';

const steps = [
  {
    number: '01',
    title: 'Descubrimiento',
    description: 'Entendemos tu visión, analizamos el mercado y definimos objetivos claros para tu proyecto digital.',
    duration: '1-2 semanas'
  },
  {
    number: '02',
    title: 'Diseño',
    description: 'Creamos prototipos interactivos y diseños que combinan estética moderna con funcionalidad excepcional.',
    duration: '2-3 semanas'
  },
  {
    number: '03',
    title: 'Desarrollo',
    description: 'Desarrollamos con las tecnologías más avanzadas, asegurando código limpio, escalable y optimizado.',
    duration: '3-6 semanas'
  },
  {
    number: '04',
    title: 'Lanzamiento',
    description: 'Desplegamos tu proyecto con monitoreo continuo, optimizaciones de rendimiento y soporte completo.',
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

  const handleNavigate = () => {
    navigate('/proceso');
    window.scrollTo(0, 0);
  };

  return (
    <section id="proceso" className="process" ref={ref}>
      <div className="process-container">
        <div className="process-header animate-on-scroll">
          <h2 className="process-title">
            Un proceso diseñado para<br />
            resultados excepcionales.
          </h2>
          <p className="process-subtitle">
            Cada proyecto sigue nuestra metodología refinada que garantiza 
            calidad, transparencia y entrega puntual.
          </p>
        </div>

        <div className="process-steps">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="process-step animate-on-scroll"
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className="step-content">
                <div className="step-number">{step.number}</div>
                <div className="step-info">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                  <div className="step-duration">{step.duration}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="process-cta animate-on-scroll">
          <button className="process-button" onClick={handleNavigate}>
            Ver proceso completo
          </button>
        </div>
      </div>
    </section>
  );
}

export default Process;