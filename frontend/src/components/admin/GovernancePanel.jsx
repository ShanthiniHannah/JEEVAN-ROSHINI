import React, { useState, useEffect } from 'react';
import { Plus, Search, Globe, MapPin, Building2, FolderKanban } from 'lucide-react';
import { INDIAN_DISTRICTS } from '../../data/indianDistricts';
import { api } from '../../services/apiClient';

const SUB_TABS = [
  { id: 'states',    label: 'States',    icon: Globe },
  { id: 'districts', label: 'Districts', icon: MapPin },
  { id: 'villages',  label: 'Villages',  icon: Building2 },
  { id: 'projects',  label: 'Projects',  icon: FolderKanban },
];

// All 28 States + 8 UTs (client-side list — also in DB via seeder)
const INDIA_STATES = [
  { name: 'Andhra Pradesh', code: 'AP', region: 'South', type: 'State' },
  { name: 'Arunachal Pradesh', code: 'AR', region: 'Northeast', type: 'State' },
  { name: 'Assam', code: 'AS', region: 'Northeast', type: 'State' },
  { name: 'Bihar', code: 'BR', region: 'East', type: 'State' },
  { name: 'Chhattisgarh', code: 'CG', region: 'Central', type: 'State' },
  { name: 'Goa', code: 'GA', region: 'West', type: 'State' },
  { name: 'Gujarat', code: 'GJ', region: 'West', type: 'State' },
  { name: 'Haryana', code: 'HR', region: 'North', type: 'State' },
  { name: 'Himachal Pradesh', code: 'HP', region: 'North', type: 'State' },
  { name: 'Jharkhand', code: 'JH', region: 'East', type: 'State' },
  { name: 'Karnataka', code: 'KA', region: 'South', type: 'State' },
  { name: 'Kerala', code: 'KL', region: 'South', type: 'State' },
  { name: 'Madhya Pradesh', code: 'MP', region: 'Central', type: 'State' },
  { name: 'Maharashtra', code: 'MH', region: 'West', type: 'State' },
  { name: 'Manipur', code: 'MN', region: 'Northeast', type: 'State' },
  { name: 'Meghalaya', code: 'ML', region: 'Northeast', type: 'State' },
  { name: 'Mizoram', code: 'MZ', region: 'Northeast', type: 'State' },
  { name: 'Nagaland', code: 'NL', region: 'Northeast', type: 'State' },
  { name: 'Odisha', code: 'OD', region: 'East', type: 'State' },
  { name: 'Punjab', code: 'PB', region: 'North', type: 'State' },
  { name: 'Rajasthan', code: 'RJ', region: 'North', type: 'State' },
  { name: 'Sikkim', code: 'SK', region: 'Northeast', type: 'State' },
  { name: 'Tamil Nadu', code: 'TN', region: 'South', type: 'State' },
  { name: 'Telangana', code: 'TS', region: 'South', type: 'State' },
  { name: 'Tripura', code: 'TR', region: 'Northeast', type: 'State' },
  { name: 'Uttar Pradesh', code: 'UP', region: 'North', type: 'State' },
  { name: 'Uttarakhand', code: 'UK', region: 'North', type: 'State' },
  { name: 'West Bengal', code: 'WB', region: 'East', type: 'State' },
  // Union Territories
  { name: 'Andaman and Nicobar Islands', code: 'AN', region: 'UT', type: 'Union Territory' },
  { name: 'Chandigarh', code: 'CH', region: 'UT', type: 'Union Territory' },
  { name: 'Dadra and Nagar Haveli and Daman and Diu', code: 'DN', region: 'UT', type: 'Union Territory' },
  { name: 'Delhi', code: 'DL', region: 'UT', type: 'Union Territory' },
  { name: 'Jammu and Kashmir', code: 'JK', region: 'UT', type: 'Union Territory' },
  { name: 'Ladakh', code: 'LA', region: 'UT', type: 'Union Territory' },
  { name: 'Lakshadweep', code: 'LD', region: 'UT', type: 'Union Territory' },
  { name: 'Puducherry', code: 'PY', region: 'UT', type: 'Union Territory' },
];

const REGION_COLORS = {
  'North':     'bg-blue-100 text-blue-700',
  'South':     'bg-green-100 text-green-700',
  'East':      'bg-purple-100 text-purple-700',
  'West':      'bg-orange-100 text-orange-700',
  'Northeast': 'bg-teal-100 text-teal-700',
  'Central':   'bg-amber-100 text-amber-700',
  'UT':        'bg-rose-100 text-rose-700',
};

