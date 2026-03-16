import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './LegalPage.css';

function TermsPage() {
  return (
    <div className="legal-page">
      <Navbar />
      
      <section className="legal-hero">
        <motion.div
          className="legal-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>TÉRMINOS Y CONDICIONES</h1>
          <p>Última actualización: {new Date().toLocaleDateString()}</p>
        </motion.div>
      </section>

      <section className="legal-content">
        <motion.div
          className="container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="legal-section">
            <h2>1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar los servicios de Genswave, usted acepta estar sujeto a estos Términos y Condiciones. 
              Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Descripción de Servicios</h2>
            <p>
              Genswave proporciona servicios de desarrollo web, aplicaciones móviles y soluciones digitales personalizadas. 
              Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto de nuestros servicios 
              en cualquier momento sin previo aviso.
            </p>
          </div>

          <div className="legal-section">
            <h2>3. Uso Aceptable</h2>
            <p>Usted se compromete a:</p>
            <ul>
              <li>Proporcionar información precisa y actualizada</li>
              <li>Mantener la confidencialidad de sus credenciales de acceso</li>
              <li>No utilizar nuestros servicios para actividades ilegales o no autorizadas</li>
              <li>No intentar acceder a áreas restringidas de nuestros sistemas</li>
              <li>Respetar los derechos de propiedad intelectual</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Propiedad Intelectual</h2>
            <p>
              Todo el contenido, diseños, código y materiales desarrollados por Genswave permanecen como propiedad 
              intelectual de Genswave hasta que se complete el pago total del proyecto. Una vez completado el pago, 
              los derechos de uso se transfieren al cliente según lo acordado en el contrato específico del proyecto.
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Pagos y Facturación</h2>
            <p>
              Los términos de pago se establecen en cada propuesta o contrato individual. Generalmente, requerimos:
            </p>
            <ul>
              <li>Un depósito inicial del 50% antes de comenzar el trabajo</li>
              <li>El 50% restante al completar el proyecto</li>
              <li>Los pagos deben realizarse dentro de los 15 días posteriores a la facturación</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>6. Garantías y Limitaciones</h2>
            <p>
              Garantizamos que nuestros servicios se realizarán con habilidad profesional y cuidado razonable. 
              Sin embargo, no garantizamos resultados específicos de negocio o tráfico web. Nuestros servicios 
              se proporcionan "tal cual" sin garantías implícitas.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Limitación de Responsabilidad</h2>
            <p>
              Genswave no será responsable de daños indirectos, incidentales, especiales o consecuentes que resulten 
              del uso o la imposibilidad de usar nuestros servicios. Nuestra responsabilidad total no excederá el 
              monto pagado por los servicios en cuestión.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Cancelación y Reembolsos</h2>
            <p>
              Los proyectos pueden cancelarse por cualquiera de las partes con notificación por escrito. 
              Los reembolsos se calcularán en función del trabajo completado hasta la fecha de cancelación. 
              Los depósitos iniciales no son reembolsables una vez que el trabajo ha comenzado.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Confidencialidad</h2>
            <p>
              Ambas partes acuerdan mantener confidencial toda información propietaria compartida durante 
              el curso del proyecto. Esta obligación continúa incluso después de la finalización del proyecto.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán 
              en vigor inmediatamente después de su publicación en nuestro sitio web. El uso continuado de 
              nuestros servicios constituye la aceptación de los términos modificados.
            </p>
          </div>

          <div className="legal-section">
            <h2>11. Ley Aplicable</h2>
            <p>
              Estos términos se regirán e interpretarán de acuerdo con las leyes aplicables, sin tener en 
              cuenta sus disposiciones sobre conflictos de leyes.
            </p>
          </div>

          <div className="legal-section">
            <h2>12. Contacto</h2>
            <p>
              Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos en:
            </p>
            <ul>
              <li>Email: legal@genswave.org</li>
              <li>Ubicación: Distrito Nacional, Dominican Republic</li>
            </ul>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

export default TermsPage;
