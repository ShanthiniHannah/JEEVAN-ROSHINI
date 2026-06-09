import React, { useState, useEffect } from 'react';
import { Heart, Plus, Save, MapPin, Users, Calendar, Loader2 } from 'lucide-react';
import { api } from '../../services/apiClient';

export default function CommunityPrograms({ villages }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [programForm, setProgramForm] = useState({
    village_id: '',
    topic: 'Menstrual Hygiene',
    program_date: '',
    participants_count: '',
    outcome_summary: ''
  });

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/community-programs');
      setPrograms(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to fetch programs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/community-programs', programForm);
      if (res.data.success) {
        setPrograms([res.data.data, ...programs]);
        setIsCreating(false);
        setProgramForm({
          village_id: '',
          topic: 'Menstrual Hygiene',
          program_date: '',
          participants_count: '',
          outcome_summary: ''
        });
      }
    } catch (err) {
      alert("Failed to create program");
      console.error(err);
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-[var(--border-color)] pb-3">
        <div>
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-500" /> Community Programs Management
          </h3>
          <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Assign awareness campaigns to VHWs</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          {isCreating ? 'Cancel' : 'Create Program'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateProgram} className="bg-[var(--bg-inner)] p-4 rounded-xl border border-[var(--border-color)] space-y-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider">Target Village</label>
              <select 
                value={programForm.village_id}
                onChange={(e) => setProgramForm({ ...programForm, village_id: e.target.value })}
                required
                className="w-full h-10 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Select Village --</option>
                {villages.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider">Program Topic</label>
              <select 
                value={programForm.topic}
                onChange={(e) => setProgramForm({ ...programForm, topic: e.target.value })}
                className="w-full h-10 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
              >
                <option value="Menstrual Hygiene">Menstrual Hygiene Awareness</option>
                <option value="Nutrition Education">Nutrition & Anemia Prevention</option>
                <option value="Tobacco Prevention">Tobacco / Substance De-addiction</option>
                <option value="Child Nutrition under-5">Under-5 Child Care & Immunization</option>
                <option value="Geriatric Support">Geriatric Support Group</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider">Scheduled Date</label>
              <input 
                type="date"
                value={programForm.program_date}
                onChange={(e) => setProgramForm({ ...programForm, program_date: e.target.value })}
                required
                className="w-full h-10 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider">Expected/Actual Participants</label>
              <input 
                type="number"
                value={programForm.participants_count}
                onChange={(e) => setProgramForm({ ...programForm, participants_count: e.target.value })}
                placeholder="Optional"
                className="w-full h-10 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider">Program Notes / Goal</label>
              <textarea 
                value={programForm.outcome_summary}
                onChange={(e) => setProgramForm({ ...programForm, outcome_summary: e.target.value })}
                placeholder="Brief summary of program goals or outcome..."
                className="w-full h-20 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex justify-center items-center gap-1.5 transition"
          >
            <Save className="w-4 h-4" />
            Save Program
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
        </div>
      ) : programs.length === 0 ? (
        <div className="text-center py-6 text-[var(--text-secondary)] text-sm">
          No programs have been created yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map(prog => (
            <div key={prog.id} className="border border-[var(--border-color)] p-4 rounded-xl bg-[var(--bg-inner)] space-y-3 flex flex-col justify-between hover:border-[var(--text-secondary)]/40 transition">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{prog.topic}</span>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(prog.program_date).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[var(--text-primary)] mt-3 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  {prog.village?.name || 'Unknown Village'}
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)] mt-2 leading-relaxed">
                  <span className="font-bold text-[var(--text-secondary)]">Notes:</span> {prog.outcome_summary || 'N/A'}
                </p>
              </div>
              <div className="flex justify-between items-center border-t border-[var(--border-color)] pt-3 mt-3 text-[10px]">
                <span className="text-[var(--text-secondary)] flex items-center gap-1">
                  <Users className="w-3 h-3" /> <span className="font-bold text-[var(--text-primary)]">{prog.participants_count || 0}</span>
                </span>
                <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400`}>
                  Assigned
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
