// src/pages/DoctorDashboard.jsx
import React, { useState } from "react";
import DoctorLayout from "./DoctorLayout";

const TABS = [
  { id: "queue", label: "Patient Queue", icon: "👥" },
  { id: "consult", label: "Consultation", icon: "💼" },
  { id: "appointments", label: "Appointments", icon: "📋" },
  { id: "analytics", label: "Analytics", icon: "📊" },
  { id: "eprescription", label: "E-Prescription", icon: "💊" },
  { id: "telemedicine", label: "Telemedicine", icon: "📞" },
  { id: "cme", label: "CME", icon: "📚" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

// Demo queue & appointment data (front-end only)
const MOCK_QUEUE = [
  { id: "Q-01", name: "Raj Patel", token: "A101", reason: "Follow-up – Diabetes" },
  { id: "Q-02", name: "Anita Sharma", token: "A102", reason: "Chest pain" },
  { id: "Q-03", name: "Mehul Shah", token: "A103", reason: "Hypertension review" },
];

const MOCK_APPTS = [
  { id: "AP-01", time: "10:00", name: "Deepa Joshi", mode: "In-clinic" },
  { id: "AP-02", time: "10:30", name: "Vikas Jain", mode: "Teleconsult" },
  { id: "AP-03", time: "11:00", name: "Kiran Patel", mode: "In-clinic" },
];

// Demo NFC card payload – what we pretend was read from the card
const DEMO_NFC_PATIENT = {
  id: "NFC-9001",
  source: "nfc",
  name: "NFC Demo Patient",
  gender: "M",
  age: 45,
  cardId: "HK-IND-0001-2025",
  bloodGroup: "B+",
  phone: "+91-98765-00000",
  address: "Satellite, Ahmedabad",
  allergies: ["Penicillin", "Peanuts"],
  chronicConditions: ["Type 2 Diabetes", "Hypertension"],
  currentMeds: ["Metformin 500mg BD", "Amlodipine 5mg OD"],
  lastVisits: [
    { date: "12 Sep 2025", reason: "Routine diabetes review" },
    { date: "27 Jun 2025", reason: "High BP episode" },
  ],
  vitals: {
    bp: "132/84",
    pulse: 78,
    spo2: "98%",
    temp: "98.4°F",
  },
  chiefComplaint: "Mild chest discomfort since 2 days – demo card data.",
};

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("queue");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultNotes, setConsultNotes] = useState("");

  const handleCallNext = () => {
    if (MOCK_QUEUE.length) {
      setSelectedPatient({
        ...MOCK_QUEUE[0],
        source: "queue",
      });
      setConsultNotes("");
    }
  };

  const handleLoadFromQueue = (p) => {
    setSelectedPatient({
      ...p,
      source: "queue",
    });
    setConsultNotes("");
  };

  const handleLoadDemoAppointment = () => {
    setSelectedPatient({
      id: "DEMO-APPT",
      name: "Demo Appointment Patient",
      source: "appointment",
      chiefComplaint: "Teleconsult follow-up for blood pressure.",
      vitals: {
        bp: "130/82",
        pulse: 76,
        spo2: "99%",
        temp: "98.6°F",
      },
    });
    setConsultNotes("");
  };

  // NFC demo scan – in real life this will trigger Web NFC / backend
  const handleDemoNfcScan = () => {
    setSelectedPatient(DEMO_NFC_PATIENT);
    setConsultNotes("");
  };

  // Placeholder for real Web NFC integration (kept safe, won’t crash)
  const handleRealNfcScan = async () => {
    if (typeof window === "undefined" || !("NDEFReader" in window)) {
      alert(
        "Web NFC is only available on some Android Chrome browsers. " +
          "For now we load demo data."
      );
      handleDemoNfcScan();
      return;
    }

    try {
      const reader = new window.NDEFReader();
      await reader.scan();
      reader.onreading = (event) => {
        // Here you would parse event.message.records,
        // get cardId and call your backend: /api/nfc/lookup?cardId=...
        console.log("NFC event", event);
        // For demo we still just load the static patient:
        handleDemoNfcScan();
      };
    } catch (err) {
      console.error(err);
      alert("NFC scan failed, loading demo card instead.");
      handleDemoNfcScan();
    }
  };

  const handleSaveConsultation = () => {
    if (!selectedPatient) return;
    if (!consultNotes.trim()) {
      alert("Please enter consultation notes before saving.");
      return;
    }
    // In real app you would POST this to backend.
    console.log("Saving consultation for", selectedPatient.id, consultNotes);
    alert("Consultation saved (demo only, not sent to server).");
    setConsultNotes("");
  };

  return (
    <DoctorLayout
      title="Doctor Dashboard"
      subtitle="Scan NFC cards, manage today’s queue and capture consultations."
    >
      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border " +
              (activeTab === tab.id
                ? "bg-sky-50 border-sky-500 text-sky-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50")
            }
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* MAIN TAB: queue + NFC + consultation */}
      {activeTab === "queue" && (
        <div className="space-y-4">
          {/* NFC scan box */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Scan NFC card
                </h2>
                <p className="text-xs text-slate-500">
                  Tap the patient&apos;s NFC card on a supported device to load
                  personal details and past medical history (read-only).
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDemoNfcScan}
                  className="text-xs border border-slate-200 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100"
                >
                  Load demo card
                </button>
                <button
                  type="button"
                  onClick={handleRealNfcScan}
                  className="text-xs bg-sky-600 text-white px-3 py-1.5 rounded-lg hover:bg-sky-700"
                >
                  Scan NFC
                </button>
              </div>
            </div>

            {selectedPatient?.source === "nfc" && (
              <div className="grid md:grid-cols-3 gap-4 text-sm mt-3">
                {/* Personal details */}
                <div className="space-y-1">
                  <div className="font-semibold text-slate-800">
                    {selectedPatient.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    Card ID: {selectedPatient.cardId}
                  </div>
                  <div className="text-xs text-slate-500">
                    {selectedPatient.age} yrs • {selectedPatient.gender} •{" "}
                    Blood group {selectedPatient.bloodGroup}
                  </div>
                  <div className="text-xs text-slate-500">
                    {selectedPatient.phone}
                  </div>
                  <div className="text-xs text-slate-500">
                    {selectedPatient.address}
                  </div>
                </div>

                {/* Chronic + allergies */}
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Chronic conditions
                    </p>
                    <ul className="text-xs text-slate-600 list-disc ml-4">
                      {selectedPatient.chronicConditions?.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Allergies
                    </p>
                    <ul className="text-xs text-slate-600 list-disc ml-4">
                      {selectedPatient.allergies?.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Medication + history */}
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Current medication
                    </p>
                    <ul className="text-xs text-slate-600 list-disc ml-4">
                      {selectedPatient.currentMeds?.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Recent visits
                    </p>
                    <ul className="text-xs text-slate-600 list-disc ml-4">
                      {selectedPatient.lastVisits?.map((v) => (
                        <li key={v.date}>
                          {v.date} – {v.reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Queue + appointments in two columns */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Today queue */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <h2 className="text-sm font-semibold text-slate-800 mb-3">
                Today&apos;s Patient Queue
              </h2>
              <div className="flex justify-between items-center mb-3 text-xs text-slate-500">
                <span>{MOCK_QUEUE.length} patients waiting (demo)</span>
                <button
                  type="button"
                  onClick={handleCallNext}
                  className="text-sky-600 hover:underline"
                >
                  Call next
                </button>
              </div>
              <div className="divide-y divide-slate-100 text-sm">
                {MOCK_QUEUE.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleLoadFromQueue(p)}
                    className="w-full text-left py-2 flex justify-between items-center hover:bg-slate-50 px-2 rounded-md"
                  >
                    <div>
                      <div className="font-medium text-slate-800">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.reason}</div>
                    </div>
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      {p.token}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Today appointments */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <h2 className="text-sm font-semibold text-slate-800 mb-3">
                Today&apos;s Appointments
              </h2>
              <div className="text-xs text-slate-500 mb-2">
                {MOCK_APPTS.length} appointments (demo)
              </div>
              <div className="space-y-2 text-sm">
                {MOCK_APPTS.map((a) => (
                  <div
                    key={a.id}
                    className="flex justify-between items-center border border-slate-100 rounded-lg px-3 py-2"
                  >
                    <div>
                      <div className="font-medium text-slate-800">{a.name}</div>
                      <div className="text-xs text-slate-500">
                        {a.time} • {a.mode}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-sky-600 hover:underline"
                      onClick={handleLoadDemoAppointment}
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Consultation room */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 lg:col-span-2">
              <h2 className="text-sm font-semibold text-slate-800 mb-3">
                Consultation Room
              </h2>
              {!selectedPatient ? (
                <div className="text-sm text-slate-500">
                  Scan an NFC card or select a patient from the queue / appointments to start a consultation.
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="md:col-span-1 space-y-1">
                    <div className="font-semibold text-slate-800">{selectedPatient.name}</div>
                    <div className="text-xs text-slate-500 capitalize">
                      Source:{" "}
                      {selectedPatient.source === "nfc"
                        ? "NFC card"
                        : selectedPatient.source || "demo"}
                    </div>
                    {selectedPatient.vitals && (
                      <div className="mt-3 text-xs grid grid-cols-2 gap-2 bg-slate-50 rounded-lg p-2">
                        <div>BP: {selectedPatient.vitals.bp}</div>
                        <div>Pulse: {selectedPatient.vitals.pulse}</div>
                        <div>SpO₂: {selectedPatient.vitals.spo2}</div>
                        <div>Temp: {selectedPatient.vitals.temp}</div>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">
                        Past history / complaint (read-only)
                      </p>
                      <div className="border border-slate-200 rounded-lg p-2 min-h-[60px] text-xs text-slate-700 bg-slate-50">
                        {selectedPatient.chiefComplaint ||
                          selectedPatient.reason ||
                          "Past medical history from NFC or queue will show here."}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">
                        Current consultation notes (editable)
                      </p>
                      <textarea
                        className="w-full border border-slate-200 rounded-lg p-2 text-sm min-h-[80px] focus:outline-none focus:ring-1 focus:ring-sky-500"
                        placeholder="Add today’s findings, diagnosis and plan. This will be saved as a new record; past history above remains unchanged."
                        value={consultNotes}
                        onChange={(e) => setConsultNotes(e.target.value)}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="button"
                          onClick={handleSaveConsultation}
                          className="text-xs bg-sky-600 text-white px-3 py-1.5 rounded-lg hover:bg-sky-700"
                        >
                          Save consultation (demo)
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      In the real HealthKey system, the NFC card only provides read-only demographic and past medical history. New consultation notes are written to the secure backend and optionally summarized back to the card.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONSULTATION TAB (added) */}
      {activeTab === "consult" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Consultation</h2>
          <p className="text-xs text-slate-500 mb-3">
            Quick access to the consultation room. You can load a patient from the queue, open a demo appointment, or scan an NFC demo card.
          </p>

          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={handleCallNext}
              className="text-xs bg-sky-50 border border-sky-200 text-sky-700 px-3 py-1.5 rounded-lg"
            >
              Load next from queue
            </button>
            <button
              type="button"
              onClick={handleLoadDemoAppointment}
              className="text-xs border border-slate-200 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100"
            >
              Load demo appointment
            </button>
            <button
              type="button"
              onClick={handleDemoNfcScan}
              className="text-xs bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg"
            >
              Load demo NFC card
            </button>
          </div>

          <div>
            {!selectedPatient ? (
              <div className="text-sm text-slate-500">No patient loaded. Use the actions above or pick from queue in the Patient Queue tab.</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="md:col-span-1 space-y-1">
                  <div className="font-semibold text-slate-800">{selectedPatient.name}</div>
                  <div className="text-xs text-slate-500">Source: {selectedPatient.source || "demo"}</div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Current consultation notes</p>
                  <textarea
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm min-h-[80px]"
                    value={consultNotes}
                    onChange={(e) => setConsultNotes(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={handleSaveConsultation}
                      className="text-xs bg-sky-600 text-white px-3 py-1.5 rounded-lg hover:bg-sky-700"
                    >
                      Save consultation (demo)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OTHER TABS (placeholders) */}
      {activeTab === "appointments" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Appointments — overview</h2>
          <p className="text-sm text-slate-500">This is a demo overview screen. You can extend it later with calendar view, filters (OPD / telemedicine), and export options.</p>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Analytics (demo)</h2>
          <p className="text-sm text-slate-500">Simple charts for OPD volume, follow-up rates, and prescription patterns can be added here, similar to the admin analytics cards.</p>
        </div>
      )}

      {activeTab === "eprescription" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">E-Prescription (demo)</h2>
          <p className="text-sm text-slate-500">In the final product this will connect to a drug database and allow e-prescriptions to be pushed to NFC and pharmacy. For now it is just a safe placeholder.</p>
        </div>
      )}

      {activeTab === "telemedicine" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Telemedicine (demo)</h2>
          <p className="text-sm text-slate-500">Add meeting links, call history, and integration with your preferred video provider here.</p>
        </div>
      )}

      {activeTab === "cme" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">CME / Learning</h2>
          <p className="text-sm text-slate-500">Showcase how doctors can access courses, guidelines and HealthKey best-practice videos from this section.</p>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Settings</h2>
          <p className="text-sm text-slate-500">Preferences like consultation duration, default template, and notification modes can be configured here in the full system.</p>
        </div>
      )}
    </DoctorLayout>
  );
}
