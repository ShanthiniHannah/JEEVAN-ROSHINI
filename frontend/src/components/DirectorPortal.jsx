import React, { useState, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import {
  Users, Calendar, Clock, Heart, Award, CheckCircle2, XCircle,
  MapPin, ClipboardList, CheckSquare, AlertTriangle, TrendingUp,
  Activity, FileText, BarChart2, Eye, MessageSquare, Star, BookOpen,
  RefreshCw, Download, Phone, Plus, Edit3, Globe, Building, ArrowRight,
  ShieldCheck, RefreshCwIcon
} from 'lucide-react';

const TABS = [
  { id: 'approvals', label: 'Approval Workflows', icon: CheckSquare },
  { id: 'attendance', label: 'VHW Attendance', icon: Clock },
  { id: 'visits', label: 'Visit Audit Trail', icon: MapPin },
  { id: 'comparison', label: 'Village Comparison', icon: BarChart2 },
  { id: 'programs', label: 'Community Programs', icon: Heart },
  { id: 'evaluations', label: 'Performance', icon: Award },
  { id: 'training', label: 'Training', icon: BookOpen },
  { id: 'geography', label: 'Manage States', icon: Globe },
];

export default function DirectorPortal({ state, setState }) {
  const [activeTab, setActiveTab] = useState('approvals');
  const [newTraining, setNewTraining] = useState({ title: '', instructor: 'Dr. Ramesh Kumar', date: '', type: 'Online' });
  const [evalWorker, setEvalWorker] = useState('');
  const [evalForm, setEvalForm] = useState({ score: '5', attendance: '', visits: '', feedback: '' });
  const [successBanner, setSuccessBanner] = useState('');
  const [programFilter, setProgramFilter] = useState('all');
  const [newState, setNewState] = useState({ name: '', code: '', status: 'Active', pinRange: '' });

  // Village Comparison States
  const [villageA, setVillageA] = useState('VLG-4829'); // default Gundya
  const [villageB, setVillageB] = useState('VLG-7281'); // default Belur

  const notify = (msg) => { setSuccessBanner(msg); setTimeout(() => setSuccessBanner(''), 3000); };

  // Role-Based Data Visibility: Dr. Ramesh Kumar oversees Chikkamagaluru Block
  const assignedBlock = "Chikkamagaluru Block";
  const visibleVillages = useMemo(() => {
    return state.villages; // All demo villages belong to this scope
  }, [state.villages]);

  const visibleFamilies = useMemo(() => {
    return state.families;
  }, [state.families]);

  // Generic Approval Workflow Handlers
  const handleUpdateStatus = (entity, id, newStatus) => {
    setState(prev => {
      let nextState = { ...prev };
      let oldValue = 'Unknown';
      let entityName = '';

      if (entity === 'leaveRequests') {
        entityName = `Leave request ${id}`;
        nextState.leaveRequests = prev.leaveRequests.map(item => {
          if (item.id === id) {
            oldValue = item.status;
            return { ...item, status: newStatus };
          }
          return item;
        });
      } else if (entity === 'attendance') {
        entityName = `Attendance log ${id}`;
        nextState.attendance = prev.attendance.map(item => {
          if (item.id === id) {
            oldValue = item.approvalStatus || 'Submitted';
            return { ...item, approvalStatus: newStatus };
          }
          return item;
        });
      } else if (entity === 'villageReports') {
        entityName = `Village report ${id}`;
        nextState.villageReports = prev.villageReports.map(item => {
          if (item.id === id) {
            oldValue = item.status;
            return { ...item, status: newStatus };
          }
          return item;
        });
      } else if (entity === 'supportRecords') {
        entityName = `Beneficiary support record ${id}`;
        nextState.supportRecords = prev.supportRecords.map(item => {
          if (item.id === id) {
            oldValue = item.status || 'Submitted';
            return { ...item, status: newStatus };
          }
          return item;
        });
      } else if (entity === 'programs') {
        entityName = `Community program ${id}`;
        nextState.programs = prev.programs.map(item => {
          if (item.id === id) {
            oldValue = item.status || 'Submitted';
            return { ...item, status: newStatus };
          }
          return item;
        });
      } else if (entity === 'referrals') {
        entityName = `Referral record ${id}`;
        nextState.referrals = prev.referrals.map(item => {
          if (item.id === id) {
            oldValue = item.status;
            return { ...item, status: newStatus };
          }
          return item;
        });
      }

      // Add entry to central Audit Trail
      nextState.auditLogs.unshift({
        id: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
        user: 'Dr. Ramesh Kumar (Director)',
        action: 'UPDATE_APPROVAL_STATUS',
        desc: `Updated status of ${entityName} to ${newStatus}`,
        ip: '192.168.1.10',
        time: new Date().toLocaleString(),
        oldValue: oldValue,
        newValue: newStatus
      });

      return nextState;
    });
    notify(`Record status updated to ${newStatus}`);
  };

  const handleCreateTraining = (e) => {
    e.preventDefault();
    if (!newTraining.title || !newTraining.date) return;
    setState(prev => ({
      ...prev,
      trainings: [
        { id: 'TRN-' + Math.floor(1000 + Math.random() * 9000), ...newTraining, enrolledCount: 0 },
        ...(prev.trainings || [])
      ],
      auditLogs: [
        { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: 'Dr. Ramesh Kumar', action: 'CREATE_TRAINING', desc: `Scheduled training: ${newTraining.title}`, ip: '192.168.1.10', time: new Date().toLocaleString(), oldValue: 'None', newValue: newTraining.title },
        ...prev.auditLogs
      ]
    }));
    setNewTraining({ title: '', instructor: 'Dr. Ramesh Kumar', date: '', type: 'Online' });
    notify('Training session scheduled successfully!');
  };

  const handleAddState = (e) => {
    e.preventDefault();
    if (!newState.name || !newState.code) return;
    
    const exists = (state.states || []).some(
      s => s.name.toLowerCase() === newState.name.toLowerCase() || s.code.toLowerCase() === newState.code.toLowerCase()
    );
    if (exists) {
      alert("State name or code already exists.");
      return;
    }

    const s = {
      id: 'ST-' + Math.floor(100 + Math.random() * 900),
      name: newState.name,
      code: newState.code.toUpperCase(),
      status: newState.status,
      pinRange: newState.pinRange || '—'
    };

    setState(prev => ({
      ...prev,
      states: [...(prev.states || []), s],
      auditLogs: [
        { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: 'Dr. Ramesh Kumar', action: 'ADD_STATE', desc: `Added state ${s.name}`, ip: '192.168.1.10', time: new Date().toLocaleString(), oldValue: 'None', newValue: s.name },
        ...prev.auditLogs
      ]
    }));
    setNewState({ name: '', code: '', status: 'Active', pinRange: '' });
    notify(`State "${s.name}" added successfully!`);
  };

  const handleSubmitEvaluation = (e) => {
    e.preventDefault();
    if (!evalWorker || !evalForm.feedback) return;
    setState(prev => ({
      ...prev,
      evaluations: [
        {
          id: 'EVL-' + Math.floor(1000 + Math.random() * 9000),
          worker: evalWorker, score: evalForm.score,
          feedback: evalForm.feedback, date: new Date().toLocaleDateString()
        },
        ...(prev.evaluations || [])
      ],
      auditLogs: [
        { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: 'Dr. Ramesh Kumar', action: 'CREATE_EVALUATION', desc: `Evaluated staff: ${evalWorker}`, ip: '192.168.1.10', time: new Date().toLocaleString(), oldValue: 'None', newValue: evalForm.score },
        ...prev.auditLogs
      ]
    }));
    notify(`Performance evaluation submitted for ${evalWorker}!`);
    setEvalWorker(''); setEvalForm({ score: '5', attendance: '', visits: '', feedback: '' });
  };

  // Village Comparison metrics calculation
  const comparisonData = useMemo(() => {
    const getStats = (vId) => {
      const village = state.villages.find(v => v.id === vId) || {};
      const families = state.families.filter(f => f.villageId === vId);
      const famIds = families.map(f => f.id);
      
      const individuals = state.individuals.filter(i => famIds.includes(i.familyId));
      const totalVisits = state.visits.filter(v => famIds.includes(v.familyId)).length;
      
      const totalPreg = individuals.filter(i => i.gender === 'Female' && i.pregnancyStatus === 'Yes').length;
      const riskPreg = individuals.filter(i => i.gender === 'Female' && i.pregnancyStatus === 'Yes' && i.alerts?.some(a => a.type === 'High-Risk Pregnancy')).length;
      const riskPregPct = totalPreg > 0 ? Math.round((riskPreg / totalPreg) * 100) : 0;
      
      const children = individuals.filter(i => parseInt(i.age) <= 5);
      const malChildren = children.filter(c => c.malnutritionStatus === 'moderate' || c.malnutritionStatus === 'severe').length;
      const malPct = children.length > 0 ? Math.round((malChildren / children.length) * 100) : 0;

      // Attendance rate mock based on village name
      let attRate = 92;
      if (village.name?.includes('Gundya')) attRate = 96;
      else if (village.name?.includes('Belur')) attRate = 94;
      else if (village.name?.includes('Mudigere')) attRate = 88;

      return {
        name: village.name || 'Unknown',
        familiesCount: families.length,
        indCount: individuals.length,
        visits: totalVisits,
        maternalRiskPct: riskPregPct,
        malnutritionPct: malPct,
        attendanceRate: attRate
      };
    };

    return {
      A: getStats(villageA),
      B: getStats(villageB)
    };
  }, [villageA, villageB, state]);

  // Visit trend options for comparison chart
  const visitTrendOpts = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
    colors: ['#6366f1', '#10b981'],
    plotOptions: { bar: { columnWidth: '55%', borderRadius: 4 } },
    dataLabels: { enabled: false },
    xaxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], labels: { style: { colors: '#64748b', fontSize: '11px' } } },
    yaxis: { labels: { style: { colors: '#64748b' } } },
    grid: { borderColor: '#1e293b' },
    legend: { labels: { colors: '#94a3b8' } },
    theme: { mode: 'dark' },
    tooltip: { theme: 'dark' }
  };
  const visitTrendSeries = [
    { name: 'Preema D\'Souza', data: [6, 8, 5, state.visits.filter(v => v.vhwName?.includes('Preema')).length || 7] },
    { name: 'Shobha Nayak', data: [4, 6, 4, 5] }
  ];

  const trainings = state.trainings || [];
  const evaluations = state.evaluations || [];
  const vhwStaff = state.staff.filter(s => s.role === 'Village Health Worker');
  const filteredPrograms = programFilter === 'all' ? state.programs
    : state.programs.filter(p => p.topic?.toLowerCase().includes(programFilter));

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      {successBanner && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-500">
          <CheckCircle2 className="w-4 h-4" /> {successBanner}
        </div>
      )}

      {/* Header */}
      <div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-800 p-6 rounded-2xl relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.93) 30%, rgba(15, 23, 42, 0.4)), url(/other-portal-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="relative z-10">
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 backdrop-blur-sm">
            Project Director — {assignedBlock}
          </span>
          <h2 className="text-2xl font-black text-white mt-2 drop-shadow-md">Dr. Ramesh Kumar — Operations Control</h2>
          <p className="text-xs text-slate-300 mt-1 drop-shadow">Supervise rural VHW logs · Enforce approval workflows · Analyze block indices</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center relative z-10">
          <div className="bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-xl backdrop-blur-sm">
            <p className="text-xl font-extrabold text-blue-400">{state.visits.length}</p>
            <p className="text-[9px] text-slate-500 uppercase font-bold mt-0.5">Total Visits</p>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-xl backdrop-blur-sm">
            <p className="text-xl font-extrabold text-amber-400">
              {state.leaveRequests.filter(l => l.status === 'Submitted').length +
               state.attendance.filter(a => a.approvalStatus === 'Submitted').length +
               (state.villageReports?.filter(r => r.status === 'Submitted').length || 0) +
               state.referrals.filter(ref => ref.status === 'Submitted').length}
            </p>
            <p className="text-[9px] text-slate-500 uppercase font-bold mt-0.5">Pending Approvals</p>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-xl backdrop-blur-sm">
            <p className="text-xl font-extrabold text-emerald-400">{state.attendance.length}</p>
            <p className="text-[9px] text-slate-500 uppercase font-bold mt-0.5">Attendance Logs</p>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex overflow-x-auto border-b border-slate-800 gap-1">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}>
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── TAB: UNIFIED APPROVAL WORKFLOWS CENTER ── */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              NGO Field Operations Approval center
            </h3>
            <p className="text-xs text-slate-400 mb-4">Validate logs, check-ins, leave requests, and clinic referrals before records lock.</p>

            <div className="space-y-4">
              
              {/* SECTION 1: LEAVE REQUESTS */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Leave Applications ({state.leaveRequests.filter(l => l.status === 'Submitted' || l.status === 'Pending').length})</span>
                </div>
                <div className="divide-y divide-slate-800 bg-slate-950/20">
                  {state.leaveRequests.map(leave => (
                    <div key={leave.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-white">{leave.staffName} <span className="text-[10px] text-slate-500 font-mono">({leave.id})</span></p>
                        <p className="text-[11px] text-slate-400 mt-1">Start: {leave.startDate} · Days: {leave.days || leave.days_count} · Reason: <span className="italic text-slate-300">"{leave.reason}"</span></p>
                        <span className={`inline-block mt-2 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                          leave.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' :
                          'bg-amber-500/10 text-amber-400 animate-pulse'
                        }`}>{leave.status}</span>
                      </div>
                      
                      {/* Actions */}
                      {(leave.status === 'Submitted' || leave.status === 'Pending') && (
                        <div className="flex gap-1.5 shrink-0 self-end sm:self-center">
                          <button onClick={() => handleUpdateStatus('leaveRequests', leave.id, 'Approved')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition flex items-center gap-1">Approve</button>
                          <button onClick={() => handleUpdateStatus('leaveRequests', leave.id, 'Rejected')} className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition flex items-center gap-1">Reject</button>
                          <button onClick={() => handleUpdateStatus('leaveRequests', leave.id, 'Returned')} className="bg-slate-700 hover:bg-slate-650 text-slate-200 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition">Return</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: GPS ATTENDANCE LOGS */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Shift Check-Ins ({state.attendance.filter(a => a.approvalStatus === 'Submitted').length})</span>
                </div>
                <div className="divide-y divide-slate-800 bg-slate-950/20">
                  {state.attendance.filter(a => a.approvalStatus === 'Submitted').map(att => (
                    <div key={att.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-white">{att.staffName} <span className="text-[10px] text-slate-500 font-mono">({att.id})</span></p>
                        <p className="text-[11px] text-slate-400 mt-1">Date: {att.date} · Check-In: {att.checkIn} · Location: <span className="font-mono text-cyan-400">{att.gps}</span></p>
                      </div>
                      
                      <div className="flex gap-1.5 shrink-0 self-end sm:self-center">
                        <button onClick={() => handleUpdateStatus('attendance', att.id, 'Approved')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition">Approve</button>
                        <button onClick={() => handleUpdateStatus('attendance', att.id, 'Rejected')} className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition">Reject</button>
                      </div>
                    </div>
                  ))}
                  {state.attendance.filter(a => a.approvalStatus === 'Submitted').length === 0 && (
                    <p className="text-xs text-slate-500 italic p-4 text-center">No pending attendance approvals.</p>
                  )}
                </div>
              </div>

              {/* SECTION 3: REFERRALS */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Clinical Hospital Referrals ({state.referrals.filter(r => r.status === 'Submitted').length})</span>
                </div>
                <div className="divide-y divide-slate-800 bg-slate-950/20">
                  {state.referrals.map(ref => (
                    <div key={ref.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-white">Patient: {ref.patientName} <span className="text-[10px] text-slate-500 font-mono">({ref.id})</span></p>
                        <p className="text-[11px] text-slate-400 mt-1">Referred to: <span className="font-semibold text-slate-300">{ref.referredTo}</span> · Referred by: {ref.referredBy} · Reason: <span className="italic">"{ref.reason}"</span></p>
                        <span className={`inline-block mt-2 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          ref.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                          ref.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' :
                          'bg-amber-500/10 text-amber-400'
                        }`}>{ref.status}</span>
                      </div>
                      
                      {ref.status === 'Submitted' && (
                        <div className="flex gap-1.5 shrink-0 self-end sm:self-center">
                          <button onClick={() => handleUpdateStatus('referrals', ref.id, 'Approved')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition">Approve</button>
                          <button onClick={() => handleUpdateStatus('referrals', ref.id, 'Rejected')} className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition">Reject</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: SOCIAL SUPPORT ASSISTANCE */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Beneficiary Social Support ({supportRecords.filter(s => s.status === 'Submitted').length})</span>
                </div>
                <div className="divide-y divide-slate-800 bg-slate-950/20">
                  {supportRecords.map(sup => (
                    <div key={sup.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-white">Beneficiary: {sup.beneficiary} <span className="text-[10px] text-slate-500 font-mono">({sup.id})</span></p>
                        <p className="text-[11px] text-slate-400 mt-1">Aid: <span className="font-semibold text-slate-300">{sup.support}</span> · Scheme: {sup.scheme} · Date: {sup.date}</p>
                        <span className={`inline-block mt-2 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          sup.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                          sup.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' :
                          'bg-amber-500/10 text-amber-400'
                        }`}>{sup.status || 'Approved'}</span>
                      </div>
                      
                      {sup.status === 'Submitted' && (
                        <div className="flex gap-1.5 shrink-0 self-end sm:self-center">
                          <button onClick={() => handleUpdateStatus('supportRecords', sup.id, 'Approved')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition">Approve</button>
                          <button onClick={() => handleUpdateStatus('supportRecords', sup.id, 'Rejected')} className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition">Reject</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── TAB: VHW ATTENDANCE ── */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Present Today</p>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">
                {state.attendance.filter(a => a.date === new Date().toLocaleDateString() || a.status === 'Present').length || 2}
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-500 uppercase">On Approved Leave</p>
              <p className="text-2xl font-extrabold text-amber-400 mt-1">{state.leaveRequests.filter(l => l.status === 'Approved').length}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Avg Attendance Rate</p>
              <p className="text-2xl font-extrabold text-blue-400 mt-1">94.6%</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" /> GPS-Verified Daily Attendance
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="p-4">Log ID</th>
                    <th className="p-4">Staff Member</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Check-In</th>
                    <th className="p-4">Check-Out</th>
                    <th className="p-4">GPS Location</th>
                    <th className="p-4">Approval Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {state.attendance.map(att => (
                    <tr key={att.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-mono text-[10px]">{att.id}</td>
                      <td className="p-4 font-bold text-slate-200">{att.staffName}</td>
                      <td className="p-4 text-slate-400">{att.date}</td>
                      <td className="p-4 font-mono text-slate-300">{att.checkIn}</td>
                      <td className="p-4 font-mono text-slate-300">{att.checkOut}</td>
                      <td className="p-4 font-mono text-cyan-400">{att.gps}</td>
                      <td className="p-4">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          (att.approvalStatus || att.status) === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400 animate-pulse'
                        }`}>
                          {att.approvalStatus || 'Approved'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: VISIT AUDIT TRAIL ── */}
      {activeTab === 'visits' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" /> Real-time GPS Field Visit Audit logs
            </h3>
            <span className="text-[10px] text-slate-400">Chronological list of registered house visits</span>
          </div>

          <div className="space-y-3.5">
            {state.visits.map(visit => (
              <div key={visit.id} className="border border-slate-800 rounded-xl p-4 bg-slate-950/20 hover:border-slate-700 transition">
                <div className="flex flex-row justify-between items-start gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{visit.vhwName}</h4>
                    <p className="text-[10.5px] text-slate-400 mt-1">Visited Family: <span className="font-bold text-indigo-400">{visit.familyId}</span> on {visit.date}</p>
                  </div>
                  <span className="text-[9px] bg-slate-800 border border-slate-750 px-2 py-0.5 rounded-full font-mono text-cyan-400">📍 {visit.gps}</span>
                </div>
                
                <div className="mt-2.5 bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] leading-relaxed text-slate-300">
                  <span className="font-bold text-slate-500">Visit Notes:</span> "{visit.notes}"
                </div>

                <div className="flex items-center gap-4 mt-2 text-[9px] text-slate-500 font-mono">
                  <span>Temp: {visit.tempDeg}°F</span>
                  <span>BP: {visit.bpSys}/{visit.bpDia} mmHg</span>
                  {visit.followUpDate && <span className="text-amber-400">Next checkup scheduled: {visit.followUpDate}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: DISTRICT & VILLAGE COMPARISON CENTER ── */}
      {activeTab === 'comparison' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-400" />
              Socio-Health Village Comparison Dashboard
            </h3>
            <span className="text-[10px] text-slate-400">Compare rural health indicators side-by-side</span>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Select Village A</label>
              <select 
                value={villageA} 
                onChange={(e) => setVillageA(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
              >
                {state.villages.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Select Village B</label>
              <select 
                value={villageB} 
                onChange={(e) => setVillageB(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
              >
                {state.villages.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Side by Side Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            {/* VILLAGE A PANELS */}
            <div className="bg-slate-950/40 p-5 rounded-2xl border border-indigo-950/30 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="text-sm font-black text-indigo-400">{comparisonData.A.name}</h4>
                <span className="text-[9px] bg-indigo-500/10 px-2 py-0.5 rounded text-indigo-300 font-mono">A</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl">
                  <p className="text-lg font-bold text-slate-200">{comparisonData.A.familiesCount}</p>
                  <p className="text-[9px] text-slate-500 uppercase mt-0.5">Families</p>
                </div>
                <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl">
                  <p className="text-lg font-bold text-slate-200">{comparisonData.A.indCount}</p>
                  <p className="text-[9px] text-slate-500 uppercase mt-0.5">Individuals</p>
                </div>
              </div>

              {/* Progress metrics */}
              <div className="space-y-3.5 pt-2">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-400">Total Visits (Visits / Month)</span>
                    <span className="font-bold text-blue-400">{comparisonData.A.visits} visits</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(comparisonData.A.visits * 10, 100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-400">High-Risk Pregnancies</span>
                    <span className="font-bold text-rose-400">{comparisonData.A.maternalRiskPct}% Risk</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${comparisonData.A.maternalRiskPct}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-400">Malnutrition Rate (Under-5)</span>
                    <span className="font-bold text-amber-400">{comparisonData.A.malnutritionPct}% SAM/MAM</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${comparisonData.A.malnutritionPct}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-400">VHW Shift Attendance Rate</span>
                    <span className="font-bold text-emerald-400">{comparisonData.A.attendanceRate}%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${comparisonData.A.attendanceRate}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* VILLAGE B PANELS */}
            <div className="bg-slate-950/40 p-5 rounded-2xl border border-emerald-950/20 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="text-sm font-black text-emerald-400">{comparisonData.B.name}</h4>
                <span className="text-[9px] bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-300 font-mono">B</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl">
                  <p className="text-lg font-bold text-slate-200">{comparisonData.B.familiesCount}</p>
                  <p className="text-[9px] text-slate-500 uppercase mt-0.5">Families</p>
                </div>
                <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl">
                  <p className="text-lg font-bold text-slate-200">{comparisonData.B.indCount}</p>
                  <p className="text-[9px] text-slate-500 uppercase mt-0.5">Individuals</p>
                </div>
              </div>

              {/* Progress metrics */}
              <div className="space-y-3.5 pt-2">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-400">Total Visits (Visits / Month)</span>
                    <span className="font-bold text-blue-400">{comparisonData.B.visits} visits</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(comparisonData.B.visits * 10, 100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-400">High-Risk Pregnancies</span>
                    <span className="font-bold text-rose-400">{comparisonData.B.maternalRiskPct}% Risk</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${comparisonData.B.maternalRiskPct}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-400">Malnutrition Rate (Under-5)</span>
                    <span className="font-bold text-amber-400">{comparisonData.B.malnutritionPct}% SAM/MAM</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${comparisonData.B.malnutritionPct}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-400">VHW Shift Attendance Rate</span>
                    <span className="font-bold text-emerald-400">{comparisonData.B.attendanceRate}%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${comparisonData.B.attendanceRate}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── TAB: COMMUNITY PROGRAMS ── */}
      {activeTab === 'programs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-400" /> Weekly Awareness Activities
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Community programs conducted by VHWs in mapped villages</p>
            </div>
            <div className="flex gap-2 text-xs">
              {['all', 'hygiene', 'nutrition', 'tobacco'].map(cat => (
                <button key={cat} onClick={() => setProgramFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg border font-bold transition ${
                    programFilter === cat ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}>
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrograms.map(prog => (
              <div key={prog.id} className="border border-slate-800 p-4 rounded-xl bg-slate-950/20 space-y-2 flex flex-col justify-between hover:border-slate-700 transition">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{prog.topic}</span>
                    <span className="text-[10px] font-mono text-slate-500">{prog.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-2">Village sector: {prog.villageName}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed"><span className="font-bold text-slate-500">Outcome:</span> "{prog.outcome}"</p>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800/80 pt-2 mt-2 text-[10px]">
                  <span className="text-slate-500">Participants: <span className="font-bold text-slate-300">{prog.participants}</span></span>
                  <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-full ${prog.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {prog.status || 'Approved'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: PERFORMANCE EVALUATIONS ── */}
      {activeTab === 'evaluations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              Active VHW Performance Metrics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/30 border border-slate-800 rounded-xl">
                <ReactApexChart options={perfChartOpts} series={perfChartSeries} type="radar" height={220} />
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Historical Evaluation Index</h4>
                {evaluations.map(ev => (
                  <div key={ev.id} className="border border-slate-800 bg-slate-950/20 p-3 rounded-lg text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">{ev.worker}</span>
                      <span className="text-amber-400 font-extrabold flex items-center gap-0.5">{"★".repeat(parseInt(ev.score))}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 italic">"{ev.feedback}"</p>
                    <span className="block text-[8px] text-slate-500 mt-2 text-right">{ev.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form to submit performance review */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 mb-4">Evaluate Field Worker</h3>
            <form onSubmit={handleSubmitEvaluation} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Select Worker</label>
                <select value={evalWorker} onChange={e => setEvalWorker(e.target.value)} required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                  <option value="">-- Choose VHW --</option>
                  {vhwStaff.map(s => <option key={s.id} value={s.name}>{s.name} (VHW)</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Rating Star Score (1-5)</label>
                <select value={evalForm.score} onChange={e => setEvalForm({ ...evalForm, score: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Good)</option>
                  <option value="3">3 Stars (Satisfactory)</option>
                  <option value="2">2 Stars (Needs training)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Director Feedback &amp; Directives</label>
                <textarea value={evalForm.feedback} onChange={e => setEvalForm({ ...evalForm, feedback: e.target.value })} required
                  placeholder="Enter monthly review, directives, or training suggestions..." rows="4"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"></textarea>
              </div>

              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition">
                Submit Monthly Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── TAB: TRAINING MODULES ── */}
      {activeTab === 'training' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" /> Active VHW Training &amp; Syllabus Modules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainings.map(trn => (
                <div key={trn.id} className="border border-slate-800 bg-slate-950/20 p-4 rounded-xl space-y-2 flex flex-col justify-between hover:border-slate-700 transition">
                  <div>
                    <span className="text-[8px] bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded text-purple-400 uppercase tracking-widest font-extrabold">{trn.type}</span>
                    <h4 className="text-xs font-bold text-white mt-2">{trn.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Instructor: {trn.instructor}</p>
                  </div>
                  <div className="border-t border-slate-800/80 pt-2 mt-2 flex justify-between items-center text-[9px] text-slate-500">
                    <span>Enrolled VHWs: <span className="font-bold text-slate-300">{trn.enrolledCount} workers</span></span>
                    <span>Date: {trn.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 mb-4">Schedule Training</h3>
            <form onSubmit={handleCreateTraining} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Module Title</label>
                <input type="text" value={newTraining.title} onChange={e => setNewTraining({ ...newTraining, title: e.target.value })} required
                  placeholder="e.g. Non-Communicable Diseases Surveillance"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Training Type</label>
                <select value={newTraining.type} onChange={e => setNewTraining({ ...newTraining, type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                  <option value="Online">Online Video / Webinar</option>
                  <option value="On-Site Workshop">On-Site Workshop at Block PHC</option>
                  <option value="Field Training">Field Demonstration Session</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Schedule Date</label>
                <input type="date" value={newTraining.date} onChange={e => setNewTraining({ ...newTraining, date: e.target.value })} required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition">
                Publish Training Session
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── TAB: MANAGE GEOGRAPHY ── */}
      {activeTab === 'geography' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" /> Active Operating States Registry
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="p-4">State Code</th>
                    <th className="p-4">State Name</th>
                    <th className="p-4">PIN Code Ranges</th>
                    <th className="p-4">Operations Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {(state.states || []).slice(0, 6).map(st => (
                    <tr key={st.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-mono font-bold text-emerald-400">{st.code}</td>
                      <td className="p-4 text-slate-200 font-semibold">{st.name}</td>
                      <td className="p-4 font-mono text-slate-400">{st.pinRange || '577XXX'}</td>
                      <td className="p-4">
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-bold">{st.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 mb-4">Add Operating State</h3>
            <form onSubmit={handleAddState} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">State Name</label>
                <input type="text" value={newState.name} onChange={e => setNewState({ ...newState, name: e.target.value })} required
                  placeholder="e.g. Karnataka"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">State ISO Code</label>
                <input type="text" value={newState.code} onChange={e => setNewState({ ...newState, code: e.target.value })} required
                  placeholder="e.g. KA" maxLength={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Target PIN Code Range</label>
                <input type="text" value={newState.pinRange} onChange={e => setNewState({ ...newState, pinRange: e.target.value })}
                  placeholder="e.g. 577101 - 577120"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white" />
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition">
                Map Operating State
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
