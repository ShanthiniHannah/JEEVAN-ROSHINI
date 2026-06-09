import React, { useState, useEffect } from 'react';
import { CheckSquare, Calendar, Compass, ShieldAlert, Award, Inbox, CheckCircle2, Loader2 } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { api } from '../../services/apiClient';

/**
 * Helper to format ISO dates to a clean DD MMM YYYY string.
 */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch (_e) {
    return dateStr;
  }
}

/**
 * ApprovalWorkflows — Director Portal sub-view.
 * Fetches real polymorphic Approvals from the unified Workflow Engine API.
 */
export function ApprovalWorkflows() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      const res = await api.get('/approvals');
      if (res.data?.success) {
        setApprovals(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch approvals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleProcess = async (id, status) => {
    try {
      const res = await api.post(`/approvals/${id}/process`, { status, notes: `Processed by Director via Workflow UI` });
      if (res.data?.success) {
        setApprovals(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      alert("Failed to process approval.");
      console.error(err);
    }
  };

  const leavesPending = approvals.filter(a => a.approvable_type.includes('LeaveRequest'));
  const otherPending = approvals.filter(a => !a.approvable_type.includes('LeaveRequest'));
  const totalPending = approvals.length;

  const handleApproveAll = async () => {
    if (totalPending === 0) return;
    for (const a of approvals) {
      await handleProcess(a.id, 'Approved');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ── Task-Oriented Inbox Header Card ── */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none dark:border dark:border-[var(--border-color)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-650 dark:text-brand-400">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2">
              Pending Approvals Inbox
              <span className="bg-rose-500/10 text-rose-500 text-xs px-2.5 py-0.5 rounded-full font-black">
                {totalPending} Tasks
              </span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">
              Verify leave logs, shift attendance, medical referrals, and aid distributions.
            </p>
          </div>
        </div>

        {totalPending > 0 ? (
          <button
            onClick={handleApproveAll}
            className="w-full md:w-auto bg-brand-500 hover:bg-brand-650 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" /> Approve All Pending
          </button>
        ) : (
          <span className="text-xs text-emerald-500 font-extrabold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Inbox Screened Clear
          </span>
        )}
      </div>

      {/* ── Inbox Task Groupings ── */}
      <div className="space-y-6">
        
        {/* LEAVE APPLICATIONS */}
        <div className="bg-[var(--bg-card)] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none dark:border dark:border-[var(--border-color)] overflow-hidden">
          <div className="border-b border-[var(--border-color)] px-6 py-4 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/10">
            <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-500" />
              Leave Applications ({leavesPending.length})
            </span>
          </div>
          
          <div className="divide-y divide-[var(--border-color)]">
            {leavesPending.map(leave => (
              <div key={leave.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/20 dark:hover:bg-slate-850/10 transition-colors duration-150">
                <div className="space-y-1.5">
                  <p className="text-xs font-black text-[var(--text-primary)]">
                    {leave.requested_by?.name || 'VHW'} <span className="text-xs text-[var(--text-secondary)] font-mono font-bold">({leave.id})</span>
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] font-medium">
                    Date Submitted: {formatDate(leave.submitted_at)} · Notes: <span className="italic text-[var(--text-primary)]">"{leave.reviewer_notes}"</span>
                  </p>
                  <StatusBadge status={leave.status} />
                </div>
                
                <div className="flex gap-2 shrink-0 self-end sm:self-center">
                  <button 
                    onClick={() => handleProcess(leave.id, 'Approved')} 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-3.5 py-2 rounded-lg text-xs uppercase transition cursor-pointer"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleProcess(leave.id, 'Rejected')} 
                    className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold px-3.5 py-2 rounded-lg text-xs uppercase transition cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {leavesPending.length === 0 && (
              <p className="text-xs text-[var(--text-secondary)] italic p-6 text-center">No pending leave applications.</p>
            )}
          </div>
        </div>

        {/* OTHER PENDING REQUESTS (Referrals, Supports, Shifts) */}
        <div className="bg-[var(--bg-card)] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none dark:border dark:border-[var(--border-color)] overflow-hidden">
          <div className="border-b border-[var(--border-color)] px-6 py-4 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/10">
            <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-500" />
              Other Requests ({otherPending.length})
            </span>
          </div>
          
          <div className="divide-y divide-[var(--border-color)]">
            {otherPending.map(req => (
              <div key={req.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/20 dark:hover:bg-slate-850/10 transition-colors duration-150">
                <div className="space-y-1">
                  <p className="text-xs font-black text-[var(--text-primary)]">
                    {req.requested_by?.name || 'Staff'} <span className="text-xs text-[var(--text-secondary)] font-mono font-bold">({req.id})</span>
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] font-medium">
                    Type: {req.approvable_type.split('\\').pop()} · Details: <span className="font-mono text-teal-600 font-bold">{req.reviewer_notes}</span>
                  </p>
                  <StatusBadge status={req.status} />
                </div>
                
                <div className="flex gap-2 shrink-0 self-end sm:self-center">
                  <button 
                    onClick={() => handleProcess(req.id, 'Approved')} 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-3.5 py-2 rounded-lg text-xs uppercase transition cursor-pointer"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleProcess(req.id, 'Rejected')} 
                    className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold px-3.5 py-2 rounded-lg text-xs uppercase transition cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {otherPending.length === 0 && (
              <p className="text-xs text-[var(--text-secondary)] italic p-6 text-center">No other pending requests.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ApprovalWorkflows;
