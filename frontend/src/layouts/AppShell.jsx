import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import InteractiveBackground from '../components/InteractiveBackground';
import { OfflineStatusBanner } from '../components/ui/OfflineStatusBanner';
import UserAvatar from '../components/ui/UserAvatar';
import { api } from '../services/apiClient';
import {
  Sparkles, Globe, Sun, Moon, Wifi, WifiOff, RefreshCw, LogOut, Bell
} from 'lucide-react';
import logoNew from '../assets/logo_new.jpg';

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
  const navigate = useNavigate();

  const LOCALES = [
    { value: 'en', label: 'EN' }, { value: 'kn', label: 'KN' },
    { value: 'ml', label: 'ML' }, { value: 'hi', label: 'HI' },
    { value: 'te', label: 'TE' }, { value: 'ta', label: 'TA' },
    { value: 'mr', label: 'MR' }, { value: 'bn', label: 'BN' },
    { value: 'gu', label: 'GU' },
  ];

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (currentUser) {
      api.get('/notifications')
        .then(res => {
          if (res.data?.success) {
            setNotifications(res.data.data);
          }
        })
        .catch(err => console.error("Failed to load notifications", err));
    }
  }, [currentUser]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'Read' } : n));
    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  };

  const unreadCount = notifications.filter(n => n.status !== 'Read').length;

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-300 relative z-10 bg-[var(--bg-page)] text-[var(--text-primary)]"
    >
      <InteractiveBackground theme={theme} />

      {/* Offline Status Banner */}
      <OfflineStatusBanner isOnline={isOnline} pendingCount={offlineQueue?.length ?? 0} />

      {/* ── Sticky Header — NextGen Navy ── */}
      <header style={{ background: 'linear-gradient(135deg, #1B2B5B 0%, #243469 100%)' }} className="border-b border-navy-900/30 sticky top-0 z-50 px-4 py-3 md:px-8 transition-colors duration-300 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-row justify-between items-center gap-4">

          {/* Logo + Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 shrink-0 flex items-center justify-center p-1 rounded-xl bg-white/10 border border-white/15">
              <img src={logoNew} alt="Jeevan Roshini" className="w-7 h-7 object-contain" style={{ borderRadius: '6px' }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xs md:text-sm font-black uppercase tracking-wider truncate text-white">
                  Jeevan Roshini
                </h1>
                <span className="hidden sm:flex text-xs font-bold border px-2 py-0.5 rounded-full items-center gap-1 shrink-0 bg-white/10 text-white/90 border-white/20">
                  <Sparkles className="w-3 h-3 text-cyan-300" /> Portal
                </span>
              </div>
              <p className="hidden md:block text-xs font-medium mt-0.5 text-white/60">
                Ayathana Trust Community Health Governance &amp; PWA
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 p-1 rounded-2xl border shrink-0 bg-white/8 border-white/15 backdrop-blur-sm">

            {/* Environment Badge */}
            {env && (
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider border ${
                env === 'Production' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/25' :
                env === 'Staging'    ? 'bg-amber-500/20 text-amber-300 border-amber-500/25' :
                'bg-purple-500/20 text-purple-300 border-purple-500/25'
              }`}>
                {env}
              </span>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all duration-200 border border-white/15 bg-white/10 hover:bg-white/18 text-white/90"
            >
              {isLight ? <Moon className="w-3.5 h-3.5 text-amber-300" /> : <Sun className="w-3.5 h-3.5 text-yellow-300" />}
              <span className="hidden sm:inline">{isLight ? 'Dark' : 'Light'}</span>
            </button>



            {/* Language Selector */}
            <div className="hidden sm:flex items-center gap-1 border-r border-white/15 pr-2.5 pl-1.5">
              <Globe className="w-3.5 h-3.5 shrink-0 text-white/60" />
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="bg-transparent border-0 text-xs font-bold focus:ring-0 cursor-pointer pr-1 py-0.5 text-white/90"
              >
                {LOCALES.map(l => (
                  <option key={l.value} value={l.value} className="bg-slate-800 text-white">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Bell */}
            <div className="relative border-r border-white/15 pr-2">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 rounded-xl transition-all duration-200 hover:bg-white/18 text-white/90"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 py-2">
                  <div className="px-4 py-2 border-b border-slate-800 mb-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-slate-500 text-xs">No notifications yet.</div>
                  ) : (
                    <div className="space-y-1">
                      {notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => notif.status !== 'Read' && handleMarkAsRead(notif.id)}
                          className={`px-4 py-2.5 cursor-pointer hover:bg-slate-800 transition ${notif.status !== 'Read' ? 'bg-slate-800/50' : 'opacity-75'}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-white truncate pr-2">{notif.title}</span>
                            {notif.status !== 'Read' && <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-emerald-500 mt-1"></span>}
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-2">{notif.message_body}</p>
                          <span className="text-[9px] text-slate-500 mt-1 block">
                            {new Date(notif.created_at).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>


            {/* Online/Offline indicator */}
            <div className="flex items-center border-r border-white/15 pr-2">
              <button
                onClick={handleToggleOnline}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all duration-200 border ${
                  isOnline
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/25'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/25'
                }`}
              >
                {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
              </button>
            </div>

            {/* User Avatar + Clickable Name + Logout */}
            <div className="flex items-center gap-2 pl-1 pr-1.5">
              <UserAvatar
                user={currentUser}
                size="w-8 h-8"
                textSize="text-xs"
                onClick={() => navigate('/profile')}
              />
              <div
                className="hidden sm:flex flex-col text-left cursor-pointer group"
                onClick={() => navigate('/profile')}
                title="View Profile"
              >
                <span className="text-xs font-extrabold leading-tight text-white group-hover:text-cyan-200 transition-colors underline-offset-2 hover:underline">
                  {currentUser?.name}
                </span>
                <span className="text-[11px] font-semibold uppercase text-white/60">{currentUser?.role}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 border rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-1.5 text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/30 text-rose-300"
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

    </div>
  );
}

export default AppShell;
