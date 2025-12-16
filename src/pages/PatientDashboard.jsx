// src/pages/PatientDashboard.jsx
import React, { useState } from "react";
import PatientLayout from "./PatientLayout";
import { QRCodeCanvas } from "qrcode.react";

const TABS = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "appointments", label: "Book Appointment", icon: "📅" },
  { id: "records", label: "View Records", icon: "📄" },
  { id: "prescriptions", label: "Prescriptions", icon: "💊" },
  { id: "emergency", label: "Emergency", icon: "🆘" },
  { id: "card", label: "Health Card", icon: "💳" },
  { id: "goals", label: "Health Goals", icon: "🎯" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
  { id: "insurance", label: "Insurance", icon: "💰" },
  { id: "assistant", label: "AI Assistant", icon: "🤖" },
];

// Demo data only – no backend calls
const MOCK_APPOINTMENTS = [
  {
    id: "A-01",
    date: "12 Dec 2025",
    time: "10:30 AM",
    doctor: "Dr. Mehta",
    dept: "Cardiology",
    mode: "In-clinic",
  },
  {
    id: "A-02",
    date: "20 Dec 2025",
    time: "05:00 PM",
    doctor: "Dr. Patel",
    dept: "Medicine",
    mode: "Teleconsultation",
  },
];

const MOCK_RECORDS = [
  {
    id: "R-01",
    date: "05 Sep 2025",
    title: "Discharge summary – Fever",
    hospital: "CityCare Hospital",
  },
  {
    id: "R-02",
    date: "22 Jun 2025",
    title: "OPD visit – Diabetes follow-up",
    hospital: "Sunrise Multispeciality",
  },
];

const MOCK_PRESCRIPTIONS = [
  {
    id: "P-01",
    date: "05 Sep 2025",
    doctor: "Dr. Shah",
    items: ["Paracetamol 650mg", "ORS", "Rest"],
  },
  {
    id: "P-02",
    date: "22 Jun 2025",
    doctor: "Dr. Patel",
    items: ["Metformin 500mg", "Atorvastatin 10mg"],
  },
];

const MOCK_GOALS = [
  { id: "G-01", label: "Walk 30 minutes daily", status: "On track" },
  { id: "G-02", label: "Check BP twice a week", status: "Needs attention" },
];

const MOCK_INSURANCE = {
  provider: "HealthShield Gold",
  policyNo: "HS-GOLD-223344",
  validTill: "31 Dec 2026",
  coverage: "₹10,00,000",
};

