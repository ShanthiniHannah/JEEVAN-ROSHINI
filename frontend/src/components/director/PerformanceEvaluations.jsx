import React from 'react';
import { Award, Star } from 'lucide-react';

export default function PerformanceEvaluations({
  evalWorker,
  setEvalWorker,
  evalForm,
  setEvalForm,
  vhwStaff,
  evaluations,
  handleSubmitEvaluation
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-purple-500" />
          Active VHW Performance Metrics
        </h3>
        <div className="divide-y divide-[var(--border-color)] bg-[var(--bg-inner)] rounded-xl border border-[var(--border-color)] overflow-hidden">
          {evaluations.map(evl => (
            <div key={evl.id} className="p-4 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-[var(--text-primary)]">{evl.worker}</p>
                <p className="text-[var(--text-secondary)] mt-1">Review Date: {evl.date} · Feedback: <span className="italic text-[var(--text-primary)]">&ldquo;{evl.feedback}&rdquo;</span></p>
              </div>
              <span className="bg-purple-500/10 text-purple-500 dark:text-purple-400 text-xs px-2.5 py-1 rounded font-black border border-purple-500/25 flex items-center gap-1 shrink-0">
                Score: {evl.score} <Star className="w-3 h-3 fill-purple-500 dark:fill-purple-400" />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl h-fit">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">Conduct Staff Evaluation</h3>
        <form onSubmit={handleSubmitEvaluation} className="space-y-3.5 text-xs">
          <div>
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Select Worker</label>
            <select
              value={evalWorker}
              onChange={(e) => setEvalWorker(e.target.value)}
              required
              className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-2.5 py-2 mt-1 text-[var(--text-primary)] focus:outline-none"
            >
              <option value="">-- Choose VHW --</option>
              {vhwStaff.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Evaluation Rating</label>
            <select
              value={evalForm.score}
              onChange={(e) => setEvalForm({ ...evalForm, score: e.target.value })}
              className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-2.5 py-2 mt-1 text-[var(--text-primary)] focus:outline-none"
            >
              <option value="5">5 Stars (Excellent)</option>
              <option value="4">4 Stars (Good)</option>
              <option value="3">3 Stars (Average)</option>
              <option value="2">2 Stars (Poor)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Detailed Feedback</label>
            <textarea
              value={evalForm.feedback}
              onChange={(e) => setEvalForm({ ...evalForm, feedback: e.target.value })}
              required
              rows="3"
              placeholder="Provide constructive operational reviews..."
              className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 mt-1 text-[var(--text-primary)] focus:outline-none placeholder:text-[var(--text-secondary)]"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
