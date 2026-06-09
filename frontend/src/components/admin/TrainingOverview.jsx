import React from 'react';
import { GraduationCap, Calendar, CheckSquare, Users, BarChart2 } from 'lucide-react';

/**
 * TrainingOverview — Super Admin read-only training monitor.
 * Shows aggregated stats across all districts.
 */
export default function TrainingOverview({ state }) {
  const trainings = (state?.trainings || []);

  const stats = {
    total:     trainings.length,
    scheduled: trainings.filter(t => t.status === 'Scheduled').length,
    completed: trainings.filter(t => t.status === 'Completed').length,
    inProgress: trainings.filter(t => t.status === 'In Progress').length,
    cancelled: trainings.filter(t => t.status === 'Cancelled').length,
  };

  const categoryCount = trainings.reduce((acc, t) => {
    if (t.category) acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-5">

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-base font-black text-[var(--text-primary)]">Training Overview</h3>
          <p className="text-xs text-[var(--text-secondary)]">Read-only monitoring across all districts</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total',      value: stats.total,      color: 'border-blue-400  bg-blue-50  dark:bg-blue-900/20',   text: 'text-blue-600' },
          { label: 'Scheduled',  value: stats.scheduled,  color: 'border-amber-400 bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600' },
          { label: 'Completed',  value: stats.completed,  color: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600' },
          { label: 'Cancelled',  value: stats.cancelled,  color: 'border-rose-400  bg-rose-50  dark:bg-rose-900/20',  text: 'text-rose-600' },
        ].map(s => (
          <div key={s.label} className={`border ${s.color} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
            <p className="text-xs font-semibold text-[var(--text-secondary)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* By Category */}
      {Object.keys(categoryCount).length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
          <h4 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <BarChart2 className="w-4 h-4" /> Trainings by Category
          </h4>
          <div className="space-y-2">
            {Object.entries(categoryCount).sort(([,a],[,b]) => b - a).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[var(--text-secondary)] w-40 shrink-0 truncate">{cat}</span>
                <div className="flex-1 bg-[var(--bg-inner)] rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all"
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)] w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Trainings */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border-color)]">
          <h4 className="text-sm font-bold text-[var(--text-primary)]">Recent Training Sessions</h4>
        </div>
        {trainings.length === 0 ? (
          <div className="text-center py-10 text-[var(--text-secondary)]">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs font-semibold">No trainings recorded yet</p>
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-[var(--bg-inner)]">
              <tr>
                {['Title', 'Category', 'Date', 'Trainer', 'Participants', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold text-[var(--text-secondary)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trainings.slice(0, 20).map((t, i) => (
                <tr key={i} className="border-t border-[var(--border-color)] hover:bg-[var(--bg-inner)]">
                  <td className="px-4 py-3 font-semibold text-[var(--text-primary)] max-w-[160px] truncate">{t.title}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{t.category}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{t.scheduled_date}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{t.instructor || '—'}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{t.expected_participants || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      t.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                      t.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
