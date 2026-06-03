import React from 'react';
import { BookOpen, Play, Award } from 'lucide-react';

/**
 * TrainingPortal — VHW interactive assessment & training card.
 * Follows VHW rules: inputs text-base (16px), buttons h-12 (48px).
 */
export default function TrainingPortal({
  quizScore,
  setQuizScore,
  selectedAnswers,
  setSelectedAnswers,
  quizQuestions,
  handleQuizSubmit
}) {
  return (
    <div className="space-y-4">
      {/* Learning Module Card */}
      <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-3.5">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          Module 1: Maternal Risk Screening
        </h3>
        <p className="text-[10px] text-slate-450 leading-relaxed font-medium">
          Learn to identify obstetric red flags including high systolic blood pressure (&gt;140mmHg), severe anemia, and age factor limits in rural field checks.
        </p>
        
        <div className="h-24 bg-slate-950 border border-slate-850 rounded-xl relative flex items-center justify-center group overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80')" }}></div>
          <button className="absolute bg-purple-650 hover:bg-purple-750 text-white rounded-full p-2.5 shadow-lg group-hover:scale-105 active:scale-95 transition cursor-pointer">
            <Play className="w-4 h-4 fill-white text-white" />
          </button>
          <span className="absolute bottom-1.5 right-2.5 text-[8.5px] bg-slate-950/80 px-2 py-0.5 border border-slate-850 rounded text-purple-250 font-bold font-mono">5 mins video</span>
        </div>
      </div>

      {/* Interactive assessment */}
      <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-3">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
          <Award className="w-4 h-4 text-[#f59e0b]" />
          Interactive Assessment
        </h3>

        {quizScore === null ? (
          <form onSubmit={handleQuizSubmit} className="space-y-4 pt-1">
            {quizQuestions.map((q) => (
              <div key={q.id} className="space-y-2 border-t border-slate-800/80 pt-3.5 first:border-0 first:pt-0">
                <p className="text-[11px] font-black text-slate-250 leading-relaxed">{q.id}. {q.q}</p>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => (
                    <label key={optIdx} className="flex items-center gap-2.5 p-3.5 bg-slate-950 border border-slate-850 rounded-xl cursor-pointer text-xs font-semibold text-slate-300 hover:bg-slate-900 transition-colors">
                      <input 
                        type="radio" 
                        name={`question-${q.id}`} 
                        value={optIdx}
                        checked={selectedAnswers[q.id] === optIdx}
                        onChange={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                        className="w-4 h-4 text-purple-650 focus:ring-purple-550 bg-slate-900 border-slate-800 cursor-pointer"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button 
              type="submit" 
              className="w-full h-12 bg-purple-650 hover:bg-purple-750 text-white font-black rounded-xl text-xs flex justify-center items-center gap-1 shadow-md active:scale-98 transition duration-200 cursor-pointer mt-4"
            >
              Submit Answers
            </button>
          </form>
        ) : (
          <div className="text-center py-5 bg-slate-950 border border-slate-850 rounded-xl space-y-4">
            <div className="p-3 bg-[#f59e0b]/10 text-[#f59e0b] rounded-full inline-block animate-bounce">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">Evaluation Complete</h4>
              <p className="text-sm text-purple-400 font-black mt-1">Score: {quizScore} / 3 Correct</p>
            </div>
            
            {quizScore >= 2 ? (
              <div className="px-4 space-y-3">
                <span className="inline-flex px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-450 border border-emerald-500/20">Passed</span>
                <button 
                  type="button"
                  onClick={() => { alert("Certificate Downloaded: Preema D'Souza - Maternal Screening Certificate (ID: JR-CERT-8849)"); }}
                  className="w-full h-12 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition duration-200 shadow-md"
                >
                  Download Certificate (PDF)
                </button>
              </div>
            ) : (
              <div className="px-4 space-y-3">
                <span className="inline-flex px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-455 border border-rose-500/20">Failed (Requires 70%)</span>
                <button 
                  type="button"
                  onClick={() => { setQuizScore(null); setSelectedAnswers({}); }}
                  className="w-full h-12 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition duration-200"
                >
                  Retake Quiz
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
