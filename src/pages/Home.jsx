import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8fafc]">
      {/* HERO */}
      <section className="bg-gradient-to-b from-[#0b5ed7] to-[#083d77] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              One Health ID.<br />
              Lifetime Medical Records.
            </h1>

            <p className="mt-5 text-lg text-blue-100 max-w-xl">
              HealthKey securely connects patients, doctors, and hospitals
              through a unified digital health identity — powered by NFC and
              ABHA-ready architecture.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/register")}
                className="bg-white text-[#0b5ed7] px-6 py-3 rounded-lg font-medium hover:bg-blue-50"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="border border-white px-6 py-3 rounded-lg font-medium hover:bg-white/10"
              >
                Sign In
              </button>
            </div>
          </div>

          <div className="hidden md:flex justify-center">
            <div className="bg-white/10 rounded-2xl p-10 w-full max-w-md">
              <ul className="space-y-4 text-sm text-blue-100">
                <li>✔ Secure patient identity</li>
                <li>✔ NFC-based instant access</li>
                <li>✔ Hospital & doctor dashboards</li>
                <li>✔ ABHA-ready (India compliant)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm text-slate-600">
          <div>
            <p className="text-2xl font-semibold text-[#0b5ed7]">100%</p>
            <p>Data ownership</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-[#0b5ed7]">NFC</p>
            <p>Instant access</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-[#0b5ed7]">ABHA</p>
            <p>Ready architecture</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-[#0b5ed7]">India</p>
            <p>Healthcare focused</p>
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-slate-800 text-center">
          Built for the entire healthcare ecosystem
        </h2>
        <p className="mt-3 text-slate-500 text-center max-w-2xl mx-auto">
          HealthKey connects every stakeholder through a single, secure health
          identity.
        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-xl font-semibold text-slate-800">For Patients</h3>
            <p className="mt-3 text-sm text-slate-600">
              Carry your complete medical history securely. Share records
              instantly using NFC or HealthKey ID.
            </p>
            <button
              onClick={() => navigate("/register?role=patient")}
              className="mt-4 text-[#0b5ed7] text-sm font-medium hover:underline"
            >
              Register as Patient →
            </button>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-xl font-semibold text-slate-800">For Doctors</h3>
            <p className="mt-3 text-sm text-slate-600">
              Access patient records instantly, reduce paperwork, and deliver
              better clinical outcomes.
            </p>
            <button
              onClick={() => navigate("/register?role=doctor")}
              className="mt-4 text-[#0b5ed7] text-sm font-medium hover:underline"
            >
              Register as Doctor →
            </button>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-xl font-semibold text-slate-800">For Hospitals</h3>
            <p className="mt-3 text-sm text-slate-600">
              Centralize patient data, streamline admissions, and enable
              ABHA-aligned digital workflows.
            </p>
            <button
              onClick={() => navigate("/register?role=hospital")}
              className="mt-4 text-[#0b5ed7] text-sm font-medium hover:underline"
            >
              Register Hospital →
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-semibold text-slate-800">
              Designed for real hospitals
            </h2>
            <p className="mt-4 text-slate-600">
              HealthKey is not a consumer app — it is an infrastructure layer
              built for Indian healthcare compliance, scalability, and trust.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>• NFC-based patient identification</li>
              <li>• Role-based dashboards</li>
              <li>• ABHA integration readiness</li>
              <li>• Secure & consent-driven architecture</li>
            </ul>
          </div>

          <div className="bg-[#f8fafc] rounded-xl border p-6">
            <p className="text-sm text-slate-500">
              “A single digital identity for healthcare simplifies access,
              improves outcomes, and builds trust.”
            </p>
            <p className="mt-4 text-sm font-medium text-slate-700">
              — HealthKey Vision
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#083d77] text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 text-center">
          <h2 className="text-3xl font-semibold">
            Start your HealthKey journey today
          </h2>
          <p className="mt-3 text-blue-100">
            Simple onboarding. Secure by design. Built for India.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="mt-6 bg-white text-[#083d77] px-8 py-3 rounded-lg font-medium hover:bg-blue-50"
          >
            Create Account
          </button>
        </div>
      </section>
    </div>
  );
}
