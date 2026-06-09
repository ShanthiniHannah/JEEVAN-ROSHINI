import React, { useState } from 'react';
import { Search, Eye, User, MapPin } from 'lucide-react';

const SUB_TABS = [
  { id: 'families',     label: 'Families' },
  { id: 'individuals',  label: 'Individuals' },
  { id: 'health',       label: 'Health Records' },
  { id: 'visits',       label: 'Visit Logs' },
];

export default function MonitoringPanel({ state }) {
  const [subTab, setSubTab]   = useState('families');
  const [search, setSearch]   = useState('');

  const families    = (state.families    || []).filter(f => JSON.stringify(f).toLowerCase().includes(search.toLowerCase()));
  const individuals = (state.individuals || []).filter(i => i.name?.toLowerCase().includes(search.toLowerCase()) || i.individual_code?.toLowerCase().includes(search.toLowerCase()));
  const visits      = (state.visits      || []).filter(v => JSON.stringify(v).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">

      {/* Sub-tab bar */}
      <div className="flex gap-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1">
        {SUB_TABS.map(t => (
          <button
            key={t.id}
            id={`mon-tab-${t.id}`}
            onClick={() => { setSubTab(t.id); setSearch(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subTab === t.id ? 'bg-[#0057B8] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-inner)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Read-only notice */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300">
        <Eye className="w-3.5 h-3.5 shrink-0" />
        Read-only view — Super Admin can search and monitor all field data. Edit only when necessary.
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-secondary)]" />
        <input
          type="text"
          placeholder={`Search ${subTab}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Families Table */}
      {subTab === 'families' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-[var(--bg-inner)]">
              <tr>{['Family Code', 'House No', 'Village', 'Members', 'Economic', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-bold text-[var(--text-secondary)] uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {families.slice(0, 50).map((f, i) => (
                <tr key={i} className="border-t border-[var(--border-color)] hover:bg-[var(--bg-inner)]">
                  <td className="px-4 py-3 font-mono text-[11px] text-blue-600 font-bold">{f.family_code || f.id}</td>
                  <td className="px-4 py-3 text-[var(--text-primary)]">{f.house_no || f.houseNo}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{f.villageName || f.village?.name}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{f.membersCount || '—'}</td>
                  <td className="px-4 py-3"><span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[10px] font-bold">{f.economicStatus || f.economic_status || 'BPL'}</span></td>
                  <td className="px-4 py-3"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">{f.status || 'Active'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!families.length && <div className="text-center py-12 text-xs text-[var(--text-secondary)]">No families found</div>}
          {families.length > 50 && <div className="text-center py-3 text-xs text-[var(--text-secondary)] border-t border-[var(--border-color)]">Showing 50 of {families.length} records</div>}
        </div>
      )}

      {/* Individuals Table */}
      {subTab === 'individuals' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-[var(--bg-inner)]">
              <tr>{['Individual Code', 'Name', 'Age', 'Gender', 'Pregnancy', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-bold text-[var(--text-secondary)] uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {individuals.slice(0, 50).map((ind, i) => (
                <tr key={i} className="border-t border-[var(--border-color)] hover:bg-[var(--bg-inner)]">
                  <td className="px-4 py-3 font-mono text-[11px] text-blue-600 font-bold">{ind.individual_code || ind.id}</td>
                  <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">{ind.name}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{ind.age}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{ind.gender}</td>
                  <td className="px-4 py-3">
                    {ind.pregnancyStatus === 'Yes' && <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full text-[10px] font-bold">Pregnant</span>}
                  </td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ind.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{ind.status || 'Active'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!individuals.length && <div className="text-center py-12 text-xs text-[var(--text-secondary)]">No individuals found</div>}
        </div>
      )}

      {/* Visit Logs */}
      {subTab === 'visits' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-[var(--bg-inner)]">
              <tr>{['VHW', 'Family', 'Village', 'Date', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-bold text-[var(--text-secondary)] uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {visits.slice(0, 50).map((v, i) => (
                <tr key={i} className="border-t border-[var(--border-color)] hover:bg-[var(--bg-inner)]">
                  <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">{v.vhwName || v.user?.name || '—'}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{v.familyId || v.family_id}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{v.villageName || '—'}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{v.date || v.visit_date}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${v.status === 'Reviewed' ? 'bg-blue-100 text-blue-700' : v.status === 'Submitted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{v.status || 'Submitted'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visits.length && <div className="text-center py-12 text-xs text-[var(--text-secondary)]">No visits found</div>}
        </div>
      )}

      {/* Health Records placeholder */}
      {subTab === 'health' && (
        <div className="text-center py-16 text-[var(--text-secondary)]">
          <p className="text-sm font-semibold mb-1">Health Records Monitor</p>
          <p className="text-xs">Full health records view will be available once backend API is wired</p>
        </div>
      )}

    </div>
  );
}
