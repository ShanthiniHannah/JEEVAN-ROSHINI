import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * ErrorState — Modern semantic error placeholder with retry mechanism.
 *
 * @param {Object} props
 * @param {string} props.message - Friendly error message
 * @param {function} [props.onRetry] - Callback to retry operation
 */
export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 border border-red-500/20 bg-red-500/5 rounded-2xl text-center space-y-4 max-w-md mx-auto my-4">
      <div className="p-3 bg-red-500/10 rounded-full text-red-500">
        <AlertCircle className="w-6 h-6 animate-pulse" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-100">Operation Error</h4>
        <p className="text-xs text-slate-400 mt-1">{message || 'Something went wrong. Please try again.'}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl transition duration-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
}
