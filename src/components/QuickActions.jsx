import React from 'react';

/**
 * quickActions: [{label, icon, onClick or href}]
 */
export default function QuickActions({ actions = [] }) {
  return (
    <div className="quick-actions">
      {actions.map((a, i) => (
        <button key={i} className="qa-btn" onClick={a.onClick || (()=> a.href && (window.location = a.href))}>
          <div className="qa-icon">{a.icon}</div>
          <div className="qa-label">{a.label}</div>
        </button>
      ))}
    </div>
  );
}
