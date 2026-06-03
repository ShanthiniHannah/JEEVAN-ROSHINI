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
export function AdminPage() {
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
    >
      <AdminPortal state={state} setState={setState} env={env} setEnv={setEnv} />
    </AppShell>
  );
}

export default AdminPage;
