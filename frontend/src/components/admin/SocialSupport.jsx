import React from 'react';
import { Heart } from 'lucide-react';

export default function SocialSupport({
  supportRecords
}) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4">
      <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
        <div>
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            Social Welfare &amp; Support Schemes mapping
          </h3>
          <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Welfare allocations, nutrition packs, and pension mapping for vulnerable families.</p>
        </div>
      </div>

      <div className="space-y-3.5">
        {supportRecords.map(sup => (
          <div key={sup.id} className="border border-[var(--border-color)] rounded-xl p-4 bg-[var(--bg-inner)] hover:border-[var(--text-secondary)]/40 transition text-xs">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-bold text-[var(--text-primary)]">Beneficiary: {sup.beneficiary}</h4>
                <p className="text-[10.5px] text-[var(--text-secondary)] mt-1">Scheme Program: <span className="font-semibold text-[var(--text-primary)]">{sup.scheme}</span> · Allocated: {sup.support}</p>
              </div>
              <span className="text-[9px] bg-[var(--bg-card)] border border-[var(--border-color)] px-2 py-0.5 rounded-full font-mono text-cyan-500 dark:text-cyan-400">Date: {sup.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
