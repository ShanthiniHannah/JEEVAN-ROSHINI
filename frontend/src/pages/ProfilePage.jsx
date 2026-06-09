import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../hooks/useTheme';
import AppShell from '../layouts/AppShell';
import { useOnlineSync } from '../hooks/useOnlineSync';
import {
  Camera, Save, ArrowLeft, User, Mail, Shield,
  Phone, Briefcase, Building2, FileText, CheckCircle2, Trash2
} from 'lucide-react';

/**
 * ProfilePage — Editable user profile for all portal roles.
 * Accessible via clicking user name in the AppShell header.
 */
export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { isOnline, handleToggleOnline, offlineQueue, setOfflineQueue, isSyncing } = useOnlineSync(() => {});
  const fileInputRef = useRef(null);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    phone: '', designation: '', department: '', bio: ''
  });

  // Sync form with loaded profile
  useEffect(() => {
    setForm({
      phone:       profile.phone || '',
      designation: profile.designation || '',
      department:  profile.department || '',
      bio:         profile.bio || '',
    });
  }, [profile]);

  const ROLE_LABELS = {
    'super-admin':       'Super Admin — Ayathana Trust',
    'project-director':  'Project Director',
    'vhw':               'Village Health Worker',
  };

  const ROLE_COLORS = {
    'super-admin':      { bg: 'from-blue-600 to-indigo-700', badge: 'bg-blue-500/20 text-blue-200 border-blue-500/30' },
    'project-director': { bg: 'from-teal-600 to-cyan-700',  badge: 'bg-teal-500/20 text-teal-200 border-teal-500/30' },
    'vhw':              { bg: 'from-rose-600 to-pink-700',   badge: 'bg-rose-500/20 text-rose-200 border-rose-500/30' },
  };

  const roleKey = currentUser?.role || 'vhw';
  const roleColors = ROLE_COLORS[roleKey] || ROLE_COLORS.vhw;

  const initials = (currentUser?.name || 'U')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const PALETTE = [
    ['#0057B8','#EBF4FF'], ['#0d9488','#F0FDFA'], ['#7c3aed','#F5F3FF'],
    ['#db2777','#FDF2F8'], ['#d97706','#FFFBEB'], ['#16a34a','#F0FDF4'],
  ];
  const pidx = (currentUser?.name?.charCodeAt(0) ?? 0) % PALETTE.length;
  const [avatarBg, avatarText] = PALETTE[pidx];

  /* ── Photo upload handler ── */
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { alert('Photo must be under 3 MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => updateProfile({ photoDataUrl: ev.target.result });
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => updateProfile({ photoDataUrl: null });

  /* ── Save handler ── */
  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleBack = () => {
    const roleRoutes = { 'super-admin': '/admin', 'project-director': '/director', 'vhw': '/vhw' };
    navigate(roleRoutes[roleKey] || '/');
  };

  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <AppShell
      currentUser={currentUser}
      onLogout={handleLogout}
      theme={theme}
      setTheme={setTheme}
      isOnline={isOnline}
      handleToggleOnline={handleToggleOnline}
      isSyncing={isSyncing}
      offlineQueue={offlineQueue}
      env="Production"
    >
      <div className="max-w-3xl mx-auto space-y-6 pb-12">

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Portal
        </button>

        {/* ── Profile Hero Card ── */}
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${roleColors.bg} p-8 text-white shadow-2xl`}>
          {/* Dot grid overlay */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* Avatar */}
            <div className="relative shrink-0 group">
              <div
                className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white/30 shadow-xl flex items-center justify-center"
                style={!profile.photoDataUrl ? { background: avatarBg } : {}}
              >
                {profile.photoDataUrl ? (
                  <img src={profile.photoDataUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black" style={{ color: avatarText }}>{initials}</span>
                )}
              </div>

              {/* Camera overlay on hover */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />

              {/* Remove photo button */}
              {profile.photoDataUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shadow-md hover:bg-rose-600 transition-colors"
                  title="Remove photo"
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              )}
            </div>

            {/* Name + role info */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-black text-white drop-shadow">{currentUser?.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 justify-center sm:justify-start">
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${roleColors.badge}`}>
                  {ROLE_LABELS[roleKey]}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-3 text-white/75 text-xs justify-center sm:justify-start">
                <Mail className="w-3.5 h-3.5" />
                {currentUser?.email}
              </div>
              {form.designation && (
                <div className="flex items-center gap-1.5 mt-1.5 text-white/65 text-xs justify-center sm:justify-start">
                  <Briefcase className="w-3.5 h-3.5" />
                  {form.designation}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 flex items-center gap-1.5 px-4 py-1.5 bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl text-xs font-bold transition-all"
              >
                <Camera className="w-3.5 h-3.5" />
                {profile.photoDataUrl ? 'Change Photo' : 'Upload Photo'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Success Banner ── */}
        {saved && (
          <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm font-semibold animate-bounce">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Profile saved successfully!
          </div>
        )}

        {/* ── Editable Form ── */}
        <form onSubmit={handleSave} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--text-secondary)]" />
            Profile Information
          </h2>

          {/* Read-only fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider flex items-center gap-1">
                <User className="w-3 h-3" /> Full Name
              </label>
              <div className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-sm font-semibold text-[var(--text-primary)] opacity-70 select-none">
                {currentUser?.name}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email Address
              </label>
              <div className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-sm font-semibold text-[var(--text-primary)] opacity-70 select-none">
                {currentUser?.email || '—'}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider flex items-center gap-1">
                <Shield className="w-3 h-3" /> Role
              </label>
              <div className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-sm font-semibold text-[var(--text-primary)] opacity-70 select-none">
                {ROLE_LABELS[roleKey]}
              </div>
            </div>

            {/* Editable: Phone */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider flex items-center gap-1">
                <Phone className="w-3 h-3" /> Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-[var(--text-secondary)]/50"
              />
            </div>

            {/* Editable: Designation */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> Designation / Title
              </label>
              <input
                type="text"
                value={form.designation}
                onChange={e => setForm(prev => ({ ...prev, designation: e.target.value }))}
                placeholder="e.g. Field Supervisor"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-[var(--text-secondary)]/50"
              />
            </div>

            {/* Editable: Department */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Department / Block
              </label>
              <input
                type="text"
                value={form.department}
                onChange={e => setForm(prev => ({ ...prev, department: e.target.value }))}
                placeholder="e.g. Chikkamagaluru Block"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-[var(--text-secondary)]/50"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider flex items-center gap-1">
              <FileText className="w-3 h-3" /> Short Bio / Notes
            </label>
            <textarea
              value={form.bio}
              onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Brief description about your role and responsibilities..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder:text-[var(--text-secondary)]/50"
            />
          </div>

          {/* Save button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0057B8] hover:bg-[#0045a0] text-white text-sm font-black rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              <Save className="w-4 h-4" />
              Save Profile
            </button>
          </div>
        </form>

      </div>
    </AppShell>
  );
}
