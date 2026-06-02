import { useState, useCallback } from 'react';
import { syncOfflineQueue } from '../services/syncService';
import { getFamilies } from '../services/familyService';
import { getIndividuals } from '../services/individualService';
import { getVisits } from '../services/visitService';
import { getVillages } from '../services/dashboardService';

/**
 * useOnlineSync — PWA offline/online state and sync queue management.
 *
 * Tracks:
 * - isOnline: current connectivity state
 * - offlineQueue: array of pending operations for offline PWA mode
 *
 * Provides:
 * - triggerSync(): uploads queued records then refreshes state from API
 * - setOfflineQueue: raw setter for VhwPortal to push into queue
 */
export function useOnlineSync(setState) {
  const [isOnline, setIsOnline] = useState(navigator.onLine ?? true);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const triggerSync = useCallback(async () => {
    if (offlineQueue.length === 0) return;
    setIsSyncing(true);
    try {
      const response = await syncOfflineQueue(offlineQueue);
      if (response.data.success) {
        const [villagesRes, familiesRes, individualsRes, visitsRes] = await Promise.all([
          getVillages(),
          getFamilies(),
          getIndividuals(),
          getVisits(),
        ]);
        setState(prev => ({
          ...prev,
          villages: villagesRes.data.data || villagesRes.data,
          families: familiesRes.data.data || familiesRes.data,
          individuals: individualsRes.data.data || individualsRes.data,
          visits: visitsRes.data.data || visitsRes.data,
        }));
        setOfflineQueue([]);
      }
    } catch (err) {
      console.error('[useOnlineSync] Auto sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [offlineQueue, setState]);

  const handleToggleOnline = useCallback(() => {
    setIsOnline(prev => {
      const next = !prev;
      if (next) triggerSync();
      return next;
    });
  }, [triggerSync]);

  return { isOnline, setIsOnline, offlineQueue, setOfflineQueue, isSyncing, triggerSync, handleToggleOnline };
}
