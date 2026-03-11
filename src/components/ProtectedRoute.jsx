import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requireAdmin = false }) {
  const [authState, setAuthState] = useState({ loading: true, authenticated: false, user: null });

  useEffect(() => {
    fetch('/api/auth/status')
      .then(res => res.json())
      .then(data => {
        setAuthState({
          loading: false,
          authenticated: data.authenticated,
          user: data.user
        });
      })
      .catch(() => {
        setAuthState({ loading: false, authenticated: false, user: null });
      });
  }, []);

  if (authState.loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando...</div>;
  }

  if (!authState.authenticated) {
    return <Navigate to="/login" />;
  }

  // Admin can access everything, regular users can only access non-admin routes
  if (requireAdmin && authState.user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default ProtectedRoute;
