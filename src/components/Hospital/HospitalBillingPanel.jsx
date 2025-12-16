import React, { useEffect, useState } from 'react';
import * as hospitalService from '../../services/hospitalService';

export default function HospitalBillingPanel() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    hospitalService
      .getBillingSummary()
      .then(setData)
      .catch((e) => setErr(e.message || 'Failed to load billing summary'));
  }, []);

  if (err) {
    return (
      <div className="panel">
        <h3>Billing & Finance</h3>
        <div className="error">{err}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="panel">
        <h3>Billing & Finance</h3>
        <div>Loading...</div>
      </div>
    );
  }

  const {
    todaysRevenue = 0,
    monthlyRevenue = 0,
    pendingInsuranceClaims = 0,
  } = data;

  return (
    <div className="panel">
      <h3>Billing & Finance</h3>
      <div className="hospital-billing-row">
        <div className="hospital-metric">
          <div className="metric-label">Today’s Revenue</div>
          <div className="metric-value">₹{todaysRevenue.toLocaleString()}</div>
        </div>
        <div className="hospital-metric">
          <div className="metric-label">Monthly Revenue</div>
          <div className="metric-value">₹{monthlyRevenue.toLocaleString()}</div>
        </div>
        <div className="hospital-metric">
          <div className="metric-label">Pending Insurance Claims</div>
          <div className="metric-value">{pendingInsuranceClaims}</div>
        </div>
      </div>
    </div>
  );
}
