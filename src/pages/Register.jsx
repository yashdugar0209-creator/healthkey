// src/pages/Register.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

/*
  Register.jsx
  - Role-specific fields (patient, doctor, hospital)
  - NFC scan simulator and manual NFC ID field
  - POST /api/auth/register (server) with demo fallback
*/

const ROLE_OPTIONS = [
  { value: "patient", label: "Patient" },
  { value: "doctor", label: "Doctor" },
  { value: "hospital", label: "Hospital" },
];

export default function Register() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");

  // Shared fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fullName, setFullName] = useState("");

  // Patient-specific
  const [mobile, setMobile] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [dob, setDob] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [nfcId, setNfcId] = useState("");

  // Doctor-specific
  const [qualification, setQualification] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [medicalRegistrationNo, setMedicalRegistrationNo] = useState("");
  const [experienceYears, setExperienceYears] = useState("");

  // Hospital-specific
  const [hospitalName, setHospitalName] = useState("");
  const [govRegNo, setGovRegNo] = useState("");
  const [hospitalPhone, setHospitalPhone] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  // NFC demo
  const simulateNfc = () => {
    const id = "HK-" + Math.floor(100000 + Math.random() * 900000);
    setNfcId(id);
    setInfoMsg("Demo: NFC card simulated. Form autofilled where applicable.");
    // for demo, we could fill patient name/mobile if empty (optional)
    if (role === "patient") {
      if (!fullName) setFullName("Demo Patient");
      if (!mobile) setMobile("9999999999");
    }
  };

  const clearNfc = () => {
    setNfcId("");
    setInfoMsg("");
  };

  useEffect(() => {
    setErrorMsg("");
    setInfoMsg("");
  }, [role]);

  const validate = () => {
    if (!email.trim()) return "Email is required.";
    if (!fullName.trim()) return "Full name is required.";
    if (!password) return "Password is required.";
    if (password !== confirm) return "Passwords do not match.";
    if (role === "patient") {
      if (!mobile.trim()) return "Patient mobile number is required.";
      // aadhar optional but if provided, do length check
      if (aadhar && aadhar.replace(/\D/g, "").length < 12) return "Aadhar must be 12 digits.";
    }
    if (role === "doctor") {
      if (!medicalRegistrationNo.trim()) return "Medical registration number is required for doctors.";
      if (!speciality.trim()) return "Speciality is required.";
    }
    if (role === "hospital") {
      if (!govRegNo.trim()) return "Hospital government registration number is required.";
      if (!hospitalName.trim()) return "Hospital name is required.";
    }
    return null;
  };

  const submitDemoSave = async (payload) => {
    // Demo fallback: optionally sign in automatically or redirect to login
    setInfoMsg("Server unreachable — demo registration succeeded locally.");
    // Optionally sign in user in demo mode
    try {
      await auth.login({ email: payload.email, role: role, name: payload.fullName });
    } catch {
      // ignore
    }
    setTimeout(() => navigate("/login"), 1200);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }
    setLoading(true);

    const body = {
      email: email.trim(),
      password,
      role,
      fullName: fullName.trim(),
      nfcId: nfcId || null,
    };

    if (role === "patient") {
      body.patient = {
        mobile,
        aadhar,
        dob,
        bloodGroup,
        allergies,
        emergencyContact,
      };
    } else if (role === "doctor") {
      body.doctor = {
        qualification,
        speciality,
        medicalRegistrationNo,
        experienceYears,
      };
    } else if (role === "hospital") {
      body.hospital = {
        hospitalName,
        govRegNo,
        hospitalPhone,
        hospitalAddress,
      };
    }

    try {
      const resp = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (resp.ok) {
        setInfoMsg("Registration successful. Redirecting to sign in...");
        // auto-redirect to login after small delay
        setTimeout(() => navigate("/login"), 1200);
        return;
      }

      // read server response message
      const js = await resp.json().catch(() => ({}));
      if (resp.status === 409) {
        setErrorMsg(js.message || "Account already exists with that email.");
      } else if (resp.status === 422) {
        setErrorMsg(js.message || "Invalid registration data.");
      } else {
        setErrorMsg(js.message || `Registration failed (${resp.status}).`);
      }
    } catch (err) {
      // server unreachable -> demo fallback
      console.warn("Register network error:", err);
      await submitDemoSave({
        email: body.email,
        fullName: body.fullName,
      });
    } finally {
      setLoading(false);
    }
  };

  // small role-specific subforms
  const PatientFields = () => (
    <>
      <label className="block text-sm text-slate-600 mt-3">Mobile number</label>
      <input value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full px-3 py-2 rounded-md border" placeholder="+91…" />

      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <label className="block text-sm text-slate-600">Aadhar (optional)</label>
          <input value={aadhar} onChange={(e) => setAadhar(e.target.value)} className="w-full px-3 py-2 rounded-md border" placeholder="1234 5678 9012" />
        </div>
        <div>
          <label className="block text-sm text-slate-600">DOB</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full px-3 py-2 rounded-md border" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <label className="block text-sm text-slate-600">Blood group</label>
          <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full px-3 py-2 rounded-md border">
            <option value="">Select</option>
            <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
            <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-600">Emergency contact</label>
          <input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} className="w-full px-3 py-2 rounded-md border" placeholder="Name — mobile" />
        </div>
      </div>

      <label className="block text-sm text-slate-600 mt-3">Known allergies (comma separated)</label>
      <input value={allergies} onChange={(e) => setAllergies(e.target.value)} className="w-full px-3 py-2 rounded-md border" placeholder="Penicillin, Peanuts…" />
    </>
  );

  const DoctorFields = () => (
    <>
      <label className="block text-sm text-slate-600 mt-3">Medical registration no.</label>
      <input value={medicalRegistrationNo} onChange={(e) => setMedicalRegistrationNo(e.target.value)} className="w-full px-3 py-2 rounded-md border" placeholder="MRN / MCI number" />

      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <label className="block text-sm text-slate-600">Qualification</label>
          <input value={qualification} onChange={(e) => setQualification(e.target.value)} className="w-full px-3 py-2 rounded-md border" placeholder="MBBS, MD…" />
        </div>
        <div>
          <label className="block text-sm text-slate-600">Speciality</label>
          <input value={speciality} onChange={(e) => setSpeciality(e.target.value)} className="w-full px-3 py-2 rounded-md border" placeholder="Cardiology, Medicine…" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <label className="block text-sm text-slate-600">Experience (years)</label>
          <input type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} className="w-full px-3 py-2 rounded-md border" />
        </div>
      </div>
    </>
  );

  const HospitalFields = () => (
    <>
      <label className="block text-sm text-slate-600 mt-3">Hospital name</label>
      <input value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} className="w-full px-3 py-2 rounded-md border" placeholder="CityCare Hospital" />

      <label className="block text-sm text-slate-600 mt-3">Government registration no.</label>
      <input value={govRegNo} onChange={(e) => setGovRegNo(e.target.value)} className="w-full px-3 py-2 rounded-md border" placeholder="State health registry / registration no." />

      <label className="block text-sm text-slate-600 mt-3">Hospital phone</label>
      <input value={hospitalPhone} onChange={(e) => setHospitalPhone(e.target.value)} className="w-full px-3 py-2 rounded-md border" placeholder="+91…" />

      <label className="block text-sm text-slate-600 mt-3">Hospital address</label>
      <textarea value={hospitalAddress} onChange={(e) => setHospitalAddress(e.target.value)} className="w-full px-3 py-2 rounded-md border" rows={3} placeholder="Full postal address" />
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#042E52] to-[#083659] flex items-center py-12">
      <Container className="py-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/5 rounded-2xl p-6 shadow-lg mb-6 text-white/90 hidden md:block">
            <h2 className="text-2xl font-extrabold">Create your account</h2>
            <p className="text-sm text-white/80">Please provide accurate information. For patients with NFC cards, scan to auto-fill available fields.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <form onSubmit={onSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600">Full name</label>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 rounded-md border" placeholder="Your full name" required />
                </div>

                <div>
                  <label className="block text-sm text-slate-600">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-md border" placeholder="you@example.com" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-sm text-slate-600">Register as</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 rounded-md border">
                    {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-600">NFC card ID (if any)</label>
                  <div className="flex items-center gap-2">
                    <input value={nfcId} onChange={(e) => setNfcId(e.target.value)} className="flex-1 px-3 py-2 rounded-md border" placeholder="HK-xxxxx (scan or enter manually)" />
                    <button type="button" onClick={simulateNfc} className="inline-flex items-center px-3 py-2 rounded bg-sky-600 text-white">Scan NFC</button>
                    <button type="button" onClick={clearNfc} className="inline-flex items-center px-2 py-2 rounded border">Clear</button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">If you don't have a card, the facility can order one later.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-sm text-slate-600">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-md border" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-600">Confirm password</label>
                  <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full px-3 py-2 rounded-md border" required />
                </div>
              </div>

              {/* Role-specific */}
              <div className="mt-3">
                {role === "patient" && <PatientFields />}
                {role === "doctor" && <DoctorFields />}
                {role === "hospital" && <HospitalFields />}
              </div>

              {errorMsg && <div className="mt-4 text-sm text-rose-700 bg-rose-50 p-2 rounded">{errorMsg}</div>}
              {infoMsg && <div className="mt-4 text-sm text-slate-700 bg-slate-50 p-2 rounded">{infoMsg}</div>}

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  By registering you agree to our terms. This demo does not create real users unless connected to a backend.
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => navigate("/login")} className="text-sm text-sky-600 hover:underline">Sign in</button>
                  <Button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</Button>
                </div>
              </div>
            </form>
          </div>

          <div className="text-center text-sm text-white/70 mt-4">
            Already have an account? <button onClick={() => navigate("/login")} className="underline">Sign in</button>
          </div>
        </div>
      </Container>
    </div>
  );
}
