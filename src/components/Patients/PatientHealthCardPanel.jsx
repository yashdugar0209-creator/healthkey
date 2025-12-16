import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as nfcService from '../../services/nfcService';

export default function PatientHealthCardPanel() {
  const [card, setCard] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setErr('');
    nfcService
      .getCard()
      .then((data) => setCard(data.card || data))
      .catch((e) => setErr(e.message || 'Failed to load health card'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Health Card</h3>
        <div className="panel-actions">
          <button className="btn-ghost" onClick={() => navigate('/patient/card')}>
            Open card
          </button>
        </div>
      </div>

      {loading && <div>Loading health card...</div>}
      {err && <div className="error">{err}</div>}

      {!loading && !err && (
        <>
          {card ? (
            <div className="card-mini">
              <div className="card-mini-id">Card ID: {card.cardId}</div>
              <div className="card-mini-status">
                Status:{' '}
                <span className={card.lostReported ? 'badge-danger' : 'badge-ok'}>
                  {card.lostReported ? 'Reported lost' : 'Active'}
                </span>
              </div>
              <div className="card-mini-meta">
                Last used:{' '}
                {card.lastUsedAt
                  ? new Date(card.lastUsedAt).toLocaleString()
                  : '—'}
              </div>
            </div>
          ) : (
            <p>No card linked yet. Contact hospital to issue an NFC health card.</p>
          )}
        </>
      )}
    </div>
  );
}
