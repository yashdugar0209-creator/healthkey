import React, { useEffect, useState } from 'react';
import * as hospitalService from '../../services/hospitalService';

export default function HospitalQueueManagement() {
  const [queues, setQueues] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    setErr('');
    hospitalService
      .getQueues()
      .then((data) => setQueues(data.queues || data))
      .catch((e) => setErr(e.message || 'Failed to load queues'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Queue Management</h3>
        <button className="btn-ghost" onClick={load}>
          Refresh
        </button>
      </div>

      {loading && <div>Loading queues...</div>}
      {err && <div className="error">{err}</div>}

      {!loading && !err && (
        <div className="queue-summary-grid">
          {queues.length === 0 && <div>No active queues.</div>}
          {queues.map((q) => (
            <div className="queue-chip" key={q.department || q.id}>
              <div className="queue-dept">{q.department}</div>
              <div className="queue-count">{q.waitingCount ?? 0} waiting</div>
              <div className="queue-meta">
                Avg wait: {q.avgWaitMinutes ?? '-'} mins
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
