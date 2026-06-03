import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { evaluateRiskAlerts } from '../utils/riskAlertEngine';
import { api } from '../services/apiClient.js';
import { 
  Users, MapPin, ClipboardList, BookOpen, Clock, Heart, 
  Wifi, WifiOff, RefreshCw, CheckCircle2, AlertTriangle
} from 'lucide-react';

// Decoupled Sub-Components
import VhwDashboard from './vhw/VhwDashboard';
import VillageForm from './vhw/VillageForm';
import FamilyForm from './vhw/FamilyForm';
import IndividualForm from './vhw/IndividualForm';
import VisitForm from './vhw/VisitForm';
import EchrViewer from './vhw/EchrViewer';
import ProgramForm from './vhw/ProgramForm';
import AttendanceTracker from './vhw/AttendanceTracker';
import TrainingPortal from './vhw/TrainingPortal';
import SyncSandbox from './vhw/SyncSandbox';

export default function VhwPortal({ 
  state, 
  setState, 
  isOnline, 
  setIsOnline, 
  offlineQueue, 
  setOfflineQueue, 
  triggerSync,
  currentUser,
  env
}) {
  const { t } = useTranslation();
  const { subTab } = useParams();
  const navigate = useNavigate();
  const activeSubTab = subTab || 'home';
  const setActiveSubTab = (newTab) => {
    navigate(`/vhw/${newTab}`);
  };

  const currentVhwName = currentUser ? currentUser.name : "Preema D'Souza";
  const currentVhwId = currentUser ? currentUser.id : "STF-104";
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Role-Based Data Visibility (Assigned Villages)
  const assignedVillageIds = useMemo(() => {
    let baseIds = [];
    if (currentUser?.name?.includes('Preema')) {
      baseIds = ['VLG-4829', 'VLG-1029']; // Gundya, Mudigere
    } else if (currentUser?.name?.includes('Shobha')) {
      baseIds = ['VLG-7281']; // Belur
    } else {
      return state.villages.map(v => v.id);
    }
    // Also include any villages that are newly submitted/created or not part of default static ones
    const newVillageIds = state.villages
      .filter(v => v.status === 'Submitted' || !['VLG-4829', 'VLG-1029', 'VLG-7281', 'VLG-5521', 'VLG-3318'].includes(v.id))
      .map(v => v.id);
    return [...new Set([...baseIds, ...newVillageIds])];
  }, [currentUser, state.villages]);

  const visibleVillages = useMemo(() => {
    return state.villages.filter(v => assignedVillageIds.includes(v.id));
  }, [state.villages, assignedVillageIds]);

  const visibleFamilies = useMemo(() => {
    return state.families.filter(f => assignedVillageIds.includes(f.villageId || f.village_id));
  }, [state.families, assignedVillageIds]);

  const visibleIndividuals = useMemo(() => {
    return state.individuals.filter(ind => {
      const fam = state.families.find(f => f.id === (ind.familyId || ind.family_id));
      return fam && assignedVillageIds.includes(fam.villageId || fam.village_id);
    });
  }, [state.individuals, state.families, assignedVillageIds]);

  // Form Wizard States
  const [familyStep, setFamilyStep] = useState(1);
  const [visitStep, setVisitStep] = useState(1);

  // VHW Local states for forms
  const [villageForm, setVillageForm] = useState({
    name: '', population: '', waterStatus: 'Adequate', sanitationStatus: 'Good', riskStatus: 'Low'
  });
  
  const [familyForm, setFamilyForm] = useState({
    villageId: '', houseNo: '', economicStatus: 'BPL', occupation: '', drinkingWater: 'Tap', toilet: 'Yes'
  });

  const [individualForm, setIndividualForm] = useState({
    familyId: '', name: '', age: '', gender: 'Female', phone: '', bloodGroup: 'O+', 
    chronicDiseases: [], pregnancyStatus: 'No', vaccinationStatus: 'Partial', 
    disabilityStatus: 'No', malnutritionStatus: 'none', livingAlone: 'no',
    consentGiven: false, consentMethod: 'Thumbprint'
  });

  const [visitForm, setVisitForm] = useState({
    familyId: '', notes: '', followUpDate: '', tempDeg: '98.6', bpSys: '120', bpDia: '80'
  });

  const [programForm, setProgramForm] = useState({
    villageId: '', topic: 'Menstrual Hygiene', participants: '', outcome: ''
  });

  // Attendance states
  const [attendanceStatus, setAttendanceStatus] = useState('checked-out');
  const [attendanceTime, setAttendanceTime] = useState(null);
  const [gpsCoords, setGpsCoords] = useState(null);
  const [leaveForm, setLeaveForm] = useState({ reason: '', days: '1', startDate: '' });

  // Quiz States
  const [quizScore, setQuizScore] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const quizQuestions = [
    {
      id: 1,
      q: "What is a primary danger sign in a pregnant mother requiring immediate hospital referral?",
      options: ["Mild morning sickness", "Severe headache and blurred vision", "Craving sour foods", "Increased appetite"],
      answer: 1
    },
    {
      id: 2,
      q: "How often should an active diabetes patient be tracked for follow-up visits?",
      options: ["Once a year", "Every six months", "Monthly", "Only when they feel sick"],
      answer: 2
    },
    {
      id: 3,
      q: "Which age group is critical for severe acute malnutrition (SAM) tracking?",
      options: ["Under 5 years", "Adolescents", "Adults (20-45)", "Elderly over 65"],
      answer: 0
    }
  ];

  // Sync simulation sandbox states
  const [syncLogs, setSyncLogs] = useState([]);
  const [isSimulatingSync, setIsSimulatingSync] = useState(false);

  // Privacy Control (PII Masking) state
  const [revealedPii, setRevealedPii] = useState({}); // maps patientId -> true/false

  // Helpers to show notifications
  const notify = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const notifyError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 5000);
  };

  // Generate GPS coordinates
  const simulateGps = () => {
    const lat = (12.9716 + (Math.random() - 0.5) * 0.05).toFixed(4);
    const lng = (77.5946 + (Math.random() - 0.5) * 0.05).toFixed(4);
    setGpsCoords({ lat, lng });
  };

  useEffect(() => {
    simulateGps();
  }, [activeSubTab]);

  // Form Handlers
  const handleAddVillage = async (e) => {
    e.preventDefault();
    if (!villageForm.name) return;
    const newVillage = {
      id: 'VLG-' + Math.floor(1000 + Math.random() * 9000),
      status: 'Submitted', // Approval status
      ...villageForm
    };

    if (isOnline) {
      try {
        const response = await api.post('/sync', { queue: [{ type: 'village', data: newVillage }] });
        if (response.data.success) {
          setState(prev => ({ 
            ...prev, 
            villages: [...prev.villages, newVillage]
          }));
          notify("Village registered successfully and submitted for review!");
        }
      } catch (err) {
        notifyError(err.response?.data?.message || "Failed to register village.");
      }
    } else {
      setOfflineQueue(prev => [...prev, { type: 'village', data: newVillage }]);
      setState(prev => ({ 
        ...prev, 
        villages: [...prev.villages, newVillage]
      }));
      notify("Offline Mode: Village report saved to local queue.");
    }
    setVillageForm({ name: '', population: '', waterStatus: 'Adequate', sanitationStatus: 'Good', riskStatus: 'Low' });
  };

  const handleAddFamily = async (e) => {
    e.preventDefault();
    if (!familyForm.villageId || !familyForm.houseNo) return;

    // ── DUPLICATE PREVENTION ──
    const isDuplicate = state.families.some(f => (f.villageId || f.village_id) === familyForm.villageId && f.houseNo === familyForm.houseNo) ||
                        offlineQueue.some(q => q.type === 'family' && (q.data.villageId || q.data.village_id) === familyForm.villageId && q.data.houseNo === familyForm.houseNo);
    
    if (isDuplicate) {
      notifyError("Error: A family with this House No. is already registered in this village!");
      return;
    }

    const selectedVillage = state.villages.find(v => v.id === familyForm.villageId);
    const newFamily = {
      id: `FAM-${familyForm.villageId.split('-')[1] || 'VLG'}-${familyForm.houseNo}`,
      villageName: selectedVillage ? selectedVillage.name : 'Unknown Village',
      status: 'Submitted', // Approval workflow
      ...familyForm
    };

    if (isOnline) {
      try {
        const response = await api.post('/families', {
          id: newFamily.id,
          village_id: familyForm.villageId,
          house_no: familyForm.houseNo,
          economic_status: familyForm.economicStatus,
          occupation: familyForm.occupation,
          drinking_water_source: familyForm.drinkingWater,
          toilet_availability: familyForm.toilet
        });
        if (response.data.success) {
          const freshFamilies = await api.get('/families');
          setState(prev => ({ 
            ...prev, 
            families: freshFamilies.data.data || freshFamilies.data
          }));
          notify("Family registered and submitted for review!");
        }
      } catch (err) {
        notifyError(err.response?.data?.message || "Failed to register family.");
      }
    } else {
      setOfflineQueue(prev => [...prev, { type: 'family', data: newFamily }]);
      notify("Offline Mode: Family registration queued locally.");
    }
    setFamilyForm({ villageId: '', houseNo: '', economicStatus: 'BPL', occupation: '', drinkingWater: 'Tap', toilet: 'Yes' });
    setFamilyStep(1);
  };

  const handleAddIndividual = async (e) => {
    e.preventDefault();
    if (!individualForm.familyId || !individualForm.name || !individualForm.age) return;

    // ── DATA VALIDATION RULES ──
    if (individualForm.gender === 'Male' && individualForm.pregnancyStatus === 'Yes') {
      notifyError("Validation Failure: Pregnant status cannot be active for a male patient!");
      return;
    }

    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodGroups.includes(individualForm.bloodGroup)) {
      notifyError("Validation Failure: Invalid blood group format!");
      return;
    }

    const isDuplicate = state.individuals.some(i => i.name.toLowerCase() === individualForm.name.toLowerCase() && i.age === individualForm.age) ||
                        offlineQueue.some(q => q.type === 'individual' && q.data.name.toLowerCase() === individualForm.name.toLowerCase() && q.data.age === individualForm.age);
    if (isDuplicate) {
      notifyError("Error: An individual with this Name & Age is already registered!");
      return;
    }

    if (individualForm.chronicDiseases.includes('Diabetes') && parseInt(individualForm.age) < 5) {
      alert("Clinical Alert: Juvenile diabetes flagged. Double check clinical screening entry!");
    }

    const newInd = {
      id: `JR-${individualForm.familyId.split('-')[2] || 'IND'}-${String(state.individuals.filter(ind => (ind.familyId || ind.family_id) === individualForm.familyId).length + 1).padStart(2, '0')}`,
      status: 'Active',
      ...individualForm
    };

    if (isOnline) {
      try {
        const response = await api.post('/individuals', {
          id: newInd.id,
          family_id: individualForm.familyId,
          name: individualForm.name,
          age: individualForm.age,
          gender: individualForm.gender,
          blood_group: individualForm.bloodGroup,
          mobile_number: individualForm.phone,
          pregnancy_status: individualForm.pregnancyStatus,
          vaccination_status: individualForm.vaccinationStatus,
          disability_status: individualForm.disabilityStatus,
          malnutrition_status: individualForm.malnutritionStatus,
          living_alone: individualForm.livingAlone
        });
        if (response.data.success) {
          const [freshIndividuals, freshDashboard] = await Promise.all([
            api.get('/individuals'),
            api.get('/dashboard')
          ]);
          const serverIndividuals = freshIndividuals.data.data || freshIndividuals.data;
          setState(prev => ({ 
            ...prev, 
            individuals: serverIndividuals,
            _loaded: true
          }));
          notify("Patient registered successfully & Health ID generated!");
        }
      } catch (err) {
        notifyError(err.response?.data?.message || "Failed to register individual.");
      }
    } else {
      setOfflineQueue(prev => [...prev, { type: 'individual', data: newInd }]);
      notify("Offline Mode: Patient queued in local storage.");
    }

    setIndividualForm({
      familyId: '', name: '', age: '', gender: 'Female', phone: '', bloodGroup: 'O+', 
      chronicDiseases: [], pregnancyStatus: 'No', vaccinationStatus: 'Partial', 
      disabilityStatus: 'No', malnutritionStatus: 'none', livingAlone: 'no',
      consentGiven: false, consentMethod: 'Thumbprint'
    });
  };

  const handleAddVisit = async (e) => {
    e.preventDefault();
    if (!visitForm.familyId || !visitForm.notes) return;

    const selectedFamily = state.families.find(f => f.id === visitForm.familyId);
    const newVisit = {
      id: 'VST-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleDateString(),
      vhwName: currentVhwName,
      gps: gpsCoords ? `${gpsCoords.lat}, ${gpsCoords.lng}` : '12.9716, 77.5946',
      villageName: selectedFamily ? (selectedFamily.village?.name || selectedFamily.villageName) : 'Unknown',
      ...visitForm
    };

    if (isOnline) {
      try {
        const response = await api.post('/visits', {
          family_id: visitForm.familyId,
          notes: visitForm.notes,
          temperature_f: visitForm.tempDeg,
          bp_systolic: visitForm.bpSys,
          bp_diastolic: visitForm.bpDia,
          recorded_on: new Date().toISOString().split('T')[0],
          gps_coords: newVisit.gps
        });
        if (response.data.success) {
          const freshVisits = await api.get('/visits');
          setState(prev => ({ 
            ...prev, 
            visits: freshVisits.data.data || freshVisits.data 
          }));
          notify("Visit details saved to central records!");
        }
      } catch (err) {
        notifyError(err.response?.data?.message || "Failed to log visit.");
      }
    } else {
      setOfflineQueue(prev => [...prev, { type: 'visit', data: newVisit }]);
      notify("Offline Mode: Daily visit saved in sync queue.");
    }
    setVisitForm({ familyId: '', notes: '', followUpDate: '', tempDeg: '98.6', bpSys: '120', bpDia: '80' });
    setVisitStep(1);
  };

  const handleAddProgram = async (e) => {
    e.preventDefault();
    if (!programForm.villageId || !programForm.participants) return;

    const selectedVlg = state.villages.find(v => v.id === programForm.villageId);
    const newProgram = {
      id: 'PRG-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleDateString(),
      villageName: selectedVlg ? selectedVlg.name : 'Unknown',
      status: 'Submitted',
      ...programForm
    };

    if (isOnline) {
      try {
        const response = await api.post('/sync', { queue: [{ type: 'program', data: newProgram }] });
        if (response.data.success) {
          notify("Community program logs synced successfully.");
        }
      } catch (err) {
        notifyError(err.response?.data?.message || "Failed to log program.");
      }
    } else {
      setOfflineQueue(prev => [...prev, { type: 'program', data: newProgram }]);
      notify("Offline Mode: Campaign saved to local queue.");
    }
    setProgramForm({ villageId: '', topic: 'Menstrual Hygiene', participants: '', outcome: '' });
  };

  const handleCheckIn = async () => {
    const time = new Date().toLocaleTimeString();
    if (isOnline) {
      try {
        const response = await api.post('/attendance/check-in', {
          gps_coords: gpsCoords ? `${gpsCoords.lat}, ${gpsCoords.lng}` : '12.9716, 77.5946'
        });
        if (response.data.success) {
          setAttendanceStatus('checked-in');
          setAttendanceTime(time);
          notify("Checked-in successfully via authenticated GPS!");
        }
      } catch (err) {
        notifyError("Failed to check-in. Ensure GPS services are enabled.");
      }
    } else {
      setAttendanceStatus('checked-in');
      setAttendanceTime(time);
      notify("Offline Mode: Checked-in locally. Will sync online.");
    }
  };

  const handleCheckOut = async () => {
    if (isOnline) {
      try {
        const response = await api.post('/attendance/check-out', {
          gps_coords: gpsCoords ? `${gpsCoords.lat}, ${gpsCoords.lng}` : '12.9716, 77.5946'
        });
        if (response.data.success) {
          setAttendanceStatus('checked-out');
          notify("Shift completed and Checked-out!");
        }
      } catch (err) {
        notifyError("Failed to check-out.");
      }
    } else {
      setAttendanceStatus('checked-out');
      notify("Shift ended locally.");
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!leaveForm.reason || !leaveForm.startDate) return;
    try {
      const response = await api.post('/leaves', {
        reason: leaveForm.reason,
        start_date: leaveForm.startDate,
        days_count: leaveForm.days
      });
      if (response.data.success) {
        const freshLeaves = await api.get('/leaves');
        setState(prev => ({ ...prev, leaveRequests: freshLeaves.data.data || freshLeaves.data }));
        notify("Leave request submitted for Director review.");
        setLeaveForm({ reason: '', days: '1', startDate: '' });
      }
    } catch (err) {
      notifyError(err.response?.data?.message || "Failed to submit leave request.");
    }
  };

  const handleToggleDisease = (disease) => {
    setIndividualForm(prev => {
      const active = prev.chronicDiseases.includes(disease);
      return {
        ...prev,
        chronicDiseases: active 
          ? prev.chronicDiseases.filter(d => d !== disease)
          : [...prev.chronicDiseases, disease]
      };
    });
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    let score = 0;
    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answer) {
        score++;
      }
    });
    setQuizScore(score);
    notify(`Quiz completed! You scored ${score}/${quizQuestions.length}`);
  };

  const toggleRevealPii = async (patientId, patientName) => {
    const isRevealed = !!revealedPii[patientId];
    if (!isRevealed) {
      try {
        const response = await api.post(`/individuals/${patientId}/reveal`, { field: 'mobile_number' });
        if (response.data.success) {
          setRevealedPii(prev => ({ ...prev, [patientId]: true }));
          notify("PII revealed and logged to central security auditor.");
        }
      } catch (err) {
        notifyError("Failed to reveal patient details.");
      }
    } else {
      setRevealedPii(prev => ({ ...prev, [patientId]: false }));
    }
  };

  const runOfflineSyncSimulation = async () => {
    if (offlineQueue.length === 0) return;
    setIsSimulatingSync(true);
    setSyncLogs(["Starting central sync pipeline...", "Validating JWT session tokens..."]);

    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    await delay(600);

    try {
      const response = await api.post('/sync', { queue: offlineQueue });
      if (response.data.success) {
        setSyncLogs(prev => [...prev, "Uploading cached sync queue...", "[Success] Cloud DB transaction finalized."]);
        await delay(500);
        
        // Refresh local data
        const [villagesRes, familiesRes, individualsRes, visitsRes] = await Promise.all([
          api.get('/villages'),
          api.get('/families'),
          api.get('/individuals'),
          api.get('/visits')
        ]);

        setState(prev => ({
          ...prev,
          villages: villagesRes.data.data || villagesRes.data,
          families: familiesRes.data.data || familiesRes.data,
          individuals: individualsRes.data.data || individualsRes.data,
          visits: visitsRes.data.data || visitsRes.data
        }));

        setSyncLogs(prev => [...prev, "[Completed] Local storage database synchronized with central server!"]);
        setOfflineQueue([]);
      }
    } catch (err) {
      setSyncLogs(prev => [...prev, "[Error] Sync transaction aborted: " + (err.response?.data?.message || "Internal network error")]);
    } finally {
      setIsSimulatingSync(false);
    }
  };

  const liveRiskAlerts = evaluateRiskAlerts(individualForm);

  return (
    <div className="flex flex-col border border-[var(--border-color)] rounded-[30px] overflow-x-hidden shadow-2xl w-full max-w-[390px] mx-auto min-h-[720px] relative text-[var(--text-primary)] bg-[var(--bg-card)] select-none z-10">
      
      {/* Subtle Heart Watermark Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[var(--bg-page)] opacity-95" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-rose-500/5 blur-[70px]" />
        <Heart className="w-48 h-48 text-rose-500/5 fill-rose-500/[0.01] transform -rotate-12 animate-pulse" />
      </div>
      
      {/* Mobile Top Status Bar */}
      <div className="bg-[var(--bg-inner)] px-4 py-2 flex justify-between items-center text-xs text-[var(--text-secondary)] border-b border-[var(--border-color)] relative z-25">
        <span className="font-bold tracking-tight">11:30 AM</span>
        
        {/* Network & Debugger Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsOnline(!isOnline)} 
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full transition-all duration-300 font-extrabold text-xs cursor-pointer border ${
              isOnline ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-450 border-rose-500/20'
            }`}
          >
            {isOnline ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </button>
          
          <button 
            onClick={() => setActiveSubTab('sync_sandbox')}
            className={`px-2 py-0.5 rounded-full border text-xs font-black uppercase transition-all tracking-wider cursor-pointer ${
              activeSubTab === 'sync_sandbox' 
                ? 'bg-brand-600 border-brand-500 text-white shadow' 
                : 'bg-[var(--bg-card)] border-[var(--border-color)] text-brand-600 dark:text-brand-400 hover:bg-[var(--bg-inner)]'
            }`}
          >
            Sandbox
          </button>
        </div>
      </div>

      {/* Main App Bar */}
      <div 
        className="p-4 shadow-md flex justify-between items-center relative overflow-hidden border-b border-[var(--border-color)] z-10 bg-gradient-to-r from-brand-600 to-brand-700"
      >
        <div className="relative z-10">
          <h2 className="text-sm font-black text-white leading-tight flex items-center gap-1.5 drop-shadow-sm">
            <Heart className="w-3.5 h-3.5 text-rose-400 animate-pulse fill-rose-400" />
            Jeevan Roshini Mobile
          </h2>
          <p className="text-xs text-sky-100 font-bold uppercase tracking-wider drop-shadow-sm mt-0.5">District Field Client</p>
        </div>
        <div className="text-right relative z-10">
          <p className="text-xs text-white font-extrabold drop-shadow">{currentVhwName}</p>
          <span className="text-xs font-black bg-indigo-950/70 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-500/10">ID: {currentVhwId}</span>
        </div>
      </div>

      {/* Scope Banner */}
      <div className="bg-[var(--bg-inner)] border-b border-[var(--border-color)] px-4 py-1.5 flex items-center justify-between text-xs text-[var(--text-secondary)] font-extrabold uppercase tracking-wider relative z-10">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-brand-500" /> SCOPE: {currentUser?.name?.includes('Shobha') ? 'Belur' : 'Gundya'}</span>
        <span className="text-xs text-brand-600 dark:text-brand-400 bg-brand-500/5 px-1.5 py-0.2 border border-brand-500/10 rounded">Scope</span>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="absolute top-20 left-4 right-4 z-50 bg-emerald-650 text-white text-xs px-3.5 py-2.5 rounded-xl shadow-xl border border-emerald-500 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-250" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {/* Error Validation Alert */}
      {errorMsg && (
        <div className="absolute top-20 left-4 right-4 z-50 bg-rose-650 text-white text-xs px-3.5 py-2.5 rounded-xl shadow-xl border border-rose-500 flex items-center gap-2 animate-bounce">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-250" />
          <span className="font-bold">{errorMsg}</span>
        </div>
      )}

      {/* Offline Queue Sync Indicator */}
      {offlineQueue.length > 0 && activeSubTab !== 'sync_sandbox' && (
        <div className="bg-amber-500/10 border-b border-amber-550/25 px-4 py-2 flex justify-between items-center text-xs text-amber-600 dark:text-amber-400 relative z-10">
          <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            {offlineQueue.length} records local
          </span>
          <button 
            onClick={runOfflineSyncSimulation}
            disabled={!isOnline}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded bg-brand-500 hover:bg-brand-600 text-white font-black transition-all text-xs cursor-pointer ${
              !isOnline ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'
            }`}
          >
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            Sync Now
          </button>
        </div>
      )}

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 pb-24 relative z-10 bg-[var(--bg-card)]">
        
        {activeSubTab === 'home' && (
          <VhwDashboard 
            visibleFamilies={visibleFamilies}
            visibleIndividuals={visibleIndividuals}
            state={state}
            setActiveSubTab={setActiveSubTab}
            gpsCoords={gpsCoords}
            currentVhwName={currentVhwName}
          />
        )}

        {activeSubTab === 'village' && (
          <VillageForm 
            villageForm={villageForm}
            setVillageForm={setVillageForm}
            handleAddVillage={handleAddVillage}
          />
        )}

        {activeSubTab === 'family' && (
          <FamilyForm 
            familyStep={familyStep}
            setFamilyStep={setFamilyStep}
            familyForm={familyForm}
            setFamilyForm={setFamilyForm}
            visibleVillages={visibleVillages}
            handleAddFamily={handleAddFamily}
          />
        )}

        {activeSubTab === 'individual' && (
          <IndividualForm 
            individualForm={individualForm}
            setIndividualForm={setIndividualForm}
            visibleFamilies={visibleFamilies}
            handleToggleDisease={handleToggleDisease}
            liveRiskAlerts={liveRiskAlerts}
            handleAddIndividual={handleAddIndividual}
          />
        )}

        {activeSubTab === 'visit' && (
          <VisitForm 
            visitStep={visitStep}
            setVisitStep={setVisitStep}
            visitForm={visitForm}
            setVisitForm={setVisitForm}
            visibleFamilies={visibleFamilies}
            gpsCoords={gpsCoords}
            handleAddVisit={handleAddVisit}
          />
        )}

        {activeSubTab === 'echr' && (
          <EchrViewer 
            visibleIndividuals={visibleIndividuals}
            revealedPii={revealedPii}
            toggleRevealPii={toggleRevealPii}
            families={state.families}
            visits={state.visits}
          />
        )}

        {activeSubTab === 'programs' && (
          <ProgramForm 
            programForm={programForm}
            setProgramForm={setProgramForm}
            visibleVillages={visibleVillages}
            handleAddProgram={handleAddProgram}
          />
        )}

        {activeSubTab === 'attendance' && (
          <AttendanceTracker 
            attendanceStatus={attendanceStatus}
            handleCheckIn={handleCheckIn}
            attendanceTime={attendanceTime}
            gpsCoords={gpsCoords}
            handleCheckOut={handleCheckOut}
            leaveForm={leaveForm}
            setLeaveForm={setLeaveForm}
            handleApplyLeave={handleApplyLeave}
          />
        )}

        {activeSubTab === 'training' && (
          <TrainingPortal 
            quizScore={quizScore}
            setQuizScore={setQuizScore}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
            quizQuestions={quizQuestions}
            handleQuizSubmit={handleQuizSubmit}
          />
        )}

        {activeSubTab === 'sync_sandbox' && (
          <SyncSandbox 
            isOnline={isOnline}
            setIsOnline={setIsOnline}
            offlineQueue={offlineQueue}
            runOfflineSyncSimulation={runOfflineSyncSimulation}
            isSimulatingSync={isSimulatingSync}
            syncLogs={syncLogs}
          />
        )}

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[var(--bg-card)] border-t border-[var(--border-color)] py-3 px-4 flex justify-between items-center z-40">
        <button 
          onClick={() => setActiveSubTab('home')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${activeSubTab === 'home' ? 'text-brand-500 font-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <ClipboardList className="w-4.5 h-4.5" />
          <span className="text-xs">Home</span>
        </button>

        <button 
          onClick={() => setActiveSubTab('echr')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${activeSubTab === 'echr' ? 'text-brand-500 font-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <Users className="w-4.5 h-4.5" />
          <span className="text-xs">Patients</span>
        </button>

        <button 
          onClick={() => setActiveSubTab('programs')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${activeSubTab === 'programs' ? 'text-brand-500 font-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <Heart className="w-4.5 h-4.5" />
          <span className="text-xs">Programs</span>
        </button>

        <button 
          onClick={() => setActiveSubTab('attendance')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${activeSubTab === 'attendance' ? 'text-brand-500 font-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <Clock className="w-4.5 h-4.5" />
          <span className="text-xs">HR/GPS</span>
        </button>

        <button 
          onClick={() => setActiveSubTab('training')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${activeSubTab === 'training' ? 'text-brand-500 font-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <BookOpen className="w-4.5 h-4.5" />
          <span className="text-xs">Training</span>
        </button>
      </div>

    </div>
  );
}
