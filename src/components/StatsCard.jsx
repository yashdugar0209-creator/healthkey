import React from 'react';

export default function StatsCard({ title, value, children }) {
  return (
    <div className="stats-card">
      <div className="sc-title">{title}</div>
      <div className="sc-value">{value}</div>
      <div className="sc-extra">{children}</div>
    </div>
  );
}
