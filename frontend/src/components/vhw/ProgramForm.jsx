import React, { useState, useEffect } from 'react';
import { Users, Calendar, MapPin, Loader2 } from 'lucide-react';
import { api } from '../../services/apiClient';

/**
 * ProgramViewer — displays awareness campaigns assigned by Director.
 * Renamed from ProgramForm to reflect read-only nature.
 * Follows VHW rules: inputs text-base (16px), buttons h-12 (48px).
 */
export default function ProgramForm({ visibleVillages }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/community-programs');
      const allPrograms = res.data.data || res.data;
      
      // Filter programs to only show those for the VHW's assigned villages
      const villageIds = visibleVillages.map(v => v.id);
      const myPrograms = allPrograms.filter(p => villageIds.includes(p.village_id));
      
      setPrograms(myPrograms);
    } catch (err) {
      console.error("Failed to fetch programs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [visibleVillages]);

  return (
    <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-4">
      <div className="flex items-center pb-2 border-b border-slate-800">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#0ea5e9]" />
          Assigned Awareness Campaigns
        </h3>
      </div>
      
      <p className="text-[10px] text-slate-450 leading-relaxed font-medium">
        Review community programs scheduled for your assigned villages by the Project Director.
      </p>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 text-[#0ea5e9] animate-spin" />
        </div>
      ) : programs.length === 0 ? (
        <div className="text-center py-8 bg-slate-950 border border-slate-850 rounded-xl">
          <Calendar className="w-8 h-8 text-slate-700 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-bold">No programs assigned</p>
          <p className="text-[10px] text-slate-500 mt-1">There are no upcoming campaigns scheduled for your villages.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {programs.map(prog => (
            <div key={prog.id} className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl space-y-2 hover:border-slate-700 transition">
              <div className="flex justify-between items-start">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#0ea5e9] bg-[#0ea5e9]/10 px-2 py-0.5 rounded border border-[#0ea5e9]/20">
                  {prog.topic}
                </span>
                <span className="text-[10px] font-black text-slate-300">
                  {new Date(prog.program_date).toLocaleDateString()}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mt-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {prog.village?.name || 'Assigned Village'}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                <span className="font-bold text-slate-300">Goal/Notes:</span> {prog.outcome_summary || 'N/A'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
