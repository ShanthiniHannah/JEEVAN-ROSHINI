import React from 'react';
import { Bell, Save } from 'lucide-react';

export default function NotificationConsole({
  notifForm,
  setNotifForm,
  notifLogs,
  handleSubmitNotif
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* NOTIFICATION LOGS LIST */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          Central System Broadcast & SMS Logs ({notifLogs.length})
        </h3>
        <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
          {notifLogs.map(log => (
            <div key={log.id} className="border border-slate-800 p-4 rounded-xl bg-slate-950/20 text-xs">
              <div className="flex justify-between items-start">
                <span className="text-[8.5px] uppercase font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{log.type}</span>
                <span className="text-[10px] font-mono text-slate-500">{log.time}</span>
              </div>
              <h4 className="text-xs font-bold text-white mt-2">Recipient ID: {log.recipient}</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed"><span className="font-bold text-slate-500">Message Content:</span> "{log.message}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* SEND BROADCAST FORM */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl h-fit">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-amber-400 animate-pulse" />
          Send System Broadcast
        </h3>
        <form onSubmit={handleSubmitNotif} className="space-y-3.5 text-xs text-slate-350">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Channel Type</label>
            <select 
              value={notifForm.type} 
              onChange={(e) => setNotifForm({ ...notifForm, type: e.target.value })} 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 mt-1 text-white focus:outline-none"
            >
              <option value="SMS">SMS Gateway Channel</option>
              <option value="Central Broadcast">Central Dashboard Broadcast</option>
              <option value="Alert Email">Email Security Alert</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Recipient Filter</label>
            <input 
              type="text" 
              value={notifForm.recipient} 
              onChange={(e) => setNotifForm({ ...notifForm, recipient: e.target.value })} 
              placeholder="e.g. All VHW Workers, STF-102"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 mt-1 text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Subject Title</label>
            <input 
              type="text" 
              value={notifForm.title} 
              onChange={(e) => setNotifForm({ ...notifForm, title: e.target.value })} 
              placeholder="e.g. Server Maintenance Notice"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 mt-1 text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Alert Message Body</label>
            <textarea 
              value={notifForm.message} 
              onChange={(e) => setNotifForm({ ...notifForm, message: e.target.value })} 
              required
              rows="3"
              placeholder="Write message details..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 mt-1 text-white focus:outline-none"
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-2.5 rounded-xl transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 inline mr-1" /> Send Alert
          </button>
        </form>
      </div>
    </div>
  );
}
