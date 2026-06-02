import React from 'react';
import { MapPin, Save } from 'lucide-react';

export default function VillageForm({
  villageForm,
  setVillageForm,
  handleAddVillage
}) {
  return (
    <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl">
      <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <MapPin className="w-4 h-4 text-indigo-400" />
        Socio-Demographic Report
      </h3>
      
      <form onSubmit={handleAddVillage} className="space-y-3">
        <div>
          <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Village Name</label>
          <input 
            type="text" 
            value={villageForm.name}
            onChange={(e) => setVillageForm({ ...villageForm, name: e.target.value })}
            placeholder="e.g. Gundya Village"
            required
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1"
          />
        </div>

        <div>
          <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Estimated Population</label>
          <input 
            type="number" 
            value={villageForm.population}
            onChange={(e) => setVillageForm({ ...villageForm, population: e.target.value })}
            placeholder="Total count"
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Sanitation Status</label>
            <select 
              value={villageForm.sanitationStatus}
              onChange={(e) => setVillageForm({ ...villageForm, sanitationStatus: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
            >
              <option value="Good">Good (ODF)</option>
              <option value="Moderate">Moderate</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Drinking Water</label>
            <select 
              value={villageForm.waterStatus}
              onChange={(e) => setVillageForm({ ...villageForm, waterStatus: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
            >
              <option value="Adequate">Adequate Well</option>
              <option value="Contaminated">Contaminated</option>
              <option value="Scarcity">Severe Scarcity</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 active:scale-[0.99]"
        >
          <Save className="w-3.5 h-3.5" />
          Submit Demographics
        </button>
      </form>
    </div>
  );
}
