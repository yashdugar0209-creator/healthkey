import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ title }) {
  const { user, logout } = useAuth();

  return (
    <header className="hk-header">
      <div className="hk-header-left">
        <h1>{title}</h1>
      </div>
      <div className="hk-header-right">
        {user && (
          <span className="hk-user-badge">
            {user.name || 'Admin'} • {user.role}
          </span>
        )}
        <button className="btn-ghost" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}
