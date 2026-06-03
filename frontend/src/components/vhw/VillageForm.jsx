import React from 'react';
import { MapPin, Save } from 'lucide-react';

/**
 * VillageForm — Socio-demographic reporting form.
 * Follows VHW rules: inputs text-base (16px), buttons h-12 (48px).
 */
export default function VillageForm({
  villageForm,
  setVillageForm,
  handleAddVillage
}) {
  return (
    <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-4">
      <div className="flex items-center pb-2 border-b border-slate-800">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-indigo-400" />
          Socio-Demographic Report
        </h3>
      </div>
      
      <form onSubmit={handleAddVillage} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Village Name</label>
          <input 
            type="text" 
            value={villageForm.name}
            onChange={(e) => setVillageForm({ ...villageForm, name: e.target.value })}
            placeholder="e.g. Gundya Village"
            required
            className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9] placeholder:text-slate-600"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Estimated Population</label>
          <input 
            type="number" 
            value={villageForm.population}
            onChange={(e) => setVillageForm({ ...villageForm, population: e.target.value })}
            placeholder="Total count"
            className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9] placeholder:text-slate-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Sanitation Status</label>
            <select 
              value={villageForm.sanitationStatus}
              onChange={(e) => setVillageForm({ ...villageForm, sanitationStatus: e.target.value })}
              className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
            >
              <option value="Good" className="bg-slate-950">Good (ODF)</option>
              <option value="Moderate" className="bg-slate-950">Moderate</option>
              <option value="Poor" className="bg-slate-950">Poor</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Drinking Water</label>
            <select 
              value={villageForm.waterStatus}
              onChange={(e) => setVillageForm({ ...villageForm, waterStatus: e.target.value })}
              className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
            >
              <option value="Adequate" className="bg-slate-950">Adequate Well</option>
              <option value="Contaminated" className="bg-slate-950">Contaminated</option>
              <option value="Scarcity" className="bg-slate-950">Severe Scarcity</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full h-12 bg-[#0ea5e9] hover:bg-[#0284c7] text-slate-950 font-black rounded-xl text-xs flex justify-center items-center gap-1.5 shadow-md active:scale-98 transition duration-200 cursor-pointer mt-4"
        >
          <Save className="w-4 h-4 text-slate-950" />
          Submit Demographics
        </button>
      </form>
    </div>
  );
}
