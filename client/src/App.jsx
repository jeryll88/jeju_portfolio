import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import PortfolioPage from './pages/PortfolioPage';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './admin/pages/LoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import ProfileManager from './admin/pages/ProfileManager';
import AboutManager from './admin/pages/AboutManager';
import SkillsManager from './admin/pages/SkillsManager';
import ProjectsManager from './admin/pages/ProjectsManager';
import AwardsManager from './admin/pages/AwardsManager';
import MessagesManager from './admin/pages/MessagesManager';
import SettingsManager from './admin/pages/SettingsManager';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen isLoading={loading} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<PortfolioPage />} />

        {/* Admin */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfileManager />} />
          <Route path="about" element={<AboutManager />} />
          <Route path="skills" element={<SkillsManager />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="awards" element={<AwardsManager />} />
          <Route path="messages" element={<MessagesManager />} />
          <Route path="settings" element={<SettingsManager />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
