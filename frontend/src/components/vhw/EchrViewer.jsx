import React from 'react';
import { ClipboardList, AlertTriangle } from 'lucide-react';
import { RevealEye } from '../ui/RevealEye';
import { StatusBadge } from '../ui/StatusBadge';

/**
 * Helper to format ISO dates to a clean DD MMM YYYY string.
 * @param {string} dateStr - Raw ISO date string.
 * @returns {string} Formatted date.
 */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (e) {
    return dateStr;
  }
}

/**
 * EchrViewer — Electronic Health Records view inside the VHW phone PWA view.
 * Displays patient records with consistent layout and fixed sub-row heights.
 */
export function EchrViewer({
  visibleIndividuals,
  revealedPii,
  toggleRevealPii,
  families = [],
  visits = []
}) {
  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
        <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
          <ClipboardList className="w-4 h-4 text-emerald-500" />
          Electronic Health Records
        </h3>
        <span className="text-xs bg-[var(--bg-inner)] border border-[var(--border-color)] text-[var(--text-secondary)] font-bold px-2.5 py-0.5 rounded-full font-mono">
          {visibleIndividuals.length} records
        </span>
      </div>

      <div className="space-y-3 w-full">
        {visibleIndividuals.map(ind => {
          const isRevealed = !!revealedPii[ind.id];
          const family = families.find(f => f.id === (ind.familyId || ind.family_id));
          const villageName = family ? (family.villageName || family.village?.name || "Unknown Village") : "Unknown Village";

          // Find the last visit log for this individual's family/household
          const indVisits = visits?.filter(v => v.familyId === (ind.familyId || ind.family_id)) || [];
          const lastVisit = indVisits[indVisits.length - 1];

          return (
            <div 
              key={ind.id} 
              className="w-full min-h-[120px] bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-brand-500 rounded-2xl p-4 flex flex-col justify-between transition-colors duration-200 relative"
            >
              {/* Top row: Left text details, Right absolute badges */}
              <div className="flex justify-between items-start gap-2 relative">
                {/* Text details constrained to prevent badge overlap */}
                <div className="pr-[120px] space-y-1 w-full text-left">
                  <h4 className="text-xs font-black text-[var(--text-primary)] leading-tight truncate" title={ind.name}>
                    {ind.name}
                  </h4>
                  
                  {/* Masked Phone number */}
                  <div className="flex items-center gap-1.5 mt-1 overflow-hidden max-w-[160px] whitespace-nowrap text-ellipsis">
                    <span className="text-[10px] text-[var(--text-secondary)] font-black uppercase shrink-0">Phone:</span>
                    <div className="inline-block overflow-hidden text-ellipsis whitespace-nowrap max-w-[110px]">
                      <RevealEye 
                        value={ind.phone} 
                        isRevealed={isRevealed} 
                        onRevealToggle={() => toggleRevealPii(ind.id, ind.name)} 
                      />
                    </div>
                  </div>

                  {/* Health ID, Age, Gender */}
                  <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-semibold overflow-hidden text-ellipsis whitespace-nowrap max-w-[160px]">
                    ID: <span className="font-mono text-indigo-500 font-bold inline-block overflow-hidden text-ellipsis whitespace-nowrap max-w-[70px] align-bottom">{ind.id}</span> | {ind.age} ({ind.gender[0]})
                  </p>
                  
                  {/* Village details */}
                  <p className="text-[10px] text-[var(--text-secondary)] font-bold mt-0.5 truncate max-w-[160px]">
                    Village: <span className="text-teal-600 dark:text-teal-400">{villageName}</span>
                  </p>
                </div>

                {/* Pinned Absolute Badges in top-right */}
                <div className="absolute top-0 right-0 flex flex-col items-end gap-1 z-10 shrink-0 select-none">
                  {/* Vulnerability Status */}
                  <StatusBadge status={ind.vulnerabilityLevel || 'Low'} />
                  
                  {/* Score */}
                  <span className="text-[10px] text-[var(--text-secondary)] font-black tracking-wider uppercase font-mono">
                    Score: {ind.vulnerabilityScore || 0}
                  </span>

                  {/* Consent Status Badge (does not push details) */}
                  {ind.consentGiven ? (
                    <span className="bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-[10px] px-2 py-0.5 rounded border border-indigo-500/20 font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Consent
                    </span>
                  ) : (
                    <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] px-2 py-0.5 rounded border border-amber-500/20 font-black uppercase tracking-wider shrink-0 animate-pulse flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> No Consent
                    </span>
                  )}
                </div>
              </div>

              {/* Sub-info rows (Visit, Diagnosis, Notes) — Consistent fixed heights */}
              <div className="mt-3.5 space-y-1 bg-[var(--bg-inner)]/50 p-2.5 rounded-xl border border-[var(--border-color)]">
                {/* Visit Row */}
                <div className="h-8 flex items-center justify-between text-xs border-b border-[var(--border-color)] overflow-hidden">
                  <span className="text-[var(--text-secondary)] font-bold shrink-0">Visit:</span>
                  <span 
                    className="text-[var(--text-primary)] truncate font-medium text-right ml-2 max-w-[200px]" 
                    title={lastVisit ? `${formatDate(lastVisit.date)} (${lastVisit.bpSys}/${lastVisit.bpDia} BP)` : 'No logs'}
                  >
                    {lastVisit ? `${formatDate(lastVisit.date)} (${lastVisit.bpSys || 120}/${lastVisit.bpDia || 80} BP)` : 'No logs'}
                  </span>
                </div>

                {/* Diagnosis Row */}
                <div className="h-8 flex items-center justify-between text-xs border-b border-[var(--border-color)] overflow-hidden">
                  <span className="text-[var(--text-secondary)] font-bold shrink-0">Diagnosis:</span>
                  <span 
                    className="text-[var(--text-primary)] truncate font-medium text-right ml-2 max-w-[200px]"
                    title={ind.chronicDiseases && ind.chronicDiseases.length > 0 ? ind.chronicDiseases.join(', ') : 'Healthy'}
                  >
                    {ind.chronicDiseases && ind.chronicDiseases.length > 0 ? ind.chronicDiseases.join(', ') : 'Healthy'}
                  </span>
                </div>

                {/* Note Row */}
                <div className="h-8 flex items-center justify-between text-xs overflow-hidden">
                  <span className="text-[var(--text-secondary)] font-bold shrink-0">Note:</span>
                  <span 
                    className="text-[var(--text-primary)] truncate font-medium text-right ml-2 max-w-[200px] italic"
                    title={lastVisit ? lastVisit.notes : 'No observations recorded'}
                  >
                    {lastVisit ? lastVisit.notes : 'No observations recorded'}
                  </span>
                </div>
              </div>

              {/* Trigger Clinical Alerts */}
              {ind.alerts?.map((al, index) => (
                <div key={index} className="bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 p-2.5 rounded-xl mt-2 flex items-center gap-1.5 animate-fadeIn">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-semibold truncate">{al.reason}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EchrViewer;
