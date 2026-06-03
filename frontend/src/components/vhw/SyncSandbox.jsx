import React from 'react';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

/**
 * SyncSandbox — VHW Local Sync client sandbox debugger view.
 * Follows VHW rules: inputs text-base (16px), buttons h-12 (48px).
 */
export default function SyncSandbox({
  isOnline,
  setIsOnline,
  offlineQueue,
  runOfflineSyncSimulation,
  isSimulatingSync,
  syncLogs
}) {
  return (
    <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
          <RefreshCw className="w-4 h-4 text-indigo-400" />
          Sync Debugger
        </h3>
        <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-300 font-bold uppercase tracking-wider">Local Client</span>
      </div>

      <div className="space-y-4">
        {/* Network Connectivity Switcher */}
        <div className="flex justify-between items-center bg-slate-950 p-3.5 rounded-xl border border-slate-850">
          <div>
            <h4 className="text-xs font-bold text-white leading-tight">Network Pipeline</h4>
            <p className="text-[9px] text-slate-500 font-medium mt-0.5">Enables central cloud syncing</p>
          </div>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`h-10 px-3.5 rounded-lg text-xs font-black transition duration-200 cursor-pointer flex items-center gap-1.5 ${
              isOnline ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/25' : 'bg-rose-500/10 text-rose-455 border border-rose-500/25'
            }`}
          >
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </button>
        </div>

        {/* Queue Status summary */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-2">
          <h4 className="text-xs font-bold text-slate-350 tracking-tight">Local Sync Queue ({offlineQueue.length} items)</h4>
          
          {offlineQueue.length > 0 ? (
            <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
              {offlineQueue.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10px] bg-slate-900 p-2.5 rounded-xl border border-slate-800/80 font-mono">
                  <span className="text-slate-300 font-bold">[{item.type.toUpperCase()}] ID: {item.data.id || 'N/A'}</span>
                  <span className="text-[#f59e0b] font-black uppercase tracking-wider text-[8px] animate-pulse">Queued</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-slate-500 italic py-3 text-center">Local queue is clean. Offline client ready.</p>
          )}
        </div>

        {/* Sync Actions */}
        <button
          onClick={runOfflineSyncSimulation}
          disabled={isSimulatingSync || offlineQueue.length === 0 || !isOnline}
          className={`w-full h-12 rounded-xl text-xs font-black uppercase tracking-wider flex justify-center items-center gap-2 cursor-pointer transition duration-200 ${
            isSimulatingSync || offlineQueue.length === 0 || !isOnline
              ? 'bg-slate-850 border border-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-98'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isSimulatingSync ? 'animate-spin' : ''}`} />
          Run Central Sync Pipeline
        </button>

        {/* Log Console Output */}
        {syncLogs.length > 0 && (
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 font-mono text-[9.5px] text-slate-350 space-y-1 max-h-40 overflow-y-auto">
            <p className="text-slate-500 border-b border-slate-900 pb-1 mb-1.5 font-bold uppercase text-[8px] tracking-wider">Sync pipeline trace logs:</p>
            {syncLogs.map((log, idx) => (
              <p key={idx} className={log.includes('Warning') ? 'text-amber-400' : log.includes('[Success]') || log.includes('[Completed]') ? 'text-emerald-450' : 'text-slate-400'}>
                {log}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
