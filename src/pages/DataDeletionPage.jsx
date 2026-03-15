import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './LegalPage.css';

function DataDeletionPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    instagramUsername: '',
    requestType: 'all',
    reason: '',
    additionalInfo: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/data-deletion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('Error al enviar la solicitud. Por favor, intente nuevamente.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar la solicitud. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1>ELIMINACIÓN DE DATOS DE USUARIO</h1>
          <p>Solicite la eliminación de sus datos personales</p>
        </motion.div>
      </section>

      <section className="legal-content">
        <motion.div
          className="container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {!isSubmitted ? (
            <>
              <div className="legal-section">
                <h2>Solicitud de Eliminación de Datos</h2>
                <p>
                  De acuerdo con las regulaciones de privacidad y las políticas de Meta/Instagram, 
                  usted tiene derecho a solicitar la eliminación de sus datos personales que hemos 
                  recopilado a través de nuestros servicios, incluyendo mensajes de Instagram DM.
                </p>
              </div>

              <div className="legal-section">
                <h2>¿Qué datos podemos eliminar?</h2>
                <ul>
                  <li>Mensajes de Instagram DM enviados a nuestra cuenta</li>
                  <li>Información de perfil de Instagram (ID, nombre de usuario)</li>
                  <li>Datos de contacto proporcionados en formularios</li>
                  <li>Información de proyectos y comunicaciones</li>
                  <li>Registros de interacciones con nuestros servicios</li>
                </ul>
              </div>

              <div className="legal-section">
                <h2>Formulario de Solicitud</h2>
                <form onSubmit={handleSubmit} className="deletion-form">
                  <div className="form-group">
                    <label htmlFor="name">Nombre Completo *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Correo Electrónico *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="instagramUsername">Usuario de Instagram</label>
                    <input
                      type="text"
                      id="instagramUsername"
                      name="instagramUsername"
                      value={formData.instagramUsername}
                      onChange={handleInputChange}
                      placeholder="@usuario_instagram"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="requestType">Tipo de Eliminación *</label>
                    <select
                      id="requestType"
                      name="requestType"
                      value={formData.requestType}
                      onChange={handleInputChange}
                      required
                      className="form-select"
                    >
                      <option value="all">Eliminar todos mis datos</option>
                      <option value="instagram">Solo datos de Instagram DM</option>
                      <option value="contact">Solo información de contacto</option>
                      <option value="projects">Solo datos de proyectos</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reason">Motivo de la Solicitud</label>
                    <select
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Seleccione un motivo (opcional)</option>
                      <option value="privacy">Preocupaciones de privacidad</option>
                      <option value="no_longer_needed">Ya no necesito los servicios</option>
                      <option value="gdpr">Ejercicio de derechos GDPR</option>
                      <option value="other">Otro motivo</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="additionalInfo">Información Adicional</label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Proporcione cualquier información adicional que nos ayude a procesar su solicitud..."
                      className="form-textarea"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="submit-btn"
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
                  </button>
                </form>
              </div>

              <div className="legal-section">
                <h2>Proceso de Eliminación</h2>
                <ol>
                  <li><strong>Verificación:</strong> Verificaremos su identidad para proteger su privacidad</li>
                  <li><strong>Revisión:</strong> Revisaremos su solicitud dentro de 5 días hábiles</li>
                  <li><strong>Eliminación:</strong> Procederemos con la eliminación según su solicitud</li>
                  <li><strong>Confirmación:</strong> Le enviaremos una confirmación una vez completado</li>
                </ol>
              </div>

              <div className="legal-section">
                <h2>Excepciones</h2>
                <p>
                  Podemos conservar cierta información si es requerido por ley o para:
                </p>
                <ul>
                  <li>Cumplir con obligaciones legales</li>
                  <li>Resolver disputas</li>
                  <li>Hacer cumplir nuestros acuerdos</li>
                  <li>Proteger nuestros derechos legales</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="legal-section success-message">
              <h2>✅ Solicitud Enviada Exitosamente</h2>
              <p>
                Hemos recibido su solicitud de eliminación de datos. Nuestro equipo la revisará 
                y se pondrá en contacto con usted dentro de 5 días hábiles.
              </p>
              <p>
                <strong>Número de referencia:</strong> DEL-{Date.now()}
              </p>
              <p>
                Si tiene preguntas sobre su solicitud, puede contactarnos en:
              </p>
              <ul>
                <li>Email: privacy@genswave.com</li>
                <li>Referencia: DEL-{Date.now()}</li>
              </ul>
            </div>
          )}

          <div className="legal-section">
            <h2>Contacto</h2>
            <p>
              Si tiene preguntas sobre la eliminación de datos o necesita asistencia:
            </p>
            <ul>
              <li>Email: privacy@genswave.com</li>
              <li>Teléfono: +1 (809) 555-0123</li>
              <li>Asunto: "Solicitud de Eliminación de Datos"</li>
            </ul>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

export default DataDeletionPage;