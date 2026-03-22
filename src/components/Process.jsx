import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Process.css';

const steps = [
  {
    number: '01',
    title: 'Descubrimiento',
    description: 'Entendemos tu visión, analizamos el mercado y definimos objetivos claros para tu proyecto digital.',
    duration: '1-2 semanas',
    color: '#ff6b6b'
  },
  {
    number: '02',
    title: 'Diseño',
    description: 'Creamos prototipos interactivos y diseños que combinan estética moderna con funcionalidad excepcional.',
    duration: '2-3 semanas',
    color: '#4ecdc4'
  },
  {
    number: '03',
    title: 'Desarrollo',
    description: 'Desarrollamos con las tecnologías más avanzadas, asegurando código limpio, escalable y optimizado.',
    duration: '3-6 semanas',
    color: '#45b7d1'
  },
  {
    number: '04',
    title: 'Lanzamiento',
    description: 'Desplegamos tu proyecto con monitoreo continuo, optimizaciones de rendimiento y soporte completo.',
    duration: '1-2 semanas',
    color: '#96ceb4'
  }
];

function Process() {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigate = () => {
    navigate('/proceso');
    window.scrollTo(0, 0);
  };

  return (
    <section id="proceso" className="process" ref={ref}>
      <div className="process-container">
        <div className="process-header animate-on-scroll">
          <div className="header-badge">
            <span>Metodología Probada</span>
            <div className="badge-pulse"></div>
          </div>
          <h2 className="process-title">
            Un proceso diseñado para<br />
            <span className="title-highlight">resultados excepcionales</span>
          </h2>
          <p className="process-subtitle">
            Cada proyecto sigue nuestra metodología refinada que garantiza 
            calidad, transparencia y entrega puntual en cada fase del desarrollo.
          </p>
        </div>

        <div className="process-timeline">
          <div className="timeline-line">
            <div 
              className="timeline-progress" 
              style={{ '--progress': `${((activeStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>

          <div className="process-steps">
            {steps.map((step, index) => (
              <div 
                key={step.number} 
                className={`process-step animate-on-scroll ${index === activeStep ? 'active' : ''}`}
                style={{ '--delay': `${index * 0.2}s`, '--color': step.color }}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div className="step-indicator">
                  <div className="step-number">{step.number}</div>
                  <div className="step-glow"></div>
                </div>

                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                  <div className="step-duration">
                    <div className="duration-icon">⏱</div>
                    <span>{step.duration}</span>
                  </div>
                </div>

                <div className="step-hover-effect"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="process-cta animate-on-scroll">
          <button className="process-button" onClick={handleNavigate}>
            <span>Ver proceso completo</span>
            <div className="button-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </button>
        </div>

        {/* Animated Background */}
        <div className="process-bg">
          <div className="bg-grid"></div>
          <div className="bg-orbs">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Process;