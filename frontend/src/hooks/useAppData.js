import { useEffect } from 'react';
import { getFamilies } from '../services/familyService';
import { getIndividuals } from '../services/individualService';
import { getVisits } from '../services/visitService';
import { getAttendances } from '../services/attendanceService';
import { getLeaves } from '../services/leaveService';
import { getVillages } from '../services/dashboardService';
import { api } from '../services/apiClient';

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
    if (!currentUser) {
      if (state.loadedUserId !== null) {
        setState({
          states: [],
          districts: [],
          blocks: [],
          villages: [],
          families: [],
          individuals: [],
          visits: [],
          attendance: [],
          leaveRequests: [],
          programs: [],
          staff: [],
          notifications: [],
          auditLogs: [],
          alerts: [],
          supportRecords: [],
          trainings: [],
          evaluations: [],
          referrals: [],
          villageReports: [],
          projects: [],
          approvals: [],
          loadedUserId: null,
          _loaded: false,
        });
      }
      return;
    }

    // If we have data loaded but it belongs to a different user, clear it first
    if (state.loadedUserId !== null && state.loadedUserId !== currentUser.id) {
      setState({
        states: [],
        districts: [],
        blocks: [],
        villages: [],
        families: [],
        individuals: [],
        visits: [],
        attendance: [],
        leaveRequests: [],
        programs: [],
        staff: [],
        notifications: [],
        auditLogs: [],
        alerts: [],
        supportRecords: [],
        trainings: [],
        evaluations: [],
        referrals: [],
        villageReports: [],
        projects: [],
        approvals: [],
        loadedUserId: null,
        _loaded: false,
      });
      return;
    }

    if (state._loaded && state.loadedUserId === currentUser.id) return;

    const loadAll = async () => {
      try {
        const promises = [
          getVillages(),
          getFamilies(),
          getIndividuals(),
          getVisits(),
          getAttendances(),
          getLeaves(),
        ];

        // Conditional fetches based on role
        const role = currentUser.role;
        const isSuperAdmin = role === 'super-admin';
        const isDirector = role === 'project-director';

        if (isSuperAdmin) {
          promises.push(api.get('/admin/projects'));
          promises.push(api.get('/approvals'));
          promises.push(api.get('/admin/districts'));
          promises.push(api.get('/admin/states'));
          promises.push(api.get('/trainings'));
        } else if (isDirector) {
          promises.push(api.get('/trainings'));
        }

        const results = await Promise.all(promises);
        
        const [villagesRes, familiesRes, individualsRes, visitsRes, attendancesRes, leavesRes] = results;

        let projects = [];
        let approvals = [];
        let districts = [];
        let states = [];
        let trainings = [];

        if (isSuperAdmin) {
          projects = results[6]?.data?.data || results[6]?.data || [];
          approvals = results[7]?.data?.data || results[7]?.data || [];
          districts = results[8]?.data?.data || results[8]?.data || [];
          states = results[9]?.data?.data || results[9]?.data || [];
          trainings = results[10]?.data?.data || results[10]?.data || [];
        } else if (isDirector) {
          trainings = results[6]?.data?.data || results[6]?.data || [];
        }

        setState(prev => ({
          ...prev,
          villages: villagesRes.data.data || villagesRes.data || [],
          families: familiesRes.data.data || familiesRes.data || [],
          individuals: individualsRes.data.data || individualsRes.data || [],
          visits: visitsRes.data.data || visitsRes.data || [],
          attendance: attendancesRes.data.data || attendancesRes.data || [],
          leaveRequests: leavesRes.data.data || leavesRes.data || [],
          projects,
          approvals,
          districts,
          states,
          trainings,
          loadedUserId: currentUser.id,
          _loaded: true,
        }));
      } catch (err) {
        console.error('[useAppData] Failed to load production data:', err);
      }
    };

    loadAll();
  }, [currentUser, state._loaded, state.loadedUserId, setState]);
}
