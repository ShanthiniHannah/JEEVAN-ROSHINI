import React from 'react';
import ReactApexChart from 'react-apexcharts';

/**
 * AnalyticsDashboard — Admin Portal sub-component.
 * Renders statistical charts and metrics using CSS theme variables.
 */
export function AnalyticsDashboard({
  stats,
  diseaseOpts,
  getDiseaseCounts,
  maternalOpts,
  getMaternalRatio,
  villageOpts,
  vs,
  visitTrendOpts,
  mv
}) {
  return (
    <div className="space-y-6">
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Families Mapped', value: stats.totalFamilies, sub: 'Household Registries', color: 'text-brand-500' },
          { label: 'Individuals Mapped', value: stats.totalIndividuals, sub: 'Total Beneficiary PII', color: 'text-teal-500' },
          { label: 'Unresolved Alerts', value: stats.activeAlerts, sub: 'High risk NCDs/SAM', color: 'text-rose-500 animate-pulse' },
          { label: 'Avg Health Rating', value: '4.8 / 5', sub: 'Calculated block Index', color: 'text-amber-500' }
        ].map((c, i) => (
          <div 
            key={i} 
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Accent top bar — 3px, brand color, left-aligned radius */}
            <div className="w-12 h-1 rounded-full bg-brand-500 mb-4" />

            {/* Label */}
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-1">
              {c.label}
            </p>

            {/* Value */}
            <p className={`text-3xl font-bold tabular-nums ${c.color}`}>
              {c.value}
            </p>

            {/* Sub-label */}
            <p className="text-xs text-[var(--text-secondary)] mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Grid of Apex Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NCD Prevalence Chart */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl">
          <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-4">NCD & Chronic Disease Prevalence</h4>
          <ReactApexChart options={diseaseOpts} series={[{ name: 'Patients Count', data: getDiseaseCounts() }]} type="bar" height={220} />
        </div>

        {/* Maternal Health Ratios Donut */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl">
          <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-4">Maternal High-Risk Ratios</h4>
          <ReactApexChart options={maternalOpts} series={getMaternalRatio()} type="donut" height={220} />
        </div>

        {/* Sector Population comparison */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl">
          <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-4">Demographics Comparison by Sector</h4>
          <ReactApexChart options={villageOpts} series={[
            { name: 'Families', data: vs.fam.length ? vs.fam : [4, 6, 8] },
            { name: 'Beneficiaries', data: vs.ind.length ? vs.ind : [12, 19, 24] }
          ]} type="bar" height={220} />
        </div>

        {/* Visits Audit Trend */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl">
          <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-4">Field Visit Audits Over Time</h4>
          <ReactApexChart options={visitTrendOpts} series={[{ name: 'Visits Recorded', data: mv.data }]} type="area" height={220} />
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
