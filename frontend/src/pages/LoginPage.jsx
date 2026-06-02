import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import LogoShowcase from '../components/LogoShowcase';
import {
  ArrowRight, Lock, Key, Mail, Globe, Sparkles, Moon, Sun
} from 'lucide-react';
import logoDark from '../assets/logo_dark.png';
import logoLight from '../assets/logo_light.png';
import { useTheme } from '../hooks/useTheme';

/**
 * LoginPage — Full login/authentication screen.
 * Extracted from the monolithic App.jsx LoginScreen component.
 * Uses AuthContext.login() which calls the live Laravel API.
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

  // Role → route mapping
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
    { label: 'Super Admin (Trust)', email: 'admin@ayathanatrust.org', password: 'admin123', color: isLight ? 'text-indigo-600' : 'text-indigo-400' },
    { label: 'Project Director', email: 'director@ayathanatrust.org', password: 'director123', color: isLight ? 'text-emerald-600' : 'text-emerald-400' },
    { label: "VHW — Preema D'Souza", email: 'preema@ayathanatrust.org', password: 'vhw123', color: isLight ? 'text-blue-600' : 'text-blue-400' },
    { label: 'VHW — Shobha Nayak', email: 'shobha@ayathanatrust.org', password: 'vhw123', color: isLight ? 'text-purple-600' : 'text-purple-400' },
  ];

  const LOCALES = [
    { value: 'en', label: 'English (EN)' }, { value: 'kn', label: 'ಕನ್ನಡ (KN)' },
    { value: 'ml', label: 'മലയാളം (ML)' }, { value: 'hi', label: 'हिन्दी (HI)' },
    { value: 'te', label: 'తెలుగు (TE)' }, { value: 'ta', label: 'தமிழ் (TA)' },
    { value: 'mr', label: 'मराठी (MR)' }, { value: 'bn', label: 'বাংলা (BN)' },
    { value: 'gu', label: 'ગુજરાતી (GU)' },
  ];

  return (
    <AuthLayout theme={theme}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-50 p-2.5 rounded-full border shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${isLight ? 'bg-white/80 border-teal-200 text-teal-700 hover:bg-white' : 'bg-slate-800/80 border-slate-700 text-cyan-400 hover:bg-slate-700'}`}
      >
        {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>

      {/* Login Card */}
      <div
        className="w-full backdrop-blur-xl border p-8 rounded-3xl shadow-2xl space-y-6 card-shimmer"
        style={isLight
          ? { background: 'rgba(255,255,255,0.82)', borderColor: 'rgba(14,116,144,0.15)', boxShadow: '0 0 60px rgba(14,116,144,0.06), 0 25px 50px rgba(0,0,0,0.08)' }
          : { background: 'rgba(2,20,35,0.75)', borderColor: 'rgba(6,182,212,0.18)', boxShadow: '0 0 60px rgba(6,182,212,0.08), 0 25px 50px rgba(0,0,0,0.6)' }
        }
      >
        {/* Header Row: Logo + Language */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 brand-logo-container">
              <img src={isLight ? logoLight : logoDark} alt="Jeevan Roshini Logo" className="w-7 h-7 object-contain" />
            </div>
            <span
              className="text-[10px] font-bold border px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer hover:bg-cyan-500/20 transition-all animate-pulse"
              onClick={() => setIsShowcaseOpen(true)}
              style={{ background: 'rgba(6,182,212,0.08)', color: '#67e8f9', borderColor: 'rgba(6,182,212,0.25)' }}
            >
              <Sparkles className="w-3 h-3 animate-spin-slow" style={{ color: '#06b6d4' }} /> Brand Showcase
            </span>
          </div>

          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border ${isLight ? 'bg-white/60 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
            <Globe className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className={`bg-transparent border-0 text-xs font-bold focus:ring-0 cursor-pointer pr-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
            >
              {LOCALES.map(l => (
                <option key={l.value} value={l.value} className={isLight ? 'bg-white text-slate-700' : 'bg-slate-950 text-slate-300'}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className={`text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${isLight ? 'from-cyan-700 to-emerald-600' : 'from-cyan-300 to-emerald-400'}`}>
            Jeevan Roshini Portal
          </h1>
          <p className="text-xs leading-normal" style={{ color: isLight ? '#64748b' : '#94a3b8' }}>
            Ayathana Trust Health Governance &amp; Offline Field PWA
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-xl flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className={`text-[10px] font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@ayathanatrust.org"
                required
                className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-teal-500 placeholder:text-slate-400' : 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500'}`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={`text-[10px] font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Password
            </label>
            <div className="relative">
              <Key className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-teal-500 placeholder:text-slate-400' : 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500'}`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            id="login-submit-btn"
            className="w-full text-white font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] hover:shadow-xl disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#0e7490,#059669)', boxShadow: isLight ? '0 4px 20px rgba(14,116,144,0.25)' : '0 4px 20px rgba(6,182,212,0.3)' }}
          >
            {isLoading ? 'Signing in...' : 'Sign In to Portal'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className={`border-t pt-5 space-y-3 ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
          <div className="text-center">
            <p className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Quick Demo Logins</p>
            <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Click to autofill and sign in immediately</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {QUICK_LOGINS.map(ql => (
              <button
                key={ql.email}
                type="button"
                onClick={() => handleQuickLogin(ql.email, ql.password)}
                className={`rounded-xl p-2.5 text-left transition-all flex flex-col justify-between hover-lift border ${isLight ? 'bg-white/60 hover:bg-white border-slate-200 text-slate-700' : 'bg-slate-950 hover:bg-slate-800/50 border-slate-800 text-slate-300'}`}
              >
                <span className={`font-extrabold ${ql.color}`}>{ql.label}</span>
                <span className={`text-[8px] mt-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{ql.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <LogoShowcase isOpen={isShowcaseOpen} onClose={() => setIsShowcaseOpen(false)} />
    </AuthLayout>
  );
}
