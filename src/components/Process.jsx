import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Process.css';

const steps = [
  { number: '01', title: 'Descubrimiento', description: 'Entendemos tu visión, objetivos y necesidades' },
  { number: '02', title: 'Diseño', description: 'Creamos prototipos y experiencias visuales únicas' },
  { number: '03', title: 'Desarrollo', description: 'Construimos con las últimas tecnologías' },
  { number: '04', title: 'Lanzamiento', description: 'Desplegamos y optimizamos tu proyecto' }
];

function Process() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/proceso');
    window.scrollTo(0, 0);
  };

  return (
    <section id="proceso" className="process" ref={ref}>
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Nuestro proceso
        </motion.h2>
        
        <div className="process-steps">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="step"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="step-number"
                whileHover={{ scale: 1.2, color: '#000' }}
              >
                {step.number}
              </motion.div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="process-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            className="process-button"
            onClick={handleNavigate}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver más
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export default Process;
