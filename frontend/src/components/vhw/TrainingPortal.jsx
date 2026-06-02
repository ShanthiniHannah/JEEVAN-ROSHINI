import React from 'react';
import { BookOpen, Play, Award } from 'lucide-react';

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
      <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl">
        <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-purple-400" />
          Module 1: Maternal Risk Screening
        </h3>
        <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
          Learn to identify obstetric red flags including high systolic blood pressure (&gt;140mmHg), severe anemia, and age factor limits in rural field checks.
        </p>
        
        <div className="h-24 bg-slate-950 border border-slate-900 rounded-xl relative flex items-center justify-center group overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80')" }}></div>
          <button className="absolute bg-purple-600 text-white rounded-full p-2 shadow-lg group-hover:scale-105 transition">
            <Play className="w-4 h-4 fill-white" />
          </button>
          <span className="absolute bottom-1.5 right-2.5 text-[9px] bg-slate-900/80 px-1.5 py-0.5 rounded text-purple-200">5 mins video</span>
        </div>
      </div>

      {/* Interactive assessment */}
      <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl">
        <h3 className="text-xs font-bold text-white mb-2.5 uppercase tracking-wider flex items-center gap-1">
          <Award className="w-4 h-4 text-amber-400" />
          Interactive Evaluation
        </h3>

        {quizScore === null ? (
          <form onSubmit={handleQuizSubmit} className="space-y-3.5">
            {quizQuestions.map((q) => (
              <div key={q.id} className="border-t border-slate-700/50 pt-2.5 first:border-0 first:pt-0">
                <p className="text-[10px] font-bold text-slate-200">{q.id}. {q.q}</p>
                <div className="space-y-1 mt-1.5">
                  {q.options.map((opt, optIdx) => (
                    <label key={optIdx} className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800/80 rounded-lg cursor-pointer text-[10px] text-slate-300 hover:bg-slate-850">
                      <input 
                        type="radio" 
                        name={`question-${q.id}`} 
                        value={optIdx}
                        checked={selectedAnswers[q.id] === optIdx}
                        onChange={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                        className="text-purple-600 focus:ring-purple-500 bg-slate-800"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg text-xs transition"
            >
              Submit Answers
            </button>
          </form>
        ) : (
          <div className="text-center py-4 bg-slate-900 border border-purple-900/20 rounded-xl">
            <Award className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
            <h4 className="text-xs font-bold text-white mt-2">Congratulations!</h4>
            <p className="text-xs text-purple-300 font-semibold mt-1">You Scored {quizScore} / 3 Correct</p>
            
            {quizScore >= 2 ? (
              <div className="mt-3 px-4">
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-bold">Passed</span>
                <button 
                  type="button"
                  onClick={() => { alert("Certificate Downloaded: Preema D'Souza - Maternal Screening Certificate (ID: JR-CERT-8849)"); }}
                  className="block w-full mt-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-1.5 rounded-lg text-[10px] transition"
                >
                  Download Certificate (PDF)
                </button>
              </div>
            ) : (
              <div className="mt-3">
                <span className="text-[9px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-bold">Failed (Needs &gt;= 70%)</span>
                <button 
                  type="button"
                  onClick={() => { setQuizScore(null); setSelectedAnswers({}); }}
                  className="block w-full mt-3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-1.5 rounded-lg text-[10px]"
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
