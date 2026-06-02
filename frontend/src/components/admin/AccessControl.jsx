import React from 'react';
import { Shield, Plus } from 'lucide-react';

export default function AccessControl({
  state,
  newUserRole,
  setNewUserRole,
  handleCreateUser,
  handleToggleUserStatus
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* STAFF LIST CARD */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Shield className="w-4 h-4 text-indigo-400" />
          NGO Authorized Credentials & Roles ({state.staff.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[9px] tracking-wider">
                <th className="p-3">Staff ID</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Designation Role</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Status</th>
                <th className="p-3">Access Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {state.staff.map(user => (
                <tr key={user.id} className="hover:bg-slate-850/40">
                  <td className="p-3 font-mono text-[10px]">{user.id}</td>
                  <td className="p-3 font-bold text-slate-200">{user.name}</td>
                  <td className="p-3">
                    <span className={`text-[8.5px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                      user.role === 'Super Admin' ? 'bg-rose-500/10 text-rose-450 border-rose-500/20' :
                      user.role === 'Project Director' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>{user.role}</span>
                  </td>
                  <td className="p-3 text-slate-400">{user.contact}</td>
                  <td className="p-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>{user.status}</span>
                  </td>
                  <td className="p-3">
                    <button 
                      onClick={() => handleToggleUserStatus(user.id)}
                      className={`text-[9.5px] font-black uppercase tracking-widest transition cursor-pointer ${
                        user.status === 'Active' ? 'text-rose-400 hover:text-rose-500' : 'text-emerald-400 hover:text-emerald-500'
                      }`}
                    >
                      {user.status === 'Active' ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE CREDENTIALS FORM */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl h-fit">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-indigo-400" />
          Create Credentials
        </h3>
        <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs text-slate-350">
          <div>
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
            <input 
              type="text" 
              value={newUserRole.name}
              onChange={(e) => setNewUserRole({ ...newUserRole, name: e.target.value })}
              placeholder="e.g. Shobha Nayak" 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 mt-1 text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Designation Role</label>
            <select 
              value={newUserRole.role}
              onChange={(e) => setNewUserRole({ ...newUserRole, role: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 mt-1 text-white focus:outline-none"
            >
              <option value="Village Health Worker">Village Health Worker (VHW)</option>
              <option value="Project Director">Project Director</option>
              <option value="Super Admin">Central Super Admin</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Contact / Email</label>
            <input 
              type="text" 
              value={newUserRole.contact}
              onChange={(e) => setNewUserRole({ ...newUserRole, contact: e.target.value })}
              placeholder="e.g. shobha@ayathana.org" 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 mt-1 text-white focus:outline-none"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
          >
            Deploy Credentials
          </button>
        </form>
      </div>
    </div>
  );
}
