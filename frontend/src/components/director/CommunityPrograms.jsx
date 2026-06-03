import React from 'react';
import { Heart } from 'lucide-react';

export default function CommunityPrograms({
  programFilter,
  setProgramFilter,
  filteredPrograms
}) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-[var(--border-color)] pb-3">
        <div>
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-500" /> Weekly Awareness Activities
          </h3>
          <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Community programs conducted by VHWs in mapped villages</p>
        </div>
        <div className="flex gap-2 text-xs">
          {['all', 'hygiene', 'nutrition', 'tobacco'].map(cat => (
            <button key={cat} onClick={() => setProgramFilter(cat)}
              className={`px-3 py-1.5 rounded-lg border font-bold transition cursor-pointer ${
                programFilter === cat ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-[var(--bg-inner)] border-[var(--border-color)] text-[var(--text-secondary)]'
              }`}>
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrograms.map(prog => (
          <div key={prog.id} className="border border-[var(--border-color)] p-4 rounded-xl bg-[var(--bg-inner)] space-y-2 flex flex-col justify-between hover:border-[var(--text-secondary)]/40 transition">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{prog.topic}</span>
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">{prog.date}</span>
              </div>
              <h4 className="text-xs font-bold text-[var(--text-primary)] mt-2">Village sector: {prog.villageName}</h4>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed"><span className="font-bold text-[var(--text-secondary)]">Outcome:</span> &ldquo;{prog.outcome}&rdquo;</p>
            </div>
            <div className="flex justify-between items-center border-t border-[var(--border-color)] pt-2 mt-2 text-[10px]">
              <span className="text-[var(--text-secondary)]">Participants: <span className="font-bold text-[var(--text-primary)]">{prog.participants}</span></span>
              <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full ${prog.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                {prog.status || 'Approved'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
