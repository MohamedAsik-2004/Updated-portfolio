import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages & Components imports
import Home from './pages/Home';
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import ProjectsManager from './admin/pages/ProjectsManager';
import SkillsManager from './admin/pages/SkillsManager';
import MessagesViewer from './admin/pages/MessagesViewer';
import ProfileManager from './admin/pages/ProfileManager';
import CertificationsManager from './admin/pages/CertificationsManager';

// Layout & Security wrappers imports
import { AuthProvider } from './admin/context/AuthContext';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Landing Section */}
          <Route path="/" element={<Home />} />

          {/* Admin Login Router */}
          <Route path="/admin/login" element={<Login />} />

          {/* Gated Administrator layout routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard Default page */}
            <Route index element={<Dashboard />} />
            
            {/* Database assets panels */}
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="skills" element={<SkillsManager />} />
            <Route path="certifications" element={<CertificationsManager />} />
            <Route path="messages" element={<MessagesViewer />} />
            <Route path="profile" element={<ProfileManager />} />
          </Route>

          {/* Catch-all wildcard redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
