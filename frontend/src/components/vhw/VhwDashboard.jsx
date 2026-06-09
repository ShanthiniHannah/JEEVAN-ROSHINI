import React from 'react';
import { AlertTriangle, Users, Heart, ClipboardList, Map, MapPin } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

/**
 * VhwDashboard — VHW Portal Dashboard view.
 * Redesigned to utilize premium SaaS themes and card variables.
 */
export default function VhwDashboard({
  visibleFamilies,
  visibleIndividuals,
  state,
  setActiveSubTab,
  gpsCoords,
  currentVhwName
}) {
  const activeAlerts = state.alerts?.filter(a => !a.resolved) ?? [];

  return (
    <div className="space-y-4">
      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--bg-inner)] border border-[var(--border-color)] p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[9.5px] text-[var(--text-secondary)] font-black uppercase tracking-wider">Assigned Houses</span>
          <p className="text-xl font-black mt-1 text-brand-500">
            {visibleFamilies.length} <span className="text-[10px] text-[var(--text-secondary)] font-semibold lowercase">homes</span>
          </p>
        </div>
        <div className="bg-[var(--bg-inner)] border border-[var(--border-color)] p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[9.5px] text-[var(--text-secondary)] font-black uppercase tracking-wider">Assigned Records</span>
          <p className="text-xl font-black mt-1 text-teal-500">
            {visibleIndividuals.length} <span className="text-[10px] text-[var(--text-secondary)] font-semibold lowercase">patients</span>
          </p>
        </div>
      </div>

      {/* Risk Alerts Board */}
      <div className="bg-rose-500/5 border border-rose-500/20 p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-rose-500/10 pb-2">
          <h4 className="text-xs font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            Alerts ({activeAlerts.length})
          </h4>
          <button 
            type="button"
            onClick={() => setActiveSubTab('echr')} 
            className="text-[10px] text-rose-600 dark:text-rose-400 hover:opacity-80 font-black uppercase cursor-pointer"
          >
            View Cases
          </button>
        </div>
        
        <div className="space-y-2">
          {activeAlerts.slice(0, 2).map((al) => (
            <div key={al.id} className="text-[10.5px] border-l-2 border-rose-500 pl-3 py-1 bg-rose-500/5 rounded-r-xl flex justify-between items-start gap-2">
              <div>
                <span className="font-bold text-[var(--text-primary)]">{al.patientName}</span>
                <p className="text-[var(--text-secondary)] mt-0.5 font-medium">{al.reason}</p>
              </div>
              <StatusBadge status={al.severity} />
            </div>
          ))}
          {activeAlerts.length === 0 && (
            <p className="text-xs text-[var(--text-secondary)] italic text-center py-1">No pending health alerts.</p>
          )}
        </div>
      </div>

      {/* Clinical Field Actions */}
      <div className="space-y-2">
        <h3 className="text-[9.5px] font-black uppercase tracking-wider text-[var(--text-secondary)]">Clinical Field Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setActiveSubTab('village')}
            className="h-16 bg-[var(--bg-inner)] hover:bg-[var(--border-color)] border border-[var(--border-color)] p-3.5 rounded-xl text-left transition-all active:scale-[0.97] cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black text-[var(--text-primary)]">Village Form</span>
              <MapPin className="w-4 h-4 text-indigo-500" />
            </div>
            <span className="text-[8.5px] text-[var(--text-secondary)] font-medium">Map demographics</span>
          </button>
          
          <button 
            onClick={() => setActiveSubTab('family')}
            className="h-16 bg-[var(--bg-inner)] hover:bg-[var(--border-color)] border border-[var(--border-color)] p-3.5 rounded-xl text-left transition-all active:scale-[0.97] cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black text-[var(--text-primary)]">Register Family</span>
              <Users className="w-4 h-4 text-brand-500" />
            </div>
            <span className="text-[8.5px] text-[var(--text-secondary)] font-medium">3-Step Wizard</span>
          </button>
 
          <button 
            onClick={() => setActiveSubTab('individual')}
            className="h-16 bg-[var(--bg-inner)] hover:bg-[var(--border-color)] border border-[var(--border-color)] p-3.5 rounded-xl text-left transition-all active:scale-[0.97] cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black text-[var(--text-primary)]">Patient Record</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <span className="text-[8.5px] text-[var(--text-secondary)] font-medium">Scoring &amp; Consent</span>
          </button>
 
          <button 
            onClick={() => setActiveSubTab('visit')}
            className="h-16 bg-[var(--bg-inner)] hover:bg-[var(--border-color)] border border-[var(--border-color)] p-3.5 rounded-xl text-left transition-all active:scale-[0.97] cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black text-[var(--text-primary)]">Log Visit</span>
              <ClipboardList className="w-4 h-4 text-teal-500" />
            </div>
            <span className="text-[8.5px] text-[var(--text-secondary)] font-medium">2-Step Wizard</span>
          </button>
        </div>
      </div>
     </div>
  );
}
