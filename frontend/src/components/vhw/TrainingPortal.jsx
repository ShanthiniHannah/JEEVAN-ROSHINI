import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Award, FileText, Download, Loader2 } from 'lucide-react';
import { api } from '../../services/apiClient';

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
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await api.get('/trainings');
        const trainingsList = res.data.data || res.data;
        
        // Fetch materials for each training
        const withMaterials = await Promise.all(
          trainingsList.map(async (t) => {
            try {
              const matRes = await api.get(`/trainings/${t.id}/materials`);
              return { ...t, materials: matRes.data || [] };
            } catch (err) {
              return { ...t, materials: [] };
            }
          })
        );
        
        // Keep all trainings, even those without materials, so VHWs can see the schedule
        setTrainings(withMaterials);
      } catch (err) {
        console.error("Failed to fetch training materials", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  return (
    <div className="space-y-4">
      {/* Learning Modules / Materials Card */}
      <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-3.5">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          Scheduled Trainings & Materials
        </h3>
        <p className="text-[10px] text-slate-450 leading-relaxed font-medium">
          View upcoming training sessions and review documents uploaded by your Project Director.
        </p>
        
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          </div>
        ) : trainings.length === 0 ? (
          <div className="text-center py-6 bg-slate-950 border border-slate-850 rounded-xl">
            <BookOpen className="w-8 h-8 text-slate-700 mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-bold">No trainings scheduled</p>
            <p className="text-[10px] text-slate-500 mt-1">Your Project Director hasn't scheduled any trainings or uploaded materials yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trainings.map(t => (
              <div key={t.id} className="space-y-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                <div className="border-l-2 border-purple-500 pl-2">
                  <h4 className="text-[12px] font-black text-white tracking-wider uppercase">
                    {t.title}
                  </h4>
                  <div className="text-[10px] text-purple-300 font-bold mt-0.5">
                    {t.category}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                  <div><span className="text-slate-500">Date:</span> <span className="font-bold text-slate-300">{t.scheduled_date}</span></div>
                  <div><span className="text-slate-500">Time:</span> <span className="font-bold text-slate-300">{t.start_time ? `${t.start_time} - ${t.end_time || 'TBD'}` : 'TBD'}</span></div>
                  <div><span className="text-slate-500">Venue:</span> <span className="font-bold text-slate-300">{t.venue || 'TBD'}</span></div>
                  <div><span className="text-slate-500">Instructor:</span> <span className="font-bold text-slate-300">{t.instructor || 'TBD'}</span></div>
                </div>

                {t.description && (
                  <p className="text-[10px] text-slate-450 italic px-1">{t.description}</p>
                )}

                <div className="space-y-2 pt-1">
                  {t.materials && t.materials.length > 0 ? t.materials.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-700/50 rounded-xl hover:border-purple-500/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-950 p-2 rounded-lg">
                          <FileText className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-white leading-tight">{m.title}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">
                            {m.file_name} · {m.material_type} · {(m.file_size_kb || 0).toLocaleString()} KB
                          </p>
                        </div>
                      </div>
                      <a 
                        href={`http://localhost:8000/storage/${m.file_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 transition cursor-pointer active:scale-95 shadow-sm"
                        title="Download / View Material"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  )) : (
                    <div className="text-[10px] text-slate-500 italic py-1 px-1">
                      No materials uploaded for this session yet.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
