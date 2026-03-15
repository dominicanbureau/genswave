import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminProjects from './AdminProjects';
import './Admin.css';

// Users Section Component
function UsersSection() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    position: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const resetPassword = async (userId) => {
    if (!confirm('¿Resetear contraseña del usuario?')) return;
    
    try {
      const response = await fetch(`/api/users/${userId}/reset-password`, {
        method: 'POST'
      });
      
      if (response.ok) {
        alert('Contraseña reseteada exitosamente');
      }
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
      const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (response.ok) {
        loadUsers();
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      position: user.position || ''
    });
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditForm({
      name: '',
      email: '',
      phone: '',
      location: '',
      position: ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      if (response.ok) {
        alert('Usuario actualizado exitosamente');
        closeEditModal();
        loadUsers();
      } else {
        alert('Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('Error al actualizar usuario');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <motion.div
      className="admin-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1>GESTIÓN DE USUARIOS</h1>
      
      <div className="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th className="text-center">Proyectos</th>
              <th className="text-center">Solicitudes</th>
              <th>Fecha de Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-row">
                  {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
              >
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-small">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="user-name">{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>
                  <span className={`role-badge-small ${user.role}`}>
                    {user.role === 'admin' ? 'Admin' : 'Usuario'}
                  </span>
                </td>
                <td className="text-center">{user.project_count || 0}</td>
                <td className="text-center">{user.request_count || 0}</td>
                <td>{new Date(user.created_at).toLocaleDateString('es-ES')}</td>
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => openEditModal(user)}
                      className="btn-icon btn-edit"
                      title="Editar usuario"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => resetPassword(user.id)}
                      className="btn-icon btn-reset"
                      title="Resetear contraseña"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                        <path d="M3 21v-5h5"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="btn-icon btn-delete"
                      title="Eliminar usuario"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de edición */}
      {editingUser && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={closeEditModal}
        >
          <motion.div
            className="modal-content edit-user-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Editar Usuario</h3>
            
            <form onSubmit={handleEditSubmit} className="edit-user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Ubicación</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    placeholder="Ciudad, País"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Cargo</label>
                <select
                  value={editForm.position}
                  onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                >
                  <option value="">Selecciona un cargo</option>
                  <option value="CEO / Fundador">CEO / Fundador</option>
                  <option value="Director">Director</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Desarrollador">Desarrollador</option>
                  <option value="Diseñador">Diseñador</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeEditModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirm">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
// Appointments Section Component
function AppointmentsSection() {
  const [appointments, setAppointments] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadAppointments();
    loadRequests();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
    }
  };

  const loadRequests = async () => {
    try {
      const response = await fetch('/api/requests/admin/requests');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        loadAppointments();
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/requests/admin/requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        loadRequests();
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const deleteAppointment = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta solicitud?')) return;
    
    try {
      const response = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      if (response.ok) {
        loadAppointments();
      }
    } catch (error) {
      console.error('Error al eliminar cita:', error);
    }
  };

  const deleteRequest = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta solicitud?')) return;
    
    try {
      const response = await fetch(`/api/requests/admin/requests/${id}`, { method: 'DELETE' });
      if (response.ok) {
        loadRequests();
      }
    } catch (error) {
      console.error('Error al eliminar solicitud:', error);
    }
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };
    return texts[status] || status;
  };
  return (
    <motion.div
      className="admin-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1>GESTIÓN DE SOLICITUDES</h1>
      
      {/* Appointments from main form */}
      <div className="appointments-section">
        <h2>Solicitudes desde Formulario Principal</h2>
        <div className="appointments-accordion">
          {appointments.length === 0 ? (
            <p className="empty-state">No hay solicitudes del formulario</p>
          ) : (
            appointments.map((apt, index) => (
              <AppointmentAccordionItem
                key={apt.id}
                appointment={apt}
                index={index}
                onUpdateStatus={updateStatus}
                onDelete={deleteAppointment}
                getStatusText={getStatusText}
              />
            ))
          )}
        </div>
      </div>
      {/* Detailed requests from dashboard */}
      <div className="requests-section">
        <h2>Solicitudes Detalladas desde Dashboard</h2>
        <div className="requests-grid-admin">
          {requests.length === 0 ? (
            <p className="empty-state">No hay solicitudes detalladas</p>
          ) : (
            requests.map((request, index) => (
              <motion.div
                key={request.id}
                className="request-card-admin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ y: -4 }}
              >
                <div className="request-header">
                  <div>
                    <h3>{request.title}</h3>
                    <p className="request-user">Usuario: {request.user_name}</p>
                    <p className="request-type-label">{request.project_type}</p>
                  </div>
                  <span className={`status-badge status-${request.status}`}>
                    {getStatusText(request.status)}
                  </span>
                </div>

                <p className="request-description">{request.description}</p>

                <div className="request-details-grid">
                  {request.budget_range && (
                    <div className="detail-tag">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                      {request.budget_range}
                    </div>
                  )}
                  {request.timeline && (
                    <div className="detail-tag">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {request.timeline}
                    </div>
                  )}
                  {request.budget && (
                    <div className="detail-tag">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                      ${request.budget}
                    </div>
                  )}
                </div>

                {request.attachments && request.attachments.length > 0 && (
                  <div className="request-attachments">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                    </svg>
                    <span>{request.attachments.length} archivo(s)</span>
                  </div>
                )}

                <div className="request-actions">
                  {request.status === 'pending' && (
                    <motion.button
                      className="btn-action btn-confirm"
                      onClick={() => updateRequestStatus(request.id, 'confirmed')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Aprobar
                    </motion.button>
                  )}
                  <motion.button
                    className="btn-action btn-delete"
                    onClick={() => deleteRequest(request.id)}
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
      </div>
    </motion.div>
  );
}

// Appointment Accordion Item Component
function AppointmentAccordionItem({ appointment, index, onUpdateStatus, onDelete, getStatusText }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="appointment-accordion-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
    >
      <motion.div
        className="appointment-accordion-header"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
      >
        <div className="appointment-summary">
          <div className="appointment-summary-main">
            <h4>{appointment.name}</h4>
            <span className="appointment-summary-email">{appointment.email}</span>
            {appointment.business_name && (
              <span className="appointment-summary-business">{appointment.business_name}</span>
            )}
          </div>
          <div className="appointment-summary-meta">
            <span className={`status-badge-small status-${appointment.status}`}>
              {getStatusText(appointment.status)}
            </span>
            <span className="appointment-date">
              {new Date(appointment.preferred_date).toLocaleDateString('es-ES')}
            </span>
          </div>
        </div>
        <motion.div
          className="accordion-chevron"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </motion.div>
      </motion.div>

      <motion.div
        className="appointment-accordion-content"
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ overflow: 'hidden' }}
      >
        <div className="appointment-details-expanded">
          <div className="appointment-contact-info">
            <div className="detail-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>{appointment.phone}</span>
            </div>
            <div className="detail-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>{new Date(appointment.preferred_date).toLocaleDateString('es-ES')}</span>
            </div>
          </div>

          {appointment.message && (
            <div className="appointment-message-expanded">
              <h5>Mensaje:</h5>
              <p>{appointment.message}</p>
            </div>
          )}

          <div className="appointment-actions">
            {appointment.status === 'pending' && (
              <motion.button
                className="btn-action btn-confirm"
                onClick={() => onUpdateStatus(appointment.id, 'confirmed')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Confirmar
              </motion.button>
            )}
            {appointment.status === 'confirmed' && (
              <motion.button
                className="btn-action btn-complete"
                onClick={() => onUpdateStatus(appointment.id, 'completed')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Completar
              </motion.button>
            )}
            <motion.button
              className="btn-action btn-delete"
              onClick={() => onDelete(appointment.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Eliminar
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Chats Section Component
function ChatsSection() {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      const interval = setInterval(() => loadMessages(selectedConversation.id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Filter conversations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(conv => 
        conv.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.last_message.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  }, [conversations, searchQuery]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/messages/admin/conversations');
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error al cargar conversaciones:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await fetch(`/api/messages/conversation/${conversationId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments(prev => {
      const attachment = prev.find(att => att.id === id);
      if (attachment && attachment.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
      return prev.filter(att => att.id !== id);
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;
    if (!selectedConversation) return;

    try {
      let attachmentData = [];
      
      // Upload attachments if any
      if (attachments.length > 0) {
        const formData = new FormData();
        attachments.forEach(attachment => {
          formData.append('attachments', attachment.file);
        });
        
        const uploadResponse = await fetch('/api/upload/chat-attachments', {
          method: 'POST',
          body: formData
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          attachmentData = uploadResult.files;
        } else {
          console.error('Error uploading attachments');
          return;
        }
      }

      // Send message with attachments
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage,
          user_id: selectedConversation.id,
          attachments: attachmentData
        })
      });

      if (response.ok) {
        setNewMessage('');
        // Clear attachments
        attachments.forEach(att => {
          if (att.preview) URL.revokeObjectURL(att.preview);
        });
        setAttachments([]);
        loadMessages(selectedConversation.id);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const deleteMessage = async (messageId) => {
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) return;
    
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Refresh messages
        loadMessages(selectedConversation.id);
      } else {
        alert('Error al eliminar el mensaje');
      }
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
      alert('Error al eliminar el mensaje');
    }
  };

  const deleteAllMessages = async () => {
    if (!confirm(`¿Estás seguro de eliminar TODA la conversación con ${selectedConversation.user_name}? Esta acción no se puede deshacer.`)) return;
    
    try {
      const response = await fetch(`/api/messages/conversation/${selectedConversation.id}/all`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`${result.deletedCount} mensajes eliminados`);
        // Refresh messages and conversations
        setMessages([]);
        loadConversations();
      } else {
        alert('Error al eliminar la conversación');
      }
    } catch (error) {
      console.error('Error al eliminar conversación:', error);
      alert('Error al eliminar la conversación');
    }
  };
  return (
    <motion.div
      className="admin-content chat-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1>CHATS DE SOPORTE</h1>
      
      <div className="chat-layout">
        <div className="conversations-list">
          <div className="conversations-header">
            <h3>Conversaciones</h3>
            <div className="search-container">
              <div className="search-input-wrapper">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Buscar conversaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => setSearchQuery('')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          {filteredConversations.length === 0 ? (
            <p className="empty-state">
              {searchQuery ? 'No se encontraron conversaciones' : 'No hay conversaciones'}
            </p>
          ) : (
            filteredConversations.map((conv) => (
              <motion.div
                key={conv.id}
                className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                onClick={() => setSelectedConversation(conv)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="conversation-avatar">
                  {conv.user_name.charAt(0).toUpperCase()}
                </div>
                <div className="conversation-info">
                  <h4>{conv.user_name}</h4>
                  <p className="last-message">{conv.last_message}</p>
                  <span className="conversation-time">
                    {new Date(conv.last_message_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
                {conv.unread_count > 0 && (
                  <span className="unread-badge">{conv.unread_count}</span>
                )}
              </motion.div>
            ))
          )}
        </div>

        <div className="chat-area">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div className="chat-header-content">
                  <h3>Chat con {selectedConversation.user_name}</h3>
                  <p>{selectedConversation.user_email}</p>
                </div>
                <div className="chat-actions">
                  <motion.button
                    className="btn-delete-all"
                    onClick={() => deleteAllMessages()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Eliminar toda la conversación"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                    Borrar Todo
                  </motion.button>
                </div>
              </div>
              
              <div className="messages-container">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.sender_role === 'admin' ? 'admin' : 'user'}`}
                  >
                    <div className="message-content">
                      <div className="message-header">
                        <p>{message.message}</p>
                        <motion.button
                          className="btn-delete-message"
                          onClick={() => deleteMessage(message.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Eliminar mensaje"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18"/>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          </svg>
                        </motion.button>
                      </div>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="message-attachments">
                          {message.attachments.map((attachment, idx) => (
                            <div key={idx} className="attachment-preview">
                              {attachment.type?.startsWith('image/') ? (
                                <img src={attachment.url} alt={attachment.name} className="attachment-image" />
                              ) : (
                                <div className="attachment-file">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                  </svg>
                                  <span>{attachment.name}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <span className="message-time">
                        {new Date(message.created_at).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Attachment Preview */}
              {attachments.length > 0 && (
                <div className="attachment-preview-container">
                  <h4>Archivos adjuntos:</h4>
                  <div className="attachments-grid">
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="attachment-item">
                        {attachment.preview ? (
                          <img src={attachment.preview} alt={attachment.name} className="attachment-thumbnail" />
                        ) : (
                          <div className="attachment-file-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                            </svg>
                          </div>
                        )}
                        <div className="attachment-info">
                          <span className="attachment-name">{attachment.name}</span>
                          <span className="attachment-size">{formatFileSize(attachment.size)}</span>
                        </div>
                        <button
                          type="button"
                          className="remove-attachment"
                          onClick={() => removeAttachment(attachment.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={sendMessage} className="message-form">
                <div className="message-input-container">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe tu respuesta..."
                  />
                  
                  <div className="attachment-controls">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                      accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                    />
                    
                    <motion.button
                      type="button"
                      className="attachment-btn"
                      onClick={() => fileInputRef.current?.click()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Adjuntar archivo"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                      </svg>
                    </motion.button>
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  className="send-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </motion.button>
              </form>
            </>
          ) : (
            <div className="no-conversation">
              <p>Selecciona una conversación para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
// Quicks Section Component
function QuicksSection() {
  const [quickCodes, setQuickCodes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    company: '',
    expiresAt: ''
  });

  useEffect(() => {
    loadQuickCodes();
  }, []);

  const loadQuickCodes = async () => {
    try {
      const response = await fetch('/api/admin/quick-codes');
      const data = await response.json();
      setQuickCodes(data);
    } catch (error) {
      console.error('Error al cargar códigos quick:', error);
    }
  };

  const generateQuickCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const quickCode = generateQuickCode();
    
    try {
      const response = await fetch('/api/admin/quick-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          code: quickCode
        })
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          position: '',
          company: '',
          expiresAt: ''
        });
        loadQuickCodes();
      }
    } catch (error) {
      console.error('Error al crear código quick:', error);
    }
  };

  const deleteQuickCode = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este código?')) return;
    
    try {
      const response = await fetch(`/api/admin/quick-codes/${id}`, { method: 'DELETE' });
      if (response.ok) {
        loadQuickCodes();
      }
    } catch (error) {
      console.error('Error al eliminar código:', error);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  return (
    <motion.div
      className="admin-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="section-header">
        <h1>CÓDIGOS DE ACCESO RÁPIDO</h1>
        <motion.button
          className="btn-primary"
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Crear Código
        </motion.button>
      </div>

      <div className="quick-codes-grid">
        {quickCodes.length === 0 ? (
          <p className="empty-state">No hay códigos de acceso creados</p>
        ) : (
          quickCodes.map((quickCode, index) => (
            <motion.div
              key={quickCode.id}
              className="quick-code-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ y: -4 }}
            >
              <div className="quick-code-header">
                <div className="quick-code-info">
                  <h3>{quickCode.name}</h3>
                  <p className="quick-code-email">{quickCode.email}</p>
                </div>
                <div className="quick-code-actions">
                  <motion.button
                    className="btn-icon btn-copy"
                    onClick={() => copyToClipboard(quickCode.code)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Copiar código"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  </motion.button>
                  <motion.button
                    className="btn-icon btn-delete"
                    onClick={() => deleteQuickCode(quickCode.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Eliminar código"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </motion.button>
                </div>
              </div>

              <div className="quick-code-display">
                <span className="code-label">Código:</span>
                <span className="code-value">{quickCode.code}</span>
              </div>

              <div className="quick-code-details">
                {quickCode.phone && (
                  <div className="detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span>{quickCode.phone}</span>
                  </div>
                )}
                {quickCode.position && (
                  <div className="detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>{quickCode.position}</span>
                  </div>
                )}
                {quickCode.company && (
                  <div className="detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18"/>
                      <path d="M5 21V7l8-4v18"/>
                      <path d="M19 21V11l-6-4"/>
                    </svg>
                    <span>{quickCode.company}</span>
                  </div>
                )}
              </div>

              <div className="quick-code-footer">
                <span className={`status-badge ${quickCode.used ? 'used' : 'active'}`}>
                  {quickCode.used ? 'Usado' : 'Activo'}
                </span>
                <span className="expiry-date">
                  Expira: {new Date(quickCode.expires_at).toLocaleDateString('es-ES')}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal for creating new quick code */}
      {showModal && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowModal(false)}
        >
          <motion.div
            className="modal-content quick-code-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Crear Código de Acceso Rápido</h3>
            
            <form onSubmit={handleSubmit} className="quick-code-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre Completo *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="Juan Pérez"
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    placeholder="juan@empresa.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="form-group">
                  <label>Cargo</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    placeholder="CEO, Director, etc."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Empresa</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="Nombre de la empresa"
                  />
                </div>

                <div className="form-group">
                  <label>Fecha de Expiración *</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirm">
                  Crear Código
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Instagram Section Component
function InstagramSection() {
  const [instagramMessages, setInstagramMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [authUrl, setAuthUrl] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [testRecipient, setTestRecipient] = useState('');

  useEffect(() => {
    checkInstagramConnection();
    loadInstagramMessages();
    getAuthUrl();
  }, []);

  const checkInstagramConnection = async () => {
    try {
      // Check if Instagram is configured by trying to get auth URL
      const response = await fetch('/api/instagram/auth/url');
      if (response.ok) {
        setConnectionStatus('disconnected');
      } else {
        setConnectionStatus('not_configured');
      }
    } catch (error) {
      console.error('Error checking Instagram connection:', error);
      setConnectionStatus('error');
    }
  };

  const getAuthUrl = async () => {
    try {
      const response = await fetch('/api/instagram/auth/url');
      if (response.ok) {
        const data = await response.json();
        setAuthUrl(data.authUrl);
      }
    } catch (error) {
      console.error('Error getting auth URL:', error);
    }
  };

  const loadInstagramMessages = async () => {
    try {
      // This would load messages from your database
      // For now, we'll show a placeholder
      setInstagramMessages([]);
    } catch (error) {
      console.error('Error loading Instagram messages:', error);
    }
  };

  const sendTestMessage = async () => {
    if (!testRecipient || !testMessage) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await fetch('/api/instagram/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: testRecipient,
          message: testMessage
        })
      });

      if (response.ok) {
        alert('Mensaje enviado exitosamente');
        setTestMessage('');
        setTestRecipient('');
      } else {
        alert('Error al enviar mensaje');
      }
    } catch (error) {
      console.error('Error sending test message:', error);
      alert('Error al enviar mensaje');
    }
  };

  const renderConnectionStatus = () => {
    switch (connectionStatus) {
      case 'checking':
        return (
          <div className="instagram-status checking">
            <div className="status-icon">⏳</div>
            <div className="status-text">
              <h3>Verificando conexión...</h3>
              <p>Comprobando el estado de Instagram</p>
            </div>
          </div>
        );
      
      case 'connected':
        return (
          <div className="instagram-status connected">
            <div className="status-icon">✅</div>
            <div className="status-text">
              <h3>Instagram Conectado</h3>
              <p>El bot está funcionando correctamente</p>
            </div>
          </div>
        );
      
      case 'disconnected':
        return (
          <div className="instagram-status disconnected">
            <div className="status-icon">⚠️</div>
            <div className="status-text">
              <h3>Instagram Desconectado</h3>
              <p>Necesitas autorizar la aplicación</p>
            </div>
            {authUrl && (
              <a href={authUrl} target="_blank" rel="noopener noreferrer" className="connect-btn">
                Conectar Instagram
              </a>
            )}
          </div>
        );
      
      case 'not_configured':
        return (
          <div className="instagram-status not-configured">
            <div className="status-icon">❌</div>
            <div className="status-text">
              <h3>Instagram No Configurado</h3>
              <p>Faltan las variables de entorno</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="instagram-status error">
            <div className="status-icon">❌</div>
            <div className="status-text">
              <h3>Error de Conexión</h3>
              <p>No se pudo verificar el estado</p>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      className="admin-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="section-header">
        <h2>Instagram DM Bot</h2>
        <p>Gestiona la integración con Instagram Direct Messages</p>
      </div>

      {/* Connection Status */}
      <div className="instagram-connection-card">
        {renderConnectionStatus()}
      </div>

      {/* Configuration Guide */}
      <div className="instagram-config-card">
        <h3>📋 Configuración</h3>
        <div className="config-info">
          <h4>URLs para Meta for Developers:</h4>
          <div className="url-list">
            <div className="url-item">
              <strong>Webhook URL:</strong>
              <code>https://genswave.onrender.com/api/instagram/webhook</code>
            </div>
            <div className="url-item">
              <strong>OAuth Redirect URI:</strong>
              <code>https://genswave.onrender.com/api/instagram/auth/callback</code>
            </div>
          </div>
          
          <h4>Variables de Entorno Requeridas:</h4>
          <ul className="env-vars">
            <li><code>INSTAGRAM_APP_ID</code> - ID de tu app de Meta</li>
            <li><code>INSTAGRAM_APP_SECRET</code> - Secret de tu app</li>
            <li><code>INSTAGRAM_ACCESS_TOKEN</code> - Token de acceso</li>
            <li><code>INSTAGRAM_WEBHOOK_VERIFY_TOKEN</code> - Token de verificación</li>
          </ul>
          
          <p>
            <strong>📖 Guía completa:</strong> Revisa el archivo <code>INSTAGRAM_SETUP.md</code> 
            para instrucciones detalladas de configuración.
          </p>
        </div>
      </div>

      {/* Test Message */}
      {connectionStatus === 'connected' && (
        <div className="instagram-test-card">
          <h3>🧪 Enviar Mensaje de Prueba</h3>
          <div className="test-form">
            <div className="form-group">
              <label>ID del Destinatario:</label>
              <input
                type="text"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                placeholder="Instagram User ID"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Mensaje:</label>
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Escribe tu mensaje de prueba..."
                className="form-textarea"
                rows="3"
              />
            </div>
            <button onClick={sendTestMessage} className="test-send-btn">
              Enviar Mensaje
            </button>
          </div>
        </div>
      )}

      {/* Bot Commands */}
      <div className="instagram-commands-card">
        <h3>🤖 Comandos del Bot</h3>
        <div className="commands-grid">
          <div className="command-item">
            <strong>"Hola" / "Hello" / "Hi"</strong>
            <p>Mensaje de bienvenida con opciones</p>
          </div>
          <div className="command-item">
            <strong>"Cotización" / "Precio"</strong>
            <p>Solicitud de cotización</p>
          </div>
          <div className="command-item">
            <strong>"Cita" / "Reunión"</strong>
            <p>Agendar una cita</p>
          </div>
          <div className="command-item">
            <strong>"Servicios"</strong>
            <p>Lista de servicios disponibles</p>
          </div>
          <div className="command-item">
            <strong>"Ayuda" / "Help"</strong>
            <p>Menú de comandos disponibles</p>
          </div>
          <div className="command-item">
            <strong>Otros mensajes</strong>
            <p>Respuesta automática + guardado para revisión</p>
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="instagram-messages-card">
        <h3>📨 Mensajes Recientes</h3>
        {instagramMessages.length === 0 ? (
          <div className="no-messages">
            <p>No hay mensajes de Instagram aún.</p>
            <p>Los mensajes aparecerán aquí cuando los usuarios escriban a tu Instagram.</p>
          </div>
        ) : (
          <div className="messages-list">
            {instagramMessages.map((message, index) => (
              <div key={index} className="message-item">
                <div className="message-header">
                  <strong>{message.sender_name}</strong>
                  <span className="message-time">{message.created_at}</span>
                </div>
                <div className="message-content">{message.message_text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Account Settings Section Component
function AccountSettingsSection() {
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    profile_photo: ''
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const response = await fetch('/api/auth/profile');
      if (response.ok) {
        const data = await response.json();
        setAdminData(data);
        setProfilePhotoPreview(data.profile_photo || '');
      }
    } catch (error) {
      console.error('Error al cargar datos del admin:', error);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setProfilePhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfilePhotoFile(null);
    setProfilePhotoPreview('');
    setAdminData({...adminData, profile_photo: ''});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let photoUrl = adminData.profile_photo;

      // Upload photo if a new file was selected
      if (profilePhotoFile) {
        const formData = new FormData();
        formData.append('image', profilePhotoFile);

        const uploadResponse = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          photoUrl = uploadData.url;
        }
      }

      // Update admin profile
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: adminData.name,
          profile_photo: photoUrl
        })
      });

      if (response.ok) {
        alert('Perfil actualizado exitosamente');
        setProfilePhotoFile(null);
        loadAdminData();
      } else {
        alert('Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="admin-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1>CONFIGURACIÓN DE CUENTA</h1>
      
      <div className="account-settings-container">
        <form onSubmit={handleSubmit} className="account-form">
          <div className="profile-photo-section">
            <h3>Foto de Perfil</h3>
            <div className="photo-upload-area">
              {profilePhotoPreview ? (
                <div className="photo-preview">
                  <img src={profilePhotoPreview} alt="Profile" className="preview-image" />
                  <button type="button" className="remove-photo-btn" onClick={removePhoto}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="photo-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>Sin foto de perfil</span>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
                id="profile-photo-upload"
              />
              <label htmlFor="profile-photo-upload" className="upload-photo-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {profilePhotoPreview ? 'Cambiar Foto' : 'Subir Foto'}
              </label>
            </div>
          </div>

          <div className="form-fields">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={adminData.name}
                onChange={(e) => setAdminData({...adminData, name: e.target.value})}
                required
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={adminData.email}
                disabled
                className="disabled-field"
              />
              <small>El email no se puede cambiar</small>
            </div>
          </div>

          <div className="form-actions">
            <motion.button
              type="submit"
              className="save-btn"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <svg className="loading-spinner" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                      <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  Guardar Cambios
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

// Stats Section Component
function StatsSection() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalAppointments: 0,
    totalRequests: 0,
    projectsByStatus: {},
    userGrowth: [],
    projectProgress: [],
    recentActivity: [],
    monthlyRevenue: 0,
    completedProjects: 0,
    activeProjects: 0,
    pendingRequests: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [usersRes, projectsRes, appointmentsRes, requestsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/projects'),
        fetch('/api/appointments'),
        fetch('/api/requests/admin/requests')
      ]);

      const users = await usersRes.json();
      const projects = await projectsRes.json();
      const appointments = await appointmentsRes.json();
      const requests = await requestsRes.json();

      // Calculate project statistics
      const projectsByStatus = projects.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      }, {});

      const completedProjects = projects.filter(p => p.status === 'completed').length;
      const activeProjects = projects.filter(p => p.status === 'active').length;
      const pendingRequests = requests.filter(r => r.status === 'pending').length;

      // Calculate monthly revenue (sum of completed project budgets)
      const monthlyRevenue = projects
        .filter(p => p.status === 'completed' && p.budget)
        .reduce((sum, p) => sum + parseFloat(p.budget || 0), 0);

      // Generate mock user growth data (last 6 months)
      const userGrowth = Array.from({ length: 6 }, (_, i) => ({
        month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es', { month: 'short' }),
        users: Math.floor(users.length * (0.6 + i * 0.08))
      }));

      // Project progress data
      const projectProgress = projects.map(p => ({
        name: p.title?.substring(0, 20) + '...',
        progress: p.progress || 0,
        status: p.status
      })).slice(0, 5);

      setStats({
        totalUsers: users.length,
        totalProjects: projects.length,
        totalAppointments: appointments.length,
        totalRequests: requests.length,
        projectsByStatus,
        userGrowth,
        projectProgress,
        monthlyRevenue,
        completedProjects,
        activeProjects,
        pendingRequests
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  return (
    <motion.div
      className="admin-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1>ESTADÍSTICAS Y ANÁLISIS</h1>
      
      {/* Key Metrics */}
      <div className="stats-grid">
        <StatCard
          title="Total Usuarios"
          value={stats.totalUsers}
          change="+12%"
          positive={true}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          }
        />
        <StatCard
          title="Proyectos Activos"
          value={stats.activeProjects}
          change="+8%"
          positive={true}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          }
        />
        <StatCard
          title="Ingresos del Mes"
          value={`${stats.monthlyRevenue.toLocaleString()}`}
          change="+24%"
          positive={true}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          }
        />
        <StatCard
          title="Solicitudes Pendientes"
          value={stats.pendingRequests}
          change="-5%"
          positive={false}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          }
        />
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Crecimiento de Usuarios</h3>
          <div className="line-chart">
            {stats.userGrowth.map((data, index) => (
              <div key={index} className="chart-bar">
                <div 
                  className="bar-fill"
                  style={{ height: `${(data.users / stats.totalUsers) * 100}%` }}
                />
                <span className="bar-label">{data.month}</span>
                <span className="bar-value">{data.users}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3>Estado de Proyectos</h3>
          <div className="donut-chart">
            <div className="donut-center">
              <span className="donut-total">{stats.totalProjects}</span>
              <span className="donut-label">Proyectos</span>
            </div>
            <div className="donut-segments">
              {Object.entries(stats.projectsByStatus).map(([status, count], index) => (
                <div key={status} className="status-item">
                  <div className={`status-dot status-${status}`}></div>
                  <span className="status-name">{status}</span>
                  <span className="status-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Progress */}
      <div className="progress-section">
        <h3>Progreso de Proyectos Recientes</h3>
        <div className="progress-list">
          {stats.projectProgress.map((project, index) => (
            <motion.div
              key={index}
              className="progress-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="progress-info">
                <span className="progress-name">{project.name}</span>
                <span className="progress-percentage">{project.progress}%</span>
              </div>
              <div className="progress-bar-container">
                <motion.div 
                  className="progress-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
              <span className={`progress-status status-${project.status}`}>
                {project.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div className="actions-grid">
          <motion.button 
            className="action-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Generar Reporte
          </motion.button>
          <motion.button 
            className="action-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exportar Datos
          </motion.button>
          <motion.button 
            className="action-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Configuración
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
function StatCard({ title, value, icon, change, positive }) {
  return (
    <motion.div
      className="stat-card"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="stat-icon">{icon}</span>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
        {change && (
          <div className={`stat-change ${positive ? 'positive' : 'negative'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {positive ? (
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              ) : (
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
              )}
            </svg>
            {change}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Main Admin Component
function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersSection />;
      case 'appointments':
        return <AppointmentsSection />;
      case 'chats':
        return <ChatsSection />;
      case 'projects':
        return <AdminProjects />;
      case 'stats':
        return <StatsSection />;
      case 'quicks':
        return <QuicksSection />;
      case 'instagram':
        return <InstagramSection />;
      case 'account':
        return <AccountSettingsSection />;
      default:
        return <UsersSection />;
    }
  };
  return (
    <div className="admin-dashboard">
      <motion.aside
        className="admin-sidebar"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="sidebar-header">
          <h2>PANEL ADMIN</h2>
        </div>

        <nav className="sidebar-nav">
          <motion.button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <span className="nav-label">Usuarios</span>
          </motion.button>

          <motion.button
            className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <span className="nav-label">Solicitudes</span>
          </motion.button>

          <motion.button
            className={`nav-item ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <span className="nav-label">Chats</span>
          </motion.button>

          <motion.button
            className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <span className="nav-label">Gestión de Proyectos</span>
          </motion.button>

          <motion.button
            className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="20" x2="12" y2="10"/>
                <line x1="18" y1="20" x2="18" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="16"/>
              </svg>
            </div>
            <span className="nav-label">Estadísticas</span>
          </motion.button>

          <motion.button
            className={`nav-item ${activeTab === 'quicks' ? 'active' : ''}`}
            onClick={() => setActiveTab('quicks')}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
                <path d="M12 21c0-1-1-3-3-3s-3 2-3 3 1 3 3 3 3-2 3-3"/>
              </svg>
            </div>
            <span className="nav-label">Códigos Quick</span>
          </motion.button>

          <motion.button
            className={`nav-item ${activeTab === 'instagram' ? 'active' : ''}`}
            onClick={() => setActiveTab('instagram')}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </div>
            <span className="nav-label">Instagram DM</span>
          </motion.button>

          <motion.button
            className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span className="nav-label">Mi Cuenta</span>
          </motion.button>
        </nav>
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              )}
            </div>
            <div className="user-info">
              <p className="user-name">{user?.name || 'Admin'}</p>
              <p className="user-email">{user?.email || 'admin@studio.com'}</p>
            </div>
            <motion.button
              className="logout-icon-btn"
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Cerrar Sesión"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      <main className="admin-main">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Admin;