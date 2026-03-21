import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import './Services.css';

const services = [
  {
    title: 'Páginas Web',
    description: 'Sitios web modernos, responsivos y optimizados para convertir visitantes en clientes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
    particles: [
      { x: 20, y: 30, size: 4, delay: 0 },
      { x: 80, y: 20, size: 6, delay: 0.5 },
      { x: 60, y: 70, size: 3, delay: 1 }
    ]
  },
  {
    title: 'Aplicaciones Móviles',
    description: 'Apps nativas e híbridas con experiencias de usuario intuitivas y fluidas',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <path d="M12 18h.01"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
    particles: [
      { x: 15, y: 25, size: 5, delay: 0.2 },
      { x: 85, y: 15, size: 4, delay: 0.7 },
      { x: 50, y: 80, size: 6, delay: 1.2 }
    ]
  },
  {
    title: 'E-Commerce',
    description: 'Tiendas online completas con sistemas de pago seguros y gestión de inventario',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="21" r="1"/>
        <circle cx="19" cy="21" r="1"/>
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
    particles: [
      { x: 25, y: 20, size: 3, delay: 0.3 },
      { x: 75, y: 30, size: 5, delay: 0.8 },
      { x: 40, y: 75, size: 4, delay: 1.3 }
    ]
  },
  {
    title: 'Soluciones a Medida',
    description: 'Estrategias de desarrollo personalizado, adaptado a las necesidades de tu marca',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #333333 0%, #2a2a2a 100%)',
    particles: [
      { x: 30, y: 35, size: 6, delay: 0.4 },
      { x: 70, y: 25, size: 3, delay: 0.9 },
      { x: 55, y: 65, size: 5, delay: 1.4 }
    ]
  }
];

function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="servicios" className="services" ref={ref}>
      <div className="services-background">
        <div className="floating-shapes">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-shape"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { 
                opacity: [0, 0.6, 0], 
                scale: [0, 1, 0],
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50]
              } : {}}
              transition={{ 
                duration: 4 + Math.random() * 2, 
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: Math.random() * 3
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
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
            Nuestros servicios
          </motion.h2>
          <motion.div 
            className="title-decoration"
            initial={{ width: 0 }}
            animate={isInView ? { width: '100px' } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index, isInView }) {
  return (
    <motion.div
      className="service-card"
      initial={{ opacity: 0, y: 80, rotateX: 45 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -15, 
        rotateY: 5,
        scale: 1.02,
        transition: { duration: 0.3 } 
      }}
    >
      <div className="card-particles">
        {service.particles.map((particle, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? {
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 20 - 10],
              y: [0, Math.random() * 20 - 10]
            } : {}}
            transition={{
              duration: 3,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 2
            }}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="service-icon"
        whileHover={{ 
          scale: 1.2, 
          rotate: [0, -10, 10, 0],
          filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
        }}
        transition={{ duration: 0.6 }}
        style={{ background: service.gradient }}
      >
        {service.icon}
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: index * 0.2 + 0.3 }}
      >
        {service.title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: index * 0.2 + 0.5 }}
      >
        {service.description}
      </motion.p>
      
      <motion.div 
        className="card-glow"
        whileHover={{ opacity: 1 }}
        initial={{ opacity: 0 }}
      />
    </motion.div>
  );
}

export default Services;
