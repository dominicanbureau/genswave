import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './LegalPage.css';

function PrivacyPage() {
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
          <h1>POLÍTICA DE PRIVACIDAD</h1>
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
            <h2>1. Introducción</h2>
            <p>
              En Studio, nos comprometemos a proteger su privacidad. Esta Política de Privacidad explica cómo 
              recopilamos, usamos, divulgamos y protegemos su información personal cuando utiliza nuestros servicios.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Información que Recopilamos</h2>
            <p>Recopilamos varios tipos de información, incluyendo:</p>
            <ul>
              <li><strong>Información de contacto:</strong> nombre, dirección de email, número de teléfono</li>
              <li><strong>Información de la empresa:</strong> nombre de la empresa, cargo, ubicación</li>
              <li><strong>Información del proyecto:</strong> detalles sobre sus necesidades y requisitos</li>
              <li><strong>Información técnica:</strong> dirección IP, tipo de navegador, páginas visitadas</li>
              <li><strong>Información de pago:</strong> datos de facturación (procesados de forma segura)</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. Cómo Usamos su Información</h2>
            <p>Utilizamos la información recopilada para:</p>
            <ul>
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Comunicarnos con usted sobre proyectos y servicios</li>
              <li>Procesar pagos y transacciones</li>
              <li>Enviar actualizaciones y materiales de marketing (con su consentimiento)</li>
              <li>Analizar el uso de nuestro sitio web para mejorarlo</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Base Legal para el Procesamiento</h2>
            <p>Procesamos su información personal bajo las siguientes bases legales:</p>
            <ul>
              <li><strong>Consentimiento:</strong> cuando nos ha dado permiso explícito</li>
              <li><strong>Contrato:</strong> cuando es necesario para cumplir un contrato con usted</li>
              <li><strong>Interés legítimo:</strong> para operar y mejorar nuestro negocio</li>
              <li><strong>Obligación legal:</strong> cuando la ley lo requiere</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Compartir Información</h2>
            <p>
              No vendemos su información personal. Podemos compartir su información con:
            </p>
            <ul>
              <li>Proveedores de servicios que nos ayudan a operar nuestro negocio</li>
              <li>Procesadores de pagos para transacciones financieras</li>
              <li>Autoridades legales cuando sea requerido por ley</li>
              <li>Socios comerciales con su consentimiento explícito</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>6. Seguridad de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información 
              personal contra acceso no autorizado, alteración, divulgación o destrucción. Estas medidas incluyen:
            </p>
            <ul>
              <li>Encriptación SSL/TLS para transmisión de datos</li>
              <li>Almacenamiento seguro de datos con acceso restringido</li>
              <li>Auditorías de seguridad regulares</li>
              <li>Capacitación del personal en protección de datos</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>7. Retención de Datos</h2>
            <p>
              Conservamos su información personal solo durante el tiempo necesario para cumplir con los propósitos 
              descritos en esta política, a menos que la ley requiera o permita un período de retención más largo. 
              Generalmente:
            </p>
            <ul>
              <li>Información de proyectos activos: durante la duración del proyecto + 3 años</li>
              <li>Información de facturación: 7 años (requisito legal)</li>
              <li>Datos de marketing: hasta que retire su consentimiento</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>8. Sus Derechos</h2>
            <p>Usted tiene derecho a:</p>
            <ul>
              <li><strong>Acceso:</strong> solicitar una copia de su información personal</li>
              <li><strong>Rectificación:</strong> corregir información inexacta o incompleta</li>
              <li><strong>Eliminación:</strong> solicitar la eliminación de su información</li>
              <li><strong>Restricción:</strong> limitar cómo usamos su información</li>
              <li><strong>Portabilidad:</strong> recibir su información en formato estructurado</li>
              <li><strong>Objeción:</strong> oponerse al procesamiento de su información</li>
              <li><strong>Retirar consentimiento:</strong> en cualquier momento</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>9. Cookies y Tecnologías Similares</h2>
            <p>
              Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio web. 
              Para más información, consulte nuestra Política de Cookies.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Transferencias Internacionales</h2>
            <p>
              Su información puede ser transferida y procesada en países fuera de su país de residencia. 
              Nos aseguramos de que dichas transferencias cumplan con las leyes de protección de datos aplicables 
              mediante el uso de cláusulas contractuales estándar u otros mecanismos apropiados.
            </p>
          </div>

          <div className="legal-section">
            <h2>11. Menores de Edad</h2>
            <p>
              Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionalmente 
              información personal de menores. Si descubrimos que hemos recopilado información de un menor, 
              la eliminaremos de inmediato.
            </p>
          </div>

          <div className="legal-section">
            <h2>12. Cambios a esta Política</h2>
            <p>
              Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios 
              significativos publicando la nueva política en nuestro sitio web y actualizando la fecha de 
              "última actualización".
            </p>
          </div>

          <div className="legal-section">
            <h2>13. Contacto</h2>
            <p>
              Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, contáctenos:
            </p>
            <ul>
              <li>Email: privacy@studio.com</li>
              <li>Teléfono: +1 (234) 567-890</li>
              <li>Dirección: San Francisco, CA</li>
            </ul>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

export default PrivacyPage;
