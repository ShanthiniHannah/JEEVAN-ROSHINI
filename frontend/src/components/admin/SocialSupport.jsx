import React from 'react';
import { Heart } from 'lucide-react';

export default function SocialSupport({
  supportRecords
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            Social Welfare & Support Schemes mapping
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Welfare allocations, nutrition packs, and pension mapping for vulnerable families.</p>
        </div>
      </div>

      <div className="space-y-3.5">
        {supportRecords.map(sup => (
          <div key={sup.id} className="border border-slate-800 rounded-xl p-4 bg-slate-950/20 hover:border-slate-700 transition text-xs">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-bold text-slate-200">Beneficiary: {sup.beneficiary}</h4>
                <p className="text-[10.5px] text-slate-400 mt-1">Scheme Program: <span className="font-semibold text-slate-350">{sup.scheme}</span> · Allocated: {sup.support}</p>
              </div>
              <span className="text-[9px] bg-slate-800 border border-slate-750 px-2 py-0.5 rounded-full font-mono text-cyan-400">Date: {sup.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
