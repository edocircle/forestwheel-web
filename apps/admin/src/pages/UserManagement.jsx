import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function UserManagement({ adminOnly = false }) {
  const { isSuperAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ email: '', fullName: '', role: adminOnly ? 'ADMIN' : 'USER' });
  const [creating, setCreating] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (adminOnly) params.role = 'ADMIN'; // Also includes SUPER_ADMIN from backend
      const res = await api.get('/users', { params });
      let filteredUsers = res.data.users;
      if (adminOnly) {
        filteredUsers = filteredUsers.filter((u) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN');
      }
      setUsers(filteredUsers);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, [page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/users', createForm);
      setShowCreateModal(false);
      setCreateForm({ email: '', fullName: '', role: adminOnly ? 'ADMIN' : 'USER' });
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await api.put(`/users/${user.id}`, { isActive: !user.isActive });
      loadUsers();
    } catch (err) {
      alert('Failed to update user');
    }
  };

  const handleResendActivation = async (id) => {
    try {
      await api.post(`/users/${id}/resend-activation`);
      alert('Activation email resent successfully');
    } catch (err) {
      alert('Failed to resend activation email');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to deactivate user');
    }
  };

  const totalPages = Math.ceil(total / 10);
  const title = adminOnly ? 'Admin Management' : 'User Management';
  const subtitle = adminOnly
    ? 'Manage administrator accounts and permissions.'
    : 'Manage all user accounts and access to the portal.';

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-5xl font-black font-headline tracking-tighter text-on-surface">{title}</h1>
          <p className="text-on-surface-variant text-lg mt-2">{subtitle}</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-8 py-3 rounded-lg bg-primary text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
        >
          + Add {adminOnly ? 'Admin' : 'User'}
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-outline-variant/30">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container">
                <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">User</th>
                <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">Role</th>
                <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">Status</th>
                <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">Joined</th>
                <th className="px-6 py-6 text-right text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {user.fullName?.charAt(0) || '?'}
                      </div>
                      <div>
                        <h3 className="font-headline font-bold text-on-surface">{user.fullName}</h3>
                        <p className="text-xs text-on-surface-variant">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      user.role === 'SUPER_ADMIN' ? 'bg-primary text-white' :
                      user.role === 'ADMIN' ? 'bg-primary/10 text-primary' :
                      'bg-surface-container-highest text-secondary'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors ${
                        user.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-error-container text-on-error-container hover:bg-error/10'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-6 text-sm text-on-surface-variant">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {!user.isActive && (
                        <button onClick={() => handleResendActivation(user.id)} className="p-2 rounded-lg hover:bg-surface-container-highest transition-colors text-primary" title="Resend Activation">
                          <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                      )}
                      {isSuperAdmin && user.role !== 'SUPER_ADMIN' && (
                        <button onClick={() => handleDelete(user.id)} className="p-2 rounded-lg hover:bg-error-container/20 transition-colors text-error" title="Deactivate">
                          <span className="material-symbols-outlined text-sm">person_off</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-secondary">No users found.</td></tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="px-8 py-6 bg-surface-container flex items-center justify-between">
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">
            {users.length} of {total} users
          </p>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 bg-surface-container-highest rounded-md text-xs font-bold disabled:opacity-50">Prev</button>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="px-4 py-2 bg-primary text-white rounded-md text-xs font-bold disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-black font-headline tracking-tight mb-6">
                Add {adminOnly ? 'Admin' : 'User'}
              </h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-secondary mb-2">Full Name</label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20"
                    value={createForm.fullName}
                    onChange={(e) => setCreateForm((f) => ({ ...f, fullName: e.target.value }))}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-secondary mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20"
                    value={createForm.email}
                    onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    placeholder="john@forestwheel.com"
                  />
                </div>
                {isSuperAdmin && (
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-secondary mb-2">Role</label>
                    <select
                      className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20"
                      value={createForm.role}
                      onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value }))}
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </div>
                )}
                <p className="text-xs text-on-surface-variant bg-surface-container-low p-3 rounded-lg">
                  <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
                  An activation email will be sent to the user. They must click the link to set their password.
                </p>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-secondary hover:bg-surface-container transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={creating} className="flex-1 py-3 rounded-lg bg-primary text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 disabled:opacity-50">
                    {creating ? 'Creating...' : 'Create & Send Invite'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
