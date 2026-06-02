import { useState, useEffect } from 'react';

/**
 * useTheme — Enterprise theme management hook.
 *
 * - Persists user preference to localStorage.
 * - Syncs a CSS class ('theme-light') to document.body for global CSS targeting.
 * - Returns { theme, setTheme, isLight } for use in any component.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('jeevan_roshini_theme') || 'dark';
  });

  const isLight = theme === 'light';

  useEffect(() => {
    localStorage.setItem('jeevan_roshini_theme', theme);
    document.body.classList.toggle('theme-light', theme === 'light');
    return () => document.body.classList.remove('theme-light');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return { theme, setTheme, isLight, toggleTheme };
}
