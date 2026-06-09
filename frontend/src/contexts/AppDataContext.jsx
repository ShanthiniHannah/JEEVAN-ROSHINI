import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../hooks/useAppData';

/**
 * AppDataContext — Global domain data store.
 *
 * Eliminates prop-drilling of the massive state object.
 * VhwPortal, DirectorPortal, and AdminPortal consume this context
 * instead of receiving state/setState as props from App.jsx.
 */
const AppDataContext = createContext(null);

/** Initial state shape — all lists start empty; `useAppData` hook populates them from the API. */
const INITIAL_STATE = {
  // Geography (static fallback pre-populated; overridden by API on login)
  states: [],
  districts: [],
  blocks: [],
  villages: [],
  // Domain data — populated from live API
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
  // Loading flag set by useAppData after first fetch
  _loaded: false,
  loadedUserId: null,
};

export function AppDataProvider({ children }) {
  const { currentUser } = useAuth();
  const [state, setState] = useState(INITIAL_STATE);

  // Hook drives parallel API fetches and populates state
  useAppData(currentUser, state, setState);

  return (
    <AppDataContext.Provider value={{ state, setState }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppDataContext() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppDataContext must be used within an AppDataProvider');
  }
  return ctx;
}
