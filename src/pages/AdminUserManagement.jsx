import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminUserManagement = () => {
  const { allUsers, updateUserStatus, deleteUser, createUser, user: currentUser } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '' });
  const [addError, setAddError] = useState('');

  // Guard: Only master admin can see this page
  if (currentUser?.role !== 'master_admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
        <span className="material-symbols-outlined text-6xl text-red-100">lock</span>
        <h2 className="text-2xl font-black text-slate-800">Access Denied</h2>
        <p className="text-slate-500 font-bold italic">Only the Master Admin can manage user accounts.</p>
      </div>
    );
  }

  const pendingUsers = allUsers.filter(u => u.status === 'pending');
  const approvedUsers = allUsers.filter(u => u.status === 'approved' && u.role !== 'master_admin');
  const rejectedUsers = allUsers.filter(u => u.status === 'rejected');

  const UserTable = ({ users, title, type }) => (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-10">
      <div className="px-8 py-5 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{title} ({users.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50 dark:border-slate-800">
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Requested At</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {users.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-8 py-10 text-center text-slate-400 font-bold italic text-sm">No users in this category.</td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u.email} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
                      <div>
                        <p className="font-black text-slate-800 dark:text-slate-100 text-sm">{u.name}</p>
                        <p className="text-[10px] font-bold text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-[11px] font-bold text-slate-500">{u.requestedAt ? new Date(u.requestedAt).toLocaleDateString() : 'N/A'}</span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {type === 'pending' && (
                        <>
                          <button 
                            onClick={() => updateUserStatus(u.email, 'approved')}
                            className="px-4 py-2 bg-[#0a6c75] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#085a62] transition-all"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => updateUserStatus(u.email, 'rejected')}
                            className="px-4 py-2 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-all"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {type === 'approved' && (
                        <button 
                          onClick={() => updateUserStatus(u.email, 'rejected')}
                          className="px-4 py-2 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-all"
                        >
                          Revoke Access
                        </button>
                      )}
                      {type === 'rejected' && (
                        <button 
                          onClick={() => updateUserStatus(u.email, 'approved')}
                          className="px-4 py-2 bg-teal-50 text-[#0a6c75] text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-teal-100 transition-all"
                        >
                          Restore
                        </button>
                      )}
                      <button 
                        onClick={() => { if(window.confirm('Permanent delete?')) deleteUser(u.email); }}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const handleAddUser = (e) => {
    e.preventDefault();
    setAddError('');
    const res = createUser(newUserData.name, newUserData.email, newUserData.password);
    if (res.success) {
      setShowAddModal(false);
      setNewUserData({ name: '', email: '', password: '' });
    } else {
      setAddError(res.message);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1200px] mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Admin User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold italic">Review and manage access for administrative staff.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#0a6c75] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-teal-900/10 hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Add New Staff
        </button>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">Create Staff Account</h2>
              <p className="text-slate-500 text-sm font-bold italic">This user will have immediate approved access.</p>
            </div>

            <form onSubmit={handleAddUser} className="space-y-5">
              {addError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-black text-center animate-pulse">
                  {addError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newUserData.name}
                  onChange={e => setNewUserData({...newUserData, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#0a6c75]/20"
                  placeholder="e.g. Rahul Singh"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={newUserData.email}
                  onChange={e => setNewUserData({...newUserData, email: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#0a6c75]/20"
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Temporary Password</label>
                <input 
                  type="password" 
                  required
                  value={newUserData.password}
                  onChange={e => setNewUserData({...newUserData, password: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#0a6c75]/20"
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#0a6c75] text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-teal-900/10 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}

      <UserTable users={pendingUsers} title="Pending Approvals" type="pending" />
      <UserTable users={approvedUsers} title="Approved Staff" type="approved" />
      <UserTable users={rejectedUsers} title="Rejected Access" type="rejected" />
    </div>
  );
};

export default AdminUserManagement;
