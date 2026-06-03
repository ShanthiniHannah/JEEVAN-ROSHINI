import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppDataContext } from '../contexts/AppDataContext';
import { useTheme } from '../hooks/useTheme';
import { useOnlineSync } from '../hooks/useOnlineSync';
import AppShell from '../layouts/AppShell';
import VhwPortal from '../components/VhwPortal';
import { StatusBadge } from '../components/ui/StatusBadge';
import { CheckCircle, Clipboard, ShieldAlert, Award, Calendar, Smartphone, Home, User, AlertTriangle, Map } from 'lucide-react';

/**
 * VhwPage — Village Health Worker portal page.
 *
 * Mounts VhwPortal inside AppShell.
 * Reads global state from AppDataContext.
 * Online/offline sync managed by useOnlineSync hook.
 */
export function VhwPage() {
  const { currentUser, logout } = useAuth();
  const { state, setState } = useAppDataContext();
  const { theme, setTheme, isLight } = useTheme();
  const { isOnline, handleToggleOnline, offlineQueue, setOfflineQueue, isSyncing, triggerSync } = useOnlineSync(setState);
  const navigate = useNavigate();

  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const [env] = useState('Production');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const activeAlertsCount = state.alerts?.filter(a => !a.resolved).length ?? 0;

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
      env={env}
      onOpenShowcase={() => setIsShowcaseOpen(true)}
      isShowcaseOpen={isShowcaseOpen}
      onCloseShowcase={() => setIsShowcaseOpen(false)}
    >
      <div className="flex flex-col xl:flex-row items-start gap-8 py-2 w-full">

        {/* ── PHONE CONTAINER (PWA VIEW) ── */}
        <div className="w-full xl:order-2 xl:shrink-0 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-bold mb-3">
            <Smartphone className="w-4 h-4" /> VHW Mobile Client View
          </div>
          
          <div
            className={`relative rounded-[42px] border-[12px] ${
              isLight ? 'border-slate-900 bg-slate-950' : 'border-slate-800 bg-slate-950'
            } shadow-2xl transition-all duration-300`}
            style={{
              boxShadow: isLight
                ? '0 25px 60px -15px rgba(14, 165, 233, 0.12), 0 0 0 1px rgba(0,0,0,0.05)'
                : '0 30px 80px rgba(14, 165, 233, 0.15), 0 0 0 1px rgba(255,255,255,0.02)'
            }}
          >
            {/* Notch */}
            <div className="absolute top-[-11px] left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-b-2xl border border-slate-850 flex items-center justify-center gap-2 z-20">
              <div className="w-2 h-2 bg-slate-800 rounded-full" />
              <div className="w-12 h-1 bg-slate-900 rounded-full" />
            </div>

            {/* Side buttons */}
            <div className="absolute top-24 -left-[16px] w-[4px] h-10 bg-slate-700 rounded-l" />
            <div className="absolute top-38 -left-[16px] w-[4px] h-10 bg-slate-700 rounded-l" />
            <div className="absolute top-28 -right-[16px] w-[4px] h-14 bg-slate-700 rounded-r" />

            <VhwPortal
              state={state}
              setState={setState}
              isOnline={isOnline}
              setIsOnline={handleToggleOnline}
              offlineQueue={offlineQueue}
              setOfflineQueue={setOfflineQueue}
              triggerSync={triggerSync}
              currentUser={currentUser}
              env={env}
            />
          </div>
        </div>

        {/* ── DESKTOP DASHBOARD DETAILS ── */}
        <div className="flex flex-col gap-5 w-full xl:max-w-md flex-1 self-start xl:order-1">

          {/* VHW Identity Header */}
          <div className="rounded-2xl p-6 border relative overflow-hidden card-shimmer bg-[var(--bg-card)] border-[var(--border-color)] shadow-md">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-600/15 to-teal-500/10 opacity-70 pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Health Operations Workspace</p>
                <h2 className="text-2xl font-black mt-1 text-[var(--text-primary)]">{currentUser?.name || 'VHW Worker'}</h2>
                <p className="text-xs font-bold mt-0.5 text-[var(--text-secondary)]">{currentUser?.role} · ID {currentUser?.id}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs bg-[var(--bg-inner)] text-[var(--text-primary)] px-2.5 py-0.5 rounded-full font-black border border-[var(--border-color)]">
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse inline-block ${isOnline ? 'bg-emerald-450' : 'bg-rose-400'}`} />
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
                <span className="text-xs bg-[var(--bg-inner)] text-[var(--text-primary)] px-2.5 py-0.5 rounded-full font-bold border border-[var(--border-color)]">
                  {offlineQueue.length} Pending
                </span>
              </div>
            </div>
          </div>

          {/* Live KPI Metric Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Families Assigned', value: state.families?.length ?? 0, color: 'text-brand-500', icon: Home, desc: 'Total Households' },
              { label: 'Individuals Mapped', value: state.individuals?.length ?? 0, color: 'text-teal-500', icon: User, desc: 'Screened records' },
              { label: 'Unresolved Alerts', value: activeAlertsCount, color: 'text-rose-500', icon: AlertTriangle, desc: 'Needs attention', animate: activeAlertsCount > 0 },
              { label: 'Field Audits Logged', value: state.visits?.length ?? 0, color: 'text-emerald-500', icon: Map, desc: 'This Month' },
            ].map(({ label, value, color, icon: Icon, desc, animate }) => (
              <div key={label} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 relative">
                {/* Accent top bar — 3px, brand color, left-aligned radius */}
                <div className="w-8 h-1 rounded-full bg-brand-500 mb-3" />
                <div className="flex items-center justify-between mb-1.5">
                  <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
                  <span className={`text-2xl font-black ${color} ${animate ? 'animate-pulse' : ''}`}>{value}</span>
                </div>
                <p className="text-xs font-bold tracking-tight text-[var(--text-primary)]">{label}</p>
                <p className="text-[11px] font-medium mt-0.5 text-[var(--text-secondary)]">{desc}</p>
              </div>
            ))}
          </div>

          {/* Families Card */}
          <div className="rounded-xl p-5 border shadow-sm bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)]">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Clipboard className="w-4 h-4 text-brand-500" /> Assigned Villages &amp; Families
              </h4>
              <span className="text-xs text-[var(--text-secondary)] font-bold">{state.families?.length ?? 0} Households</span>
            </div>

            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {state.families?.length > 0 ? state.families.slice(0, 6).map((fam) => (
                <div key={fam.id} className="flex items-center justify-between p-2.5 rounded-xl border bg-[var(--bg-inner)] border-[var(--border-color)]">
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)]">{fam.headName || fam.name || 'Family Head'}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">
                      {fam.village?.name || (typeof fam.village === 'string' ? fam.village : '') || fam.villageName || '—'} · {fam.members?.length ?? 0} Members
                    </p>
                  </div>
                  <StatusBadge status={fam.riskLevel || 'Low'} />
                </div>
              )) : (
                <p className="text-xs text-[var(--text-secondary)] text-center py-6">No family logs registered yet.</p>
              )}
            </div>
          </div>

          {/* Active Risk Alerts */}
          <div className="rounded-xl p-5 border shadow-sm bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)]">
            <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b border-[var(--border-color)] pb-3 mb-3">
              <ShieldAlert className="w-4 h-4 text-rose-500" /> Active Health Alerts
              {activeAlertsCount > 0 && (
                <span className="ml-auto text-xs bg-rose-500/10 border border-rose-500/20 text-rose-550 dark:text-rose-400 px-2 py-0.5 rounded-full font-black animate-pulse">
                  {activeAlertsCount} CRITICAL
                </span>
              )}
            </h4>
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {activeAlertsCount > 0 ? (
                state.alerts.filter(a => !a.resolved).slice(0, 4).map((al) => (
                  <div key={al.id} className="flex items-start gap-2.5 border-l-2 border-rose-500 pl-3 py-1.5 bg-rose-500/5 rounded-r-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-rose-600 dark:text-rose-450 truncate">{al.patientName}</p>
                      <p className="text-xs text-[var(--text-secondary)] font-bold truncate mt-0.5">{al.type} · {al.reason}</p>
                    </div>
                    <span className="shrink-0 text-xs px-1.5 py-0.5 rounded font-black uppercase bg-rose-600 text-white animate-pulse">
                      {al.severity}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-emerald-500 text-center py-4 flex items-center justify-center gap-1.5 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> All patients screened clear
                </p>
              )}
            </div>
          </div>

          {/* Recent Operations log */}
          <div className="rounded-xl p-5 border shadow-sm bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)]">
            <h4 className="text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-1.5 text-[var(--text-secondary)]">
              <Calendar className="w-4 h-4" /> Activity Log
            </h4>
            <div className="space-y-3">
              {[
                ...(state.visits?.slice(-3).reverse().map(v => ({ text: `Visit: ${v.villageName || 'Village'}`, time: v.date || 'Today', color: 'bg-emerald-450' })) || []),
                ...(state.families?.slice(-2).reverse().map(f => ({ text: `Family: ${f.headName || f.name || ''}`, time: 'Recent', color: 'bg-brand-500' })) || []),
                ...(state.individuals?.slice(-2).reverse().map(i => ({ text: `Screened: ${i.name || ''}`, time: 'Recent', color: 'bg-teal-500' })) || []),
              ].slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
                  <p className="text-xs font-bold flex-1 truncate text-[var(--text-primary)]">{item.text}</p>
                  <span className="text-xs shrink-0 text-[var(--text-secondary)]">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Training Tracker */}
          <div className="rounded-xl p-5 border shadow-sm bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)]">
            <h4 className="text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand-500" /> Staff Training progress
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Basic Health Screening', pct: 100, color: 'bg-emerald-400' },
                { label: 'Maternal & Child Health', pct: 85, color: 'bg-brand-500' },
                { label: 'Disease Surveillance', pct: 70, color: 'bg-teal-500' },
              ].map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">{label}</span>
                    <span className="text-xs font-black text-[var(--text-primary)]">{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-[var(--bg-inner)]">
                    <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}

export default VhwPage;