export default function GovernancePanel({ state, setState }) {
  const [subTab, setSubTab] = useState('states');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filterRegion, setFilterRegion] = useState('all');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // ── Own API-fetched data — never relies on broken global state ──
  const [dbStates, setDbStates]       = useState([]);   // from /admin/states
  const [dbDistricts, setDbDistricts] = useState([]);   // from /admin/districts
  const [dbVillages, setDbVillages]   = useState([]);   // from /admin/villages
  const [dbProjects, setDbProjects]   = useState([]);   // from /admin/projects

  // Form states — use IDs throughout
  const [newDistrict, setNewDistrict] = useState({ state_name: '', state_id: '', name: '' });
  const [newVillage, setNewVillage]   = useState({ state_name: '', district_id: '', name: '', population: '', water_status: 'Adequate', sanitation_status: 'Good' });
  const [newProject, setNewProject]   = useState({ name: '', state_name: '', state_id: '', district_id: '' });

  // ── Load all governance data from API directly ──────────────────
  const loadAll = async () => {
    try {
      const [stRes, distRes, vilRes, projRes] = await Promise.all([
        api.get('/admin/states'),
        api.get('/admin/districts'),
        api.get('/admin/villages'),
        api.get('/admin/projects'),
      ]);
      setDbStates(stRes.data   || []);
      setDbDistricts(distRes.data || []);
      setDbVillages(vilRes.data  || []);
      setDbProjects(projRes.data?.data || projRes.data || []);
    } catch (err) {
      console.error('[GovernancePanel] Failed to load:', err);
    }
  };

  useEffect(() => { loadAll(); }, []);

  // ── Districts filtered by selected state (for village form) ─────
  const districtsForState = (stateId) => {
    if (!stateId) return [];
    return dbDistricts.filter(d => String(d.state_id) === String(stateId) || String(d.state?.id) === String(stateId));
  };

  // ── Handlers ────────────────────────────────────────────────────

  const handleCreateDistrict = async (e) => {
    e.preventDefault();
    setError('');
    if (!newDistrict.state_id || !newDistrict.name) { setError('Select a state and district name.'); return; }
    setSaving(true);
    try {
      const res = await api.post('/admin/districts', {
        name:     newDistrict.name,
        state_id: newDistrict.state_id,
      });
      if (res.data.success) {
        setDbDistricts(prev => [...prev, res.data.data]);
        setState(p => ({ ...p, districts: [...(p.districts || []), res.data.data] }));
        setNewDistrict({ state_name: '', state_id: '', name: '' });
        setShowModal(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create district');
    } finally { setSaving(false); }
  };

  const handleCreateVillage = async (e) => {
    e.preventDefault();
    setError('');
    if (!newVillage.district_id || !newVillage.name) { setError('Select a district and enter village name.'); return; }
    setSaving(true);
    try {
      const res = await api.post('/admin/villages', {
        name:               newVillage.name,
        district_id:        newVillage.district_id,
        population:         newVillage.population || 0,
        water_status:       newVillage.water_status,
        sanitation_status:  newVillage.sanitation_status,
      });
      if (res.data.success) {
        setDbVillages(prev => [...prev, res.data.data]);
        setState(p => ({ ...p, villages: [...(p.villages || []), res.data.data] }));
        setNewVillage({ state_name: '', district_id: '', name: '', population: '', water_status: 'Adequate', sanitation_status: 'Good' });
        setShowModal(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create village');
    } finally { setSaving(false); }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');
    if (!newProject.name || !newProject.state_id) { setError('Project name and state are required.'); return; }
    setSaving(true);
    try {
      const res = await api.post('/admin/projects', {
        name:        newProject.name,
        state_id:    newProject.state_id,
        district_id: newProject.district_id || null,
      });
      if (res.data.success) {
        setDbProjects(prev => [res.data.data, ...prev]);
        setState(p => ({ ...p, projects: [res.data.data, ...(p.projects || [])] }));
        setNewProject({ name: '', state_name: '', state_id: '', district_id: '' });
        setShowModal(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally { setSaving(false); }
  };

  const filteredStates = INDIA_STATES.filter(s =>
    (filterRegion === 'all' || s.region === filterRegion || (filterRegion === 'UT' && s.type === 'Union Territory')) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const regions = ['all', 'North', 'South', 'East', 'West', 'Northeast', 'Central', 'UT'];

  // Computed display lists
  const displayDistricts = dbDistricts.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()));
  const displayVillages  = dbVillages.filter(v => v.name?.toLowerCase().includes(search.toLowerCase()));
  const displayProjects  = dbProjects.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">

      {/* Sub-tab bar */}
      <div className="flex gap-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1">
        {SUB_TABS.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              id={`gov-tab-${t.id}`}
              onClick={() => { setSubTab(t.id); setSearch(''); setShowModal(false); setError(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                subTab === t.id
                  ? 'bg-[#0057B8] text-white'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-inner)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* States Panel */}
      {subTab === 'states' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search states..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500 w-60"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {regions.map(r => (
                <button
                  key={r}
                  onClick={() => setFilterRegion(r)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all capitalize ${
                    filterRegion === r
                      ? 'bg-[#0057B8] text-white'
                      : 'bg-[var(--bg-inner)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
                  }`}
                >
                  {r === 'all' ? 'All (36)' : r}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredStates.map(s => (
              <div
                key={s.code}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 hover:border-blue-400 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded font-mono">
                        {s.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${REGION_COLORS[s.region] || 'bg-gray-100 text-gray-700'}`}>
                        {s.region}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{s.name}</p>
                    {s.type === 'Union Territory' && (
                      <p className="text-[10px] text-rose-500 font-semibold mt-0.5">Union Territory</p>
                    )}
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" title="Active" />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--text-secondary)] text-center">
            Showing {filteredStates.length} of 36 states/UTs · All pre-loaded from GoI master data
          </p>
        </div>
      )}

      {/* Districts Panel */}
      {subTab === 'districts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-secondary)]" />
              <input
                type="text" placeholder="Search districts..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] focus:outline-none w-60"
              />
            </div>
            <button
              id="btn-add-district"
              onClick={() => { setShowModal(true); setError(''); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add District
            </button>
          </div>

          {displayDistricts.length > 0 ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-[var(--bg-inner)]">
                  <tr>
                    {['District', 'State', 'Status'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-bold text-[var(--text-secondary)] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayDistricts.map((d, i) => (
                    <tr key={i} className="border-t border-[var(--border-color)] hover:bg-[var(--bg-inner)]">
                      <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">{d.name}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{d.state?.name || d.state || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 text-[var(--text-secondary)]">
              <MapPin className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">No districts added yet</p>
              <p className="text-xs">Click "Add District" to add programme districts</p>
            </div>
          )}
        </div>
      )}

      {/* Villages Panel */}
      {subTab === 'villages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-secondary)]" />
              <input type="text" placeholder="Search villages..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] focus:outline-none w-60" />
            </div>
            <button id="btn-add-village" onClick={() => { setShowModal(true); setError(''); }} className="flex items-center gap-2 px-4 py-2 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Village
            </button>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-[var(--bg-inner)]">
                <tr>{['Village ID', 'Name', 'District', 'Population', 'Water', 'Risk'].map(h => <th key={h} className="text-left px-4 py-3 font-bold text-[var(--text-secondary)] uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody>
                {displayVillages.map((v, i) => (
                  <tr key={i} className="border-t border-[var(--border-color)] hover:bg-[var(--bg-inner)]">
                    <td className="px-4 py-3 font-mono text-[11px] text-[var(--text-secondary)]">{v.id}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">{v.name}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{v.block?.district?.name || v.district || '—'}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{v.population || '—'}</td>
                    <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold">{v.water_status || '—'}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${v.risk_status === 'High' ? 'bg-rose-100 text-rose-700' : v.risk_status === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{v.risk_status || 'Low'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!displayVillages.length && (
              <div className="text-center py-12 text-[var(--text-secondary)]">
                <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-semibold">No villages mapped yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects Panel */}
      {subTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-secondary)]" />
              <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] focus:outline-none w-60" />
            </div>
            <button id="btn-add-project" onClick={() => { setShowModal(true); setError(''); }} className="flex items-center gap-2 px-4 py-2 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all">
              <Plus className="w-3.5 h-3.5" /> Create Project
            </button>
          </div>
          {displayProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayProjects.map((p, i) => (
                <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 hover:border-blue-400 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">{p.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">{p.state?.name || p.state} · {p.district?.name || p.district || 'District TBD'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-[var(--text-secondary)]">
              <FolderKanban className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">No projects created yet</p>
              <p className="text-xs">Click "Create Project" to add a new programme</p>
            </div>
          )}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* Error banner */}
            {error && (
              <div className="mb-3 px-3 py-2 bg-rose-500/10 border border-rose-500/25 rounded-xl text-[11px] text-rose-500 font-semibold">
                ⚠ {error}
              </div>
            )}

            {/* Add District */}
            {subTab === 'districts' && (
              <>
                <h3 className="text-base font-black mb-4 text-[var(--text-primary)]">Add District</h3>
                <form onSubmit={handleCreateDistrict} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">State *</label>
                    <select
                      value={newDistrict.state_name}
                      onChange={e => {
                        const name = e.target.value;
                        // Find state_id from dbStates by name
                        const match = dbStates.find(s => s.name === name);
                        setNewDistrict(p => ({ ...p, state_name: name, state_id: match ? String(match.id) : '', name: '' }));
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-blue-500"
                      required
                    >
                      <option value="">Select State / UT</option>
                      {INDIA_STATES.map(s => <option key={s.code} value={s.name}>{s.name} ({s.code})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">District Name *</label>
                    <select
                      value={newDistrict.name}
                      onChange={e => setNewDistrict(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-blue-500"
                      required
                      disabled={!newDistrict.state_name}
                    >
                      <option value="">{newDistrict.state_name ? 'Select District' : '— Select State first —'}</option>
                      {newDistrict.state_name && INDIAN_DISTRICTS[newDistrict.state_name]
                        ? INDIAN_DISTRICTS[newDistrict.state_name].map(d => <option key={d} value={d}>{d}</option>)
                        : null}
                    </select>
                    {!newDistrict.state_id && newDistrict.state_name && (
                      <p className="text-[10px] text-amber-400 mt-1 font-semibold">
                        ⚠ State not found in DB yet. Make sure states are seeded.
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => { setShowModal(false); setError(''); }} className="flex-1 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-inner)]">Cancel</button>
                    <button type="submit" disabled={saving || !newDistrict.state_id} className="flex-1 py-2 rounded-xl bg-[#0057B8] text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                      {saving ? 'Saving…' : 'Add District'}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Add Village */}
            {subTab === 'villages' && (
              <>
                <h3 className="text-base font-black mb-4 text-[var(--text-primary)]">Add Village</h3>
                <form onSubmit={handleCreateVillage} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">State *</label>
                    <select
                      value={newVillage.state_name}
                      onChange={e => setNewVillage(p => ({ ...p, state_name: e.target.value, district_id: '' }))}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-blue-500"
                      required
                    >
                      <option value="">Select State / UT</option>
                      {INDIA_STATES.map(s => <option key={s.code} value={s.name}>{s.name} ({s.code})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs font-semibold mb-1 block ${newVillage.state_name ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]/40'}`}>District *</label>
                    {(() => {
                      // Find state_id from dbStates by name for village district filter
                      const stObj = dbStates.find(s => s.name === newVillage.state_name);
                      const stId  = stObj ? String(stObj.id) : '';
                      const dists = dbDistricts.filter(d => String(d.state_id) === stId || String(d.state?.id) === stId);
                      return (
                        <>
                          <select
                            value={newVillage.district_id}
                            onChange={e => setNewVillage(p => ({ ...p, district_id: e.target.value }))}
                            className={`w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-blue-500 ${!newVillage.state_name ? 'opacity-40 cursor-not-allowed' : ''}`}
                            required
                            disabled={!newVillage.state_name}
                          >
                            <option value="">{newVillage.state_name ? 'Select District' : '— Select State first —'}</option>
                            {dists.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                          </select>
                          {newVillage.state_name && dists.length === 0 && (
                            <p className="text-[10px] text-amber-400 mt-1 font-semibold">⚠ No districts for this state. Add districts first.</p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Village Name *</label>
                    <input type="text" value={newVillage.name} onChange={e => setNewVillage(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Rampur" className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-blue-500" required />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => { setShowModal(false); setError(''); }} className="flex-1 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-inner)]">Cancel</button>
                    <button type="submit" disabled={saving} className="flex-1 py-2 rounded-xl bg-[#0057B8] text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50">
                      {saving ? 'Saving…' : 'Add Village'}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Create Project */}
            {subTab === 'projects' && (
              <>
                <h3 className="text-base font-black mb-4 text-[var(--text-primary)]">Create Project</h3>
                <form onSubmit={handleCreateProject} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Project Name *</label>
                    <input type="text" value={newProject.name} onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Rural Health Initiative" className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-blue-500" required />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">State *</label>
                    <select
                      value={newProject.state_name}
                      onChange={e => {
                        const name = e.target.value;
                        const match = dbStates.find(s => s.name === name);
                        setNewProject(p => ({ ...p, state_name: name, state_id: match ? String(match.id) : '', district_id: '' }));
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-blue-500"
                      required
                    >
                      <option value="">Select State / UT</option>
                      {INDIA_STATES.map(s => <option key={s.code} value={s.name}>{s.name} ({s.code})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs font-semibold mb-1 block ${newProject.state_id ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]/40'}`}>District (optional)</label>
                    {(() => {
                      const dists = districtsForState(newProject.state_id);
                      return (
                        <select
                          value={newProject.district_id}
                          onChange={e => setNewProject(p => ({ ...p, district_id: e.target.value }))}
                          className={`w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-blue-500 ${!newProject.state_id ? 'opacity-40 cursor-not-allowed' : ''}`}
                          disabled={!newProject.state_id}
                        >
                          <option value="">{newProject.state_id ? 'Select District (optional)' : '— Select State first —'}</option>
                          {dists.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                      );
                    })()}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => { setShowModal(false); setError(''); }} className="flex-1 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-inner)]">Cancel</button>
                    <button type="submit" disabled={saving || !newProject.state_id} className="flex-1 py-2 rounded-xl bg-[#0057B8] text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                      {saving ? 'Saving…' : 'Create'}
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
