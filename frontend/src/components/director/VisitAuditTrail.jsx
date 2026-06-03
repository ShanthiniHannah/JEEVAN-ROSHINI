import React from 'react';
import { MapPin } from 'lucide-react';

export default function VisitAuditTrail({
  state
}) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4">
      <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
        <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" /> Real-time GPS Field Visit Audit logs
        </h3>
        <span className="text-[10px] text-[var(--text-secondary)]">Chronological list of registered house visits</span>
      </div>

      <div className="space-y-3.5">
        {state.visits.map(visit => (
          <div key={visit.id} className="border border-[var(--border-color)] rounded-xl p-4 bg-[var(--bg-inner)] hover:border-[var(--text-secondary)]/40 transition">
            <div className="flex flex-row justify-between items-start gap-2">
              <div>
                <h4 className="text-xs font-bold text-[var(--text-primary)]">{visit.vhwName}</h4>
                <p className="text-[10.5px] text-[var(--text-secondary)] mt-1">Visited Family: <span className="font-bold text-indigo-500">{visit.familyId}</span> on {visit.date}</p>
              </div>
              <span className="text-[9px] bg-[var(--bg-card)] border border-[var(--border-color)] px-2 py-0.5 rounded-full font-mono text-cyan-500 dark:text-cyan-400 flex items-center gap-1 shrink-0">
                <MapPin className="w-2.5 h-2.5" /> {visit.gps}
              </span>
            </div>

            <div className="mt-2.5 bg-[var(--bg-card)] p-2.5 rounded-lg border border-[var(--border-color)] text-[11px] leading-relaxed text-[var(--text-secondary)]">
              <span className="font-bold text-[var(--text-secondary)]">Visit Notes:</span> &ldquo;{visit.notes}&rdquo;
            </div>

            <div className="flex items-center gap-4 mt-2 text-[9px] text-[var(--text-secondary)] font-mono">
              <span>Temp: {visit.tempDeg}°F</span>
              <span>BP: {visit.bpSys}/{visit.bpDia} mmHg</span>
              {visit.followUpDate && <span className="text-amber-500">Next checkup scheduled: {visit.followUpDate}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
