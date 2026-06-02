import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppDataContext } from '../contexts/AppDataContext';
import { useTheme } from '../hooks/useTheme';
import { useOnlineSync } from '../hooks/useOnlineSync';
import AppShell from '../layouts/AppShell';
import VhwPortal from '../components/VhwPortal';
import { CheckCircle, RefreshCw } from 'lucide-react';

/**
 * VhwPage — Village Health Worker portal page.
 *
 * Mounts VhwPortal inside AppShell.
 * Reads global state from AppDataContext (no more prop-drilling from App.jsx).
 * Online/offline sync managed by useOnlineSync hook.
 */
export default function VhwPage() {
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

  const portalBg = isLight
    ? 'linear-gradient(rgba(238, 246, 250, 0.55), rgba(238, 246, 250, 0.55)), url(/other-portal-bg.png)'
    : 'linear-gradient(rgba(7, 11, 21, 0.91), rgba(7, 11, 21, 0.91)), url(/other-portal-bg.png)';

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
      portalBg={portalBg}
    >
      <div className="flex flex-col xl:flex-row items-start gap-6 py-2 w-full">

        {/* Phone Mockup Frame */}
        <div className="w-full xl:order-2 xl:shrink-0 flex justify-center">
          <div
            className="relative"
            style={{
              borderRadius: '40px',
              boxShadow: '0 0 0 12px #0f172a, 0 0 0 14px #1e293b, 0 30px 80px rgba(59,130,246,0.18), 0 0 0 14px #334155'
            }}
          >
            {/* Notch */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-950 rounded-full border border-slate-800 flex items-center justify-center gap-1.5 z-20">
              <div className="w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
              <div className="w-10 h-1 bg-slate-900 rounded-full"></div>
            </div>
            {/* Side buttons */}
            <div className="absolute top-24 -left-[14px] w-[4px] h-10 bg-slate-700 rounded-l-md"></div>
            <div className="absolute top-36 -left-[14px] w-[4px] h-10 bg-slate-700 rounded-l-md"></div>
            <div className="absolute top-28 -right-[14px] w-[4px] h-14 bg-slate-700 rounded-r-md"></div>

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

        {/* VHW Dashboard Sidebar */}
        <div className="flex flex-col gap-4 w-full xl:max-w-md flex-1 self-start xl:order-1">

          {/* Worker Identity Card */}
          <div className="rounded-2xl p-5 border relative overflow-hidden card-shimmer" style={{
            backgroundImage: `linear-gradient(to right, rgba(14, 116, 144, 0.95) 20%, rgba(15, 23, 42, 0.5)), url(/vhw-banner.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderColor: 'rgba(6,182,212,0.3)'
          }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%,-30%)' }} />
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-100 mb-1">Field Health Worker — Active Session</p>
              <h2 className="text-2xl font-black text-white">{currentUser?.name || 'VHW Worker'}</h2>
              <p className="text-sm text-cyan-100 mt-0.5">{currentUser?.role} · ID {currentUser?.id}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="flex items-center gap-1 text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse inline-block" />
                  {isOnline ? 'Online' : 'Offline'}
                </span>
                <span className="text-[10px] bg-white/15 text-white px-2 py-0.5 rounded-full">{offlineQueue.length} pending sync</span>
              </div>
            </div>
          </div>

          {/* Live KPI Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-3">
            {[
              { label: 'Families Registered', value: state.families?.length ?? 0, color: '#38bdf8', icon: '👨‍👩‍👧', sub: 'Total households' },
              { label: 'Individuals Screened', value: state.individuals?.length ?? 0, color: '#a78bfa', icon: '🧑', sub: 'Health records' },
              { label: 'Risk Alerts', value: state.alerts?.filter(a => !a.resolved).length ?? 0, color: '#f87171', icon: '⚠️', sub: 'Unresolved cases' },
              { label: 'Field Visits', value: state.visits?.length ?? 0, color: '#34d399', icon: '🗺️', sub: 'This month' },
            ].map(({ label, value, color, icon, sub }) => (
              <div key={label} className={`rounded-2xl p-4 hover-lift card-shimmer border ${isLight ? 'bg-white/70 border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">{icon}</span>
                  <span className="text-2xl font-black" style={{ color }}>{value}</span>
                </div>
                <p className={`text-[10px] font-bold leading-tight ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{label}</p>
                <p className={`text-[9px] mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Assigned Families List */}
          <div className={`rounded-2xl p-4 border card-shimmer ${isLight ? 'bg-white/70 border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                <span className="text-sm">🏠</span> Assigned Families
              </h4>
              <span className="text-[9px] text-slate-500">{state.families?.length ?? 0} total</span>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {state.families?.length > 0 ? state.families.slice(0, 6).map((fam) => (
                <div key={fam.id} className={`flex items-center justify-between rounded-xl px-3 py-2 ${isLight ? 'bg-slate-50' : 'bg-slate-800/60'}`}>
                  <div>
                    <p className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-white'}`}>{fam.headName || fam.name || 'Family'}</p>
                    <p className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{fam.village?.name || (typeof fam.village === 'string' ? fam.village : '') || fam.villageName || '—'} · {Array.isArray(fam.members) ? fam.members.length : (typeof fam.members === 'number' || typeof fam.members === 'string' ? fam.members : '0')} members</p>
                  </div>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${
                    fam.riskLevel === 'High' ? 'bg-rose-500/20 text-rose-400' :
                    fam.riskLevel === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>{fam.riskLevel || 'Low'}</span>
                </div>
              )) : (
                <p className="text-xs text-slate-500 text-center py-4">No families registered yet.<br />Use the phone to add families.</p>
              )}
            </div>
          </div>

          {/* Active Risk Alerts */}
          <div className={`rounded-2xl p-4 border card-shimmer ${isLight ? 'bg-white/70 border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
            <h4 className={`text-xs font-bold flex items-center gap-1.5 mb-3 ${isLight ? 'text-slate-800' : 'text-white'}`}>
              <span className="text-sm">🚨</span> Active Risk Alerts
              {(state.alerts?.filter(a => !a.resolved).length ?? 0) > 0 && (
                <span className="ml-auto text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                  {state.alerts.filter(a => !a.resolved).length} active
                </span>
              )}
            </h4>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {state.alerts?.filter(a => !a.resolved).length > 0 ? (
                state.alerts.filter(a => !a.resolved).slice(0, 4).map((al) => (
                  <div key={al.id} className="flex items-start gap-2 border-l-2 border-rose-500 pl-2.5 py-1 bg-rose-500/5 rounded-r-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-rose-300 truncate">{al.patientName}</p>
                      <p className="text-[9px] text-slate-400 truncate">{al.type} · {al.reason}</p>
                    </div>
                    <span className={`shrink-0 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${al.severity === 'critical' ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-600 text-white'}`}>
                      {al.severity}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-emerald-400 text-center py-3 flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> No active alerts — all clear!
                </p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`rounded-2xl p-4 border card-shimmer ${isLight ? 'bg-white/70 border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
            <h4 className={`text-xs font-bold mb-3 ${isLight ? 'text-slate-800' : 'text-white'}`}>📋 Recent Activity</h4>
            <div className="space-y-2.5">
              {[
                ...(state.visits?.slice(-3).reverse().map(v => ({ text: `Visit: ${v.villageName || 'Village'}`, time: v.date || 'Today', color: '#34d399' })) || []),
                ...(state.families?.slice(-2).reverse().map(f => ({ text: `Family: ${f.headName || f.name || 'Registered'}`, time: 'Recent', color: '#38bdf8' })) || []),
                ...(state.individuals?.slice(-2).reverse().map(i => ({ text: `Screened: ${i.name || 'Individual'}`, time: 'Recent', color: '#a78bfa' })) || []),
              ].slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.color }} />
                  <p className={`text-[10px] flex-1 truncate ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{item.text}</p>
                  <span className={`text-[9px] shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{item.time}</span>
                </div>
              ))}
              {!state.visits?.length && !state.families?.length && !state.individuals?.length && (
                <p className="text-xs text-slate-500 text-center py-2">No recent activity.</p>
              )}
            </div>
          </div>

          {/* Training Progress */}
          <div className={`rounded-2xl p-4 border card-shimmer ${isLight ? 'bg-white/70 border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
            <h4 className={`text-xs font-bold mb-3 ${isLight ? 'text-slate-800' : 'text-white'}`}>🎓 Training Progress</h4>
            <div className="space-y-2.5">
              {[
                { label: 'Basic Health Screening', pct: 100, color: '#34d399' },
                { label: 'Maternal & Child Health', pct: 85, color: '#38bdf8' },
                { label: 'Disease Surveillance', pct: 70, color: '#a78bfa' },
                { label: 'Community Mobilisation', pct: 90, color: '#fb923c' },
              ].map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-0.5">
                    <span className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>
                    <span className="text-[9px] font-bold" style={{ color }}>{pct}%</span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
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
