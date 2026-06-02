import React from 'react';
import { Activity } from 'lucide-react';

export default function AuditLogs({
  filteredAuditLogs
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-500" />
            Central Auditing & Activity Ledger
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Chronological system logs capturing data updates, security access, and state revisions.</p>
        </div>
      </div>

      <div className="space-y-3.5">
        {filteredAuditLogs.map(log => (
          <div key={log.id} className="border border-slate-800 p-4 rounded-xl bg-slate-950/20 hover:border-slate-700 transition text-xs">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-bold text-slate-200">{log.user}</h4>
                <p className="text-[10.5px] text-slate-400 mt-1">Action: <span className="font-semibold text-slate-350">{log.action}</span> · Description: <span className="italic">"{log.desc}"</span></p>
                {log.oldValue && (
                  <p className="text-[9.5px] text-slate-500 mt-1">
                    Change: <span className="text-slate-400">{log.oldValue}</span> → <span className="text-emerald-400">{log.newValue}</span>
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="text-[9px] bg-slate-850 px-2 py-0.5 rounded-full font-mono text-cyan-400 block">{log.ip}</span>
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">{log.time}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredAuditLogs.length === 0 && (
          <p className="text-center text-xs text-slate-500 italic py-6">No audit records generated.</p>
        )}
      </div>
    </div>
  );
}
