import { Clock, MapPin, Send, Check } from 'lucide-react';

/**
 * AttendanceTracker — GPS check-in and leave management interface.
 * Follows VHW rules: inputs text-base (16px), buttons h-12 (48px).
 */
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
      <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center pb-2 border-b border-slate-800">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary animate-pulse" />
            GPS Work Check-In
          </h3>
        </div>
        <p className="text-[10px] text-slate-450 leading-relaxed">
          Daily attendance requires GPS check-in from your assigned rural sectors.
        </p>

        {attendanceStatus === 'checked-out' ? (
          <button 
            type="button"
            onClick={handleCheckIn}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 transition duration-200"
          >
            <MapPin className="w-4 h-4 animate-bounce" />
            GPS Duty Check-In
          </button>
        ) : (
          <div className="space-y-3.5">
            <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl text-center">
              <p className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider">Duty Check</p>
              <h4 className="text-emerald-450 font-black text-xs mt-1 flex items-center justify-center gap-1"><Check className="w-3.5 h-3.5" /> SHIFT STARTED</h4>
              <p className="text-[9.5px] text-slate-400 font-mono mt-1 leading-normal">
                Time: {attendanceTime} <br /> 
                GPS: {gpsCoords?.lat ?? '—'}, {gpsCoords?.lng ?? '—'}
              </p>
            </div>
            <button 
              type="button"
              onClick={handleCheckOut}
              className="w-full h-12 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-350 hover:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition duration-250"
            >
              <Clock className="w-3.5 h-3.5" />
              Duty Check-Out
            </button>
          </div>
        )}
      </div>

      {/* Leave Management Form */}
      <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center pb-2 border-b border-slate-800">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Leave Application</h3>
        </div>
        
        <form onSubmit={handleApplyLeave} className="space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Start Date</label>
              <input 
                type="date"
                value={leaveForm.startDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                required
                className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Days Needed</label>
              <select
                value={leaveForm.days}
                onChange={(e) => setLeaveForm({ ...leaveForm, days: e.target.value })}
                className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
              >
                <option value="1" className="bg-slate-950">1 Day</option>
                <option value="2" className="bg-slate-950">2 Days</option>
                <option value="3" className="bg-slate-950">3 Days</option>
                <option value="5" className="bg-slate-950">5 Days</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Reason for Leave</label>
            <input 
              type="text"
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              placeholder="Medical, family ceremony, etc."
              required
              className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9] placeholder:text-slate-600"
            />
          </div>

          <button 
            type="submit"
            className="w-full h-12 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300 hover:text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition duration-250 cursor-pointer shadow-sm"
          >
            <Send className="w-3.5 h-3.5" /> Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
