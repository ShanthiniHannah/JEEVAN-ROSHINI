import React, { useState, useEffect } from 'react';
import {
  Calendar, Plus, Upload, FileText,
  Image, CheckSquare, BookOpen, Clock, MapPin, Loader2, Award
} from 'lucide-react';
import { api } from '../../services/apiClient';

const TRAINING_CATEGORIES = [
  'Maternal Health', 'Child Health', 'Nutrition',
  'Mental Health', 'Elderly Care', 'Tuberculosis',
  'Diabetes', 'Hypertension', 'Community Awareness', 'VHW Orientation',
];

const STATUS_COLORS = {
  Scheduled:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'In Progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Completed:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Cancelled:   'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

const SUB_TABS = [
  { id: 'sessions',   label: 'Training Sessions', icon: Calendar },
  { id: 'attendance', label: 'Attendance',         icon: CheckSquare },
  { id: 'materials',  label: 'Materials',          icon: BookOpen },
  { id: 'evidence',   label: 'Evidence',           icon: Image },
  { id: 'reports',    label: 'Reports',            icon: FileText },
];

export default function TrainingModule({ state, setState }) {
  const [subTab, setSubTab]           = useState('sessions');
  const [showCreate, setShowCreate]   = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [selectedTrainingDetails, setSelectedTrainingDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Lists & forms
  const [vhwList, setVhwList] = useState([]);
  const [loadingVhws, setLoadingVhws] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [savingAttendance, setSavingAttendance] = useState(false);

  // Materials form state
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialFile, setMaterialFile] = useState(null);
  const [uploadingMaterial, setUploadingMaterial] = useState(false);

  // Evidence form state
  const [evidenceType, setEvidenceType] = useState('Photo');
  const [evidenceCaption, setEvidenceCaption] = useState('');
  const [evidenceNote, setEvidenceNote] = useState('');
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [uploadingEvidence, setUploadingEvidence] = useState(false);

  // Report form state
  const [reportForm, setReportForm] = useState({ topics_covered: '', outcome: '', remarks: '' });
  const [submittingReport, setSubmittingReport] = useState(false);

  const trainings = state.trainings || [];

  // Fetch VHWs list on mount
  useEffect(() => {
    const fetchVhws = async () => {
      setLoadingVhws(true);
      try {
        const res = await api.get('/trainings/vhws');
        setVhwList(res.data || []);
      } catch (err) {
        console.error('Failed to fetch VHWs:', err);
      } finally {
        setLoadingVhws(false);
      }
    };
    fetchVhws();
  }, []);

  // Fetch full details of selected training session
  const fetchTrainingDetails = async (id) => {
    setLoadingDetails(true);
    try {
      const res = await api.get(`/trainings/${id}`);
      setSelectedTrainingDetails(res.data);
      
      // Update the main trainings array in local state if status or info changed
      if (res.data) {
        setState(prev => ({
          ...prev,
          trainings: prev.trainings?.map(t => t.id === id ? { ...t, status: res.data.status } : t) || []
        }));

        // Initialize attendance states from database sessions
        const initialRecords = {};
        res.data.sessions?.forEach(s => {
          initialRecords[s.user_id] = s.attendance_status || (s.attended ? 'Present' : 'Absent');
        });
        setAttendanceRecords(initialRecords);
      }
    } catch (err) {
      console.error('Failed to fetch training details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectTraining = (t) => {
    setSelectedTraining(t);
    fetchTrainingDetails(t.id);
  };

  // ── Create Training Form ────────────────────────────────────────────────
  const [form, setForm] = useState({
    title: '', category: '', scheduled_date: '', start_time: '', end_time: '',
    venue: '', instructor: '', expected_participants: '', description: '',
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.scheduled_date) return;
    try {
      const res = await api.post('/trainings', {
        title: form.title,
        category: form.category,
        scheduled_date: form.scheduled_date,
        start_time: form.start_time || null,
        end_time: form.end_time || null,
        venue: form.venue || null,
        instructor: form.instructor || null,
        expected_participants: form.expected_participants ? parseInt(form.expected_participants) : null,
        description: form.description || null,
      });

      if (res.data && res.data.success) {
        const created = res.data.data;
        setState(p => ({ ...p, trainings: [created, ...(p.trainings || [])] }));
        setForm({ title: '', category: '', scheduled_date: '', start_time: '', end_time: '', venue: '', instructor: '', expected_participants: '', description: '' });
        setShowCreate(false);
        alert('Training session created successfully!');
      }
    } catch (err) {
      console.error('Failed to create training:', err);
      alert(err.response?.data?.message || 'Failed to create training session');
    }
  };

  // Attendance Handlers
  const handleToggleAttendance = (userId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [userId]: status
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedTraining) return;
    setSavingAttendance(true);

    // Default un-marked VHWs to 'Present'
    const finalPayload = vhwList.map(vhw => ({
      user_id: vhw.id,
      attendance_status: attendanceRecords[vhw.id] || 'Present'
    }));

    try {
      const res = await api.post(`/trainings/${selectedTraining.id}/sessions`, {
        attendance: finalPayload
      });
      if (res.data && res.data.success) {
        alert('Attendance saved successfully!');
        fetchTrainingDetails(selectedTraining.id);
      }
    } catch (err) {
      console.error('Failed to save attendance:', err);
      alert('Failed to save attendance.');
    } finally {
      setSavingAttendance(false);
    }
  };

  // Material Upload Handler
  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!materialTitle || !materialFile || !selectedTraining) return;
    setUploadingMaterial(true);
    try {
      const formData = new FormData();
      formData.append('file', materialFile);
      formData.append('title', materialTitle);

      const res = await api.post(`/trainings/${selectedTraining.id}/materials`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data && res.data.success) {
        setMaterialTitle('');
        setMaterialFile(null);
        const fileInput = document.getElementById('material-file-input');
        if (fileInput) fileInput.value = '';
        alert('Material uploaded successfully!');
        fetchTrainingDetails(selectedTraining.id);
      }
    } catch (err) {
      console.error('Failed to upload material:', err);
      alert(err.response?.data?.message || 'Failed to upload material.');
    } finally {
      setUploadingMaterial(false);
    }
  };

  // Evidence Upload Handler
  const handleUploadEvidence = async (e) => {
    e.preventDefault();
    if (!selectedTraining) return;
    setUploadingEvidence(true);
    try {
      const formData = new FormData();
      formData.append('type', evidenceType);
      formData.append('caption', evidenceCaption);
      if (evidenceType === 'Note') {
        formData.append('note_content', evidenceNote);
      } else if (evidenceFile) {
        formData.append('file', evidenceFile);
      }

      const res = await api.post(`/trainings/${selectedTraining.id}/evidence`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data && res.data.success) {
        setEvidenceCaption('');
        setEvidenceNote('');
        setEvidenceFile(null);
        const fileInput = document.getElementById('evidence-file-input');
        if (fileInput) fileInput.value = '';
        alert('Evidence uploaded successfully!');
        fetchTrainingDetails(selectedTraining.id);
      }
    } catch (err) {
      console.error('Failed to upload evidence:', err);
      alert(err.response?.data?.message || 'Failed to upload evidence.');
    } finally {
      setUploadingEvidence(false);
    }
  };

  // Report Submission Handler
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!selectedTraining) return;
    setSubmittingReport(true);
    
    // Count present participants
    const presentCount = Object.values(attendanceRecords).filter(status => status === 'Present').length;

    try {
      const res = await api.post(`/trainings/${selectedTraining.id}/report`, {
        topics_covered: reportForm.topics_covered,
        outcome: reportForm.outcome,
        remarks: reportForm.remarks,
        participants_count: presentCount
      });
      if (res.data && res.data.success) {
        alert('Training report submitted successfully! Session is now completed.');
        setReportForm({ topics_covered: '', outcome: '', remarks: '' });
        fetchTrainingDetails(selectedTraining.id);
      }
    } catch (err) {
      console.error('Failed to submit report:', err);
      alert(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setSubmittingReport(false);
    }
  };

  // Download PDF Report Handler
  const handleDownloadReportPdf = async (trainingId) => {
    try {
      const response = await api.get(`/trainings/${trainingId}/report/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `training-report-${trainingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed", err);
      alert("Failed to download PDF report");
    }
  };

  const getPresentCount = () => {
    return Object.values(attendanceRecords).filter(status => status === 'Present').length;
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-[var(--text-primary)]">Training & Capacity Building</h3>
          <p className="text-xs text-[var(--text-secondary)]">{trainings.length} training sessions managed</p>
        </div>
        <button
          id="btn-create-training"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Create Training
        </button>
      </div>

      {/* Sub-tab bar */}
      <div className="flex gap-1 overflow-x-auto bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1">
        {SUB_TABS.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              id={`train-tab-${t.id}`}
              onClick={() => setSubTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                subTab === t.id ? 'bg-[#0057B8] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-inner)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Selected Training Context Header */}
      {selectedTraining && subTab !== 'sessions' && (
        <div className="bg-[var(--bg-card)] border border-blue-500/20 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[9px] font-black uppercase tracking-wider text-blue-500">Active Session Target</p>
            <h4 className="text-sm font-black text-[var(--text-primary)]">{selectedTraining.title}</h4>
            <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">{selectedTraining.scheduled_date} · {selectedTraining.category}</p>
          </div>
          <button 
            onClick={() => { setSelectedTraining(null); setSelectedTrainingDetails(null); }}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-500/10 px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            Deselect
          </button>
        </div>
      )}

      {/* 1. SESSIONS TAB */}
      {subTab === 'sessions' && (
        <div className="space-y-3">
          {trainings.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-3 opacity-30" />
              <p className="text-sm font-bold text-[var(--text-primary)]">No trainings yet</p>
              <p className="text-xs text-[var(--text-secondary)]">Click "Create Training" to schedule a session</p>
            </div>
          ) : trainings.map((t, i) => (
            <div
              key={i}
              className={`bg-[var(--bg-card)] border rounded-xl p-4 hover:border-blue-300 transition-all cursor-pointer ${
                selectedTraining?.id === t.id ? 'border-blue-500 ring-2 ring-blue-500/15' : 'border-[var(--border-color)]'
              }`}
              onClick={() => handleSelectTraining(t)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[t.status] || 'bg-gray-100 text-gray-700'}`}>
                      {t.status}
                    </span>
                    <span className="text-xs font-bold text-blue-500">{t.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{t.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{t.scheduled_date}</span>
                    {t.start_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.start_time}–{t.end_time}</span>}
                    {t.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{t.venue}</span>}
                  </div>
                  {t.instructor && <p className="text-xs text-[var(--text-secondary)] mt-1">Trainer: {t.instructor}</p>}
                </div>
                {t.expected_participants && (
                  <div className="text-center shrink-0">
                    <p className="text-xl font-black text-blue-600">{t.expected_participants}</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">Expected</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. ATTENDANCE TAB */}
      {subTab === 'attendance' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
          {!selectedTraining ? (
            <div className="text-center py-8 text-[var(--text-secondary)] animate-fadeIn">
              <CheckSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">No active training selected</p>
              <p className="text-xs mt-1">Please select a session on the "Training Sessions" tab first to mark attendance.</p>
            </div>
          ) : loadingDetails || loadingVhws ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-xs font-bold text-[var(--text-secondary)]">Loading attendance roster...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
                <p className="text-sm font-bold text-[var(--text-primary)]">VHW Attendance Roster</p>
                <span className="text-xs font-semibold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                  Present: {getPresentCount()} / {vhwList.length}
                </span>
              </div>
              
              <div className="divide-y divide-[var(--border-color)] max-h-96 overflow-y-auto pr-1">
                {vhwList.map((vhw) => {
                  const status = attendanceRecords[vhw.id] || 'Present';
                  return (
                    <div key={vhw.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-xs font-bold text-[var(--text-primary)]">{vhw.name}</p>
                        <p className="text-[10px] text-[var(--text-secondary)]">{vhw.employee_id || 'Employee'}</p>
                      </div>
                      <div className="flex gap-1.5">
                        {['Present', 'Absent', 'Late'].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleToggleAttendance(vhw.id, s)}
                            disabled={selectedTrainingDetails?.status === 'Completed'}
                            className={`px-3 py-1 rounded text-[10px] font-bold transition cursor-pointer border ${
                              status === s
                                ? s === 'Present' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600'
                                  : s === 'Absent' ? 'bg-rose-500/10 border-rose-500 text-rose-600'
                                  : 'bg-amber-500/10 border-amber-500 text-amber-600'
                                : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-inner)]'
                            } ${selectedTrainingDetails?.status === 'Completed' ? 'opacity-75 cursor-not-allowed' : ''}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {vhwList.length === 0 && (
                  <p className="text-center py-6 text-xs text-[var(--text-secondary)]">No Village Health Workers registered in the system.</p>
                )}
              </div>

              {selectedTrainingDetails?.status !== 'Completed' && (
                <button
                  onClick={handleSaveAttendance}
                  disabled={savingAttendance}
                  className="w-full h-10 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {savingAttendance ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Attendance'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. MATERIALS TAB */}
      {subTab === 'materials' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
          {!selectedTraining ? (
            <div className="text-center py-8 text-[var(--text-secondary)]">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">No training selected</p>
              <p className="text-xs mt-1">Please select a session on the "Training Sessions" tab first to manage materials.</p>
            </div>
          ) : loadingDetails ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Upload Form */}
              {selectedTrainingDetails?.status !== 'Completed' && (
                <form onSubmit={handleUploadMaterial} className="bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl p-4 space-y-3.5">
                  <p className="text-xs font-black uppercase text-[var(--text-primary)] tracking-wide">Upload Training Document/Media</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] mb-1 block">Material Title</label>
                      <input 
                        type="text" 
                        value={materialTitle} 
                        onChange={e => setMaterialTitle(e.target.value)}
                        placeholder="e.g. Hypertension Care Manual" 
                        required
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] mb-1 block">File (PDF, PPT, Videos, Images)</label>
                      <input 
                        id="material-file-input"
                        type="file" 
                        required
                        onChange={e => setMaterialFile(e.target.files[0])}
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-1.5 text-[var(--text-primary)] focus:outline-none file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 file:text-[10px] file:font-bold hover:file:bg-blue-100"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={uploadingMaterial}
                    className="w-full bg-[#0057B8] hover:bg-blue-700 text-white font-bold h-9 rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {uploadingMaterial ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-3.5 h-3.5" /> Upload Material</>}
                  </button>
                </form>
              )}

              {/* Materials List */}
              <div className="space-y-3">
                <p className="text-xs font-black uppercase text-[var(--text-primary)] tracking-wide">Uploaded Materials</p>
                <div className="space-y-2">
                  {selectedTrainingDetails?.materials?.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-3 bg-[var(--bg-inner)] rounded-xl border border-[var(--border-color)] text-xs">
                      <div>
                        <p className="font-bold text-[var(--text-primary)]">{m.title}</p>
                        <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{m.file_name} ({(m.file_size_kb || 0).toLocaleString()} KB) · {m.material_type}</p>
                      </div>
                      <a 
                        href={`http://localhost:8000/storage/${m.file_path}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg font-bold text-[10px] hover:bg-blue-100 transition"
                      >
                        Open File
                      </a>
                    </div>
                  ))}
                  {(!selectedTrainingDetails?.materials || selectedTrainingDetails.materials.length === 0) && (
                    <div className="text-center py-6 text-[var(--text-secondary)]">
                      <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-xs">No materials uploaded for this session yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. EVIDENCE TAB */}
      {subTab === 'evidence' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
          {!selectedTraining ? (
            <div className="text-center py-8 text-[var(--text-secondary)]">
              <Image className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">No training selected</p>
              <p className="text-xs mt-1">Please select a session on the "Training Sessions" tab first to manage evidence logs.</p>
            </div>
          ) : loadingDetails ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Evidence Upload Form */}
              {selectedTrainingDetails?.status !== 'Completed' && (
                <form onSubmit={handleUploadEvidence} className="bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl p-4 space-y-3.5">
                  <p className="text-xs font-black uppercase text-[var(--text-primary)] tracking-wide">Submit Donor Evidence / Session Note</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] mb-1 block">Evidence Type</label>
                      <select 
                        value={evidenceType}
                        onChange={e => setEvidenceType(e.target.value)}
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none"
                      >
                        <option value="Photo">Photo</option>
                        <option value="Video">Video</option>
                        <option value="Note">Written Note</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] mb-1 block">Caption / Title</label>
                      <input 
                        type="text" 
                        value={evidenceCaption}
                        onChange={e => setEvidenceCaption(e.target.value)}
                        placeholder="e.g. VHWs practicing blood pressure checks"
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none"
                      />
                    </div>
                    {evidenceType === 'Note' ? (
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-[var(--text-secondary)] mb-1 block">Note Content</label>
                        <textarea 
                          rows={3}
                          value={evidenceNote}
                          onChange={e => setEvidenceNote(e.target.value)}
                          placeholder="Type training notes, outcomes, or observations here..."
                          required
                          className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none resize-none"
                        />
                      </div>
                    ) : (
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-[var(--text-secondary)] mb-1 block">Media File</label>
                        <input 
                          id="evidence-file-input"
                          type="file" 
                          required
                          onChange={e => setEvidenceFile(e.target.files[0])}
                          className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-1.5 text-[var(--text-primary)] focus:outline-none file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 file:text-[10px] file:font-bold hover:file:bg-blue-100"
                        />
                      </div>
                    )}
                  </div>
                  <button 
                    type="submit" 
                    disabled={uploadingEvidence}
                    className="w-full bg-[#0057B8] hover:bg-blue-700 text-white font-bold h-9 rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {uploadingEvidence ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-3.5 h-3.5" /> Save Evidence</>}
                  </button>
                </form>
              )}

              {/* Evidence Logs list */}
              <div className="space-y-3">
                <p className="text-xs font-black uppercase text-[var(--text-primary)] tracking-wide">Evidence Log</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {selectedTrainingDetails?.evidence?.map((ev) => (
                    <div key={ev.id} className="bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl p-3 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-1.5 mb-1.5">
                          <span className="font-bold text-blue-500 uppercase tracking-wider text-[9px]">{ev.type}</span>
                          <span className="text-[9px] text-[var(--text-secondary)]">{new Date(ev.created_at).toLocaleDateString()}</span>
                        </div>
                        {ev.caption && <p className="font-bold text-[var(--text-primary)] mb-1">{ev.caption}</p>}
                        {ev.type === 'Note' ? (
                          <p className="text-[11px] text-[var(--text-secondary)] italic leading-relaxed">&ldquo;{ev.note_content}&rdquo;</p>
                        ) : (
                          <div className="mt-2 text-center">
                            <a 
                              href={`http://localhost:8000/storage/${ev.file_path}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[10px] text-blue-600 font-bold hover:underline"
                            >
                              View Attached Media
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!selectedTrainingDetails?.evidence || selectedTrainingDetails.evidence.length === 0) && (
                    <div className="md:col-span-2 text-center py-6 text-[var(--text-secondary)]">
                      <Image className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-xs">No evidence logged yet. Save photos, videos, or session notes above.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. REPORTS TAB */}
      {subTab === 'reports' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
          {!selectedTraining ? (
            <div className="text-center py-8 text-[var(--text-secondary)]">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">No training selected</p>
              <p className="text-xs mt-1">Please select a session on the "Training Sessions" tab first to manage reports.</p>
            </div>
          ) : loadingDetails ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : selectedTrainingDetails?.training_report ? (
            /* Report submitted view */
            <div className="space-y-5">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3">
                <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-black text-emerald-700">Training Completed</p>
                  <p className="text-[10px] text-emerald-600 font-medium">Post-training report submitted successfully.</p>
                </div>
              </div>

              <div className="bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl p-4 space-y-3.5 text-xs">
                <p className="text-xs font-black uppercase text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">Completed Session Report</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase block">Participants Count</span>
                    <span className="font-bold text-sm text-[var(--text-primary)]">{selectedTrainingDetails.training_report.participants_count} VHWs</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase block">Evidence Count</span>
                    <span className="font-bold text-sm text-[var(--text-primary)]">{selectedTrainingDetails.training_report.photos_count} Photos · {selectedTrainingDetails.training_report.videos_count} Videos</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase block">Topics Covered</span>
                    <span className="text-[var(--text-primary)] leading-relaxed font-semibold block bg-[var(--bg-card)] p-2.5 rounded-lg border border-[var(--border-color)] mt-1">{selectedTrainingDetails.training_report.topics_covered}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase block">Session Outcome</span>
                    <span className="text-[var(--text-primary)] leading-relaxed font-semibold block bg-[var(--bg-card)] p-2.5 rounded-lg border border-[var(--border-color)] mt-1">{selectedTrainingDetails.training_report.outcome}</span>
                  </div>
                  {selectedTrainingDetails.training_report.remarks && (
                    <div className="col-span-2">
                      <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase block">Director Remarks</span>
                      <span className="text-[var(--text-primary)] leading-relaxed font-semibold block bg-[var(--bg-card)] p-2.5 rounded-lg border border-[var(--border-color)] mt-1">{selectedTrainingDetails.training_report.remarks}</span>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => handleDownloadReportPdf(selectedTraining.id)}
                className="w-full bg-[#0057B8] hover:bg-blue-700 text-white font-bold h-10 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4" /> Download PDF Certificate &amp; Report
              </button>
            </div>
          ) : (
            /* Submission Form */
            <div className="space-y-4">
              <div className="border-b border-[var(--border-color)] pb-3">
                <p className="text-sm font-bold text-[var(--text-primary)]">Submit Post-Training Documentation</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">Completes the training session and generates the PDF certificate.</p>
              </div>

              <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Topics Covered *</label>
                  <textarea 
                    rows={3} 
                    required
                    value={reportForm.topics_covered}
                    onChange={e => setReportForm({ ...reportForm, topics_covered: e.target.value })}
                    placeholder="List specific health codes, diagnosis protocols, or care guidelines taught..."
                    className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Training Outcome Summary *</label>
                  <textarea 
                    rows={3} 
                    required
                    value={reportForm.outcome}
                    onChange={e => setReportForm({ ...reportForm, outcome: e.target.value })}
                    placeholder="Summarize outcomes, participant performance, or overall takeaways..."
                    className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Additional Remarks (Optional)</label>
                  <textarea 
                    rows={2} 
                    value={reportForm.remarks}
                    onChange={e => setReportForm({ ...reportForm, remarks: e.target.value })}
                    placeholder="Notes for funding donors or future training recommendations..."
                    className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none resize-none"
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-[10px] text-[var(--text-secondary)] flex justify-between">
                  <span>Present Participants (from Attendance sheet):</span>
                  <span className="font-bold text-[var(--text-primary)]">{getPresentCount()} VHWs</span>
                </div>

                <button 
                  type="submit"
                  disabled={submittingReport}
                  className="w-full bg-[#0057B8] hover:bg-blue-700 text-white font-bold h-10 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submittingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Complete Session & Submit Report'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Create Training Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 w-full max-w-lg shadow-2xl m-4 animate-fadeIn">
            <h3 className="text-base font-black mb-4 text-[var(--text-primary)]">Create Training Session</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Training Title *</label>
                  <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Maternal Health Awareness Workshop"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Category *</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none" required>
                    <option value="">Select Category</option>
                    {TRAINING_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Date *</label>
                  <input type="date" value={form.scheduled_date} onChange={e => setForm(p => ({ ...p, scheduled_date: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Start Time</label>
                  <input type="time" value={form.start_time} onChange={e => setForm(p => ({ ...p, start_time: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">End Time</label>
                  <input type="time" value={form.end_time} onChange={e => setForm(p => ({ ...p, end_time: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Venue</label>
                  <input type="text" value={form.venue} onChange={e => setForm(p => ({ ...p, venue: e.target.value }))}
                    placeholder="Venue name or address"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Trainer Name</label>
                  <input type="text" value={form.instructor} onChange={e => setForm(p => ({ ...p, instructor: e.target.value }))}
                    placeholder="Trainer / Speaker"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Expected Participants</label>
                  <input type="number" value={form.expected_participants} onChange={e => setForm(p => ({ ...p, expected_participants: e.target.value }))}
                    placeholder="e.g. 30"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Description</label>
                  <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Brief description of training objectives..."
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none resize-none animate-fadeIn" />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-[#0057B8] text-white text-xs font-bold hover:bg-blue-700 cursor-pointer">Create Training</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
