import React, { useState, useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import {
  AlertTriangle, TrendingUp, Package, Activity,
  Heart, IndianRupee, Droplets, Pill, Bell, CheckCircle2,
  XCircle, Clock, Users, MapPin, Home
} from 'lucide-react';

/* ─── Shared helpers ─────────────────────────────────────────── */

function CountUp({ end, duration = 1200 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let id;
    const endNum = parseInt(end, 10);
    if (isNaN(endNum) || endNum === 0) { setCount(end); return; }
    let startTs = null;
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      setCount(Math.floor(p * (2 - p) * endNum));
      if (p < 1) id = window.requestAnimationFrame(step); else setCount(endNum);
    };
    id = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(id);
  }, [end, duration]);
  return <>{typeof count === 'number' ? count.toLocaleString() : count}</>;
}

function AlertBadge({ level }) {
  const styles = {
    critical: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
    high:     'bg-orange-500/15 text-orange-500 border-orange-500/30',
    medium:   'bg-amber-500/15 text-amber-500 border-amber-500/30',
    low:      'bg-blue-500/15 text-blue-500 border-blue-500/30',
  };
  return (
    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${styles[level] || styles.low}`}>
      {level}
    </span>
  );
}

function SectionHeader({ icon: Icon, color, title, badge, badgeColor }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
        <span className={`w-1.5 h-5 rounded-full inline-block ${color}`} />
        <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
        {title}
      </h3>
      {badge && (
        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
          {badge}
        </span>
      )}
    </div>
  );
}

/* ─── Static rich demo data (mirrors what DB would return) ────── */
const DEMO_DISEASES_BY_DISTRICT = [
  { district: 'Hassan',   state: 'Karnataka', Diabetes: 148, Hypertension: 212, TB: 34, Asthma: 67, Cancer: 18 },
  { district: 'Chikkamagaluru', state: 'Karnataka', Diabetes: 97, Hypertension: 183, TB: 22, Asthma: 55, Cancer: 11 },
  { district: 'Shivamogga', state: 'Karnataka', Diabetes: 134, Hypertension: 167, TB: 41, Asthma: 49, Cancer: 26 },
  { district: 'Dakshina Kannada', state: 'Karnataka', Diabetes: 199, Hypertension: 221, TB: 18, Asthma: 88, Cancer: 33 },
];

const DEMO_PROGRAMS = [
  { name: 'Handwash Awareness', villages: 12, done: 9, dueDate: '2026-06-15', status: 'In Progress' },
  { name: 'Anaemia Screening', villages: 8, done: 8, dueDate: '2026-05-30', status: 'Completed' },
  { name: 'Sanitation Drive', villages: 14, done: 5, dueDate: '2026-06-10', status: 'Overdue' },
  { name: 'Nutrition Camp', villages: 10, done: 7, dueDate: '2026-06-20', status: 'In Progress' },
  { name: 'TB Screening', villages: 6, done: 0, dueDate: '2026-06-08', status: 'Overdue' },
  { name: 'Maternal Health Camp', villages: 11, done: 11, dueDate: '2026-06-01', status: 'Completed' },
];

const DEMO_MEDICINE = [
  { name: 'Paracetamol 500mg', stock: 340, threshold: 200, expiry: '2027-03-15', unit: 'tablets', status: 'ok' },
  { name: 'ORS Sachets', stock: 45, threshold: 100, expiry: '2026-09-10', unit: 'sachets', status: 'low' },
  { name: 'Iron-Folic Acid', stock: 12, threshold: 50, expiry: '2026-07-01', unit: 'strips', status: 'critical' },
  { name: 'Amoxicillin 250mg', stock: 180, threshold: 100, expiry: '2026-08-20', unit: 'capsules', status: 'ok' },
  { name: 'Metformin 500mg', stock: 95, threshold: 120, expiry: '2027-01-05', unit: 'tablets', status: 'low' },
  { name: 'Vitamin D3', stock: 220, threshold: 80, expiry: '2025-11-30', unit: 'capsules', status: 'expired' },
];

const DEMO_BUDGET = [
  { category: 'Field Operations', allocated: 450000, spent: 387000, limit: 450000 },
  { category: 'Medicine Procurement', allocated: 200000, spent: 194000, limit: 200000 },
  { category: 'Training Programs', allocated: 120000, spent: 95000, limit: 120000 },
  { category: 'Community Programs', allocated: 80000, spent: 81500, limit: 80000 },
  { category: 'Logistics & Transport', allocated: 60000, spent: 58000, limit: 60000 },
];

const DISEASE_COLORS = ['#0ea5e9', '#ef4444', '#f59e0b', '#a855f7', '#10b981'];
const DISEASE_NAMES  = ['Diabetes', 'Hypertension', 'TB', 'Asthma', 'Cancer'];

/* ─── Main Component ─────────────────────────────────────────── */
export function AnalyticsDashboard({ stats, isLight }) {
  const [diseaseView, setDiseaseView] = useState('district'); // district | state
  const [selectedDisease, setSelectedDisease] = useState('all');

  const dark = !isLight;
  const axisColor = dark ? '#94a3b8' : '#64748b';
  const gridColor = dark ? '#1e293b' : '#e2e8f0';
  const bgCard    = dark ? '#0f172a' : '#ffffff';
  const chartBase = { toolbar: { show: false }, background: 'transparent', fontFamily: 'Inter, sans-serif', animations: { enabled: true, speed: 600 } };

  /* ── 1. Disease counts by district/state (stacked bar) ── */
  const diseaseDistrictSeries = useMemo(() => DISEASE_NAMES.map((d, i) => ({
    name: d,
    data: DEMO_DISEASES_BY_DISTRICT.map(r => r[d] ?? 0),
  })), []);

  const diseaseCats = useMemo(() =>
    DEMO_DISEASES_BY_DISTRICT.map(r => diseaseView === 'state' ? r.state : r.district), [diseaseView]);

  const diseaseStackedOpts = useMemo(() => ({
    chart: { ...chartBase, type: 'bar', stacked: true },
    colors: DISEASE_COLORS,
    plotOptions: { bar: { borderRadius: 3, columnWidth: '55%' } },
    dataLabels: { enabled: false },
    xaxis: { categories: diseaseCats, labels: { style: { colors: axisColor, fontSize: '11px' } } },
    yaxis: { labels: { style: { colors: axisColor } } },
    grid: { borderColor: gridColor },
    legend: { position: 'top', labels: { colors: axisColor }, fontSize: '11px' },
    tooltip: { theme: dark ? 'dark' : 'light' },
    theme: { mode: dark ? 'dark' : 'light' },
  }), [diseaseCats, axisColor, gridColor, dark]);

  /* ── 2. Disease radar — existing vs new (by disease) ── */
  const radarSeries = useMemo(() => [
    { name: 'Known Cases', data: [148, 212, 34, 67, 18] },
    { name: 'New Alerts',  data: [22, 38, 8, 12, 5] },
  ], []);
  const radarOpts = useMemo(() => ({
    chart: { ...chartBase, type: 'radar' },
    colors: ['#0ea5e9', '#ef4444'],
    xaxis: { categories: DISEASE_NAMES, labels: { style: { colors: axisColor, fontSize: '12px', fontWeight: 700 } } },
    yaxis: { show: false },
    fill: { opacity: 0.25 },
    stroke: { width: 2 },
    markers: { size: 4 },
    legend: { labels: { colors: axisColor } },
    tooltip: { theme: dark ? 'dark' : 'light' },
    theme: { mode: dark ? 'dark' : 'light' },
  }), [axisColor, dark]);

  /* ── 3. Program implementation — radial bars ── */
  const programPct = DEMO_PROGRAMS.map(p => Math.round((p.done / p.villages) * 100));
  const programRadialOpts = useMemo(() => ({
    chart: { ...chartBase, type: 'radialBar' },
    colors: programPct.map(p => p === 100 ? '#22c55e' : p === 0 ? '#ef4444' : '#f59e0b'),
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: -135,
        endAngle: 135,
        hollow: { margin: 5, size: '35%' },
        track: { background: gridColor, strokeWidth: '97%' },
        dataLabels: {
          name: { show: true, color: axisColor, fontSize: '9px', fontWeight: 700, offsetY: 4 },
          value: { color: dark ? '#f1f5f9' : '#1e293b', fontSize: '13px', fontWeight: 900, offsetY: -12, formatter: v => v + '%' },
        },
      },
    },
    labels: DEMO_PROGRAMS.map(p => p.name.split(' ')[0]),
    legend: { show: false },
    tooltip: { theme: dark ? 'dark' : 'light' },
  }), [programPct, axisColor, gridColor, dark]);

  /* ── 4. Budget utilisation — horizontal bar ── */
  const budgetSeries = useMemo(() => [
    { name: 'Spent', data: DEMO_BUDGET.map(b => Math.round((b.spent / b.allocated) * 100)) },
  ], []);
  const budgetOpts = useMemo(() => ({
    chart: { ...chartBase, type: 'bar' },
    colors: DEMO_BUDGET.map(b => b.spent > b.limit ? '#ef4444' : b.spent / b.allocated > 0.9 ? '#f59e0b' : '#22c55e'),
    plotOptions: { bar: { borderRadius: 5, horizontal: true, distributed: true, barHeight: '55%' } },
    dataLabels: { enabled: true, formatter: v => v + '%', style: { colors: ['#fff'], fontSize: '11px', fontWeight: 700 } },
    xaxis: { max: 110, categories: DEMO_BUDGET.map(b => b.category), labels: { style: { colors: axisColor, fontSize: '11px' }, formatter: v => v + '%' } },
    yaxis: { labels: { style: { colors: axisColor } } },
    grid: { borderColor: gridColor },
    legend: { show: false },
    tooltip: { theme: dark ? 'dark' : 'light', y: { formatter: (v, { dataPointIndex }) => `₹${DEMO_BUDGET[dataPointIndex].spent.toLocaleString()} / ₹${DEMO_BUDGET[dataPointIndex].allocated.toLocaleString()}` } },
    theme: { mode: dark ? 'dark' : 'light' },
    annotations: { xaxis: [{ x: 100, borderColor: '#ef4444', strokeDashArray: 4, label: { text: 'Limit', style: { color: '#ef4444', background: 'transparent', fontSize: '10px' } } }] },
  }), [axisColor, gridColor, dark]);

  /* ── 5. Village population tiers — treemap ── */
  const villageTiers = useMemo(() => [
    { name: 'Gundya',    value: 4820 },
    { name: 'Mudigere',  value: 3210 },
    { name: 'Belur',     value: 1820 },
    { name: 'Sakleshpur',value: 2650 },
    { name: 'Alur',      value: 940 },
    { name: 'Arehalli',  value: 620 },
    { name: 'Kelagur',   value: 380 },
    { name: 'Bisle',     value: 190 },
  ], []);
  const treemapOpts = useMemo(() => ({
    chart: { ...chartBase, type: 'treemap' },
    colors: ['#0ea5e9', '#0284c7', '#0369a1', '#14b8a6', '#0d9488', '#0f766e', '#f59e0b', '#d97706'],
    dataLabels: { enabled: true, style: { fontSize: '12px', fontWeight: 900, colors: ['#fff'] } },
    plotOptions: { treemap: { enableShades: true, shadeIntensity: 0.2, distributed: true } },
    legend: { show: false },
    tooltip: { theme: dark ? 'dark' : 'light', y: { formatter: v => v.toLocaleString() + ' people' } },
    theme: { mode: dark ? 'dark' : 'light' },
  }), [dark]);

  /* ── 6. Medicine stock — combo bar + line ── */
  const medStockSeries = useMemo(() => [
    { name: 'Stock Level', type: 'bar',  data: DEMO_MEDICINE.map(m => m.stock) },
    { name: 'Threshold',   type: 'line', data: DEMO_MEDICINE.map(m => m.threshold) },
  ], []);
  const medStockOpts = useMemo(() => ({
    chart: { ...chartBase, type: 'line' },
    colors: DEMO_MEDICINE.map(m => m.status === 'critical' ? '#ef4444' : m.status === 'low' ? '#f59e0b' : m.status === 'expired' ? '#7c3aed' : '#22c55e'),
    plotOptions: { bar: { borderRadius: 4, columnWidth: '55%', distributed: true } },
    stroke: { width: [0, 2], dashArray: [0, 4] },
    dataLabels: { enabled: false },
    xaxis: { categories: DEMO_MEDICINE.map(m => m.name.split(' ')[0]), labels: { style: { colors: axisColor, fontSize: '10px' } } },
    yaxis: { labels: { style: { colors: axisColor } } },
    grid: { borderColor: gridColor },
    legend: { labels: { colors: axisColor } },
    tooltip: {
      theme: dark ? 'dark' : 'light',
      y: { formatter: (v, { seriesIndex, dataPointIndex }) => {
        if (seriesIndex === 1) return v + ' (threshold)';
        const m = DEMO_MEDICINE[dataPointIndex];
        return `${v} ${m.unit} — exp. ${m.expiry}`;
      }},
    },
    theme: { mode: dark ? 'dark' : 'light' },
  }), [axisColor, gridColor, dark]);

  /* ── Alert helpers ── */
  const overduePrograms   = DEMO_PROGRAMS.filter(p => p.status === 'Overdue');
  const budgetBreached    = DEMO_BUDGET.filter(b => b.spent > b.limit);
  const medCritical       = DEMO_MEDICINE.filter(m => m.status === 'critical' || m.status === 'expired');
  const totalAlerts       = overduePrograms.length + budgetBreached.length + medCritical.length;

  const kpiData = [
    { label: 'Total Villages', value: stats?.totalVillages ?? 24,    sub: 'Mapped rural sectors',       color: 'text-sky-500',    icon: MapPin,      bg: 'rgba(14,165,233,0.08)',  border: '#0ea5e9' },
    { label: 'Total Families', value: stats?.totalFamilies ?? 3812,  sub: 'Household registries',       color: 'text-teal-500',   icon: Home,        bg: 'rgba(20,184,166,0.08)',  border: '#14b8a6' },
    { label: 'Beneficiaries',  value: stats?.totalIndividuals ?? 18440, sub: 'Health records active',   color: 'text-violet-500', icon: Users,       bg: 'rgba(168,85,247,0.08)', border: '#a855f7' },
    { label: 'Active Alerts',  value: totalAlerts,                   sub: 'Needs immediate action',     color: 'text-rose-500',   icon: AlertTriangle, bg: 'rgba(239,68,68,0.08)', border: '#ef4444' },
  ];

  return (
    <div className="space-y-8">

      {/* ── Section 0: KPI Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              style={{ borderLeft: `4px solid ${c.border}` }}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{c.label}</span>
                <div className="p-2 rounded-xl" style={{ background: c.bg }}>
                  <Icon className={`w-3.5 h-3.5 ${c.color}`} />
                </div>
              </div>
              <p className={`text-2xl font-black tabular-nums ${c.color}`}><CountUp end={c.value} /></p>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1">{c.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Section 1: Disease by Geography ── */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-5 bg-sky-500 rounded-full" />
            <Activity className="w-4 h-4 text-sky-500" />
            Village Disease Count — Known Cases
          </h3>
          <div className="flex items-center gap-2">
            {['district', 'state'].map(v => (
              <button
                key={v}
                onClick={() => setDiseaseView(v)}
                className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border transition-all ${
                  diseaseView === v
                    ? 'bg-sky-500 text-white border-sky-500'
                    : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-sky-400'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <ReactApexChart
          key={`disease-${diseaseView}-${dark}`}
          options={diseaseStackedOpts}
          series={diseaseDistrictSeries}
          type="bar"
          height={260}
        />
        <p className="text-[10px] text-[var(--text-secondary)] mt-3 text-center">
          Stacked bars show existing disease burden per geography. Toggle between district and state view.
        </p>
      </div>

      {/* ── Section 2: Current Disease Alerts — Radar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <SectionHeader
            icon={AlertTriangle}
            color="bg-rose-500"
            title="Current Disease Alerts"
            badge={`${radarSeries[1].data.reduce((a,b)=>a+b,0)} New`}
            badgeColor="bg-rose-500/15 text-rose-500 border-rose-500/30"
          />
          <ReactApexChart
            key={`radar-${dark}`}
            options={radarOpts}
            series={radarSeries}
            type="radar"
            height={240}
          />
          <div className="mt-3 space-y-2">
            {[
              { label: 'Hypertension surge in Dakshina Kannada', target: 'PDs + VHWs', level: 'high' },
              { label: 'TB cases rising in Shivamogga', target: 'Project Director', level: 'critical' },
              { label: 'Asthma clusters near Chikkamagaluru', target: 'VHWs', level: 'medium' },
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between gap-2 py-2 border-b border-[var(--border-color)] last:border-0">
                <div className="flex items-start gap-2 min-w-0">
                  <Bell className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[10.5px] font-semibold text-[var(--text-primary)] truncate">{a.label}</p>
                    <p className="text-[9.5px] text-[var(--text-secondary)]">Alert → {a.target}</p>
                  </div>
                </div>
                <AlertBadge level={a.level} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 3: Program Implementation ── */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <SectionHeader
            icon={Heart}
            color="bg-teal-500"
            title="Programs Implementation"
            badge={`${overduePrograms.length} Overdue`}
            badgeColor="bg-amber-500/15 text-amber-500 border-amber-500/30"
          />
          <ReactApexChart
            key={`radial-${dark}`}
            options={programRadialOpts}
            series={programPct}
            type="radialBar"
            height={230}
          />
          <div className="mt-2 space-y-1.5">
            {DEMO_PROGRAMS.map((p, i) => {
              const isOverdue = p.status === 'Overdue';
              const isDone    = p.status === 'Completed';
              return (
                <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-xl text-[10.5px] border ${
                  isOverdue ? 'bg-rose-500/5 border-rose-500/20' : isDone ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-[var(--bg-inner)] border-[var(--border-color)]'
                }`}>
                  <div className="flex items-center gap-2">
                    {isDone ? <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> :
                     isOverdue ? <XCircle className="w-3 h-3 text-rose-500 shrink-0" /> :
                     <Clock className="w-3 h-3 text-amber-500 shrink-0" />}
                    <span className="font-semibold text-[var(--text-primary)] truncate">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[var(--text-secondary)]">{p.done}/{p.villages} villages</span>
                    {isOverdue && <span className="text-rose-500 font-black text-[9px] uppercase">Alert</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Section 4: Funding & Budget Expense Limit ── */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-5 bg-emerald-500 rounded-full" />
            <IndianRupee className="w-4 h-4 text-emerald-500" />
            Funding Expenses — Budget Limit Monitor
          </h3>
          {budgetBreached.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span className="text-[10px] font-black text-rose-500 uppercase">
                {budgetBreached.length} Category Limit Breached!
              </span>
            </div>
          )}
        </div>
        <ReactApexChart
          key={`budget-${dark}`}
          options={budgetOpts}
          series={budgetSeries}
          type="bar"
          height={220}
        />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
          {DEMO_BUDGET.map((b, i) => {
            const pct = Math.round((b.spent / b.allocated) * 100);
            const breached = b.spent > b.limit;
            return (
              <div key={i} className={`p-3 rounded-xl border text-center ${breached ? 'bg-rose-500/5 border-rose-500/25' : 'bg-[var(--bg-inner)] border-[var(--border-color)]'}`}>
                <p className="text-[9px] font-black uppercase text-[var(--text-secondary)] mb-1">{b.category.split(' ')[0]}</p>
                <p className={`text-lg font-black ${breached ? 'text-rose-500' : pct > 90 ? 'text-amber-500' : 'text-emerald-500'}`}>{pct}%</p>
                <p className="text-[9px] text-[var(--text-secondary)]">₹{(b.spent/1000).toFixed(0)}K / ₹{(b.allocated/1000).toFixed(0)}K</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section 5: Village Population Tiers ── */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
        <SectionHeader
          icon={Users}
          color="bg-violet-500"
          title="Village Population — Populated vs. Low-Population Sectors"
        />
        <ReactApexChart
          key={`treemap-${dark}`}
          options={treemapOpts}
          series={[{ data: villageTiers.map(v => ({ x: v.name, y: v.value })) }]}
          type="treemap"
          height={260}
        />
        <div className="flex gap-4 mt-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
            <span className="w-3 h-3 bg-sky-600 rounded" /> High-density (&gt;3000)
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
            <span className="w-3 h-3 bg-teal-600 rounded" /> Mid-density (1000–3000)
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
            <span className="w-3 h-3 bg-amber-500 rounded" /> Low-density (&lt;1000)
          </div>
        </div>
      </div>

      {/* ── Section 6: Medicine Stock & Expiry ── */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-5 bg-amber-500 rounded-full" />
            <Pill className="w-4 h-4 text-amber-500" />
            Medicine Stock Monitor — Under PD Approval
          </h3>
          {medCritical.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span className="text-[10px] font-black text-rose-500 uppercase">
                {medCritical.length} items need PD approval
              </span>
            </div>
          )}
        </div>
        <ReactApexChart
          key={`medicine-${dark}`}
          options={medStockOpts}
          series={medStockSeries}
          type="line"
          height={230}
        />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[10.5px]">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                {['Medicine', 'Stock', 'Unit', 'Threshold', 'Expiry', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left py-2 px-3 font-black uppercase text-[var(--text-secondary)] tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_MEDICINE.map((m, i) => {
                const isBad = m.status === 'critical' || m.status === 'expired' || m.status === 'low';
                return (
                  <tr key={i} className={`border-b border-[var(--border-color)] last:border-0 ${isBad ? 'bg-rose-500/3' : ''}`}>
                    <td className="py-2.5 px-3 font-semibold text-[var(--text-primary)]">{m.name}</td>
                    <td className={`py-2.5 px-3 font-black ${m.status === 'critical' ? 'text-rose-500' : m.status === 'low' ? 'text-amber-500' : m.status === 'expired' ? 'text-violet-500' : 'text-emerald-500'}`}>{m.stock}</td>
                    <td className="py-2.5 px-3 text-[var(--text-secondary)]">{m.unit}</td>
                    <td className="py-2.5 px-3 text-[var(--text-secondary)]">{m.threshold}</td>
                    <td className={`py-2.5 px-3 font-mono ${m.status === 'expired' ? 'text-violet-500 font-bold' : 'text-[var(--text-secondary)]'}`}>{m.expiry}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        m.status === 'ok'       ? 'bg-emerald-500/15 text-emerald-500' :
                        m.status === 'low'      ? 'bg-amber-500/15 text-amber-500' :
                        m.status === 'critical' ? 'bg-rose-500/15 text-rose-500' :
                                                  'bg-violet-500/15 text-violet-500'
                      }`}>{m.status}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      {(m.status === 'critical' || m.status === 'expired' || m.status === 'low') && (
                        <button className="px-2 py-0.5 bg-amber-500/15 hover:bg-amber-500/30 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded text-[9px] font-black uppercase transition-all cursor-pointer">
                          Request Restock → PD
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-[var(--text-secondary)] mt-3 flex items-center gap-1.5">
          <Droplets className="w-3 h-3 text-sky-400" />
          All medicine purchasing requests require Project Director approval before procurement is initiated.
        </p>
      </div>

    </div>
  );
}

export default AnalyticsDashboard;
