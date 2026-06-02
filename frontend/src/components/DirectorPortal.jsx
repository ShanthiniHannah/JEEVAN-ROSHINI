import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/apiClient.js';
import {
  Users, Clock, Heart, Award, CheckCircle2,
  MapPin, ClipboardList, CheckSquare, BarChart2, BookOpen, Globe
} from 'lucide-react';

// Decoupled Sub-Components
import ApprovalWorkflows from './director/ApprovalWorkflows';
import VhwAttendance from './director/VhwAttendance';
import VisitAuditTrail from './director/VisitAuditTrail';
import VillageComparison from './director/VillageComparison';
import CommunityPrograms from './director/CommunityPrograms';
import PerformanceEvaluations from './director/PerformanceEvaluations';
import DirectorTraining from './director/DirectorTraining';
import GeographyManagement from './director/GeographyManagement';

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
  const { subTab } = useParams();
  const navigate = useNavigate();
  const activeTab = subTab || 'approvals';
  const setActiveTab = (newTab) => {
    navigate(`/director/${newTab}`);
  };

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
  const handleUpdateStatus = async (entity, id, newStatus) => {
    if (entity === 'leaveRequests') {
      try {
        const response = await api.post('/approvals/action', {
          approval_id: id,
          status: newStatus === 'Approved' ? 'Approved' : 'Rejected',
          notes: 'Processed via Director Portal'
        });
        if (response.data.success) {
          const freshLeaves = await api.get('/leaves');
          setState(prev => ({ 
            ...prev, 
            leaveRequests: freshLeaves.data.data || freshLeaves.data 
          }));
          notify(`Leave request status updated to ${newStatus}`);
        }
      } catch (err) {
        alert(err.response?.data?.message || "Failed to process leave request approval.");
      }
      return;
    }

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
      const families = state.families.filter(f => (f.villageId || f.village_id) === vId);
      const famIds = families.map(f => f.id);
      
      const individuals = state.individuals.filter(i => famIds.includes(i.familyId || i.family_id));
      const totalVisits = state.visits.filter(v => famIds.includes(v.familyId || v.family_id)).length;
      
      const totalPreg = individuals.filter(i => i.gender === 'Female' && i.pregnancyStatus === 'Yes').length;
      const riskPreg = individuals.filter(i => i.gender === 'Female' && i.pregnancyStatus === 'Yes' && i.alerts?.some(a => a.type === 'High-Risk Pregnancy')).length;
      const riskPregPct = totalPreg > 0 ? Math.round((riskPreg / totalPreg) * 100) : 0;
      
      const children = individuals.filter(i => parseInt(i.age) <= 5);
      const malnutritionChildren = children.filter(c => c.malnutritionStatus === 'moderate' || c.malnutritionStatus === 'severe').length;
      const malnutritionPct = children.length > 0 ? Math.round((malnutritionChildren / children.length) * 100) : 0;

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
        malnutritionPct: malnutritionPct,
        attendanceRate: attRate
      };
    };

    return {
      A: getStats(villageA),
      B: getStats(villageB)
    };
  }, [villageA, villageB, state]);

  const trainings = state.trainings || [];
  const evaluations = state.evaluations || [];
  const vhwStaff = state.staff.filter(s => s.role === 'Village Health Worker');
  
  const filteredPrograms = programFilter === 'all' 
    ? state.programs 
    : state.programs.filter(p => p.topic?.toLowerCase().includes(programFilter));

  const supportRecords = state.supportRecords || [];

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      {successBanner && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-500 animate-bounce">
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

      {/* Modular Tab Content */}
      <div className="relative z-10 mt-4">
        {activeTab === 'approvals' && (
          <ApprovalWorkflows 
            state={state}
            supportRecords={supportRecords}
            handleUpdateStatus={handleUpdateStatus}
          />
        )}

        {activeTab === 'attendance' && (
          <VhwAttendance 
            state={state}
          />
        )}

        {activeTab === 'visits' && (
          <VisitAuditTrail 
            state={state}
          />
        )}

        {activeTab === 'comparison' && (
          <VillageComparison 
            state={state}
            villageA={villageA}
            setVillageA={setVillageA}
            villageB={villageB}
            setVillageB={setVillageB}
            comparisonData={comparisonData}
          />
        )}

        {activeTab === 'programs' && (
          <CommunityPrograms 
            programFilter={programFilter}
            setProgramFilter={setProgramFilter}
            filteredPrograms={filteredPrograms}
          />
        )}

        {activeTab === 'evaluations' && (
          <PerformanceEvaluations 
            evalWorker={evalWorker}
            setEvalWorker={setEvalWorker}
            evalForm={evalForm}
            setEvalForm={setEvalForm}
            vhwStaff={vhwStaff}
            evaluations={evaluations}
            handleSubmitEvaluation={handleSubmitEvaluation}
          />
        )}

        {activeTab === 'training' && (
          <DirectorTraining 
            newTraining={newTraining}
            setNewTraining={setNewTraining}
            trainings={trainings}
            handleCreateTraining={handleCreateTraining}
          />
        )}

        {activeTab === 'geography' && (
          <GeographyManagement 
            state={state}
            newState={newState}
            setNewState={setNewState}
            handleAddState={handleAddState}
          />
        )}
      </div>

    </div>
  );
}
