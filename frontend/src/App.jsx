import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './contexts/AppDataContext';
import { LanguageProvider } from './context/LanguageContext';
import LoginPage from './pages/LoginPage';
import VhwPage from './pages/VhwPage';
import DirectorPage from './pages/DirectorPage';
import AdminPage from './pages/AdminPage';

/**
 * ProtectedRoute — Guards routes by authentication and role.
 * Unauthenticated users → redirect to /login.
 * Wrong role → redirect to /login (avoids portal switching).
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b15]">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
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
 * App — Root component.
 * Contains ONLY Providers and Routes.
 * All business logic lives in hooks, services, and contexts.
 */
export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppDataProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<LoginPage />} />

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

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </AppDataProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
