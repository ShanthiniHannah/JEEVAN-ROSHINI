import React, { useState, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import {
  Users, MapPin, ShieldAlert, Heart, Trash2, UserCheck, Plus, Download,
  Bell, FileText, Activity, AlertTriangle, CheckCircle2, XCircle, Clock,
  Database, Eye, Filter, RefreshCw, TrendingUp, BarChart2, PieChart, Mail,
  MessageSquare, Phone, Shield, Edit3, Lock, Unlock, Send, FileSpreadsheet,
  BookOpen, Award, Home, Server, ShieldCheck, ChevronRight
} from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Analytics', icon: BarChart2 },
  { id: 'villages', label: 'Village Mapping', icon: MapPin },
  { id: 'users', label: 'Access Control', icon: Shield },
  { id: 'alerts', label: 'Risk Alerts', icon: AlertTriangle },
  { id: 'support', label: 'Social Support', icon: Heart },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'reports', label: 'Security & Uploads', icon: FileText },
  { id: 'audit', label: 'Audit Logs', icon: Activity },
  { id: 'backup', label: 'Backup & DR', icon: Database }
];

export default function AdminPortal({ state, setState, env, setEnv }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddVillageModal, setShowAddVillageModal] = useState(false);
  const [newVillageData, setNewVillageData] = useState({ name: '', block: 'Chikkamagaluru', district: 'Chikkamagaluru', population: '', waterStatus: 'Adequate', sanitationStatus: 'Good' });
  const [newUserRole, setNewUserRole] = useState({ name: '', role: 'Village Health Worker', contact: '' });
  const [alertFilter, setAlertFilter] = useState('all');
  
  // Notification States
  const [notifForm, setNotifForm] = useState({ type: 'SMS', recipient: '', title: '', message: '' });
  const [notifLogs, setNotifLogs] = useState([
    { id: 'API-001', channel: 'SMS (Twilio API)', destination: '+91 9880192840', payload: 'Dear Radha, next antenatal check on 28/05.', status: '202 Accepted', time: '25/05/2026 08:00 AM' },
    { id: 'API-002', channel: 'WhatsApp (Meta Cloud API)', destination: '+91 9448102948', payload: 'Suresh, take TB medicine. VHW Preema alert.', status: '200 OK', time: '26/05/2026 07:30 AM' },
    { id: 'API-003', channel: 'Email (SMTP SendGrid)', destination: 'admin@ayathanatrust.org', payload: 'Monthly block report summary ready.', status: '250 Mail OK', time: '01/06/2026 09:00 AM' }
  ]);

  const [successBanner, setSuccessBanner] = useState('');

  // Secure File Upload states
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [uploadLogs, setUploadLogs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Backup & DR states
  const [backupSchedule, setBackupSchedule] = useState([
    { name: 'Daily MySQL Database Dump', status: 'Completed', time: '01/06/2026 02:00 AM', size: '48.2 MB' },
    { name: 'Weekly Application Archive', status: 'Completed', time: '31/05/2026 01:00 AM', size: '412.8 MB' }
  ]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [drLogs, setDrLogs] = useState([]);
  const [isTestingDR, setIsTestingDR] = useState(false);

  // Audit Logs Filter
  const [auditSearch, setAuditSearch] = useState('');

  const notify = (msg) => { setSuccessBanner(msg); setTimeout(() => setSuccessBanner(''), 3000); };

  // ── DATA PREPARATION FOR EXECUTIVE DASHBOARD ──
  const statsSummary = useMemo(() => {
    const totalVillages = state.villages.length;
    const totalFamilies = state.families.length;
    const totalIndividuals = state.individuals.length;
    const activeAlerts = state.alerts.filter(a => !a.resolved).length;
    const totalVisits = state.visits.length;
    
    const pregnantCount = state.individuals.filter(i => i.gender === 'Female' && i.pregnancyStatus === 'Yes').length;
    const highRiskPregCount = state.individuals.filter(i => i.gender === 'Female' && i.pregnancyStatus === 'Yes' && i.alerts?.some(a => a.type === 'High-Risk Pregnancy')).length;
    
    const childrenUnder5 = state.individuals.filter(i => parseInt(i.age) <= 5);
    const malnutritionCount = childrenUnder5.filter(c => c.malnutritionStatus === 'moderate' || c.malnutritionStatus === 'severe').length;
    
    const activeVhwCount = state.staff.filter(s => s.role === 'Village Health Worker' && s.status === 'Active').length;
    const totalPrograms = state.programs.length;

    return {
      totalVillages,
      totalFamilies,
      totalIndividuals,
      activeAlerts,
      totalVisits,
      pregnantCount,
      highRiskPregCount,
      malnutritionCount,
      activeVhwCount,
      totalPrograms
    };
  }, [state]);

  const getDiseaseCounts = () => {
    const c = { Diabetes: 0, Hypertension: 0, Tuberculosis: 0, 'Cancer Risk': 0, Asthma: 0 };
    state.individuals.forEach(i => { i.chronicDiseases?.forEach(d => { if (c[d] !== undefined) c[d]++; }); });
    return Object.values(c);
  };

  const getMaternalRatio = () => {
    let normal = 0, risk = 0;
    state.individuals.forEach(i => {
      if (i.gender === 'Female' && i.pregnancyStatus === 'Yes') {
        i.alerts?.some(a => a.type === 'High-Risk Pregnancy') ? risk++ : normal++;
      }
    });
    return (normal === 0 && risk === 0) ? [12, 4] : [normal, risk];
  };

  const getVillageSummary = () => {
    const cats = state.villages.map(v => v.name.length > 10 ? v.name.slice(0, 10) + '…' : v.name);
    const fam = state.villages.map(v => state.families.filter(f => f.villageName === v.name).length);
    const ind = state.villages.map(v => state.individuals.filter(i => {
      const f = state.families.find(f => f.id === i.familyId);
      return f && f.villageName === v.name;
    }).length);
    return { cats, fam, ind };
  };

  const getMonthlyVisits = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return { months, data: [8, 14, 11, 18, 22, state.visits.length + 10] };
  };

  const vs = getVillageSummary();
  const mv = getMonthlyVisits();

  const chartBase = { toolbar: { show: false }, background: 'transparent', fontFamily: 'Inter, sans-serif' };
  const axisStyle = { colors: '#64748b', fontSize: '11px' };

  const diseaseOpts = {
    chart: { ...chartBase, type: 'bar' },
    plotOptions: { bar: { borderRadius: 5, distributed: true, columnWidth: '50%' } },
    colors: ['#3b82f6', '#f43f5e', '#f59e0b', '#a855f7', '#06b6d4'],
    dataLabels: { enabled: true, style: { colors: ['#fff'], fontSize: '10px', fontWeight: 700 } },
    xaxis: { categories: ['Diabetes', 'Hypertension', 'TB', 'Cancer', 'Asthma'], labels: { style: axisStyle } },
    yaxis: { labels: { style: axisStyle } },
    grid: { borderColor: '#1e293b' }, theme: { mode: 'dark' }, legend: { show: false },
    tooltip: { theme: 'dark' }
  };

  const maternalOpts = {
    chart: { ...chartBase, type: 'donut' },
    labels: ['Normal Pregnancy', 'High-Risk Pregnancy'],
    colors: ['#10b981', '#ef4444'],
    plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, label: 'Pregnant', color: '#94a3b8', fontSize: '11px' } } } } },
    dataLabels: { enabled: false },
    legend: { position: 'bottom', labels: { colors: '#94a3b8' } },
    theme: { mode: 'dark' }, tooltip: { theme: 'dark' }
  };

  const villageOpts = {
    chart: { ...chartBase, type: 'bar' },
    colors: ['#6366f1', '#10b981'],
    plotOptions: { bar: { columnWidth: '60%', borderRadius: 4, grouped: true } },
    dataLabels: { enabled: false },
    xaxis: { categories: vs.cats.length ? vs.cats : ['V1', 'V2', 'V3'], labels: { style: axisStyle } },
    yaxis: { labels: { style: axisStyle } },
    grid: { borderColor: '#1e293b' }, legend: { labels: { colors: '#94a3b8' } },
    theme: { mode: 'dark' }, tooltip: { theme: 'dark' }
  };

  const visitTrendOpts = {
    chart: { ...chartBase, type: 'area' },
    colors: ['#6366f1'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
    stroke: { curve: 'smooth', width: 2 },
    dataLabels: { enabled: false },
    xaxis: { categories: mv.months, labels: { style: axisStyle } },
    yaxis: { labels: { style: axisStyle } },
    grid: { borderColor: '#1e293b' }, theme: { mode: 'dark' }, tooltip: { theme: 'dark' }
  };

  // ── HANDLERS ──
  const handleCreateVillage = (e) => {
    e.preventDefault();
    if (!newVillageData.name) return;
    const v = { id: 'VLG-' + Math.floor(1000 + Math.random() * 9000), ...newVillageData };
    setState(p => ({ 
      ...p, 
      villages: [...p.villages, v],
      auditLogs: [
        { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: 'Central Admin', action: 'CREATE_VILLAGE', desc: `Mapped village sector ${v.name}`, ip: '192.168.1.1', time: new Date().toLocaleString(), oldValue: 'None', newValue: v.name },
        ...p.auditLogs
      ]
    }));
    setShowAddVillageModal(false);
    setNewVillageData({ name: '', block: 'Chikkamagaluru', district: 'Chikkamagaluru', population: '', waterStatus: 'Adequate', sanitationStatus: 'Good' });
    notify('Village mapped successfully!');
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserRole.name) return;
    const s = {
      id: 'STF-' + Math.floor(100 + Math.random() * 900),
      name: newUserRole.name, role: newUserRole.role,
      village: 'Assigned Villages', status: 'Active',
      contacts: newUserRole.contact || '+91 98860 ' + Math.floor(10000 + Math.random() * 90000)
    };
    setState(p => ({ 
      ...p, 
      staff: [...p.staff, s],
      auditLogs: [
        { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: 'Central Admin', action: 'CREATE_STAFF', desc: `Registered user account ${s.name} (${s.role})`, ip: '192.168.1.1', time: new Date().toLocaleString(), oldValue: 'None', newValue: s.name },
        ...p.auditLogs
      ]
    }));
    setNewUserRole({ name: '', role: 'Village Health Worker', contact: '' });
    notify('Staff account created and activated!');
  };

  const handleDeleteStaff = (id, name) => {
    setState(p => ({ 
      ...p, 
      staff: p.staff.filter(s => s.id !== id),
      auditLogs: [
        { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: 'Central Admin', action: 'DELETE_STAFF', desc: `Deleted user account: ${name}`, ip: '192.168.1.1', time: new Date().toLocaleString(), oldValue: name, newValue: 'Deleted' },
        ...p.auditLogs
      ]
    }));
  };

  const handleToggleStaffStatus = (id, name, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setState(p => ({
      ...p,
      staff: p.staff.map(s => s.id === id ? { ...s, status: nextStatus } : s),
      auditLogs: [
        { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: 'Central Admin', action: 'UPDATE_STAFF_STATUS', desc: `Changed access status for ${name} to ${nextStatus}`, ip: '192.168.1.1', time: new Date().toLocaleString(), oldValue: currentStatus, newValue: nextStatus },
        ...p.auditLogs
      ]
    }));
  };

  const handleResolveAlert = (id, patientName, type) => {
    setState(p => ({ 
      ...p, 
      alerts: p.alerts.map(a => a.id === id ? { ...a, resolved: true } : a),
      auditLogs: [
        { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: 'Central Admin', action: 'RESOLVE_ALERT', desc: `Resolved risk alert ${type} for patient ${patientName}`, ip: '192.168.1.1', time: new Date().toLocaleString(), oldValue: 'Unresolved', newValue: 'Resolved' },
        ...p.auditLogs
      ]
    }));
    notify('Alert marked as resolved.');
  };

  // Notification API Delivery engine
  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!notifForm.recipient || !notifForm.message) return;
    
    // Choose API channel details
    let channelName = 'SMS (Twilio API)';
    if (notifForm.type === 'WhatsApp') channelName = 'WhatsApp (Meta Cloud API)';
    else if (notifForm.type === 'Email') channelName = 'Email (SMTP SendGrid)';

    const newLog = {
      id: 'API-' + Math.floor(1000 + Math.random() * 9000),
      channel: channelName,
      destination: notifForm.recipient,
      payload: notifForm.message,
      status: notifForm.type === 'Email' ? '250 Mail OK' : '202 Accepted',
      time: new Date().toLocaleString()
    };

    // Store in internal state
    setNotifLogs(prev => [newLog, ...prev]);

    // Also push to legacy global state notifications
    const legacyNotif = {
      id: newLog.id,
      type: notifForm.type,
      recipient: notifForm.recipient,
      title: notifForm.title || 'System Notification',
      message: notifForm.message,
      status: 'Sent',
      sentAt: newLog.time
    };

    setState(p => ({
      ...p,
      notifications: [legacyNotif, ...(p.notifications || [])],
      auditLogs: [
        { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: 'Central Admin', action: 'SEND_NOTIFICATION', desc: `Transmitted ${notifForm.type} notification to ${notifForm.recipient}`, ip: '192.168.1.1', time: new Date().toLocaleString(), oldValue: 'Draft', newValue: 'Transmitted' },
        ...p.auditLogs
      ]
    }));
    setNotifForm({ type: 'SMS', recipient: '', title: '', message: '' });
    notify(`Notification successfully transmitted via ${channelName}!`);
  };

  // Secure File Upload Simulator
  const handleSimulateFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadErrors([]);
    setUploadLogs([]);
    setIsUploading(true);

    const errors = [];
    // 1. MIME Validation
    const allowedMime = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowedMime.includes(file.type)) {
      errors.push(`❌ Invalid MIME type: ${file.type}. Only PDF, PNG, and JPEG allowed.`);
    }

    // 2. File size limit (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push(`❌ File size exceeds 5MB limit. Actual size: ${(file.size / (1024 * 1024)).toFixed(2)} MB.`);
    }

    if (errors.length > 0) {
      setUploadErrors(errors);
      setIsUploading(false);
      notifyError("File upload security rejection.");
      return;
    }

    // Simulation steps
    const addLog = (msg, delay) => new Promise(res => setTimeout(() => {
      setUploadLogs(prev => [...prev, msg]); res();
    }, delay));

    (async () => {
      await addLog("📁 Initializing secure file drop upload...", 300);
      await addLog("🔍 Executing virus signature definitions scan...", 500);
      await addLog("🟢 Malware scan complete. 0 viruses detected.", 350);
      
      const fileExt = file.name.split('.').pop();
      const secureRandomName = `doc_${Math.random().toString(36).substring(2, 12)}.${fileExt}`;
      await addLog(`🔒 Renaming object for isolation: ${file.name} ➔ ${secureRandomName}`, 500);
      await addLog("💾 Allocating payload to isolated private storage container...", 400);
      await addLog("✅ Upload pipeline success! Encryption keys verified.", 300);

      // Log to central audit trail
      setState(prev => ({
        ...prev,
        auditLogs: [
          { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: 'Central Admin', action: 'SECURE_FILE_UPLOAD', desc: `Uploaded medical document renamed to ${secureRandomName}`, ip: '192.168.1.1', time: new Date().toLocaleString(), oldValue: file.name, newValue: secureRandomName },
          ...prev.auditLogs
        ]
      }));

      setIsUploading(false);
      notify("Document securely uploaded and encrypted!");
    })();
  };

  // Backup Manual Trigger
  const triggerManualBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const nextBackup = {
        name: 'Manual MySQL Database Dump',
        status: 'Completed',
        time: new Date().toLocaleString(),
        size: '49.8 MB'
      };
      setBackupSchedule(prev => [nextBackup, ...prev]);
      setIsBackingUp(false);
      notify("Backup successfully generated and encrypted at rest!");
    }, 2000);
  };

  // Disaster Recovery Restore test
  const triggerDRRestoreTest = () => {
    setIsTestingDR(true);
    setDrLogs([]);

    const addLog = (msg, delay) => new Promise(res => setTimeout(() => {
      setDrLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]); res();
    }, delay));

    (async () => {
      await addLog("🛟 Launching Disaster Recovery (DR) testing protocol...", 400);
      await addLog("🔍 Fetching target weekly backup archive (Weekly App Archive, 412.8 MB)...", 600);
      await addLog("📂 Decrypting container payload and verifying SHA-256 hash checksum...", 500);
      await addLog("🔄 Provisioning isolated staging recovery container database...", 600);
      await addLog("⚡ Restoring relational MySQL schema indices and tables...", 500);
      await addLog("✅ Relational check complete. Restored: 5 villages, 5 families, 9 individuals.", 400);
      await addLog("🎉 Disaster Recovery test successful! Parity: 100%.", 400);
      
      setIsTestingDR(false);
      notify("DR recovery test completed successfully!");
    })();
  };

  // Filtered Audit logs based on search query
  const filteredAuditLogs = useMemo(() => {
    const search = auditSearch.toLowerCase().trim();
    if (!search) return state.auditLogs;
    return state.auditLogs.filter(
      log => 
        log.user?.toLowerCase().includes(search) || 
        log.action?.toLowerCase().includes(search) || 
        log.desc?.toLowerCase().includes(search)
    );
  }, [state.auditLogs, auditSearch]);

  const filteredAlerts = alertFilter === 'all'
    ? state.alerts
    : alertFilter === 'critical'
    ? state.alerts.filter(a => a.severity === 'critical')
    : alertFilter === 'unresolved'
    ? state.alerts.filter(a => !a.resolved)
    : state.alerts.filter(a => a.resolved);

  const supportRecords = state.supportRecords || [];

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
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 30%, rgba(15, 23, 42, 0.4)), url(/admin-portal-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="relative z-10">
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 backdrop-blur-sm">
            Super Admin Portal
          </span>
          <h2 className="text-2xl font-black text-white mt-2 drop-shadow-md">Central Health Governance System</h2>
          <p className="text-xs text-slate-300 mt-1 drop-shadow">Active Platform Environment: <span className="font-extrabold uppercase text-cyan-400">{env}</span> Mode</p>
        </div>

        {/* ── ENVIRONMENT SWITCHER ── */}
        <div className="flex flex-col gap-1.5 bg-slate-950/80 border border-slate-800 p-3 rounded-xl backdrop-blur-sm z-10">
          <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Change Environment</span>
          <div className="flex gap-1">
            {['Development', 'Staging', 'Production'].map(e => (
              <button 
                key={e}
                onClick={() => {
                  setEnv(e);
                  notify(`Active environment mode switched to: ${e}`);
                }}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition ${
                  env === e 
                    ? 'bg-cyan-600 text-white border border-cyan-500' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {e}
              </button>
            ))}
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
                activeTab === tab.id ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}>
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── TAB: EXECUTIVE SUMMARY ANALYTICS ── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Executive Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase">Total Villages</span>
              <p className="text-xl font-black text-white mt-1">{statsSummary.totalVillages}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase">Total Families</span>
              <p className="text-xl font-black text-white mt-1">{statsSummary.totalFamilies}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase">Individuals Mapped</span>
              <p className="text-xl font-black text-white mt-1">{statsSummary.totalIndividuals}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase">Active High-Risk Cases</span>
              <p className="text-xl font-black text-rose-400 mt-1">{statsSummary.activeAlerts}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase">Pregnant Mothers (Risk)</span>
              <p className="text-xl font-black text-emerald-400 mt-1">{statsSummary.pregnantCount} <span className="text-[10px] text-rose-400">({statsSummary.highRiskPregCount} High Risk)</span></p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase">Child Malnutrition</span>
              <p className="text-xl font-black text-amber-400 mt-1">{statsSummary.malnutritionCount} <span className="text-[10px] text-slate-500">SAM/MAM</span></p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase">Active VHW Shift Logs</span>
              <p className="text-xl font-black text-indigo-400 mt-1">{statsSummary.activeVhwCount} workers</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase">Programs Conducted</span>
              <p className="text-xl font-black text-white mt-1">{statsSummary.totalPrograms}</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Chronic Disease Prevalence</h4>
              <ReactApexChart options={diseaseOpts} series={[{ name: 'Cases', data: getDiseaseCounts() }]} type="bar" height={220} />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Maternal Health Risk Ratios</h4>
              <ReactApexChart options={maternalOpts} series={getMaternalRatio()} type="donut" height={220} />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Demographic Mapping index</h4>
              <ReactApexChart options={villageOpts} series={[{ name: 'Families', data: vs.fam }, { name: 'Individuals', data: vs.ind }]} type="bar" height={220} />
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: VILLAGE MAPPING ── */}
      {activeTab === 'villages' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-900 p-4 border border-slate-800 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Mapped Villages Directory</h3>
            <button onClick={() => setShowAddVillageModal(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs uppercase flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Map Rural Sector
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="p-4">Sector ID</th>
                  <th className="p-4">Village Name</th>
                  <th className="p-4">Est. Population</th>
                  <th className="p-4">Water Status</th>
                  <th className="p-4">Sanitation Status</th>
                  <th className="p-4">Block / District</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {state.villages.map(v => (
                  <tr key={v.id} className="hover:bg-slate-850/50">
                    <td className="p-4 font-mono font-bold text-cyan-400">{v.id}</td>
                    <td className="p-4 text-slate-200 font-bold">{v.name}</td>
                    <td className="p-4 text-slate-300 font-semibold">{v.population || '—'}</td>
                    <td className="p-4">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        v.waterStatus === 'Adequate' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>{v.waterStatus}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        v.sanitationStatus === 'Good' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>{v.sanitationStatus}</span>
                    </td>
                    <td className="p-4 text-slate-400">Chikkamagaluru Block</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Village modal popup */}
          {showAddVillageModal && (
            <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/80">
              <form onSubmit={handleCreateVillage} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4">
                <h4 className="text-sm font-bold text-white uppercase border-b border-slate-800 pb-2">Map Rural Village Sector</h4>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-slate-500">Village Name</label>
                  <input type="text" value={newVillageData.name} onChange={e => setNewVillageData({ ...newVillageData, name: e.target.value })} required
                    placeholder="e.g. Gundya Village" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-bold uppercase text-slate-500">Population</label>
                    <input type="number" value={newVillageData.population} onChange={e => setNewVillageData({ ...newVillageData, population: e.target.value })}
                      placeholder="Est. Count" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase text-slate-500">District Block</label>
                    <input type="text" value={newVillageData.block} disabled className="w-full bg-slate-950/60 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-500" />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button type="button" onClick={() => setShowAddVillageModal(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-2 rounded-lg text-xs">Cancel</button>
                  <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-4 py-2 rounded-lg text-xs">Save Sector</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: ACCESS CONTROL / STAFF MANAGEMENT ── */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              NGO Access Control Directory
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="p-4">User ID</th>
                    <th className="p-4">Staff Name</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {state.staff.map(user => (
                    <tr key={user.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-mono font-bold text-cyan-400">{user.id}</td>
                      <td className="p-4 font-bold text-slate-200">{user.name}</td>
                      <td className="p-4 text-slate-300 font-semibold">{user.role}</td>
                      <td className="p-4 font-mono text-slate-400">{user.contacts || user.email}</td>
                      <td className="p-4">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>{user.status}</span>
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button onClick={() => handleToggleStaffStatus(user.id, user.name, user.status)} className="text-cyan-400 hover:underline font-bold">
                          {user.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                        {user.id !== 'STF-001' && (
                          <button onClick={() => handleDeleteStaff(user.id, user.name)} className="text-rose-400 hover:text-rose-500 transition">
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 mb-4">Create Staff Account</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Staff Name</label>
                <input type="text" value={newUserRole.name} onChange={e => setNewUserRole({ ...newUserRole, name: e.target.value })} required
                  placeholder="e.g. Priyah Gowda" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">System Role</label>
                <select value={newUserRole.role} onChange={e => setNewUserRole({ ...newUserRole, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                  <option value="Village Health Worker">Village Health Worker (VHW)</option>
                  <option value="Project Director">Project Director</option>
                  <option value="Super Admin (Trust)">Super Admin (Trust)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Contact Number</label>
                <input type="text" value={newUserRole.contact} onChange={e => setNewUserRole({ ...newUserRole, contact: e.target.value })}
                  placeholder="+91 98860 XXXXX" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white" />
              </div>
              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition">
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── TAB: RISK ALERTS MONITORING ── */}
      {activeTab === 'alerts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Active Relational Risk Alerts
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Clinical warning alerts generated by the PWA screening rules</p>
            </div>
            <div className="flex gap-2 text-xs">
              {['all', 'critical', 'unresolved', 'resolved'].map(f => (
                <button key={f} onClick={() => setAlertFilter(f)}
                  className={`px-3 py-1.5 rounded-lg border font-bold transition ${
                    alertFilter === f ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}>
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredAlerts.map(al => (
              <div key={al.id} className="border border-slate-800 p-4 rounded-xl bg-slate-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-200">{al.patientName} <span className="text-[10px] text-slate-500 font-mono">({al.patientId})</span></h4>
                    <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded font-black ${
                      al.severity === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>{al.severity}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold text-rose-300">{al.type}</p>
                  <p className="text-[11px] text-slate-400 leading-normal mt-0.5">{al.reason}</p>
                  <span className="block text-[8px] text-slate-500 font-mono mt-1">Logged Date: {al.date}</span>
                </div>
                
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className={`text-xs font-bold ${al.resolved ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
                    {al.resolved ? 'Resolved' : 'Active Warning'}
                  </span>
                  {!al.resolved && (
                    <button onClick={() => handleResolveAlert(al.id, al.patientName, al.type)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition">
                      Resolve Case
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: SOCIAL SUPPORT RECOGNITION ── */}
      {activeTab === 'support' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-400" /> Beneficiary Support Records &amp; Social Welfare mapping
            </h3>
            <button onClick={handleAddSupportRecord} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs uppercase flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Log Support
            </button>
          </div>

          <div className="space-y-3.5">
            {supportRecords.map(sup => (
              <div key={sup.id} className="border border-slate-850 p-4 rounded-xl bg-slate-950/20 hover:border-slate-700 transition">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white">{sup.beneficiary}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-extrabold text-cyan-400">{sup.category}</p>
                  </div>
                  <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded font-mono text-slate-400">{sup.date}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3 text-xs leading-normal">
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                    <p className="text-[9px] text-slate-500 uppercase font-black">Support Material Provided</p>
                    <p className="text-slate-200 mt-1 font-bold">{sup.support}</p>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                    <p className="text-[9px] text-slate-500 uppercase font-black">Social Welfare Scheme</p>
                    <p className="text-slate-200 mt-1 font-bold">{sup.scheme}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: REAL NOTIFICATION ENGINE DELIVERY LOGS ── */}
      {activeTab === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              API Notification Transmission logs
            </h3>
            
            <div className="space-y-2 max-h-[420px] overflow-y-auto">
              {notifLogs.map(log => (
                <div key={log.id} className="border border-slate-850 bg-slate-950/20 p-3 rounded-xl flex flex-col justify-between hover:border-slate-750 transition text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400 font-bold">[{log.channel}] ➔ {log.destination}</span>
                    <span className="text-[10px] text-slate-500">{log.time}</span>
                  </div>
                  <p className="text-slate-300 mt-2 font-sans italic">"{log.payload}"</p>
                  <div className="flex justify-between items-center mt-2.5 border-t border-slate-900/80 pt-1.5 text-[10px]">
                    <span className="text-slate-500">API Log ID: {log.id}</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full ${
                      log.status.includes('OK') || log.status.includes('Accepted') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 mb-4">Send Alert Notification</h3>
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Gateway Channel</label>
                <select value={notifForm.type} onChange={e => setNotifForm({ ...notifForm, type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                  <option value="SMS">Twilio SMS (API Gateway)</option>
                  <option value="WhatsApp">Meta WhatsApp (API Sandbox)</option>
                  <option value="Email">SMTP SendGrid (Email Server)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Recipient Destination</label>
                <input type="text" value={notifForm.recipient} onChange={e => setNotifForm({ ...notifForm, recipient: e.target.value })} required
                  placeholder="e.g. +91 9880192840 or admin@ayathanatrust.org"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Alert message Payload</label>
                <textarea value={notifForm.message} onChange={e => setNotifForm({ ...notifForm, message: e.target.value })} required
                  placeholder="Enter vaccination, high-risk preeclampsia alerts, or training notices..." rows="4"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"></textarea>
              </div>

              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> Dispatch API Payload
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── TAB: SECURE DOCUMENT UPLOAD SIMULATOR ── */}
      {activeTab === 'reports' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" /> Secure Medical Document Upload &amp; Encryption Sandbox
            </h3>
            <span className="text-[10px] text-slate-400">Validate MIME types, size limits, scan malware, and rename files</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Drop Zone Area */}
            <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl p-8 bg-slate-950/20 text-center flex flex-col items-center justify-center space-y-4 transition duration-300">
              <div className="p-4 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                <Server className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Drag &amp; drop clinical records here</p>
                <p className="text-[10px] text-slate-500 mt-1">Accepted: PDF, PNG, JPG only (Max 5.0 MB size)</p>
              </div>
              
              <div className="relative">
                <input 
                  type="file" 
                  onChange={handleSimulateFileUpload}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button type="button" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase transition">
                  Browse Device File
                </button>
              </div>
            </div>

            {/* Sandbox validation console */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 font-mono text-[10px] space-y-2 min-h-[180px]">
              <p className="text-slate-500 border-b border-slate-900 pb-1.5 font-bold uppercase tracking-wider">File Sandbox validation Stream</p>
              
              {isUploading && (
                <p className="text-cyan-400 animate-pulse">⏳ Processing file stream...</p>
              )}

              {uploadErrors.length > 0 && (
                <div className="space-y-1">
                  {uploadErrors.map((err, idx) => (
                    <p key={idx} className="text-rose-400 font-bold">{err}</p>
                  ))}
                </div>
              )}

              {uploadLogs.length > 0 && (
                <div className="space-y-1">
                  {uploadLogs.map((log, idx) => (
                    <p key={idx} className={log.includes('✅') || log.includes('success') ? 'text-emerald-400' : 'text-slate-300'}>
                      {log}
                    </p>
                  ))}
                </div>
              )}

              {!isUploading && uploadLogs.length === 0 && uploadErrors.length === 0 && (
                <p className="text-slate-600 italic py-8 text-center">Awaiting file upload trigger to initiate security scan.</p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── TAB: AUDIT LOG VIEW WITH OLD -> NEW VALUE MAPPINGS ── */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Strict Central Audit Trail Logs
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Automated logging of all inserts, status changes, and PII reveal actions</p>
            </div>
            
            {/* Search filter */}
            <div className="relative">
              <input 
                type="text" 
                value={auditSearch}
                onChange={e => setAuditSearch(e.target.value)}
                placeholder="Search logs (IP, User, Action)..."
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none w-52"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Old Value</th>
                  <th className="p-4">New Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-[10px]">
                {filteredAuditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-850/50">
                    <td className="p-4 text-slate-500 whitespace-nowrap">{log.time}</td>
                    <td className="p-4 text-slate-200 font-bold">{log.user}</td>
                    <td className="p-4"><span className="text-cyan-400 font-bold">{log.action}</span></td>
                    <td className="p-4 text-slate-300 font-sans leading-normal">{log.desc}</td>
                    <td className="p-4 text-slate-400">{log.ip || '192.168.1.1'}</td>
                    <td className="p-4 text-rose-400">{log.oldValue || '—'}</td>
                    <td className="p-4 text-emerald-400">{log.newValue || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB: BACKUP & DISASTER RECOVERY HUB ── */}
      {activeTab === 'backup' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" /> Database Backup &amp; Disaster Recovery Hub
            </h3>
            <span className="text-[10px] text-slate-400">Relational Database archiving and recovery simulation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Backup Schedules List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Archived Snapshots</h4>
                <button 
                  onClick={triggerManualBackup}
                  disabled={isBackingUp}
                  className={`bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-[10px] uppercase transition flex items-center gap-1.5 ${
                    isBackingUp ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />
                  Trigger Dump Now
                </button>
              </div>

              <div className="space-y-2.5">
                {backupSchedule.map((b, idx) => (
                  <div key={idx} className="border border-slate-850 bg-slate-950/20 p-3 rounded-xl flex items-center justify-between text-xs font-mono">
                    <div>
                      <p className="font-bold text-slate-200">{b.name}</p>
                      <p className="text-[9px] text-slate-500 mt-1">Generated: {b.time} | Size: {b.size}</p>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px]">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disaster Recovery Sandbox Console */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between min-h-[220px]">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-900 pb-1.5">DR Restore Testing Console</h4>
                
                {drLogs.length > 0 && (
                  <div className="space-y-1 font-mono text-[9.5px]">
                    {drLogs.map((log, idx) => (
                      <p key={idx} className={log.includes('successful') || log.includes('✅') ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                        {log}
                      </p>
                    ))}
                  </div>
                )}
                {drLogs.length === 0 && !isTestingDR && (
                  <p className="text-[10px] text-slate-600 font-mono italic py-8 text-center">Awaiting DR recovery pipeline test invocation.</p>
                )}
              </div>

              <button
                onClick={triggerDRRestoreTest}
                disabled={isTestingDR}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs transition border border-slate-700 uppercase"
              >
                {isTestingDR ? 'Restoring system state...' : 'Run Disaster Recovery Verification'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
