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
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('dashboardTheme');
    return savedTheme === 'dark';
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('dashboardTheme', isDarkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

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
    
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/status');
      if (!response.ok) {
        navigate('/login');
        return;
      }
      
      const data = await response.json();
      
      if (!data.authenticated) {
        navigate('/login');
      } else if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/login');
    }
  };

  const fetchData = async () => {
    try {
      const [projectsRes, appointmentsRes, messagesRes, requestsRes] = await Promise.all([
        fetch('/api/projects').catch(() => ({ ok: false, json: () => [] })),
        fetch('/api/appointments').catch(() => ({ ok: false, json: () => [] })),
        fetch('/api/messages').catch(() => ({ ok: false, json: () => [] })),
        fetch('/api/requests').catch(() => ({ ok: false, json: () => [] }))
      ]);

      const projectsData = projectsRes.ok ? await projectsRes.json() : [];
      const appointmentsData = appointmentsRes.ok ? await appointmentsRes.json() : [];
      const messagesData = messagesRes.ok ? await messagesRes.json() : [];
      const requestsData = requestsRes.ok ? await requestsRes.json() : [];

      setProjects(projectsData);
      setAppointments(appointmentsData);
      setMessages(messagesData);
      setRequests(requestsData);

      const unreadCount = messagesData.filter(msg => 
        msg.sender_role === 'admin' && !msg.is_read
      ).length;
      setUnreadMessages(unreadCount);
      
      generateNotifications(projectsData, appointmentsData, messagesData);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const generateNotifications = (projects, appointments, messages) => {
    const notifs = [];
    
    projects.forEach(project => {
      if (project.status === 'active' && project.progress > 75) {
        notifs.push({
          id: `project-${project.id}`,
          type: 'success',
          title: 'Proyecto casi completado',
          message: `${project.title} está al ${project.progress}%`,
          time: new Date(project.updated_at)
        });
      }
    });
    
    const pending = appointments.filter(a => a.status === 'pending');
    if (pending.length > 0) {
      notifs.push({
        id: 'pending-appointments',
        type: 'warning',
        title: 'Solicitudes pendientes',
        message: `Tienes ${pending.length} solicitud(es) esperando respuesta`,
        time: new Date()
      });
    }
    
    const unread = messages.filter(m => m.sender_role === 'admin' && !m.is_read);
    if (unread.length > 0) {
      notifs.push({
        id: 'unread-messages',
        type: 'info',
        title: 'Nuevos mensajes',
        message: `${unread.length} mensaje(s) sin leer`,
        time: new Date()
      });
    }
    
    setNotifications(notifs.slice(0, 5));
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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileSidebarOpen(false);
    
    if (tabId === 'chat' && unreadMessages > 0) {
      markMessagesAsRead();
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await fetch('/api/messages/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      setUnreadMessages(0);
      fetchData();
    } catch (error) {
      console.warn('Error al marcar mensajes como leídos:', error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) {
    return (
      <div className={`loading-screen ${isDarkMode ? 'dark' : 'light'}`}>
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Cargando tu dashboard...
        </motion.p>
      </div>
    );
  }

  return (
    <div className={`user-dashboard-new ${isDarkMode ? 'dark' : 'light'}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        user={user} 
        onLogout={handleLogout}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        unreadMessages={unreadMessages}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      <div className="dashboard-main-new">
        <DashboardHeader 
          user={user}
          activeTab={activeTab}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />

        <main className="dashboard-content-wrapper">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <Overview 
                key="overview" 
                projects={projects} 
                appointments={appointments}
                messages={messages}
                requests={requests}
                setActiveTab={handleTabChange}
              />
            )}
            {activeTab === 'projects' && (
              <Projects key="projects" projects={projects} setActiveTab={handleTabChange} />
            )}
            {activeTab === 'appointments' && (
              <Appointments 
                key="appointments" 
                appointments={appointments} 
                requests={requests} 
                fetchData={fetchData} 
                setActiveTab={handleTabChange} 
              />
            )}
            {activeTab === 'account' && (
              <Account key="account" user={user} fetchData={fetchData} />
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
            {activeTab === 'analytics' && (
              <Analytics key="analytics" projects={projects} appointments={appointments} />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// Sidebar Component
function Sidebar({ activeTab, setActiveTab, user, onLogout, isMobileOpen, setIsMobileOpen, unreadMessages, isDarkMode, toggleTheme }) {
  const navigate = useNavigate();
  
  const tabs = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
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
      id: 'analytics', 
      label: 'Analíticas', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      )
    },
    { 
      id: 'chat', 
      label: 'Mensajes', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )
    },
    { 
      id: 'account', 
      label: 'Configuración', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6m-9-9h6m6 0h6"/>
          <path d="M4.22 4.22l4.24 4.24m7.08 0l4.24-4.24M4.22 19.78l4.24-4.24m7.08 0l4.24 4.24"/>
        </svg>
      )
    }
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {isMobileOpen && (
        <motion.div
          className="mobile-sidebar-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <motion.aside 
        className={`dashboard-sidebar-new ${isMobileOpen ? 'mobile-open' : ''}`}
        initial={false}
      >
        <div className="sidebar-header-new">
          <motion.div className="sidebar-logo">
            <h2>Genswave</h2>
          </motion.div>
          <motion.button
            className="mobile-close-btn"
            onClick={() => setIsMobileOpen(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </motion.button>
        </div>

        <nav className="sidebar-nav-new">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              className={`nav-item-new ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="nav-icon-new">{tab.icon}</span>
              <span className="nav-label-new">{tab.label}</span>
              {tab.id === 'chat' && unreadMessages > 0 && (
                <motion.span 
                  className="unread-badge-new"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  {unreadMessages}
                </motion.span>
              )}
            </motion.button>
          ))}
        </nav>

        <div className="sidebar-footer-new">
          <div className="user-profile-new">
            <div className="user-avatar-new">
              {getInitials(user?.name)}
            </div>
            <div className="user-info-new">
              <p className="user-name-new">{user?.name}</p>
              <p className="user-email-new">{user?.email}</p>
            </div>
          </div>
          
          <div className="sidebar-actions">
            <motion.button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDarkMode ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </motion.button>
            
            <motion.button
              className="logout-btn-new"
              onClick={onLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Cerrar sesión"
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
    </>
  );
}

// Dashboard Header Component
function DashboardHeader({ user, activeTab, notifications, showNotifications, setShowNotifications, setIsMobileSidebarOpen, isDarkMode, toggleTheme }) {
  const getPageTitle = () => {
    const titles = {
      'overview': 'Dashboard',
      'projects': 'Mis Proyectos', 
      'appointments': 'Solicitudes',
      'analytics': 'Analíticas',
      'chat': 'Mensajes',
      'account': 'Configuración'
    };
    return titles[activeTab] || 'Dashboard';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <header className="dashboard-header-new">
      <div className="header-left">
        <motion.button
          className="mobile-menu-btn-new"
          onClick={() => setIsMobileSidebarOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </motion.button>
        
        <div className="header-title-section">
          <h1>{getPageTitle()}</h1>
          <p className="header-greeting">{getGreeting()}, {user?.name?.split(' ')[0]}</p>
        </div>
      </div>

      <div className="header-right">
        <motion.button
          className="theme-toggle-desktop"
          onClick={toggleTheme}
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
        >
          {isDarkMode ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </motion.button>

        <div className="notifications-container">
          <motion.button
            className="notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {notifications.length > 0 && (
              <span className="notifications-count">{notifications.length}</span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className="notifications-dropdown"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="notifications-header">
                  <h3>Notificaciones</h3>
                  <span className="notifications-badge">{notifications.length}</span>
                </div>
                <div className="notifications-list">
                  {notifications.length === 0 ? (
                    <p className="no-notifications">No tienes notificaciones</p>
                  ) : (
                    notifications.map(notif => (
                      <motion.div
                        key={notif.id}
                        className={`notification-item ${notif.type}`}
                        whileHover={{ x: 4 }}
                      >
                        <div className="notification-icon">
                          {notif.type === 'success' && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                          {notif.type === 'warning' && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                              <line x1="12" y1="9" x2="12" y2="13"/>
                              <line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                          )}
                          {notif.type === 'info' && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="12" y1="16" x2="12" y2="12"/>
                              <line x1="12" y1="8" x2="12.01" y2="8"/>
                            </svg>
                          )}
                        </div>
                        <div className="notification-content">
                          <h4>{notif.title}</h4>
                          <p>{notif.message}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default UserDashboard;

// Overview Component with Advanced Analytics
function Overview({ projects, appointments, messages, requests, setActiveTab }) {
  const activeProjects = projects.filter(p => p.status === 'active');
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const completedProjects = projects.filter(p => p.status === 'completed');

  const stats = [
    {
      title: 'Proyectos Activos',
      value: activeProjects.length,
      change: '+12%',
      trend: 'up',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      )
    },
    {
      title: 'Solicitudes Pendientes',
      value: pendingAppointments.length,
      change: '-5%',
      trend: 'down',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      )
    },
    {
      title: 'Proyectos Completados',
      value: completedProjects.length,
      change: '+8%',
      trend: 'up',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )
    },
    {
      title: 'Mensajes Sin Leer',
      value: messages.filter(m => m.sender_role === 'admin' && !m.is_read).length,
      change: 'Nuevo',
      trend: 'neutral',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )
    }
  ];

  return (
    <motion.div
      className="dashboard-content-new"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="stats-grid-new">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card-new"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)' }}
          >
            <div className="stat-icon-new">{stat.icon}</div>
            <div className="stat-content">
              <p className="stat-title">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
              <span className={`stat-change ${stat.trend}`}>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="overview-grid">
        <motion.div
          className="overview-section recent-projects"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="section-header-new">
            <h2>Proyectos Recientes</h2>
            <motion.button
              className="view-all-btn"
              onClick={() => setActiveTab('projects')}
              whileHover={{ x: 4 }}
            >
              Ver todos
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </motion.button>
          </div>
          <div className="projects-list-new">
            {projects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                className="project-card-mini"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <div className="project-info">
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                </div>
                <div className="project-progress-mini">
                  <span>{project.progress || 0}%</span>
                  <div className="progress-bar-mini">
                    <motion.div
                      className="progress-fill-mini"
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress || 0}%` }}
                      transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="overview-section activity-feed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="section-header-new">
            <h2>Actividad Reciente</h2>
          </div>
          <div className="activity-list">
            {messages.slice(0, 5).map((msg, index) => (
              <motion.div
                key={msg.id}
                className="activity-item"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="activity-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div className="activity-content">
                  <p><strong>{msg.sender_role === 'admin' ? 'Agente' : 'Tú'}</strong> envió un mensaje</p>
                  <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="quick-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          <motion.button
            className="action-card"
            onClick={() => setActiveTab('appointments')}
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)' }}
            whileTap={{ scale: 0.98 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>Nueva Solicitud</span>
          </motion.button>
          <motion.button
            className="action-card"
            onClick={() => setActiveTab('chat')}
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)' }}
            whileTap={{ scale: 0.98 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Enviar Mensaje</span>
          </motion.button>
          <motion.button
            className="action-card"
            onClick={() => setActiveTab('projects')}
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)' }}
            whileTap={{ scale: 0.98 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Ver Proyectos</span>
          </motion.button>
          <motion.button
            className="action-card"
            onClick={() => setActiveTab('analytics')}
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)' }}
            whileTap={{ scale: 0.98 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <span>Ver Analíticas</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Projects Component with Enhanced Features
function Projects({ projects, setActiveTab }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.status === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      active: '#10b981',
      pending: '#f59e0b',
      completed: '#6366f1',
      archived: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Activo',
      pending: 'Pendiente',
      completed: 'Completado',
      archived: 'Archivado'
    };
    return labels[status] || status;
  };

  return (
    <motion.div
      className="dashboard-content-new"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-header">
        <div className="search-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {['all', 'active', 'pending', 'completed'].map(status => (
            <motion.button
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === 'all' ? 'Todos' : getStatusLabel(status)}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="projects-grid-new">
        {filteredProjects.length === 0 ? (
          <div className="empty-state-new">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <p>No tienes proyectos activos</p>
            <motion.button
              className="cta-btn"
              onClick={() => setActiveTab('appointments')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Crear Solicitud
            </motion.button>
          </div>
        ) : (
          filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card-new"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)' }}
            >
              <div className="project-header-new">
                <div className="project-title-section">
                  <h3>{project.title}</h3>
                  {project.unique_id && (
                    <span className="project-id-badge">#{project.unique_id}</span>
                  )}
                </div>
                <span 
                  className="status-badge-new"
                  style={{ backgroundColor: getStatusColor(project.status) }}
                >
                  {getStatusLabel(project.status)}
                </span>
              </div>

              <p className="project-description-new">{project.description}</p>

              <div className="project-progress-section">
                <div className="progress-header">
                  <span>Progreso</span>
                  <span className="progress-percentage">{project.progress || 0}%</span>
                </div>
                <div className="progress-bar-new">
                  <motion.div
                    className="progress-fill-new"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress || 0}%` }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                    style={{ backgroundColor: getStatusColor(project.status) }}
                  />
                </div>
              </div>

              <div className="project-meta-new">
                <div className="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                {project.deadline && (
                  <div className="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>{new Date(project.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

// Appointments Component - Reusing existing logic with new design
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
      className="dashboard-content-new"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="content-header">
        <h2>Mis Solicitudes</h2>
        <motion.button
          className="add-btn-new"
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nueva Solicitud
        </motion.button>
      </div>

      {appointments.length > 0 && (
        <div className="appointments-section-new">
          <h3>Solicitudes desde Formulario Principal</h3>
          <div className="appointments-grid-new">
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                className="appointment-card-new"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -4 }}
              >
                <div className="appointment-header-new">
                  <div>
                    <h4>{appointment.service}</h4>
                    {appointment.unique_id && (
                      <span className="id-badge">#{appointment.unique_id}</span>
                    )}
                  </div>
                  <span 
                    className="status-badge-new"
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
                  <div className="admin-notes-new">
                    <strong>Notas del administrador:</strong>
                    <p>{appointment.admin_notes}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="requests-section-new">
        <h3>Solicitudes Detalladas</h3>
        <div className="requests-grid-new">
          {requests.length === 0 ? (
            <div className="empty-state-new">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p>No has creado solicitudes detalladas aún</p>
            </div>
          ) : (
            requests.map((request, index) => (
              <motion.div
                key={request.id}
                className="request-card-new"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -4 }}
              >
                <div className="request-header-new">
                  <div>
                    <h4>{request.title}</h4>
                    {request.unique_id && (
                      <span className="id-badge">#{request.unique_id}</span>
                    )}
                  </div>
                  <span 
                    className="status-badge-new"
                    style={{ backgroundColor: getStatusColor(request.status) }}
                  >
                    {getStatusLabel(request.status)}
                  </span>
                </div>

                <p className="request-type">{request.project_type}</p>
                <p className="request-description">{request.description}</p>

                <div className="request-details-new">
                  {request.budget_range && (
                    <div className="detail-tag-new">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                      {request.budget_range}
                    </div>
                  )}
                  {request.timeline && (
                    <div className="detail-tag-new">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {request.timeline}
                    </div>
                  )}
                  {request.budget && (
                    <div className="detail-tag-new">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                      ${request.budget}
                    </div>
                  )}
                </div>

                {request.admin_notes && (
                  <div className="admin-notes-new">
                    <strong>Notas del administrador:</strong>
                    <p>{request.admin_notes}</p>
                  </div>
                )}

                <div className="request-footer-new">
                  <span className="request-date">
                    {new Date(request.created_at).toLocaleDateString('es-ES')}
                  </span>
                  <motion.button
                    className="btn-delete-new"
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
          className="modal-overlay-new"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowModal(false)}
        >
          <motion.div
            className="modal-content-new"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-new">
              <h3>Nueva Solicitud Detallada</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="request-form-new">
              <div className="form-row-new">
                <div className="form-group-new">
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

                <div className="form-group-new">
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

              <div className="form-group-new">
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

              <div className="form-row-new">
                <div className="form-group-new">
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

                <div className="form-group-new">
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

              <div className="form-row-new">
                <div className="form-group-new">
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

                <div className="form-group-new">
                  <label>Fecha de Inicio Preferida</label>
                  <input
                    type="date"
                    value={formData.preferredStartDate}
                    onChange={(e) => setFormData({...formData, preferredStartDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group-new">
                <label>Público Objetivo</label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  placeholder="Ej: Jóvenes de 18-35 años, empresas B2B..."
                />
              </div>

              <div className="form-group-new">
                <label>Requisitos Técnicos</label>
                <textarea
                  value={formData.technicalRequirements}
                  onChange={(e) => setFormData({...formData, technicalRequirements: e.target.value})}
                  rows={3}
                  placeholder="Tecnologías específicas, integraciones necesarias, etc."
                />
              </div>

              <div className="form-group-new">
                <label>Notas Adicionales</label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                  rows={3}
                  placeholder="Cualquier información adicional relevante..."
                />
              </div>

              <div className="form-group-new">
                <label>Archivos Adjuntos</label>
                <div className="file-upload-area-new">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file-upload" className="file-upload-label-new">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span>Seleccionar archivos</span>
                  </label>
                  {formData.attachments.length > 0 && (
                    <div className="attachments-list-new">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="attachment-item-new">
                          <span>{file}</span>
                          <button type="button" onClick={() => removeAttachment(index)}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-actions-new">
                <button type="button" className="btn-cancel-new" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirm-new">
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

// Account Component with Profile Management
function Account({ user, fetchData }) {
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
        if (fetchData) fetchData();
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
      className="dashboard-content-new"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <form className="account-form-new" onSubmit={handleSubmit}>
        <div className="form-section-new">
          <h3>Foto de Perfil</h3>
          
          <div className="profile-photo-section-new">
            <div className="photo-preview-new">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="preview-image-new" />
              ) : (
                <div className="preview-placeholder-new">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="photo-controls-new">
              <input
                type="file"
                id="profile-photo"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
              <motion.label
                htmlFor="profile-photo"
                className="photo-upload-btn-new"
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

        <div className="form-section-new">
          <h3>Información Personal</h3>
          
          <div className="form-row-new">
            <div className="form-group-new">
              <label>Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group-new">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-row-new">
            <div className="form-group-new">
              <label>Teléfono</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            <div className="form-group-new">
              <label>Ubicación</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Ciudad, País"
              />
            </div>
          </div>

          <div className="form-group-new">
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

        <div className="form-section-new">
          <h3>Cambiar Contraseña</h3>
          
          <div className="form-group-new">
            <label>Contraseña Actual</label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
              placeholder="Dejar en blanco para no cambiar"
            />
          </div>

          <div className="form-row-new">
            <div className="form-group-new">
              <label>Nueva Contraseña</label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                minLength={6}
              />
            </div>
            
            <div className="form-group-new">
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
          className="save-btn-new"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Guardar Cambios
        </motion.button>

        {message.text && (
          <motion.div
            className={`form-message-new ${message.type}`}
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

// Chat Component with Real-time Messaging
function Chat({ messages, newMessage, setNewMessage, onSend }) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [localMessages, setLocalMessages] = useState(messages);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    setLocalMessages(messages);
    setTimeout(scrollToBottom, 50);
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

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
        // Silently handle errors
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [localMessages]);

  return (
    <motion.div
      className="dashboard-content-new chat-content-new"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="chat-container-new">
        <div className="chat-header-new">
          <div className="chat-header-content-new">
            <h2>Chat con Agente</h2>
            <p>Se te fue asignado un agente personal con el cual puedes conversar</p>
          </div>
        </div>
      
        <div className="messages-container-new" ref={messagesContainerRef}>
          {localMessages.length === 0 ? (
            <div className="empty-state-new">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p>No hay mensajes. ¡Inicia la conversación!</p>
            </div>
          ) : (
            localMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                className={`message-new ${msg.sender_role === 'admin' ? 'admin' : 'user'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                {msg.sender_role === 'admin' && (
                  <div className="message-sender-new">
                    <div className="sender-avatar-new">
                      {msg.sender_photo ? (
                        <img src={msg.sender_photo} alt={msg.sender_name} />
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      )}
                    </div>
                    <span className="sender-name-new">{msg.sender_name || 'Agente'}</span>
                  </div>
                )}
                <div className="message-content-new">
                  <p>{msg.message}</p>
                  <span className="message-time-new">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="message-form-new" onSubmit={onSend}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
          />
          
          <motion.button 
            type="submit"
            className="send-btn-new"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

// Analytics Component with Data Visualization
function Analytics({ projects, appointments }) {
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const approvedAppointments = appointments.filter(a => a.status === 'approved').length;

  const projectsByStatus = [
    { status: 'Activos', count: activeProjects, color: '#10b981' },
    { status: 'Completados', count: completedProjects, color: '#6366f1' },
    { status: 'Pendientes', count: projects.filter(p => p.status === 'pending').length, color: '#f59e0b' }
  ];

  const appointmentsByStatus = [
    { status: 'Pendientes', count: pendingAppointments, color: '#f59e0b' },
    { status: 'Aprobadas', count: approvedAppointments, color: '#10b981' },
    { status: 'Rechazadas', count: appointments.filter(a => a.status === 'rejected').length, color: '#ef4444' }
  ];

  const maxValue = Math.max(...projectsByStatus.map(p => p.count), ...appointmentsByStatus.map(a => a.count), 1);

  return (
    <motion.div
      className="dashboard-content-new"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="analytics-grid">
        <motion.div
          className="analytics-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3>Proyectos por Estado</h3>
          <div className="chart-container">
            {projectsByStatus.map((item, index) => (
              <div key={index} className="chart-bar-group">
                <div className="chart-label">{item.status}</div>
                <div className="chart-bar-wrapper">
                  <motion.div
                    className="chart-bar"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / maxValue) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                  />
                  <span className="chart-value">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="analytics-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Solicitudes por Estado</h3>
          <div className="chart-container">
            {appointmentsByStatus.map((item, index) => (
              <div key={index} className="chart-bar-group">
                <div className="chart-label">{item.status}</div>
                <div className="chart-bar-wrapper">
                  <motion.div
                    className="chart-bar"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / maxValue) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                  />
                  <span className="chart-value">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="analytics-card summary-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>Resumen General</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Total Proyectos</span>
              <span className="summary-value">{projects.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Solicitudes</span>
              <span className="summary-value">{appointments.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Tasa de Éxito</span>
              <span className="summary-value">
                {projects.length > 0 ? Math.round((completedProjects / projects.length) * 100) : 0}%
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Proyectos en Progreso</span>
              <span className="summary-value">{activeProjects}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="analytics-card progress-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Progreso de Proyectos Activos</h3>
          <div className="progress-list">
            {projects.filter(p => p.status === 'active').slice(0, 5).map((project, index) => (
              <div key={project.id} className="progress-item">
                <div className="progress-item-header">
                  <span className="progress-item-title">{project.title}</span>
                  <span className="progress-item-percentage">{project.progress || 0}%</span>
                </div>
                <div className="progress-item-bar">
                  <motion.div
                    className="progress-item-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress || 0}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
