import React, { useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const load = () => {
    setLoading(true);
    setErr('');
    adminService
      .getUsers(filterRole ? { role: filterRole } : {})
      .then((data) => setUsers(data.users || data))
      .catch((e) => setErr(e.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filterRole]);

  const toggleActive = async (user) => {
    try {
      await adminService.updateUserStatus(user._id || user.id, {
        active: !user.active,
      });
      load();
    } catch (e) {
      alert(e.message || 'Failed to update user');
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>User Management</h3>
        <div className="panel-actions">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All roles</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="hospital">Hospital</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn-ghost" onClick={load}>
            Refresh
          </button>
        </div>
      </div>
      {loading && <div>Loading users...</div>}
      {err && <div className="error">{err}</div>}
      {!loading && !err && (
        <table className="hk-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Active</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={6}>No users found</td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u._id || u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isVerified ? 'Yes' : 'No'}</td>
                <td>{u.active ? 'Active' : 'Disabled'}</td>
                <td>
                  <button className="btn-small" onClick={() => toggleActive(u)}>
                    {u.active ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
