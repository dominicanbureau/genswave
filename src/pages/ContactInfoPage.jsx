import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './LegalPage.css';

function ContactInfoPage() {
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
          <h1>INFORMACIÓN DE CONTACTO</h1>
          <p>Ponte en contacto con nosotros</p>
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
            <h2>Información de la Empresa</h2>
            <div className="contact-info">
              <div className="contact-item">
                <h3>Genswave</h3>
                <p>Desarrollo Web y Aplicaciones Móviles</p>
              </div>
              
              <div className="contact-item">
                <h3>📧 Correo Electrónico</h3>
                <p>
                  <strong>General:</strong> info@genswave.com<br/>
                  <strong>Soporte:</strong> support@genswave.com<br/>
                  <strong>Privacidad:</strong> privacy@genswave.com<br/>
                  <strong>Ventas:</strong> sales@genswave.com
                </p>
              </div>

              <div className="contact-item">
                <h3>📞 Teléfono</h3>
                <p>
                  <strong>Principal:</strong> +1 (809) 555-0123<br/>
                  <strong>WhatsApp:</strong> +1 (809) 555-0123<br/>
                  <strong>Horario:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM (GMT-4)
                </p>
              </div>

              <div className="contact-item">
                <h3>🌍 Ubicación</h3>
                <p>
                  República Dominicana<br/>
                  Zona Horaria: GMT-4 (AST)
                </p>
              </div>

              <div className="contact-item">
                <h3>💬 Redes Sociales</h3>
                <p>
                  <strong>Instagram:</strong> @genswave<br/>
                  <strong>LinkedIn:</strong> /company/genswave<br/>
                  <strong>Twitter:</strong> @genswave
                </p>
              </div>

              <div className="contact-item">
                <h3>🌐 Sitio Web</h3>
                <p>
                  <strong>Principal:</strong> https://genswave.onrender.com<br/>
                  <strong>Dominio:</strong> genswave.onrender.com
                </p>
              </div>
            </div>
          </div>

          <div className="legal-section">
            <h2>Horarios de Atención</h2>
            <div className="schedule-info">
              <div className="schedule-item">
                <strong>Lunes - Viernes:</strong> 9:00 AM - 6:00 PM
              </div>
              <div className="schedule-item">
                <strong>Sábados:</strong> 10:00 AM - 2:00 PM
              </div>
              <div className="schedule-item">
                <strong>Domingos:</strong> Cerrado
              </div>
              <div className="schedule-item">
                <strong>Zona Horaria:</strong> GMT-4 (Hora del Atlántico)
              </div>
            </div>
          </div>

          <div className="legal-section">
            <h2>Servicios Principales</h2>
            <ul>
              <li>Desarrollo de Páginas Web</li>
              <li>Aplicaciones Móviles (iOS y Android)</li>
              <li>Sistemas Web Personalizados</li>
              <li>E-commerce</li>
              <li>Consultoría Técnica</li>
              <li>Mantenimiento y Soporte</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>Información Legal</h2>
            <p>
              <strong>Nombre Legal:</strong> Genswave<br/>
              <strong>Tipo de Empresa:</strong> Servicios de Desarrollo de Software<br/>
              <strong>País de Registro:</strong> República Dominicana<br/>
              <strong>Idiomas:</strong> Español, Inglés
            </p>
          </div>

          <div className="legal-section">
            <h2>Políticas y Términos</h2>
            <p>Para más información sobre nuestras políticas, consulte:</p>
            <ul>
              <li><a href="/privacidad">Política de Privacidad</a></li>
              <li><a href="/terminos">Términos y Condiciones</a></li>
              <li><a href="/cookies">Política de Cookies</a></li>
              <li><a href="/data-deletion">Eliminación de Datos</a></li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>Contacto Rápido</h2>
            <div className="quick-contact">
              <div className="contact-method">
                <h4>💬 Instagram DM</h4>
                <p>Envíanos un mensaje directo en Instagram para respuesta rápida</p>
              </div>
              <div className="contact-method">
                <h4>📧 Email</h4>
                <p>Respuesta en 24 horas durante días laborables</p>
              </div>
              <div className="contact-method">
                <h4>📞 Teléfono</h4>
                <p>Llamadas durante horario de oficina</p>
              </div>
              <div className="contact-method">
                <h4>🌐 Formulario Web</h4>
                <p>Usa nuestro formulario en la página principal</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

export default ContactInfoPage;