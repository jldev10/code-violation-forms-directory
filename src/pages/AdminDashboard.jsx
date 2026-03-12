import React, { useState } from 'react';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Users, ShieldCheck, Pencil, Trash2, Plus, FileText, LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = { first_name: '', last_name: '', email: '', admin: '0', password: '' };

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: users = [], isLoading, error: fetchError } = useQuery({
    queryKey: ['userProfiles'],
    queryFn: () => api.get('/users'),
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/users', data),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] }); 
      toast.success('User created successfully');
      closeModal(); 
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create user');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/users/${id}`, data),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] }); 
      toast.success('User updated successfully');
      closeModal(); 
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update user');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] }); 
      toast.success('User deleted successfully');
      setDeleteTarget(null); 
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete user');
    }
  });

  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.admin === 1).length;
  const totalRegular = users.filter(u => u.admin === 0).length;

  const openAdd = () => { setForm(emptyForm); setEditingUser(null); setShowModal(true); };
  const openEdit = (user) => {
    setForm({ first_name: user.first_name || '', last_name: user.last_name || '', email: user.email || '', admin: String(user.admin ?? 0), password: '' });
    setEditingUser(user);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingUser(null); setForm(emptyForm); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, admin: parseInt(form.admin) };
    if (!payload.password) {
      delete payload.password; // Don't send empty passwords on update
    }
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleLogout = () => {
    logout(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm">Code Violation</span>
              <span className="ml-1 text-xs text-emerald-600 font-medium">Admin Dashboard</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-600">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <MetricCard icon={<Users className="w-6 h-6 text-emerald-600" />} label="Total Users" value={totalUsers} color="emerald" />
          <MetricCard icon={<ShieldCheck className="w-6 h-6 text-violet-600" />} label="Admins" value={totalAdmins} color="violet" />
          <MetricCard icon={<Users className="w-6 h-6 text-blue-600" />} label="Regular Users" value={totalRegular} color="blue" />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-lg">Users</h2>
            <Button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add User
            </Button>
          </div>

          {isLoading ? (
            <div className="p-10 text-center text-slate-400">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-left">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{user.first_name} {user.last_name}</td>
                      <td className="px-6 py-4 text-slate-600">{user.email}</td>
                      <td className="px-6 py-4">
                        {user.admin === 1
                          ? <Badge className="bg-violet-100 text-violet-700 border-0">Admin</Badge>
                          : <Badge className="bg-blue-100 text-blue-700 border-0">User</Badge>
                        }
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openEdit(user)} className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors mr-1">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(user)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      <Dialog open={showModal} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="First name" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
              <Input placeholder="Last name" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
            </div>
            <Input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <Input type="password" placeholder={editingUser ? "New Password (leave blank to keep current)" : "Password"} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!editingUser} />
            <Select value={form.admin} onValueChange={v => setForm({ ...form, admin: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">User</SelectItem>
                <SelectItem value="1">Admin</SelectItem>
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal} disabled={isMutating}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isMutating}>
                {isMutating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingUser ? 'Save Changes' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p className="text-slate-600 text-sm mt-1">
            Are you sure you want to delete <strong>{deleteTarget?.first_name} {deleteTarget?.last_name}</strong>? This cannot be undone.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleteMutation.isPending}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => deleteMutation.mutate(deleteTarget.id)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MetricCard({ icon, label, value, color }) {
  const colors = {
    emerald: 'bg-emerald-50 border-emerald-100',
    violet: 'bg-violet-50 border-violet-100',
    blue: 'bg-blue-50 border-blue-100',
  };
  return (
    <div className={`rounded-2xl border p-6 flex items-center gap-4 ${colors[color]}`}>
      <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}