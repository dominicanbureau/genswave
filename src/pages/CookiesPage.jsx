import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './LegalPage.css';

function CookiesPage() {
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
          <h1>POLÍTICA DE COOKIES</h1>
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
            <h2>1. ¿Qué son las Cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. 
              Se utilizan ampliamente para hacer que los sitios web funcionen de manera más eficiente y proporcionen 
              información a los propietarios del sitio.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Cómo Usamos las Cookies</h2>
            <p>
              Studio utiliza cookies para mejorar su experiencia en nuestro sitio web, analizar el tráfico y 
              personalizar el contenido. Las cookies nos ayudan a:
            </p>
            <ul>
              <li>Recordar sus preferencias y configuraciones</li>
              <li>Mantener su sesión activa cuando está conectado</li>
              <li>Entender cómo utiliza nuestro sitio web</li>
              <li>Mejorar el rendimiento y la funcionalidad del sitio</li>
              <li>Proporcionar contenido relevante y personalizado</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. Tipos de Cookies que Utilizamos</h2>
            
            <h3>Cookies Esenciales</h3>
            <p>
              Estas cookies son necesarias para que el sitio web funcione correctamente. No se pueden desactivar 
              en nuestros sistemas. Generalmente solo se establecen en respuesta a acciones realizadas por usted, 
              como establecer sus preferencias de privacidad, iniciar sesión o completar formularios.
            </p>

            <h3>Cookies de Rendimiento</h3>
            <p>
              Estas cookies nos permiten contar visitas y fuentes de tráfico para medir y mejorar el rendimiento 
              de nuestro sitio. Nos ayudan a saber qué páginas son las más y menos populares y ver cómo los 
              visitantes se mueven por el sitio.
            </p>

            <h3>Cookies Funcionales</h3>
            <p>
              Estas cookies permiten que el sitio web proporcione funcionalidad y personalización mejoradas. 
              Pueden ser establecidas por nosotros o por proveedores externos cuyos servicios hemos agregado 
              a nuestras páginas.
            </p>

            <h3>Cookies de Marketing</h3>
            <p>
              Estas cookies pueden ser establecidas a través de nuestro sitio por nuestros socios publicitarios. 
              Pueden ser utilizadas por esas empresas para construir un perfil de sus intereses y mostrarle 
              anuncios relevantes en otros sitios.
            </p>
          </div>

          <div className="legal-section">
            <h2>4. Cookies Específicas que Utilizamos</h2>
            <div className="cookie-table">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Duración</th>
                    <th>Propósito</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>session_id</td>
                    <td>Esencial</td>
                    <td>Sesión</td>
                    <td>Mantiene su sesión activa</td>
                  </tr>
                  <tr>
                    <td>preferences</td>
                    <td>Funcional</td>
                    <td>1 año</td>
                    <td>Guarda sus preferencias</td>
                  </tr>
                  <tr>
                    <td>analytics</td>
                    <td>Rendimiento</td>
                    <td>2 años</td>
                    <td>Análisis de uso del sitio</td>
                  </tr>
                  <tr>
                    <td>marketing</td>
                    <td>Marketing</td>
                    <td>90 días</td>
                    <td>Publicidad personalizada</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="legal-section">
            <h2>5. Cookies de Terceros</h2>
            <p>
              Además de nuestras propias cookies, también utilizamos varios servicios de terceros que establecen 
              cookies en su dispositivo:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> para análisis de tráfico web</li>
              <li><strong>Servicios de redes sociales:</strong> para compartir contenido</li>
              <li><strong>Proveedores de chat en vivo:</strong> para soporte al cliente</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>6. Cómo Controlar las Cookies</h2>
            <p>
              Tiene derecho a decidir si acepta o rechaza las cookies. Puede ejercer sus preferencias de cookies 
              de las siguientes maneras:
            </p>
            <ul>
              <li><strong>Configuración del navegador:</strong> La mayoría de los navegadores le permiten controlar 
              las cookies a través de su configuración de preferencias</li>
              <li><strong>Panel de preferencias:</strong> Puede usar nuestro panel de preferencias de cookies 
              para gestionar sus opciones</li>
              <li><strong>Herramientas de terceros:</strong> Puede usar herramientas de exclusión proporcionadas 
              por redes publicitarias</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>7. Configuración del Navegador</h2>
            <p>
              Puede configurar su navegador para bloquear o alertarle sobre estas cookies, pero algunas partes 
              del sitio no funcionarán. Aquí hay enlaces a las instrucciones para los navegadores más populares:
            </p>
            <ul>
              <li>Google Chrome</li>
              <li>Mozilla Firefox</li>
              <li>Safari</li>
              <li>Microsoft Edge</li>
              <li>Opera</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>8. Consecuencias de Deshabilitar Cookies</h2>
            <p>
              Si elige deshabilitar las cookies, algunas funciones de nuestro sitio web pueden no funcionar 
              correctamente. Por ejemplo:
            </p>
            <ul>
              <li>No podrá mantener su sesión iniciada</li>
              <li>Sus preferencias no se guardarán</li>
              <li>Algunas funciones interactivas pueden no estar disponibles</li>
              <li>El rendimiento del sitio puede verse afectado</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>9. Actualizaciones de esta Política</h2>
            <p>
              Podemos actualizar esta Política de Cookies de vez en cuando para reflejar cambios en las cookies 
              que utilizamos o por otras razones operativas, legales o regulatorias. Le recomendamos que revise 
              esta página periódicamente para estar informado sobre nuestro uso de cookies.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Más Información</h2>
            <p>
              Si tiene preguntas sobre nuestro uso de cookies u otras tecnologías, contáctenos:
            </p>
            <ul>
              <li>Email: privacy@studio.com</li>
              <li>Teléfono: +1 (234) 567-890</li>
            </ul>
            <p>
              Para obtener más información sobre cookies en general, visite www.allaboutcookies.org
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

export default CookiesPage;
