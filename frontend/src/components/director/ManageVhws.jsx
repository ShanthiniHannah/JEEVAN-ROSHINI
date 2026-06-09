import React, { useState, useEffect } from 'react';
import { Shield, Plus, Key, CheckCircle, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { api } from '../../services/apiClient';

export default function ManageVhws({ state, currentUser }) {
  const [loading, setLoading] = useState(false);
  const [vhws, setVhws] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [vhwForm, setVhwForm] = useState({ name: '', email: '', mobile: '', assigned_villages: [] });

  // Modal / Temp Password display
  const [tempPasswordData, setTempPasswordData] = useState(null);

  // Fetch VHWs for director's district
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/director/vhws');
      setVhws(res.data || []);
    } catch (err) {
      console.error('[ManageVhws] Failed to load VHW roster:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter villages by selected director's district
  const districtId = currentUser?.district_id;
  const filteredVillages = state.villages?.filter(v => 
    v.block?.district_id === districtId || v.block?.district?.id === districtId
  ) || [];

  const handleCreateVhwSubmit = async (e) => {
    e.preventDefault();
    if (!vhwForm.name || !vhwForm.email || !vhwForm.mobile) return;
    setSubmitting(true);
    try {
      const res = await api.post('/director/vhws', {
        name: vhwForm.name,
        email: vhwForm.email,
        mobile: vhwForm.mobile,
        assigned_villages: vhwForm.assigned_villages
      });
      if (res.data && res.data.success) {
        setTempPasswordData({
          user: res.data.data,
          password: res.data.temp_password
        });
        setVhwForm({ name: '', email: '', mobile: '', assigned_villages: [] });
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create Village Health Worker');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleVillageAssignment = (villageName) => {
    setVhwForm(prev => {
      const current = prev.assigned_villages || [];
      const updated = current.includes(villageName)
        ? current.filter(v => v !== villageName)
        : [...current, villageName];
      return { ...prev, assigned_villages: updated };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl shadow-sm flex items-center justify-between">
        <div>
          <h4 className="text-sm font-black text-[var(--text-primary)]">District Personnel Management</h4>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Add and manage Village Health Workers (VHWs) assigned to your district: <span className="font-bold text-blue-500">{currentUser?.district?.name || 'Assigned District'}</span>
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl">
          <Loader2 className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-[#0057B8]" />
          <span className="ml-3 text-xs font-bold text-[var(--text-secondary)]">Loading VHW roster...</span>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Main List Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                <Shield className="w-4 h-4 text-emerald-500" />
                Active District VHWs ({vhws.length})
              </h3>

              <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-inner)] border-b border-[var(--border-color)] text-[var(--text-secondary)] font-extrabold uppercase text-[9px] tracking-wider">
                      <th className="p-3">Employee ID</th>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">Mobile &amp; Email</th>
                      <th className="p-3">Assigned Villages</th>
                      <th className="p-3">Status</th>
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
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                              {vhw.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {vhws.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-[var(--text-secondary)]">No Village Health Workers registered in your district.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Creation Form */}
          <div className="space-y-4">
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

                {/* Village Selector */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">
                    Village Assignments (Click to toggle)
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-[var(--border-color)] rounded-xl p-2.5 bg-[var(--bg-inner)] space-y-1.5">
                    {filteredVillages.map(v => {
                      const isAssigned = (vhwForm.assigned_villages || []).includes(v.name);
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
                    {filteredVillages.length === 0 && (
                      <div className="text-center py-4 text-[var(--text-secondary)] text-[10px]">
                        No villages mapped to your district yet.
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Key className="w-4 h-4" /> Create VHW</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS CREATION MODAL WITH TEMP PASSWORD */}
      {tempPasswordData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-emerald-500 font-black text-sm">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>Credentials Created &amp; Deployed</span>
            </div>
            
            <p className="text-xs text-[var(--text-secondary)]">
              An account for <span className="font-black text-[var(--text-primary)]">{tempPasswordData.user?.name}</span> ({tempPasswordData.user?.employee_id || 'Employee'}) has been set up securely.
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
              Acknowledge &amp; Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
