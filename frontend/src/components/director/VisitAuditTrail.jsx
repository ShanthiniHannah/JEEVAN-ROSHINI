import React from 'react';
import { MapPin } from 'lucide-react';

export default function VisitAuditTrail({
  state
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-400" /> Real-time GPS Field Visit Audit logs
        </h3>
        <span className="text-[10px] text-slate-400">Chronological list of registered house visits</span>
      </div>

      <div className="space-y-3.5">
        {state.visits.map(visit => (
          <div key={visit.id} className="border border-slate-800 rounded-xl p-4 bg-slate-950/20 hover:border-slate-700 transition">
            <div className="flex flex-row justify-between items-start gap-2">
              <div>
                <h4 className="text-xs font-bold text-slate-200">{visit.vhwName}</h4>
                <p className="text-[10.5px] text-slate-400 mt-1">Visited Family: <span className="font-bold text-indigo-400">{visit.familyId}</span> on {visit.date}</p>
              </div>
              <span className="text-[9px] bg-slate-800 border border-slate-750 px-2 py-0.5 rounded-full font-mono text-cyan-400">📍 {visit.gps}</span>
            </div>
            
            <div className="mt-2.5 bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] leading-relaxed text-slate-300">
              <span className="font-bold text-slate-500">Visit Notes:</span> "{visit.notes}"
            </div>

            <div className="flex items-center gap-4 mt-2 text-[9px] text-slate-500 font-mono">
              <span>Temp: {visit.tempDeg}°F</span>
              <span>BP: {visit.bpSys}/{visit.bpDia} mmHg</span>
              {visit.followUpDate && <span className="text-amber-400">Next checkup scheduled: {visit.followUpDate}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
