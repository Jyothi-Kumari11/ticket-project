import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { exportUsersToCSV } from '../../utils/exportHelper';
import { Search, Plus, Download, MoreVertical, UserCheck, UserX, X } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Jyothi Kumari', email: 'jyothi@example.com', role: 'user', status: 'Active', tickets: 9, createdAt: '01 Jan 2026' },
  { id: 2, name: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'user', status: 'Active', tickets: 5, createdAt: '10 Feb 2026' },
  { id: 3, name: 'Priya Sharma', email: 'priya@example.com', role: 'user', status: 'Active', tickets: 3, createdAt: '15 Mar 2026' },
  { id: 4, name: 'Arun Verma', email: 'arun@example.com', role: 'admin', status: 'Active', tickets: 0, createdAt: '01 Jan 2026' },
  { id: 5, name: 'Meena Patel', email: 'meena@example.com', role: 'user', status: 'Inactive', tickets: 2, createdAt: '20 Apr 2026' },
  { id: 6, name: 'Kumar Raj', email: 'kumar@example.com', role: 'user', status: 'Active', tickets: 7, createdAt: '05 May 2026' },
  { id: 7, name: 'Sara Nair', email: 'sara@example.com', role: 'user', status: 'Active', tickets: 4, createdAt: '12 Jun 2026' },
  { id: 8, name: 'Ram Iyer', email: 'ram@example.com', role: 'admin', status: 'Active', tickets: 0, createdAt: '01 Jan 2026' },
];

const UserManagement = () => {
  const { users } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [localUsers, setLocalUsers] = useState(mockUsers);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user', status: 'Active' });

  const allUsers = (users && users.length > 0) ? users : localUsers;

  useEffect(() => {
    if (users && users.length > 0) {
      setLocalUsers(users);
    }
  }, [users]);

  const filtered = allUsers.filter(u => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    const matchRole = filterRole === 'All' || u.role === filterRole;
    const matchStatus = filterStatus === 'All' || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const handleExportCSV = () => {
    exportUsersToCSV(filtered, 'resolvedesk_users.csv');
  };

  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    const createdUser = {
      id: Date.now(),
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role,
      status: newUser.status,
      tickets: 0,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setLocalUsers(prev => [createdUser, ...prev]);
    setNewUser({ name: '', email: '', role: 'user', status: 'Active' });
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Users</h1>
          <p>Manage customer and admin accounts.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={14} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Add User
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="filters-bar">
          <div className="filter-search">
            <Search size={14} color="#9CA3AF" />
            <input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-select">
            <select value={filterRole} onChange={e => setFilterRole(e.target.value)}>
              <option value="All">All Roles</option>
              <option value="user">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="filter-select">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <table className="ds-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Tickets</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id || u.email}>
                <td>
                  <div className="user-avatar-cell">
                    <div className="user-avatar-circle" style={{ background: u.role === 'admin' ? '#F5F3FF' : '#EEF2FF', color: u.role === 'admin' ? '#7C3AED' : '#4F46E5' }}>
                      {(u.name || 'U').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <div className="user-name">{u.name}</div>
                      <div className="user-email">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-role-admin' : 'badge-role-user'}`}>
                    {u.role === 'admin' ? 'Admin' : 'Customer'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${u.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                    {u.status === 'Active' ? <UserCheck size={11} /> : <UserX size={11} />}
                    {u.status || 'Active'}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: '#374151' }}>{u.tickets ?? 0}</span>
                </td>
                <td>
                  <span className="table-date">{u.createdAt || 'Jan 2026'}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-ghost btn-sm">View</button>
                    <button className="btn btn-icon btn-secondary btn-sm"><MoreVertical size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination-bar">
          <span className="pagination-info">
            Showing {filtered.length} of {allUsers.length} users
          </span>
        </div>
      </div>

      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setShowAddModal(false)}>
          <div style={{
            width: '420px', background: '#fff', borderRadius: '16px', padding: '22px',
            boxShadow: '0 24px 60px rgba(15,23,42,0.18)', border: '1px solid #E5E7EB'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>Add User</h3>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>Full Name</label>
                <input
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter full name"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email address"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>Role</label>
                  <select
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '14px' }}
                  >
                    <option value="user">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>Status</label>
                  <select
                    value={newUser.status}
                    onChange={e => setNewUser({ ...newUser, status: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '14px' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddUser}>
                  Save User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
