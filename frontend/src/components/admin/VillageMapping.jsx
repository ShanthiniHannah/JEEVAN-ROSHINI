import React from 'react';
import { MapPin, Building, Activity, Plus } from 'lucide-react';

export default function VillageMapping({
  state,
  setShowAddVillageModal,
  showAddVillageModal,
  newVillageData,
  setNewVillageData,
  handleCreateVillage
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl">
        <div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Rural Sectors &amp; Geography mapping</h3>
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Assigned blocks, districts, and villages under trust management.</p>
        </div>
        <button
          onClick={() => setShowAddVillageModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-97 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Map Village
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* DISTRICTS CARD */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl">
          <h4 className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-3.5 flex items-center gap-1.5 border-b border-[var(--border-color)] pb-2">
            <Activity className="w-3.5 h-3.5" /> Mapped Districts (1)
          </h4>
          <div className="bg-[var(--bg-inner)] border border-[var(--border-color)] p-4 rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-extrabold text-[var(--text-primary)]">Chikkamagaluru</p>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">State: Karnataka</p>
            </div>
            <span className="text-[10px] bg-[var(--bg-card)] border border-[var(--border-color)] px-2 py-0.5 rounded text-indigo-500 dark:text-indigo-400 font-bold">HQ Office</span>
          </div>
        </div>

        {/* BLOCKS CARD */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl">
          <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3.5 flex items-center gap-1.5 border-b border-[var(--border-color)] pb-2">
            <Building className="w-3.5 h-3.5" /> Mapped Blocks (1)
          </h4>
          <div className="bg-[var(--bg-inner)] border border-[var(--border-color)] p-4 rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-extrabold text-[var(--text-primary)]">Chikkamagaluru Block</p>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">District ID: DST-01</p>
            </div>
            <span className="text-[10px] bg-[var(--bg-card)] border border-[var(--border-color)] px-2.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-bold">1 Scope</span>
          </div>
        </div>

        {/* VILLAGES CARD */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl">
          <h4 className="text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest mb-3.5 flex items-center gap-1.5 border-b border-[var(--border-color)] pb-2">
            <MapPin className="w-3.5 h-3.5" /> Registered Sectors ({state.villages.length})
          </h4>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {state.villages.map(v => (
              <div key={v.id} className="bg-[var(--bg-inner)] border border-[var(--border-color)] p-3.5 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-extrabold text-[var(--text-primary)]">{v.name}</p>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-mono">ID: {v.id} · Pop: {v.population}</p>
                </div>
                <span className={`text-[8.5px] uppercase tracking-wider px-2 py-0.5 rounded font-black border ${
                  v.risk_status === 'High' || v.riskStatus === 'High' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                  v.risk_status === 'Medium' || v.riskStatus === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                  'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                }`}>{v.risk_status || v.riskStatus || 'Low'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADD VILLAGE MODAL */}
      {showAddVillageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl relative">
            <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-500" />
              Map Demographics
            </h4>
            <form onSubmit={handleCreateVillage} className="space-y-3.5 text-xs text-[var(--text-secondary)]">
              <div>
                <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wide">Village Name</label>
                <input
                  type="text"
                  value={newVillageData.name}
                  onChange={(e) => setNewVillageData({ ...newVillageData, name: e.target.value })}
                  placeholder="e.g. Mudigere Village"
                  required
                  className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 mt-1 text-[var(--text-primary)] focus:outline-none focus:border-indigo-500 placeholder:text-[var(--text-secondary)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wide">Population</label>
                  <input
                    type="number"
                    value={newVillageData.population}
                    onChange={(e) => setNewVillageData({ ...newVillageData, population: e.target.value })}
                    placeholder="Estimated count"
                    required
                    className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 mt-1 text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wide">Taluk Block</label>
                  <input
                    type="text"
                    value={newVillageData.block}
                    disabled
                    className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 mt-1 text-[var(--text-secondary)] cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wide">Water Status</label>
                  <select
                    value={newVillageData.waterStatus}
                    onChange={(e) => setNewVillageData({ ...newVillageData, waterStatus: e.target.value })}
                    className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-2 py-2 mt-1 text-[var(--text-primary)] focus:outline-none"
                  >
                    <option value="Adequate">Adequate Well</option>
                    <option value="Contaminated">Contaminated</option>
                    <option value="Scarcity">Severe Scarcity</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wide">Sanitation Status</label>
                  <select
                    value={newVillageData.sanitationStatus}
                    onChange={(e) => setNewVillageData({ ...newVillageData, sanitationStatus: e.target.value })}
                    className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-2 py-2 mt-1 text-[var(--text-primary)] focus:outline-none"
                  >
                    <option value="Good">Good (ODF)</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddVillageModal(false)}
                  className="flex-1 bg-[var(--bg-inner)] hover:opacity-80 text-[var(--text-primary)] py-2.5 rounded-xl text-xs font-bold border border-[var(--border-color)] active:scale-97 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold active:scale-97 transition"
                >
                  Save Sector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
