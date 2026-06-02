import React from 'react';
import { Heart } from 'lucide-react';

export default function CommunityPrograms({
  programFilter,
  setProgramFilter,
  filteredPrograms
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-400" /> Weekly Awareness Activities
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Community programs conducted by VHWs in mapped villages</p>
        </div>
        <div className="flex gap-2 text-xs">
          {['all', 'hygiene', 'nutrition', 'tobacco'].map(cat => (
            <button key={cat} onClick={() => setProgramFilter(cat)}
              className={`px-3 py-1.5 rounded-lg border font-bold transition ${
                programFilter === cat ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrograms.map(prog => (
          <div key={prog.id} className="border border-slate-800 p-4 rounded-xl bg-slate-950/20 space-y-2 flex flex-col justify-between hover:border-slate-700 transition">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{prog.topic}</span>
                <span className="text-[10px] font-mono text-slate-500">{prog.date}</span>
              </div>
              <h4 className="text-xs font-bold text-white mt-2">Village sector: {prog.villageName}</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed"><span className="font-bold text-slate-500">Outcome:</span> "{prog.outcome}"</p>
            </div>
            <div className="flex justify-between items-center border-t border-slate-800/80 pt-2 mt-2 text-[10px]">
              <span className="text-slate-500">Participants: <span className="font-bold text-slate-300">{prog.participants}</span></span>
              <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-full ${prog.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {prog.status || 'Approved'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
