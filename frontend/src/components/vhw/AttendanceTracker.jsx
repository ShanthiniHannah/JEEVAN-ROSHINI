import { Clock, Send, CheckCircle2, UserCheck } from 'lucide-react';

/**
 * AttendanceTracker — Read-only automatic attendance and leave management interface.
 * Follows VHW rules: inputs text-base (16px), buttons h-12 (48px).
 */
export default function AttendanceTracker({
  loginTime,
  logoutTime,
  leaveForm,
  setLeaveForm,
  handleApplyLeave
}) {
  return (
    <div className="space-y-4">
      {/* Automatic Shift Attendance Panel */}
      <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center pb-2 border-b border-slate-800">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
            Shift Attendance
          </h3>
        </div>
        <p className="text-[10.5px] text-slate-400 leading-relaxed">
          Your daily attendance is recorded automatically. The first login of the day registers you as Present.
        </p>

        <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-center space-y-2">
          <div className="flex justify-center mb-1">
            <div className="bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20">
              <UserCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <p className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider">Attendance Status</p>
          
          {logoutTime ? (
            <div>
              <h4 className="text-blue-400 font-black text-xs flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> SHIFT COMPLETED
              </h4>
              <p className="text-[10px] text-slate-400 font-mono mt-1">
                Shift ended at: {logoutTime}
              </p>
            </div>
          ) : (
            <div>
              <h4 className="text-emerald-400 font-black text-xs flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> SHIFT ACTIVE (PRESENT)
              </h4>
              <p className="text-[10px] text-slate-400 font-mono mt-1">
                Shift started at: {loginTime || 'Login time'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Leave Management Form */}
      <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center pb-2 border-b border-slate-800">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Leave Application</h3>
        </div>
        
        <form onSubmit={handleApplyLeave} className="space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Start Date</label>
              <input 
                type="date"
                value={leaveForm.startDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                required
                className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:border-[#0ea5e9]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Days Needed</label>
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
            className="w-full h-12 bg-slate-950 border border-slate-855 hover:bg-slate-900 text-slate-300 hover:text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition duration-250 cursor-pointer shadow-sm"
          >
            <Send className="w-3.5 h-3.5" /> Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
