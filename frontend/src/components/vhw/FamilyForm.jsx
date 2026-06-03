import React from 'react';
import { Users, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { WizardProgress } from '../ui/WizardProgress';

/**
 * FamilyForm — PWA step-by-step form wizard for registering families.
 * Follows VHW rules: mobile-first, inputs text-base (16px), buttons h-12 (48px).
 */
export default function FamilyForm({
  familyStep,
  setFamilyStep,
  familyForm,
  setFamilyForm,
  visibleVillages,
  handleAddFamily
}) {
  return (
    <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#0ea5e9]" />
          Family Registry
        </h3>
        <span className="text-[10px] bg-slate-950 px-2.5 py-0.5 rounded-full text-[#0ea5e9] border border-[#0ea5e9]/20 font-bold">
          Step {familyStep} of 3
        </span>
      </div>

      {/* Progress wizard */}
      <WizardProgress currentStep={familyStep} totalSteps={3} stepLabels={['Village', 'Details', 'Sanitation']} />

      <form onSubmit={handleAddFamily} className="space-y-4 pt-2">
        {familyStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Assigned Village</label>
              <select 
                value={familyForm.villageId}
                onChange={(e) => setFamilyForm({ ...familyForm, villageId: e.target.value })}
                required
                className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]/50"
              >
                <option value="">-- Choose Village --</option>
                {visibleVillages.map(v => (
                  <option key={v.id} value={v.id} className="bg-slate-950 text-white">{v.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">House / Block Number</label>
              <input 
                type="text" 
                value={familyForm.houseNo}
                onChange={(e) => setFamilyForm({ ...familyForm, houseNo: e.target.value })}
                placeholder="e.g. 102A"
                required
                className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]/50 placeholder:text-slate-600"
              />
            </div>

            <button 
              type="button" 
              onClick={() => { if (familyForm.villageId && familyForm.houseNo) setFamilyStep(2); }}
              className="w-full h-12 bg-[#0ea5e9] hover:bg-[#0284c7] text-slate-950 font-black rounded-xl text-sm flex justify-center items-center gap-1.5 shadow-md shadow-[#0ea5e9]/10 active:scale-98 transition duration-200 cursor-pointer mt-4"
            >
              Next Step <ChevronRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        )}

        {familyStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Economic Status</label>
              <select 
                value={familyForm.economicStatus}
                onChange={(e) => setFamilyForm({ ...familyForm, economicStatus: e.target.value })}
                className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
              >
                <option value="BPL" className="bg-slate-950">BPL (Below Poverty Line)</option>
                <option value="APL" className="bg-slate-950">APL (Above Poverty Line)</option>
                <option value="Antyodaya" className="bg-slate-950">Antyodaya (Vulnerable Family)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Occupation of Head</label>
              <input 
                type="text" 
                value={familyForm.occupation}
                onChange={(e) => setFamilyForm({ ...familyForm, occupation: e.target.value })}
                placeholder="e.g. Agricultural Laborer"
                required
                className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9] placeholder:text-slate-600"
              />
            </div>

            <div className="flex gap-2.5 mt-4">
              <button 
                type="button" 
                onClick={() => setFamilyStep(1)}
                className="flex-1 h-12 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-300 rounded-xl text-xs font-bold flex justify-center items-center gap-1 transition duration-200 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button 
                type="button" 
                onClick={() => { if (familyForm.occupation) setFamilyStep(3); }}
                className="flex-1 h-12 bg-[#0ea5e9] hover:bg-[#0284c7] text-slate-950 rounded-xl text-xs font-black flex justify-center items-center gap-1 transition duration-200 cursor-pointer"
              >
                Next Step <ChevronRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        )}

        {familyStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Drinking Water</label>
                <select 
                  value={familyForm.drinkingWater}
                  onChange={(e) => setFamilyForm({ ...familyForm, drinkingWater: e.target.value })}
                  className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
                >
                  <option value="Tap" className="bg-slate-950">Shared Tap</option>
                  <option value="Well" className="bg-slate-950">Open Well</option>
                  <option value="Handpump" className="bg-slate-950">Hand Pump</option>
                  <option value="River" className="bg-slate-950">Pond/River (Unsafe)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Toilet Latrine</label>
                <select 
                  value={familyForm.toilet}
                  onChange={(e) => setFamilyForm({ ...familyForm, toilet: e.target.value })}
                  className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
                >
                  <option value="Yes" className="bg-slate-950">Yes (Sanitary)</option>
                  <option value="No" className="bg-slate-950">No (Unsafe)</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl text-[10px] space-y-1 font-medium text-slate-400">
              <p className="font-bold text-[#0ea5e9] uppercase tracking-wider text-[9px] mb-1">Verify Registration:</p>
              <p><span className="text-slate-500">Village ID:</span> {familyForm.villageId}</p>
              <p><span className="text-slate-500">House No:</span> {familyForm.houseNo}</p>
              <p><span className="text-slate-500">Economic:</span> {familyForm.economicStatus} ({familyForm.occupation})</p>
            </div>

            <div className="flex gap-2.5 mt-4">
              <button 
                type="button" 
                onClick={() => setFamilyStep(2)}
                className="flex-1 h-12 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-300 rounded-xl text-xs font-bold flex justify-center items-center gap-1 transition duration-200 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button 
                type="submit" 
                className="flex-1 h-12 bg-gradient-to-r from-[#0ea5e9] to-[#14b8a6] hover:from-[#0284c7] hover:to-[#0d9488] text-slate-950 font-black rounded-xl text-xs flex justify-center items-center gap-1.5 shadow-md transition duration-200 cursor-pointer"
              >
                <Save className="w-4 h-4 text-slate-950" /> Save Record
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
