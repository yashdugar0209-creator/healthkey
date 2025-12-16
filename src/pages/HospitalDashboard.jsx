// src/pages/HospitalDashboard.jsx
import React, { useState } from "react";
import HospitalLayout from "./HospitalLayout";

const TABS = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "doctors", label: "Doctors", icon: "🧑‍⚕️" },
  { id: "patients", label: "Patients", icon: "👥" },
  { id: "registration", label: "Registration", icon: "📋" },
  { id: "analytics", label: "Analytics", icon: "📈" },
  { id: "pharmacy", label: "Pharmacy", icon: "💊" },
  { id: "departments", label: "Departments", icon: "🏥" },
  { id: "billing", label: "Billing", icon: "💰" },
];

// ---------- DEMO DATA (in-memory only) ----------

const INITIAL_DOCTORS = [
  { id: "D-01", name: "Dr. Mehta", dept: "Cardiology", status: "On duty" },
  { id: "D-02", name: "Dr. Patel", dept: "Medicine", status: "OPD" },
  { id: "D-03", name: "Dr. Sharma", dept: "Orthopedics", status: "Off duty" },
];

const INITIAL_PATIENTS = [
  {
    id: "P-01",
    name: "Raj Patel",
    type: "IPD",
    bed: "ICU-3",
    status: "Critical",
  },
  {
    id: "P-02",
    name: "Anita Sharma",
    type: "OPD",
    bed: "-",
    status: "Waiting",
  },
  {
    id: "P-03",
    name: "Mehul Shah",
    type: "IPD",
    bed: "W-204",
    status: "Stable",
  },
];

const INITIAL_DEPARTMENTS = [
  { id: "DEP-01", name: "Medicine", type: "Clinical", status: "Open" },
  { id: "DEP-02", name: "Cardiology", type: "Clinical", status: "Open" },
  { id: "DEP-03", name: "Billing", type: "Support", status: "Open" },
];

const INITIAL_PHARMACY_ITEMS = [
  { id: "DR-01", name: "Paracetamol 650mg", stock: 120, status: "In stock" },
  { id: "DR-02", name: "Metformin 500mg", stock: 80, status: "Low" },
  { id: "DR-03", name: "Atorvastatin 10mg", stock: 0, status: "Out" },
];

const INITIAL_BILLS = [
  {
    id: "B-0001",
    patientName: "Raj Patel",
    amount: 32500,
    status: "Unpaid",
  },
  {
    id: "B-0002",
    patientName: "Anita Sharma",
    amount: 850,
    status: "Paid",
  },
];

const ADMISSION_FORECAST = [
  { label: "Today", value: 120, baseline: 110 },
  { label: "Tomorrow", value: 132, baseline: 112 },
  { label: "Next 7 days (avg.)", value: 140, baseline: 115 },
];

const BED_FORECAST = [
  { label: "ICU occupancy (tomorrow)", value: "82%" },
  { label: "Ward occupancy (tomorrow)", value: "76%" },
];

const DEPT_LOAD = [
  { dept: "Medicine", predicted: "High", comment: "Morning OPD rush" },
  { dept: "Cardiology", predicted: "Medium", comment: "Stable vs today" },
  { dept: "Orthopedics", predicted: "Low", comment: "Below usual load" },
];

export default function HospitalDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

// Quick actions (Overview)
const [searchKey, setSearchKey] = useState("");
const [quickResult, setQuickResult] = useState("");

// ✅ Button 1
const handleQuickSearch = () => {
  const key = prompt("Enter Patient ID, Name, or HealthKey:");
  if (!key) return;
  alert(`Searching for: ${key} (demo only)`);
};

// ✅ Button 2
const handleIssueNfc = () => {
  alert("Issue new NFC card clicked (demo)");
};

