import React from 'react';
import { Clock } from 'lucide-react';

export default function VhwAttendance({
  state
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Present Today</p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">
            {state.attendance.filter(a => a.date === new Date().toLocaleDateString() || a.status === 'Present').length || 2}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase">On Approved Leave</p>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">{state.leaveRequests.filter(l => l.status === 'Approved').length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Avg Attendance Rate</p>
          <p className="text-2xl font-extrabold text-blue-400 mt-1">94.6%</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" /> GPS-Verified Daily Attendance
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="p-4">Log ID</th>
                <th className="p-4">Staff Member</th>
                <th className="p-4">Date</th>
                <th className="p-4">Check-In</th>
                <th className="p-4">Check-Out</th>
                <th className="p-4">GPS Location</th>
                <th className="p-4">Approval Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {state.attendance.map(att => (
                <tr key={att.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-mono text-[10px]">{att.id}</td>
                  <td className="p-4 font-bold text-slate-200">{att.staffName}</td>
                  <td className="p-4 text-slate-400">{att.date}</td>
                  <td className="p-4 font-mono text-slate-300">{att.checkIn}</td>
                  <td className="p-4 font-mono text-slate-300">{att.checkOut}</td>
                  <td className="p-4 font-mono text-cyan-400">{att.gps}</td>
                  <td className="p-4">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      (att.approvalStatus || att.status) === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400 animate-pulse'
                    }`}>
                      {att.approvalStatus || 'Approved'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
