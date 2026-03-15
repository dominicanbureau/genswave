import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [requests, setRequests] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initDashboard = async () => {
      try {
        await checkAuth();
        await fetchData();
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        setLoading(false);
      }
    };
    
    initDashboard();
    
    // Fallback: force loading off after 3 seconds
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    // Check if mobile on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timeout);
    };
  }, []);

  // Close mobile sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileSidebarOpen]);

  const checkAuth = async () => {
    try {
      console.log('🔐 Checking authentication...');
      const response = await fetch('/api/auth/status');
      if (!response.ok) {
        console.log('❌ Auth response not OK');
        navigate('/login');
        return;
      }
      
      const data = await response.json();
      console.log('👤 Auth data:', data);
      
      if (!data.authenticated) {
        console.log('❌ Not authenticated');
        navigate('/login');
      } else if (data.user.role === 'admin') {
        console.log('👑 Admin user, redirecting to admin');
        navigate('/admin');
      } else {
        console.log('✅ Regular user, setting up dashboard');
        setUser(data.user);
      }
    } catch (error) {
      console.error('❌ Auth error:', error);
      navigate('/login');
    }
  };

  const fetchData = async () => {
    try {
      console.log('📊 Fetching dashboard data...');
      setConnectionStatus('connecting');
      
      const [projectsRes, appointmentsRes, messagesRes, requestsRes] = await Promise.all([
        fetch('/api/projects').catch(() => ({ ok: false, json: () => [] })),
        fetch('/api/appointments').catch(() => ({ ok: false, json: () => [] })),
        fetch('/api/messages').catch(() => ({ ok: false, json: () => [] })),
        fetch('/api/requests').catch(() => ({ ok: false, json: () => [] }))
      ]);

      console.log('📈 API responses:', {
        projects: projectsRes.ok,
        appointments: appointmentsRes.ok,
        messages: messagesRes.ok,
        requests: requestsRes.ok
      });

      // Check if at least one request was successful
      const hasConnection = [projectsRes, appointmentsRes, messagesRes, requestsRes].some(res => res.ok);
      
      if (hasConnection) {
        setConnectionStatus('connected');
        
        const projectsData = projectsRes.ok ? await projectsRes.json() : [];
        const appointmentsData = appointmentsRes.ok ? await appointmentsRes.json() : [];
        const messagesData = messagesRes.ok ? await messagesRes.json() : [];
        const requestsData = requestsRes.ok ? await requestsRes.json() : [];

        setProjects(projectsData);
        setAppointments(appointmentsData);
        setMessages(messagesData);
        setRequests(requestsData);

        // Count unread messages (messages from admin that user hasn't seen)
        const unreadCount = messagesData.filter(msg => 
          msg.sender_role === 'admin' && !msg.is_read
        ).length;
        setUnreadMessages(unreadCount);
        
        console.log('✅ Data loaded successfully');
      } else {
        setConnectionStatus('disconnected');
        console.log('⚠️ No connection to server');
      }
      
      setLoading(false);
      console.log('🏁 Loading complete');
    } catch (error) {
      console.error('❌ Error loading data:', error);
      setConnectionStatus('disconnected');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    navigate('/');
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage })
      });

      if (response.ok) {
        setNewMessage('');
        fetchData();
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  // Close mobile sidebar when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Always close mobile sidebar when changing tabs
    setIsMobileSidebarOpen(false);
    
    // Mark messages as read when opening chat
    if (tabId === 'chat' && unreadMessages > 0) {
      markMessagesAsRead();
    }
  };

  const markMessagesAsRead = async () => {
    try {
      const response = await fetch('/api/messages/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setUnreadMessages(0);
        // Refresh messages to update read status
        fetchData();
      } else {
        console.warn('Failed to mark messages as read, but continuing...');
      }
    } catch (error) {
      console.warn('Error al marcar mensajes como leídos:', error);
      // Don't throw the error, just log it and continue
    }
  };

  // Close mobile sidebar when clicking outside
  const handleOverlayClick = () => {
    setIsMobileSidebarOpen(false);
  };

  // Get dynamic title based on active tab
  const getPageTitle = () => {
    const titles = {
      'overview': 'Resumen',
      'projects': 'Mis Proyectos', 
      'appointments': 'Solicitudes',
      'chat': 'Chat con Agente',
      'account': 'Mi Cuenta'
    };
    return titles[activeTab] || 'Genswave Dashboard';
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

  return (
    <div className="user-dashboard">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        user={user} 
        onLogout={handleLogout}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        onOverlayClick={handleOverlayClick}
        unreadMessages={unreadMessages}
        isMobile={isMobile}
      />
      
      <main className="dashboard-main">
        <div className="mobile-header">
          <motion.button
            className="mobile-menu-btn"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="hamburger-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </motion.button>
          <div className="mobile-header-content">
            <h2>{getPageTitle()}</h2>
            {activeTab === 'chat' && (
              <p className="mobile-chat-subtitle">Se te fue asignado un agente personal con el cual puedes conversar en este chat</p>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <Overview key="overview" projects={projects} appointments={appointments} />
          )}
          {activeTab === 'projects' && (
            <Projects key="projects" projects={projects} setActiveTab={handleTabChange} />
          )}
          {activeTab === 'appointments' && (
            <Appointments key="appointments" appointments={appointments} requests={requests} fetchData={fetchData} setActiveTab={handleTabChange} />
          )}
          {activeTab === 'account' && (
            <Account key="account" user={user} />
          )}
          {activeTab === 'chat' && (
            <Chat 
              key="chat" 
              messages={messages} 
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSend={sendMessage}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab, user, onLogout, isMobileOpen, setIsMobileOpen, onOverlayClick, unreadMessages, isMobile }) {
  const navigate = useNavigate();
  
  const tabs = [
    { 
      id: 'overview', 
      label: 'Resumen', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      )
    },
    { 
      id: 'projects', 
      label: 'Proyectos', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      )
    },
    { 
      id: 'appointments', 
      label: 'Solicitudes', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      )
    },
    { 
      id: 'chat', 
      label: 'Chat', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )
    },
    { 
      id: 'account', 
      label: 'Mi Cuenta', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    }
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSwitchToAdmin = () => {
    navigate('/admin');
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Always close mobile sidebar when changing tabs
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <motion.div
          className="mobile-sidebar-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onOverlayClick}
        />
      )}

      <motion.aside 
        className={`dashboard-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
        initial={false}
        animate={{ 
          x: isMobile ? (isMobileOpen ? 0 : -280) : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="sidebar-header">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Genswave
          </motion.h2>
          <motion.button
            className="mobile-close-btn"
            onClick={() => setIsMobileOpen(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5"/>
              <path d="M12 19l-7-7 7-7"/>
            </svg>
          </motion.button>
        </div>

        <nav className="sidebar-nav">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ x: 8, backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
              {tab.id === 'chat' && unreadMessages > 0 && (
                <span className="unread-badge">{unreadMessages}</span>
              )}
              {activeTab === tab.id && (
                <motion.div
                  className="active-indicator"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </nav>

        {user?.role === 'admin' && (
          <motion.div
            className="admin-switch"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className="switch-panel-btn"
              onClick={handleSwitchToAdmin}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Panel de Administrador
            </motion.button>
          </motion.div>
        )}

        <motion.div 
          className="sidebar-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="user-profile">
            <div className="user-avatar">
              {getInitials(user?.name)}
            </div>
            <div className="user-info">
              <p className="user-name">{user?.name}</p>
              <p className="user-email">{user?.email}</p>
            </div>
            <motion.button
              className="logout-icon-btn"
              onClick={onLogout}
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              title="Cerrar sesión"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </motion.aside>
    </>
  );
}

function Overview({ projects, appointments }) {
  const activeProjects = projects.filter(p => p.status === 'active');
  const pendingAppointments = appointments.filter(a => a.status === 'pending');

  return (
    <motion.div
      className="dashboard-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h1>Resumen</h1>
      
      <div className="stats-grid">
        <StatCard 
          title="Proyectos Activos" 
          value={activeProjects.length}
          icon={(
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          )}
        />
        <StatCard 
          title="Solicitudes Pendientes" 
          value={pendingAppointments.length}
          icon={(
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          )}
        />
        <StatCard 
          title="Total Proyectos" 
          value={projects.length}
          icon={(
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          )}
        />
      </div>

      <div className="recent-section">
        <h2>Proyectos Recientes</h2>
        <div className="project-list">
          {projects.slice(0, 3).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Projects({ projects, setActiveTab }) {
  return (
    <motion.div
      className="dashboard-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1>Mis Proyectos</h1>
      
      <div className="project-list">
        {projects.length === 0 ? (
          <div className="empty-state-custom">
            <p>
              Aún no tienes proyectos activos, realiza una solicitud{' '}
              <motion.button
                className="inline-link-btn"
                onClick={() => setActiveTab('appointments')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                aquí
              </motion.button>
              {' '}para que podamos comprender tu propuesta
            </p>
          </div>
        ) : (
          projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <ProjectCard project={project} detailed />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function Appointments({ appointments, requests, fetchData, setActiveTab }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectType: '',
    budgetRange: '',
    timeline: '',
    budget: '',
    preferredStartDate: '',
    technicalRequirements: '',
    targetAudience: '',
    additionalNotes: '',
    attachments: []
  });
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      approved: '#10b981',
      rejected: '#ef4444',
      completed: '#6366f1',
      confirmed: '#10b981'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendiente',
      approved: 'Aprobada',
      rejected: 'Rechazada',
      completed: 'Completada',
      confirmed: 'Confirmada'
    };
    return labels[status] || status;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    
    if (!formData.projectType) {
      newErrors.projectType = 'Selecciona un tipo de proyecto';
    }
    
    if (!formData.budget || parseFloat(formData.budget) < 300) {
      newErrors.budget = 'El presupuesto mínimo es $300';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({
          title: '',
          description: '',
          projectType: '',
          budgetRange: '',
          timeline: '',
          budget: '',
          preferredStartDate: '',
          technicalRequirements: '',
          targetAudience: '',
          additionalNotes: '',
          attachments: []
        });
        setErrors({});
        fetchData();
      }
    } catch (error) {
      console.error('Error al crear solicitud:', error);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you would upload these to a storage service
    // For now, we'll just store the file names
    const fileNames = files.map(f => f.name);
    setFormData({ ...formData, attachments: [...formData.attachments, ...fileNames] });
  };

  const removeAttachment = (index) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    setFormData({ ...formData, attachments: newAttachments });
  };

  const deleteRequest = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta solicitud?')) return;
    
    try {
      const response = await fetch(`/api/requests/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error al eliminar solicitud:', error);
    }
  };

  return (
    <motion.div
      className="dashboard-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1>Mis Solicitudes</h1>
      
      {/* Appointments from main form */}
      {appointments.length > 0 && (
        <div className="form-appointments-section">
          <h2>Solicitudes desde Formulario Principal</h2>
          <div className="appointments-list">
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                className="appointment-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.01, y: -4 }}
              >
                <div className="appointment-header">
                  <div className="appointment-title-section">
                    <h3>{appointment.service}</h3>
                    {appointment.unique_id && (
                      <div className="appointment-id">
                        <span className="id-label">ID:</span>
                        <span className="id-value">{appointment.unique_id}</span>
                      </div>
                    )}
                  </div>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(appointment.status) }}
                  >
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>
                <p className="appointment-date">
                  Fecha preferida: {new Date(appointment.preferred_date).toLocaleDateString()}
                </p>
                {appointment.business_name && (
                  <p className="appointment-business">Negocio: {appointment.business_name}</p>
                )}
                {appointment.message && (
                  <p className="appointment-message">{appointment.message}</p>
                )}
                {appointment.admin_notes && (
                  <div className="admin-notes">
                    <strong>Notas del administrador:</strong>
                    <p>{appointment.admin_notes}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard requests */}
      <div className="dashboard-requests-section">
        <div className="section-header">
          <h2>Solicitudes Detalladas</h2>
          <motion.button
            className="add-request-btn"
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </motion.button>
        </div>

        <div className="requests-grid">
          {requests.length === 0 ? (
            <p className="empty-state">No has creado solicitudes detalladas aún</p>
          ) : (
            requests.map((request, index) => (
              <motion.div
                key={request.id}
                className="request-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -4 }}
              >
                <div className="request-header">
                  <div className="request-title-section">
                    <h3>{request.title}</h3>
                    {request.unique_id && (
                      <div className="request-id">
                        <span className="id-label">ID:</span>
                        <span className="id-value">{request.unique_id}</span>
                      </div>
                    )}
                  </div>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(request.status) }}
                  >
                    {getStatusLabel(request.status)}
                  </span>
                </div>

                <p className="request-type">{request.project_type}</p>
                <p className="request-description">{request.description}</p>

                <div className="request-details">
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
                    <span>{request.attachments.length} archivo(s) adjunto(s)</span>
                  </div>
                )}

                {request.admin_notes && (
                  <div className="admin-notes">
                    <strong>Notas del administrador:</strong>
                    <p>{request.admin_notes}</p>
                  </div>
                )}

                <div className="request-footer">
                  <span className="request-date">
                    {new Date(request.created_at).toLocaleDateString('es-ES')}
                  </span>
                  <motion.button
                    className="btn-delete-request"
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

      {/* Modal for creating new request */}
      {showModal && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowModal(false)}
        >
          <motion.div
            className="modal-content request-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Nueva Solicitud Detallada</h3>
            
            <form onSubmit={handleSubmit} className="request-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Título del Proyecto *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    placeholder="Ej: Desarrollo de E-commerce"
                    className={errors.title ? 'error' : ''}
                  />
                  {errors.title && <span className="error-message">{errors.title}</span>}
                </div>

                <div className="form-group">
                  <label>Tipo de Proyecto *</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                    required
                    className={errors.projectType ? 'error' : ''}
                  >
                    <option value="">Selecciona un tipo</option>
                    <option value="Página Web">Página Web</option>
                    <option value="Aplicación Móvil">Aplicación Móvil</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Sistema Web">Sistema Web</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="Diseño UI/UX">Diseño UI/UX</option>
                    <option value="Branding">Branding</option>
                    <option value="Consultoría">Consultoría</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {errors.projectType && <span className="error-message">{errors.projectType}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Descripción del Proyecto *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={4}
                  placeholder="Describe detalladamente tu proyecto..."
                  className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rango de Presupuesto</label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({...formData, budgetRange: e.target.value})}
                  >
                    <option value="">Selecciona un rango</option>
                    <option value="Menos de $5,000">Menos de $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                    <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                    <option value="Más de $50,000">Más de $50,000</option>
                    <option value="Por definir">Por definir</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tiempo Estimado</label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                  >
                    <option value="">Selecciona un tiempo</option>
                    <option value="1-2 semanas">1-2 semanas</option>
                    <option value="3-4 semanas">3-4 semanas</option>
                    <option value="1-2 meses">1-2 meses</option>
                    <option value="3-6 meses">3-6 meses</option>
                    <option value="Más de 6 meses">Más de 6 meses</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Presupuesto (USD) *</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    min="300"
                    step="50"
                    required
                    placeholder="Mínimo $300"
                    className={errors.budget ? 'error' : ''}
                  />
                  {errors.budget && <span className="error-message">{errors.budget}</span>}
                </div>

                <div className="form-group">
                  <label>Fecha de Inicio Preferida</label>
                  <input
                    type="date"
                    value={formData.preferredStartDate}
                    onChange={(e) => setFormData({...formData, preferredStartDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Público Objetivo</label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  placeholder="Ej: Jóvenes de 18-35 años, empresas B2B..."
                />
              </div>

              <div className="form-group">
                <label>Requisitos Técnicos</label>
                <textarea
                  value={formData.technicalRequirements}
                  onChange={(e) => setFormData({...formData, technicalRequirements: e.target.value})}
                  rows={3}
                  placeholder="Tecnologías específicas, integraciones necesarias, etc."
                />
              </div>

              <div className="form-group">
                <label>Notas Adicionales</label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                  rows={3}
                  placeholder="Cualquier información adicional relevante..."
                />
              </div>

              <div className="form-group">
                <label>Archivos Adjuntos</label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file-upload" className="file-upload-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span>Seleccionar archivos</span>
                  </label>
                  {formData.attachments.length > 0 && (
                    <div className="attachments-list">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="attachment-item">
                          <span>{file}</span>
                          <button type="button" onClick={() => removeAttachment(index)}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirm">
                  Crear Solicitud
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

function Account({ user }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    position: user?.position || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.avatar || null);

  const positions = [
    'CEO / Fundador',
    'Director',
    'Gerente',
    'Desarrollador',
    'Diseñador',
    'Marketing',
    'Ventas',
    'Otro'
  ];

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: 'Las contraseñas no coinciden', type: 'error' });
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) formDataToSend.append(key, formData[key]);
      });
      
      if (profilePhoto) {
        formDataToSend.append('avatar', profilePhoto);
      }

      const response = await fetch('/api/users/update', {
        method: 'PUT',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ text: 'Perfil actualizado correctamente', type: 'success' });
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        setProfilePhoto(null);
      } else {
        setMessage({ text: data.error || 'Error al actualizar', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error al actualizar el perfil', type: 'error' });
    }

    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  return (
    <motion.div
      className="dashboard-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1>Mi Cuenta</h1>
      
      <form className="account-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Foto de Perfil</h3>
          
          <div className="profile-photo-section">
            <div className="photo-preview">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="preview-image" />
              ) : (
                <div className="preview-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="photo-controls">
              <input
                type="file"
                id="profile-photo"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
              <motion.label
                htmlFor="profile-photo"
                className="photo-upload-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                Cambiar Foto
              </motion.label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Información Personal</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
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
              />
            </div>
            
            <div className="form-group">
              <label>Ubicación</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Ciudad, País"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Cargo en la empresa</label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
            >
              <option value="">Selecciona tu cargo</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Cambiar Contraseña</h3>
          
          <div className="form-group">
            <label>Contraseña Actual</label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
              placeholder="Dejar en blanco para no cambiar"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nueva Contraseña</label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                minLength={6}
              />
            </div>
            
            <div className="form-group">
              <label>Confirmar Nueva Contraseña</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                minLength={6}
              />
            </div>
          </div>
        </div>
        
        <motion.button 
          type="submit" 
          className="save-btn"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Guardar Cambios
        </motion.button>

        {message.text && (
          <motion.div
            className={`form-message ${message.type}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message.text}
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}

function Chat({ messages, newMessage, setNewMessage, onSend }) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [localMessages, setLocalMessages] = useState(messages);
  const [attachments, setAttachments] = useState([]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    // Force immediate scroll without animation first
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    
    // Then smooth scroll
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    
    // Multiple fallbacks to ensure it works
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 50);
    
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 200);
  };

  useEffect(() => {
    setLocalMessages(messages);
    // Scroll after state update
    setTimeout(scrollToBottom, 50);
    // Additional scroll for initial load
    setTimeout(scrollToBottom, 500);
  }, [messages]);

  // Scroll when localMessages change
  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/messages');
        if (response.ok) {
          const data = await response.json();
          if (JSON.stringify(data) !== JSON.stringify(localMessages)) {
            setLocalMessages(data);
          }
        }
      } catch (error) {
        // Silently handle connection errors to avoid console spam
        // console.error('Error al actualizar mensajes:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [localMessages]);

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
    setShowAttachmentMenu(false);
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

  const handleSendWithAttachments = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() && attachments.length === 0) return;

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
        
        // Refresh messages and scroll to bottom
        try {
          const messagesResponse = await fetch('/api/messages');
          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json();
            setLocalMessages(messagesData);
            // Force scroll after sending message
            setTimeout(scrollToBottom, 100);
          }
        } catch (error) {
          // Silently handle refresh error
        }
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

  return (
    <motion.div
      className="dashboard-content chat-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className={`chat-container ${isChatMinimized ? 'minimized' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-content">
            <h1>Chat con Agente</h1>
            <p className="chat-subtitle">Se te fue asignado un agente personal con el cual puedes conversar en este chat</p>
          </div>
          <div className="chat-controls">
            <motion.button
              className="chat-minimize-btn"
              onClick={() => setIsChatMinimized(!isChatMinimized)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isChatMinimized ? "Expandir chat" : "Minimizar chat"}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isChatMinimized ? (
                  <path d="M18 15l-6-6-6 6"/>
                ) : (
                  <path d="M6 9l6 6 6-6"/>
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      
      {!isChatMinimized && (
        <>
          <div className="messages-container" ref={messagesContainerRef}>
            {localMessages.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <p>No hay mensajes. ¡Inicia la conversación!</p>
              </div>
            ) : (
              localMessages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  className={`message ${msg.sender_role === 'admin' ? 'admin' : 'user'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  {msg.sender_role === 'admin' && (
                    <div className="message-sender">
                      <div className="sender-avatar">
                        {msg.sender_photo ? (
                          <img src={msg.sender_photo} alt={msg.sender_name} />
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                        )}
                      </div>
                      <span className="sender-name">{msg.sender_name || 'Agente'}</span>
                    </div>
                  )}
                  <div className="message-content">
                    <p>{msg.message}</p>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="message-attachments">
                        {msg.attachments.map((attachment, idx) => (
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
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
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

          <form className="message-form" onSubmit={handleSendWithAttachments}>
            <div className="message-input-container">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
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
      )}
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <motion.div
      className="stat-card"
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <span className="stat-icon">{icon}</span>
      <h3>{value}</h3>
      <p>{title}</p>
    </motion.div>
  );
}

function ProjectCard({ project, detailed = false }) {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);
  
  useEffect(() => {
    if (!project.deadline) return;
    
    const updateCountdown = () => {
      const now = new Date();
      const deadline = new Date(project.deadline);
      const timeDiff = deadline - now;
      
      if (timeDiff <= 0) {
        setIsOverdue(true);
        setTimeLeft('Vencido');
        return;
      }
      
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
      
      setIsOverdue(false);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [project.deadline]);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'paused': return '#f59e0b';
      case 'completed': return '#6366f1';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'En Progreso';
      case 'paused': return 'Pausado';
      case 'completed': return 'Completado';
      default: return status;
    }
  };

  const handleClaimClick = (e) => {
    e.stopPropagation();
    // Esta función no tendrá implementación real ya que nunca se pasarán los 30 días
    alert('Función de reclamación - En desarrollo');
  };
  
  return (
    <motion.div
      className={`project-card ${detailed ? 'detailed' : ''}`}
      onClick={() => navigate(`/project/${project.id}`)}
      whileHover={{ scale: 1.02, y: -6 }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{ cursor: 'pointer' }}
    >
      <div className="project-header">
        <div className="project-title-section">
          <h3>{project.title}</h3>
          <p className="project-type">{project.project_type || 'Desarrollo Web'}</p>
          {project.unique_id && (
            <div className="project-id">
              <span className="id-label">ID:</span>
              <span className="id-value">{project.unique_id}</span>
            </div>
          )}
        </div>
        <div className="project-status-section">
          <span 
            className="project-status-badge"
            style={{ backgroundColor: `${getStatusColor(project.status)}15`, color: getStatusColor(project.status) }}
          >
            {getStatusText(project.status)}
          </span>
          {project.deadline && project.status !== 'completed' && (
            <div className={`deadline-info ${isOverdue ? 'overdue' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>
                {isOverdue 
                  ? 'Puedes realizar una reclamación' 
                  : `Puedes realizar una reclamación en ${timeLeft}`
                }
              </span>
            </div>
          )}
        </div>
      </div>
      
      <p className="project-description">
        {project.description || 'Desarrollo de aplicación web moderna con las últimas tecnologías.'}
      </p>
      
      <div className="project-progress-section">
        <div className="progress-header">
          <span className="progress-label">Progreso</span>
          <span className="progress-percentage">{project.progress || 0}%</span>
        </div>
        <div className="progress-bar">
          <motion.div 
            className="progress-fill" 
            initial={{ width: 0 }}
            animate={{ width: `${project.progress || 0}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ backgroundColor: getStatusColor(project.status) }}
          />
        </div>
      </div>

      <div className="project-meta">
        <div className="project-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>{new Date(project.created_at).toLocaleDateString('es-ES')}</span>
        </div>
        <div className="project-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>{project.updates_count || 0} actualizaciones</span>
        </div>
      </div>

      {detailed && (
        <div className="project-actions">
          {isOverdue && project.status !== 'completed' && (
            <motion.button
              className="project-action-btn claim"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClaimClick}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Reclamación
            </motion.button>
          )}
          <motion.button
            className="project-action-btn primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/project/${project.id}`);
            }}
          >
            Ver Detalles
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

export default UserDashboard;
