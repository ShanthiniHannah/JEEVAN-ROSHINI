import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function AdminRiskAlerts({
  alertFilter,
  setAlertFilter,
  filteredAlerts,
  handleAcknowledgeAlert
}) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-[var(--border-color)] pb-3">
        <div>
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Central Risk Alerts &amp; Clinical Incidents
          </h3>
          <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">High severity, chronic NCDs, and maternal anomalies flagged automatically by RiskEngine.</p>
        </div>
        <div className="flex gap-2 text-xs">
          {['all', 'critical', 'unresolved', 'resolved'].map(f => (
            <button key={f} onClick={() => setAlertFilter(f)}
              className={`px-3 py-1.5 rounded-lg border font-bold transition cursor-pointer ${
                alertFilter === f ? 'bg-rose-600 border-rose-500 text-white' : 'bg-[var(--bg-inner)] border-[var(--border-color)] text-[var(--text-secondary)]'
              }`}>
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlerts.map(al => (
          <div key={al.id} className="border border-[var(--border-color)] p-4 rounded-xl bg-[var(--bg-inner)] space-y-2 flex flex-col justify-between hover:border-[var(--text-secondary)]/40 transition">
            <div>
              <div className="flex justify-between items-start">
                <span className={`text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded border ${
                  al.severity === 'critical' ? 'bg-rose-500/10 text-rose-500 border-rose-500/25 animate-pulse' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25'
                }`}>{al.severity}</span>
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">Alert ID: {al.id}</span>
              </div>
              <h4 className="text-xs font-bold text-[var(--text-primary)] mt-2">Patient Name: {al.patientName}</h4>
              <p className="text-[11.5px] text-[var(--text-secondary)] mt-1 leading-relaxed"><span className="font-bold text-[var(--text-secondary)]">Anomaly:</span> &ldquo;{al.reason}&rdquo;</p>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1">Rule Triggered: <span className="font-mono text-[var(--text-primary)]">{al.type}</span></p>
            </div>

            <div className="border-t border-[var(--border-color)] pt-2.5 mt-2 flex justify-between items-center text-[10px]">
              <span className="text-[var(--text-secondary)]">Status: <span className={`font-bold ${al.resolved ? 'text-emerald-500' : 'text-amber-500'}`}>{al.resolved ? 'Acknowledged' : 'Unresolved'}</span></span>
              {!al.resolved && (
                <button
                  onClick={() => handleAcknowledgeAlert(al.id)}
                  className="bg-[var(--bg-card)] hover:bg-[var(--bg-inner)] text-[var(--text-primary)] font-bold px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider transition active:scale-97 border border-[var(--border-color)] cursor-pointer"
                >
                  Resolve Alert
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredAlerts.length === 0 && (
          <p className="col-span-2 text-center text-xs text-[var(--text-secondary)] italic py-6">No clinical alerts matching this filter.</p>
        )}
      </div>
    </div>
  );
}
