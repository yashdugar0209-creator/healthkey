import React from "react";

const ADMISSION_FORECAST = [
  { label: "Today", value: 120, baseline: 110 },
  { label: "Tomorrow", value: 132, baseline: 112 },
  { label: "Next 7 days (avg.)", value: 140, baseline: 115 },
];

const BED_FORECAST = [
  { label: "ICU occupancy (tomorrow)", value: "82%" },
  { label: "Ward occupancy (tomorrow)", value: "76%" },
];

export default function HospitalPredictiveAnalyticsPanel() {
  const maxAdmissions = Math.max(...ADMISSION_FORECAST.map((r) => r.value));
  const width = (v) => `${Math.round((v / maxAdmissions) * 100)}%`;

  return (
    <div className="panel">
      <h3>AI Predictive Analytics (demo)</h3>

      <p className="hint" style={{ marginBottom: 8 }}>
        Forecasts are simulated for UI. When connected to real data, this can
        predict tomorrow&apos;s patient inflow and bed usage.
      </p>

      <div className="predict-group">
        <h4>OPD / admission forecast</h4>
        <div className="predict-list">
          {ADMISSION_FORECAST.map((row) => (
            <div key={row.label} className="predict-item">
              <div className="predict-row-header">
                <span>{row.label}</span>
                <span className="predict-value">{row.value} patients</span>
              </div>
              <div className="predict-bar">
                <div
                  className="predict-bar-fill"
                  style={{ width: width(row.value) }}
                />
              </div>
              <div className="predict-baseline">
                Baseline: {row.baseline} patients
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="predict-group">
        <h4>Bed occupancy forecast</h4>
        <div className="predict-badges">
          {BED_FORECAST.map((b) => (
            <div key={b.label} className="predict-badge">
              <div className="predict-badge-label">{b.label}</div>
              <div className="predict-badge-value">{b.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="predict-ai-note">
        <span className="predict-ai-icon">🤖</span>
        <p>
          AI insight (demo): Tomorrow&apos;s OPD is expected to be{" "}
          <strong>~10% higher</strong> than today. Consider adding one extra
          doctor slot in <strong>Medicine</strong> between 10–12 AM.
        </p>
      </div>
    </div>
  );
}
