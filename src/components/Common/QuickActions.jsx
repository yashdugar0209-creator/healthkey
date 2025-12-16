import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions({ actions = [] }) {
  const navigate = useNavigate();

  return (
    <div className="quick-actions">
      {actions.map((a, i) => (
        <button
          key={i}
          className="qa-btn"
          onClick={() => {
            if (a.onClick) a.onClick();
            else if (a.to) navigate(a.to);
          }}
        >
          <div className="qa-icon">{a.icon}</div>
          <div className="qa-label">{a.label}</div>
        </button>
      ))}
    </div>
  );
}
