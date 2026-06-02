import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import InteractiveBackground from '../components/InteractiveBackground';
import LogoShowcase from '../components/LogoShowcase';
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
 *
 * Consumes:
 * - currentUser, onLogout — from AuthContext (passed as props)
 * - theme, setTheme, isLight — from useTheme hook
 * - isOnline, handleToggleOnline, isSyncing, offlineQueue — from useOnlineSync hook
 * - env, setEnv, onOpenShowcase — local state from page components
 */
export default function AppShell({
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
  setEnv,
  onOpenShowcase,
  isShowcaseOpen,
  onCloseShowcase,
  portalBg,
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
      className={`min-h-screen flex flex-col font-sans theme-transition ${isLight ? 'bg-[#eef6fa] text-slate-800' : 'bg-[#070b15] text-slate-100'}`}
      style={portalBg ? {
        backgroundImage: portalBg,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      } : {}}
    >
      <InteractiveBackground theme={theme} />

      {/* ── Sticky Header ── */}
      <header className={`backdrop-blur border-b sticky top-0 z-50 px-3 py-2.5 md:px-8 ${isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/95 border-slate-800/80'}`}>
        <div className="max-w-7xl mx-auto flex flex-row justify-between items-center gap-2">

          {/* Logo + Title */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 md:w-9 md:h-9 shrink-0 brand-logo-container">
              <img src={isLight ? logoLight : logoDark} alt="Jeevan Roshini" className="w-6 h-6 md:w-7 md:h-7 object-contain" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className={`text-xs md:text-sm font-black uppercase tracking-wider truncate ${isLight ? 'text-slate-800' : 'text-white'}`}>
                  Jeevan Roshini Portal
                </h1>
                <span className={`hidden sm:flex text-[9px] font-bold border px-1.5 py-0.5 rounded items-center gap-1 shrink-0 ${isLight ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-slate-800 text-indigo-300 border-indigo-500/20'}`}>
                  <Sparkles className={`w-2.5 h-2.5 ${isLight ? 'text-indigo-500' : 'text-indigo-400'}`} /> Active Session
                </span>
              </div>
              <p className={`hidden md:block text-[10px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Ayathana Trust Community Health Governance &amp; Field PWA
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className={`flex items-center gap-1.5 md:gap-3 px-1.5 py-1 rounded-xl md:rounded-2xl border shrink-0 ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>

            {/* Environment Badge */}
            {env && (
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                env === 'Production' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                env === 'Staging'    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              }`}>
                {env}
              </span>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] md:text-[10px] font-extrabold transition-all duration-300 border ${isLight ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25 hover:bg-cyan-500/20'}`}
            >
              {isLight ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
              <span className="hidden sm:inline">{isLight ? 'Dark' : 'Light'}</span>
            </button>

            {/* Branding Showcase */}
            {onOpenShowcase && (
              <button
                onClick={onOpenShowcase}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] md:text-[10px] font-extrabold transition-all duration-300 border ${isLight ? 'bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100' : 'bg-teal-500/10 text-teal-400 border-teal-500/25 hover:bg-teal-500/20'}`}
              >
                <Paintbrush className="w-3 h-3" />
                <span className="hidden sm:inline">Branding</span>
              </button>
            )}

            {/* Language Selector */}
            <div className={`hidden sm:flex items-center gap-1 border-r pr-2 ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
              <Globe className={`w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className={`bg-transparent border-0 text-[10px] md:text-xs font-bold focus:ring-0 cursor-pointer pr-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
              >
                {LOCALES.map(l => (
                  <option key={l.value} value={l.value} className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Online/Offline Toggle */}
            <div className={`flex items-center border-r pr-1.5 md:pr-2 ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
              <button
                onClick={handleToggleOnline}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] md:text-[10px] font-extrabold transition-all duration-300 ${
                  isOnline
                    ? (isLight ? 'bg-emerald-50 text-emerald-600 border border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/35')
                    : (isLight ? 'bg-rose-50 text-rose-600 border border-rose-300' : 'bg-rose-500/10 text-rose-400 border border-rose-500/35')
                }`}
              >
                {isOnline ? <Wifi className={`w-3 h-3 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} /> : <WifiOff className={`w-3 h-3 ${isLight ? 'text-rose-600' : 'text-rose-400'}`} />}
                <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
              </button>
            </div>

            {/* User + Logout */}
            <div className="flex items-center gap-1.5 md:gap-3 pl-0.5 md:pl-1 pr-0.5 md:pr-1.5">
              <div className="hidden sm:flex flex-col text-left">
                <span className={`text-[9px] md:text-[10px] font-extrabold leading-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>{currentUser?.name}</span>
                <span className={`text-[8px] font-medium hidden md:block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{currentUser?.role}</span>
              </div>
              <button
                onClick={onLogout}
                className={`p-1.5 border rounded-lg md:rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-1 text-[9px] md:text-[10px] font-bold ${isLight ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-600' : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 text-rose-400'}`}
              >
                <LogOut className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Sync Overlay */}
      {isSyncing && (
        <div className={`fixed inset-0 z-55 flex items-center justify-center p-4 ${isLight ? 'bg-white/80' : 'bg-slate-950/85'}`}>
          <div className={`border p-6 rounded-2xl max-w-xs w-full text-center space-y-4 shadow-2xl ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
            <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
            <h4 className={`font-bold text-sm ${isLight ? 'text-slate-800' : 'text-white'}`}>Syncing Local Queue...</h4>
            <p className={`text-xs leading-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Uploading {offlineQueue?.length ?? 0} VHW offline registrations to the central MySQL registry.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-6 lg:p-8 relative z-10">
        <div className="animate-fadeIn">{children}</div>
      </main>

      {/* Footer */}
      <footer className={`border-t py-6 text-center text-xs relative z-10 ${isLight ? 'bg-white/60 border-slate-200 text-slate-500' : 'bg-slate-950 border-slate-900/60 text-slate-500'}`}>
        <p>© 2026 Ayathana Trust | Jeevan Roshini Community Health Programme Web Portal</p>
        <p className={`text-[10px] mt-1 ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
          Built with Laravel 12 + React 19 + Vite + Tailwind CSS | Developed by Shanthini Hannah
        </p>
      </footer>

      {/* Logo Showcase Modal */}
      {onOpenShowcase && (
        <LogoShowcase isOpen={isShowcaseOpen} onClose={onCloseShowcase} />
      )}
    </div>
  );
}
