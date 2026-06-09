import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../../../hooks/useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.className = '';
    vi.restoreAllMocks();
  });

  it('defaults to light theme when no localStorage value', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    expect(result.current.isLight).toBe(true);
  });

  it('reads persisted theme from localStorage', () => {
    localStorage.setItem('jeevan_roshini_theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(result.current.isLight).toBe(false);
  });

  it('toggleTheme switches light → dark', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('toggleTheme switches dark → light', () => {
    localStorage.setItem('jeevan_roshini_theme', 'dark');
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('light');
  });

  it('persists theme change to localStorage', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('light'));
    expect(localStorage.getItem('jeevan_roshini_theme')).toBe('light');
  });

  it('syncs theme-light class to document.body', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('light'));
    expect(document.body.classList.contains('theme-light')).toBe(true);
    act(() => result.current.setTheme('dark'));
    expect(document.body.classList.contains('theme-light')).toBe(false);
  });
});
