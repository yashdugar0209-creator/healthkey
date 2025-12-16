import React, { useEffect, useState } from 'react';
import * as hospitalService from '../../services/hospitalService';

export default function HospitalDepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    setErr('');
    hospitalService
      .getDepartments()
      .then((data) => setDepartments(data.departments || data))
      .catch((e) => setErr(e.message || 'Failed to load departments'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Department Management</h3>
        <button className="btn-ghost" onClick={load}>
          Refresh
        </button>
      </div>

      {loading && <div>Loading departments...</div>}
      {err && <div className="error">{err}</div>}

      {!loading && !err && (
        <table className="hk-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Head</th>
              <th>Staff</th>
              <th>Beds</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 && (
              <tr>
                <td colSpan={4}>No departments defined.</td>
              </tr>
            )}
            {departments.map((d) => (
              <tr key={d._id || d.id || d.name}>
                <td>{d.name}</td>
                <td>{d.headName || '-'}</td>
                <td>{d.staffCount ?? '-'}</td>
                <td>{d.bedCount ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
