import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * ProfileContext — stores extended user profile including photo.
 * Photo is stored as a base64 data-URL in localStorage keyed by userId.
 */
const ProfileContext = createContext(null);

const PROFILE_STORAGE_KEY = (userId) => `jeevan_profile_${userId}`;

export function ProfileProvider({ children, currentUser }) {
  const [profile, setProfile] = useState({
    phone: '',
    designation: '',
    department: '',
    bio: '',
    photoDataUrl: null,
  });

  // Load profile from localStorage whenever user changes
  useEffect(() => {
    if (!currentUser?.id) return;
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY(currentUser.id));
    if (stored) {
      try { setProfile(JSON.parse(stored)); } catch {}
    } else {
      setProfile({ phone: '', designation: '', department: '', bio: '', photoDataUrl: null });
    }
  }, [currentUser?.id]);

  const updateProfile = useCallback((updates) => {
    if (!currentUser?.id) return;
    setProfile(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(PROFILE_STORAGE_KEY(currentUser.id), JSON.stringify(next));
      return next;
    });
  }, [currentUser?.id]);

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
