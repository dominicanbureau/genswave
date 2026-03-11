import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectDetail.css';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setProject(data.project);
        setUpdates(data.updates);
      } else {
        navigate('/dashboard');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar proyecto:', error);
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="project-detail-page">
      <motion.button
        className="back-btn"
        onClick={() => navigate('/dashboard')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -5 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Volver
      </motion.button>

      <motion.div
        className="project-detail-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Project Header */}
        <div className="project-detail-header">
          {project.cover_image && (
            <div className="project-cover">
              <img src={project.cover_image} alt={project.title} />
            </div>
          )}
          
          <div className="project-info">
            <div className="project-meta">
              <span className={`status-badge status-${project.status}`}>
                {project.status}
              </span>
              {project.tags && project.tags.length > 0 && (
                <div className="project-tags">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
            
            <h1>{project.title}</h1>
            <p className="project-description">{project.description}</p>
            
            <div className="project-stats">
              <div className="stat-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <div>
                  <span className="stat-label">Progreso</span>
                  <span className="stat-value">{project.progress || 0}%</span>
                </div>
              </div>
              
              {project.budget && (
                <div className="stat-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  <div>
                    <span className="stat-label">Presupuesto</span>
                    <span className="stat-value">${project.budget}</span>
                  </div>
                </div>
              )}
              
              {project.start_date && (
                <div className="stat-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <div>
                    <span className="stat-label">Inicio</span>
                    <span className="stat-value">
                      {new Date(project.start_date).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="progress-bar-large">
              <motion.div 
                className="progress-fill" 
                initial={{ width: 0 }}
                animate={{ width: `${project.progress || 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Updates Timeline */}
        <div className="updates-section">
          <div className="updates-header">
            <h2>Timeline del Proyecto</h2>
            <div className="timeline-stats">
              <span className="timeline-count">{updates.length} actualizaciones</span>
            </div>
          </div>
          
          {updates.length === 0 ? (
            <div className="empty-timeline">
              <div className="empty-timeline-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3>Sin actualizaciones</h3>
              <p>Las actualizaciones del proyecto aparecerán aquí</p>
            </div>
          ) : (
            <div className="timeline-container">
              <div className="timeline-line"></div>
              {updates.map((update, index) => (
                <motion.div
                  key={update.id}
                  className="timeline-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="timeline-marker">
                    <div className={`timeline-dot ${update.update_type}`}>
                      {getUpdateTypeIcon(update.update_type)}
                    </div>
                  </div>
                  
                  <div className="timeline-content">
                    <div className="update-card-timeline">
                      <div className="update-header-timeline">
                        <div className="update-meta">
                          <span className={`update-type-label ${update.update_type}`}>
                            {getUpdateTypeLabel(update.update_type)}
                          </span>
                          <span className="update-timestamp">
                            {formatTimeAgo(update.created_at)}
                          </span>
                        </div>
                        {update.created_by_name && (
                          <div className="update-author-info">
                            <div className="author-avatar">
                              {update.created_by_name.charAt(0).toUpperCase()}
                            </div>
                            <span className="author-name">{update.created_by_name}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="update-body">
                        <h3 className="update-title">{update.title}</h3>
                        <div className="update-description-timeline">
                          {update.description.split('\n').map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                          ))}
                        </div>
                        
                        {update.images && update.images.length > 0 && (
                          <div className="update-media">
                            <div className="media-grid">
                              {update.images.map((image, idx) => (
                                <motion.div 
                                  key={idx} 
                                  className="media-item"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setSelectedImage(image)}
                                >
                                  <img src={image} alt={`Update ${idx + 1}`} />
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {update.attachments && update.attachments.length > 0 && (
                          <div className="update-attachments-timeline">
                            <div className="attachments-header">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                              </svg>
                              <span>Archivos adjuntos ({update.attachments.length})</span>
                            </div>
                            <div className="attachments-list">
                              {update.attachments.map((attachment, idx) => (
                                <div key={idx} className="attachment-item">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                    <line x1="16" y1="13" x2="8" y2="13"/>
                                    <line x1="16" y1="17" x2="8" y2="17"/>
                                    <polyline points="10 9 9 9 8 9"/>
                                  </svg>
                                  <span>{attachment.split('/').pop()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="update-footer">
                        <div className="update-date-full">
                          {new Date(update.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="image-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="image-modal-close"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <motion.img
              src={selectedImage}
              alt="Zoom"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getUpdateTypeIcon(type) {
  const icons = {
    general: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    ),
    progress: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    milestone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    issue: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    )
  };
  return icons[type] || icons.general;
}

function getUpdateTypeLabel(type) {
  const labels = {
    general: 'Actualización',
    progress: 'Progreso',
    milestone: 'Hito',
    issue: 'Problema'
  };
  return labels[type] || 'Actualización';
}

function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'hace unos segundos';
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)} días`;
  if (diffInSeconds < 31536000) return `hace ${Math.floor(diffInSeconds / 2592000)} meses`;
  return `hace ${Math.floor(diffInSeconds / 31536000)} años`;
}

export default ProjectDetail;
