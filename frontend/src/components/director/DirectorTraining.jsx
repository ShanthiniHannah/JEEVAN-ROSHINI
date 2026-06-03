import React from 'react';
import { BookOpen } from 'lucide-react';

export default function DirectorTraining({
  newTraining,
  setNewTraining,
  trainings,
  handleCreateTraining
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          Scheduled VHW Capacity Building Modules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trainings.map(trn => (
            <div key={trn.id} className="border border-[var(--border-color)] p-4 rounded-xl bg-[var(--bg-inner)] space-y-2 flex flex-col justify-between hover:border-[var(--text-secondary)]/40 transition text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{trn.type}</span>
                <h4 className="text-xs font-bold text-[var(--text-primary)] mt-2">{trn.title}</h4>
                <p className="text-[var(--text-secondary)] mt-1 leading-relaxed"><span className="font-bold text-[var(--text-secondary)]">Instructor:</span> {trn.instructor}</p>
                <p className="text-[var(--text-secondary)] mt-0.5 leading-relaxed"><span className="font-bold text-[var(--text-secondary)]">Scheduled Date:</span> {trn.date}</p>
              </div>
              <div className="border-t border-[var(--border-color)] pt-2 mt-2 flex justify-between items-center text-[10px]">
                <span className="text-[var(--text-secondary)]">Enrolled Count: <span className="font-bold text-[var(--text-primary)]">{trn.enrolledCount || 0}</span></span>
                <span className="text-[8.5px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/20">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl h-fit">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">Schedule Capacity Module</h3>
        <form onSubmit={handleCreateTraining} className="space-y-3.5 text-xs">
          <div>
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Module Title</label>
            <input
              type="text"
              value={newTraining.title}
              onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
              placeholder="e.g. Pediatric Anemia Screening"
              required
              className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 mt-1 text-[var(--text-primary)] focus:outline-none placeholder:text-[var(--text-secondary)]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Training Type</label>
            <select
              value={newTraining.type}
              onChange={(e) => setNewTraining({ ...newTraining, type: e.target.value })}
              className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-2.5 py-2 mt-1 text-[var(--text-primary)] focus:outline-none"
            >
              <option value="Online">Online Webinar</option>
              <option value="In-Person">In-Person Workshop</option>
              <option value="Practical">Field Practical</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Scheduled Date</label>
            <input
              type="date"
              value={newTraining.date}
              onChange={(e) => setNewTraining({ ...newTraining, date: e.target.value })}
              required
              className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-2.5 py-2 mt-1 text-[var(--text-primary)] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition"
          >
            Create Module
          </button>
        </form>
      </div>
    </div>
  );
}
