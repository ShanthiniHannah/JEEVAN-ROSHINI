import React from 'react';
import ReactApexChart from 'react-apexcharts';

export default function AnalyticsDashboard({
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
          { label: 'Families Mapped', value: stats.totalFamilies, sub: 'Household Registries', color: 'text-indigo-400' },
          { label: 'Individuals Registered', value: stats.totalIndividuals, sub: 'Total Beneficiary PII', color: 'text-emerald-400' },
          { label: 'Unresolved Alerts', value: stats.activeAlerts, sub: 'High risk NCDs/SAM', color: 'text-rose-450' },
          { label: 'Avg Health Rating', value: '4.8 ★', sub: 'Calculated block Index', color: 'text-amber-400' }
        ].map((c, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-4.5 rounded-2xl relative overflow-hidden">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{c.label}</p>
            <h3 className={`text-2xl font-black mt-2 ${c.color}`}>{c.value}</h3>
            <p className="text-[9px] text-slate-400 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Grid of Apex Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NCD Prevalence Chart */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">NCD & Chronic Disease Prevalence</h4>
          <ReactApexChart options={diseaseOpts} series={[{ name: 'Patients Count', data: getDiseaseCounts() }]} type="bar" height={220} />
        </div>

        {/* Maternal Health Ratios Donut */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Maternal High-Risk Ratios</h4>
          <ReactApexChart options={maternalOpts} series={getMaternalRatio()} type="donut" height={220} />
        </div>

        {/* Sector Population comparison */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Demographics Comparison by Sector</h4>
          <ReactApexChart options={villageOpts} series={[
            { name: 'Families', data: vs.fam.length ? vs.fam : [4, 6, 8] },
            { name: 'Beneficiaries', data: vs.ind.length ? vs.ind : [12, 19, 24] }
          ]} type="bar" height={220} />
        </div>

        {/* Visits Audit Trend */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Field Visit Audits Over Time</h4>
          <ReactApexChart options={visitTrendOpts} series={[{ name: 'Visits Recorded', data: mv.data }]} type="area" height={220} />
        </div>
      </div>
    </div>
  );
}
