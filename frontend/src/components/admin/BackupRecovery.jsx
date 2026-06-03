import React from 'react';
import { Database, Plus } from 'lucide-react';

export default function BackupRecovery({
  backupSchedule,
  drLogs,
  isBackingUp,
  handleBackupSimulate
}) {
  return (
    <div className="space-y-6 text-xs">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
          <Database className="w-4 h-4 text-emerald-500 animate-pulse" />
          Central Database Snapshots &amp; Disaster Recovery Console
        </h3>
        <p className="text-[10.5px] text-[var(--text-secondary)] mb-4">Run manual backups or scheduled disaster recovery cycles. Central database encrypted using AES-256 blocks.</p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--bg-inner)] p-4 border border-[var(--border-color)] rounded-xl">
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-[var(--text-primary)]">Central Snapshot Pipeline</h4>
            <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Safeguards both registries and vitals history logs.</p>
          </div>
          <button
            onClick={handleBackupSimulate}
            disabled={isBackingUp}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
              isBackingUp
                ? 'bg-[var(--bg-inner)] text-[var(--text-secondary)] cursor-not-allowed border border-[var(--border-color)]'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-97 shadow-lg'
            }`}
          >
            <Plus className="w-4 h-4" /> {isBackingUp ? 'Compiling Snapshot Blocks...' : 'Run Backup Snapshot'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BACKUP SCHEDULES */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl space-y-3">
          <h4 className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px] border-b border-[var(--border-color)] pb-2">Active Backup Targets</h4>
          <div className="space-y-2">
            {backupSchedule.map((b, idx) => (
              <div key={idx} className="bg-[var(--bg-inner)] border border-[var(--border-color)] p-3.5 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-extrabold text-[var(--text-primary)]">{b.type}</p>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-mono">Interval: {b.interval} · Target: {b.target}</p>
                </div>
                <span className="text-[10px] bg-[var(--bg-card)] border border-[var(--border-color)] px-2 py-0.5 rounded text-indigo-500 dark:text-indigo-400 font-bold">{b.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECOVERY LOGS */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl space-y-3">
          <h4 className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px] border-b border-[var(--border-color)] pb-2 flex justify-between items-center">
            <span>Disaster Recovery Stream Logs</span>
            <span className="font-mono text-cyan-500 dark:text-cyan-400 uppercase tracking-widest text-[8px] bg-[var(--bg-inner)] px-1.5 py-0.5 rounded border border-[var(--border-color)]">Stream active</span>
          </h4>
          <div className="bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl p-3.5 font-mono text-[9.5px] text-[var(--text-secondary)] space-y-1.5 max-h-52 overflow-y-auto">
            {drLogs.map((log, idx) => (
              <p key={idx} className={log.includes('[Success]') || log.includes('[Completed]') ? 'text-emerald-500 dark:text-emerald-400' : 'text-[var(--text-secondary)]'}>{log}</p>
            ))}
            {drLogs.length === 0 && <p className="text-[var(--text-secondary)] italic">Disaster recovery pipeline is idle.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