// ✅ Button 3
const handleBedAlerts = () => {
  alert("Bed / ICU alerts clicked (demo)");
};
;


  // Doctors
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [newDoctorName, setNewDoctorName] = useState("");
  const [newDoctorDept, setNewDoctorDept] = useState("Medicine");
  const [newDoctorStatus, setNewDoctorStatus] = useState("On duty");

  // Patients
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientType, setNewPatientType] = useState("OPD");
  const [newPatientBed, setNewPatientBed] = useState("");
  const [newPatientStatus, setNewPatientStatus] = useState("Waiting");

  // Overview – NFC + admission (local demo)
  const [nfcCardId, setNfcCardId] = useState(null);
  const [nfcStatus, setNfcStatus] = useState("No card detected");
  const [adName, setAdName] = useState("");
  const [adAge, setAdAge] = useState("");
  const [adGender, setAdGender] = useState("Female");
  const [adWard, setAdWard] = useState("General");
  const [adNote, setAdNote] = useState("");
  const [adMessage, setAdMessage] = useState("");

  // Registrations
  const [registrations, setRegistrations] = useState([]);
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regType, setRegType] = useState("OPD");
  const [regNote, setRegNote] = useState("");

  // Pharmacy
  const [pharmacyItems, setPharmacyItems] = useState(INITIAL_PHARMACY_ITEMS);
  const [phName, setPhName] = useState("");
  const [phStock, setPhStock] = useState("");
  const [phStatus, setPhStatus] = useState("In stock");

  // Departments
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [depName, setDepName] = useState("");
  const [depType, setDepType] = useState("Clinical");
  const [depStatus, setDepStatus] = useState("Open");

  // Billing
  const [bills, setBills] = useState(INITIAL_BILLS);
  const [billPatient, setBillPatient] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billStatus, setBillStatus] = useState("Unpaid");

  const totalBilling = bills.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalUnpaid = bills
    .filter((b) => b.status !== "Paid")
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  // Predictive helper
  const maxAdmissions = Math.max(...ADMISSION_FORECAST.map((r) => r.value));
  const admissionWidth = (v) =>
    `${Math.round((v / maxAdmissions) * 100)}%`;

  // ---------- HANDLERS ----------


  // Doctors
  const addDoctor = (e) => {
    e.preventDefault();
    if (!newDoctorName.trim()) return;
    setDoctors((prev) => [
      ...prev,
      {
        id: `D-${String(prev.length + 1).padStart(2, "0")}`,
        name: newDoctorName.trim(),
        dept: newDoctorDept,
        status: newDoctorStatus,
      },
    ]);
    setNewDoctorName("");
  };

  const toggleDoctorStatus = (id) => {
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: d.status === "On duty" ? "Off duty" : "On duty",
            }
          : d
      )
    );
  };

  // Patients
  const addPatient = (e) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;
    setPatients((prev) => [
      ...prev,
      {
        id: `P-${String(prev.length + 1).padStart(2, "0")}`,
        name: newPatientName.trim(),
        type: newPatientType,
        bed: newPatientBed || "-",
        status: newPatientStatus,
      },
    ]);
    setNewPatientName("");
    setNewPatientBed("");
  };

  const updatePatientStatus = (id, status) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  // Overview – NFC + admission
  const simulateNfcTap = () => {
    const fakeId =
      "HK-" + Math.floor(100000 + Math.random() * 900000).toString();
    setNfcCardId(fakeId);
    setNfcStatus("HealthKey card detected");
    setAdMessage(
      "Demo: NFC card scanned. Details are local only and not coming from server."
    );
  };

  const clearNfc = () => {
    setNfcCardId(null);
    setNfcStatus("No card detected");
  };

  const createAdmissionFromOverview = (e) => {
    e.preventDefault();
    if (!nfcCardId) {
      setAdMessage("Simulate an NFC tap first so the card is linked.");
      return;
    }
    if (!adName.trim()) {
      setAdMessage("Please enter patient full name.");
      return;
    }

    setPatients((prev) => [
      ...prev,
      {
        id: `P-${String(prev.length + 1).padStart(2, "0")}`,
        name: adName.trim(),
        type: "IPD",
        bed: adWard || "-",
        status: "Stable",
      },
    ]);

    setAdMessage(
      "Admission created in local dashboard. You can see it under the Patients tab."
    );
    setAdName("");
    setAdAge("");
    setAdGender("Female");
    setAdWard("General");
    setAdNote("");
  };

  // Registrations
  const addRegistration = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) return;
    setRegistrations((prev) => [
      ...prev,
      {
        id: `R-${String(prev.length + 1).padStart(3, "0")}`,
        name: regName.trim(),
        phone: regPhone.trim(),
        type: regType,
        note: regNote.trim(),
        time: new Date().toLocaleTimeString(),
      },
    ]);
    setRegName("");
    setRegPhone("");
    setRegNote("");
  };

  // Pharmacy
  const addPharmacyItem = (e) => {
    e.preventDefault();
    if (!phName.trim()) return;
    const stockNum = parseInt(phStock || "0", 10);
    setPharmacyItems((prev) => [
      ...prev,
      {
        id: `DR-${String(prev.length + 1).padStart(2, "0")}`,
        name: phName.trim(),
        stock: isNaN(stockNum) ? 0 : stockNum,
        status: phStatus,
      },
    ]);
    setPhName("");
    setPhStock("");
  };

  const adjustStock = (id, delta) => {
    setPharmacyItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              stock: Math.max(0, (it.stock || 0) + delta),
            }
          : it
      )
    );
  };

  // Departments
  const addDepartment = (e) => {
    e.preventDefault();
    if (!depName.trim()) return;
    setDepartments((prev) => [
      ...prev,
      {
        id: `DEP-${String(prev.length + 1).padStart(2, "0")}`,
        name: depName.trim(),
        type: depType,
        status: depStatus,
      },
    ]);
    setDepName("");
  };

  const toggleDepartmentStatus = (id) => {
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: d.status === "Open" ? "Closed" : "Open" }
          : d
      )
    );
  };

  // Billing
  const addBill = (e) => {
    e.preventDefault();
    if (!billPatient.trim() || !billAmount) return;
    const amt = parseFloat(billAmount);
    if (isNaN(amt)) return;
    setBills((prev) => [
      ...prev,
      {
        id: `B-${String(prev.length + 1).padStart(4, "0")}`,
        patientName: billPatient.trim(),
        amount: amt,
        status: billStatus,
      },
    ]);
    setBillPatient("");
    setBillAmount("");
  };

  const updateBillStatus = (id, status) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  // ---------- RENDER ----------

