import React from 'react';
import {
  Globe, MapPin, Users, Stethoscope, Activity,
  TrendingUp, UserCheck, ArrowUpRight
} from 'lucide-react';

/**
 * GovernanceDashboard — Super Admin central KPI overview
 * Shows all 7 key metrics required by Ayathana Trust.
 */
export default function GovernanceDashboard({ summary, state }) {
  const kpis = [
    {
      label:    'Total States',
      value:    summary.total_states ?? 36,
      sub:      '28 States · 8 UTs',
      icon:     Globe,
      color:    'from-blue-500 to-blue-700',
      accent:   '#3b82f6',
      id:       'kpi-states',
    },
    {
      label:    'Total Districts',
      value:    summary.total_districts ?? '—',
      sub:      'Active programme districts',
      icon:     MapPin,
      color:    'from-teal-500 to-teal-700',
      accent:   '#14b8a6',
      id:       'kpi-districts',
    },
    {
      label:    'Total Villages',
      value:    summary.total_villages ?? 0,
      sub:      'Active field sites',
      icon:     MapPin,
      color:    'from-green-500 to-green-700',
      accent:   '#22c55e',
      id:       'kpi-villages',
    },
    {
      label:    'Total Families',
      value:    (summary.total_families ?? 0).toLocaleString(),
      sub:      'Registered households',
      icon:     Users,
      color:    'from-purple-500 to-purple-700',
      accent:   '#a855f7',
      id:       'kpi-families',
    },
    {
      label:    'Total Individuals',
      value:    (summary.total_individuals ?? 0).toLocaleString(),
      sub:      'Health records active',
      icon:     Stethoscope,
      color:    'from-rose-500 to-rose-700',
      accent:   '#ef4444',
      id:       'kpi-individuals',
    },
    {
      label:    'Active VHWs',
      value:    summary.total_vhws ?? 0,
      sub:      'Village Health Workers',
      icon:     UserCheck,
      color:    'from-amber-500 to-amber-700',
      accent:   '#f59e0b',
      id:       'kpi-vhws',
    },
    {
      label:    'Project Directors',
      value:    summary.total_directors ?? 0,
      sub:      'Assigned directors',
      icon:     Activity,
      color:    'from-cyan-500 to-cyan-700',
      accent:   '#06b6d4',
      id:       'kpi-directors',
    },
  ];

  // Recent activity from local state
  const recentFamilies   = state.families?.slice(-5).reverse()    ?? [];
  const recentVisits     = state.visits?.slice(-5).reverse()      ?? [];
  const activeAlerts     = state.alerts?.filter(a => !a.resolved) ?? [];
  const highRiskAlerts   = activeAlerts.filter(a => a.severity === 'critical' || a.severity === 'high');

  return (
    <div className="space-y-6">

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              id={kpi.id}
              className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              {/* Gradient accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${kpi.color}`} />

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                    {kpi.label}
                  </p>
                  <p className="text-3xl font-black text-[var(--text-primary)] leading-none mb-1">
                    {kpi.value}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">{kpi.sub}</p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${kpi.accent}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: kpi.accent }} />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                <TrendingUp className="w-3 h-3" />
                <span>Active</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Status Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Families */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Recent Registrations</h3>
            <span className="text-xs text-[var(--text-secondary)]">Last 5</span>
          </div>
          {recentFamilies.length === 0 ? (
            <p className="text-xs text-[var(--text-secondary)] text-center py-4">No recent registrations</p>
          ) : (
            <div className="space-y-2">
              {recentFamilies.map((f, i) => (
                <div key={i} className="flex items-center justify-between text-xs border-b border-[var(--border-color)] pb-2">
                  <span className="font-semibold text-[var(--text-primary)] truncate">{f.id || f.family_code}</span>
                  <span className="text-[var(--text-secondary)] shrink-0 ml-2">{f.villageName || f.village?.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Visits */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Recent Field Visits</h3>
            <span className="text-xs text-[var(--text-secondary)]">Last 5</span>
          </div>
          {recentVisits.length === 0 ? (
            <p className="text-xs text-[var(--text-secondary)] text-center py-4">No recent visits</p>
          ) : (
            <div className="space-y-2">
              {recentVisits.map((v, i) => (
                <div key={i} className="flex items-center justify-between text-xs border-b border-[var(--border-color)] pb-2">
                  <span className="font-semibold text-[var(--text-primary)] truncate">{v.vhwName || 'VHW'}</span>
                  <span className="text-[var(--text-secondary)] shrink-0 ml-2">{v.date || v.visit_date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* High Risk Alerts */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">High Risk Cases</h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              highRiskAlerts.length > 0
                ? 'bg-rose-500/20 text-rose-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {highRiskAlerts.length} active
            </span>
          </div>
          {highRiskAlerts.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-xs text-emerald-500 font-semibold">✅ No critical alerts</p>
            </div>
          ) : (
            <div className="space-y-2">
              {highRiskAlerts.slice(0, 5).map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-xs border-b border-[var(--border-color)] pb-2">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    a.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-500'
                  }`} />
                  <span className="font-semibold text-[var(--text-primary)] truncate">{a.patientName || a.individual_id}</span>
                  <span className="text-[var(--text-secondary)] shrink-0">{a.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
