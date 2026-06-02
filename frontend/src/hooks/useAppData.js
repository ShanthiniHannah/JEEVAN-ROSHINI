import { useEffect } from 'react';
import { getFamilies } from '../services/familyService';
import { getIndividuals } from '../services/individualService';
import { getVisits } from '../services/visitService';
import { getAttendances } from '../services/attendanceService';
import { getLeaves } from '../services/leaveService';
import { getVillages } from '../services/dashboardService';

/**
 * useAppData — Parallel data-fetch hook triggered on user login.
 *
 * Fetches all primary domain data from the Laravel API simultaneously
 * and populates the global AppDataContext state.
 *
 * @param {object|null} currentUser - The authenticated user object from AuthContext
 * @param {Function} setState - The AppDataContext setState function
 */
export function useAppData(currentUser, state, setState) {
  useEffect(() => {
    if (!currentUser || state._loaded) return;

    const loadAll = async () => {
      try {
        const [villagesRes, familiesRes, individualsRes, visitsRes, attendancesRes, leavesRes] =
          await Promise.all([
            getVillages(),
            getFamilies(),
            getIndividuals(),
            getVisits(),
            getAttendances(),
            getLeaves(),
          ]);

        setState(prev => ({
          ...prev,
          villages: villagesRes.data.data || villagesRes.data || [],
          families: familiesRes.data.data || familiesRes.data || [],
          individuals: individualsRes.data.data || individualsRes.data || [],
          visits: visitsRes.data.data || visitsRes.data || [],
          attendance: attendancesRes.data.data || attendancesRes.data || [],
          leaveRequests: leavesRes.data.data || leavesRes.data || [],
          _loaded: true,
        }));
      } catch (err) {
        console.error('[useAppData] Failed to load production data:', err);
      }
    };

    loadAll();
  }, [currentUser, state._loaded, setState]);
}
