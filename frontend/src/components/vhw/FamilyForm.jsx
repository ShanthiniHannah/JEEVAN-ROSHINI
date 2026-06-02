import React from 'react';
import { Users, ChevronRight, ChevronLeft, Save } from 'lucide-react';

export default function FamilyForm({
  familyStep,
  setFamilyStep,
  familyForm,
  setFamilyForm,
  visibleVillages,
  handleAddFamily
}) {
  return (
    <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-4 h-4 text-blue-400" />
          Family Registry
        </h3>
        <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded-full text-blue-300 font-bold">Step {familyStep} of 3</span>
      </div>

      {/* Step indicators */}
      <div className="flex gap-1 mb-4 h-1">
        <div className={`flex-1 rounded ${familyStep >= 1 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
        <div className={`flex-1 rounded ${familyStep >= 2 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
        <div className={`flex-1 rounded ${familyStep >= 3 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
      </div>

      <form onSubmit={handleAddFamily} className="space-y-3">
        {familyStep === 1 && (
          <div className="space-y-3 animate-fadeIn">
            <div>
              <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Assigned Village</label>
              <select 
                value={familyForm.villageId}
                onChange={(e) => setFamilyForm({ ...familyForm, villageId: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-2 text-xs text-white mt-1 focus:outline-none"
              >
                <option value="">-- Choose Village --</option>
                {visibleVillages.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">House / Block Number</label>
              <input 
                type="text" 
                value={familyForm.houseNo}
                onChange={(e) => setFamilyForm({ ...familyForm, houseNo: e.target.value })}
                placeholder="e.g. 102A"
                required
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none mt-1"
              />
            </div>

            <button 
              type="button" 
              onClick={() => { if (familyForm.villageId && familyForm.houseNo) setFamilyStep(2); }}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-xs flex justify-center items-center gap-1 mt-4"
            >
              Next Step <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {familyStep === 2 && (
          <div className="space-y-3 animate-fadeIn">
            <div>
              <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Economic Status</label>
              <select 
                value={familyForm.economicStatus}
                onChange={(e) => setFamilyForm({ ...familyForm, economicStatus: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-2 text-xs text-white mt-1 focus:outline-none"
              >
                <option value="BPL">BPL (Below Poverty Line)</option>
                <option value="APL">APL (Above Poverty Line)</option>
                <option value="Antyodaya">Antyodaya (Vulnerable Family)</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Occupation of Head</label>
              <input 
                type="text" 
                value={familyForm.occupation}
                onChange={(e) => setFamilyForm({ ...familyForm, occupation: e.target.value })}
                placeholder="e.g. Agricultural Laborer"
                required
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none mt-1"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button 
                type="button" 
                onClick={() => setFamilyStep(1)}
                className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold flex justify-center items-center gap-1 border border-slate-700"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button 
                type="button" 
                onClick={() => { if (familyForm.occupation) setFamilyStep(3); }}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-xs font-bold flex justify-center items-center gap-1"
              >
                Next Step <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {familyStep === 3 && (
          <div className="space-y-3 animate-fadeIn">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Drinking Water</label>
                <select 
                  value={familyForm.drinkingWater}
                  onChange={(e) => setFamilyForm({ ...familyForm, drinkingWater: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-2 text-xs text-white mt-1 focus:outline-none"
                >
                  <option value="Tap">Shared Tap</option>
                  <option value="Well">Open Well</option>
                  <option value="Handpump">Hand Pump</option>
                  <option value="River">Pond/River (Unsafe)</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Toilet Latrine</label>
                <select 
                  value={familyForm.toilet}
                  onChange={(e) => setFamilyForm({ ...familyForm, toilet: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-2 text-xs text-white mt-1 focus:outline-none"
                >
                  <option value="Yes">Yes (Sanitary)</option>
                  <option value="No">No (Defecates Open)</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[10px] space-y-1 mt-2">
              <p className="font-bold text-slate-400">Review Family Details:</p>
              <p><span className="text-slate-500">Village ID:</span> {familyForm.villageId}</p>
              <p><span className="text-slate-500">House No:</span> {familyForm.houseNo}</p>
              <p><span className="text-slate-500">Status:</span> {familyForm.economicStatus} ({familyForm.occupation})</p>
            </div>

            <div className="flex gap-2 mt-4">
              <button 
                type="button" 
                onClick={() => setFamilyStep(2)}
                className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold flex justify-center items-center gap-1 border border-slate-700"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl text-xs font-bold flex justify-center items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save Record
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
