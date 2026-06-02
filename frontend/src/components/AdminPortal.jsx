import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/apiClient.js';
import {
  MapPin, ClipboardList, CheckSquare, AlertTriangle, Heart, Bell, FileText, Activity, Database, BarChart2, Shield
} from 'lucide-react';

// Decoupled Sub-Components
import AnalyticsDashboard from './admin/AnalyticsDashboard';
import VillageMapping from './admin/VillageMapping';
import AccessControl from './admin/AccessControl';
import AdminRiskAlerts from './admin/AdminRiskAlerts';
import SocialSupport from './admin/SocialSupport';
import NotificationConsole from './admin/NotificationConsole';
import SecurityUploads from './admin/SecurityUploads';
import AuditLogs from './admin/AuditLogs';
import BackupRecovery from './admin/BackupRecovery';

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
  const { subTab } = useParams();
  const navigate = useNavigate();
  const activeTab = subTab || 'dashboard';
  const setActiveTab = (newTab) => {
    navigate(`/admin/${newTab}`);
  };

  const [showAddVillageModal, setShowAddVillageModal] = useState(false);
  const [newVillageData, setNewVillageData] = useState({ name: '', block: 'Chikkamagaluru', district: 'Chikkamagaluru', population: '', waterStatus: 'Adequate', sanitationStatus: 'Good' });
  const [newUserRole, setNewUserRole] = useState({ name: '', role: 'Village Health Worker', contact: '' });
  const [alertFilter, setAlertFilter] = useState('all');
  
  // Notification States
  const [notifForm, setNotifForm] = useState({ type: 'SMS', recipient: '', title: '', message: '' });
  
  // Vault Upload simulation states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadLogs, setUploadLogs] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);

  // Database snapshot backup simulation states
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [drLogs, setDrLogs] = useState([]);

  // ── DERIVED METRICS (useMemo) ──
  const stats = useMemo(() => {
    const totalFamilies = state.families.length;
    const totalIndividuals = state.individuals.length;
    const activeAlerts = state.alerts.filter(a => !a.resolved).length;
    const malnutritionCount = state.individuals.filter(i => i.malnutritionStatus === 'moderate' || i.malnutritionStatus === 'severe').length;
    const activeVhwCount = state.staff.filter(s => s.role === 'Village Health Worker' && s.status === 'Active').length;
    const totalPrograms = state.programs.length;
    
    return {
      totalFamilies,
      totalIndividuals,
      activeAlerts,
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

  const vs = useMemo(() => {
    const cats = state.villages.map(v => v.name.length > 10 ? v.name.slice(0, 10) + '…' : v.name);
    const fam = state.villages.map(v => state.families.filter(f => (f.village?.name === v.name || f.villageName === v.name)).length);
    const ind = state.villages.map(v => state.individuals.filter(i => {
      const f = state.families.find(f => f.id === i.familyId);
      return f && (f.village?.name === v.name || f.villageName === v.name);
    }).length);
    return { cats, fam, ind };
  }, [state.villages, state.families, state.individuals]);

  const mv = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return { months, data: [8, 14, 11, 18, 22, state.visits.length + 10] };
  }, [state.visits.length]);

  const chartBase = useMemo(() => ({ toolbar: { show: false }, background: 'transparent', fontFamily: 'Inter, sans-serif' }), []);
  const axisStyle = useMemo(() => ({ colors: '#64748b', fontSize: '11px' }), []);

  const diseaseOpts = useMemo(() => ({
    chart: { ...chartBase, type: 'bar' },
    plotOptions: { bar: { borderRadius: 5, distributed: true, columnWidth: '50%' } },
    colors: ['#3b82f6', '#f43f5e', '#f59e0b', '#a855f7', '#06b6d4'],
    dataLabels: { enabled: true, style: { colors: ['#fff'], fontSize: '10px', fontWeight: 700 } },
    xaxis: { categories: ['Diabetes', 'Hypertension', 'TB', 'Cancer', 'Asthma'], labels: { style: axisStyle } },
    yaxis: { labels: { style: axisStyle } },
    grid: { borderColor: '#1e293b' }, theme: { mode: 'dark' }, legend: { show: false },
    tooltip: { theme: 'dark' }
  }), [chartBase, axisStyle]);

  const maternalOpts = useMemo(() => ({
    chart: { ...chartBase, type: 'donut' },
    labels: ['Normal Pregnancy', 'High-Risk Pregnancy'],
    colors: ['#10b981', '#ef4444'],
    plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, label: 'Pregnant', color: '#94a3b8', fontSize: '11px' } } } } },
    dataLabels: { enabled: false },
    legend: { position: 'bottom', labels: { colors: '#94a3b8' } },
    theme: { mode: 'dark' }, tooltip: { theme: 'dark' }
  }), [chartBase]);

  const villageOpts = useMemo(() => ({
    chart: { ...chartBase, type: 'bar' },
    colors: ['#6366f1', '#10b981'],
    plotOptions: { bar: { columnWidth: '60%', borderRadius: 4, grouped: true } },
    dataLabels: { enabled: false },
    xaxis: { categories: vs.cats.length ? vs.cats : ['V1', 'V2', 'V3'], labels: { style: axisStyle } },
    yaxis: { labels: { style: axisStyle } },
    grid: { borderColor: '#1e293b' }, legend: { labels: { colors: '#94a3b8' } },
    theme: { mode: 'dark' }, tooltip: { theme: 'dark' }
  }), [chartBase, axisStyle, vs.cats]);

  const visitTrendOpts = useMemo(() => ({
    chart: { ...chartBase, type: 'area' },
    colors: ['#6366f1'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
    stroke: { curve: 'smooth', width: 2 },
    dataLabels: { enabled: false },
    xaxis: { categories: mv.months, labels: { style: axisStyle } },
    yaxis: { labels: { style: axisStyle } },
    grid: { borderColor: '#1e293b' }, theme: { mode: 'dark' }, tooltip: { theme: 'dark' }
  }), [chartBase, axisStyle, mv.months]);

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
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserRole.name || !newUserRole.contact) return;
    const user = {
      id: 'STF-' + Math.floor(100 + Math.random() * 900),
      status: 'Active',
      ...newUserRole
    };
    setState(p => ({
      ...p,
      staff: [...p.staff, user],
      auditLogs: [
        { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: 'Central Admin', action: 'DEPLOY_CREDENTIALS', desc: `Deployed credentials for ${user.name} (${user.role})`, ip: '192.168.1.1', time: new Date().toLocaleString(), oldValue: 'None', newValue: user.name },
        ...p.auditLogs
      ]
    }));
    setNewUserRole({ name: '', role: 'Village Health Worker', contact: '' });
  };

  const handleToggleUserStatus = (id) => {
    setState(p => {
      let targetUser = p.staff.find(s => s.id === id);
      if (!targetUser) return p;
      let nextStatus = targetUser.status === 'Active' ? 'Disabled' : 'Active';
      return {
        ...p,
        staff: p.staff.map(s => s.id === id ? { ...s, status: nextStatus } : s),
        auditLogs: [
          { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: 'Central Admin', action: 'TOGGLE_ACCESS_CONTROL', desc: `Changed access status of staff ${targetUser.name} to ${nextStatus}`, ip: '192.168.1.1', time: new Date().toLocaleString(), oldValue: targetUser.status, newValue: nextStatus },
          ...p.auditLogs
        ]
      };
    });
  };

  const handleAcknowledgeAlert = (id) => {
    setState(p => {
      const alert = p.alerts.find(a => a.id === id);
      const patient = alert ? alert.patientName : 'Unknown patient';
      return {
        ...p,
        alerts: p.alerts.map(a => a.id === id ? { ...a, resolved: true } : a),
        auditLogs: [
          { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: 'Central Admin', action: 'RESOLVE_RISK_ALERT', desc: `Central Central Admin acknowledged risk alert for ${patient}`, ip: '192.168.1.1', time: new Date().toLocaleString(), oldValue: 'Active', newValue: 'Resolved' },
          ...p.auditLogs
        ]
      };
    });
  };

  const handleSubmitNotif = (e) => {
    e.preventDefault();
    if (!notifForm.recipient || !notifForm.message) return;
    
    const log = {
      id: 'NTF-' + Math.floor(1000 + Math.random() * 9000),
      time: new Date().toLocaleString(),
      ...notifForm
    };

    setState(p => ({
      ...p,
      notifications: [log, ...p.notifications],
      auditLogs: [
        { id: 'AUD-' + Math.floor(1000 + Math.random() * 9000), user: 'Central Admin', action: 'SEND_SYSTEM_BROADCAST', desc: `Broadcasted notification via ${log.type} to ${log.recipient}`, ip: '192.168.1.1', time: new Date().toLocaleString(), oldValue: 'None', newValue: log.title },
        ...p.auditLogs
      ]
    }));
    setNotifForm({ type: 'SMS', recipient: '', title: '', message: '' });
  };

  const handleDocUploadSimulate = async () => {
    setIsUploading(true);
    setUploadLogs(["Initiating secure scanner stream...", "Validating JWT signatures..."]);
    setUploadErrors([]);

    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    await delay(600);

    setUploadLogs(prev => [...prev, "Decrypting scanner PDF bundle...", "OCR scan executing..."]);
    await delay(500);

    const failType = Math.floor(Math.random() * 4);
    if (failType === 0) {
      setUploadErrors(["❌ Scan compliance error: Consent document signature not matched (biometric exception JR-VLG-0192).", "❌ Decryption error: GPG packet corrupt (packet 82)."]);
      setUploadLogs(prev => [...prev, "❌ Scan stream completed with compliance violations!"]);
    } else {
      setUploadLogs(prev => [...prev, "✅ OCR signatures verified.", "🎉 Document verified and archived securely in AES vault!"]);
    }
    setIsUploading(false);
  };

  const handleBackupSimulate = async () => {
    setIsBackingUp(true);
    setDrLogs(["Connecting to Central MySQL cluster...", "Establishing transaction locks..."]);

    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    await delay(600);

    setDrLogs(prev => [...prev, "Archiving SQL schemas...", "Compressing GZip blocks..."]);
    await delay(500);

    setDrLogs(prev => [...prev, "✅ Snapshot successfully compiled.", "🎉 Snapshot backup uploaded securely to central AWS S3 vault!"]);
    setIsBackingUp(false);
  };

  const filteredAlerts = alertFilter === 'all' ? state.alerts
    : alertFilter === 'critical' ? state.alerts.filter(a => a.severity === 'critical')
    : alertFilter === 'unresolved' ? state.alerts.filter(a => !a.resolved)
    : state.alerts.filter(a => a.resolved);

  const filteredAuditLogs = state.auditLogs || [];
  const supportRecords = state.supportRecords || [];
  const backupSchedule = state.backupSchedule || [
    { type: 'Full DB Schema Backup', interval: 'Every 24 Hours', target: 'Ayathana AWS Core S3 Bucket', status: 'Active' },
    { type: 'Security Audit Log Stream', interval: 'Real-time Streaming', target: 'Central Auditor Elastic Node', status: 'Streaming' }
  ];
  const drLogsList = state.drLogs || [];
  const notifLogs = state.notifications || [];

  return (
    <div className="space-y-6">
      
      {/* Central Admin Control Header */}
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
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20 backdrop-blur-sm">
            Central System Auditor
          </span>
          <h2 className="text-2xl font-black text-white mt-2 drop-shadow-md">Central Admin Control Panel</h2>
          <p className="text-xs text-slate-300 mt-1 drop-shadow">Manage rural scopes · Deploy authorization credentials · Enforce compliance metrics</p>
        </div>
        
        <div className="flex gap-2 text-xs relative z-10">
          <button 
            onClick={() => setEnv(env === 'Production' ? 'Staging' : 'Production')}
            className={`px-3 py-1.5 rounded-lg border font-bold transition ${
              env === 'Production' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            ENV: {env.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-slate-800 gap-1">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}>
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Modular Tab Content */}
      <div className="relative z-10 mt-4">
        {activeTab === 'dashboard' && (
          <AnalyticsDashboard 
            stats={stats}
            diseaseOpts={diseaseOpts}
            getDiseaseCounts={getDiseaseCounts}
            maternalOpts={maternalOpts}
            getMaternalRatio={getMaternalRatio}
            villageOpts={villageOpts}
            vs={vs}
            visitTrendOpts={visitTrendOpts}
            mv={mv}
          />
        )}

        {activeTab === 'villages' && (
          <VillageMapping 
            state={state}
            setShowAddVillageModal={setShowAddVillageModal}
            showAddVillageModal={showAddVillageModal}
            newVillageData={newVillageData}
            setNewVillageData={setNewVillageData}
            handleCreateVillage={handleCreateVillage}
          />
        )}

        {activeTab === 'users' && (
          <AccessControl 
            state={state}
            newUserRole={newUserRole}
            setNewUserRole={setNewUserRole}
            handleCreateUser={handleCreateUser}
            handleToggleUserStatus={handleToggleUserStatus}
          />
        )}

        {activeTab === 'alerts' && (
          <AdminRiskAlerts 
            alertFilter={alertFilter}
            setAlertFilter={setAlertFilter}
            filteredAlerts={filteredAlerts}
            handleAcknowledgeAlert={handleAcknowledgeAlert}
          />
        )}

        {activeTab === 'support' && (
          <SocialSupport 
            supportRecords={supportRecords}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationConsole 
            notifForm={notifForm}
            setNotifForm={setNotifForm}
            notifLogs={notifLogs}
            handleSubmitNotif={handleSubmitNotif}
          />
        )}

        {activeTab === 'reports' && (
          <SecurityUploads 
            isUploading={isUploading}
            uploadLogs={uploadLogs}
            uploadErrors={uploadErrors}
            handleDocUploadSimulate={handleDocUploadSimulate}
            setUploadErrors={setUploadErrors}
          />
        )}

        {activeTab === 'audit' && (
          <AuditLogs 
            filteredAuditLogs={filteredAuditLogs}
          />
        )}

        {activeTab === 'backup' && (
          <BackupRecovery 
            backupSchedule={backupSchedule}
            drLogs={drLogs.length ? drLogs : drLogsList}
            isBackingUp={isBackingUp}
            handleBackupSimulate={handleBackupSimulate}
          />
        )}
      </div>

    </div>
  );
}
