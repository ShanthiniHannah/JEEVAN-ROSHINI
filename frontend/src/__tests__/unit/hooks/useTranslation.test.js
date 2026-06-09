import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTranslation, LanguageProvider } from '../../../context/LanguageContext';

describe('useTranslation', () => {
  it('provides default english translation', () => {
    const wrapper = ({ children }) => React.createElement(LanguageProvider, null, children);
    const { result } = renderHook(() => useTranslation(), { wrapper });

    expect(result.current.locale).toBe('en');
    expect(result.current.t('title')).toBe('Jeevan Roshini');
  });

  it('allows changing locale and translates accordingly', () => {
    const wrapper = ({ children }) => React.createElement(LanguageProvider, null, children);
    const { result } = renderHook(() => useTranslation(), { wrapper });

    act(() => {
      result.current.setLocale('kn');
    });

    expect(result.current.locale).toBe('kn');
    expect(result.current.t('title')).toBe('ಜೀವನ ರೋಶಿನಿ');
  });

  it('falls back to english translation when key not found in target locale', () => {
    const wrapper = ({ children }) => React.createElement(LanguageProvider, null, children);
    const { result } = renderHook(() => useTranslation(), { wrapper });

    act(() => {
      result.current.setLocale('kn');
    });

    expect(result.current.t('non_existent_key')).toBe('non_existent_key');
  });

  it('has corrected Telugu online spelling', () => {
    const wrapper = ({ children }) => React.createElement(LanguageProvider, null, children);
    const { result } = renderHook(() => useTranslation(), { wrapper });

    act(() => {
      result.current.setLocale('te');
    });

    expect(result.current.t('online')).toBe('ఆన్‌లైన్');
  });

  it('has corrected Tamil pregnancy status spelling', () => {
    const wrapper = ({ children }) => React.createElement(LanguageProvider, null, children);
    const { result } = renderHook(() => useTranslation(), { wrapper });

    act(() => {
      result.current.setLocale('ta');
    });

    expect(result.current.t('pregnancyStatus')).toBe('கர்ப்ப நிலை');
  });

  it('throws error when used outside LanguageProvider', () => {
    const consoleError = console.error;
    console.error = () => {};

    expect(() => renderHook(() => useTranslation())).toThrow(
      'useTranslation must be used within a LanguageProvider'
    );

    console.error = consoleError;
  });
});
