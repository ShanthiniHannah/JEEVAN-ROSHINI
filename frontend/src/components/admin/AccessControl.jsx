import React from 'react';
import { Shield, Plus, Key } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

/**
 * AccessControl — Admin Portal sub-view.
 * NGO staff credential and permission deployment board.
 */
export default function AccessControl({
  state,
  newUserRole,
  setNewUserRole,
  handleCreateUser,
  handleToggleUserStatus
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      {/* STAFF LIST CARD */}
      <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <Shield className="w-4 h-4 text-indigo-500" />
          NGO Authorized Credentials &amp; Roles ({state.staff.length})
        </h3>

        <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-inner)] border-b border-[var(--border-color)] text-[var(--text-secondary)] font-extrabold uppercase text-[9px] tracking-wider">
                <th className="p-3">Staff ID</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Designation Role</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Status</th>
                <th className="p-3">Access Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {state.staff.map(user => (
                <tr key={user.id} className="hover:bg-[var(--bg-inner)] transition">
                  <td className="p-3 font-mono text-[10px] text-[var(--text-secondary)] font-bold">{user.id}</td>
                  <td className="p-3 font-black text-[var(--text-primary)]">{user.name}</td>
                  <td className="p-3">
                    <StatusBadge status={user.role} />
                  </td>
                  <td className="p-3 text-[var(--text-secondary)] font-medium">{user.contact}</td>
                  <td className="p-3">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleUserStatus(user.id)}
                      className={`text-[9px] font-black uppercase tracking-widest transition cursor-pointer ${
                        user.status === 'Active' ? 'text-rose-500 hover:text-rose-600' : 'text-emerald-500 hover:text-emerald-600'
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
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl h-fit shadow-sm space-y-4">
        <h3 className="text-sm font-black text-[var(--text-primary)] pb-2 border-b border-[var(--border-color)] flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-indigo-500" />
          Create Credentials
        </h3>

        <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={newUserRole.name}
              onChange={(e) => setNewUserRole({ ...newUserRole, name: e.target.value })}
              placeholder="e.g. Shobha Nayak"
              required
              className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-indigo-500 placeholder:text-[var(--text-secondary)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Designation Role</label>
            <select
              value={newUserRole.role}
              onChange={(e) => setNewUserRole({ ...newUserRole, role: e.target.value })}
              className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
            >
              <option value="Village Health Worker">Village Health Worker (VHW)</option>
              <option value="Project Director">Project Director</option>
              <option value="Super Admin">Central Super Admin</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Contact / Email</label>
            <input
              type="text"
              value={newUserRole.contact}
              onChange={(e) => setNewUserRole({ ...newUserRole, contact: e.target.value })}
              placeholder="e.g. shobha@ayathana.org"
              required
              className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-indigo-500 placeholder:text-[var(--text-secondary)]"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
          >
            <Key className="w-4 h-4" /> Deploy Credentials
          </button>
        </form>
      </div>
    </div>
  );
}
