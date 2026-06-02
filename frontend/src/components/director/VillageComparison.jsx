import React from 'react';
import { BarChart2 } from 'lucide-react';

export default function VillageComparison({
  state,
  villageA,
  setVillageA,
  villageB,
  setVillageB,
  comparisonData
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-indigo-400" />
          Socio-Health Village Comparison Dashboard
        </h3>
        <span className="text-[10px] text-slate-400">Compare rural health indicators side-by-side</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Select Village A</label>
          <select 
            value={villageA} 
            onChange={(e) => setVillageA(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
          >
            {state.villages.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Select Village B</label>
          <select 
            value={villageB} 
            onChange={(e) => setVillageB(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
          >
            {state.villages.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* VILLAGE A PANEL */}
        <div className="bg-slate-950/40 p-5 rounded-2xl border border-indigo-950/30 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-sm font-black text-indigo-400">{comparisonData.A.name}</h4>
            <span className="text-[9px] bg-indigo-500/10 px-2 py-0.5 rounded text-indigo-300 font-mono">A</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-900 border border-slate-855 p-2.5 rounded-xl">
              <p className="text-lg font-bold text-slate-200">{comparisonData.A.familiesCount}</p>
              <p className="text-[9px] text-slate-500 uppercase mt-0.5">Families</p>
            </div>
            <div className="bg-slate-900 border border-slate-855 p-2.5 rounded-xl">
              <p className="text-lg font-bold text-slate-200">{comparisonData.A.indCount}</p>
              <p className="text-[9px] text-slate-500 uppercase mt-0.5">Individuals</p>
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">Total Visits (Visits / Month)</span>
                <span className="font-bold text-blue-400">{comparisonData.A.visits} visits</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(comparisonData.A.visits * 10, 100)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">High-Risk Pregnancies</span>
                <span className="font-bold text-rose-400">{comparisonData.A.maternalRiskPct}% Risk</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${comparisonData.A.maternalRiskPct}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">Malnutrition Rate (Under-5)</span>
                <span className="font-bold text-amber-400">{comparisonData.A.malnutritionPct}% SAM/MAM</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${comparisonData.A.malnutritionPct}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">VHW Shift Attendance Rate</span>
                <span className="font-bold text-emerald-400">{comparisonData.A.attendanceRate}%</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${comparisonData.A.attendanceRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* VILLAGE B PANEL */}
        <div className="bg-slate-950/40 p-5 rounded-2xl border border-emerald-950/20 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-sm font-black text-emerald-400">{comparisonData.B.name}</h4>
            <span className="text-[9px] bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-300 font-mono">B</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-900 border border-slate-855 p-2.5 rounded-xl">
              <p className="text-lg font-bold text-slate-200">{comparisonData.B.familiesCount}</p>
              <p className="text-[9px] text-slate-500 uppercase mt-0.5">Families</p>
            </div>
            <div className="bg-slate-900 border border-slate-855 p-2.5 rounded-xl">
              <p className="text-lg font-bold text-slate-200">{comparisonData.B.indCount}</p>
              <p className="text-[9px] text-slate-500 uppercase mt-0.5">Individuals</p>
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">Total Visits (Visits / Month)</span>
                <span className="font-bold text-blue-400">{comparisonData.B.visits} visits</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(comparisonData.B.visits * 10, 100)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">High-Risk Pregnancies</span>
                <span className="font-bold text-rose-400">{comparisonData.B.maternalRiskPct}% Risk</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${comparisonData.B.maternalRiskPct}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">Malnutrition Rate (Under-5)</span>
                <span className="font-bold text-amber-400">{comparisonData.B.malnutritionPct}% SAM/MAM</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${comparisonData.B.malnutritionPct}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">VHW Shift Attendance Rate</span>
                <span className="font-bold text-emerald-400">{comparisonData.B.attendanceRate}%</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${comparisonData.B.attendanceRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
