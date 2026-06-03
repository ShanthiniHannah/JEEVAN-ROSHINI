import React from 'react';
import { Globe } from 'lucide-react';

export default function GeographyManagement({
  state,
  newState,
  setNewState,
  handleAddState
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-500" />
          Active State Boundaries &amp; Jurisdictions
        </h3>
        <div className="divide-y divide-[var(--border-color)] bg-[var(--bg-inner)] rounded-xl border border-[var(--border-color)] overflow-hidden">
          {(state.states || []).map(s => (
            <div key={s.id} className="p-4 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-[var(--text-primary)]">{s.name} <span className="text-[10px] text-[var(--text-secondary)] font-mono">({s.code})</span></p>
                <p className="text-[var(--text-secondary)] mt-1">Pincode Scope: {s.pinRange || '—'}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-[var(--bg-inner)] text-[var(--text-secondary)]'
              }`}>{s.status}</span>
            </div>
          ))}
          {(!state.states || state.states.length === 0) && (
            <p className="text-xs text-[var(--text-secondary)] italic p-4 text-center">No active states created. Karnataka is seeded.</p>
          )}
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl h-fit">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">Add Territory (State)</h3>
        <form onSubmit={handleAddState} className="space-y-3.5 text-xs">
          <div>
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">State Name</label>
            <input
              type="text"
              value={newState.name}
              onChange={(e) => setNewState({ ...newState, name: e.target.value })}
              placeholder="e.g. Tamil Nadu"
              required
              className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 mt-1 text-[var(--text-primary)] focus:outline-none placeholder:text-[var(--text-secondary)]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">State Code</label>
            <input
              type="text"
              value={newState.code}
              onChange={(e) => setNewState({ ...newState, code: e.target.value })}
              placeholder="e.g. TN"
              required
              maxLength="3"
              className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 mt-1 text-[var(--text-primary)] focus:outline-none placeholder:text-[var(--text-secondary)]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Pincode Scope</label>
            <input
              type="text"
              value={newState.pinRange}
              onChange={(e) => setNewState({ ...newState, pinRange: e.target.value })}
              placeholder="e.g. 600000 - 649999"
              className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 mt-1 text-[var(--text-primary)] focus:outline-none placeholder:text-[var(--text-secondary)]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 rounded-xl transition"
          >
            Register Territory
          </button>
        </form>
      </div>
    </div>
  );
}
