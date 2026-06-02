import React from 'react';
import { CheckSquare } from 'lucide-react';

export default function ApprovalWorkflows({
  state,
  supportRecords,
  handleUpdateStatus
}) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-emerald-400" />
          NGO Field Operations Approval center
        </h3>
        <p className="text-xs text-slate-400 mb-4">Validate logs, check-ins, leave requests, and clinic referrals before records lock.</p>

        <div className="space-y-4">
          
          {/* LEAVE REQUESTS */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Leave Applications ({state.leaveRequests.filter(l => l.status === 'Submitted' || l.status === 'Pending').length})</span>
            </div>
            <div className="divide-y divide-slate-800 bg-slate-950/20">
              {state.leaveRequests.map(leave => (
                <div key={leave.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-white">{leave.staffName} <span className="text-[10px] text-slate-500 font-mono">({leave.id})</span></p>
                    <p className="text-[11px] text-slate-400 mt-1">Start: {leave.startDate} · Days: {leave.days || leave.days_count} · Reason: <span className="italic text-slate-300">"{leave.reason}"</span></p>
                    <span className={`inline-block mt-2 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                      leave.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-amber-500/10 text-amber-400 animate-pulse'
                    }`}>{leave.status}</span>
                  </div>
                  
                  {(leave.status === 'Submitted' || leave.status === 'Pending') && (
                    <div className="flex gap-1.5 shrink-0 self-end sm:self-center">
                      <button onClick={() => handleUpdateStatus('leaveRequests', leave.id, 'Approved')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition flex items-center gap-1">Approve</button>
                      <button onClick={() => handleUpdateStatus('leaveRequests', leave.id, 'Rejected')} className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition flex items-center gap-1">Reject</button>
                      <button onClick={() => handleUpdateStatus('leaveRequests', leave.id, 'Returned')} className="bg-slate-700 hover:bg-slate-650 text-slate-200 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition">Return</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* GPS ATTENDANCE LOGS */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Shift Check-Ins ({state.attendance.filter(a => a.approvalStatus === 'Submitted').length})</span>
            </div>
            <div className="divide-y divide-slate-800 bg-slate-950/20">
              {state.attendance.filter(a => a.approvalStatus === 'Submitted').map(att => (
                <div key={att.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-white">{att.staffName} <span className="text-[10px] text-slate-500 font-mono">({att.id})</span></p>
                    <p className="text-[11px] text-slate-400 mt-1">Date: {att.date} · Check-In: {att.checkIn} · Location: <span className="font-mono text-cyan-400">{att.gps}</span></p>
                  </div>
                  
                  <div className="flex gap-1.5 shrink-0 self-end sm:self-center">
                    <button onClick={() => handleUpdateStatus('attendance', att.id, 'Approved')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition">Approve</button>
                    <button onClick={() => handleUpdateStatus('attendance', att.id, 'Rejected')} className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition">Reject</button>
                  </div>
                </div>
              ))}
              {state.attendance.filter(a => a.approvalStatus === 'Submitted').length === 0 && (
                <p className="text-xs text-slate-500 italic p-4 text-center">No pending attendance approvals.</p>
              )}
            </div>
          </div>

          {/* REFERRALS */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Clinical Hospital Referrals ({state.referrals.filter(r => r.status === 'Submitted').length})</span>
            </div>
            <div className="divide-y divide-slate-800 bg-slate-950/20">
              {state.referrals.map(ref => (
                <div key={ref.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-white">Patient: {ref.patientName} <span className="text-[10px] text-slate-500 font-mono">({ref.id})</span></p>
                    <p className="text-[11px] text-slate-400 mt-1">Referred to: <span className="font-semibold text-slate-300">{ref.referredTo}</span> · Referred by: {ref.referredBy} · Reason: <span className="italic">"{ref.reason}"</span></p>
                    <span className={`inline-block mt-2 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      ref.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                      ref.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>{ref.status}</span>
                  </div>
                  
                  {ref.status === 'Submitted' && (
                    <div className="flex gap-1.5 shrink-0 self-end sm:self-center">
                      <button onClick={() => handleUpdateStatus('referrals', ref.id, 'Approved')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition">Approve</button>
                      <button onClick={() => handleUpdateStatus('referrals', ref.id, 'Rejected')} className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition">Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SOCIAL SUPPORT ASSISTANCE */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Beneficiary Social Support ({supportRecords.filter(s => s.status === 'Submitted').length})</span>
            </div>
            <div className="divide-y divide-slate-800 bg-slate-950/20">
              {supportRecords.map(sup => (
                <div key={sup.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-white">Beneficiary: {sup.beneficiary} <span className="text-[10px] text-slate-500 font-mono">({sup.id})</span></p>
                    <p className="text-[11px] text-slate-400 mt-1">Aid: <span className="font-semibold text-slate-300">{sup.support}</span> · Scheme: {sup.scheme} · Date: {sup.date}</p>
                    <span className={`inline-block mt-2 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      sup.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                      sup.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>{sup.status || 'Approved'}</span>
                  </div>
                  
                  {sup.status === 'Submitted' && (
                    <div className="flex gap-1.5 shrink-0 self-end sm:self-center">
                      <button onClick={() => handleUpdateStatus('supportRecords', sup.id, 'Approved')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition">Approve</button>
                      <button onClick={() => handleUpdateStatus('supportRecords', sup.id, 'Rejected')} className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition">Reject</button>
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
