import React, { useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';

export default function AdminSecurityPanel() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    adminService
      .getSecurityOverview()
      .then(setData)
      .catch((e) => setErr(e.message || 'Failed to load security overview'));
  }, []);

  if (err) {
    return (
      <div className="panel">
        <h3>Security & Compliance</h3>
        <div className="error">{err}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="panel">
        <h3>Security & Compliance</h3>
        <div>Loading...</div>
      </div>
    );
  }

  const {
    status = 'OK',
    failedLogins24h = 0,
    suspiciousActivities24h = 0,
    lastBackupAt,
    encryptionStatus = 'Enabled',
    compliance = [],
    recentAlerts = [],
  } = data;

  return (
    <div className="panel">
      <h3>Security & Compliance</h3>
      <div className="stats-row">
        <div className="stats-card">
          <div className="sc-title">Security status</div>
          <div className="sc-value">{status}</div>
        </div>
        <div className="stats-card">
          <div className="sc-title">Failed logins (24h)</div>
          <div className="sc-value">{failedLogins24h}</div>
        </div>
        <div className="stats-card">
          <div className="sc-title">Suspicious activities (24h)</div>
          <div className="sc-value">{suspiciousActivities24h}</div>
        </div>
      </div>

      <div className="stats-row" style={{ marginTop: 10 }}>
        <div className="stats-card">
          <div className="sc-title">Last backup</div>
          <div className="sc-value">
            {lastBackupAt
              ? new Date(lastBackupAt).toLocaleString()
              : 'Unknown'}
          </div>
        </div>
        <div className="stats-card">
          <div className="sc-title">Data encryption</div>
          <div className="sc-value">{encryptionStatus}</div>
        </div>
        <div className="stats-card">
          <div className="sc-title">Compliance</div>
          <div className="sc-extra">
            {compliance.length === 0
              ? 'No frameworks marked.'
              : compliance.join(', ')}
          </div>
        </div>
      </div>

      <h4 style={{ marginTop: 16, marginBottom: 6 }}>Recent security alerts</h4>
      <ul className="simple-list">
        {recentAlerts.length === 0 && (
          <li>No security alerts in the last 24 hours.</li>
        )}
        {recentAlerts.map((a) => (
          <li key={a.id || a._id}>
            <strong>{a.level || 'Info'}:</strong> {a.message}{' '}
            {a.createdAt && (
              <span className="hint">
                ({new Date(a.createdAt).toLocaleString()})
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
