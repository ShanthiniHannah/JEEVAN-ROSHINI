import React from 'react';
import { WifiOff, AlertTriangle } from 'lucide-react';

/**
 * OfflineStatusBanner — Sticky banner displayed at the top of the app
 * when the application is working in offline mode.
 *
 * @param {Object} props
 * @param {boolean} props.isOnline - Current online connectivity status
 * @param {number} [props.pendingCount=0] - Number of items in local sync queue
 */
export function OfflineStatusBanner({ isOnline, pendingCount = 0 }) {
  if (isOnline) return null;

  return (
    <div className="bg-amber-600/90 backdrop-blur text-white text-xs px-4 py-2 flex items-center justify-between border-b border-amber-500 shadow-md animate-fadeIn z-50">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-200 shrink-0" />
        <span className="font-semibold">Offline Mode Active</span>
        <span className="text-xs text-amber-100 hidden sm:inline">| Local caching enabled. Changes will sync once connection returns.</span>
      </div>
      {pendingCount > 0 && (
        <span className="bg-slate-950/45 text-xs px-2 py-0.5 rounded-full font-bold border border-white/10 flex items-center gap-1.5 shrink-0">
          <AlertTriangle className="w-3 h-3 text-amber-300 animate-pulse" />
          {pendingCount} records pending sync
        </span>
      )}
    </div>
  );
}
