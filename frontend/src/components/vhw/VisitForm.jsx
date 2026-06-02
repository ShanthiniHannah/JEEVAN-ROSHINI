import React from 'react';
import { ClipboardList, ChevronRight, ChevronLeft, Save } from 'lucide-react';

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
    <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
          <ClipboardList className="w-4 h-4 text-amber-400" />
          Visit Entry
        </h3>
        <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded-full text-amber-300 font-bold">Step {visitStep} of 2</span>
      </div>

      <div className="flex gap-1 mb-4 h-1">
        <div className={`flex-1 rounded ${visitStep >= 1 ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
        <div className={`flex-1 rounded ${visitStep >= 2 ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
      </div>

      <form onSubmit={handleAddVisit} className="space-y-3">
        {visitStep === 1 && (
          <div className="space-y-3 animate-fadeIn">
            <div>
              <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Select Mapped Family Unit</label>
              <select 
                value={visitForm.familyId}
                onChange={(e) => setVisitForm({ ...visitForm, familyId: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-2 text-xs text-white mt-1 focus:outline-none"
              >
                <option value="">-- Choose Family --</option>
                {visibleFamilies.map(f => (
                  <option key={f.id} value={f.id}>{f.id} ({f.village?.name || f.village_id || f.villageName || '—'})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Temp (°F)</label>
                <input 
                  type="text"
                  value={visitForm.tempDeg}
                  onChange={(e) => setVisitForm({ ...visitForm, tempDeg: e.target.value })}
                  placeholder="98.6"
                  required
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">BP Systolic</label>
                <input 
                  type="text"
                  value={visitForm.bpSys}
                  onChange={(e) => setVisitForm({ ...visitForm, bpSys: e.target.value })}
                  placeholder="120"
                  required
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">BP Diastolic</label>
                <input 
                  type="text"
                  value={visitForm.bpDia}
                  onChange={(e) => setVisitForm({ ...visitForm, bpDia: e.target.value })}
                  placeholder="80"
                  required
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                />
              </div>
            </div>

            <button 
              type="button"
              onClick={() => { if (visitForm.familyId && visitForm.tempDeg) setVisitStep(2); }}
              className="w-full bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex justify-center items-center gap-1 mt-4"
            >
              Next Step <ChevronRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>
        )}

        {visitStep === 2 && (
          <div className="space-y-3 animate-fadeIn">
            <div>
              <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Clinical Field Notes</label>
              <textarea 
                value={visitForm.notes}
                onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                placeholder="Enter details of medication compliance, pregnancy symptoms, NCD checks..."
                rows="3"
                required
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none mt-1"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">GPS Position</label>
                <span className="block text-[8.5px] text-emerald-400 font-mono mt-1 bg-slate-900 p-2 border border-slate-800 rounded-lg">
                  📍 {gpsCoords ? `${gpsCoords.lat}, ${gpsCoords.lng}` : 'Determining...'}
                </span>
              </div>
              <div>
                <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Next Follow-Up</label>
                <input 
                  type="date"
                  value={visitForm.followUpDate}
                  onChange={(e) => setVisitForm({ ...visitForm, followUpDate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button 
                type="button" 
                onClick={() => setVisitStep(1)}
                className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold flex justify-center items-center gap-1 border border-slate-700"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 py-2.5 rounded-xl text-xs font-black flex justify-center items-center gap-1.5 active:scale-[0.99]"
              >
                <Save className="w-3.5 h-3.5 text-slate-950" /> Log Visit
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
