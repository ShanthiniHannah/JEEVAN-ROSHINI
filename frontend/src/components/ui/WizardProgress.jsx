import React from 'react';

/**
 * WizardProgress — Step progress bar for wizard forms.
 *
 * @param {Object} props
 * @param {number} props.currentStep - 1-indexed current step
 * @param {number} props.totalSteps - Total number of steps in the form
 * @param {string[]} [props.stepLabels] - Optional labels for each step
 */
export function WizardProgress({ currentStep, totalSteps, stepLabels = [] }) {
  const percentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="w-full py-3">
      {/* Progress Track */}
      <div className="relative flex items-center justify-between">
        {/* Track Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--border-color)] rounded z-0">
          <div
            className="h-full bg-brand-500 rounded transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Step Circles */}
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum <= currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={idx} className="flex flex-col items-center relative z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 border ${
                  isCurrent
                    ? 'bg-brand-500 text-white border-brand-500 scale-110 shadow-lg shadow-brand-500/20'
                    : isActive
                    ? 'bg-[var(--bg-inner)] text-[var(--text-primary)] border-teal-500'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)]'
                }`}
              >
                {stepNum}
              </div>
              {stepLabels[idx] && (
                <span
                  className={`text-xs font-bold mt-1.5 uppercase tracking-wide transition-all ${
                    isCurrent ? 'text-brand-500' : isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {stepLabels[idx]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
