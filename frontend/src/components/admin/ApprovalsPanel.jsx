import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Filter } from 'lucide-react';

const APPROVAL_TYPES = ['All', 'Project', 'District', 'Village', 'Director', 'Support'];
const STATUS_COLORS  = {
  Pending:  'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-rose-100 text-rose-700',
};

export default function ApprovalsPanel({ state, setState, onApprovalChange }) {
  const [typeFilter, setTypeFilter] = useState('All');
  const [noteModal, setNoteModal]   = useState(null); // { id, action }
  const [noteText, setNoteText]     = useState('');

  const approvals = state.approvals || [];
  const filtered  = approvals.filter(a =>
    typeFilter === 'All' || a.type?.toLowerCase().includes(typeFilter.toLowerCase())
  );

  const handleAction = (id, action) => {
    if (action === 'Reject') {
      setNoteModal({ id, action });
      return;
    }
    applyAction(id, action, '');
  };

  const applyAction = (id, action, note) => {
    setState(p => {
      const updated = (p.approvals || []).map(a =>
        a.id === id ? { ...a, status: action === 'Approve' ? 'Approved' : 'Rejected', notes: note, reviewed_at: new Date().toLocaleString() } : a
      );
      const pending = updated.filter(a => a.status === 'Pending').length;
      onApprovalChange?.(pending);
      return { ...p, approvals: updated };
    });
    setNoteModal(null);
    setNoteText('');
  };

  const pendingCount = approvals.filter(a => a.status === 'Pending').length;

  return (
    <div className="space-y-4">

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pending', count: pendingCount, color: 'border-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600' },
          { label: 'Approved', count: approvals.filter(a => a.status === 'Approved').length, color: 'border-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600' },
          { label: 'Rejected', count: approvals.filter(a => a.status === 'Rejected').length, color: 'border-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.color} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-black ${s.text}`}>{s.count}</p>
            <p className="text-xs font-semibold text-[var(--text-secondary)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex gap-1 flex-wrap">
        {APPROVAL_TYPES.map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              typeFilter === t ? 'bg-[#0057B8] text-white' : 'bg-[var(--bg-inner)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Approval list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-[var(--text-primary)]">No approvals pending</p>
          <p className="text-xs text-[var(--text-secondary)]">All requests have been reviewed</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a, i) => (
            <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[a.status] || 'bg-gray-100 text-gray-600'}`}>{a.status}</span>
                  <span className="text-xs font-bold text-blue-500">{a.type}</span>
                </div>
                <p className="text-sm font-bold text-[var(--text-primary)]">{a.title || a.description}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Requested by {a.requestedBy || 'System'} · {a.created_at || a.time}
                </p>
                {a.notes && (
                  <p className="text-xs text-amber-600 mt-1">Note: {a.notes}</p>
                )}
              </div>
              {a.status === 'Pending' && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleAction(a.id, 'Reject')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-300 text-rose-600 text-xs font-bold hover:bg-rose-50 transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                  <button
                    onClick={() => handleAction(a.id, 'Approve')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                </div>
              )}
              {a.status !== 'Pending' && (
                <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <Clock className="w-3 h-3" /> {a.reviewed_at || 'Reviewed'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject Note Modal */}
      {noteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-black mb-3 text-[var(--text-primary)]">Rejection Reason</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-3">Please provide a reason for rejection (required)</p>
            <textarea
              rows={3}
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-inner)] text-[var(--text-primary)] text-xs focus:outline-none resize-none"
            />
            <div className="flex gap-2 mt-3">
              <button onClick={() => setNoteModal(null)} className="flex-1 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)]">Cancel</button>
              <button
                onClick={() => noteText.trim() && applyAction(noteModal.id, 'Reject', noteText)}
                disabled={!noteText.trim()}
                className="flex-1 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
