import React from 'react';
import { Users, Save } from 'lucide-react';

/**
 * ProgramForm — awareness campaign reporting form.
 * Follows VHW rules: inputs text-base (16px), buttons h-12 (48px).
 */
export default function ProgramForm({
  programForm,
  setProgramForm,
  visibleVillages,
  handleAddProgram
}) {
  return (
    <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-4">
      <div className="flex items-center pb-2 border-b border-slate-800">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-4 h-4 text-emerald-455" />
          Awareness Campaign Logger
        </h3>
      </div>

      <form onSubmit={handleAddProgram} className="space-y-4">
        {/* Village Selection */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Select Target Village</label>
          <select 
            value={programForm.villageId}
            onChange={(e) => setProgramForm({ ...programForm, villageId: e.target.value })}
            required
            className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
          >
            <option value="" className="bg-slate-950">-- Choose Village --</option>
            {visibleVillages.map(v => (
              <option key={v.id} value={v.id} className="bg-slate-950">{v.name}</option>
            ))}
          </select>
        </div>

        {/* Program Topic */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Program Topic</label>
          <select 
            value={programForm.topic}
            onChange={(e) => setProgramForm({ ...programForm, topic: e.target.value })}
            className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
          >
            <option value="Menstrual Hygiene" className="bg-slate-950">Menstrual Hygiene Awareness</option>
            <option value="Nutrition Education" className="bg-slate-950">Nutrition &amp; Anemia Prevention</option>
            <option value="Tobacco Prevention" className="bg-slate-950">Tobacco / Substance De-addiction</option>
            <option value="Child Nutrition under-5" className="bg-slate-950">Under-5 Child Care &amp; Immunization</option>
            <option value="Geriatric Support" className="bg-slate-950">Geriatric Support Group</option>
          </select>
        </div>

        {/* Participants */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Participants Count</label>
          <input 
            type="number"
            value={programForm.participants}
            onChange={(e) => setProgramForm({ ...programForm, participants: e.target.value })}
            placeholder="Total attended"
            required
            className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9] placeholder:text-slate-600"
          />
        </div>

        {/* Outcome Summary */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Outcome Summary</label>
          <textarea 
            value={programForm.outcome}
            onChange={(e) => setProgramForm({ ...programForm, outcome: e.target.value })}
            placeholder="Summarize community feedback..."
            rows="3"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-base text-white focus:outline-none focus:border-[#0ea5e9] placeholder:text-slate-600"
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="w-full h-12 bg-[#22c55e] hover:bg-[#22c55e]/90 text-slate-950 font-black rounded-xl text-xs flex justify-center items-center gap-1.5 shadow-md active:scale-98 transition duration-200 cursor-pointer mt-4"
        >
          <Save className="w-4 h-4 text-slate-950" />
          Submit Activity Report
        </button>
      </form>
    </div>
  );
}
