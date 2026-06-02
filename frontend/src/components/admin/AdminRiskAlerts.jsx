import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function AdminRiskAlerts({
  alertFilter,
  setAlertFilter,
  filteredAlerts,
  handleAcknowledgeAlert
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Central Risk Alerts & Clinical Incidents
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">High severity, chronic NCDs, and maternal anomalies flagged automatically by RiskEngine.</p>
        </div>
        <div className="flex gap-2 text-xs">
          {['all', 'critical', 'unresolved', 'resolved'].map(f => (
            <button key={f} onClick={() => setAlertFilter(f)}
              className={`px-3 py-1.5 rounded-lg border font-bold transition cursor-pointer ${
                alertFilter === f ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlerts.map(al => (
          <div key={al.id} className="border border-slate-800 p-4.5 rounded-xl bg-slate-950/20 space-y-2 flex flex-col justify-between hover:border-slate-700 transition">
            <div>
              <div className="flex justify-between items-start">
                <span className={`text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded border ${
                  al.severity === 'critical' ? 'bg-rose-500/10 text-rose-450 border-rose-500/25 animate-pulse' : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                }`}>{al.severity}</span>
                <span className="text-[10px] font-mono text-slate-500">Alert ID: {al.id}</span>
              </div>
              <h4 className="text-xs font-bold text-white mt-2">Patient Name: {al.patientName}</h4>
              <p className="text-[11.5px] text-slate-400 mt-1 leading-relaxed"><span className="font-bold text-slate-500">Anomaly:</span> "{al.reason}"</p>
              <p className="text-[10px] text-slate-500 mt-1">Rule Triggered: <span className="font-mono text-slate-400">{al.type}</span></p>
            </div>
            
            <div className="border-t border-slate-800/80 pt-2.5 mt-2 flex justify-between items-center text-[10px]">
              <span className="text-slate-500">Status: <span className={`font-bold ${al.resolved ? 'text-emerald-400' : 'text-amber-400'}`}>{al.resolved ? 'Acknowledged' : 'Unresolved'}</span></span>
              {!al.resolved && (
                <button 
                  onClick={() => handleAcknowledgeAlert(al.id)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider transition active:scale-97 border border-slate-700 cursor-pointer"
                >
                  Resolve Alert
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredAlerts.length === 0 && (
          <p className="col-span-2 text-center text-xs text-slate-500 italic py-6">No clinical alerts matching this filter.</p>
        )}
      </div>
    </div>
  );
}
