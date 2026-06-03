import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * RevealEye — Privacy-controlled data viewer that masks values
 * and enforces audit logging prior to disclosure.
 *
 * @param {Object} props
 * @param {string} props.value - The sensitive value to mask
 * @param {function} props.onRevealToggle - Callback to toggle visibility (triggers audit log on open)
 * @param {boolean} props.isRevealed - Whether the value is currently revealed
 */
export function RevealEye({ value, onRevealToggle, isRevealed }) {
  if (!value || value === 'N/A') return <span className="text-slate-500">—</span>;

  // Masking format: • • • • • • last 4 digits
  const maskedValue = "• • • • • • " + (value.length > 4 ? value.slice(-4) : value);

  return (
    <div className="inline-flex items-center gap-1.5 font-mono text-xs">
      <span className={isRevealed ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)]'}>
        {isRevealed ? value : maskedValue}
      </span>
      <button
        type="button"
        onClick={onRevealToggle}
        className="text-[var(--text-secondary)] hover:text-brand-500 focus:outline-none transition duration-150 p-0.5 rounded cursor-pointer"
        title={isRevealed ? "Hide sensitive details" : "Reveal details (audit logged)"}
      >
        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
