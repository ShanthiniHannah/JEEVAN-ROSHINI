import React from 'react';
import { Clock, MapPin } from 'lucide-react';

export default function AttendanceTracker({
  attendanceStatus,
  handleCheckIn,
  attendanceTime,
  gpsCoords,
  handleCheckOut,
  leaveForm,
  setLeaveForm,
  handleApplyLeave
}) {
  return (
    <div className="space-y-4">
      {/* GPS Attendance Panel */}
      <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl">
        <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-400" />
          GPS Work Check-In
        </h3>
        <p className="text-[10px] text-slate-400 mb-4">VHWs must check-in daily from designated villages. GPS coords verified automatically.</p>

        {attendanceStatus === 'checked-out' ? (
          <button 
            onClick={handleCheckIn}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-850 text-white font-bold py-3.5 rounded-2xl text-xs transition shadow-lg active:scale-97 flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4 animate-bounce" />
            GPS Duty Check-In
          </button>
        ) : (
          <div className="space-y-3">
            <div className="bg-slate-900 border border-blue-900/30 p-3.5 rounded-xl text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Duty Status</p>
              <h4 className="text-emerald-400 font-bold text-xs mt-1">✓ Active Shift Logged</h4>
              <p className="text-[10px] text-slate-300 font-mono mt-1">Started: {attendanceTime} | Location: {gpsCoords?.lat}, {gpsCoords?.lng}</p>
            </div>
            <button 
              onClick={handleCheckOut}
              className="w-full bg-slate-700 hover:bg-slate-650 border border-slate-650 text-white font-bold py-2.5 rounded-xl text-xs transition active:scale-97 flex items-center justify-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              Duty Check-Out
            </button>
          </div>
        )}
      </div>

      {/* Leave Management Form */}
      <div className="bg-slate-800/40 p-4 border border-slate-700/60 rounded-2xl">
        <h3 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Leave Application</h3>
        <form onSubmit={handleApplyLeave} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Start Date</label>
              <input 
                type="date"
                value={leaveForm.startDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Days Needed</label>
              <select
                value={leaveForm.days}
                onChange={(e) => setLeaveForm({ ...leaveForm, days: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white mt-1 focus:outline-none"
              >
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="5">5 Days</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">Reason for Leave</label>
            <input 
              type="text"
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              placeholder="Medical, family ceremony, etc."
              required
              className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-white focus:outline-none mt-1"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-650 text-white font-bold py-2 rounded-xl text-xs transition"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
