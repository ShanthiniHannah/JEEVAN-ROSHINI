import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppDataContext } from '../contexts/AppDataContext';
import { useTheme } from '../hooks/useTheme';
import { useOnlineSync } from '../hooks/useOnlineSync';
import AppShell from '../layouts/AppShell';
import VhwPortal from '../components/VhwPortal';

/**
 * VhwPage — Village Health Worker portal page.
 * Mounts VhwPortal directly inside AppShell.
 */
export function VhwPage() {
  const { currentUser, logout } = useAuth();
  const { state, setState } = useAppDataContext();
  const { theme, setTheme } = useTheme();
  const { isOnline, handleToggleOnline, offlineQueue, setOfflineQueue, isSyncing, triggerSync } = useOnlineSync(setState);
  const navigate = useNavigate();

  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const [env] = useState('Production');

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
      onOpenShowcase={() => setIsShowcaseOpen(true)}
      isShowcaseOpen={isShowcaseOpen}
      onCloseShowcase={() => setIsShowcaseOpen(false)}
    >
      <div className="py-2 w-full flex justify-center">
        <VhwPortal
          state={state}
          setState={setState}
          isOnline={isOnline}
          setIsOnline={handleToggleOnline}
          offlineQueue={offlineQueue}
          setOfflineQueue={setOfflineQueue}
          triggerSync={triggerSync}
          currentUser={currentUser}
          env={env}
        />
      </div>
    </AppShell>
  );
}

export default VhwPage;
