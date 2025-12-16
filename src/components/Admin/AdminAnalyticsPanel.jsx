import React, { useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';

export default function AdminAnalyticsPanel() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    adminService
      .getAnalytics()
      .then(setData)
      .catch((e) => setErr(e.message || 'Failed to load analytics'));
  }, []);

  if (err) {
    return (
      <div className="panel">
        <h3>System Analytics</h3>
        <div className="error">{err}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="panel">
        <h3>System Analytics</h3>
        <div>Loading...</div>
      </div>
    );
  }

  const {
    dailyActiveUsers = 0,
    monthlyActiveUsers = 0,
    newUsersToday = 0,
    hospitalsCount = 0,
    revenueToday = 0,
    revenueThisMonth = 0,
    topHospitals = [],
  } = data;

  return (
    <div className="panel">
      <h3>System Analytics</h3>
      <div className="stats-row">
        <div className="stats-card">
          <div className="sc-title">Daily active users</div>
          <div className="sc-value">{dailyActiveUsers}</div>
        </div>
        <div className="stats-card">
          <div className="sc-title">Monthly active users</div>
          <div className="sc-value">{monthlyActiveUsers}</div>
        </div>
        <div className="stats-card">
          <div className="sc-title">New users today</div>
          <div className="sc-value">{newUsersToday}</div>
        </div>
      </div>

      <div className="stats-row" style={{ marginTop: 10 }}>
        <div className="stats-card">
          <div className="sc-title">Hospitals onboarded</div>
          <div className="sc-value">{hospitalsCount}</div>
        </div>
        <div className="stats-card">
          <div className="sc-title">Revenue today</div>
          <div className="sc-value">₹{(revenueToday || 0).toLocaleString()}</div>
        </div>
        <div className="stats-card">
          <div className="sc-title">Revenue this month</div>
          <div className="sc-value">
            ₹{(revenueThisMonth || 0).toLocaleString()}
          </div>
        </div>
      </div>

      <h4 style={{ marginTop: 16, marginBottom: 6 }}>Top hospitals (by activity)</h4>
      <table className="hk-table">
        <thead>
          <tr>
            <th>Hospital</th>
            <th>City</th>
            <th>Patients this month</th>
          </tr>
        </thead>
        <tbody>
          {topHospitals.length === 0 && (
            <tr>
              <td colSpan={3}>No data available.</td>
            </tr>
          )}
          {topHospitals.map((h) => (
            <tr key={h.id || h._id || h.name}>
              <td>{h.name}</td>
              <td>{h.city || '-'}</td>
              <td>{h.patientsThisMonth ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
