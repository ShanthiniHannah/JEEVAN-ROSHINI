import React from 'react';
import { Award } from 'lucide-react';

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
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-purple-400" />
          Active VHW Performance Metrics
        </h3>
        <div className="divide-y divide-slate-800 bg-slate-950/20 rounded-xl border border-slate-800 overflow-hidden">
          {evaluations.map(evl => (
            <div key={evl.id} className="p-4 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-white">{evl.worker}</p>
                <p className="text-slate-400 mt-1">Review Date: {evl.date} · Feedback: <span className="italic text-slate-300">"{evl.feedback}"</span></p>
              </div>
              <span className="bg-purple-500/10 text-purple-400 text-xs px-2.5 py-1 rounded font-black border border-purple-500/25">Score: {evl.score} ★</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl h-fit">
        <h3 className="text-sm font-bold text-white mb-3">Conduct Staff Evaluation</h3>
        <form onSubmit={handleSubmitEvaluation} className="space-y-3.5 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Select Worker</label>
            <select 
              value={evalWorker} 
              onChange={(e) => setEvalWorker(e.target.value)} 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 mt-1 text-white focus:outline-none"
            >
              <option value="">-- Choose VHW --</option>
              {vhwStaff.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Evaluation Rating</label>
            <select 
              value={evalForm.score} 
              onChange={(e) => setEvalForm({ ...evalForm, score: e.target.value })} 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 mt-1 text-white focus:outline-none"
            >
              <option value="5">5 Stars (Excellent)</option>
              <option value="4">4 Stars (Good)</option>
              <option value="3">3 Stars (Average)</option>
              <option value="2">2 Stars (Poor)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Detailed Feedback</label>
            <textarea 
              value={evalForm.feedback} 
              onChange={(e) => setEvalForm({ ...evalForm, feedback: e.target.value })} 
              required
              rows="3"
              placeholder="Provide constructive operational reviews..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 mt-1 text-white focus:outline-none"
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
