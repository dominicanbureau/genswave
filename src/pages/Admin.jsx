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
  const [serviceRequests, setServiceRequests] = useState([]);
  const [dashboardRequests, setDashboardRequests] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [archivedAppointments, setArchivedAppointments] = useState([]);
  const [archivedRequests, setArchivedRequests] = useState([]);

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
      // Separate service form requests from dashboard requests
      const serviceFormRequests = data.filter(r => r.request_type === 'formulario_servicios');
      const dashboardOnlyRequests = data.filter(r => r.request_type === 'panel');
      setServiceRequests(serviceFormRequests);
      setDashboardRequests(dashboardOnlyRequests);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
    }
  };

  const loadArchivedItems = async () => {
    try {
      const [appointmentsRes, requestsRes] = await Promise.all([
        fetch('/api/appointments/archived'),
        fetch('/api/requests/admin/requests/archived')
      ]);
      
      const archivedAppts = await appointmentsRes.json();
      const archivedReqs = await requestsRes.json();
      
      setArchivedAppointments(archivedAppts);
      setArchivedRequests(archivedReqs);
    } catch (error) {
      console.error('Error al cargar elementos archivados:', error);
    }
  };

  const archiveAppointment = async (id) => {
    try {
      const response = await fetch(`/api/appointments/${id}/archive`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        loadAppointments();
        loadArchivedItems();
      }
    } catch (error) {
      console.error('Error al archivar cita:', error);
    }
  };

  const archiveRequest = async (id) => {
    try {
      const response = await fetch(`/api/requests/admin/requests/${id}/archive`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        loadRequests();
        loadArchivedItems();
      }
    } catch (error) {
      console.error('Error al archivar solicitud:', error);
    }
  };

  const unarchiveAppointment = async (id) => {
    try {
      const response = await fetch(`/api/appointments/${id}/unarchive`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        loadAppointments();
        loadArchivedItems();
      }
    } catch (error) {
      console.error('Error al desarchivar cita:', error);
    }
  };

  const unarchiveRequest = async (id) => {
    try {
      const response = await fetch(`/api/requests/admin/requests/${id}/unarchive`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        loadRequests();
        loadArchivedItems();
      }
    } catch (error) {
      console.error('Error al desarchivar solicitud:', error);
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
      
      {/* Archive toggle button */}
      <div className="archive-controls">
        <motion.button
          className={`btn-archive-toggle ${showArchived ? 'active' : ''}`}
          onClick={() => {
            setShowArchived(!showArchived);
            if (!showArchived) {
              loadArchivedItems();
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <path d="M9 9h6v6H9z"/>
          </svg>
          {showArchived ? 'Ver Activas' : 'Ver Archivadas'}
          {!showArchived && (archivedAppointments.length + archivedRequests.length > 0) && (
            <span className="archive-count">
              {archivedAppointments.length + archivedRequests.length}
            </span>
          )}
        </motion.button>
      </div>
      
      {/* Appointments from main form and service requests */}
      <div className="appointments-section">
        <h2>
          {showArchived ? 'Citas Archivadas' : 'Solicitudes de Citas'} 
          ({showArchived ? 
            archivedAppointments.length + archivedRequests.filter(r => r.request_type === 'formulario_servicios').length : 
            appointments.length + serviceRequests.length
          })
        </h2>
        <div className="appointments-accordion">
          {showArchived ? (
            // Show archived items
            archivedAppointments.length === 0 && archivedRequests.filter(r => r.request_type === 'formulario_servicios').length === 0 ? (
              <p className="empty-state">No hay citas archivadas</p>
            ) : (
              <>
                {/* Archived appointments */}
                {archivedAppointments.map((apt, index) => (
                  <AppointmentAccordionItem
                    key={`archived-apt-${apt.id}`}
                    appointment={apt}
                    index={index}
                    onUpdateStatus={updateStatus}
                    onDelete={deleteAppointment}
                    onArchive={unarchiveAppointment}
                    getStatusText={getStatusText}
                    isArchived={true}
                  />
                ))}
                {/* Archived service requests */}
                {archivedRequests.filter(r => r.request_type === 'formulario_servicios').map((request, index) => (
                  <AppointmentAccordionItem
                    key={`archived-req-${request.id}`}
                    appointment={{
                      ...request,
                      name: request.user_name,
                      email: request.user_email,
                      phone: request.contact_phone,
                      message: request.additional_notes || request.description,
                      preferred_date: null,
                      service: request.title.replace('Solicitud de información - ', ''),
                      type: 'service_request'
                    }}
                    index={archivedAppointments.length + index}
                    onUpdateStatus={updateRequestStatus}
                    onDelete={deleteRequest}
                    onArchive={unarchiveRequest}
                    getStatusText={getStatusText}
                    isArchived={true}
                  />
                ))}
              </>
            )
          ) : (
            // Show active items
            appointments.length === 0 && serviceRequests.length === 0 ? (
              <p className="empty-state">No hay solicitudes del formulario</p>
            ) : (
              <>
                {/* Regular appointments */}
                {appointments.map((apt, index) => (
                  <AppointmentAccordionItem
                    key={`apt-${apt.id}`}
                    appointment={apt}
                    index={index}
                    onUpdateStatus={updateStatus}
                    onDelete={deleteAppointment}
                    onArchive={archiveAppointment}
                    getStatusText={getStatusText}
                    isArchived={false}
                  />
                ))}
                {/* Service form requests */}
                {serviceRequests.map((request, index) => (
                  <AppointmentAccordionItem
                    key={`req-${request.id}`}
                    appointment={{
                      ...request,
                      name: request.user_name,
                      email: request.user_email,
                      phone: request.contact_phone,
                      message: request.additional_notes || request.description,
                      preferred_date: null,
                      service: request.title.replace('Solicitud de información - ', ''),
                      type: 'service_request'
                    }}
                    index={appointments.length + index}
                    onUpdateStatus={updateRequestStatus}
                    onDelete={deleteRequest}
                    onArchive={archiveRequest}
                    getStatusText={getStatusText}
                    isArchived={false}
                  />
                ))}
              </>
            )
          )}
        </div>
      </div>
      
      {/* Dashboard requests section */}
      {!showArchived && (
        <div className="requests-section">
          <h2>Solicitudes del Dashboard ({dashboardRequests.length})</h2>
          <div className="requests-grid-admin">
            {dashboardRequests.length === 0 ? (
              <p className="empty-state">No hay solicitudes del dashboard</p>
            ) : (
              dashboardRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  className="request-card-admin"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ y: -4 }}
                  onMouseDown={(e) => {
                    const timer = setTimeout(() => {
                      archiveRequest(request.id);
                    }, 1000); // 1 second hold
                    
                    const handleMouseUp = () => {
                      clearTimeout(timer);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
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
      )}
    </motion.div>
  );
}

// Appointment Accordion Item Component
function AppointmentAccordionItem({ appointment, index, onUpdateStatus, onDelete, onArchive, getStatusText, isArchived }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  const handleMouseDown = (e) => {
    if (isArchived) return; // Don't allow archiving if already archived
    
    setIsHolding(true);
    const timer = setTimeout(() => {
      onArchive(appointment.id);
      setIsHolding(false);
    }, 1000); // 1 second hold
    
    const handleMouseUp = () => {
      clearTimeout(timer);
      setIsHolding(false);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
    
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);
  };

  return (
    <motion.div
      className={`appointment-accordion-item ${isHolding ? 'holding' : ''} ${isArchived ? 'archived' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      onMouseDown={handleMouseDown}
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
            {appointment.service && (
              <span className="appointment-summary-service">Servicio: {appointment.service}</span>
            )}
          </div>
          <div className="appointment-summary-meta">
            {isArchived && (
              <span className="archived-badge">Archivada</span>
            )}
            <span className={`status-badge-small status-${appointment.status}`}>
              {getStatusText(appointment.status)}
            </span>
            <span className="appointment-date">
              {appointment.preferred_date ? new Date(appointment.preferred_date).toLocaleDateString('es-ES') : 'No especificada'}
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
              <span>{appointment.preferred_date ? new Date(appointment.preferred_date).toLocaleDateString('es-ES') : 'No especificada'}</span>
            </div>
          </div>

          {appointment.message && (
            <div className="appointment-message-expanded">
              <h5>Mensaje:</h5>
              <p>{appointment.message}</p>
            </div>
          )}

          <div className="appointment-actions">
            {isArchived ? (
              <motion.button
                className="btn-action btn-unarchive"
                onClick={() => onArchive(appointment.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Desarchivar
              </motion.button>
            ) : (
              <>
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
              </>
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
  const [chatType, setChatType] = useState('web'); // 'web', 'instagram', or 'ai-bot'
  const [instagramBotUsers, setInstagramBotUsers] = useState([]);
  const [filteredInstagramBotUsers, setFilteredInstagramBotUsers] = useState([]);
  const [instagramMessages, setInstagramMessages] = useState([]);
  const [selectedInstagramConversation, setSelectedInstagramConversation] = useState(null);
  const [aiTransfers, setAiTransfers] = useState([]);
  const [filteredAiTransfers, setFilteredAiTransfers] = useState([]);
  const [selectedAiTransfer, setSelectedAiTransfer] = useState(null);
  const [aiTransferMessages, setAiTransferMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadInstagramBotUsers();
    const interval = setInterval(loadInstagramBotUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadAiTransfers();
    const interval = setInterval(loadAiTransfers, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConversation && chatType === 'web') {
      loadMessages(selectedConversation.id);
      const interval = setInterval(() => loadMessages(selectedConversation.id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation, chatType]);

  useEffect(() => {
    if (selectedInstagramConversation && chatType === 'instagram') {
      loadInstagramMessages(selectedInstagramConversation.instagram_user_id);
      const interval = setInterval(() => loadInstagramMessages(selectedInstagramConversation.instagram_user_id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedInstagramConversation, chatType]);

  useEffect(() => {
    if (selectedAiTransfer && chatType === 'ai-bot') {
      loadAiTransferMessages(selectedAiTransfer.id);
      const interval = setInterval(() => loadAiTransferMessages(selectedAiTransfer.id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedAiTransfer, chatType]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, instagramMessages, aiTransferMessages]);

  // Filter conversations based on search query
  useEffect(() => {
    if (chatType === 'web') {
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
    } else if (chatType === 'instagram') {
      if (!searchQuery.trim()) {
        setFilteredInstagramBotUsers(instagramBotUsers);
      } else {
        const filtered = instagramBotUsers.filter(user => 
          user.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.instagram_username && user.instagram_username.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.last_message && user.last_message.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredInstagramBotUsers(filtered);
      }
    } else if (chatType === 'ai-bot') {
      if (!searchQuery.trim()) {
        setFilteredAiTransfers(aiTransfers);
      } else {
        const filtered = aiTransfers.filter(transfer => 
          transfer.session_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (transfer.last_message && transfer.last_message.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredAiTransfers(filtered);
      }
    }
  }, [conversations, instagramBotUsers, aiTransfers, searchQuery, chatType]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadInstagramBotUsers = async () => {
    try {
      const response = await fetch('/api/instagram/bot-users');
      if (response.ok) {
        const data = await response.json();
        setInstagramBotUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error loading Instagram bot users:', error);
    }
  };

  const loadAiTransfers = async () => {
    try {
      const response = await fetch('/api/ai-assistant/admin/transfers');
      if (response.ok) {
        const data = await response.json();
        setAiTransfers(data.transfers || []);
      }
    } catch (error) {
      console.error('Error loading AI transfers:', error);
    }
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

  const loadInstagramMessages = async (userId) => {
    try {
      const response = await fetch(`/api/instagram/messages/${userId}`);
      const data = await response.json();
      setInstagramMessages(data);
    } catch (error) {
      console.error('Error al cargar mensajes de Instagram:', error);
    }
  };

  const loadAiTransferMessages = async (transferId) => {
    try {
      const response = await fetch(`/api/ai-assistant/admin/transfers/${transferId}/messages`);
      if (response.ok) {
        const data = await response.json();
        // Combine messages_history and sessionMessages
        const allMessages = [];
        
        // Add messages from history (initial conversation)
        if (data.messages && Array.isArray(data.messages)) {
          data.messages.forEach(msg => {
            allMessages.push({
              id: `hist-${Math.random()}`,
              text: msg.text || msg.message || '',
              sender: msg.sender || 'user',
              timestamp: msg.timestamp || new Date()
            });
          });
        }
        
        // Add messages from session (ongoing conversation)
        if (data.sessionMessages && Array.isArray(data.sessionMessages)) {
          data.sessionMessages.forEach(msg => {
            allMessages.push({
              id: msg.id || `sess-${Math.random()}`,
              text: msg.message || '',
              sender: msg.sender || 'user',
              timestamp: msg.created_at || new Date()
            });
          });
        }
        
        // Sort by timestamp
        allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        setAiTransferMessages(allMessages);
      }
    } catch (error) {
      console.error('Error loading AI transfer messages:', error);
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

  const sendEmailNotification = async (message) => {
    try {
      if (!selectedConversation) return;
      
      const response = await fetch('/api/requests/admin/send-message-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedConversation.id,
          message: message.message,
          adminName: 'Equipo Genswave' // Could be dynamic based on logged admin
        })
      });

      if (response.ok) {
        // Show success notification (you could add a toast notification here)
        console.log('✅ Email notification sent successfully');
        
        // Optional: Add visual feedback
        const button = document.querySelector(`[data-message-id="${message.id}"] .btn-email-message`);
        if (button) {
          button.style.color = '#10b981';
          setTimeout(() => {
            button.style.color = '';
          }, 2000);
        }
      } else {
        console.error('❌ Failed to send email notification');
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;
    
    if (chatType === 'web' && !selectedConversation) return;
    if (chatType === 'instagram' && !selectedInstagramConversation) return;

    try {
      if (chatType === 'web') {
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
      } else {
        // Send Instagram message
        const response = await fetch('/api/instagram/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientId: selectedInstagramConversation.instagram_user_id,
            message: newMessage
          })
        });

        if (response.ok) {
          setNewMessage('');
          loadInstagramMessages(selectedInstagramConversation.instagram_user_id);
        } else {
          const errorData = await response.json();
          alert('Error al enviar mensaje: ' + errorData.message);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const sendAiTransferMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedAiTransfer) return;

    try {
      const response = await fetch(`/api/ai-assistant/admin/transfers/${selectedAiTransfer.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage,
          sessionId: selectedAiTransfer.session_id
        })
      });

      if (response.ok) {
        setNewMessage('');
        loadAiTransferMessages(selectedAiTransfer.id);
        // Update transfer status to in_progress if it was pending
        if (selectedAiTransfer.status === 'pending') {
          await fetch(`/api/ai-assistant/admin/transfers/${selectedAiTransfer.id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'in_progress' })
          });
          loadAiTransfers();
        }
      }
    } catch (error) {
      console.error('Error sending AI transfer message:', error);
    }
  };

  const resolveAiTransfer = async () => {
    if (!selectedAiTransfer) return;

    try {
      const response = await fetch(`/api/ai-assistant/admin/transfers/${selectedAiTransfer.id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resolvedBy: 'Admin',
          notes: 'Caso resuelto por el equipo de soporte'
        })
      });

      if (response.ok) {
        alert('✅ Caso marcado como resuelto. El usuario será notificado.');
        loadAiTransfers();
        // Reload messages to show resolution
        loadAiTransferMessages(selectedAiTransfer.id);
      }
    } catch (error) {
      console.error('Error resolving transfer:', error);
      alert('❌ Error al resolver el caso');
    }
  };

  const deleteAiTransfer = async () => {
    if (!selectedAiTransfer) return;
    
    if (!confirm('¿Estás seguro de eliminar esta conversación? Esta acción no se puede deshacer.')) return;

    try {
      const response = await fetch(`/api/ai-assistant/admin/transfers/${selectedAiTransfer.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('✅ Conversación eliminada');
        setSelectedAiTransfer(null);
        setAiTransferMessages([]);
        loadAiTransfers();
      }
    } catch (error) {
      console.error('Error deleting transfer:', error);
      alert('❌ Error al eliminar la conversación');
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
    // Determine which type of chat we're deleting
    let confirmMessage = '';
    let deleteAction = null;

    if (chatType === 'web' && selectedConversation) {
      confirmMessage = `¿Estás seguro de eliminar TODA la conversación con ${selectedConversation.user_name}? Esta acción no se puede deshacer.`;
      deleteAction = async () => {
        const response = await fetch(`/api/messages/conversation/${selectedConversation.id}/all`, {
          method: 'DELETE'
        });
        if (response.ok) {
          const result = await response.json();
          alert(`${result.deletedCount} mensajes eliminados`);
          setMessages([]);
          loadConversations();
        }
      };
    } else if (chatType === 'ai-bot' && selectedAiTransfer) {
      confirmMessage = `¿Estás seguro de eliminar TODA la conversación del AI Bot (Sesión: ${selectedAiTransfer.session_id.substring(0, 12)}...)? Esta acción no se puede deshacer.`;
      deleteAction = async () => {
        const response = await fetch(`/api/ai-assistant/admin/transfers/${selectedAiTransfer.id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          alert('Conversación eliminada completamente');
          setAiTransferMessages([]);
          setSelectedAiTransfer(null);
          loadAiTransfers();
        }
      };
    } else if (chatType === 'instagram' && selectedInstagramConversation) {
      confirmMessage = `¿Estás seguro de eliminar TODA la conversación de Instagram con ${selectedInstagramConversation.sender_name}? Esta acción no se puede deshacer.`;
      deleteAction = async () => {
        // Instagram delete logic (if exists)
        alert('Función de eliminación de Instagram no implementada aún');
      };
    } else {
      return;
    }

    if (!confirm(confirmMessage)) return;
    
    try {
      await deleteAction();
    } catch (error) {
      console.error('Error al eliminar conversación:', error);
      alert('Error al eliminar la conversación');
    }
  };

  const generateQuickCodeForInstagram = async (instagramUserId) => {
    if (!confirm('¿Generar un código rápido para este usuario de Instagram?')) return;
    
    try {
      const response = await fetch('/api/instagram/generate-quick-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagramUserId: instagramUserId
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Código generado: ${result.code}\nSe ha enviado al usuario por Instagram.`);
        loadInstagramMessages(instagramUserId);
      } else {
        const error = await response.json();
        alert('Error al generar código: ' + error.message);
      }
    } catch (error) {
      console.error('Error al generar código rápido:', error);
      alert('Error al generar código rápido');
    }
  };

  const resetInstagramConversation = async (instagramUserId) => {
    if (!confirm('¿Reiniciar la conversación para este usuario? Esto limpiará cualquier proceso en curso.')) return;
    
    try {
      const response = await fetch('/api/instagram/reset-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagramUserId: instagramUserId
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('Conversación reiniciada correctamente.\nSe ha notificado al usuario.');
        loadInstagramMessages(instagramUserId);
      } else {
        const error = await response.json();
        alert('Error al reiniciar conversación: ' + error.message);
      }
    } catch (error) {
      console.error('Error al reiniciar conversación:', error);
      alert('Error al reiniciar conversación');
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
      
      <div className="chat-type-toggle">
        <button 
          className={`toggle-btn ${chatType === 'web' ? 'active' : ''}`}
          onClick={() => {
            setChatType('web');
            setSelectedConversation(null);
            setSelectedInstagramConversation(null);
            setSelectedAiTransfer(null);
            setMessages([]);
            setInstagramMessages([]);
            setAiTransferMessages([]);
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Chat Web
        </button>
        <button 
          className={`toggle-btn ${chatType === 'instagram' ? 'active' : ''}`}
          onClick={() => {
            setChatType('instagram');
            setSelectedConversation(null);
            setSelectedInstagramConversation(null);
            setSelectedAiTransfer(null);
            setMessages([]);
            setInstagramMessages([]);
            setAiTransferMessages([]);
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
          Instagram
        </button>
        <button 
          className={`toggle-btn ${chatType === 'ai-bot' ? 'active' : ''}`}
          onClick={() => {
            setChatType('ai-bot');
            setSelectedConversation(null);
            setSelectedInstagramConversation(null);
            setSelectedAiTransfer(null);
            setMessages([]);
            setInstagramMessages([]);
            setAiTransferMessages([]);
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4"/>
            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
            <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
            <path d="M12 21c0-1-1-3-3-3s-3 2-3 3 1 3 3 3 3-2 3-3"/>
          </svg>
          AI Bot
        </button>
      </div>
      
      <div className="chat-layout">
        <div className="conversations-list">
          <div className="conversations-header">
            <h3>
              {chatType === 'web' ? 'Conversaciones Web' : 
               chatType === 'instagram' ? 'Conversaciones Instagram' : 
               'Transferencias AI Bot'}
            </h3>
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
          {chatType === 'web' ? (
            filteredConversations.length === 0 ? (
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
            )
          ) : chatType === 'instagram' ? (
            filteredInstagramBotUsers.length === 0 ? (
              <p className="empty-state">
                {searchQuery ? 'No se encontraron conversaciones de Instagram' : 'No hay conversaciones de Instagram'}
              </p>
            ) : (
              filteredInstagramBotUsers.map((conv) => (
                <motion.div
                  key={conv.instagram_user_id}
                  className={`conversation-item ${selectedInstagramConversation?.instagram_user_id === conv.instagram_user_id ? 'active' : ''}`}
                  onClick={() => setSelectedInstagramConversation(conv)}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="conversation-avatar instagram">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </div>
                  <div className="conversation-info">
                    <h4>{conv.sender_name}</h4>
                    {conv.instagram_username && (
                      <p className="instagram-username">@{conv.instagram_username}</p>
                    )}
                    <p className="last-message">{conv.last_message}</p>
                    <span className="conversation-time">
                      {new Date(conv.last_message_time).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  {conv.unread_count > 0 && (
                    <span className="unread-badge">{conv.unread_count}</span>
                  )}
                </motion.div>
              ))
            )
          ) : (
            filteredAiTransfers.length === 0 ? (
              <p className="empty-state">
                {searchQuery ? 'No se encontraron transferencias de AI' : 'No hay transferencias de AI Bot'}
              </p>
            ) : (
              filteredAiTransfers.map((transfer) => (
                <motion.div
                  key={transfer.id}
                  className={`conversation-item ${selectedAiTransfer?.id === transfer.id ? 'active' : ''} ${transfer.status === 'user_disconnected' ? 'disconnected' : ''}`}
                  onClick={() => setSelectedAiTransfer(transfer)}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="conversation-avatar ai-bot">
                    {transfer.status === 'user_disconnected' ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4"/>
                        <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                        <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                      </svg>
                    )}
                  </div>
                  <div className="conversation-info">
                    <h4>Sesión AI: {transfer.session_id.substring(0, 12)}...</h4>
                    <p className="last-message">{transfer.last_message}</p>
                    {transfer.status === 'user_disconnected' && (
                      <span className="disconnected-warning">⚠️ Usuario desconectado</span>
                    )}
                    <span className="conversation-time">
                      {new Date(transfer.created_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <span className={`status-badge status-${transfer.status}`}>
                    {transfer.status === 'pending' ? 'Pendiente' : 
                     transfer.status === 'in_progress' ? 'En Progreso' : 
                     transfer.status === 'user_disconnected' ? 'Desconectado' : 'Resuelto'}
                  </span>
                </motion.div>
              ))
            )
          )}
        </div>

        <div className="chat-area">
          {(chatType === 'web' && selectedConversation) || 
           (chatType === 'instagram' && selectedInstagramConversation) || 
           (chatType === 'ai-bot' && selectedAiTransfer) ? (
            <>
              <div className="chat-header">
                <div className="chat-header-content">
                  {chatType === 'web' ? (
                    <>
                      <h3>Chat con {selectedConversation.user_name}</h3>
                      <p>{selectedConversation.user_email}</p>
                    </>
                  ) : chatType === 'instagram' ? (
                    <>
                      <h3>Instagram: {selectedInstagramConversation.sender_name}</h3>
                      <p>@{selectedInstagramConversation.instagram_username || 'Sin username'}</p>
                    </>
                  ) : (
                    <>
                      <h3>AI Bot Transfer: {selectedAiTransfer.session_id.substring(0, 12)}...</h3>
                      <p>Estado: {selectedAiTransfer.status === 'pending' ? 'Pendiente' : 
                                 selectedAiTransfer.status === 'in_progress' ? 'En Progreso' : 
                                 selectedAiTransfer.status === 'user_disconnected' ? 'Usuario Desconectado' : 'Resuelto'}</p>
                      {selectedAiTransfer.status === 'user_disconnected' && (
                        <p className="warning-text">⚠️ El usuario cerró el chat. No recibirá más mensajes.</p>
                      )}
                    </>
                  )}
                </div>
                <div className="chat-actions">
                  {chatType === 'instagram' && (
                    <>
                      <motion.button
                        className="btn-reset-conversation"
                        onClick={() => resetInstagramConversation(selectedInstagramConversation.instagram_user_id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Reiniciar conversación"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                          <path d="M21 3v5h-5"/>
                          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                          <path d="M3 21v-5h5"/>
                        </svg>
                        Reiniciar
                      </motion.button>
                      <motion.button
                        className="btn-generate-code"
                        onClick={() => generateQuickCodeForInstagram(selectedInstagramConversation.instagram_user_id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Generar código rápido"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 12l2 2 4-4"/>
                          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                          <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
                          <path d="M12 21c0-1-1-3-3-3s-3 2-3 3 1 3 3 3 3-2 3-3"/>
                        </svg>
                        Generar Código
                      </motion.button>
                    </>
                  )}
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
                {chatType === 'web' ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${message.sender_role === 'admin' ? 'admin' : 'user'}`}
                    >
                      <div className="message-content">
                        <div className="message-header">
                          <p>{message.message}</p>
                          <div className="message-actions">
                            {message.sender_role === 'admin' && (
                              <motion.button
                                className="btn-email-message"
                                onClick={() => sendEmailNotification(message)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Enviar email al usuario"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                  <polyline points="22,6 12,13 2,6"/>
                                </svg>
                              </motion.button>
                            )}
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
                  ))
                ) : chatType === 'instagram' ? (
                  instagramMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${message.is_from_user ? 'user' : 'admin'} instagram`}
                    >
                      <div className="message-content">
                        <div className="message-header">
                          <p>{message.message_text}</p>
                          <div className="message-type-indicator">
                            {message.is_from_user ? (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2v20"/>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="message-time">
                          {new Date(message.created_at).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  aiTransferMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${message.sender === 'ai' || message.sender === 'support' ? 'admin' : 'user'} ai-transfer`}
                    >
                      <div className="message-content">
                        <div className="message-header">
                          <div 
                            dangerouslySetInnerHTML={{ __html: message.text }}
                          />
                          <div className="message-type-indicator">
                            {message.sender === 'user' ? (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                              </svg>
                            ) : message.sender === 'support' ? (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 12l2 2 4-4"/>
                                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="message-time">
                          {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {message.sender === 'support' && (
                            <span className="support-label"> • Soporte</span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))
                )}
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

              {chatType !== 'ai-bot' ? (
                <form onSubmit={sendMessage} className="message-form">
                  <div className="message-input-container">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={chatType === 'web' ? "Escribe tu respuesta..." : "Responder por Instagram..."}
                    />
                    
                    {chatType === 'web' && (
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
                    )}
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
              ) : (
                <>
                  {selectedAiTransfer.status !== 'resolved' && (
                    <form onSubmit={sendAiTransferMessage} className="message-form">
                      <div className="message-input-container">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Responder al usuario..."
                        />
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
                  )}
                  
                  <div className="ai-transfer-actions">
                    {selectedAiTransfer.status === 'user_disconnected' ? (
                      <motion.button
                        className="btn-delete-transfer"
                        onClick={deleteAiTransfer}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                        Eliminar Conversación
                      </motion.button>
                    ) : selectedAiTransfer.status !== 'resolved' ? (
                      <motion.button
                        className="btn-resolve-transfer"
                        onClick={resolveAiTransfer}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 12l2 2 4-4"/>
                          <circle cx="12" cy="12" r="10"/>
                        </svg>
                        Marcar como Resuelto
                      </motion.button>
                    ) : (
                      <div className="resolved-indicator">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 12l2 2 4-4"/>
                          <circle cx="12" cy="12" r="10"/>
                        </svg>
                        <span>Caso Resuelto</span>
                      </div>
                    )}
                  </div>
                </>
              )}
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
  const [botUsers, setBotUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [testMessage, setTestMessage] = useState('');
  const [testRecipient, setTestRecipient] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    checkInstagramConnection();
    loadInstagramBotUsers();
    
    // Refresh bot users every 30 seconds
    const interval = setInterval(loadInstagramBotUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkInstagramConnection = async () => {
    try {
      // Check if Instagram environment variables are configured
      const response = await fetch('/api/instagram/status');
      if (response.ok) {
        const data = await response.json();
        if (data.configured) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('not_configured');
        }
      } else {
        setConnectionStatus('not_configured');
      }
    } catch (error) {
      console.error('Error checking Instagram connection:', error);
      setConnectionStatus('error');
    }
  };

  const loadInstagramBotUsers = async () => {
    try {
      const response = await fetch('/api/instagram/bot-users');
      if (response.ok) {
        const data = await response.json();
        setBotUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading bot users:', error);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const response = await fetch(`/api/instagram/messages/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    loadMessages(user.instagram_user_id);
  };

  const toggleBotForUser = async (userId, currentStatus) => {
    try {
      const response = await fetch(`/api/instagram/bot-users/${userId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !currentStatus })
      });

      if (response.ok) {
        // Reload bot users to reflect the change
        loadInstagramBotUsers();
      } else {
        alert('Error al cambiar estado del bot');
      }
    } catch (error) {
      console.error('Error toggling bot status:', error);
      alert('Error al cambiar estado del bot');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await fetch('/api/instagram/admin-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: selectedUser.instagram_user_id,
          message: newMessage.trim()
        })
      });

      if (response.ok) {
        setNewMessage('');
        // Reload messages to show the sent message
        loadMessages(selectedUser.instagram_user_id);
        // Refresh bot users to update last message time
        loadInstagramBotUsers();
      } else {
        alert('Error al enviar mensaje');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error al enviar mensaje');
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
            <div className="status-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div className="status-text">
              <h3>Verificando conexión...</h3>
              <p>Comprobando el estado de Instagram</p>
            </div>
          </div>
        );
      
      case 'connected':
        return (
          <div className="instagram-status connected">
            <div className="status-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="status-text">
              <h3>Instagram Conectado</h3>
              <p>El bot está funcionando correctamente</p>
            </div>
          </div>
        );
      
      case 'disconnected':
        return (
          <div className="instagram-status disconnected">
            <div className="status-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <div className="status-text">
              <h3>Instagram Desconectado</h3>
              <p>Necesitas autorizar la aplicación</p>
            </div>
          </div>
        );
      
      case 'not_configured':
        return (
          <div className="instagram-status not-configured">
            <div className="status-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <div className="status-text">
              <h3>Instagram No Configurado</h3>
              <p>Faltan las variables de entorno</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="instagram-status error">
            <div className="status-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
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

      {/* Migration Helper */}
      <MigrationHelper />

      {/* Connection Status */}
      <div className="instagram-connection-card">
        {renderConnectionStatus()}
      </div>

      {/* Configuration Guide */}
      <div className="instagram-config-card">
        <div className="config-header">
          <svg className="config-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4"/>
            <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
          </svg>
          <h3>Configuración</h3>
        </div>
        <div className="config-info">
          <h4>URLs para Meta for Developers:</h4>
          <div className="url-list">
            <div className="url-item">
              <strong>Webhook URL:</strong>
              <code>https://genswave.org/api/instagram/webhook</code>
            </div>
            <div className="url-item">
              <strong>OAuth Redirect URI:</strong>
              <code>https://genswave.org/api/instagram/auth/callback</code>
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
          <div className="test-header">
            <svg className="test-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <h3>Enviar Mensaje de Prueba</h3>
          </div>
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
        <div className="commands-header">
          <svg className="commands-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4"/>
            <path d="M12 2v20"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <h3>Comandos del Bot</h3>
        </div>
        <div className="commands-grid">
          <div className="command-item">
            <strong>"Hola" / "Hello" / "Hi"</strong>
            <p>Mensaje de bienvenida con opciones</p>
          </div>
          <div className="command-item">
            <strong>"Código" / "Acceso"</strong>
            <p>Generar código de acceso rápido</p>
          </div>
          <div className="command-item">
            <strong>"Consulta"</strong>
            <p>Verificar estado de proyectos/solicitudes</p>
          </div>
          <div className="command-item">
            <strong>"Salir"</strong>
            <p>Cancelar proceso actual</p>
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

      {/* Bot Users Management */}
      <div className="instagram-users-card">
        <div className="users-header">
          <svg className="users-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <h3>Usuarios del Bot</h3>
        </div>
        {botUsers.length === 0 ? (
          <div className="no-users">
            <p>No hay usuarios que hayan interactuado con el bot aún.</p>
            <p>Los usuarios aparecerán aquí cuando escriban a tu Instagram.</p>
          </div>
        ) : (
          <div className="users-list">
            {botUsers.map((user, index) => (
              <div key={index} className="user-item">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.profile_pic ? (
                      <img src={user.profile_pic} alt={user.username} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.username?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <div className="user-details">
                    <strong>@{user.username || 'Usuario desconocido'}</strong>
                    <p className="user-id">ID: {user.instagram_user_id}</p>
                    <p className="last-message">
                      Último mensaje: {user.last_message_at ? 
                        new Date(user.last_message_at).toLocaleString() : 
                        'Nunca'
                      }
                    </p>
                  </div>
                </div>
                <div className="user-actions">
                  <button
                    className={`bot-toggle-btn ${user.bot_enabled ? 'enabled' : 'disabled'}`}
                    onClick={() => toggleBotForUser(user.instagram_user_id, user.bot_enabled)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {user.bot_enabled ? (
                        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1h-1v3a7 7 0 0 1-7 7 7 7 0 0 1-7-7v-3H2a1 1 0 0 1-1-1V9a2 2 0 0 1 2-2h4V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                      ) : (
                        <path d="M9.5 11a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM17.5 11a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                      )}
                    </svg>
                    {user.bot_enabled ? 'Habilitado' : 'Deshabilitado'}
                  </button>
                  <button
                    className="view-messages-btn"
                    onClick={() => selectUser(user)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Ver Mensajes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message History Modal */}
      {selectedUser && (
        <div className="message-modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="message-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Mensajes con @{selectedUser.username}</h3>
              <button 
                className="close-modal-btn"
                onClick={() => setSelectedUser(null)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="messages-container">
              {messages.length === 0 ? (
                <p>No hay mensajes aún</p>
              ) : (
                messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`message ${msg.is_from_bot ? 'bot-message' : 'user-message'}`}
                  >
                    <div className="message-content">{msg.message_text}</div>
                    <div className="message-time">
                      {new Date(msg.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="message-input-container">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="message-input"
                rows="3"
              />
              <button onClick={sendMessage} className="send-message-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
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

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configSettings, setConfigSettings] = useState({
    siteName: 'Genswave',
    adminEmail: 'admin@genswave.com',
    maxFileSize: '10MB',
    allowRegistration: true,
    maintenanceMode: false,
    emailNotifications: true,
    backupFrequency: 'daily'
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

  const generateReport = async () => {
    try {
      const reportData = {
        generatedAt: new Date().toISOString(),
        summary: {
          totalUsers: stats.totalUsers,
          totalProjects: stats.totalProjects,
          activeProjects: stats.activeProjects,
          completedProjects: stats.completedProjects,
          totalAppointments: stats.totalAppointments,
          pendingRequests: stats.pendingRequests,
          monthlyRevenue: stats.monthlyRevenue
        },
        projectsByStatus: stats.projectsByStatus,
        projectProgress: stats.projectProgress
      };

      // Create and download PDF report
      const reportContent = `
REPORTE ADMINISTRATIVO - GENSWAVE
Generado: ${new Date().toLocaleDateString('es-ES')}

=== RESUMEN EJECUTIVO ===
Total de Usuarios: ${stats.totalUsers}
Total de Proyectos: ${stats.totalProjects}
Proyectos Activos: ${stats.activeProjects}
Proyectos Completados: ${stats.completedProjects}
Solicitudes Pendientes: ${stats.pendingRequests}
Ingresos del Mes: $${stats.monthlyRevenue.toLocaleString()}

=== ESTADO DE PROYECTOS ===
${Object.entries(stats.projectsByStatus).map(([status, count]) => 
  `${status.toUpperCase()}: ${count} proyectos`
).join('\n')}

=== PROGRESO DE PROYECTOS RECIENTES ===
${stats.projectProgress.map(p => 
  `${p.name}: ${p.progress}% (${p.status})`
).join('\n')}

Reporte generado automáticamente por el sistema Genswave.
      `;

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-genswave-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert('Reporte generado y descargado exitosamente');
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar el reporte');
    }
  };

  const exportData = async () => {
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

      const exportData = {
        exportDate: new Date().toISOString(),
        users: users.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.created_at
        })),
        projects: projects.map(p => ({
          id: p.id,
          title: p.title,
          status: p.status,
          progress: p.progress,
          budget: p.budget,
          clientName: p.client_name,
          createdAt: p.created_at
        })),
        appointments: appointments.map(a => ({
          id: a.id,
          name: a.name,
          email: a.email,
          status: a.status,
          preferredDate: a.preferred_date,
          createdAt: a.created_at
        })),
        requests: requests.map(r => ({
          id: r.id,
          title: r.title,
          status: r.status,
          projectType: r.project_type,
          budget: r.budget,
          createdAt: r.created_at
        }))
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `datos-genswave-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert('Datos exportados exitosamente');
    } catch (error) {
      console.error('Error al exportar datos:', error);
      alert('Error al exportar los datos');
    }
  };

  const openConfiguration = () => {
    setShowConfigModal(true);
  };

  const saveConfiguration = async () => {
    try {
      // Here you would typically save to a backend endpoint
      // For now, we'll just save to localStorage
      localStorage.setItem('adminConfig', JSON.stringify(configSettings));
      alert('Configuración guardada exitosamente');
      setShowConfigModal(false);
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      alert('Error al guardar la configuración');
    }
  };

  const handleConfigChange = (key, value) => {
    setConfigSettings(prev => ({
      ...prev,
      [key]: value
    }));
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
            onClick={generateReport}
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
            onClick={exportData}
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
            onClick={openConfiguration}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Configuración
          </motion.button>
        </div>
      </div>

      {/* Configuration Modal */}
      {showConfigModal && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowConfigModal(false)}
        >
          <motion.div
            className="modal-content config-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Configuración del Sistema</h3>
              <button 
                className="close-modal-btn"
                onClick={() => setShowConfigModal(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="config-form">
              <div className="config-section">
                <h4>Configuración General</h4>
                <div className="form-group">
                  <label>Nombre del Sitio</label>
                  <input
                    type="text"
                    value={configSettings.siteName}
                    onChange={(e) => handleConfigChange('siteName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email del Administrador</label>
                  <input
                    type="email"
                    value={configSettings.adminEmail}
                    onChange={(e) => handleConfigChange('adminEmail', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Tamaño Máximo de Archivo</label>
                  <select
                    value={configSettings.maxFileSize}
                    onChange={(e) => handleConfigChange('maxFileSize', e.target.value)}
                  >
                    <option value="5MB">5MB</option>
                    <option value="10MB">10MB</option>
                    <option value="25MB">25MB</option>
                    <option value="50MB">50MB</option>
                  </select>
                </div>
              </div>

              <div className="config-section">
                <h4>Configuración de Usuarios</h4>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={configSettings.allowRegistration}
                      onChange={(e) => handleConfigChange('allowRegistration', e.target.checked)}
                    />
                    Permitir registro de nuevos usuarios
                  </label>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={configSettings.emailNotifications}
                      onChange={(e) => handleConfigChange('emailNotifications', e.target.checked)}
                    />
                    Enviar notificaciones por email
                  </label>
                </div>
              </div>

              <div className="config-section">
                <h4>Mantenimiento y Respaldos</h4>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={configSettings.maintenanceMode}
                      onChange={(e) => handleConfigChange('maintenanceMode', e.target.checked)}
                    />
                    Modo de mantenimiento
                  </label>
                </div>
                <div className="form-group">
                  <label>Frecuencia de Respaldos</label>
                  <select
                    value={configSettings.backupFrequency}
                    onChange={(e) => handleConfigChange('backupFrequency', e.target.value)}
                  >
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowConfigModal(false)}>
                Cancelar
              </button>
              <button className="btn-confirm" onClick={saveConfiguration}>
                Guardar Configuración
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
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

  const handleLogout = async () => {
    try {
      // Llamar al endpoint de logout en el servidor
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include' // Importante para enviar cookies
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar localStorage de todas formas
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirigir al login
      navigate('/login');
    }
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
// Migration helper component
function MigrationHelper() {
  const [migrationStatus, setMigrationStatus] = useState('checking');
  const [migrationResult, setMigrationResult] = useState(null);

  useEffect(() => {
    checkMigrationStatus();
  }, []);

  const checkMigrationStatus = async () => {
    try {
      const response = await fetch('/api/migrate/check-profile-pic');
      const data = await response.json();
      
      if (data.migrationNeeded) {
        setMigrationStatus('needed');
      } else {
        setMigrationStatus('complete');
      }
    } catch (error) {
      console.error('Error checking migration status:', error);
      setMigrationStatus('error');
    }
  };

  const runMigration = async () => {
    setMigrationStatus('running');
    try {
      const response = await fetch('/api/migrate/add-profile-pic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMigrationStatus('complete');
        setMigrationResult('✅ Migración completada exitosamente');
      } else {
        setMigrationStatus('error');
        setMigrationResult('❌ Error en la migración: ' + data.error);
      }
    } catch (error) {
      console.error('Error running migration:', error);
      setMigrationStatus('error');
      setMigrationResult('❌ Error ejecutando migración');
    }
  };

  if (migrationStatus === 'complete') {
    return null; // Don't show if migration is complete
  }

  return (
    <div className="migration-helper" style={{
      background: migrationStatus === 'needed' ? '#fff3cd' : '#f8d7da',
      border: `1px solid ${migrationStatus === 'needed' ? '#ffeaa7' : '#f5c6cb'}`,
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '20px'
    }}>
      <h4 style={{ margin: '0 0 12px 0', color: '#856404' }}>
        🔧 Migración de Base de Datos Requerida
      </h4>
      
      {migrationStatus === 'needed' && (
        <>
          <p style={{ margin: '0 0 12px 0', color: '#856404' }}>
            Se necesita ejecutar una migración para agregar soporte de fotos de perfil en Instagram.
          </p>
          <button 
            onClick={runMigration}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Ejecutar Migración
          </button>
        </>
      )}
      
      {migrationStatus === 'running' && (
        <p style={{ margin: 0, color: '#856404' }}>
          ⏳ Ejecutando migración...
        </p>
      )}
      
      {migrationStatus === 'error' && (
        <p style={{ margin: 0, color: '#721c24' }}>
          {migrationResult || '❌ Error verificando estado de migración'}
        </p>
      )}
      
      {migrationResult && migrationStatus === 'complete' && (
        <p style={{ margin: 0, color: '#155724' }}>
          {migrationResult}
        </p>
      )}
    </div>
  );
}