import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import ProcessPage from './pages/ProcessPage';
import ContactPage from './pages/ContactPage';
import Login from './pages/Login';
import Admin from './pages/Admin';
import UserDashboard from './pages/UserDashboard';
import ProjectDetail from './pages/ProjectDetail';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';
import FAQPage from './pages/FAQPage';
import SupportPage from './pages/SupportPage';
import CasesPage from './pages/CasesPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/servicios" element={<ServicesPage />} />
      <Route path="/proceso" element={<ProcessPage />} />
      <Route path="/contacto" element={<ContactPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/terminos" element={<TermsPage />} />
      <Route path="/privacidad" element={<PrivacyPage />} />
      <Route path="/cookies" element={<CookiesPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/soporte" element={<SupportPage />} />
      <Route path="/casos" element={<CasesPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/project/:id" 
        element={
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin>
            <Admin />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
