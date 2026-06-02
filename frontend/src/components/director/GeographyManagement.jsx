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
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          Active State Boundaries & Jurisdictions
        </h3>
        <div className="divide-y divide-slate-800 bg-slate-950/20 rounded-xl border border-slate-800 overflow-hidden">
          {(state.states || []).map(s => (
            <div key={s.id} className="p-4 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-white">{s.name} <span className="text-[10px] text-slate-500 font-mono">({s.code})</span></p>
                <p className="text-slate-400 mt-1">Pincode Scope: {s.pinRange || '—'}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}>{s.status}</span>
            </div>
          ))}
          {(!state.states || state.states.length === 0) && (
            <p className="text-xs text-slate-500 italic p-4 text-center">No active states created. Karnataka is seeded.</p>
          )}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl h-fit">
        <h3 className="text-sm font-bold text-white mb-3">Add Territory (State)</h3>
        <form onSubmit={handleAddState} className="space-y-3.5 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">State Name</label>
            <input 
              type="text" 
              value={newState.name} 
              onChange={(e) => setNewState({ ...newState, name: e.target.value })} 
              placeholder="e.g. Tamil Nadu"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 mt-1 text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">State Code</label>
            <input 
              type="text" 
              value={newState.code} 
              onChange={(e) => setNewState({ ...newState, code: e.target.value })} 
              placeholder="e.g. TN"
              required
              maxLength="3"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 mt-1 text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Pincode Scope</label>
            <input 
              type="text" 
              value={newState.pinRange} 
              onChange={(e) => setNewState({ ...newState, pinRange: e.target.value })} 
              placeholder="e.g. 600000 - 649999"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 mt-1 text-white focus:outline-none"
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
