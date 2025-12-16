import React, { useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';

export default function AdminSystemOverview() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService
      .getSystemOverview()
      .then(setStats)
      .catch((e) => {
        setError(e.message || 'Failed to load system overview');
      });
  }, []);

  if (error) return <div className="panel error">{error}</div>;

  if (!stats) return <div className="panel">Loading system overview...</div>;

  return (
    <div className="panel">
      <h3>System Overview</h3>
      <div className="stats-row">
        <div className="stats-card">
          <div className="sc-title">Active Users</div>
          <div className="sc-value">{stats.users ?? '—'}</div>
        </div>
        <div className="stats-card">
          <div className="sc-title">Uptime (s)</div>
          <div className="sc-value">{stats.uptime ? Math.floor(stats.uptime) : '—'}</div>
        </div>
        <div className="stats-card">
          <div className="sc-title">Server Load</div>
          <div className="sc-value">{stats.load || 'OK'}</div>
        </div>
      </div>
    </div>
  );
}
