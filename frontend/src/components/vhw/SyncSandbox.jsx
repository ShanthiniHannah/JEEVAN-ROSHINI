import React from 'react';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

export default function SyncSandbox({
  isOnline,
  setIsOnline,
  offlineQueue,
  runOfflineSyncSimulation,
  isSimulatingSync,
  syncLogs
}) {
  return (
    <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-700/60 pb-2">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
          <RefreshCw className="w-4 h-4 text-indigo-400" />
          Sync Debugger & Sandbox
        </h3>
        <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-300 font-bold">Local Sync Client</span>
      </div>

      <div className="space-y-3">
        {/* Network Connectivity Switcher */}
        <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <div>
            <h4 className="text-[11px] font-bold text-white">Network Status</h4>
            <p className="text-[9px] text-slate-400">Enables/disables central cloud sync</p>
          </div>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </button>
        </div>

        {/* Queue Status summary */}
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <h4 className="text-[11px] font-bold text-white mb-2">Local Sync Queue ({offlineQueue.length} items)</h4>
          
          {offlineQueue.length > 0 ? (
            <div className="space-y-1.5 max-h-28 overflow-y-auto">
              {offlineQueue.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[9px] bg-slate-950 p-2 rounded-lg border border-slate-900 font-mono">
                  <span className="text-slate-300">[{item.type.toUpperCase()}] ID: {item.data.id || 'N/A'}</span>
                  <span className="text-amber-400 font-bold">Pending Sync</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-slate-500 italic py-2 text-center">Local queue is clean. Ready to capture offline field data.</p>
          )}
        </div>

        {/* Sync Actions */}
        <button
          onClick={runOfflineSyncSimulation}
          disabled={isSimulatingSync || offlineQueue.length === 0 || !isOnline}
          className={`w-full py-2.5 rounded-xl font-bold text-xs flex justify-center items-center gap-1.5 ${
            isSimulatingSync || offlineQueue.length === 0 || !isOnline
              ? 'bg-slate-800 text-slate-500 border border-slate-750 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg active:scale-[0.99]'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingSync ? 'animate-spin' : ''}`} />
          Run Central Sync Pipeline
        </button>

        {/* Log Console Output */}
        {syncLogs.length > 0 && (
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-3 font-mono text-[9px] text-slate-300 space-y-1 max-h-40 overflow-y-auto">
            <p className="text-slate-500 border-b border-slate-900 pb-1 mb-1 font-bold">Sync Console Log Output:</p>
            {syncLogs.map((log, idx) => (
              <p key={idx} className={log.includes('Warning') ? 'text-amber-400' : log.includes('✅') || log.includes('🎉') ? 'text-emerald-400' : 'text-slate-300'}>
                {log}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
