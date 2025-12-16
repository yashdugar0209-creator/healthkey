import React from "react";

const USER_FORECAST = [
  { label: "Today", value: 1204, baseline: 1100 },
  { label: "Tomorrow", value: 1280, baseline: 1120 },
  { label: "Next 7 days (avg.)", value: 1350, baseline: 1150 },
];

const HOSPITAL_FORECAST = [
  { label: "Onboarded now", value: 32 },
  { label: "Predicted in 30 days", value: 39 },
];

export default function AdminPredictiveAnalyticsPanel() {
  const maxUsers = Math.max(...USER_FORECAST.map((r) => r.value));

  const userWidth = (v) => `${Math.round((v / maxUsers) * 100)}%`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <h2 className="text-sm font-semibold text-slate-800 mb-1">
        AI predictive analytics (demo)
      </h2>
      <p className="text-xs text-slate-500 mb-3">
        Forecasts are generated from sample data. When you connect a real AI
        service, feed it usage + hospital metrics and render results here.
      </p>

      {/* Users forecast */}
      <div className="mb-4">
        <p className="text-xs font-medium text-slate-600 mb-1">
          Active users forecast
        </p>
        <div className="space-y-2 text-xs">
          {USER_FORECAST.map((row) => (
            <div key={row.label}>
              <div className="flex justify-between mb-0.5">
                <span className="text-slate-600">{row.label}</span>
                <span className="font-semibold text-slate-900">
                  {row.value.toLocaleString()}
                </span>
              </div>
              <div className="predict-bar">
                <div
                  className="predict-bar-fill"
                  style={{ width: userWidth(row.value) }}
                />
              </div>
              <div className="text-[11px] text-slate-400">
                Baseline: {row.baseline.toLocaleString()} users
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hospitals forecast */}
      <div className="mb-3">
        <p className="text-xs font-medium text-slate-600 mb-1">
          Hospitals onboarding forecast
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {HOSPITAL_FORECAST.map((h) => (
            <div
              key={h.label}
              className="border border-slate-100 rounded-lg px-3 py-2"
            >
              <p className="text-slate-500">{h.label}</p>
              <p className="text-lg font-semibold text-slate-800 mt-1">
                {h.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI explanation */}
      <div className="border border-sky-100 bg-sky-50/60 rounded-lg px-3 py-2 text-[11px] text-slate-600 flex gap-2">
        <span className="mt-0.5 text-base">🤖</span>
        <p>
          AI insight (demo): Based on current growth, platform usage is expected
          to grow ~<span className="font-semibold">12–15%</span> in the next
          month. Focus on onboarding hospitals in{" "}
          <span className="font-semibold">Ahmedabad & Gandhinagar</span> to
          maximise impact.
        </p>
      </div>
    </div>
  );
}
