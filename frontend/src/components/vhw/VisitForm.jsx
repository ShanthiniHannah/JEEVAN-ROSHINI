import React from 'react';
import { ClipboardList, ChevronRight, ChevronLeft, Save, MapPin } from 'lucide-react';
import { WizardProgress } from '../ui/WizardProgress';

/**
 * VisitForm — PWA step-by-step form wizard for entering home visit details.
 * Follows VHW rules: inputs text-base (16px), buttons h-12 (48px).
 */
export default function VisitForm({
  visitStep,
  setVisitStep,
  visitForm,
  setVisitForm,
  visibleFamilies,
  gpsCoords,
  handleAddVisit
}) {
  return (
    <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
          <ClipboardList className="w-4 h-4 text-[#f59e0b]" />
          Visit Entry
        </h3>
        <span className="text-[10px] bg-slate-950 px-2.5 py-0.5 rounded-full text-[#f59e0b] border border-[#f59e0b]/20 font-bold">
          Step {visitStep} of 2
        </span>
      </div>

      {/* Progress wizard */}
      <WizardProgress currentStep={visitStep} totalSteps={2} stepLabels={['Vitals', 'Diagnostics']} />

      <form onSubmit={handleAddVisit} className="space-y-4 pt-2">
        {visitStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Select Mapped Family Unit */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Select Mapped Family Unit</label>
              <select 
                value={visitForm.familyId}
                onChange={(e) => setVisitForm({ ...visitForm, familyId: e.target.value })}
                required
                className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
              >
                <option value="" className="bg-slate-950">-- Choose Family --</option>
                {visibleFamilies.map(f => (
                  <option key={f.id} value={f.id} className="bg-slate-950">
                    {f.id} ({f.village?.name || f.village_id || f.villageName || '—'})
                  </option>
                ))}
              </select>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Temp (°F)</label>
                <input 
                  type="text"
                  value={visitForm.tempDeg}
                  onChange={(e) => setVisitForm({ ...visitForm, tempDeg: e.target.value })}
                  placeholder="98.6"
                  required
                  className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9] placeholder:text-slate-655"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">BP Sys</label>
                <input 
                  type="text"
                  value={visitForm.bpSys}
                  onChange={(e) => setVisitForm({ ...visitForm, bpSys: e.target.value })}
                  placeholder="120"
                  required
                  className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9] placeholder:text-slate-655"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">BP Dia</label>
                <input 
                  type="text"
                  value={visitForm.bpDia}
                  onChange={(e) => setVisitForm({ ...visitForm, bpDia: e.target.value })}
                  placeholder="80"
                  required
                  className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9] placeholder:text-slate-655"
                />
              </div>
            </div>

            <button 
              type="button"
              onClick={() => { if (visitForm.familyId && visitForm.tempDeg) setVisitStep(2); }}
              className="w-full h-12 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black rounded-xl text-sm flex justify-center items-center gap-1.5 shadow-md shadow-[#f59e0b]/10 transition duration-200 cursor-pointer mt-4"
            >
              Next Step <ChevronRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        )}

        {visitStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Clinical Field Notes */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Clinical Field Notes</label>
              <textarea 
                value={visitForm.notes}
                onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                placeholder="Enter details of medication compliance, pregnancy symptoms, NCD checks..."
                rows="3"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-base text-white focus:outline-none focus:border-[#0ea5e9] placeholder:text-slate-600"
              ></textarea>
            </div>

            {/* GPS & Follow-Up Date */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">GPS Position</label>
                <span className="block h-12 text-[10px] text-emerald-400 font-mono flex items-center justify-center bg-slate-950 border border-slate-800 rounded-xl px-2 gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {gpsCoords ? `${gpsCoords.lat}, ${gpsCoords.lng}` : 'Determining...'}
                </span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Next Follow-Up</label>
                <input 
                  type="date"
                  value={visitForm.followUpDate}
                  onChange={(e) => setVisitForm({ ...visitForm, followUpDate: e.target.value })}
                  className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>
            </div>

            <div className="flex gap-2.5 mt-4">
              <button 
                type="button" 
                onClick={() => setVisitStep(1)}
                className="flex-1 h-12 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-300 rounded-xl text-xs font-bold flex justify-center items-center gap-1 transition duration-200 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button 
                type="submit" 
                className="flex-1 h-12 bg-gradient-to-r from-[#f59e0b] to-yellow-500 hover:from-[#d97706] hover:to-yellow-600 text-slate-950 font-black rounded-xl text-xs flex justify-center items-center gap-1.5 shadow-md transition duration-200 cursor-pointer"
              >
                <Save className="w-4 h-4 text-slate-950" /> Log Visit
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
