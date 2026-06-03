import React from 'react';

/**
 * StatusBadge — Semantic, styling-consistent status pill.
 *
 * @param {Object} props
 * @param {string} props.status - Status name (e.g. Active, Approved, Submitted, Pending, Rejected, Critical, Low, Medium, High)
 * @param {string} [props.className] - Extra Tailwind classes
 */
export function StatusBadge({ status, className = '' }) {
  const normalized = (status || '').toLowerCase().trim();

  let styles = 'bg-slate-500/10 text-slate-400 border-slate-500/20';

  if (['active', 'approved', 'yes', 'adequate', 'good', 'low', 'normal'].includes(normalized)) {
    styles = 'bg-emerald-500/10 text-emerald-450 border-emerald-500/25';
  } else if (['pending', 'submitted', 'medium', 'partial'].includes(normalized)) {
    styles = 'bg-amber-500/10 text-amber-450 border-amber-500/25';
  } else if (['rejected', 'returned', 'no', 'critical', 'high', 'disabled', 'failed'].includes(normalized)) {
    styles = 'bg-rose-500/10 text-rose-450 border-rose-500/25';
  } else if (['streaming', 'online'].includes(normalized)) {
    styles = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${styles} ${className}`}
    >
      {status}
    </span>
  );
}
