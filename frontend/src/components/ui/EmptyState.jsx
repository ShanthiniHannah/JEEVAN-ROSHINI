import React from 'react';
import { Inbox } from 'lucide-react';

/**
 * EmptyState — Reusable empty state view with an optional call-to-action.
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.icon] - Icon component
 * @param {string} props.message - Descriptive text
 * @param {Object} [props.action] - Call to action configuration
 * @param {string} props.action.label - Action button text
 * @param {function} props.action.onClick - Action button click handler
 */
export function EmptyState({ icon, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-800 bg-slate-950/20 rounded-2xl text-center space-y-4 max-w-sm mx-auto my-6">
      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-300">No Records Found</h4>
        <p className="text-xs text-slate-500 mt-1">{message || 'There is no data available to show at this moment.'}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 text-xs font-bold text-slate-900 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 hover:scale-[1.02] active:scale-95 rounded-xl transition duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
