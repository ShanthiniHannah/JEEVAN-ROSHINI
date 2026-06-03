import React from 'react';
import { BarChart2 } from 'lucide-react';

/**
 * VillageComparison — Director Portal side-by-side village socio-health index comparison.
 * Colors: Green (low risk/good), Yellow (moderate risk), Red (high risk/malnutrition).
 */
export default function VillageComparison({
  state,
  villageA,
  setVillageA,
  villageB,
  setVillageB,
  comparisonData
}) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-6">
      <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
        <h3 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-indigo-500" />
          Socio-Health Village Comparison Dashboard
        </h3>
        <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider hidden sm:inline">Compare Health Indicators</span>
      </div>

      {/* Selectors grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[9.5px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Select Village A</label>
          <select
            value={villageA}
            onChange={(e) => setVillageA(e.target.value)}
            className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-500"
          >
            {state.villages.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[9.5px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Select Village B</label>
          <select
            value={villageB}
            onChange={(e) => setVillageB(e.target.value)}
            className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-500"
          >
            {state.villages.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* VILLAGE A PANEL */}
        <div className="bg-[var(--bg-inner)] p-5 rounded-2xl border border-[var(--border-color)] space-y-4">
          <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
            <h4 className="text-sm font-black text-brand-500">{comparisonData.A.name}</h4>
            <span className="text-[9.5px] bg-brand-500/10 px-2 py-0.5 border border-brand-500/20 rounded font-mono font-bold text-brand-500">Village A</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-xl">
              <p className="text-lg font-black text-[var(--text-primary)]">{comparisonData.A.familiesCount}</p>
              <p className="text-[8.5px] text-[var(--text-secondary)] uppercase font-black tracking-wider mt-0.5">Families</p>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-xl">
              <p className="text-lg font-black text-[var(--text-primary)]">{comparisonData.A.indCount}</p>
              <p className="text-[8.5px] text-[var(--text-secondary)] uppercase font-black tracking-wider mt-0.5">Individuals</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-[10px] mb-1 font-semibold">
                <span className="text-[var(--text-secondary)]">Total Visits logged</span>
                <span className="font-black text-blue-500">{comparisonData.A.visits} visits</span>
              </div>
              <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border-color)]">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(comparisonData.A.visits * 10, 100)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1 font-semibold">
                <span className="text-[var(--text-secondary)]">Maternal Vulnerability Rate</span>
                <span className={`font-black ${comparisonData.A.maternalRiskPct > 60 ? 'text-[#ef4444]' : comparisonData.A.maternalRiskPct > 30 ? 'text-[#f59e0b]' : 'text-[#22c55e]'}`}>
                  {comparisonData.A.maternalRiskPct}% Risk
                </span>
              </div>
              <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border-color)]">
                <div
                  className={`h-full rounded-full ${comparisonData.A.maternalRiskPct > 60 ? 'bg-[#ef4444]' : comparisonData.A.maternalRiskPct > 30 ? 'bg-[#f59e0b]' : 'bg-[#22c55e]'}`}
                  style={{ width: `${comparisonData.A.maternalRiskPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1 font-semibold">
                <span className="text-[var(--text-secondary)]">Malnutrition Rate (Under-5)</span>
                <span className={`font-black ${comparisonData.A.malnutritionPct > 60 ? 'text-[#ef4444]' : comparisonData.A.malnutritionPct > 30 ? 'text-[#f59e0b]' : 'text-[#22c55e]'}`}>
                  {comparisonData.A.malnutritionPct}% SAM/MAM
                </span>
              </div>
              <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border-color)]">
                <div
                  className={`h-full rounded-full ${comparisonData.A.malnutritionPct > 60 ? 'bg-[#ef4444]' : comparisonData.A.malnutritionPct > 30 ? 'bg-[#f59e0b]' : 'bg-[#22c55e]'}`}
                  style={{ width: `${comparisonData.A.malnutritionPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1 font-semibold">
                <span className="text-[var(--text-secondary)]">VHW Shift Attendance Rate</span>
                <span className="font-black text-emerald-500">{comparisonData.A.attendanceRate}%</span>
              </div>
              <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border-color)]">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${comparisonData.A.attendanceRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* VILLAGE B PANEL */}
        <div className="bg-[var(--bg-inner)] p-5 rounded-2xl border border-[var(--border-color)] space-y-4">
          <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
            <h4 className="text-sm font-black text-teal-500">{comparisonData.B.name}</h4>
            <span className="text-[9.5px] bg-teal-500/10 px-2 py-0.5 border border-teal-500/20 rounded font-mono font-bold text-teal-500">Village B</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-xl">
              <p className="text-lg font-black text-[var(--text-primary)]">{comparisonData.B.familiesCount}</p>
              <p className="text-[8.5px] text-[var(--text-secondary)] uppercase font-black tracking-wider mt-0.5">Families</p>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-xl">
              <p className="text-lg font-black text-[var(--text-primary)]">{comparisonData.B.indCount}</p>
              <p className="text-[8.5px] text-[var(--text-secondary)] uppercase font-black tracking-wider mt-0.5">Individuals</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-[10px] mb-1 font-semibold">
                <span className="text-[var(--text-secondary)]">Total Visits logged</span>
                <span className="font-black text-blue-500">{comparisonData.B.visits} visits</span>
              </div>
              <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border-color)]">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(comparisonData.B.visits * 10, 100)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1 font-semibold">
                <span className="text-[var(--text-secondary)]">Maternal Vulnerability Rate</span>
                <span className={`font-black ${comparisonData.B.maternalRiskPct > 60 ? 'text-[#ef4444]' : comparisonData.B.maternalRiskPct > 30 ? 'text-[#f59e0b]' : 'text-[#22c55e]'}`}>
                  {comparisonData.B.maternalRiskPct}% Risk
                </span>
              </div>
              <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border-color)]">
                <div
                  className={`h-full rounded-full ${comparisonData.B.maternalRiskPct > 60 ? 'bg-[#ef4444]' : comparisonData.B.maternalRiskPct > 30 ? 'bg-[#f59e0b]' : 'bg-[#22c55e]'}`}
                  style={{ width: `${comparisonData.B.maternalRiskPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1 font-semibold">
                <span className="text-[var(--text-secondary)]">Malnutrition Rate (Under-5)</span>
                <span className={`font-black ${comparisonData.B.malnutritionPct > 60 ? 'text-[#ef4444]' : comparisonData.B.malnutritionPct > 30 ? 'text-[#f59e0b]' : 'text-[#22c55e]'}`}>
                  {comparisonData.B.malnutritionPct}% SAM/MAM
                </span>
              </div>
              <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border-color)]">
                <div
                  className={`h-full rounded-full ${comparisonData.B.malnutritionPct > 60 ? 'bg-[#ef4444]' : comparisonData.B.malnutritionPct > 30 ? 'bg-[#f59e0b]' : 'bg-[#22c55e]'}`}
                  style={{ width: `${comparisonData.B.malnutritionPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1 font-semibold">
                <span className="text-[var(--text-secondary)]">VHW Shift Attendance Rate</span>
                <span className="font-black text-emerald-500">{comparisonData.B.attendanceRate}%</span>
              </div>
              <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border-color)]">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${comparisonData.B.attendanceRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
