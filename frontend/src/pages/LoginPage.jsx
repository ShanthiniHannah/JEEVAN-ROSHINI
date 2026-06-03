import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import LogoShowcase from '../components/LogoShowcase';
import {
  ArrowRight, Key, Mail, Globe, Sparkles, Moon, Sun, AlertCircle, Check
} from 'lucide-react';
import logoDark from '../assets/logo_dark.png';
import logoLight from '../assets/logo_light.png';
import { useTheme } from '../hooks/useTheme';

/**
 * LoginPage — Full login/authentication screen.
 * Uses AuthContext.login() which calls the live Laravel API.
 * Standardized split-screen design for MNC-grade look & feel.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme, isLight } = useTheme();
  const { locale, setLocale } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);

  const getRoleRoute = (user) => {
    const role = user?.role || '';
    if (role === 'super-admin' || role === 'Super Admin (Trust)') return '/admin';
    if (role === 'project-director' || role === 'Project Director') return '/director';
    if (role === 'vhw' || role === 'Village Health Worker') return '/vhw';
    return '/vhw';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      navigate(getRoleRoute(result.user));
    } else {
      setError(result.message);
    }
  };

  const handleQuickLogin = async (emailVal, passVal) => {
    setEmail(emailVal);
    setPassword(passVal);
    setError('');
    setIsLoading(true);
    const result = await login(emailVal, passVal);
    setIsLoading(false);
    if (result.success) {
      navigate(getRoleRoute(result.user));
    } else {
      setError(result.message);
    }
  };

  const QUICK_LOGINS = [
    { label: 'Super Admin (Trust)', email: 'admin@ayathanatrust.org', password: 'admin123', color: 'text-brand-500' },
    { label: 'Project Director', email: 'director@ayathanatrust.org', password: 'director123', color: 'text-teal-500' },
    { label: "VHW — Preema D'Souza", email: 'preema@ayathanatrust.org', password: 'vhw123', color: 'text-brand-500' },
    { label: 'VHW — Shobha Nayak', email: 'shobha@ayathanatrust.org', password: 'vhw123', color: 'text-teal-500' },
  ];

  const LOCALES = [
    { value: 'en', label: 'English (EN)' }, { value: 'kn', label: 'ಕನ್ನಡ (KN)' },
    { value: 'ml', label: 'മലയാളം (ML)' }, { value: 'hi', label: 'हिन्दी (HI)' },
    { value: 'te', label: 'తెలుగు (TE)' }, { value: 'ta', label: 'தமிழ் (TA)' },
    { value: 'mr', label: 'ಮರಾठी (MR)' }, { value: 'bn', label: 'বাংলা (BN)' },
    { value: 'gu', label: 'ગુજરાતી (GU)' },
  ];

  return (
    <AuthLayout theme={theme}>
      <div className="flex-1 w-full min-h-screen flex flex-col md:flex-row">
        
        {/* LEFT PANEL: BRAND AND IDENTITY */}
        <div className="hidden md:flex md:w-[50%] lg:w-[58%] xl:w-[62%] bg-gradient-to-br from-brand-700 via-brand-600 to-teal-600 text-white p-12 lg:p-16 flex-col justify-between relative overflow-hidden">
          {/* Geometric SVG pattern overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Top Brand Block */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 flex items-center justify-center p-1.5 rounded-xl bg-white/10 border border-white/20">
              <img src={logoDark} alt="Jeevan Roshini Logo" className="w-8 h-8 object-contain brightness-0 invert" />
            </div>
            <span className="text-xl font-bold uppercase tracking-wider">Jeevan Roshini</span>
          </div>

          {/* Middle Pitch Block */}
          <div className="space-y-6 max-w-lg relative z-10 my-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> Ayathana Trust Health Governance
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Rural Healthcare Governance & Field Operations Platform
            </h2>
            <p className="text-sm text-cyan-100/90 leading-relaxed font-normal">
              Empowering Village Health Workers, clinical directors, and system administrators to register, monitor, and coordinate rural health services in real-time.
            </p>
            <div className="space-y-3.5 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5 border border-white/25">
                  <Check className="w-3 h-3 text-cyan-200" />
                </div>
                <p className="text-sm font-medium text-slate-100">Offline-capable pregnancy, NCD, and SAM field tracking</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5 border border-white/25">
                  <Check className="w-3 h-3 text-cyan-200" />
                </div>
                <p className="text-sm font-medium text-slate-100">Direct operations audit trail & automated approvals pipeline</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5 border border-white/25">
                  <Check className="w-3 h-3 text-cyan-200" />
                </div>
                <p className="text-sm font-medium text-slate-100">Granular access controls with secure database snapshot backups</p>
              </div>
            </div>
          </div>

          {/* Bottom Footer Block */}
          <div className="text-xs text-cyan-100/60 relative z-10">
            Ayathana Trust Health Governance Programme · Powered by React 19 &amp; Tailwind CSS 4
          </div>
        </div>

        {/* RIGHT PANEL: FORM AND CONTROLS */}
        <div className="w-full md:w-[50%] lg:w-[42%] xl:w-[38%] flex flex-col justify-between p-8 md:p-12 lg:p-16 relative bg-[var(--bg-card)] border-l border-[var(--border-color)]">
          
          {/* Top panel actions: Language & Theme toggles */}
          <div className="flex items-center justify-end gap-2 mb-8 md:mb-0">
            {/* Language dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)]">
              <Globe className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="bg-transparent border-0 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:ring-0 cursor-pointer pr-1 py-0.5"
              >
                {LOCALES.map(l => (
                  <option key={l.value} value={l.value} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isLight ? <Moon className="w-4 h-4 text-[var(--text-secondary)]" /> : <Sun className="w-4 h-4 text-brand-500" />}
            </button>
          </div>

          {/* Form Block Container */}
          <div className="my-auto max-w-sm w-full mx-auto space-y-6">
            
            {/* Logo on Mobile */}
            <div className="flex md:hidden items-center gap-2 mb-4">
              <div className="w-9 h-9 flex items-center justify-center p-1 rounded-xl bg-brand-500/10 border border-brand-500/20">
                <img src={isLight ? logoLight : logoDark} alt="Jeevan Roshini" className="w-7 h-7 object-contain" />
              </div>
              <span className="text-lg font-black uppercase tracking-wider text-[var(--text-primary)]">Jeevan Roshini</span>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Sign in to Portal</h1>
              <p className="text-xs font-medium text-[var(--text-secondary)]">Enter your credentials to access health metrics</p>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs p-3 rounded-xl flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none z-10" />
                  <input
                    type="email"
                    id="login-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="me@ayathanatrust.org"
                    required
                    className="w-full pl-10 pr-4 h-11 text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-brand-500 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none z-10" />
                  <input
                    type="password"
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 h-11 text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-brand-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                id="login-submit-btn"
                className="w-full h-11 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In to Portal'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Quick Demo Logins */}
            <div className="border-t border-[var(--border-color)] pt-5 space-y-3.5">
              <div className="text-center">
                <p className="text-xs font-bold text-[var(--text-primary)]">Quick Demo Logins</p>
                <p className="text-xs text-[var(--text-secondary)]">Click to autofill and sign in immediately</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_LOGINS.map(ql => (
                  <button
                    key={ql.email}
                    type="button"
                    onClick={() => handleQuickLogin(ql.email, ql.password)}
                    className="rounded-xl p-3 text-left transition-all border border-[var(--border-color)] hover:border-brand-500 bg-[var(--bg-inner)] text-xs flex flex-col justify-between cursor-pointer hover:shadow-sm"
                  >
                    <span className={`font-bold ${ql.color}`}>{ql.label}</span>
                    <span className="text-[10px] text-[var(--text-secondary)] font-mono mt-1 overflow-hidden text-ellipsis whitespace-nowrap w-full">{ql.email}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Showcase Button at the bottom */}
          <div className="flex justify-center pt-6 md:pt-0">
            <button
              onClick={() => setIsShowcaseOpen(true)}
              className="text-xs font-bold border px-3 py-1 rounded-full flex items-center gap-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/25 hover:bg-brand-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-500" /> Brand Showcase
            </button>
          </div>
        </div>

      </div>

      <LogoShowcase isOpen={isShowcaseOpen} onClose={() => setIsShowcaseOpen(false)} />
    </AuthLayout>
  );
}
