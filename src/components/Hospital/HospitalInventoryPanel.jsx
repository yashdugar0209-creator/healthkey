import React, { useEffect, useState } from 'react';
import * as hospitalService from '../../services/hospitalService';

export default function HospitalInventoryPanel() {
  const [inventory, setInventory] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    setErr('');
    hospitalService
      .getInventory()
      .then((data) => setInventory(data.items || data))
      .catch((e) => setErr(e.message || 'Failed to load inventory'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Inventory Management</h3>
        <button className="btn-ghost" onClick={load}>
          Refresh
        </button>
      </div>

      {loading && <div>Loading inventory...</div>}
      {err && <div className="error">{err}</div>}

      {!loading && !err && (
        <table className="hk-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Type</th>
              <th>Stock</th>
              <th>Reorder Level</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 && (
              <tr>
                <td colSpan={4}>No items listed.</td>
              </tr>
            )}
            {inventory.map((it) => (
              <tr key={it._id || it.id}>
                <td>{it.name}</td>
                <td>{it.category || '-'}</td>
                <td>{it.stock ?? 0}</td>
                <td>{it.reorderLevel ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
