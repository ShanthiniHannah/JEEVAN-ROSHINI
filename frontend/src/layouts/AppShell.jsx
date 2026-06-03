import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import InteractiveBackground from '../components/InteractiveBackground';
import LogoShowcase from '../components/LogoShowcase';
import { OfflineStatusBanner } from '../components/ui/OfflineStatusBanner';
import {
  Sparkles, Globe, Sun, Moon, Paintbrush, Wifi, WifiOff, RefreshCw, LogOut
} from 'lucide-react';
import logoDark from '../assets/logo_dark.png';
import logoLight from '../assets/logo_light.png';

/**
 * AppShell — Authenticated portal shell.
 *
 * Provides:
 * - Sticky top header with user info, theme, language, connectivity controls
 * - Interactive animated background
 * - Sync overlay during PWA flush
 * - Footer branding
 */
export function AppShell({
  children,
  currentUser,
  onLogout,
  theme,
  setTheme,
  isOnline,
  handleToggleOnline,
  isSyncing,
  offlineQueue,
  env,
  onOpenShowcase,
  isShowcaseOpen,
  onCloseShowcase,
}) {
  const isLight = theme === 'light';
  const { locale, setLocale } = useTranslation();

  const LOCALES = [
    { value: 'en', label: 'EN' }, { value: 'kn', label: 'KN' },
    { value: 'ml', label: 'ML' }, { value: 'hi', label: 'HI' },
    { value: 'te', label: 'TE' }, { value: 'ta', label: 'TA' },
    { value: 'mr', label: 'MR' }, { value: 'bn', label: 'BN' },
    { value: 'gu', label: 'GU' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-300 relative z-10 bg-[var(--bg-page)] text-[var(--text-primary)]"
    >
      <InteractiveBackground theme={theme} />

      {/* Offline Status Banner */}
      <OfflineStatusBanner isOnline={isOnline} pendingCount={offlineQueue?.length ?? 0} />

      {/* ── Sticky Header ── */}
      <header className="backdrop-blur-md border-b border-[var(--border-color)] bg-[var(--bg-card)]/80 sticky top-0 z-50 px-4 py-3 md:px-8 transition-colors duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-row justify-between items-center gap-4">

          {/* Logo + Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 shrink-0 brand-logo-container flex items-center justify-center p-1 rounded-xl bg-slate-950/10 dark:bg-white/5 border border-slate-500/10">
              <img src={isLight ? logoLight : logoDark} alt="Jeevan Roshini" className="w-7 h-7 object-contain" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xs md:text-sm font-black uppercase tracking-wider truncate text-[var(--text-primary)]">
                  Jeevan Roshini
                </h1>
                <span className="hidden sm:flex text-xs font-bold border px-2 py-0.5 rounded-full items-center gap-1 shrink-0 bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20">
                  <Sparkles className="w-3 h-3 text-brand-500" /> Portal
                </span>
              </div>
              <p className="hidden md:block text-xs font-medium mt-0.5 text-[var(--text-secondary)]">
                Ayathana Trust Community Health Governance &amp; PWA
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 p-1 rounded-2xl border shrink-0 bg-[var(--bg-inner)] border-[var(--border-color)]">

            {/* Environment Badge */}
            {env && (
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider border ${
                env === 'Production' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                env === 'Staging'    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
              }`}>
                {env}
              </span>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all duration-200 border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-inner)] text-[var(--text-primary)]"
            >
              {isLight ? <Moon className="w-3.5 h-3.5 text-amber-600" /> : <Sun className="w-3.5 h-3.5 text-cyan-400" />}
              <span className="hidden sm:inline">{isLight ? 'Dark' : 'Light'}</span>
            </button>

            {/* Branding Showcase */}
            {onOpenShowcase && (
              <button
                onClick={onOpenShowcase}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all duration-200 border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-inner)] text-[var(--text-primary)]"
              >
                <Paintbrush className="w-3.5 h-3.5 text-brand-500" />
                <span className="hidden sm:inline">Branding</span>
              </button>
            )}

            {/* Language Selector */}
            <div className="hidden sm:flex items-center gap-1 border-r border-[var(--border-color)] pr-2.5 pl-1.5">
              <Globe className="w-3.5 h-3.5 shrink-0 text-[var(--text-secondary)]" />
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="bg-transparent border-0 text-xs font-bold focus:ring-0 cursor-pointer pr-1 py-0.5 text-[var(--text-primary)]"
              >
                {LOCALES.map(l => (
                  <option key={l.value} value={l.value} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Online/Offline Button indicator */}
            <div className="flex items-center border-r border-[var(--border-color)] pr-2">
              <button
                onClick={handleToggleOnline}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all duration-200 border ${
                  isOnline
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-605 dark:text-rose-400 border-rose-500/20'
                }`}
              >
                {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
              </button>
            </div>

            {/* User + Logout */}
            <div className="flex items-center gap-2 pl-1 pr-1.5">
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-extrabold leading-tight text-[var(--text-primary)]">{currentUser?.name}</span>
                <span className="text-[11px] font-semibold uppercase text-[var(--text-secondary)]">{currentUser?.role}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 border rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-1.5 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 text-rose-600 dark:text-rose-400"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Sync Overlay */}
      {isSyncing && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="border border-[var(--border-color)] p-6 rounded-3xl max-w-xs w-full text-center space-y-4 shadow-2xl bg-[var(--bg-card)]">
            <RefreshCw className="w-10 h-10 text-brand-500 animate-spin mx-auto" />
            <h4 className="font-black text-sm text-[var(--text-primary)]">Syncing Queue...</h4>
            <p className="text-xs leading-normal text-[var(--text-secondary)]">
              Uploading {offlineQueue?.length ?? 0} registrations to the central server registry.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 relative z-10 animate-fadeIn">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-6 text-center text-xs relative z-10 transition-colors duration-300 bg-[var(--bg-card)]/60 text-[var(--text-secondary)]">
        <p>© 2026 Ayathana Trust | Jeevan Roshini Community Health Programme</p>
        <p className="text-xs mt-1.5 text-[var(--text-secondary)] opacity-80">
          React 19 + Vite 8 + Tailwind CSS 4 | Operations &amp; Field Governance Portal
        </p>
      </footer>

      {/* Logo Showcase Modal */}
      {onOpenShowcase && (
        <LogoShowcase isOpen={isShowcaseOpen} onClose={onCloseShowcase} />
      )}
    </div>
  );
}

export default AppShell;
