import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppDataContext } from '../contexts/AppDataContext';
import { useTheme } from '../hooks/useTheme';
import { useOnlineSync } from '../hooks/useOnlineSync';
import AppShell from '../layouts/AppShell';
import AdminPortal from '../components/AdminPortal';

/**
 * AdminPage — Super Admin (Ayathana Trust) portal page.
 * Mounts AdminPortal inside AppShell with live data from AppDataContext.
 */
export default function AdminPage() {
  const { currentUser, logout } = useAuth();
  const { state, setState } = useAppDataContext();
  const { theme, setTheme } = useTheme();
  const { isOnline, handleToggleOnline, offlineQueue, isSyncing } = useOnlineSync(setState);
  const navigate = useNavigate();

  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const [env, setEnv] = useState('Production');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const portalBg = theme === 'dark'
    ? 'linear-gradient(rgba(7, 11, 21, 0.91), rgba(7, 11, 21, 0.91)), url(/admin-portal-bg.png)'
    : 'linear-gradient(rgba(238, 246, 250, 0.55), rgba(238, 246, 250, 0.55)), url(/admin-portal-bg.png)';

  return (
    <AppShell
      currentUser={currentUser}
      onLogout={handleLogout}
      theme={theme}
      setTheme={setTheme}
      isOnline={isOnline}
      handleToggleOnline={handleToggleOnline}
      isSyncing={isSyncing}
      offlineQueue={offlineQueue}
      env={env}
      setEnv={setEnv}
      onOpenShowcase={() => setIsShowcaseOpen(true)}
      isShowcaseOpen={isShowcaseOpen}
      onCloseShowcase={() => setIsShowcaseOpen(false)}
      portalBg={portalBg}
    >
      <AdminPortal state={state} setState={setState} env={env} setEnv={setEnv} />
    </AppShell>
  );
}
