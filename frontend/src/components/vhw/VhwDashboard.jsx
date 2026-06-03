import React from 'react';
import { AlertTriangle, Users, Heart, ClipboardList, Map, MapPin } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

/**
 * VhwDashboard — VHW Portal Dashboard view inside the phone PWA mockup.
 * Follows VHW rules: buttons h-12 (48px) minimum touch target.
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
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between">
          <span className="text-[9.5px] text-slate-500 font-black uppercase tracking-wider">Assigned Houses</span>
          <p className="text-xl font-black mt-1 text-[#0ea5e9]">
            {visibleFamilies.length} <span className="text-[10px] text-slate-500 font-semibold lowercase">homes</span>
          </p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between">
          <span className="text-[9.5px] text-slate-500 font-black uppercase tracking-wider">Assigned Records</span>
          <p className="text-xl font-black mt-1 text-[#14b8a6]">
            {visibleIndividuals.length} <span className="text-[10px] text-slate-500 font-semibold lowercase">patients</span>
          </p>
        </div>
      </div>

      {/* Risk Alerts Board */}
      <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-rose-500/15 pb-2">
          <h4 className="text-xs font-black text-rose-455 flex items-center gap-1.5 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Alerts ({activeAlerts.length})
          </h4>
          <button 
            type="button"
            onClick={() => setActiveSubTab('echr')} 
            className="text-[10px] text-rose-400 hover:text-rose-300 font-black uppercase cursor-pointer"
          >
            View Cases
          </button>
        </div>
        
        <div className="space-y-2.5">
          {activeAlerts.slice(0, 2).map((al) => (
            <div key={al.id} className="text-[10.5px] border-l-2 border-rose-500 pl-3 py-1 bg-rose-500/5 rounded-r-xl flex justify-between items-start gap-2">
              <div>
                <span className="font-bold text-rose-300">{al.patientName}</span>
                <p className="text-slate-450 mt-0.5 font-medium">{al.reason}</p>
              </div>
              <StatusBadge status={al.severity} />
            </div>
          ))}
          {activeAlerts.length === 0 && (
            <p className="text-xs text-slate-500 italic text-center py-1">No pending health alerts.</p>
          )}
        </div>
      </div>

      {/* Clinical Field Actions */}
      <div className="space-y-2">
        <h3 className="text-[9.5px] font-black uppercase tracking-wider text-slate-500">Clinical Field Actions</h3>
        <div className="grid grid-cols-2 gap-2.5">
          <button 
            onClick={() => setActiveSubTab('village')}
            className="h-14 bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 p-3.5 rounded-2xl text-left transition-all active:scale-[0.97] cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black text-white">Village Form</span>
              <MapPin className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-[8.5px] text-slate-500 font-medium">Map demographics</span>
          </button>
          
          <button 
            onClick={() => setActiveSubTab('family')}
            className="h-14 bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 p-3.5 rounded-2xl text-left transition-all active:scale-[0.97] cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black text-white">Register Family</span>
              <Users className="w-4 h-4 text-[#0ea5e9]" />
            </div>
            <span className="text-[8.5px] text-slate-500 font-medium">3-Step Wizard</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('individual')}
            className="h-14 bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 p-3.5 rounded-2xl text-left transition-all active:scale-[0.97] cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black text-white">Patient Record</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <span className="text-[8.5px] text-slate-500 font-medium">Scoring &amp; Consent</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('visit')}
            className="h-14 bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 p-3.5 rounded-2xl text-left transition-all active:scale-[0.97] cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black text-white">Log Visit</span>
              <ClipboardList className="w-4 h-4 text-[#14b8a6]" />
            </div>
            <span className="text-[8.5px] text-slate-500 font-medium">2-Step Wizard</span>
          </button>
        </div>
      </div>

      {/* Simulated Live Location Map */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-white flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5 text-emerald-400" />
            GPS Ring Check
          </span>
          <span className="text-[9px] text-slate-500 font-black font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
            {gpsCoords ? `${gpsCoords.lat}, ${gpsCoords.lng}` : 'Determining...'}
          </span>
        </div>
        <div className="h-16 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0ea5e9_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
          <div className="absolute w-3.5 h-3.5 bg-emerald-500/20 rounded-full animate-ping"></div>
          <div className="absolute w-2 h-2 bg-emerald-500 rounded-full"></div>
          <span className="text-[8.5px] text-slate-600 font-bold absolute bottom-1 right-2">{currentVhwName} online</span>
        </div>
      </div>
    </div>
  );
}
