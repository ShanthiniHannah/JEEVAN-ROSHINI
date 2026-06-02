import React from 'react';
import { ClipboardList, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export default function EchrViewer({
  visibleIndividuals,
  revealedPii,
  toggleRevealPii,
  isLight,
  families = []
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
          <ClipboardList className="w-4 h-4 text-emerald-400" />
          Electronic Health Records
        </h3>
        <span className="text-[9px] bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800 text-slate-400 font-mono">
          Assigned: {visibleIndividuals.length}
        </span>
      </div>

      <div className="space-y-2">
        {visibleIndividuals.map(ind => {
          const isRevealed = !!revealedPii[ind.id];
          const displayPhone = isRevealed ? ind.phone : "• • • • • • " + (ind.phone && ind.phone !== 'N/A' ? ind.phone.slice(-4) : "—");
          
          const family = families.find(f => f.id === (ind.familyId || ind.family_id));
          const villageName = family ? (family.villageName || family.village?.name || "Unknown Village") : "Unknown Village";

          return (
            <div key={ind.id} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-3.5 flex flex-col justify-between hover:border-slate-650 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    {ind.name}
                  </h4>
                  
                  {/* ── PRIVACY CONTROLLED PII (Phone) ── */}
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-[9px] text-slate-400 font-mono">Phone: {displayPhone}</p>
                    {ind.phone && ind.phone !== 'N/A' && (
                      <button 
                        type="button"
                        onClick={() => toggleRevealPii(ind.id, ind.name)}
                        className="text-slate-500 hover:text-cyan-400 transition"
                        title="Reveal Phone Number"
                      >
                        {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    )}
                  </div>

                  {/* Consent Management Badge */}
                  <p className="text-[9.5px] text-slate-500 font-medium">
                    Health ID: <span className="font-mono text-indigo-400">{ind.id}</span> | Age: {ind.age} ({ind.gender})
                  </p>
                  <p className="text-[9.5px] text-slate-400 font-semibold mt-0.5">
                    Village: <span className="text-emerald-400 font-bold">{villageName}</span>
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  {/* Vulnerability Level Badge */}
                  <span className={`text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full font-black border ${
                    ind.vulnerabilityLevel === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/25 animate-pulse' :
                    ind.vulnerabilityLevel === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' :
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                  }`}>
                    Risk Score: {ind.vulnerabilityScore} ({ind.vulnerabilityLevel})
                  </span>
                  
                  {/* Consent Verified Badge */}
                  {ind.consentGiven ? (
                    <span className="bg-indigo-500/10 text-indigo-400 text-[8.5px] px-1.5 py-0.5 rounded border border-indigo-500/20 font-bold">
                      ✓ Consent ({ind.consentMethod})
                    </span>
                  ) : (
                    <span className="bg-amber-500/10 text-amber-400 text-[8.5px] px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                      ⚠ No Consent Captured
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 mt-2.5 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80 text-[9px]">
                <div>
                  <span className="text-slate-500">Blood Group:</span> <span className="text-slate-300 font-bold">{ind.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-slate-500">Diseases:</span> <span className="text-slate-300 font-bold truncate block">{Array.isArray(ind.chronicDiseases) ? (ind.chronicDiseases.length > 0 ? ind.chronicDiseases.join(', ') : 'None') : (ind.chronicDiseases || 'None')}</span>
                </div>
                <div>
                  <span className="text-slate-500">Pregnancy:</span> <span className="text-slate-300 font-bold">{ind.pregnancyStatus}</span>
                </div>
              </div>

              {ind.alerts?.map((al, index) => (
                <div key={index} className="bg-rose-950/20 border border-rose-900/40 text-[9px] text-rose-300 p-2 rounded-xl mt-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{al.reason}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
