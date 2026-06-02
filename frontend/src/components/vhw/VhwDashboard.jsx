import React from 'react';
import { AlertTriangle, Users, Heart, ClipboardList, Map, MapPin } from 'lucide-react';

export default function VhwDashboard({
  visibleFamilies,
  visibleIndividuals,
  state,
  setActiveSubTab,
  gpsCoords,
  currentVhwName
}) {
  return (
    <div className="space-y-4">
      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-slate-800/40 border border-slate-700/60 p-3 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Assigned Households</span>
          <p className="text-xl font-black mt-1 text-blue-400">
            {visibleFamilies.length} <span className="text-[10px] text-slate-500 font-normal">homes</span>
          </p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/60 p-3 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Assigned Registry</span>
          <p className="text-xl font-black mt-1 text-purple-400">
            {visibleIndividuals.length} <span className="text-[10px] text-slate-500 font-normal">records</span>
          </p>
        </div>
      </div>

      {/* Risk Warnings Board */}
      <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-2xl">
        <div className="flex items-center justify-between border-b border-rose-500/15 pb-2 mb-2">
          <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Block Alerts ({state.alerts.filter(a => !a.resolved).length})
          </h4>
          <button onClick={() => setActiveSubTab('echr')} className="text-[10px] text-rose-300 underline font-semibold">View Cases</button>
        </div>
        {state.alerts.filter(a => !a.resolved).slice(0, 2).map((al) => (
          <div key={al.id} className="text-[10px] border-l-2 border-rose-500 pl-2 py-1 my-1.5 flex justify-between bg-rose-500/5 rounded-r">
            <div>
              <span className="font-bold text-rose-300">{al.patientName}</span>
              <p className="text-slate-400 mt-0.5">{al.reason}</p>
            </div>
            <span className={`text-[8px] uppercase tracking-wider px-1 py-0.5 rounded font-bold h-fit ${
              al.severity === 'critical' ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-600 text-white'
            }`}>{al.severity}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions List */}
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Clinical Field Actions</h3>
        <div className="grid grid-cols-2 gap-2.5">
          <button 
            onClick={() => setActiveSubTab('village')}
            className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 p-3 rounded-2xl text-left transition-all active:scale-98"
          >
            <MapPin className="w-4 h-4 text-indigo-400 mb-1" />
            <p className="text-xs font-bold text-white">Village Form</p>
            <span className="text-[8px] text-slate-500 block mt-0.5">Map demographics</span>
          </button>
          
          <button 
            onClick={() => setActiveSubTab('family')}
            className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 p-3 rounded-2xl text-left transition-all active:scale-98"
          >
            <Users className="w-4 h-4 text-blue-400 mb-1" />
            <p className="text-xs font-bold text-white">Register Family</p>
            <span className="text-[8px] text-slate-500 block mt-0.5">3-Step Wizard</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('individual')}
            className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 p-3 rounded-2xl text-left transition-all active:scale-98"
          >
            <Heart className="w-4 h-4 text-rose-400 mb-1" />
            <p className="text-xs font-bold text-white">Patient Record</p>
            <span className="text-[8px] text-slate-500 block mt-0.5">Scoring & Consent</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('visit')}
            className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 p-3 rounded-2xl text-left transition-all active:scale-98"
          >
            <ClipboardList className="w-4 h-4 text-amber-400 mb-1" />
            <p className="text-xs font-bold text-white">Log Visit</p>
            <span className="text-[8px] text-slate-500 block mt-0.5">2-Step Wizard</span>
          </button>
        </div>
      </div>

      {/* Simulated Live Location Map */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-white flex items-center gap-1">
            <Map className="w-3.5 h-3.5 text-emerald-400" />
            Live GPS Duty Ring
          </span>
          <span className="text-[9px] text-slate-500 font-mono bg-slate-900 px-1.5 py-0.2 rounded">
            {gpsCoords ? `${gpsCoords.lat}, ${gpsCoords.lng}` : 'Determining...'}
          </span>
        </div>
        <div className="h-16 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          <div className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
          <span className="text-[8px] text-slate-600 absolute bottom-1 right-2">{currentVhwName} online</span>
        </div>
      </div>
    </div>
  );
}
