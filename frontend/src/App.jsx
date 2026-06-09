import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './contexts/AppDataContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProfileProvider } from './context/ProfileContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import VhwPage from './pages/VhwPage';
import DirectorPage from './pages/DirectorPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';

/**
 * ProtectedRoute — Guards routes by authentication and role.
 * Unauthenticated users → redirect to /login.
 * Wrong role → redirect to /login (avoids portal switching).
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F4F7FA' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#0B6E6E', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;

  if (allowedRoles) {
    const roleMap = {
      'super-admin': 'admin',
      'project-director': 'director',
      'vhw': 'vhw',
    };
    const userRole = roleMap[currentUser.role];
    if (!allowedRoles.includes(userRole)) return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * InnerApp — Rendered inside AuthProvider so it can read currentUser
 * for ProfileProvider initialisation.
 */
function InnerApp() {
  const { currentUser } = useAuth();

  return (
    <ProfileProvider currentUser={currentUser}>
      <BrowserRouter>
        <Routes>
          {/* Public — Homepage */}
          <Route path="/" element={<HomePage />} />

          {/* Public — Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Profile — all authenticated roles */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* VHW Portal */}
          <Route
            path="/vhw/:subTab?"
            element={
              <ProtectedRoute allowedRoles={['vhw']}>
                <VhwPage />
              </ProtectedRoute>
            }
          />

          {/* Director Portal */}
          <Route
            path="/director/:subTab?"
            element={
              <ProtectedRoute allowedRoles={['director']}>
                <DirectorPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Portal */}
          <Route
            path="/admin/:subTab?"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback — go to homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProfileProvider>
  );
}

/**
 * App — Root component.
 * Contains ONLY Providers and Routes.
 * All business logic lives in hooks, services, and contexts.
 */
export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppDataProvider>
          <InnerApp />
        </AppDataProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
