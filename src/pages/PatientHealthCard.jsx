import React, { useEffect, useState } from "react";
import Header from "../components/Common/Header";
import * as nfcService from "../services/nfcService";
import { QRCodeCanvas } from "qrcode.react";

export default function PatientHealthCard() {
  const [card, setCard] = useState(null);
  const [usage, setUsage] = useState([]);
  const [err, setErr] = useState("");
  const [reportMsg, setReportMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [reporting, setReporting] = useState(false);

  const load = () => {
    setLoading(true);
    setErr("");
    Promise.all([nfcService.getCard(), nfcService.getUsageHistory()])
      .then(([cardResp, usageResp]) => {
        setCard(cardResp.card || cardResp);
        setUsage(usageResp.history || usageResp);
      })
      .catch((e) => setErr(e.message || "Failed to load health card"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleReportLost = async () => {
    if (!card) return;
    const ok = window.confirm(
      "Report this card as lost? It will be marked inactive."
    );
    if (!ok) return;

    setReporting(true);
    setReportMsg("");

    try {
      await nfcService.reportLost();
      setReportMsg(
        "Card marked as lost. Please contact hospital for a new card."
      );
      load();
    } catch (e) {
      setReportMsg(e.message || "Failed to report card lost");
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="page">
      <Header title="My Health Card" />
      <main className="hk-container">
        {loading && <div>Loading health card...</div>}
        {err && <div className="error">{err}</div>}

        {!loading && !err && !card && (
          <div className="panel">
            <h3>No card found</h3>
            <p>
              You don’t have an active HealthKey NFC card yet. Visit a partner
              hospital to issue your card.
            </p>
          </div>
        )}

        {!loading && !err && card && (
          <>
            {/* Card section */}
            <section className="panel health-card-section">
              <div className="health-card">
                <div className="hc-header">
                  <div className="hc-brand">
                    <div className="hc-logo">HK</div>
                    <div className="hc-title">
                      <div className="hc-app-name">HealthKey</div>
                      <div className="hc-sub">Digital Health Card</div>
                    </div>
                  </div>
                  <div className="hc-status">
                    <span
                      className={
                        card.lostReported ? "badge-danger" : "badge-ok"
                      }
                    >
                      {card.lostReported ? "Reported lost" : "Active"}
                    </span>
                  </div>
                </div>

                <div className="hc-body">
                  <div className="hc-info">
                    <div className="hc-label">Card ID</div>
                    <div className="hc-value">{card.cardId}</div>

                    <div className="hc-label">Linked Name</div>
                    <div className="hc-value">
                      {card.patientName || "—"}
                    </div>

                    <div className="hc-label">Emergency Info</div>
                    <div className="hc-emergency">
                      <div>
                        <strong>Blood group:</strong>{" "}
                        {card.bloodGroup || "—"}
                      </div>
                      <div>
                        <strong>Allergies:</strong>{" "}
                        {card.allergies || "None"}
                      </div>
                      <div>
                        <strong>Primary contact:</strong>{" "}
                        {card.emergencyContactName || "—"} (
                        {card.emergencyContactPhone || "-"})
                      </div>
                    </div>
                  </div>

                  <div className="hc-qr-block">
                    <QRCodeCanvas
                      value={card.qrData || card.cardId}
                      size={90}
                      bgColor="#020617"
                      fgColor="#e5e7eb"
                      level="M"
                    />
                    <div className="hc-qr-caption">
                      Scan at hospital registration
                    </div>
                    <div className="hc-qr-small-id">#{card.cardId}</div>
                  </div>
                </div>

                <div className="hc-footer">
                  <div>
                    Issued on:{" "}
                    {card.issuedAt
                      ? new Date(card.issuedAt).toLocaleDateString()
                      : "—"}
                  </div>
                  <div>
                    Last used:{" "}
                    {card.lastUsedAt
                      ? new Date(card.lastUsedAt).toLocaleString()
                      : "—"}
                  </div>
                </div>
              </div>

              <div className="health-card-actions">
                <button
                  className="btn"
                  disabled={reporting || card.lostReported}
                  onClick={handleReportLost}
                >
                  {card.lostReported
                    ? "Already reported lost"
                    : "Report card lost"}
                </button>

                {reportMsg && (
                  <div className="hint" style={{ marginTop: 6 }}>
                    {reportMsg}
                  </div>
                )}
              </div>
            </section>

            {/* Usage history */}
            <section className="panel">
              <div className="panel-header">
                <h3>Card Usage History</h3>
                <button className="btn-ghost" onClick={load}>
                  Refresh
                </button>
              </div>
              <ul className="simple-list">
                {usage.length === 0 && <li>No usage recorded yet.</li>}
                {usage.map((u, idx) => (
                  <li key={u._id || u.id || idx}>
                    <strong>{u.location || "Hospital"}</strong> —{" "}
                    {u.purpose || "Registration"}
                    <br />
                    {u.usedAt
                      ? new Date(u.usedAt).toLocaleString()
                      : "—"}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