const MOCK_CARD = {
  cardId: "HK-IND-0001-2025",
  qrData: "HK-IND-0001-2025",
  bloodGroup: "B+",
  allergies: "Penicillin",
  emergencyContactName: "Family Contact",
  emergencyContactPhone: "+91-98765-00000",
};

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newApptDept, setNewApptDept] = useState("Cardiology");
  const [newApptMode, setNewApptMode] = useState("In-clinic");
  const [newApptNote, setNewApptNote] = useState("");

  // AI assistant state (demo only)
  const [aiMessages, setAiMessages] = useState([
    {
      id: "intro",
      role: "assistant",
      content:
        "Hi! I am your AI health assistant (demo). Ask about vitals, medicines or healthy habits. I do not replace a doctor.",
    },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiThinking, setAiThinking] = useState(false);

  const handleBookDemoAppointment = () => {
    if (!newApptNote.trim()) {
      alert("Please add a short note / reason.");
      return;
    }
    alert(
      "Appointment request submitted (demo only).\n\n" +
        `Dept: ${newApptDept}\nMode: ${newApptMode}\nNote: ${newApptNote}`
    );
    setNewApptNote("");
  };

  const handleAiSend = (e) => {
    e.preventDefault();
    const text = aiInput.trim();
    if (!text || aiThinking) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };
    setAiMessages((prev) => [...prev, userMsg]);
    setAiInput("");
    setAiThinking(true);

    // Demo reply – in real app this will call backend / OpenAI
    setTimeout(() => {
      const reply = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content:
          "This is a demo response. In real HealthKey, I would analyze your health data and give personalised guidance. " +
          "Always consult your doctor for diagnosis or treatment.",
      };
      setAiMessages((prev) => [...prev, reply]);
      setAiThinking(false);
    }, 900);
  };

  const handleAiQuickAsk = (q) => {
    setAiInput(q);
  };

  return (
    <PatientLayout
      title="Patient Dashboard"
      subtitle="See your appointments, records, prescriptions and HealthKey card."
    >
      {/* Tabs row */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedAppointment(null);
              setSelectedRecord(null);
            }}
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

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 lg:col-span-2">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Health overview (demo)
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500">Next appointment</p>
                <p className="text-base text-slate-800 mt-1">
                  {MOCK_APPOINTMENTS[0].date}
                </p>
                <p className="text-xs text-slate-500">
                  {MOCK_APPOINTMENTS[0].time} • {MOCK_APPOINTMENTS[0].doctor}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Last visit</p>
                <p className="text-base text-slate-800 mt-1">
                  {MOCK_RECORDS[0].date}
                </p>
                <p className="text-xs text-slate-500">
                  {MOCK_RECORDS[0].title}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Today&apos;s goal</p>
                <p className="text-base text-slate-800 mt-1">
                  {MOCK_GOALS[0].label}
                </p>
                <p className="text-xs text-emerald-600">
                  Status: {MOCK_GOALS[0].status}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Insurance summary
            </h2>
            <p className="text-sm text-slate-700">
              {MOCK_INSURANCE.provider}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Policy no: {MOCK_INSURANCE.policyNo}
              <br />
              Coverage: {MOCK_INSURANCE.coverage}
              <br />
              Valid till: {MOCK_INSURANCE.validTill}
            </p>
          </div>
        </div>
      )}

      {/* APPOINTMENTS TAB */}
      {activeTab === "appointments" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Upcoming appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Upcoming appointments
            </h2>
            <div className="space-y-2 text-sm">
              {MOCK_APPOINTMENTS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setSelectedAppointment(a)}
                  className="w-full text-left border border-slate-100 rounded-lg px-3 py-2 hover:bg-slate-50"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium text-slate-800">
                        {a.date} • {a.time}
                      </div>
                      <div className="text-xs text-slate-500">
                        {a.doctor} — {a.dept}
                      </div>
                    </div>
                    <span className="text-xs text-sky-600">{a.mode}</span>
                  </div>
                </button>
              ))}
              {MOCK_APPOINTMENTS.length === 0 && (
                <p className="text-sm text-slate-500">
                  No appointments booked in this demo.
                </p>
              )}
            </div>
          </div>

          {/* Book new appointment (demo form) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Book appointment (demo)
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-500 mb-1">Department</p>
                <select
                  value={newApptDept}
                  onChange={(e) => setNewApptDept(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 bg-white"
                >
                  <option>Cardiology</option>
                  <option>Medicine</option>
                  <option>Orthopedics</option>
                  <option>Dermatology</option>
                </select>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Mode</p>
                <select
                  value={newApptMode}
                  onChange={(e) => setNewApptMode(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 bg-white"
                >
                  <option value="In-clinic">In-clinic</option>
                  <option value="Teleconsultation">Teleconsultation</option>
                </select>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Reason / note (demo only)
                </p>
                <textarea
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm min-h-[70px] focus:outline-none focus:ring-1 focus:ring-sky-500"
                  value={newApptNote}
                  onChange={(e) => setNewApptNote(e.target.value)}
                  placeholder="Describe your problem briefly..."
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleBookDemoAppointment}
                  className="text-xs bg-sky-600 text-white px-3 py-1.5 rounded-lg hover:bg-sky-700"
                >
                  Submit request (demo)
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                In the real system this would check doctor slots and confirm
                your appointment. Here it only shows a demo alert.
              </p>
            </div>
          </div>

          {selectedAppointment && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 lg:col-span-2">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">
                Appointment details
              </h3>
              <p className="text-sm text-slate-700">
                {selectedAppointment.date} at {selectedAppointment.time} with{" "}
                {selectedAppointment.doctor} ({selectedAppointment.dept}) —{" "}
                {selectedAppointment.mode}
              </p>
            </div>
          )}
        </div>
      )}

      {/* RECORDS TAB */}
      {activeTab === "records" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Medical records
          </h2>
          <div className="space-y-2 text-sm">
            {MOCK_RECORDS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRecord(r)}
                className="w-full text-left border border-slate-100 rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium text-slate-800">{r.title}</div>
                    <div className="text-xs text-slate-500">
                      {r.hospital}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{r.date}</span>
                </div>
              </button>
            ))}
            {MOCK_RECORDS.length === 0 && (
              <p className="text-sm text-slate-500">
                No demo records available.
              </p>
            )}
          </div>

          {selectedRecord && (
            <div className="mt-4 border border-slate-100 rounded-lg p-3 bg-slate-50 text-xs text-slate-700">
              <strong>{selectedRecord.title}</strong>
              <br />
              Hospital: {selectedRecord.hospital}
              <br />
              Date: {selectedRecord.date}
              <p className="mt-2">
                In the real HealthKey system, clicking a record would open the
                full PDF / summary. For demo we only show basic details.
              </p>
            </div>
          )}
        </div>
      )}

      {/* PRESCRIPTIONS TAB */}
      {activeTab === "prescriptions" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Prescriptions (demo)
          </h2>
          <div className="space-y-3 text-sm">
            {MOCK_PRESCRIPTIONS.map((p) => (
              <div
                key={p.id}
                className="border border-slate-100 rounded-lg px-3 py-2"
              >
                <div className="flex justify-between">
                  <div className="font-medium text-slate-800">
                    {p.date} — {p.doctor}
                  </div>
                </div>
                <ul className="list-disc ml-5 text-xs text-slate-600 mt-1">
                  {p.items.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EMERGENCY TAB */}
      {activeTab === "emergency" && (
        <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-4">
          <h2 className="text-sm font-semibold text-rose-700 mb-3">
            Emergency (demo)
          </h2>
          <p className="text-sm text-slate-700 mb-2">
            In real use, this section can show nearby emergency hospitals,
            quick-call buttons and your shared emergency profile.
          </p>
          <p className="text-xs text-slate-500">
            For now it&apos;s a safe static screen for demo.
          </p>
        </div>
      )}

      {/* HEALTH CARD TAB */}
      {activeTab === "card" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            My HealthKey card (demo)
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <div className="flex-1">
              <p className="text-xs text-slate-500 mb-1">Card ID</p>
              <p className="text-base text-slate-800">{MOCK_CARD.cardId}</p>
              <p className="text-xs text-slate-500 mt-2">
                Blood group: {MOCK_CARD.bloodGroup}
                <br />
                Allergies: {MOCK_CARD.allergies}
                <br />
                Emergency contact: {MOCK_CARD.emergencyContactName} (
                {MOCK_CARD.emergencyContactPhone})
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <QRCodeCanvas
                value={MOCK_CARD.qrData}
                size={96}
                bgColor="#020617"
                fgColor="#e5e7eb"
                level="M"
              />
              <p className="text-[11px] text-slate-500 mt-2">
                Show this QR / NFC card at hospital registration.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* GOALS TAB */}
      {activeTab === "goals" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Health goals
          </h2>
          <ul className="space-y-2 text-sm">
            {MOCK_GOALS.map((g) => (
              <li
                key={g.id}
                className="flex justify-between border border-slate-100 rounded-lg px-3 py-2"
              >
                <span>{g.label}</span>
                <span
                  className={
                    "text-xs px-2 py-0.5 rounded-full " +
                    (g.status === "On track"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700")
                  }
                >
                  {g.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* FAMILY TAB */}
      {activeTab === "family" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Family (demo)
          </h2>
          <p className="text-sm text-slate-500">
            Later you can show linked family members and switch cards from this
            screen. For now it&apos;s just a placeholder.
          </p>
        </div>
      )}

      {/* INSURANCE TAB */}
      {activeTab === "insurance" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Insurance details
          </h2>
          <p className="text-sm text-slate-700">
            {MOCK_INSURANCE.provider}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Policy no: {MOCK_INSURANCE.policyNo}
            <br />
            Coverage: {MOCK_INSURANCE.coverage}
            <br />
            Valid till: {MOCK_INSURANCE.validTill}
          </p>
        </div>
      )}

      {/* AI ASSISTANT TAB (chat-style UI) */}
      {activeTab === "assistant" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            AI Health Assistant (demo)
          </h2>

          <div className="text-xs text-slate-500 mb-2">
            This is a demo UI. In the real system it will use your data and an
            AI backend. It does <strong>not</strong> replace a doctor or
            emergency services.
          </div>

          <div
            className="border border-slate-100 rounded-lg p-2 mb-3 overflow-y-auto"
            style={{ maxHeight: 260 }}
          >
            {aiMessages.map((m) => (
              <div
                key={m.id}
                className={
                  "flex mb-2 text-sm " +
                  (m.role === "user"
                    ? "justify-end"
                    : "justify-start")
                }
              >
                {m.role === "assistant" && (
                  <div className="mr-2 w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-base">
                    🤖
                  </div>
                )}
                <div
                  className={
                    "px-3 py-2 rounded-2xl max-w-[75%] " +
                    (m.role === "user"
                      ? "bg-sky-600 text-white rounded-br-sm"
                      : "bg-slate-100 text-slate-800 rounded-bl-sm")
                  }
                >
                  {m.content}
                </div>
                {m.role === "user" && (
                  <div className="ml-2 w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-base">
                    👤
                  </div>
                )}
              </div>
            ))}
            {aiThinking && (
              <div className="flex mb-2 text-sm justify-start">
                <div className="mr-2 w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-base">
                  🤖
                </div>
                <div className="px-3 py-2 rounded-2xl bg-slate-100 text-slate-800 rounded-bl-sm">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse mr-1" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse mr-1" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-slate-500">
            <span>Quick questions:</span>
            <button
              type="button"
              className="border border-slate-200 rounded-full px-2 py-0.5 text-xs hover:bg-slate-50"
              onClick={() =>
                handleAiQuickAsk("Give me tips to improve my blood pressure.")
              }
            >
              BP tips
            </button>
            <button
              type="button"
              className="border border-slate-200 rounded-full px-2 py-0.5 text-xs hover:bg-slate-50"
              onClick={() =>
                handleAiQuickAsk(
                  "Explain my last lab report in simple language."
                )
              }
            >
              Lab report help
            </button>
            <button
              type="button"
              className="border border-slate-200 rounded-full px-2 py-0.5 text-xs hover:bg-slate-50"
              onClick={() =>
                handleAiQuickAsk(
                  "Remind me how to take my current medicines properly."
                )
              }
            >
              Medicine guidance
            </button>
          </div>

          <form
            className="flex flex-col gap-2 mt-1"
            onSubmit={handleAiSend}
          >
            <textarea
              rows={2}
              className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Ask something about your health, vitals or prescriptions..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="text-xs bg-sky-600 text-white px-3 py-1.5 rounded-lg hover:bg-sky-700 disabled:opacity-60"
                disabled={aiThinking || !aiInput.trim()}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </PatientLayout>
  );
}
