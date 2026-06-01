import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { evaluateRiskAlerts } from '../utils/riskAlertEngine';
import { 
  Users, MapPin, ClipboardList, BookOpen, Clock, Heart, 
  Wifi, WifiOff, RefreshCw, Award, Save, CheckCircle2, AlertTriangle, Play, Map,
  ChevronRight, ChevronLeft, ShieldAlert, Eye, EyeOff, CheckSquare
} from 'lucide-react';

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
  const { t, locale } = useTranslation();
  const currentVhwName = currentUser ? currentUser.name : "Preema D'Souza";
  const currentVhwId = currentUser ? currentUser.id : "STF-104";
  const [activeSubTab, setActiveSubTab] = useState('home');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Role-Based Data Visibility (Assigned Villages)
  const assignedVillageIds = useMemo(() => {
    if (currentUser?.name?.includes('Preema')) {
      return ['VLG-4829', 'VLG-1029']; // Gundya, Mudigere
    }
    if (currentUser?.name?.includes('Shobha')) {
      return ['VLG-7281']; // Belur
    }
    return state.villages.map(v => v.id);
  }, [currentUser, state.villages]);

  const visibleVillages = useMemo(() => {
    return state.villages.filter(v => assignedVillageIds.includes(v.id));
  }, [state.villages, assignedVillageIds]);

  const visibleFamilies = useMemo(() => {
    return state.families.filter(f => assignedVillageIds.includes(f.villageId));
  }, [state.families, assignedVillageIds]);

  const visibleIndividuals = useMemo(() => {
    return state.individuals.filter(ind => {
      const fam = state.families.find(f => f.id === ind.familyId);
      return fam && assignedVillageIds.includes(fam.villageId);
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
  const handleAddVillage = (e) => {
    e.preventDefault();
    if (!villageForm.name) return;
    const newVillage = {
      id: 'VLG-' + Math.floor(1000 + Math.random() * 9000),
      status: 'Submitted', // Approval status
      ...villageForm
    };

    if (isOnline) {
      setState(prev => ({ 
        ...prev, 
        villages: [...prev.villages, newVillage],
        auditLogs: [
          { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: currentVhwName, action: 'CREATE_VILLAGE', desc: `Created village ${newVillage.name}`, ip: '192.168.1.42', time: new Date().toLocaleString(), oldValue: 'None', newValue: newVillage.name },
          ...prev.auditLogs
        ]
      }));
      notify("Village registered successfully and submitted for review!");
    } else {
      setOfflineQueue(prev => [...prev, { type: 'village', data: newVillage }]);
      notify("Offline Mode: Village report saved to local queue.");
    }
    setVillageForm({ name: '', population: '', waterStatus: 'Adequate', sanitationStatus: 'Good', riskStatus: 'Low' });
  };

  const handleAddFamily = (e) => {
    e.preventDefault();
    if (!familyForm.villageId || !familyForm.houseNo) return;

    // ── DUPLICATE PREVENTION ──
    const isDuplicate = state.families.some(f => f.villageId === familyForm.villageId && f.houseNo === familyForm.houseNo) ||
                        offlineQueue.some(q => q.type === 'family' && q.data.villageId === familyForm.villageId && q.data.houseNo === familyForm.houseNo);
    
    if (isDuplicate) {
      notifyError("❌ Error: A family with this House No. is already registered in this village!");
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
      setState(prev => ({ 
        ...prev, 
        families: [...prev.families, newFamily],
        auditLogs: [
          { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: currentVhwName, action: 'CREATE_FAMILY', desc: `Registered family ${newFamily.id}`, ip: '192.168.1.42', time: new Date().toLocaleString(), oldValue: 'None', newValue: newFamily.id },
          ...prev.auditLogs
        ]
      }));
      notify("Family registered and submitted for review!");
    } else {
      setOfflineQueue(prev => [...prev, { type: 'family', data: newFamily }]);
      notify("Offline Mode: Family registration queued locally.");
    }
    setFamilyForm({ villageId: '', houseNo: '', economicStatus: 'BPL', occupation: '', drinkingWater: 'Tap', toilet: 'Yes' });
    setFamilyStep(1);
  };

  const handleAddIndividual = (e) => {
    e.preventDefault();
    if (!individualForm.familyId || !individualForm.name || !individualForm.age) return;

    // ── DATA VALIDATION RULES ──
    // 1. Pregnant = Male ❌
    if (individualForm.gender === 'Male' && individualForm.pregnancyStatus === 'Yes') {
      notifyError("❌ Validation Failure: Pregnant status cannot be active for a male patient!");
      return;
    }

    // 2. Blood Group Invalid check
    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodGroups.includes(individualForm.bloodGroup)) {
      notifyError("❌ Validation Failure: Invalid blood group format!");
      return;
    }

    // 3. Duplicate individual prevention
    const isDuplicate = state.individuals.some(i => i.name.toLowerCase() === individualForm.name.toLowerCase() && i.age === individualForm.age) ||
                        offlineQueue.some(q => q.type === 'individual' && q.data.name.toLowerCase() === individualForm.name.toLowerCase() && q.data.age === individualForm.age);
    if (isDuplicate) {
      notifyError("❌ Error: An individual with this Name & Age is already registered!");
      return;
    }

    // 4. Diabetes in children under-5 warning ⚠️
    if (parseInt(individualForm.age) <= 5 && individualForm.chronicDiseases.includes('Diabetes')) {
      alert("⚠️ Clinical Warning: Juvenile Diabetes in children under 5 is extremely rare. Please confirm diagnosis details before saving.");
    }

    // Auto-generate health ID
    const membersInFamily = state.individuals.filter(ind => ind.familyId === individualForm.familyId).length + 
                            offlineQueue.filter(q => q.type === 'individual' && q.data.familyId === individualForm.familyId).length;
    const suffix = String(membersInFamily + 1).padStart(2, '0');
    const healthId = `JR-${individualForm.familyId.split('-')[2] || 'IND'}-${suffix}`;

    // Auto evaluate risk alerts
    const alerts = evaluateRiskAlerts(individualForm);

    // Compute Vulnerability Score
    const familyInfo = state.families.find(f => f.id === individualForm.familyId) || {};
    const isPoor = familyInfo.economicStatus === 'BPL' || familyInfo.economicStatus === 'Antyodaya';
    
    let vulnerabilityScore = 0;
    if (individualForm.pregnancyStatus === 'Yes') vulnerabilityScore += 5;
    if (parseInt(individualForm.age) >= 65 && individualForm.livingAlone === 'yes') vulnerabilityScore += 5;
    if (individualForm.disabilityStatus === 'Yes') vulnerabilityScore += 4;
    if (isPoor) vulnerabilityScore += 3;

    let vulnerabilityLevel = 'Low';
    if (vulnerabilityScore >= 6) vulnerabilityLevel = 'High';
    else if (vulnerabilityScore >= 3) vulnerabilityLevel = 'Medium';

    const newIndividual = {
      id: healthId,
      alerts: alerts,
      vulnerabilityScore,
      vulnerabilityLevel,
      consentDate: individualForm.consentGiven ? new Date().toLocaleDateString() : 'N/A',
      ...individualForm
    };

    if (isOnline) {
      setState(prev => {
        const updatedInd = [...prev.individuals, newIndividual];
        const newGlobalAlerts = [...prev.alerts];
        alerts.forEach(al => {
          newGlobalAlerts.push({
            id: 'ALT-' + Math.floor(1000 + Math.random() * 9000),
            patientId: healthId,
            patientName: individualForm.name,
            type: al.type,
            severity: al.severity,
            reason: al.reason,
            date: new Date().toLocaleDateString(),
            resolved: false
          });
        });
        return { 
          ...prev, 
          individuals: updatedInd, 
          alerts: newGlobalAlerts,
          auditLogs: [
            { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: currentVhwName, action: 'CREATE_INDIVIDUAL', desc: `Enrolled patient ${individualForm.name} with Vulnerability Score ${vulnerabilityScore}`, ip: '192.168.1.42', time: new Date().toLocaleString(), oldValue: 'None', newValue: individualForm.name },
            ...prev.auditLogs
          ]
        };
      });
      notify("Individual Screening Record saved & synced!");
    } else {
      setOfflineQueue(prev => [...prev, { type: 'individual', data: newIndividual }]);
      notify("Offline Mode: Record saved to local sync queue.");
    }

    setIndividualForm({
      familyId: '', name: '', age: '', gender: 'Female', phone: '', bloodGroup: 'O+', 
      chronicDiseases: [], pregnancyStatus: 'No', vaccinationStatus: 'Partial', 
      disabilityStatus: 'No', malnutritionStatus: 'none', livingAlone: 'no',
      consentGiven: false, consentMethod: 'Thumbprint'
    });
  };

  const handleAddVisit = (e) => {
    e.preventDefault();
    if (!visitForm.familyId || !visitForm.notes) return;

    const newVisit = {
      id: 'VST-' + Math.floor(1000 + Math.random() * 9000),
      vhwName: `${currentVhwName} (VHW)`,
      date: new Date().toLocaleDateString(),
      gps: gpsCoords ? `${gpsCoords.lat}, ${gpsCoords.lng}` : 'Simulated GPS',
      status: 'Submitted', // Approval status
      ...visitForm
    };

    if (isOnline) {
      setState(prev => ({ 
        ...prev, 
        visits: [newVisit, ...prev.visits],
        auditLogs: [
          { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: currentVhwName, action: 'CREATE_VISIT', desc: `Logged field visit ${newVisit.id} for family ${newVisit.familyId}`, ip: '192.168.1.42', time: new Date().toLocaleString(), oldValue: 'None', newValue: newVisit.id },
          ...prev.auditLogs
        ]
      }));
      notify("Field visit logged and submitted for review!");
    } else {
      setOfflineQueue(prev => [...prev, { type: 'visit', data: newVisit }]);
      notify("Offline Mode: Visit report queued locally.");
    }
    setVisitForm({ familyId: '', notes: '', followUpDate: '', tempDeg: '98.6', bpSys: '120', bpDia: '80' });
    setVisitStep(1);
  };

  const handleAddProgram = (e) => {
    e.preventDefault();
    if (!programForm.villageId || !programForm.participants) return;

    const selectedVlg = state.villages.find(v => v.id === programForm.villageId);
    const newProg = {
      id: 'PRG-' + Math.floor(1000 + Math.random() * 9000),
      villageName: selectedVlg ? selectedVlg.name : 'Unknown Village',
      date: new Date().toLocaleDateString(),
      status: 'Submitted', // Approval status
      ...programForm
    };

    if (isOnline) {
      setState(prev => ({ 
        ...prev, 
        programs: [newProg, ...prev.programs],
        auditLogs: [
          { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: currentVhwName, action: 'CREATE_PROGRAM', desc: `Logged community program ${newProg.topic}`, ip: '192.168.1.42', time: new Date().toLocaleString(), oldValue: 'None', newValue: newProg.topic },
          ...prev.auditLogs
        ]
      }));
      notify("Weekly awareness activity logged & submitted!");
    } else {
      setOfflineQueue(prev => [...prev, { type: 'program', data: newProg }]);
      notify("Offline Mode: Program activity queued locally.");
    }
    setProgramForm({ villageId: '', topic: 'Menstrual Hygiene', participants: '', outcome: '' });
  };

  const handleCheckIn = () => {
    simulateGps();
    setAttendanceStatus('checked-in');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAttendanceTime(timeStr);

    const log = {
      id: 'ATT-' + Math.floor(1000 + Math.random() * 9000),
      staffName: `${currentVhwName} (VHW)`,
      date: new Date().toLocaleDateString(),
      checkIn: timeStr,
      checkOut: '-',
      status: 'Present',
      approvalStatus: 'Submitted', // Generic approval status
      gps: gpsCoords ? `${gpsCoords.lat}, ${gpsCoords.lng}` : 'Simulated GPS'
    };

    setState(prev => ({
      ...prev,
      attendance: [log, ...prev.attendance],
      auditLogs: [
        { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: currentVhwName, action: 'ATTENDANCE_CHECKIN', desc: `Checked in via GPS at ${log.gps}`, ip: '192.168.1.42', time: new Date().toLocaleString(), oldValue: 'Checked-Out', newValue: 'Checked-In' },
        ...prev.auditLogs
      ]
    }));
    notify("GPS Attendance checked in successfully!");
  };

  const handleCheckOut = () => {
    setAttendanceStatus('checked-out');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setState(prev => {
      const logs = [...prev.attendance];
      const firstName = currentVhwName.split(' ')[0];
      const todayIndex = logs.findIndex(x => x.staffName.includes(firstName) && x.date === new Date().toLocaleDateString());
      if (todayIndex !== -1) {
        logs[todayIndex].checkOut = timeStr;
      }
      return { 
        ...prev, 
        attendance: logs,
        auditLogs: [
          { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: currentVhwName, action: 'ATTENDANCE_CHECKOUT', desc: `Checked out from shift`, ip: '192.168.1.42', time: new Date().toLocaleString(), oldValue: 'Checked-In', newValue: 'Checked-Out' },
          ...prev.auditLogs
        ]
      };
    });
    notify("GPS Attendance checked out successfully!");
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!leaveForm.reason || !leaveForm.startDate) return;

    const request = {
      id: 'LEV-' + Math.floor(1000 + Math.random() * 9000),
      staffName: `${currentVhwName} (VHW)`,
      ...leaveForm,
      status: 'Submitted' // Approval workflow status
    };

    setState(prev => ({
      ...prev,
      leaveRequests: [request, ...prev.leaveRequests],
      auditLogs: [
        { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: currentVhwName, action: 'APPLY_LEAVE', desc: `Applied for ${leaveForm.days} days leave starting ${leaveForm.startDate}`, ip: '192.168.1.42', time: new Date().toLocaleString(), oldValue: 'None', newValue: 'Submitted' },
        ...prev.auditLogs
      ]
    }));
    notify("Leave request submitted for Director review.");
    setLeaveForm({ reason: '', days: '1', startDate: '' });
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

  // PII Visibility Handler (Logs revealing of phone numbers)
  const toggleRevealPii = (patientId, patientName) => {
    const isRevealed = !!revealedPii[patientId];
    setRevealedPii(prev => ({ ...prev, [patientId]: !isRevealed }));
    
    if (!isRevealed) {
      setState(prev => ({
        ...prev,
        auditLogs: [
          { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: currentVhwName, action: 'PII_REVEAL', desc: `Revealed sensitive phone contact detail for patient: ${patientName} (${patientId})`, ip: '192.168.1.42', time: new Date().toLocaleString(), oldValue: 'Masked Phone', newValue: 'Full Phone Visible' },
          ...prev.auditLogs
        ]
      }));
      notify("PII revealed and logged to central security auditor.");
    }
  };

  // Sync Debugger Simulator Pipeline
  const runOfflineSyncSimulation = () => {
    if (!isOnline) {
      notifyError("❌ Sync failed: Device is currently offline!");
      return;
    }
    if (offlineQueue.length === 0) {
      notify("Queue empty. Nothing to sync.");
      return;
    }

    setIsSimulatingSync(true);
    setSyncLogs([]);

    const logMessage = (msg, delay) => {
      return new Promise(resolve => {
        setTimeout(() => {
          setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
          resolve();
        }, delay);
      });
    };

    (async () => {
      await logMessage("📡 Initializing offline synchronization queue...", 400);
      await logMessage("🌐 Pinging central Jeevan Roshini database endpoint...", 600);
      await logMessage("🔑 Secure Sanctum API handshakes verified.", 400);
      await logMessage(`📦 Found ${offlineQueue.length} records in local IndexedDB queue.`, 500);

      // Process queue items and check for duplicates
      for (const item of offlineQueue) {
        await logMessage(`⏳ Verifying integrity of ${item.type.toUpperCase()} record...`, 400);
        
        let duplicateFound = false;
        if (item.type === 'family') {
          duplicateFound = state.families.some(f => f.id === item.data.id);
        } else if (item.type === 'individual') {
          duplicateFound = state.individuals.some(i => i.id === item.data.id);
        }

        if (duplicateFound) {
          await logMessage(`⚠️ Warning: Duplicate detected for ${item.type} ID ${item.data.id}. Rejecting queue insert to prevent data collisions.`, 500);
        } else {
          await logMessage(`✅ Server validation passed for ${item.type} (ID: ${item.data.id}). Uploading payload.`, 450);
          
          // Actually push to global state
          setState(prev => {
            let nextState = { ...prev };
            if (item.type === 'village') nextState.villages = [...prev.villages, item.data];
            else if (item.type === 'family') nextState.families = [...prev.families, item.data];
            else if (item.type === 'individual') {
              nextState.individuals = [...prev.individuals, item.data];
              // inject alerts
              item.data.alerts?.forEach(al => {
                nextState.alerts.push({
                  id: 'ALT-' + Math.floor(1000 + Math.random() * 9000),
                  patientId: item.data.id,
                  patientName: item.data.name,
                  type: al.type,
                  severity: al.severity,
                  reason: al.reason,
                  date: new Date().toLocaleDateString(),
                  resolved: false
                });
              });
            } else if (item.type === 'visit') nextState.visits = [item.data, ...prev.visits];
            else if (item.type === 'program') nextState.programs = [item.data, ...prev.programs];
            
            // log audit
            nextState.auditLogs.unshift({
              id: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
              user: currentVhwName,
              action: 'OFFLINE_SYNC',
              desc: `Synced queued ${item.type} record: ID ${item.data.id}`,
              ip: '192.168.1.42',
              time: new Date().toLocaleString(),
              oldValue: 'IndexedDB (Offline)',
              newValue: 'MySQL Server (Online)'
            });
            return nextState;
          });
        }
      }

      await logMessage("🔄 Running global database consistency checks...", 600);
      await logMessage("🎉 Synchronization complete! 0 bytes data loss, 100% database parity achieved.", 500);
      
      setOfflineQueue([]);
      setIsSimulatingSync(false);
      notify("Offline database successfully synchronized!");
    })();
  };

  const liveRiskAlerts = evaluateRiskAlerts(individualForm);

  return (
    <div className="flex flex-col border border-slate-800 rounded-3xl overflow-hidden shadow-2xl w-full max-w-[420px] mx-auto min-h-[750px] relative text-slate-200 bg-slate-950">
      
      {/* Subtle Heart Watermark Background */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950/20" />
        <div className="absolute w-[240px] h-[240px] rounded-full bg-rose-500/5 blur-[80px]" />
        <Heart className="w-56 h-56 text-rose-500/5 fill-rose-500/[0.02] transform -rotate-12 animate-pulse" />
      </div>
      
      {/* Mobile Top Status Bar */}
      <div className="bg-slate-950 px-3 py-2 flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-900 relative z-20">
        <span className="font-semibold text-slate-300">11:30 AM</span>
        
        {/* Network & Debugger Buttons */}
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setIsOnline(!isOnline)} 
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full transition-all duration-300 font-bold ${
              isOnline ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}
          >
            {isOnline ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
            {isOnline ? t('online') : t('offline')}
          </button>
          
          <button 
            onClick={() => setActiveSubTab('sync_sandbox')}
            className={`px-1.5 py-0.5 rounded-full border text-[8px] font-extrabold uppercase transition-all tracking-wider ${activeSubTab === 'sync_sandbox' ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' : 'bg-slate-900 border-slate-800 text-indigo-400 hover:bg-slate-800'}`}
          >
            🔄 Sync Sandbox
          </button>
        </div>
      </div>

      {/* Main App Bar */}
      <div 
        className="p-4 shadow-lg flex justify-between items-center relative overflow-hidden border-b border-indigo-900/50 z-10"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(29, 78, 216, 0.93) 10%, rgba(15, 23, 42, 0.65)), url(/vhw-banner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10">
          <h2 className="text-base font-black text-white leading-tight flex items-center gap-1.5 drop-shadow-md">
            <Heart className="w-4 h-4 text-rose-400 animate-pulse fill-rose-400" />
            Jeevan Roshini Mobile
          </h2>
          <p className="text-[9px] text-blue-200 font-semibold uppercase tracking-wider drop-shadow mt-0.5">District Field PWA Client</p>
        </div>
        <div className="text-right relative z-10">
          <p className="text-xs text-white font-extrabold drop-shadow">{currentVhwName}</p>
          <span className="text-[8px] font-black bg-indigo-950/75 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/20 shadow">ID: {currentVhwId}</span>
        </div>
      </div>

      {/* Active Visibility Scope Banner */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-1 flex items-center justify-between text-[8.5px] text-indigo-300 font-bold uppercase tracking-wider relative z-10">
        <span>📍 SCOPE: {currentUser?.name?.includes('Shobha') ? 'Belur Sector' : 'Gundya & Mudigere Sectors'}</span>
        <span className="bg-indigo-500/10 text-[7.5px] px-1 py-0.2 rounded border border-indigo-500/20">Assigned Villages Only</span>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="absolute top-20 left-4 right-4 z-50 bg-emerald-600/95 text-white text-xs px-3.5 py-2.5 rounded-xl shadow-xl border border-emerald-500 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Error Validation Alert */}
      {errorMsg && (
        <div className="absolute top-20 left-4 right-4 z-50 bg-rose-600/95 text-white text-xs px-3.5 py-2.5 rounded-xl shadow-xl border border-rose-500 flex items-center gap-2 animate-bounce">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-200" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Offline Queue Sync Indicator */}
      {offlineQueue.length > 0 && activeSubTab !== 'sync_sandbox' && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-3 py-2 flex justify-between items-center text-xs text-amber-300 relative z-10">
          <span className="flex items-center gap-1.5 text-[10px] font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            {offlineQueue.length} {t('syncPending') || 'Offline Records Pending'}
          </span>
          <button 
            onClick={runOfflineSyncSimulation}
            disabled={!isOnline}
            className={`flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all text-[10px] ${
              !isOnline ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'
            }`}
          >
            <RefreshCw className="w-2.5 h-2.5 text-slate-950 animate-spin" />
            Sync Now
          </button>
        </div>
      )}

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 pb-24 relative z-10">
        
        {/* TAB 1: HOME/DASHBOARD */}
        {activeSubTab === 'home' && (
          <div className="space-y-4">
            
            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-800/40 border border-slate-700/60 p-3 rounded-2xl flex flex-col justify-between">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Assigned Households</span>
                <p className="text-xl font-black mt-1 text-blue-400">
                  {visibleFamilies.length} <span className="text-[10px] text-slate-500 font-normal">homes</span>
                </p>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/60 p-3 rounded-2xl flex flex-col justify-between">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Assigned Registry</span>
                <p className="text-xl font-black mt-1 text-purple-400">
                  {visibleIndividuals.length} <span className="text-[10px] text-slate-500 font-normal">records</span>
                </p>
              </div>
            </div>

            {/* Risk Warnings Board */}
            <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-2xl">
              <div className="flex items-center justify-between border-b border-rose-500/15 pb-2 mb-2">
                <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Block Alerts ({state.alerts.filter(a => !a.resolved).length})
                </h4>
                <button onClick={() => setActiveSubTab('echr')} className="text-[10px] text-rose-300 underline font-semibold">View Cases</button>
              </div>
              {state.alerts.filter(a => !a.resolved).slice(0, 2).map((al) => (
                <div key={al.id} className="text-[10px] border-l-2 border-rose-500 pl-2 py-1 my-1.5 flex justify-between bg-rose-500/5 rounded-r">
                  <div>
                    <span className="font-bold text-rose-300">{al.patientName}</span>
                    <p className="text-slate-400 mt-0.5">{al.reason}</p>
                  </div>
                  <span className={`text-[8px] uppercase tracking-wider px-1 py-0.5 rounded font-bold h-fit ${
                    al.severity === 'critical' ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-600 text-white'
                  }`}>{al.severity}</span>
                </div>
              ))}
            </div>

            {/* Quick Actions List */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Clinical Field Actions</h3>
              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  onClick={() => setActiveSubTab('village')}
                  className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 p-3 rounded-2xl text-left transition-all active:scale-98"
                >
                  <MapPin className="w-4 h-4 text-indigo-400 mb-1" />
                  <p className="text-xs font-bold text-white">Village Form</p>
                  <span className="text-[8px] text-slate-500 block mt-0.5">Map demographics</span>
                </button>
                
                <button 
                  onClick={() => setActiveSubTab('family')}
                  className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 p-3 rounded-2xl text-left transition-all active:scale-98"
                >
                  <Users className="w-4 h-4 text-blue-400 mb-1" />
                  <p className="text-xs font-bold text-white">Register Family</p>
                  <span className="text-[8px] text-slate-500 block mt-0.5">3-Step Wizard</span>
                </button>

                <button 
                  onClick={() => setActiveSubTab('individual')}
                  className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 p-3 rounded-2xl text-left transition-all active:scale-98"
                >
                  <Heart className="w-4 h-4 text-rose-400 mb-1" />
                  <p className="text-xs font-bold text-white">Patient Record</p>
                  <span className="text-[8px] text-slate-500 block mt-0.5">Scoring & Consent</span>
                </button>

                <button 
                  onClick={() => setActiveSubTab('visit')}
                  className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 p-3 rounded-2xl text-left transition-all active:scale-98"
                >
                  <ClipboardList className="w-4 h-4 text-amber-400 mb-1" />
                  <p className="text-xs font-bold text-white">Log Visit</p>
                  <span className="text-[8px] text-slate-500 block mt-0.5">2-Step Wizard</span>
                </button>
              </div>
            </div>

            {/* Simulated Live Location Map */}
            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-white flex items-center gap-1">
                  <Map className="w-3.5 h-3.5 text-emerald-400" />
                  Live GPS Duty Ring
                </span>
                <span className="text-[9px] text-slate-500 font-mono bg-slate-900 px-1.5 py-0.2 rounded">
                  {gpsCoords ? `${gpsCoords.lat}, ${gpsCoords.lng}` : 'Determining...'}
                </span>
              </div>
              <div className="h-16 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                <div className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span className="text-[8px] text-slate-600 absolute bottom-1 right-2">{currentVhwName} online</span>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: VILLAGE REGISTRATION */}
        {activeSubTab === 'village' && (
          <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-400" />
              Socio-Demographic Report
            </h3>
            
            <form onSubmit={handleAddVillage} className="space-y-3">
              <div>
                <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Village Name</label>
                <input 
                  type="text" 
                  value={villageForm.name}
                  onChange={(e) => setVillageForm({ ...villageForm, name: e.target.value })}
                  placeholder="e.g. Gundya Village"
                  required
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1"
                />
              </div>

              <div>
                <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Estimated Population</label>
                <input 
                  type="number" 
                  value={villageForm.population}
                  onChange={(e) => setVillageForm({ ...villageForm, population: e.target.value })}
                  placeholder="Total count"
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Sanitation Status</label>
                  <select 
                    value={villageForm.sanitationStatus}
                    onChange={(e) => setVillageForm({ ...villageForm, sanitationStatus: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                  >
                    <option value="Good">Good (ODF)</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Drinking Water</label>
                  <select 
                    value={villageForm.waterStatus}
                    onChange={(e) => setVillageForm({ ...villageForm, waterStatus: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                  >
                    <option value="Adequate">Adequate Well</option>
                    <option value="Contaminated">Contaminated</option>
                    <option value="Scarcity">Severe Scarcity</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 active:scale-[0.99]"
              >
                <Save className="w-3.5 h-3.5" />
                Submit Demographics
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: FAMILY REGISTRATION (3-STEP FORM WIZARD) */}
        {activeSubTab === 'family' && (
          <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" />
                Family Registry
              </h3>
              <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded-full text-blue-300 font-bold">Step {familyStep} of 3</span>
            </div>

            {/* Step indicators */}
            <div className="flex gap-1 mb-4 h-1">
              <div className={`flex-1 rounded ${familyStep >= 1 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
              <div className={`flex-1 rounded ${familyStep >= 2 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
              <div className={`flex-1 rounded ${familyStep >= 3 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
            </div>

            <form onSubmit={handleAddFamily} className="space-y-3">
              {familyStep === 1 && (
                <div className="space-y-3 animate-fadeIn">
                  <div>
                    <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Assigned Village</label>
                    <select 
                      value={familyForm.villageId}
                      onChange={(e) => setFamilyForm({ ...familyForm, villageId: e.target.value })}
                      required
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-2 text-xs text-white mt-1 focus:outline-none"
                    >
                      <option value="">-- Choose Village --</option>
                      {visibleVillages.map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">House / Block Number</label>
                    <input 
                      type="text" 
                      value={familyForm.houseNo}
                      onChange={(e) => setFamilyForm({ ...familyForm, houseNo: e.target.value })}
                      placeholder="e.g. 102A"
                      required
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none mt-1"
                    />
                  </div>

                  <button 
                    type="button" 
                    onClick={() => { if (familyForm.villageId && familyForm.houseNo) setFamilyStep(2); }}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-xs flex justify-center items-center gap-1 mt-4"
                  >
                    Next Step <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {familyStep === 2 && (
                <div className="space-y-3 animate-fadeIn">
                  <div>
                    <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Economic Status</label>
                    <select 
                      value={familyForm.economicStatus}
                      onChange={(e) => setFamilyForm({ ...familyForm, economicStatus: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-2 text-xs text-white mt-1 focus:outline-none"
                    >
                      <option value="BPL">BPL (Below Poverty Line)</option>
                      <option value="APL">APL (Above Poverty Line)</option>
                      <option value="Antyodaya">Antyodaya (Vulnerable Family)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Occupation of Head</label>
                    <input 
                      type="text" 
                      value={familyForm.occupation}
                      onChange={(e) => setFamilyForm({ ...familyForm, occupation: e.target.value })}
                      placeholder="e.g. Agricultural Laborer"
                      required
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none mt-1"
                    />
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button 
                      type="button" 
                      onClick={() => setFamilyStep(1)}
                      className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold flex justify-center items-center gap-1 border border-slate-700"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { if (familyForm.occupation) setFamilyStep(3); }}
                      className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-xs font-bold flex justify-center items-center gap-1"
                    >
                      Next Step <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {familyStep === 3 && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Drinking Water</label>
                      <select 
                        value={familyForm.drinkingWater}
                        onChange={(e) => setFamilyForm({ ...familyForm, drinkingWater: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                      >
                        <option value="Tap">Shared Tap</option>
                        <option value="Well">Open Well</option>
                        <option value="Handpump">Hand Pump</option>
                        <option value="River">Pond/River (Unsafe)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Toilet Latrine</label>
                      <select 
                        value={familyForm.toilet}
                        onChange={(e) => setFamilyForm({ ...familyForm, toilet: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                      >
                        <option value="Yes">Yes (Sanitary)</option>
                        <option value="No">No (Defecates Open)</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[10px] space-y-1 mt-2">
                    <p className="font-bold text-slate-400">Review Family Details:</p>
                    <p><span className="text-slate-500">Village ID:</span> {familyForm.villageId}</p>
                    <p><span className="text-slate-500">House No:</span> {familyForm.houseNo}</p>
                    <p><span className="text-slate-500">Status:</span> {familyForm.economicStatus} ({familyForm.occupation})</p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button 
                      type="button" 
                      onClick={() => setFamilyStep(2)}
                      className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold flex justify-center items-center gap-1 border border-slate-700"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl text-xs font-bold flex justify-center items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Record
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* TAB 4: INDIVIDUAL SCREENING CARD WITH CONSENT & RISK SCORING */}
        {activeSubTab === 'individual' && (
          <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400" />
              Patient Health Card
            </h3>

            <form onSubmit={handleAddIndividual} className="space-y-3">
              <div>
                <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Select Family Unit</label>
                <select 
                  value={individualForm.familyId}
                  onChange={(e) => setIndividualForm({ ...individualForm, familyId: e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-2 text-xs text-white mt-1 focus:outline-none"
                >
                  <option value="">-- Choose Family --</option>
                  {visibleFamilies.map(f => (
                    <option key={f.id} value={f.id}>{f.id} ({f.villageName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Patient Full Name</label>
                <input 
                  type="text" 
                  value={individualForm.name}
                  onChange={(e) => setIndividualForm({ ...individualForm, name: e.target.value })}
                  placeholder="Full Name"
                  required
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none mt-1"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Age (Y)</label>
                  <input 
                    type="number" 
                    value={individualForm.age}
                    onChange={(e) => setIndividualForm({ ...individualForm, age: e.target.value })}
                    placeholder="Age"
                    required
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white focus:outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Gender</label>
                  <select 
                    value={individualForm.gender}
                    onChange={(e) => setIndividualForm({ ...individualForm, gender: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-1.5 py-2 text-xs text-white mt-1 focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Blood Group</label>
                  <select 
                    value={individualForm.bloodGroup}
                    onChange={(e) => setIndividualForm({ ...individualForm, bloodGroup: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-1.5 py-2 text-xs text-white mt-1 focus:outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                    <option value="Invalid">Z- (Test Invalid)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Mobile Number</label>
                <input 
                  type="text" 
                  value={individualForm.phone}
                  onChange={(e) => setIndividualForm({ ...individualForm, phone: e.target.value })}
                  placeholder="e.g. 9886012948"
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none mt-1"
                />
              </div>

              {individualForm.gender === 'Female' && (
                <div>
                  <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Pregnancy Status</label>
                  <select 
                    value={individualForm.pregnancyStatus}
                    onChange={(e) => setIndividualForm({ ...individualForm, pregnancyStatus: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes (Pregnant)</option>
                  </select>
                </div>
              )}

              {parseInt(individualForm.age) <= 5 && (
                <div>
                  <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Child Malnutrition</label>
                  <select 
                    value={individualForm.malnutritionStatus}
                    onChange={(e) => setIndividualForm({ ...individualForm, malnutritionStatus: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                  >
                    <option value="none">Normal</option>
                    <option value="moderate">MAM</option>
                    <option value="severe">SAM</option>
                  </select>
                </div>
              )}

              {parseInt(individualForm.age) >= 65 && (
                <div>
                  <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Geriatric: Lives Alone?</label>
                  <select 
                    value={individualForm.livingAlone}
                    onChange={(e) => setIndividualForm({ ...individualForm, livingAlone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                  >
                    <option value="no">No (With family)</option>
                    <option value="yes">Yes (Lives alone)</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Disability Status</label>
                  <select 
                    value={individualForm.disabilityStatus}
                    onChange={(e) => setIndividualForm({ ...individualForm, disabilityStatus: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Vaccination</label>
                  <select 
                    value={individualForm.vaccinationStatus}
                    onChange={(e) => setIndividualForm({ ...individualForm, vaccinationStatus: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                  >
                    <option value="Full">Fully Vaccinated</option>
                    <option value="Partial">Partially Vaccinated</option>
                    <option value="None">Unvaccinated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Chronic Disease Screening</label>
                <div className="grid grid-cols-2 gap-1.5 mt-1 bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[10px]">
                  {['Diabetes', 'Hypertension', 'Tuberculosis', 'Cancer Risk', 'Asthma'].map(disease => (
                    <label key={disease} className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={individualForm.chronicDiseases.includes(disease)}
                        onChange={() => handleToggleDisease(disease)}
                        className="rounded text-rose-500 focus:ring-rose-500 bg-slate-800 border-slate-700"
                      />
                      <span>{disease}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── CONSENT MANAGEMENT ── */}
              <div className="bg-indigo-950/20 border border-indigo-900/40 p-3 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="consent"
                    checked={individualForm.consentGiven}
                    onChange={(e) => setIndividualForm({ ...individualForm, consentGiven: e.target.checked })}
                    className="rounded text-indigo-500 focus:ring-indigo-500 bg-slate-900 border-slate-850"
                  />
                  <label htmlFor="consent" className="text-[10px] font-bold text-indigo-200 cursor-pointer">Consent Given for Health Records?</label>
                </div>
                {individualForm.consentGiven && (
                  <div className="animate-fadeIn">
                    <label className="text-[8.5px] font-extrabold uppercase text-indigo-400 tracking-wider">Verification Signature Method</label>
                    <select
                      value={individualForm.consentMethod}
                      onChange={(e) => setIndividualForm({ ...individualForm, consentMethod: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-white mt-1"
                    >
                      <option value="Thumbprint">Biometric Thumbprint Impression</option>
                      <option value="Written Signature">Signed Consent Form PDF</option>
                      <option value="Verbal on Audio">Verbal Consent Audio Rec</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Live Risk warnings */}
              {liveRiskAlerts.length > 0 && (
                <div className="bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">
                  <p className="text-[9px] font-bold text-rose-400 flex items-center gap-1 uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                    Auto-Identified Risk Alerts:
                  </p>
                  {liveRiskAlerts.map((al, idx) => (
                    <div key={idx} className="text-[9px] text-rose-300 mt-1 pl-1 border-l border-rose-500">
                      <strong>{al.type}</strong>: {al.reason}
                    </div>
                  ))}
                </div>
              )}

              <button 
                type="submit" 
                className="w-full mt-1 bg-gradient-to-r from-rose-600 to-pink-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 active:scale-[0.99] shadow-lg"
              >
                <Save className="w-3.5 h-3.5" />
                Register Screening
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: DAILY VISITS TRACKER (2-STEP FORM WIZARD) */}
        {activeSubTab === 'visit' && (
          <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-amber-400" />
                Visit Entry
              </h3>
              <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded-full text-amber-300 font-bold">Step {visitStep} of 2</span>
            </div>

            <div className="flex gap-1 mb-4 h-1">
              <div className={`flex-1 rounded ${visitStep >= 1 ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
              <div className={`flex-1 rounded ${visitStep >= 2 ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
            </div>

            <form onSubmit={handleAddVisit} className="space-y-3">
              {visitStep === 1 && (
                <div className="space-y-3 animate-fadeIn">
                  <div>
                    <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Select Mapped Family Unit</label>
                    <select 
                      value={visitForm.familyId}
                      onChange={(e) => setVisitForm({ ...visitForm, familyId: e.target.value })}
                      required
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-2 text-xs text-white mt-1 focus:outline-none"
                    >
                      <option value="">-- Choose Family --</option>
                      {visibleFamilies.map(f => (
                        <option key={f.id} value={f.id}>{f.id} ({f.villageName})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Temp (°F)</label>
                      <input 
                        type="text"
                        value={visitForm.tempDeg}
                        onChange={(e) => setVisitForm({ ...visitForm, tempDeg: e.target.value })}
                        placeholder="98.6"
                        required
                        className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">BP Systolic</label>
                      <input 
                        type="text"
                        value={visitForm.bpSys}
                        onChange={(e) => setVisitForm({ ...visitForm, bpSys: e.target.value })}
                        placeholder="120"
                        required
                        className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">BP Diastolic</label>
                      <input 
                        type="text"
                        value={visitForm.bpDia}
                        onChange={(e) => setVisitForm({ ...visitForm, bpDia: e.target.value })}
                        placeholder="80"
                        required
                        className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => { if (visitForm.familyId && visitForm.tempDeg) setVisitStep(2); }}
                    className="w-full bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex justify-center items-center gap-1 mt-4"
                  >
                    Next Step <ChevronRight className="w-3.5 h-3.5 text-slate-950" />
                  </button>
                </div>
              )}

              {visitStep === 2 && (
                <div className="space-y-3 animate-fadeIn">
                  <div>
                    <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Clinical Field Notes</label>
                    <textarea 
                      value={visitForm.notes}
                      onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                      placeholder="Enter details of medication compliance, pregnancy symptoms, NCD checks..."
                      rows="3"
                      required
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none mt-1"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">GPS Position</label>
                      <span className="block text-[8.5px] text-emerald-400 font-mono mt-1 bg-slate-900 p-2 border border-slate-800 rounded-lg">
                        📍 {gpsCoords ? `${gpsCoords.lat}, ${gpsCoords.lng}` : 'Determining...'}
                      </span>
                    </div>
                    <div>
                      <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Next Follow-Up</label>
                      <input 
                        type="date"
                        value={visitForm.followUpDate}
                        onChange={(e) => setVisitForm({ ...visitForm, followUpDate: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button 
                      type="button" 
                      onClick={() => setVisitStep(1)}
                      className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold flex justify-center items-center gap-1 border border-slate-700"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 py-2.5 rounded-xl text-xs font-black flex justify-center items-center gap-1.5 active:scale-[0.99]"
                    >
                      <Save className="w-3.5 h-3.5 text-slate-950" /> Log Visit
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* TAB 6: ECHR LIST WITH PRIVACY CONTROLS (PII MASKING) & SCORING */}
        {activeSubTab === 'echr' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-emerald-400" />
                Electronic Health Records
              </h3>
              <span className="text-[9px] bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800 text-slate-400 font-mono">
                Assigned: {visibleIndividuals.length}
              </span>
            </div>

            <div className="space-y-2">
              {visibleIndividuals.map(ind => {
                const isRevealed = !!revealedPii[ind.id];
                const displayPhone = isRevealed ? ind.phone : "• • • • • • " + (ind.phone && ind.phone !== 'N/A' ? ind.phone.slice(-4) : "—");
                
                return (
                  <div key={ind.id} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-3.5 flex flex-col justify-between hover:border-slate-650 transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1">
                          {ind.name}
                        </h4>
                        
                        {/* ── PRIVACY CONTROLLED PII (Phone) ── */}
                        <div className="flex items-center gap-1 mt-1">
                          <p className="text-[9px] text-slate-400 font-mono">Phone: {displayPhone}</p>
                          {ind.phone && ind.phone !== 'N/A' && (
                            <button 
                              type="button"
                              onClick={() => toggleRevealPii(ind.id, ind.name)}
                              className="text-slate-500 hover:text-cyan-400 transition"
                              title="Reveal Phone Number"
                            >
                              {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          )}
                        </div>

                        {/* Consent Management Badge */}
                        <p className="text-[9.5px] text-slate-500 font-medium">
                          Health ID: <span className="font-mono text-indigo-400">{ind.id}</span> | Age: {ind.age} ({ind.gender})
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        {/* Vulnerability Level Badge */}
                        <span className={`text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full font-black border ${
                          ind.vulnerabilityLevel === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/25 animate-pulse' :
                          ind.vulnerabilityLevel === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                        }`}>
                          Risk Score: {ind.vulnerabilityScore} ({ind.vulnerabilityLevel})
                        </span>
                        
                        {/* Consent Verified Badge */}
                        {ind.consentGiven ? (
                          <span className="bg-indigo-500/10 text-indigo-400 text-[8.5px] px-1.5 py-0.5 rounded border border-indigo-500/20 font-bold">
                            ✓ Consent ({ind.consentMethod})
                          </span>
                        ) : (
                          <span className="bg-amber-500/10 text-amber-400 text-[8.5px] px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                            ⚠ No Consent Captured
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 mt-2.5 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80 text-[9px]">
                      <div>
                        <span className="text-slate-500">Blood Group:</span> <span className="text-slate-300 font-bold">{ind.bloodGroup}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Diseases:</span> <span className="text-slate-300 font-bold truncate block">{ind.chronicDiseases.length > 0 ? ind.chronicDiseases.join(', ') : 'None'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Pregnancy:</span> <span className="text-slate-300 font-bold">{ind.pregnancyStatus}</span>
                      </div>
                    </div>

                    {ind.alerts?.map((al, index) => (
                      <div key={index} className="bg-rose-950/20 border border-rose-900/40 text-[9px] text-rose-300 p-2 rounded-xl mt-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{al.reason}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 7: WEEKLY AWARENESS PROGRAM LOGGING */}
        {activeSubTab === 'programs' && (
          <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              Awareness Campaign Logger
            </h3>

            <form onSubmit={handleAddProgram} className="space-y-3">
              <div>
                <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Select Target Village</label>
                <select 
                  value={programForm.villageId}
                  onChange={(e) => setProgramForm({ ...programForm, villageId: e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-2 text-xs text-white mt-1"
                >
                  <option value="">-- Choose Village --</option>
                  {visibleVillages.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Program Topic</label>
                <select 
                  value={programForm.topic}
                  onChange={(e) => setProgramForm({ ...programForm, topic: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1"
                >
                  <option value="Menstrual Hygiene">Menstrual Hygiene Awareness</option>
                  <option value="Nutrition Education">Nutrition & Anemia prevention</option>
                  <option value="Tobacco Prevention">Tobacco / Substance De-addiction</option>
                  <option value="Child Nutrition under-5">Under-5 Child Care & Immunization</option>
                  <option value="Geriatric Support">Elderly Care & Support Group</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Participants Count</label>
                <input 
                  type="number"
                  value={programForm.participants}
                  onChange={(e) => setProgramForm({ ...programForm, participants: e.target.value })}
                  placeholder="Total attended"
                  required
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1"
                />
              </div>

              <div>
                <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Outcome Summary</label>
                <textarea 
                  value={programForm.outcome}
                  onChange={(e) => setProgramForm({ ...programForm, outcome: e.target.value })}
                  placeholder="Summarize community feedback..."
                  rows="3"
                  required
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 active:scale-[0.99]"
              >
                <Save className="w-3.5 h-3.5" />
                Submit Activity Report
              </button>
            </form>
          </div>
        )}

        {/* TAB 8: GPS ATTENDANCE & HR */}
        {activeSubTab === 'attendance' && (
          <div className="space-y-4">
            
            {/* GPS Attendance Panel */}
            <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl">
              <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" />
                GPS Work Check-In
              </h3>
              <p className="text-[10px] text-slate-400 mb-4">VHWs must check-in daily from designated villages. GPS coords verified automatically.</p>

              {attendanceStatus === 'checked-out' ? (
                <button 
                  onClick={handleCheckIn}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-850 text-white font-bold py-3.5 rounded-2xl text-xs transition shadow-lg active:scale-97 flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4 animate-bounce" />
                  GPS Duty Check-In
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-slate-900 border border-blue-900/30 p-3.5 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Duty Status</p>
                    <h4 className="text-emerald-400 font-bold text-xs mt-1">✓ Active Shift Logged</h4>
                    <p className="text-[10px] text-slate-300 font-mono mt-1">Started: {attendanceTime} | Location: {gpsCoords?.lat}, {gpsCoords?.lng}</p>
                  </div>
                  <button 
                    onClick={handleCheckOut}
                    className="w-full bg-slate-700 hover:bg-slate-650 border border-slate-650 text-white font-bold py-2.5 rounded-xl text-xs transition active:scale-97 flex items-center justify-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Duty Check-Out
                  </button>
                </div>
              )}
            </div>

            {/* Leave Management Form */}
            <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl">
              <h3 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Leave Application</h3>
              <form onSubmit={handleApplyLeave} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Start Date</label>
                    <input 
                      type="date"
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      required
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Days Needed</label>
                    <select
                      value={leaveForm.days}
                      onChange={(e) => setLeaveForm({ ...leaveForm, days: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
                    >
                      <option value="1">1 Day</option>
                      <option value="2">2 Days</option>
                      <option value="3">3 Days</option>
                      <option value="5">5 Days</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Reason for Leave</label>
                  <input 
                    type="text"
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    placeholder="Medical, family ceremony, etc."
                    required
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white focus:outline-none mt-1"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-650 text-white font-bold py-2 rounded-xl text-xs transition"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 9: TRAINING MODULES & QUIZ */}
        {activeSubTab === 'training' && (
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
        )}

        {/* TAB 10: OFFLINE SYNC SIMULATION SANDBOX & LOGS */}
        {activeSubTab === 'sync_sandbox' && (
          <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/60 pb-2">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-indigo-400" />
                Sync Debugger & Sandbox
              </h3>
              <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-300 font-bold">Local Sync Client</span>
            </div>

            <div className="space-y-3">
              {/* Network Connectivity Switcher */}
              <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <div>
                  <h4 className="text-[11px] font-bold text-white">Network Status</h4>
                  <p className="text-[9px] text-slate-400">Enables/disables central cloud sync</p>
                </div>
                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                    isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </button>
              </div>

              {/* Queue Status summary */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <h4 className="text-[11px] font-bold text-white mb-2">Local Sync Queue ({offlineQueue.length} items)</h4>
                
                {offlineQueue.length > 0 ? (
                  <div className="space-y-1.5 max-h-28 overflow-y-auto">
                    {offlineQueue.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[9px] bg-slate-950 p-2 rounded-lg border border-slate-900 font-mono">
                        <span className="text-slate-300">[{item.type.toUpperCase()}] ID: {item.data.id || 'N/A'}</span>
                        <span className="text-amber-400 font-bold">Pending Sync</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-500 italic py-2 text-center">Local queue is clean. Ready to capture offline field data.</p>
                )}
              </div>

              {/* Sync Actions */}
              <button
                onClick={runOfflineSyncSimulation}
                disabled={isSimulatingSync || offlineQueue.length === 0 || !isOnline}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex justify-center items-center gap-1.5 ${
                  isSimulatingSync || offlineQueue.length === 0 || !isOnline
                    ? 'bg-slate-800 text-slate-500 border border-slate-750 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg active:scale-[0.99]'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingSync ? 'animate-spin' : ''}`} />
                Run Central Sync Pipeline
              </button>

              {/* Log Console Output */}
              {syncLogs.length > 0 && (
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-3 font-mono text-[9px] text-slate-300 space-y-1 max-h-40 overflow-y-auto">
                  <p className="text-slate-500 border-b border-slate-900 pb-1 mb-1 font-bold">Sync Console Log Output:</p>
                  {syncLogs.map((log, idx) => (
                    <p key={idx} className={log.includes('Warning') ? 'text-amber-400' : log.includes('✅') || log.includes('🎉') ? 'text-emerald-400' : 'text-slate-300'}>
                      {log}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur border-t border-slate-800/80 py-2.5 px-3 flex justify-between items-center z-40">
        <button 
          onClick={() => setActiveSubTab('home')}
          className={`flex flex-col items-center gap-1 transition ${activeSubTab === 'home' ? 'text-blue-500 font-bold' : 'text-slate-500 hover:text-slate-200'}`}
        >
          <ClipboardList className="w-4 h-4" />
          <span className="text-[9px]">Home</span>
        </button>

        <button 
          onClick={() => setActiveSubTab('echr')}
          className={`flex flex-col items-center gap-1 transition ${activeSubTab === 'echr' ? 'text-blue-500 font-bold' : 'text-slate-500 hover:text-slate-200'}`}
        >
          <Users className="w-4 h-4" />
          <span className="text-[9px]">Patients</span>
        </button>

        <button 
          onClick={() => setActiveSubTab('programs')}
          className={`flex flex-col items-center gap-1 transition ${activeSubTab === 'programs' ? 'text-blue-500 font-bold' : 'text-slate-500 hover:text-slate-200'}`}
        >
          <Heart className="w-4 h-4" />
          <span className="text-[9px]">Programs</span>
        </button>

        <button 
          onClick={() => setActiveSubTab('attendance')}
          className={`flex flex-col items-center gap-1 transition ${activeSubTab === 'attendance' ? 'text-blue-500 font-bold' : 'text-slate-500 hover:text-slate-200'}`}
        >
          <Clock className="w-4 h-4" />
          <span className="text-[9px]">HR/GPS</span>
        </button>

        <button 
          onClick={() => setActiveSubTab('training')}
          className={`flex flex-col items-center gap-1 transition ${activeSubTab === 'training' ? 'text-blue-500 font-bold' : 'text-slate-500 hover:text-slate-200'}`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[9px]">Training</span>
        </button>
      </div>

    </div>
  );
}
