import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Process.css';

const steps = [
  { 
    number: '01', 
    title: 'Descubrimiento', 
    description: 'Entendemos tu visión, objetivos y necesidades',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    color: '#000000'
  },
  { 
    number: '02', 
    title: 'Diseño', 
    description: 'Creamos prototipos y experiencias visuales únicas',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    color: '#1a1a1a'
  },
  { 
    number: '03', 
    title: 'Desarrollo', 
    description: 'Construimos con las últimas tecnologías',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    color: '#2a2a2a'
  },
  { 
    number: '04', 
    title: 'Lanzamiento', 
    description: 'Desplegamos y optimizamos tu proyecto',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
    ),
    color: '#333333'
  }
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
      <div className="process-background">
        <motion.div 
          className="process-line"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 2, delay: 0.5 }}
        />
        
        {/* Floating geometric shapes */}
        <div className="geometric-shapes">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`geometric-shape shape-${i + 1}`}
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={isInView ? { 
                opacity: [0, 0.6, 0], 
                scale: [0, 1, 0],
                rotate: [0, 180, 360]
              } : {}}
              transition={{ 
                duration: 6 + Math.random() * 2, 
                delay: i * 0.4,
                repeat: Infinity,
                repeatDelay: Math.random() * 4
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Nuestro proceso
          </motion.h2>
          <motion.div 
            className="title-decoration"
            initial={{ width: 0 }}
            animate={isInView ? { width: '100px' } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>
        
        <div className="process-steps">
          {steps.map((step, index) => (
            <ProcessStep key={index} step={step} index={index} isInView={isInView} />
          ))}
        </div>

        <motion.div
          className="process-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <motion.button
            className="process-button"
            onClick={handleNavigate}
            whileHover={{ 
              scale: 1.05, 
              y: -3,
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Ver más</span>
            <motion.div 
              className="button-ripple"
              whileHover={{ scale: 1.5, opacity: 0 }}
              initial={{ scale: 0, opacity: 1 }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

function ProcessStep({ step, index, isInView }) {
  return (
    <motion.div
      className="step"
      initial={{ opacity: 0, y: 80, rotateY: 45 }}
      animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.05,
        y: -10,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
    >
      <motion.div 
        className="step-icon"
        initial={{ scale: 0, rotate: -180 }}
        animate={isInView ? { scale: 1, rotate: 0 } : {}}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.2 + 0.3,
          type: "spring",
          stiffness: 200
        }}
        whileHover={{ 
          scale: 1.2,
          rotate: [0, -10, 10, 0],
          transition: { duration: 0.6 }
        }}
        style={{ background: step.color }}
      >
        {step.icon}
      </motion.div>
      
      <motion.div 
        className="step-number"
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: index * 0.2 + 0.5 }}
        whileHover={{ 
          scale: 1.1,
          color: '#000000',
          textShadow: '0 0 20px rgba(0,0,0,0.3)'
        }}
      >
        {step.number}
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: index * 0.2 + 0.6 }}
      >
        {step.title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: index * 0.2 + 0.7 }}
      >
        {step.description}
      </motion.p>
      
      <motion.div 
        className="step-glow"
        whileHover={{ opacity: 1 }}
        initial={{ opacity: 0 }}
      />
    </motion.div>
  );
}

export default Process;
