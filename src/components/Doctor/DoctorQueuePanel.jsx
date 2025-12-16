import React, { useEffect, useState } from 'react';
import * as doctorService from '../../services/doctorService';

export default function DoctorQueuePanel() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [current, setCurrent] = useState(null);

  const load = () => {
    setLoading(true);
    setErr('');
    doctorService
      .getQueue()
      .then((data) => {
        const list = data.queue || data;
        setQueue(list);
        setCurrent(list.find((x) => x.status === 'in_consultation') || null);
      })
      .catch((e) => setErr(e.message || 'Failed to load queue'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const callNext = () => {
    if (!queue.length) return;
    const next = queue[0];
    setCurrent(next);
    // In real app, send to backend: /api/doctor/queue/call-next
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Today's Patient Queue</h3>
        <div className="panel-actions">
          <button className="btn-ghost" onClick={callNext}>Call next</button>
          <button className="btn-ghost" onClick={load}>Refresh</button>
        </div>
      </div>

      {loading && <div>Loading queue...</div>}
      {err && <div className="error">{err}</div>}

      {!loading && !err && (
        <>
          {current && (
            <div className="queue-current">
              <div className="queue-label">In consultation:</div>
              <div className="queue-name">
                {current.name} • {current.chiefComplaint || '—'}
              </div>
            </div>
          )}

          <ul className="simple-list">
            {queue.length === 0 && <li>No patients in queue.</li>}
            {queue.map((p, idx) => (
              <li key={p._id || p.id || idx}>
                <strong>{p.name}</strong> ({p.priority || 'Normal'})<br />
                Token #{p.token || idx + 1} •{' '}
                {p.scheduledTime ? new Date(p.scheduledTime).toLocaleTimeString() : 'Walk-in'}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
