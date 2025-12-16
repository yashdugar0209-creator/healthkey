import React, { useEffect, useState } from 'react';
import * as patientService from '../../services/patientService';

export default function PatientHealthOverview() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    patientService
      .getOverview()
      .then(setData)
      .catch((e) => setErr(e.message || 'Failed to load health overview'));
  }, []);

  if (err) {
    return (
      <div className="panel">
        <h3>Health Overview</h3>
        <div className="error">{err}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="panel">
        <h3>Health Overview</h3>
        <div>Loading...</div>
      </div>
    );
  }

  const {
    healthScore = 72,
    vitals = {},
    alerts = [],
    dailyTip = 'Stay hydrated and walk 20 minutes today.',
  } = data;

  return (
    <div className="panel">
      <h3>Health Overview</h3>

      <div className="health-overview-row">
        <div className="health-score-card">
          <div className="health-score-label">Health Score</div>
          <div className="health-score-value">{healthScore}/100</div>
        </div>

        <div className="vitals-grid">
          <div className="vital-item">
            <div className="vital-label">BP</div>
            <div className="vital-value">{vitals.bp || '120/80'}</div>
          </div>
          <div className="vital-item">
            <div className="vital-label">Sugar</div>
            <div className="vital-value">{vitals.sugar || '95 mg/dL'}</div>
          </div>
          <div className="vital-item">
            <div className="vital-label">Heart rate</div>
            <div className="vital-value">{vitals.heartRate || '78 bpm'}</div>
          </div>
        </div>
      </div>

      <div className="health-extra-row">
        <div className="health-alerts">
          <h4>Recent Alerts</h4>
          {alerts && alerts.length > 0 ? (
            <ul>
              {alerts.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          ) : (
            <p>No recent health alerts.</p>
          )}
        </div>
        <div className="health-tip">
          <h4>Daily Health Tip</h4>
          <p>{dailyTip}</p>
        </div>
      </div>
    </div>
  );
}
