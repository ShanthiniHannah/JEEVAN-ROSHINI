import React from 'react';
import { CheckSquare, Calendar, Compass, ShieldAlert, Award } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

/**
 * Helper to format ISO dates to a clean DD MMM YYYY string.
 * @param {string} dateStr - Raw ISO date string.
 * @returns {string} Formatted date.
 */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (_e) {
    return dateStr;
  }
}

/**
 * ApprovalWorkflows — Director Portal sub-view.
 * Manage approvals for leave applications, GPS shift check-ins, medical referrals, and support records.
 */
export function ApprovalWorkflows({
  state,
  supportRecords,
  handleUpdateStatus
}) {
  return (
    <div className="space-y-6">
      {/* Field Operations Approval Center Outer Card */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4 text-[var(--text-primary)]">
        <div className="border-b border-[var(--border-color)] pb-3">
          <h3 className="text-xs font-black flex items-center gap-2 text-[var(--text-primary)]">
            <CheckSquare className="w-5 h-5 text-emerald-500" />
            Field Operations Approval Center
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">
            Review and sign off on VHW logs, check-ins, and referrals prior to data locking.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          
          {/* LEAVE APPLICATIONS */}
          <div className="border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--bg-inner)]">
            <div className="bg-[var(--bg-inner)] border-b border-[var(--border-color)] px-4 py-3 flex justify-between items-center">
              <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-500" /> Leave Applications ({state.leaveRequests.filter(l => l.status === 'Submitted' || l.status === 'Pending').length})
              </span>
            </div>
            
            <div className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
              {state.leaveRequests.map(leave => (
                <div key={leave.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-black text-[var(--text-primary)]">
                      {leave.staffName} <span className="text-xs text-[var(--text-secondary)] font-mono font-bold">({leave.id})</span>
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">
                      Start Date: {formatDate(leave.startDate)} · Days: {leave.days || leave.days_count} · Reason: <span className="italic text-[var(--text-primary)]">"{leave.reason}"</span>
                    </p>
                    <StatusBadge status={leave.status} />
                  </div>
                  
                  {(leave.status === 'Submitted' || leave.status === 'Pending') && (
                    <div className="flex gap-2 shrink-0 self-end sm:self-center">
                      <button 
                        onClick={() => handleUpdateStatus('leaveRequests', leave.id, 'Approved')} 
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase transition cursor-pointer"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus('leaveRequests', leave.id, 'Rejected')} 
                        className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase transition cursor-pointer"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus('leaveRequests', leave.id, 'Returned')} 
                        className="bg-[var(--bg-inner)] hover:bg-[var(--bg-page)] text-[var(--text-primary)] font-bold px-3.5 py-1.5 rounded-lg text-xs border border-[var(--border-color)] uppercase transition cursor-pointer"
                      >
                        Return
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {state.leaveRequests.length === 0 && (
                <p className="text-xs text-[var(--text-secondary)] italic p-6 text-center">No leave applications submitted.</p>
              )}
            </div>
          </div>

          {/* SHIFT CHECK-INS */}
          <div className="border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--bg-inner)]">
            <div className="bg-[var(--bg-inner)] border-b border-[var(--border-color)] px-4 py-3">
              <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-teal-500" /> Shift Check-Ins ({state.attendance.filter(a => a.approvalStatus === 'Submitted').length})
              </span>
            </div>
            
            <div className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
              {state.attendance.filter(a => a.approvalStatus === 'Submitted').map(att => (
                <div key={att.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-[var(--text-primary)]">
                      {att.staffName} <span className="text-xs text-[var(--text-secondary)] font-mono font-bold">({att.id})</span>
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">
                      Date: {formatDate(att.date)} · Check-In: {att.checkIn} · Location: <span className="font-mono text-teal-650 dark:text-teal-400 font-bold">{att.gps}</span>
                    </p>
                  </div>
                  
                  <div className="flex gap-2 shrink-0 self-end sm:self-center">
                    <button 
                      onClick={() => handleUpdateStatus('attendance', att.id, 'Approved')} 
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase transition cursor-pointer"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus('attendance', att.id, 'Rejected')} 
                      className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase transition cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {state.attendance.filter(a => a.approvalStatus === 'Submitted').length === 0 && (
                <p className="text-xs text-[var(--text-secondary)] italic p-6 text-center">No pending shift check-in logs.</p>
              )}
            </div>
          </div>

          {/* HOSPITAL REFERRALS */}
          <div className="border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--bg-inner)]">
            <div className="bg-[var(--bg-inner)] border-b border-[var(--border-color)] px-4 py-3">
              <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" /> Hospital Referrals ({state.referrals.filter(r => r.status === 'Submitted').length})
              </span>
            </div>
            
            <div className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
              {state.referrals.map(ref => (
                <div key={ref.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-black text-[var(--text-primary)]">
                      Patient: {ref.patientName} <span className="text-xs text-[var(--text-secondary)] font-mono font-bold">({ref.id})</span>
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">
                      Referred: <span className="font-bold text-[var(--text-primary)]">{ref.referredTo}</span> · By VHW: {ref.referredBy} · Reason: <span className="italic">"{ref.reason}"</span>
                    </p>
                    <StatusBadge status={ref.status} />
                  </div>
                  
                  {ref.status === 'Submitted' && (
                    <div className="flex gap-2 shrink-0 self-end sm:self-center">
                      <button 
                        onClick={() => handleUpdateStatus('referrals', ref.id, 'Approved')} 
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase transition cursor-pointer"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus('referrals', ref.id, 'Rejected')} 
                        className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase transition cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SOCIAL AID ASSISTANCE */}
          <div className="border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--bg-inner)]">
            <div className="bg-[var(--bg-inner)] border-b border-[var(--border-color)] px-4 py-3">
              <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#f59e0b]" /> Social Aid Assistance ({supportRecords.filter(s => s.status === 'Submitted').length})
              </span>
            </div>
            
            <div className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
              {supportRecords.map(sup => (
                <div key={sup.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-black text-[var(--text-primary)]">
                      Beneficiary: {sup.beneficiary} <span className="text-xs text-[var(--text-secondary)] font-mono font-bold">({sup.id})</span>
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">
                      Support Aid: <span className="font-bold text-[var(--text-primary)]">{sup.support}</span> · Scheme: {sup.scheme} · Date: {formatDate(sup.date)}
                    </p>
                    <StatusBadge status={sup.status || 'Approved'} />
                  </div>
                  
                  {sup.status === 'Submitted' && (
                    <div className="flex gap-2 shrink-0 self-end sm:self-center">
                      <button 
                        onClick={() => handleUpdateStatus('supportRecords', sup.id, 'Approved')} 
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase transition cursor-pointer"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus('supportRecords', sup.id, 'Rejected')} 
                        className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase transition cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ApprovalWorkflows;
