import React, { useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';

export default function AdminApprovalQueue() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const load = () => {
    setLoading(true);
    setErr('');
    adminService
      .getPendingApprovals()
      .then((data) => setItems(data.items || data))
      .catch((e) => setErr(e.message || 'Failed to load approvals'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (item) => {
    try {
      await adminService.approveItem(item._id || item.id);
      load();
    } catch (e) {
      alert(e.message || 'Failed to approve');
    }
  };

  const handleReject = async (item) => {
    const reason = window.prompt('Reason for rejection?');
    try {
      await adminService.rejectItem(item._id || item.id, { reason });
      load();
    } catch (e) {
      alert(e.message || 'Failed to reject');
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Pending Approvals</h3>
        <button className="btn-ghost" onClick={load}>
          Refresh
        </button>
      </div>
      {loading && <div>Loading approvals...</div>}
      {err && <div className="error">{err}</div>}
      {!loading && !err && (
        <table className="hk-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Submitted On</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={4}>No pending approvals</td>
              </tr>
            )}
            {items.map((it) => (
              <tr key={it._id || it.id}>
                <td>{it.type}</td>
                <td>{it.name}</td>
                <td>{it.createdAt ? new Date(it.createdAt).toLocaleString() : '-'}</td>
                <td>
                  <button className="btn-small" onClick={() => handleApprove(it)}>
                    Approve
                  </button>
                  <button className="btn-small btn-danger" onClick={() => handleReject(it)}>
                    Reject
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