return (
  <HospitalLayout
    title="Hospital Dashboard"
    subtitle="Scan NFC cards for registration, manage beds, doctors and billing overview."
  >
      {/* Tabs */}
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

      {/* OVERVIEW: NFC scan + bed snapshot + actions */}
      {activeTab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left: NFC scan & new admission */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  NFC scan & new registration
                </h2>
                <p className="text-xs text-slate-500">
                  Tap the patient&apos;s HealthKey NFC card to start a new
                  admission or quickly pull existing details.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] bg-sky-50 text-sky-700 border border-sky-100">
                ⚡ Live demo
              </span>
            </div>

            {/* NFC area */}
            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                <span className="text-sm">📶</span> Sensors
              </span>
              <button
                type="button"
                onClick={simulateNfcTap}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-600 text-white hover:bg-sky-700"
              >
                <span className="text-sm">📳</span> Simulate NFC tap
              </button>
              <button
                type="button"
                onClick={clearNfc}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                Reset
              </button>

              <span className="ml-auto text-[11px] text-slate-500">
                Status:{" "}
                <span className="font-medium text-slate-800">{nfcStatus}</span>
              </span>
            </div>

            <div className="text-xs text-slate-600 mb-3">
              Card ID:{" "}
              <span className="font-mono">
                {nfcCardId || "No card detected"}
              </span>
            </div>

            {/* Admission form */}
            <form
              onSubmit={createAdmissionFromOverview}
              className="space-y-3 text-sm"
            >
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Patient full name
                  </label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                    value={adName}
                    onChange={(e) => setAdName(e.target.value)}
                    placeholder="e.g. Ananya Joshi"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Age
                  </label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                    value={adAge}
                    onChange={(e) => setAdAge(e.target.value)}
                    type="number"
                    min="0"
                    placeholder="Years"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Gender
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                    value={adGender}
                    onChange={(e) => setAdGender(e.target.value)}
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Ward / bed type
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                    value={adWard}
                    onChange={(e) => setAdWard(e.target.value)}
                  >
                    <option>General</option>
                    <option>Semi-private</option>
                    <option>Private</option>
                    <option>ICU</option>
                    <option>NICU</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Note (triage, complaints, etc.) – optional
                </label>
                <textarea
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm min-h-[70px]"
                  value={adNote}
                  onChange={(e) => setAdNote(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between mt-1">
                <p className="text-[11px] text-slate-400 max-w-md">
                  In real deployment, this form would auto-fill from the
                  patient&apos;s HealthKey profile when NFC is read and then
                  create an IPD admission in your HIS/EMR.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                >
                  <span className="text-sm">✅</span> Create admission
                </button>
              </div>

              {adMessage && (
                <p className="mt-2 text-[11px] text-slate-600">
                  {adMessage}
                </p>
              )}
            </form>
          </div>

          {/* Right: Bed & occupancy + quick actions */}
          <div className="space-y-4">
            {/* Bed snapshot */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-sm">
              <h2 className="text-sm font-semibold text-slate-800 mb-2">
                Bed & occupancy snapshot
              </h2>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-slate-500">Total beds occupied</p>
                  <p className="font-semibold text-slate-900">87 / 120</p>
                  <p className="text-[11px] text-slate-500">
                    33 beds available
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">ICU occupancy</p>
                  <p className="font-semibold text-slate-900">16 / 20</p>
                  <p className="text-[11px] text-slate-500">
                    4 ICU beds free
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">
                    Patients with NFC HealthKey profiles
                  </p>
                  <p className="font-semibold text-slate-900">3 linked</p>
                  <p className="text-[11px] text-slate-500">Demo data</p>
                </div>
              </div>
            </div>

            {/* Quick actions */}
<div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-sm">
  <h2 className="text-sm font-semibold text-slate-800 mb-2">
    Quick actions
  </h2>

  <div className="space-y-2 text-xs">

    {/* Button 1 */}
    <button
      type="button"
      onClick={handleQuickSearch}
      className="w-full text-left border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50"
    >
      <div className="flex items-center gap-2">
        <span className="text-base">🔍</span>
        <div>
          <p className="font-medium text-slate-800">
            Search patient by NFC / HealthKey ID
          </p>
          <p className="text-[11px] text-slate-500">
            Enter the ID printed on the physical card.
          </p>
        </div>
      </div>
    </button>

    {/* Button 2 */}
    <button
      type="button"
      onClick={handleIssueNfc}
      className="w-full text-left border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50"
    >
      <div className="flex items-center gap-2">
        <span className="text-base">🆕</span>
        <div>
          <p className="font-medium text-slate-800">
            Issue new NFC card
          </p>
          <p className="text-[11px] text-slate-500">
            Generate a new HealthKey ID and map it to a patient.
          </p>
        </div>
      </div>
    </button>

    {/* Button 3 */}
    <button
      type="button"
      onClick={handleBedAlerts}
      className="w-full text-left border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50"
    >
      <div className="flex items-center gap-2">
        <span className="text-base">⚠️</span>
        <div>
          <p className="font-medium text-slate-800">
            View bed / ICU alerts
          </p>
          <p className="text-[11px] text-slate-500">
            See upcoming capacity issues based on AI forecast.
          </p>
        </div>
      </div>
    </button>             
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOCTORS TAB */}
      {activeTab === "doctors" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Doctors on record
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-100">
                  <th className="py-2 pr-2 text-left">ID</th>
                  <th className="py-2 pr-2 text-left">Name</th>
                  <th className="py-2 pr-2 text-left">Dept</th>
                  <th className="py-2 pr-2 text-left">Status</th>
                  <th className="py-2 pr-2" />
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d.id} className="border-b border-slate-50">
                    <td className="py-1.5 pr-2 text-xs text-slate-500">
                      {d.id}
                    </td>
                    <td className="py-1.5 pr-2">{d.name}</td>
                    <td className="py-1.5 pr-2 text-slate-600">{d.dept}</td>
                    <td className="py-1.5 pr-2">
                      <span
                        className={
                          "inline-flex px-2 py-0.5 rounded-full text-[11px] " +
                          (d.status === "On duty"
                            ? "bg-emerald-50 text-emerald-700"
                            : d.status === "OPD"
                            ? "bg-sky-50 text-sky-700"
                            : "bg-slate-100 text-slate-600")
                        }
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-1.5 pr-2 text-right">
                      <button
                        type="button"
                        onClick={() => toggleDoctorStatus(d.id)}
                        className="text-[11px] text-sky-600 hover:underline"
                      >
                        Toggle duty
                      </button>
                    </td>
                  </tr>
                ))}
                {doctors.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-3 text-sm text-slate-500">
                      No doctors added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add doctor */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Add / update doctor (local only)
            </h2>
            <form onSubmit={addDoctor} className="space-y-3 text-sm max-w-md">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Doctor name
                </label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                  value={newDoctorName}
                  onChange={(e) => setNewDoctorName(e.target.value)}
                  placeholder="Dr. New Name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Department
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                    value={newDoctorDept}
                    onChange={(e) => setNewDoctorDept(e.target.value)}
                  >
                    <option>Medicine</option>
                    <option>Cardiology</option>
                    <option>Orthopedics</option>
                    <option>Pediatrics</option>
                    <option>ICU</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                    value={newDoctorStatus}
                    onChange={(e) => setNewDoctorStatus(e.target.value)}
                  >
                    <option>On duty</option>
                    <option>OPD</option>
                    <option>Off duty</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="mt-1 inline-flex items-center px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs hover:bg-sky-700"
              >
                Save in dashboard (demo)
              </button>
              <p className="text-[11px] text-slate-400 mt-1">
                Data is stored only in browser memory for this demo. On page
                reload it resets.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* PATIENTS TAB */}
      {activeTab === "patients" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Current patients (local demo)
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-100">
                  <th className="py-2 pr-2 text-left">ID</th>
                  <th className="py-2 pr-2 text-left">Name</th>
                  <th className="py-2 pr-2 text-left">Type</th>
                  <th className="py-2 pr-2 text-left">Bed</th>
                  <th className="py-2 pr-2 text-left">Status</th>
                  <th className="py-2 pr-2" />
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50">
                    <td className="py-1.5 pr-2 text-xs text-slate-500">
                      {p.id}
                    </td>
                    <td className="py-1.5 pr-2">{p.name}</td>
                    <td className="py-1.5 pr-2 text-slate-600">{p.type}</td>
                    <td className="py-1.5 pr-2 text-slate-600">{p.bed}</td>
                    <td className="py-1.5 pr-2">
                      <span
                        className={
                          "inline-flex px-2 py-0.5 rounded-full text-[11px] " +
                          (p.status === "Critical"
                            ? "bg-rose-50 text-rose-700"
                            : p.status === "Waiting"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700")
                        }
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-1.5 pr-2 text-right text-[11px]">
                      <button
                        type="button"
                        className="text-sky-600 hover:underline mr-1"
                        onClick={() => updatePatientStatus(p.id, "Stable")}
                      >
                        Mark stable
                      </button>
                      <button
                        type="button"
                        className="text-rose-600 hover:underline"
                        onClick={() => updatePatientStatus(p.id, "Critical")}
                      >
                        Mark critical
                      </button>
                    </td>
                  </tr>
                ))}
                {patients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-3 text-sm text-slate-500">
                      No patients added yet for this demo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add patient */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Add patient (local only)
            </h2>
            <form onSubmit={addPatient} className="space-y-3 text-sm max-w-md">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Patient name
                </label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Type
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                    value={newPatientType}
                    onChange={(e) => setNewPatientType(e.target.value)}
                  >
                    <option>OPD</option>
                    <option>IPD</option>
                    <option>Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Bed (optional)
                  </label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                    value={newPatientBed}
                    onChange={(e) => setNewPatientBed(e.target.value)}
                    placeholder="ICU-3, W-204…"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Status
                </label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                  value={newPatientStatus}
                  onChange={(e) => setNewPatientStatus(e.target.value)}
                >
                  <option>Waiting</option>
                  <option>Stable</option>
                  <option>Critical</option>
                </select>
              </div>
              <button
                type="submit"
                className="mt-1 inline-flex items-center px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs hover:bg-sky-700"
              >
                Add to list (demo)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REGISTRATION TAB */}
      {activeTab === "registration" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* New registration form */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Front desk registration (local demo)
            </h2>
            <form
              onSubmit={addRegistration}
              className="space-y-3 text-sm max-w-md"
            >
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Patient name
                </label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Mobile number
                </label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91…"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Visit type
                </label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                  value={regType}
                  onChange={(e) => setRegType(e.target.value)}
                >
                  <option>OPD</option>
                  <option>IPD admission</option>
                  <option>Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Note (optional)
                </label>
                <textarea
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm min-h-[70px]"
                  value={regNote}
                  onChange={(e) => setRegNote(e.target.value)}
                  placeholder="Doctor preference, triage notes, etc."
                />
              </div>
              <button
                type="submit"
                className="mt-1 inline-flex items-center px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs hover:bg-sky-700"
              >
                Save registration (demo)
              </button>
              <p className="text-[11px] text-slate-400 mt-1">
                In production this would create a real OPD/IPD visit linked to
                the patient&apos;s HealthKey.
              </p>
            </form>
          </div>

          {/* Today registrations */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Today&apos;s registrations
            </h2>
            {registrations.length === 0 ? (
              <p className="text-sm text-slate-500">
                No registrations added yet in this demo.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-slate-100">
                    <th className="py-2 pr-2 text-left">ID</th>
                    <th className="py-2 pr-2 text-left">Name</th>
                    <th className="py-2 pr-2 text-left">Type</th>
                    <th className="py-2 pr-2 text-left">Phone</th>
                    <th className="py-2 pr-2 text-left">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r) => (
                    <tr key={r.id} className="border-b border-slate-50">
                      <td className="py-1.5 pr-2 text-xs text-slate-500">
                        {r.id}
                      </td>
                      <td className="py-1.5 pr-2">{r.name}</td>
                      <td className="py-1.5 pr-2 text-slate-600">{r.type}</td>
                      <td className="py-1.5 pr-2 text-slate-600">
                        {r.phone}
                      </td>
                      <td className="py-1.5 pr-2 text-xs text-slate-500">
                        {r.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ANALYTICS TAB – with AI-style predictive UI */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          {/* Overview metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Analytics overview (demo)
            </h2>
            <div className="grid gap-4 md:grid-cols-4 text-sm">
              <div>
                <p className="text-xs text-slate-500">OPD visits (today)</p>
                <p className="text-xl font-semibold text-slate-800 mt-1">
                  312
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  +9% vs last Monday
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Admissions (today)</p>
                <p className="text-xl font-semibold text-slate-800 mt-1">
                  48
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  Avg stay: 3.2 days
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">ICU occupancy</p>
                <p className="text-xl font-semibold text-slate-800 mt-1">
                  78%
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Near safety threshold
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Emergency wait time</p>
                <p className="text-xl font-semibold text-slate-800 mt-1">
                  14 min
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  Within target (&lt; 20 min)
                </p>
              </div>
            </div>
          </div>

          {/* Predictive analytics + dept load */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 lg:col-span-2">
              <h2 className="text-sm font-semibold text-slate-800 mb-1">
                AI predictive analytics (demo)
              </h2>
              <p className="text-xs text-slate-500 mb-3">
                Forecasts below are simulated. When you connect a real AI
                service, you can send historical OPD/IPD data and render its
                predictions here.
              </p>

              <div className="mb-4">
                <p className="text-xs font-medium text-slate-600 mb-1">
                  OPD / admissions forecast
                </p>
                <div className="space-y-2 text-xs">
                  {ADMISSION_FORECAST.map((row) => (
                    <div key={row.label}>
                      <div className="flex justify-between mb-0.5">
                        <span className="text-slate-600">{row.label}</span>
                        <span className="font-semibold text-slate-900">
                          {row.value} patients
                        </span>
                      </div>
                      <div className="predict-bar">
                        <div
                          className="predict-bar-fill"
                          style={{ width: admissionWidth(row.value) }}
                        />
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Baseline: {row.baseline} patients
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="predict-ai-note">
                <span className="predict-ai-icon">🤖</span>
                <p>
                  AI insight (demo): Tomorrow&apos;s OPD is expected to be{" "}
                  <strong>~10% higher</strong> than today, driven by{" "}
                  <strong>Medicine</strong> and <strong>Cardiology</strong>. You
                  may open one extra OPD room between{" "}
                  <strong>10–12 AM</strong> to prevent waiting time spikes.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <h2 className="text-sm font-semibold text-slate-800 mb-2">
                Tomorrow&apos;s department load (demo)
              </h2>
              <ul className="space-y-2 text-xs">
                {DEPT_LOAD.map((d) => (
                  <li
                    key={d.dept}
                    className="flex items-start justify-between border border-slate-100 rounded-lg px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{d.dept}</p>
                      <p className="text-[11px] text-slate-500">
                        {d.comment}
                      </p>
                    </div>
                    <span
                      className={
                        "text-[11px] px-2 py-0.5 rounded-full ml-3 " +
                        (d.predicted === "High"
                          ? "bg-rose-50 text-rose-700"
                          : d.predicted === "Medium"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700")
                      }
                    >
                      {d.predicted}
                    </span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xs font-semibold text-slate-700 mt-4 mb-1">
                Bed occupancy forecast
              </h3>
              <div className="predict-badges">
                {BED_FORECAST.map((b) => (
                  <div key={b.label} className="predict-badge">
                    <div className="predict-badge-label">{b.label}</div>
                    <div className="predict-badge-value">{b.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHARMACY TAB */}
      {activeTab === "pharmacy" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Stock list */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Pharmacy stock (demo, local)
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-100">
                  <th className="py-2 pr-2 text-left">ID</th>
                  <th className="py-2 pr-2 text-left">Medicine</th>
                  <th className="py-2 pr-2 text-left">Stock</th>
                  <th className="py-2 pr-2 text-left">Status</th>
                  <th className="py-2 pr-2" />
                </tr>
              </thead>
              <tbody>
                {pharmacyItems.map((it) => (
                  <tr key={it.id} className="border-b border-slate-50">
                    <td className="py-1.5 pr-2 text-xs text-slate-500">
                      {it.id}
                    </td>
                    <td className="py-1.5 pr-2">{it.name}</td>
                    <td className="py-1.5 pr-2 text-slate-700">{it.stock}</td>
                    <td className="py-1.5 pr-2">
                      <span
                        className={
                          "inline-flex px-2 py-0.5 rounded-full text-[11px] " +
                          (it.status === "In stock"
                            ? "bg-emerald-50 text-emerald-700"
                            : it.status === "Low"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700")
                        }
                      >
                        {it.status}
                      </span>
                    </td>
                    <td className="py-1.5 pr-2 text-right text-[11px]">
                      <button
                        type="button"
                        className="text-sky-600 hover:underline mr-1"
                        onClick={() => adjustStock(it.id, +10)}
                      >
                        +10
                      </button>
                      <button
                        type="button"
                        className="text-rose-600 hover:underline"
                        onClick={() => adjustStock(it.id, -10)}
                      >
                        -10
                      </button>
                    </td>
                  </tr>
                ))}
                {pharmacyItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-3 text-sm text-slate-500">
                      No medicines added yet in this demo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add medicine */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Add medicine (local only)
            </h2>
            <form
              onSubmit={addPharmacyItem}
              className="space-y-3 text-sm max-w-md"
            >
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Medicine name
                </label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                  value={phName}
                  onChange={(e) => setPhName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Initial stock
                  </label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                    value={phStock}
                    onChange={(e) => setPhStock(e.target.value)}
                    type="number"
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                    value={phStatus}
                    onChange={(e) => setPhStatus(e.target.value)}
                  >
                    <option>In stock</option>
                    <option>Low</option>
                    <option>Out</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="mt-1 inline-flex items-center px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs hover:bg-sky-700"
              >
                Add to stock (demo)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DEPARTMENTS TAB */}
      {activeTab === "departments" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Departments
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-100">
                  <th className="py-2 pr-2 text-left">ID</th>
                  <th className="py-2 pr-2 text-left">Name</th>
                  <th className="py-2 pr-2 text-left">Type</th>
                  <th className="py-2 pr-2 text-left">Status</th>
                  <th className="py-2 pr-2" />
                </tr>
              </thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d.id} className="border-b border-slate-50">
                    <td className="py-1.5 pr-2 text-xs text-slate-500">
                      {d.id}
                    </td>
                    <td className="py-1.5 pr-2">{d.name}</td>
                    <td className="py-1.5 pr-2 text-slate-600">{d.type}</td>
                    <td className="py-1.5 pr-2">
                      <span
                        className={
                          "inline-flex px-2 py-0.5 rounded-full text-[11px] " +
                          (d.status === "Open"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600")
                        }
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-1.5 pr-2 text-right text-[11px]">
                      <button
                        type="button"
                        className="text-sky-600 hover:underline"
                        onClick={() => toggleDepartmentStatus(d.id)}
                      >
                        Toggle
                      </button>
                    </td>
                  </tr>
                ))}
                {departments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-3 text-sm text-slate-500">
                      No departments added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add department */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Add department (local only)
            </h2>
            <form
              onSubmit={addDepartment}
              className="space-y-3 text-sm max-w-md"
            >
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Department name
                </label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                  value={depName}
                  onChange={(e) => setDepName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Type
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                    value={depType}
                    onChange={(e) => setDepType(e.target.value)}
                  >
                    <option>Clinical</option>
                    <option>Support</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                    value={depStatus}
                    onChange={(e) => setDepStatus(e.target.value)}
                  >
                    <option>Open</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="mt-1 inline-flex items-center px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs hover:bg-sky-700"
              >
                Add to list (demo)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BILLING TAB */}
      {activeTab === "billing" && (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Bills list */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 lg:col-span-2">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Bills (local demo)
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-100">
                  <th className="py-2 pr-2 text-left">ID</th>
                  <th className="py-2 pr-2 text-left">Patient</th>
                  <th className="py-2 pr-2 text-left">Amount</th>
                  <th className="py-2 pr-2 text-left">Status</th>
                  <th className="py-2 pr-2" />
                </tr>
              </thead>
              <tbody>
                {bills.map((b) => (
                  <tr key={b.id} className="border-b border-slate-50">
                    <td className="py-1.5 pr-2 text-xs text-slate-500">
                      {b.id}
                    </td>
                    <td className="py-1.5 pr-2">{b.patientName}</td>
                    <td className="py-1.5 pr-2 text-slate-700">
                      ₹{b.amount.toLocaleString()}
                    </td>
                    <td className="py-1.5 pr-2">
                      <span
                        className={
                          "inline-flex px-2 py-0.5 rounded-full text-[11px] " +
                          (b.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700")
                        }
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-1.5 pr-2 text-right text-[11px]">
                      {b.status !== "Paid" && (
                        <button
                          type="button"
                          className="text-emerald-700 hover:underline mr-1"
                          onClick={() => updateBillStatus(b.id, "Paid")}
                        >
                          Mark paid
                        </button>
                      )}
                      {b.status === "Paid" && (
                        <button
                          type="button"
                          className="text-amber-700 hover:underline"
                          onClick={() => updateBillStatus(b.id, "Unpaid")}
                        >
                          Mark unpaid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {bills.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-3 text-sm text-slate-500">
                      No bills created yet in this demo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary + new bill */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-sm">
              <h2 className="text-sm font-semibold text-slate-800 mb-2">
                Billing summary (demo)
              </h2>
              <p className="text-xs text-slate-500 mb-1">
                Total in list (local memory only):
              </p>
              <p className="text-base font-semibold text-slate-800">
                ₹{totalBilling.toLocaleString()}
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Unpaid: ₹{totalUnpaid.toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-sm">
              <h2 className="text-sm font-semibold text-slate-800 mb-3">
                Create quick bill (local only)
              </h2>
              <form onSubmit={addBill} className="space-y-3 text-sm max-w-xs">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Patient name
                  </label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                    value={billPatient}
                    onChange={(e) => setBillPatient(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                    type="number"
                    min="0"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
                    value={billStatus}
                    onChange={(e) => setBillStatus(e.target.value)}
                  >
                    <option>Unpaid</option>
                    <option>Paid</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="mt-1 inline-flex items-center px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs hover:bg-sky-700"
                >
                  Add bill (demo)
                </button>
              </form>
              <p className="text-[11px] text-slate-400 mt-1">
                In production this would talk to your billing/TPA system and
                generate proper invoices.
              </p>
            </div>
          </div>
        </div>
      )}
    </HospitalLayout>
  );
}
