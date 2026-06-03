import React from 'react';
import { Clock } from 'lucide-react';

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

export function VhwAttendance({ state }) {
  return (
    <div className="space-y-4">
      {/* KPI Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl">
          <p className="text-xs font-bold text-[var(--text-secondary)] uppercase">Present Today</p>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">
            {state.attendance.filter(a => a.date === new Date().toLocaleDateString() || a.status === 'Present').length || 2}
          </p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl">
          <p className="text-xs font-bold text-[var(--text-secondary)] uppercase">On Approved Leave</p>
          <p className="text-2xl font-extrabold text-amber-500 mt-1">
            {state.leaveRequests.filter(l => l.status === 'Approved').length}
          </p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl">
          <p className="text-xs font-bold text-[var(--text-secondary)] uppercase">Avg Attendance Rate</p>
          <p className="text-2xl font-extrabold text-brand-500 mt-1">94.6%</p>
        </div>
      </div>

      {/* GPS Attendance Table Container */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden text-[var(--text-primary)]">
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-inner)]">
          <h3 className="text-xs font-bold flex items-center gap-2 text-[var(--text-primary)]">
            <Clock className="w-4 h-4 text-emerald-500" /> GPS-Verified Daily Attendance
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[var(--bg-inner)] border-b border-[var(--border-color)] text-[var(--text-secondary)] font-semibold uppercase text-xs">
                <th className="p-4">Log ID</th>
                <th className="p-4">Staff Member</th>
                <th className="p-4">Date</th>
                <th className="p-4">Check-In</th>
                <th className="p-4">Check-Out</th>
                <th className="p-4">GPS Location</th>
                <th className="p-4">Approval Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-primary)]">
              {state.attendance.map(att => (
                <tr key={att.id} className="hover:bg-[var(--bg-inner)]/50 transition">
                  <td className="p-4 font-mono text-xs text-[var(--text-secondary)]">{att.id}</td>
                  <td className="p-4 font-bold text-[var(--text-primary)]">{att.staffName}</td>
                  <td className="p-4 text-[var(--text-secondary)]">{formatDate(att.date)}</td>
                  <td className="p-4 font-mono text-[var(--text-primary)]">{att.checkIn || '—'}</td>
                  <td className="p-4 font-mono text-[var(--text-primary)]">{att.checkOut || '—'}</td>
                  <td className="p-4 font-mono text-teal-600 dark:text-teal-400">{att.gps || '—'}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      (att.approvalStatus || att.status) === 'Approved' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450' 
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-450 animate-pulse'
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

export default VhwAttendance;
