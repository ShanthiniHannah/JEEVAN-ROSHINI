import React from 'react';
import { Users, Save } from 'lucide-react';

export default function ProgramForm({
  programForm,
  setProgramForm,
  visibleVillages,
  handleAddProgram
}) {
  return (
    <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl">
      <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Users className="w-4 h-4 text-emerald-400" />
        Awareness Campaign Logger
      </h3>

      <form onSubmit={handleAddProgram} className="space-y-3">
        <div>
          <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Select Target Village</label>
          <select 
            value={programForm.villageId}
            onChange={(e) => setProgramForm({ ...programForm, villageId: e.target.value })}
            required
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-2 text-xs text-white mt-1"
          >
            <option value="">-- Choose Village --</option>
            {visibleVillages.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Program Topic</label>
          <select 
            value={programForm.topic}
            onChange={(e) => setProgramForm({ ...programForm, topic: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1"
          >
            <option value="Menstrual Hygiene">Menstrual Hygiene Awareness</option>
            <option value="Nutrition Education">Nutrition & Anemia prevention</option>
            <option value="Tobacco Prevention">Tobacco / Substance De-addiction</option>
            <option value="Child Nutrition under-5">Under-5 Child Care & Immunization</option>
            <option value="Geriatric Support">Elderly Care & Support Group</option>
          </select>
        </div>

        <div>
          <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Participants Count</label>
          <input 
            type="number"
            value={programForm.participants}
            onChange={(e) => setProgramForm({ ...programForm, participants: e.target.value })}
            placeholder="Total attended"
            required
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1"
          />
        </div>

        <div>
          <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Outcome Summary</label>
          <textarea 
            value={programForm.outcome}
            onChange={(e) => setProgramForm({ ...programForm, outcome: e.target.value })}
            placeholder="Summarize community feedback..."
            rows="3"
            required
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1"
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 active:scale-[0.99]"
        >
          <Save className="w-3.5 h-3.5" />
          Submit Activity Report
        </button>
      </form>
    </div>
  );
}
