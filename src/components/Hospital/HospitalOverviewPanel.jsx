import React, { useEffect, useState } from 'react';
import * as hospitalService from '../../services/hospitalService';

export default function HospitalOverviewPanel() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    hospitalService
      .getOverview()
      .then(setData)
      .catch((e) => setErr(e.message || 'Failed to load hospital overview'));
  }, []);

  if (err) {
    return (
      <div className="panel">
        <h3>Hospital Overview</h3>
        <div className="error">{err}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="panel">
        <h3>Hospital Overview</h3>
        <div>Loading...</div>
      </div>
    );
  }

  const {
    bedOccupancy = 72,
    totalBeds = 100,
    admissionsToday = 18,
    dischargesToday = 9,
    emergencyStatus = 'Normal',
  } = data;

  const availableBeds = totalBeds - Math.round((bedOccupancy / 100) * totalBeds);

  return (
    <div className="panel">
      <h3>Hospital Overview</h3>
      <div className="hospital-overview-row">
        <div className="hospital-metric">
          <div className="metric-label">Bed Occupancy</div>
          <div className="metric-value">{bedOccupancy}%</div>
          <div className="occupancy-bar">
            <div
              className="occupancy-fill"
              style={{ width: `${Math.min(bedOccupancy, 100)}%` }}
            />
          </div>
          <div className="metric-sub">
            {availableBeds} beds available out of {totalBeds}
          </div>
        </div>

        <div className="hospital-metric">
          <div className="metric-label">Admissions Today</div>
          <div className="metric-value">{admissionsToday}</div>
          <div className="metric-sub">Discharges: {dischargesToday}</div>
        </div>

        <div className="hospital-metric">
          <div className="metric-label">Emergency Status</div>
          <div className="metric-badge">{emergencyStatus}</div>
        </div>
      </div>
    </div>
  );
}
