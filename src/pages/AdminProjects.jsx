import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminProjects.css';

function AdminProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'archived'
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [draggedProject, setDraggedProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    user_id: '',
    title: '',
    description: '',
    budget: '',
    start_date: '',
    end_date: '',
    cover_image: '',
    tags: []
  });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [updateForm, setUpdateForm] = useState({
    title: '',
    description: '',
    update_type: 'general',
    images: [],
    attachments: [],
    progress: 0
  });
  const [updateImageFiles, setUpdateImageFiles] = useState([]);
  const [updateImagePreviews, setUpdateImagePreviews] = useState([]);
  const [clientSearch, setClientSearch] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [dragFeedback, setDragFeedback] = useState(null);

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setCoverImagePreview(e.target.result);
      reader.readAsDataURL(file);
      // Clear URL input when file is selected
      setProjectForm({...projectForm, cover_image: ''});
    }
  };

  const handleUpdateImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setUpdateImageFiles(files);
    
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target.result);
        if (previews.length === files.length) {
          setUpdateImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Clear URL textarea when files are selected
    setUpdateForm({...updateForm, images: []});
  };

  const removeCoverImageFile = () => {
    setCoverImageFile(null);
    setCoverImagePreview('');
  };

  const removeUpdateImageFile = (index) => {
    const newFiles = updateImageFiles.filter((_, i) => i !== index);
    const newPreviews = updateImagePreviews.filter((_, i) => i !== index);
    setUpdateImageFiles(newFiles);
    setUpdateImagePreviews(newPreviews);
  };

  useEffect(() => {
    loadProjects();
    loadUsers();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.client-search-container')) {
        setShowClientDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadProjects = async () => {
    try {
      // Load active projects (not archived)
      const activeResponse = await fetch('/api/projects?archived=false');
      const activeData = await activeResponse.json();
      
      // Load archived projects
      const archivedResponse = await fetch('/api/projects?archived=true');
      const archivedData = await archivedResponse.json();
      
      // Ensure no duplicates by filtering by archived status
      const filteredActive = activeData.filter(p => !p.archived);
      const filteredArchived = archivedData.filter(p => p.archived);
      
      setProjects(filteredActive);
      setArchivedProjects(filteredArchived);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.filter(u => u.role !== 'admin'));
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    
    try {
      let coverImageUrl = projectForm.cover_image;
      
      // If a file was selected, upload it first
      if (coverImageFile) {
        const formData = new FormData();
        formData.append('image', coverImageFile);
        
        const uploadResponse = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          coverImageUrl = uploadData.url;
        } else {
          console.error('Error uploading cover image');
          return;
        }
      }
      
      const projectData = {
        ...projectForm,
        cover_image: coverImageUrl
      };
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        setShowProjectModal(false);
        setProjectForm({
          user_id: '',
          title: '',
          description: '',
          budget: '',
          start_date: '',
          end_date: '',
          cover_image: '',
          tags: []
        });
        setCoverImageFile(null);
        setCoverImagePreview('');
        setClientSearch('');
        setShowClientDropdown(false);
        loadProjects();
      }
    } catch (error) {
      console.error('Error al crear proyecto:', error);
    }
  };

  const createUpdate = async (e) => {
    e.preventDefault();
    
    try {
      let imageUrls = updateForm.images;
      
      // If files were selected, upload them first
      if (updateImageFiles.length > 0) {
        const uploadPromises = updateImageFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('image', file);
          
          const uploadResponse = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData
          });
          
          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            return uploadData.url;
          } else {
            throw new Error('Error uploading image');
          }
        });
        
        try {
          const uploadedUrls = await Promise.all(uploadPromises);
          imageUrls = [...imageUrls, ...uploadedUrls];
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          return;
        }
      }
      
      const updateData = {
        ...updateForm,
        images: imageUrls
      };
      
      const response = await fetch(`/api/projects/${selectedProject.id}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        // Update project progress
        await fetch(`/api/projects/${selectedProject.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ progress: updateForm.progress })
        });

        setShowUpdateModal(false);
        setUpdateForm({
          title: '',
          description: '',
          update_type: 'general',
          images: [],
          attachments: [],
          progress: 0
        });
        setUpdateImageFiles([]);
        setUpdateImagePreviews([]);
        loadProjects();
      }
    } catch (error) {
      console.error('Error al crear actualización:', error);
    }
  };

  const updateProject = async (id, updates) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        loadProjects();
      }
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;
    
    try {
      const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (response.ok) {
        loadProjects();
      }
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
    }
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!projectForm.tags.includes(newTag)) {
        setProjectForm({ ...projectForm, tags: [...projectForm.tags, newTag] });
      }
      e.target.value = '';
    }
  };

  const archiveProject = async (projectId, archived) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived })
      });
      
      if (response.ok) {
        // Show success feedback
        setDragFeedback({
          type: 'success',
          message: archived ? 'Proyecto archivado exitosamente' : 'Proyecto restaurado exitosamente'
        });
        
        // Hide feedback after 3 seconds
        setTimeout(() => setDragFeedback(null), 3000);
        
        loadProjects();
      }
    } catch (error) {
      console.error('Error al archivar proyecto:', error);
      setDragFeedback({
        type: 'error',
        message: 'Error al mover el proyecto'
      });
      setTimeout(() => setDragFeedback(null), 3000);
    }
  };

  const handleDragStart = (e, project) => {
    setDraggedProject(project);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.5';
    e.currentTarget.style.transform = 'rotate(5deg) scale(0.95)';
    
    // Add visual feedback to tabs
    const tabsContainer = document.querySelector('.project-tabs');
    if (tabsContainer) {
      tabsContainer.classList.add('drag-active');
    }
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    e.currentTarget.style.transform = 'none';
    setDraggedProject(null);
    
    // Remove visual feedback from tabs
    const tabsContainer = document.querySelector('.project-tabs');
    if (tabsContainer) {
      tabsContainer.classList.remove('drag-active');
    }
    
    // Clean up any remaining drag-over classes
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('drag-over'));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Find the closest tab button
    const tabBtn = e.target.closest('.tab-btn');
    if (tabBtn) {
      tabBtn.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e) => {
    // Only remove if we're actually leaving the tab area
    if (!e.currentTarget.contains(e.relatedTarget)) {
      const tabBtns = e.currentTarget.querySelectorAll('.tab-btn');
      tabBtns.forEach(btn => btn.classList.remove('drag-over'));
    }
  };

  const handleDrop = (e, targetTab) => {
    e.preventDefault();
    
    // Remove drag-over class from all tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('drag-over'));
    
    if (!draggedProject) return;
    
    const shouldArchive = targetTab === 'archived';
    const currentlyArchived = draggedProject.archived || false;
    
    // Only update if status is changing
    if (shouldArchive !== currentlyArchived) {
      archiveProject(draggedProject.id, shouldArchive);
    }
    
    setDraggedProject(null);
  };

  const getCurrentProjects = () => {
    return activeTab === 'archived' ? archivedProjects : projects;
  };

  const getFilteredUsers = () => {
    return users.filter(user => 
      user.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(clientSearch.toLowerCase())
    );
  };

  const selectClient = (user) => {
    setProjectForm({...projectForm, user_id: user.id});
    setClientSearch(`${user.name} (${user.email})`);
    setShowClientDropdown(false);
  };

  return (
    <motion.div
      className="admin-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="section-header">
        <h1>GESTIÓN DE PROYECTOS</h1>
        <div className="header-actions">
          <div 
            className="project-tabs"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <motion.button
              className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onDrop={(e) => handleDrop(e, 'active')}
            >
              Activos ({projects.length})
            </motion.button>
            <motion.button
              className={`tab-btn ${activeTab === 'archived' ? 'active' : ''}`}
              onClick={() => setActiveTab('archived')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onDrop={(e) => handleDrop(e, 'archived')}
            >
              Archivados ({archivedProjects.length})
            </motion.button>
          </div>
          <motion.button
            className="add-project-btn"
            onClick={() => setShowProjectModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nuevo Proyecto
          </motion.button>
        </div>
      </div>
      
      <div className="projects-grid">
        {getCurrentProjects().length === 0 ? (
          <div className="empty-state">
            <p>No hay proyectos {activeTab === 'archived' ? 'archivados' : 'activos'}</p>
            {activeTab === 'archived' && (
              <p className="empty-hint">Arrastra proyectos aquí para archivarlos</p>
            )}
          </div>
        ) : (
          getCurrentProjects().map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card-admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ y: -4 }}
              draggable
              onDragStart={(e) => handleDragStart(e, project)}
              onDragEnd={handleDragEnd}
              style={{ cursor: 'grab' }}
            >
              <div className="project-header">
                <h3>{project.title}</h3>
                <div className="project-badges">
                  <span className={`status-badge status-${project.status}`}>
                    {project.status}
                  </span>
                  {project.archived && (
                    <span className="archived-badge">Archivado</span>
                  )}
                </div>
              </div>

              {project.user_name && (
                <p className="project-client">Cliente: {project.user_name}</p>
              )}

              <p className="project-description">{project.description}</p>

              <div className="project-progress">
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill" 
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress || 0}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span>{project.progress || 0}%</span>
              </div>

              <div className="project-actions">
                <motion.button
                  className="btn-action btn-update"
                  onClick={() => {
                    setSelectedProject(project);
                    setUpdateForm({
                      title: '',
                      description: '',
                      update_type: 'general',
                      images: [],
                      attachments: [],
                      progress: project.progress || 0
                    });
                    setShowUpdateModal(true);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + Actualización
                </motion.button>
                <motion.button
                  className="btn-action btn-view"
                  onClick={() => navigate(`/project/${project.id}`)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver
                </motion.button>
                <select
                  value={project.status}
                  onChange={(e) => updateProject(project.id, { status: e.target.value })}
                  className="status-select"
                >
                  <option value="active">Activo</option>
                  <option value="paused">Pausado</option>
                  <option value="completed">Completado</option>
                </select>
                <motion.button
                  className="btn-action btn-delete"
                  onClick={() => deleteProject(project.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Eliminar
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Drag Feedback Notification */}
      <AnimatePresence>
        {dragFeedback && (
          <motion.div
            className={`drag-feedback ${dragFeedback.type}`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="feedback-icon">
              {dragFeedback.type === 'success' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              )}
            </div>
            <span>{dragFeedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Project Modal */}
      {showProjectModal && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowProjectModal(false)}
        >
          <motion.div
            className="modal-content project-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Crear Nuevo Proyecto</h3>
            
            <form onSubmit={createProject} className="project-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Cliente *</label>
                  <div className="client-search-container">
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={(e) => {
                        setClientSearch(e.target.value);
                        setShowClientDropdown(true);
                        if (!e.target.value) {
                          setProjectForm({...projectForm, user_id: ''});
                        }
                      }}
                      onFocus={() => setShowClientDropdown(true)}
                      placeholder="Buscar cliente por nombre o email..."
                      required={!projectForm.user_id}
                    />
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                    
                    {showClientDropdown && (
                      <div className="client-dropdown">
                        {getFilteredUsers().length > 0 ? (
                          getFilteredUsers().map(user => (
                            <div
                              key={user.id}
                              className="client-option"
                              onClick={() => selectClient(user)}
                            >
                              <div className="client-info">
                                <span className="client-name">{user.name}</span>
                                <span className="client-email">{user.email}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="no-clients">No se encontraron clientes</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Título del Proyecto *</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                    required
                    placeholder="Ej: Desarrollo de E-commerce"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  required
                  rows={4}
                  placeholder="Describe el proyecto..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Presupuesto</label>
                  <input
                    type="number"
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm({...projectForm, budget: e.target.value})}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Fecha de Inicio</label>
                  <input
                    type="date"
                    value={projectForm.start_date}
                    onChange={(e) => setProjectForm({...projectForm, start_date: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Fecha de Fin</label>
                  <input
                    type="date"
                    value={projectForm.end_date}
                    onChange={(e) => setProjectForm({...projectForm, end_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Imagen de Portada</label>
                
                {/* URL Input */}
                <div className="image-input-section">
                  <label className="image-input-label">URL de imagen:</label>
                  <input
                    type="url"
                    value={projectForm.cover_image}
                    onChange={(e) => setProjectForm({...projectForm, cover_image: e.target.value})}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    disabled={coverImageFile}
                  />
                </div>

                {/* File Upload */}
                <div className="image-input-section">
                  <label className="image-input-label">O subir archivo:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    disabled={projectForm.cover_image}
                    style={{ display: 'none' }}
                    id="cover-image-upload"
                  />
                  <label htmlFor="cover-image-upload" className="file-upload-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Seleccionar imagen
                  </label>
                </div>

                {/* Preview */}
                {(coverImagePreview || projectForm.cover_image) && (
                  <div className="image-preview">
                    <img 
                      src={coverImagePreview || projectForm.cover_image} 
                      alt="Preview" 
                      className="preview-image"
                    />
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={coverImageFile ? removeCoverImageFile : () => setProjectForm({...projectForm, cover_image: ''})}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Tags (presiona Enter para agregar)</label>
                <input
                  type="text"
                  onKeyDown={handleTagInput}
                  placeholder="Ej: Web, E-commerce, React..."
                />
                {projectForm.tags.length > 0 && (
                  <div className="tags-list">
                    {projectForm.tags.map((tag, index) => (
                      <span key={index} className="tag-item">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowProjectModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirm">
                  Crear Proyecto
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Create Update Modal */}
      {showUpdateModal && selectedProject && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowUpdateModal(false)}
        >
          <motion.div
            className="modal-content update-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Nueva Actualización - {selectedProject.title}</h3>
            
            <form onSubmit={createUpdate} className="update-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Título *</label>
                  <input
                    type="text"
                    value={updateForm.title}
                    onChange={(e) => setUpdateForm({...updateForm, title: e.target.value})}
                    required
                    placeholder="Ej: Diseño de interfaz completado"
                  />
                </div>

                <div className="form-group">
                  <label>Tipo de Actualización</label>
                  <select
                    value={updateForm.update_type}
                    onChange={(e) => setUpdateForm({...updateForm, update_type: e.target.value})}
                  >
                    <option value="general">General</option>
                    <option value="progress">Progreso</option>
                    <option value="milestone">Hito</option>
                    <option value="issue">Problema</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  value={updateForm.description}
                  onChange={(e) => setUpdateForm({...updateForm, description: e.target.value})}
                  required
                  rows={6}
                  placeholder="Describe la actualización en detalle..."
                />
              </div>

              <div className="form-group">
                <label>Progreso del Proyecto: {updateForm.progress}%</label>
                <div className="progress-slider-container">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={updateForm.progress}
                    onChange={(e) => setUpdateForm({...updateForm, progress: parseInt(e.target.value)})}
                    className="progress-slider"
                  />
                  <div className="progress-slider-track">
                    <div 
                      className="progress-slider-fill" 
                      style={{ width: `${updateForm.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Imágenes</label>
                
                {/* URL Input */}
                <div className="image-input-section">
                  <label className="image-input-label">URLs (una por línea):</label>
                  <textarea
                    rows={3}
                    placeholder="https://ejemplo.com/imagen1.jpg&#10;https://ejemplo.com/imagen2.jpg"
                    onChange={(e) => {
                      const urls = e.target.value.split('\n').filter(url => url.trim());
                      setUpdateForm({...updateForm, images: urls});
                    }}
                    disabled={updateImageFiles.length > 0}
                  />
                </div>

                {/* File Upload */}
                <div className="image-input-section">
                  <label className="image-input-label">O subir archivos:</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUpdateImagesChange}
                    disabled={updateForm.images.length > 0}
                    style={{ display: 'none' }}
                    id="update-images-upload"
                  />
                  <label htmlFor="update-images-upload" className="file-upload-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Seleccionar imágenes
                  </label>
                </div>

                {/* Previews */}
                {updateImagePreviews.length > 0 && (
                  <div className="images-preview-grid">
                    {updateImagePreviews.map((preview, index) => (
                      <div key={index} className="image-preview">
                        <img src={preview} alt={`Preview ${index + 1}`} className="preview-image" />
                        <button 
                          type="button" 
                          className="remove-image-btn"
                          onClick={() => removeUpdateImageFile(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowUpdateModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirm">
                  Publicar Actualización
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default AdminProjects;
