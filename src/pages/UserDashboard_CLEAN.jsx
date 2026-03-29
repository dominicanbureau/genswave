import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard_CLEAN.css';

function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('dashboardTheme');
    return savedTheme === 'dark';
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('dashboardTheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    checkAuth();
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
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    navigate('/');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) {
    return (
      <div className={`loading-screen ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="loading-spinner"></div>
        <p>Cargando tu dashboard...</p>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className={`dashboard-container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Genswave</h2>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>📊</span>
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <span>📁</span>
            <span>Proyectos</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <span>💬</span>
            <span>Mensajes</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
            <div>
              <p className="user-name">{user?.name}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
          <div className="sidebar-actions">
            <button onClick={toggleTheme} className="icon-btn">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={handleLogout} className="icon-btn">
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div>
            <h1>Dashboard</h1>
            <p>{getGreeting()}, {user?.name?.split(' ')[0]}</p>
          </div>
          <div className="header-actions">
            <button className="icon-btn">🔔</button>
          </div>
        </header>

        {/* Content Area */}
        <div className="content">
          {activeTab === 'overview' && (
            <div className="overview">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Proyectos Activos</h3>
                  <p className="stat-value">5</p>
                </div>
                <div className="stat-card">
                  <h3>Solicitudes</h3>
                  <p className="stat-value">3</p>
                </div>
                <div className="stat-card">
                  <h3>Completados</h3>
                  <p className="stat-value">12</p>
                </div>
                <div className="stat-card">
                  <h3>Mensajes</h3>
                  <p className="stat-value">8</p>
                </div>
              </div>

              <div className="section">
                <h2>Proyectos Recientes</h2>
                <div className="projects-list">
                  <div className="project-item">
                    <h4>Proyecto Demo 1</h4>
                    <p>Descripción del proyecto</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '60%'}}></div>
                    </div>
                  </div>
                  <div className="project-item">
                    <h4>Proyecto Demo 2</h4>
                    <p>Descripción del proyecto</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '80%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <h2>Mis Proyectos</h2>
              <p>Aquí verás todos tus proyectos</p>
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <h2>Mensajes</h2>
              <p>Aquí verás tus mensajes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
