import React, { useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';

export default function AdminHospitalManagement() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const load = () => {
    setLoading(true);
    setErr('');
    adminService
      .getHospitals()
      .then((data) => setHospitals(data.hospitals || data))
      .catch((e) => setErr(e.message || 'Failed to load hospitals'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const toggleVerify = async (h) => {
    try {
      await adminService.updateHospitalStatus(h._id || h.id, {
        verified: !h.verified,
      });
      load();
    } catch (e) {
      alert(e.message || 'Failed to update hospital');
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Hospital Management</h3>
        <button className="btn-ghost" onClick={load}>
          Refresh
        </button>
      </div>
      {loading && <div>Loading hospitals...</div>}
      {err && <div className="error">{err}</div>}
      {!loading && !err && (
        <table className="hk-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Beds</th>
              <th>Verified</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {hospitals.length === 0 && (
              <tr>
                <td colSpan={5}>No hospitals found</td>
              </tr>
            )}
            {hospitals.map((h) => (
              <tr key={h._id || h.id}>
                <td>{h.name}</td>
                <td>{h.city || h.location?.city || '-'}</td>
                <td>{h.bedCount ?? '-'}</td>
                <td>{h.verified ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn-small" onClick={() => toggleVerify(h)}>
                    {h.verified ? 'Unverify' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
