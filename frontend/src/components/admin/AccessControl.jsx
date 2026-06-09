import React, { useState, useEffect } from 'react';
import { Shield, Plus, Key, Users, MapPin, CheckCircle, XCircle, RefreshCw, AlertTriangle, Check } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { api } from '../../services/apiClient';
import {
  getUsers,
  createProjectDirector,
  createVhw,
  toggleUserStatus,
  resetUserPassword,
  assignArea,
  getRoles
} from '../../services/userService';

const SUB_TABS = [
  { id: 'directors', label: 'Project Directors', icon: Users },
  { id: 'vhws',      label: 'Village Health Workers', icon: Shield },
  { id: 'roles',     label: 'Roles & Permissions', icon: Key },
];

export default function AccessControl({ state, setState }) {
  const [subTab, setSubTab] = useState('directors');
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  
  // Users list
  const [directors, setDirectors] = useState([]);
  const [vhws, setVhws] = useState([]);
  const [roles, setRoles] = useState([]);

  // Form states — state_id drives district filter
  const [directorForm, setDirectorForm] = useState({ name: '', email: '', mobile: '', state_id: '', district_id: '' });
  const [vhwForm, setVhwForm] = useState({ name: '', email: '', mobile: '', state_id: '', district_id: '', assigned_villages: [] });

  // Assign-area modal state for state filter
  const [assignAreaStateId, setAssignAreaStateId] = useState('');

  // Modal / Temp Password display
  const [tempPasswordData, setTempPasswordData] = useState(null);
  
  // Assign Area Modal state
  const [assigningUser, setAssigningUser] = useState(null);
  const [assignAreaForm, setAssignAreaForm] = useState({ district_id: '', assigned_villages: [] });

  // Fetch all resources
  const loadData = async () => {
    setLoading(true);
    try {
      const [stateRes, distRes, vilRes, dirRes, vhwRes, roleRes] = await Promise.all([
        api.get('/admin/states'),
        api.get('/admin/districts'),
        api.get('/admin/villages'),
        getUsers({ role: 'project-director' }),
        getUsers({ role: 'vhw' }),
        getRoles()
      ]);

      setStates(stateRes.data || []);
      setDistricts(distRes.data || []);
      setVillages(vilRes.data || []);
      setDirectors(dirRes.data.data || dirRes.data || []);
      setVhws(vhwRes.data.data || vhwRes.data || []);
      setRoles(roleRes.data || []);
    } catch (err) {
      console.error('[AccessControl] Failed to load user management resources:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper: filter districts by state — triple-safe comparison
  // Laravel may return state_id as number, string, or nested under state.id
  const districtsByState = (stateId) => {
    if (!stateId) return [];
    const sid = String(stateId);
    return districts.filter(d => {
      if (d.state_id  && String(d.state_id)  === sid) return true;
      if (d.state?.id && String(d.state.id)  === sid) return true;
      return false;
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDirector = async (e) => {
    e.preventDefault();
    if (!directorForm.name || !directorForm.email || !directorForm.mobile || !directorForm.state_id || !directorForm.district_id) return;
    try {
      const res = await createProjectDirector(directorForm);
      if (res.data && res.data.success) {
        setTempPasswordData({
          user: res.data.data,
          password: res.data.temp_password
        });
        setDirectorForm({ name: '', email: '', mobile: '', state_id: '', district_id: '' });
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create Project Director');
    }
  };

  const handleCreateVhwSubmit = async (e) => {
    e.preventDefault();
    if (!vhwForm.name || !vhwForm.email || !vhwForm.mobile || !vhwForm.state_id || !vhwForm.district_id) return;
    try {
      const res = await createVhw(vhwForm);
      if (res.data && res.data.success) {
        setTempPasswordData({
          user: res.data.data,
          password: res.data.temp_password
        });
        setVhwForm({ name: '', email: '', mobile: '', state_id: '', district_id: '', assigned_villages: [] });
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create Village Health Worker');
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const res = await toggleUserStatus(user.id);
      if (res.data && res.data.success) {
        loadData();
      }
    } catch (err) {
      alert('Failed to change user status');
    }
  };

  const handleResetPassword = async (user) => {
    if (!window.confirm(`Are you sure you want to reset password for ${user.name}?`)) return;
    try {
      const res = await resetUserPassword(user.id);
      if (res.data && res.data.success) {
        setTempPasswordData({
          user: user,
          password: res.data.temp_password,
          isReset: true
        });
      }
    } catch (err) {
      alert('Failed to reset password');
    }
  };

  const handleOpenAssignArea = (user) => {
    setAssigningUser(user);
    // Pre-fill state from existing district assignment
    const existingDistrict = districts.find(d => d.id === user.district_id);
    setAssignAreaStateId(existingDistrict?.state_id?.toString() || existingDistrict?.state?.id?.toString() || '');
    setAssignAreaForm({
      district_id: user.district_id || '',
      assigned_villages: user.staff_profile?.assigned_villages || []
    });
  };

  const handleAssignAreaSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await assignArea(assigningUser.id, assignAreaForm);
      if (res.data && res.data.success) {
        setAssigningUser(null);
        loadData();
      }
    } catch (err) {
      alert('Failed to assign area');
    }
  };

  const toggleVillageAssignment = (villageName) => {
    setAssignAreaForm(prev => {
      const current = prev.assigned_villages || [];
      const updated = current.includes(villageName)
        ? current.filter(v => v !== villageName)
        : [...current, villageName];
      return { ...prev, assigned_villages: updated };
    });
  };

  // Filter villages by selected district for the VHW forms
  const getFilteredVillages = (districtId) => {
    if (!districtId) return [];
    return villages.filter(v => v.block?.district_id === parseInt(districtId) || v.district_id === parseInt(districtId));
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab selection */}
      <div className="flex gap-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1 shadow-sm">
        {SUB_TABS.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                subTab === t.id
                  ? 'bg-[#0057B8] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-inner)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-[#0057B8]" />
          <span className="ml-3 text-xs font-bold text-[var(--text-secondary)]">Loading personnel roster...</span>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Main List Section */}
          <div className="lg:col-span-2 space-y-4">
            
            {subTab === 'directors' && (
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Active Project Directors ({directors.length})
                </h3>

                <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--bg-inner)] border-b border-[var(--border-color)] text-[var(--text-secondary)] font-extrabold uppercase text-[9px] tracking-wider">
                        <th className="p-3">Employee ID</th>
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Mobile &amp; Email</th>
                        <th className="p-3">Assigned District</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {directors.map(dir => (
                        <tr key={dir.id} className="hover:bg-[var(--bg-inner)] transition">
                          <td className="p-3 font-mono text-[10px] text-[var(--text-secondary)] font-bold">{dir.employee_id || 'TBD'}</td>
                          <td className="p-3 font-black text-[var(--text-primary)]">{dir.name}</td>
                          <td className="p-3 text-[var(--text-secondary)] font-medium">
                            <div>{dir.mobile}</div>
                            <div className="text-[10px] opacity-70">{dir.email}</div>
                          </td>
                          <td className="p-3 font-semibold text-[var(--text-primary)]">
                            {dir.district?.name || <span className="text-rose-500 font-bold">Unassigned</span>}
                          </td>
                          <td className="p-3">
                            <StatusBadge status={dir.status === 'Active' ? 'Active' : 'Disabled'} />
                          </td>
                          <td className="p-3 text-right space-x-3">
                            <button
                              onClick={() => handleOpenAssignArea(dir)}
                              className="text-[10px] font-black text-[#0057B8] uppercase tracking-wider hover:underline"
                            >
                              Assign Area
                            </button>
                            <button
                              onClick={() => handleResetPassword(dir)}
                              className="text-[10px] font-black text-amber-500 uppercase tracking-wider hover:underline"
                            >
                              Reset PW
                            </button>
                            <button
                              onClick={() => handleToggleStatus(dir)}
                              className={`text-[10px] font-black uppercase tracking-wider ${
                                dir.status === 'Active' ? 'text-rose-500 hover:text-rose-600' : 'text-emerald-500 hover:text-emerald-600'
                              }`}
                            >
                              {dir.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {directors.length === 0 && (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-[var(--text-secondary)]">No Project Directors registered yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {subTab === 'vhws' && (
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Village Health Workers ({vhws.length})
                </h3>

                <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--bg-inner)] border-b border-[var(--border-color)] text-[var(--text-secondary)] font-extrabold uppercase text-[9px] tracking-wider">
                        <th className="p-3">Employee ID</th>
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Mobile &amp; Email</th>
                        <th className="p-3">District</th>
                        <th className="p-3">Assigned Villages</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {vhws.map(vhw => {
                        const assignedVils = vhw.staff_profile?.assigned_villages || [];
                        return (
                          <tr key={vhw.id} className="hover:bg-[var(--bg-inner)] transition">
                            <td className="p-3 font-mono text-[10px] text-[var(--text-secondary)] font-bold">{vhw.employee_id || 'TBD'}</td>
                            <td className="p-3 font-black text-[var(--text-primary)]">{vhw.name}</td>
                            <td className="p-3 text-[var(--text-secondary)] font-medium">
                              <div>{vhw.mobile}</div>
                              <div className="text-[10px] opacity-70">{vhw.email}</div>
                            </td>
                            <td className="p-3 font-semibold text-[var(--text-primary)]">
                              {vhw.district?.name || <span className="text-rose-500 font-bold">Unassigned</span>}
                            </td>
                            <td className="p-3 text-[10px]">
                              {assignedVils.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {assignedVils.map((v, i) => (
                                    <span key={i} className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                      {v}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-rose-500 font-bold">None</span>
                              )}
                            </td>
                            <td className="p-3">
                              <StatusBadge status={vhw.status === 'Active' ? 'Active' : 'Disabled'} />
                            </td>
                            <td className="p-3 text-right space-x-3">
                              <button
                                onClick={() => handleOpenAssignArea(vhw)}
                                className="text-[10px] font-black text-[#0057B8] uppercase tracking-wider hover:underline"
                              >
                                Assign Area
                              </button>
                              <button
                                onClick={() => handleResetPassword(vhw)}
                                className="text-[10px] font-black text-amber-500 uppercase tracking-wider hover:underline"
                              >
                                Reset PW
                              </button>
                              <button
                                onClick={() => handleToggleStatus(vhw)}
                                className={`text-[10px] font-black uppercase tracking-wider ${
                                  vhw.status === 'Active' ? 'text-rose-500 hover:text-rose-600' : 'text-emerald-500 hover:text-emerald-600'
                                }`}
                              >
                                {vhw.status === 'Active' ? 'Suspend' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {vhws.length === 0 && (
                        <tr>
                          <td colSpan="7" className="p-8 text-center text-[var(--text-secondary)]">No Village Health Workers registered yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {subTab === 'roles' && (
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                  <Key className="w-4 h-4 text-amber-500" />
                  System Roles &amp; Permissions Grid ({roles.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map(role => (
                    <div key={role.id} className="bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wider">{role.name}</span>
                        <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                          {role.users_count} Users
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {role.permissions.map((p, idx) => (
                          <span key={idx} className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] px-2 py-0.5 rounded text-[10px] font-medium">
                            {p}
                          </span>
                        ))}
                        {role.permissions.length === 0 && (
                          <span className="text-[10px] text-rose-500 font-bold">No custom permissions explicitly seeded</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Creation Forms */}
          <div className="space-y-4">
            
            {subTab === 'directors' && (
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-xs font-black text-[var(--text-primary)] pb-2 border-b border-[var(--border-color)] flex items-center gap-1.5 uppercase tracking-wider">
                  <Plus className="w-4 h-4 text-indigo-500" />
                  Onboard Director
                </h3>
                <form onSubmit={handleCreateDirector} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={directorForm.name}
                      onChange={(e) => setDirectorForm({ ...directorForm, name: e.target.value })}
                      placeholder="e.g. Dr. Ramesh Kumar"
                      required
                      className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[#0057B8] placeholder:text-[var(--text-secondary)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={directorForm.email}
                      onChange={(e) => setDirectorForm({ ...directorForm, email: e.target.value })}
                      placeholder="e.g. ramesh@ayathana.org"
                      required
                      className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[#0057B8] placeholder:text-[var(--text-secondary)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Mobile Number</label>
                    <input
                      type="text"
                      value={directorForm.mobile}
                      onChange={(e) => setDirectorForm({ ...directorForm, mobile: e.target.value })}
                      placeholder="e.g. 9876543210"
                      required
                      className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[#0057B8] placeholder:text-[var(--text-secondary)]"
                    />
                  </div>
                  {/* State selector — must select state first */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">State</label>
                    <select
                      value={directorForm.state_id}
                      onChange={(e) => setDirectorForm({ ...directorForm, state_id: e.target.value, district_id: '' })}
                      required
                      className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[#0057B8]"
                    >
                      <option value="">Select State</option>
                      {states.map(s => {
                        const distCount = districtsByState(String(s.id)).length;
                        return (
                          <option key={s.id} value={s.id}>
                            {s.name}{distCount > 0 ? ` (${distCount} district${distCount > 1 ? 's' : ''})` : ' — no districts yet'}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* District selector — enabled only after state is chosen */}
                  <div className="space-y-1.5">
                    <label className={`text-[9px] font-black uppercase tracking-wider ${
                      directorForm.state_id ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]/40'
                    }`}>Assigned District</label>
                    <select
                      value={directorForm.district_id}
                      onChange={(e) => setDirectorForm({ ...directorForm, district_id: e.target.value })}
                      required
                      disabled={!directorForm.state_id || districtsByState(directorForm.state_id).length === 0}
                      className={`w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[#0057B8] transition-opacity ${
                        (!directorForm.state_id || districtsByState(directorForm.state_id).length === 0) ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                    >
                      <option value="">
                        {!directorForm.state_id ? '— Select State first —' : districtsByState(directorForm.state_id).length === 0 ? '— No districts for this state —' : 'Select District'}
                      </option>
                      {districtsByState(directorForm.state_id).map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    {directorForm.state_id && districtsByState(directorForm.state_id).length === 0 && (
                      <p className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/25 rounded-lg px-2.5 py-2 leading-snug">
                        ⚠ No districts added for this state yet.<br />
                        <span className="opacity-75">Go to <strong>Governance → Districts</strong> tab to add districts first.</span>
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full h-11 bg-[#0057B8] hover:bg-blue-700 text-white font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
                  >
                    <Key className="w-4 h-4" /> Create Director
                  </button>
                </form>
              </div>
            )}

            {subTab === 'vhws' && (
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-xs font-black text-[var(--text-primary)] pb-2 border-b border-[var(--border-color)] flex items-center gap-1.5 uppercase tracking-wider">
                  <Plus className="w-4 h-4 text-emerald-500" />
                  Onboard VHW
                </h3>
                <form onSubmit={handleCreateVhwSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={vhwForm.name}
                      onChange={(e) => setVhwForm({ ...vhwForm, name: e.target.value })}
                      placeholder="e.g. Shobha Nayak"
                      required
                      className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 placeholder:text-[var(--text-secondary)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={vhwForm.email}
                      onChange={(e) => setVhwForm({ ...vhwForm, email: e.target.value })}
                      placeholder="e.g. shobha@ayathana.org"
                      required
                      className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 placeholder:text-[var(--text-secondary)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Mobile Number</label>
                    <input
                      type="text"
                      value={vhwForm.mobile}
                      onChange={(e) => setVhwForm({ ...vhwForm, mobile: e.target.value })}
                      placeholder="e.g. 9876543211"
                      required
                      className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 placeholder:text-[var(--text-secondary)]"
                    />
                  </div>
                  {/* State selector — must select state first */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">State</label>
                    <select
                      value={vhwForm.state_id}
                      onChange={(e) => setVhwForm({ ...vhwForm, state_id: e.target.value, district_id: '', assigned_villages: [] })}
                      required
                      className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select State</option>
                      {states.map(s => {
                        const distCount = districtsByState(String(s.id)).length;
                        return (
                          <option key={s.id} value={s.id}>
                            {s.name}{distCount > 0 ? ` (${distCount} district${distCount > 1 ? 's' : ''})` : ' — no districts yet'}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* District selector — enabled only after state is chosen */}
                  <div className="space-y-1.5">
                    <label className={`text-[9px] font-black uppercase tracking-wider ${
                      vhwForm.state_id ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]/40'
                    }`}>Assigned District</label>
                    <select
                      value={vhwForm.district_id}
                      onChange={(e) => setVhwForm({ ...vhwForm, district_id: e.target.value, assigned_villages: [] })}
                      required
                      disabled={!vhwForm.state_id || districtsByState(vhwForm.state_id).length === 0}
                      className={`w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 transition-opacity ${
                        (!vhwForm.state_id || districtsByState(vhwForm.state_id).length === 0) ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                    >
                      <option value="">
                        {!vhwForm.state_id ? '— Select State first —' : districtsByState(vhwForm.state_id).length === 0 ? '— No districts for this state —' : 'Select District'}
                      </option>
                      {districtsByState(vhwForm.state_id).map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    {vhwForm.state_id && districtsByState(vhwForm.state_id).length === 0 && (
                      <p className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/25 rounded-lg px-2.5 py-2 leading-snug">
                        ⚠ No districts added for this state yet.<br />
                        <span className="opacity-75">Go to <strong>Governance → Districts</strong> tab to add districts first.</span>
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
                  >
                    <Key className="w-4 h-4" /> Create VHW
                  </button>
                </form>
              </div>
            )}

            {subTab === 'roles' && (
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-sm text-xs space-y-2">
                <h4 className="font-black text-[var(--text-primary)]">Governance Credentials</h4>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Jeevan Roshini uses role-based access controls to safeguard patient ECHR and audit logs.
                </p>
                <div className="bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl p-3 text-[10px] space-y-1 text-[var(--text-secondary)] font-medium">
                  <div className="flex justify-between"><span className="font-bold">Super Admin:</span> Central Monitors &amp; Governance</div>
                  <div className="flex justify-between"><span className="font-bold">Director:</span> Staffing &amp; Training Operations</div>
                  <div className="flex justify-between"><span className="font-bold">VHW:</span> Community Registry &amp; Health Records</div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* SUCCESS CREATION MODAL WITH TEMP PASSWORD */}
      {tempPasswordData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-emerald-500 font-black text-sm">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{tempPasswordData.isReset ? 'Password Reset Successful' : 'Credentials Created & Deployed'}</span>
            </div>
            
            <p className="text-xs text-[var(--text-secondary)]">
              An account for <span className="font-black text-[var(--text-primary)]">{tempPasswordData.user?.name}</span> ({tempPasswordData.user?.employee_id || 'Employee'}) has been set up. Provide the credentials below securely to the staff member.
            </p>

            <div className="bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl p-4 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Username:</span>
                <span className="font-bold text-[var(--text-primary)]">{tempPasswordData.user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Temp Password:</span>
                <span className="font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded tracking-widest">{tempPasswordData.password}</span>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500/90 text-[10px] p-3 rounded-xl flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>This password is temporary. The user will be prompted to set a permanent password upon first log-in.</span>
            </div>

            <button
              onClick={() => setTempPasswordData(null)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow transition"
            >
              Acknowledge &amp; Copy
            </button>
          </div>
        </div>
      )}

      {/* ASSIGN AREA MODAL */}
      {assigningUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-fadeIn">
            <h3 className="text-sm font-black text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              Assign Field Area — {assigningUser.name}
            </h3>

            <form onSubmit={handleAssignAreaSubmit} className="space-y-4 text-xs">
              {/* State selector first */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">State</label>
                <select
                  value={assignAreaStateId}
                  onChange={(e) => {
                    setAssignAreaStateId(e.target.value);
                    setAssignAreaForm({ district_id: '', assigned_villages: [] });
                  }}
                  required
                  className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[#0057B8]"
                >
                  <option value="">Select State</option>
                  {states.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* District — cascades from state */}
              <div className="space-y-1.5">
                <label className={`text-[9px] font-black uppercase tracking-wider ${
                  assignAreaStateId ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]/40'
                }`}>Select District</label>
                <select
                  value={assignAreaForm.district_id}
                  onChange={(e) => setAssignAreaForm({ district_id: e.target.value, assigned_villages: [] })}
                  required
                  disabled={!assignAreaStateId}
                  className={`w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[#0057B8] transition-opacity ${
                    !assignAreaStateId ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">
                    {assignAreaStateId ? 'Select District' : '— Select State first —'}
                  </option>
                  {districtsByState(assignAreaStateId).map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Village selector for VHW role */}
              {assigningUser.roles?.some(r => r.name === 'vhw') && assignAreaForm.district_id && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">
                    Select Village Assignments (Click to toggle)
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-[var(--border-color)] rounded-xl p-2.5 bg-[var(--bg-inner)] space-y-1.5">
                    {getFilteredVillages(assignAreaForm.district_id).map(v => {
                      const isAssigned = (assignAreaForm.assigned_villages || []).includes(v.name);
                      return (
                        <button
                          type="button"
                          key={v.id}
                          onClick={() => toggleVillageAssignment(v.name)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition ${
                            isAssigned
                              ? 'bg-blue-500/10 border border-blue-500/30 text-blue-500 font-bold'
                              : 'border border-transparent hover:bg-[var(--bg-card)] text-[var(--text-secondary)]'
                          }`}
                        >
                          <span>{v.name}</span>
                          {isAssigned && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                    {getFilteredVillages(assignAreaForm.district_id).length === 0 && (
                      <div className="text-center py-4 text-[var(--text-secondary)] text-[10px]">
                        No villages mapped to this district yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningUser(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-inner)] font-black text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0057B8] hover:bg-blue-700 text-white font-black text-xs shadow transition"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
