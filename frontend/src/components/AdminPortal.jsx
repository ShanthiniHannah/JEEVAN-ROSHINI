import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { api } from '../services/apiClient';
import {
  LayoutDashboard, Globe, Users, Activity, CheckSquare,
  FileText, BarChart2, Shield, GraduationCap
} from 'lucide-react';

// Sub-components
import GovernanceDashboard from './admin/GovernanceDashboard';
import GovernancePanel    from './admin/GovernancePanel';
import AccessControl      from './admin/AccessControl';
import MonitoringPanel    from './admin/MonitoringPanel';
import ApprovalsPanel     from './admin/ApprovalsPanel';
import ReportsPanel       from './admin/ReportsPanel';
import AnalyticsDashboard from './admin/AnalyticsDashboard';
import AuditLogs          from './admin/AuditLogs';
import TrainingOverview   from './admin/TrainingOverview';

const TABS = [
  { id: 'dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { id: 'governance',  label: 'Governance',   icon: Globe },
  { id: 'users',       label: 'Users',        icon: Users },
  { id: 'monitoring',  label: 'Monitoring',   icon: Activity },
  { id: 'approvals',   label: 'Approvals',    icon: CheckSquare },
  { id: 'reports',     label: 'Reports',      icon: FileText },
  { id: 'analytics',   label: 'Analytics',    icon: BarChart2 },
  { id: 'training',    label: 'Training',     icon: GraduationCap },
  { id: 'audit',       label: 'Audit Logs',   icon: Shield },
];

export default function AdminPortal({ state, setState, _env, _setEnv }) {
  const { subTab } = useParams();
  const navigate = useNavigate();
  const { isLight } = useTheme();

  const activeTab = subTab || 'dashboard';
  const setActiveTab = (tab) => navigate(`/admin/${tab}`);

  // Summary KPIs fetched from API (or derived from local state as fallback)
  const [summary, setSummary] = useState({
    total_states: 36, total_districts: 0, total_villages: 0,
    total_families: 0, total_individuals: 0, total_vhws: 0, total_directors: 0,
  });

  const [pendingApprovals, setPendingApprovals] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/admin/summary');
        setSummary(res.data);
      } catch (err) {
        console.error('Failed to fetch summary counts:', err);
        // Fallback to local state
        setSummary(prev => ({
          ...prev,
          total_states:     state.states?.length    ?? prev.total_states,
          total_districts:  state.districts?.length ?? prev.total_districts,
          total_villages:   state.villages?.length  ?? prev.total_villages,
          total_families:   state.families?.length  ?? prev.total_families,
          total_individuals: state.individuals?.length ?? prev.total_individuals,
        }));
      }
    };
    fetchSummary();
    setPendingApprovals(state.approvals?.filter(a => a.status === 'Pending').length ?? 0);
  }, [state]);

  // ── Disease chart data ────────────────────────────────────────────────────
  const chartBase = useMemo(() => ({
    toolbar: { show: false }, background: 'transparent', fontFamily: 'Inter, sans-serif'
  }), []);
  const axisStyle = useMemo(() => ({
    colors: isLight ? '#475569' : '#94a3b8', fontSize: '12px'
  }), [isLight]);

  const getDiseaseCounts = () => {
    const c = { Diabetes: 0, Hypertension: 0, Tuberculosis: 0, 'Cancer Risk': 0, Asthma: 0 };
    state.individuals?.forEach(i => { i.chronicDiseases?.forEach(d => { if (c[d] !== undefined) c[d]++; }); });
    return Object.values(c);
  };

  const getMaternalRatio = () => {
    let normal = 0, risk = 0;
    state.individuals?.forEach(i => {
      if (i.gender === 'Female' && i.pregnancyStatus === 'Yes') {
        i.alerts?.some(a => a.type === 'High-Risk Pregnancy') ? risk++ : normal++;
      }
    });
    return (normal === 0 && risk === 0) ? [12, 4] : [normal, risk];
  };

  const vs = useMemo(() => {
    const cats = state.villages?.map(v => v.name.length > 10 ? v.name.slice(0, 10) + '…' : v.name) ?? [];
    const fam  = state.villages?.map(v => state.families?.filter(f => f.village?.name === v.name || f.villageName === v.name).length) ?? [];
    const ind  = state.villages?.map(v => state.individuals?.filter(i => {
      const f = state.families?.find(f => f.id === i.familyId);
      return f && (f.village?.name === v.name || f.villageName === v.name);
    }).length) ?? [];
    return { cats, fam, ind };
  }, [state.villages, state.families, state.individuals]);

  const mv = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return { months, data: [8, 14, 11, 18, 22, (state.visits?.length ?? 0) + 10] };
  }, [state.visits?.length]);

  const diseaseOpts = useMemo(() => ({
    chart: { ...chartBase, type: 'bar' },
    plotOptions: { bar: { borderRadius: 5, distributed: true, columnWidth: '50%' } },
    colors: ['#0ea5e9', '#14b8a6', '#22c55e', '#a855f7', '#06b6d4'],
    dataLabels: { enabled: true, style: { colors: ['#fff'], fontSize: '12px', fontWeight: 700 } },
    xaxis: { categories: ['Diabetes', 'Hypertension', 'TB', 'Cancer', 'Asthma'], labels: { style: axisStyle } },
    yaxis: { labels: { style: axisStyle } },
    grid: { borderColor: isLight ? '#e2e8f0' : '#334155' },
    theme: { mode: isLight ? 'light' : 'dark' }, legend: { show: false },
    tooltip: { theme: isLight ? 'light' : 'dark' },
  }), [chartBase, axisStyle, isLight]);

  const maternalOpts = useMemo(() => ({
    chart: { ...chartBase, type: 'donut' },
    labels: ['Normal Pregnancy', 'High-Risk Pregnancy'],
    colors: ['#22c55e', '#ef4444'],
    plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, label: 'Pregnant', color: isLight ? '#475569' : '#94a3b8', fontSize: '12px' } } } } },
    dataLabels: { enabled: false },
    legend: { position: 'bottom', labels: { colors: isLight ? '#475569' : '#94a3b8' } },
    theme: { mode: isLight ? 'light' : 'dark' }, tooltip: { theme: isLight ? 'light' : 'dark' },
  }), [chartBase, isLight]);

  const villageOpts = useMemo(() => ({
    chart: { ...chartBase, type: 'bar' },
    colors: ['#0ea5e9', '#14b8a6'],
    plotOptions: { bar: { columnWidth: '60%', borderRadius: 4, grouped: true } },
    dataLabels: { enabled: false },
    xaxis: { categories: vs.cats.length ? vs.cats : ['V1', 'V2', 'V3'], labels: { style: axisStyle } },
    yaxis: { labels: { style: axisStyle } },
    grid: { borderColor: isLight ? '#e2e8f0' : '#334155' },
    legend: { labels: { colors: isLight ? '#475569' : '#94a3b8' } },
    theme: { mode: isLight ? 'light' : 'dark' }, tooltip: { theme: isLight ? 'light' : 'dark' },
  }), [chartBase, axisStyle, vs.cats, isLight]);

  const visitTrendOpts = useMemo(() => ({
    chart: { ...chartBase, type: 'area' },
    colors: ['#0ea5e9'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
    stroke: { curve: 'smooth', width: 2 },
    dataLabels: { enabled: false },
    xaxis: { categories: mv.months, labels: { style: axisStyle } },
    yaxis: { labels: { style: axisStyle } },
    grid: { borderColor: isLight ? '#e2e8f0' : '#334155' },
    theme: { mode: isLight ? 'light' : 'dark' }, tooltip: { theme: isLight ? 'light' : 'dark' },
  }), [chartBase, axisStyle, mv.months, isLight]);

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 rounded-2xl relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(135deg, #0057B8 0%, #1B2B5B 100%)' }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
        <div className="relative z-10 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-200 bg-white/10 px-2.5 py-1 rounded border border-white/15 backdrop-blur-md">
            Ayathana Trust · Super Admin
          </span>
          <h2 className="text-2xl font-black mt-1 text-white drop-shadow">Governance & Monitoring Dashboard</h2>
          <p className="text-xs font-semibold text-white/70">Governance · Monitoring · Analytics · Approvals · Expansion Management</p>
        </div>
        <div className="relative z-10 flex gap-2 text-xs">
          {pendingApprovals > 0 && (
            <button
              onClick={() => setActiveTab('approvals')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border font-black bg-amber-500/20 border-amber-400/30 text-amber-200 animate-pulse"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              {pendingApprovals} Pending
            </button>
          )}
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex overflow-x-auto bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl gap-1 scrollbar-hide p-1.5 shadow-sm">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`admin-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer rounded-lg ${
                isActive
                  ? 'bg-[#0057B8] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-inner)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {tab.label}
              {tab.id === 'approvals' && pendingApprovals > 0 && (
                <span className="ml-1 bg-amber-500 text-white text-[10px] font-black rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {pendingApprovals}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <div className="relative z-10">

        {activeTab === 'dashboard' && (
          <GovernanceDashboard summary={summary} state={state} />
        )}

        {activeTab === 'governance' && (
          <GovernancePanel state={state} setState={setState} />
        )}

        {activeTab === 'users' && (
          <AccessControl state={state} setState={setState} />
        )}

        {activeTab === 'monitoring' && (
          <MonitoringPanel state={state} />
        )}

        {activeTab === 'approvals' && (
          <ApprovalsPanel
            state={state}
            setState={setState}
            onApprovalChange={count => setPendingApprovals(count)}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsPanel state={state} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            isLight={isLight}
            stats={{
              totalVillages:    summary.total_villages,
              totalFamilies:    summary.total_families,
              totalIndividuals: summary.total_individuals,
              activeAlerts:     state.alerts?.filter(a => !a.resolved).length ?? 0,
            }}
          />
        )}

        {activeTab === 'training' && (
          <TrainingOverview state={state} />
        )}

        {activeTab === 'audit' && (
          <AuditLogs filteredAuditLogs={state.auditLogs || []} />
        )}

      </div>
    </div>
  );
}
