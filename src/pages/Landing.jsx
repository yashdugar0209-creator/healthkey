// src/pages/Landing.jsx
import React from "react";
import { Link } from "react-router-dom";
import Container from "../components/ui/Container";

const Card = ({ to = "#", title, subtitle, children }) => (
  <Link to={to} className="block group">
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200 ease-out p-8 text-center shadow-sm">
      <div className="h-20 w-20 mx-auto flex items-center justify-center rounded-full bg-white/5 mb-4">
        {children}
      </div>
      <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-white/80">{subtitle}</p>
    </div>
  </Link>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b57a6] to-[#063b78] text-white">
      <Container className="py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold drop-shadow-lg">HealthKey</h1>
          <p className="mt-3 text-lg text-white/90">Universal Health Records System for India</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <Card to="/login" title="Patient" subtitle="Login / Register">
            {/* simple patient SVG icon */}
            <svg className="h-10 w-10 opacity-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 21a7 7 0 0114 0" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Card>

          <Card to="/doctor-join" title="Doctor" subtitle="Join Network">
            <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none"><path d="M12 2v6" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/><path d="M8 6h8" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/><path d="M6 20h12" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </Card>

          <Card to="/hospital-apply" title="Hospital" subtitle="Manage Facility">
            <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="14" rx="2" stroke="#fff" strokeWidth="1.2"/><path d="M8 10h.01M12 10h.01M16 10h.01" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </Card>

          <Card to="/admin" title="Admin" subtitle="System Access">
            <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none"><rect x="7" y="10" width="10" height="6" rx="1" stroke="#fff" strokeWidth="1.2"/><path d="M12 10V8a2 2 0 10-4 0v2" stroke="#fff" strokeWidth="1.2"/></svg>
          </Card>
        </div>

<section id="features" className="py-20">
  <div className="grid md:grid-cols-3 gap-6">
    <div className="p-6 bg-white/5 rounded">Feature 1: NFC portability</div>
    <div className="p-6 bg-white/5 rounded">Feature 2: Secure sharing</div>
    <div className="p-6 bg-white/5 rounded">Feature 3: Audit logging</div>
  </div>
</section>

<section id="why" className="py-20">
  <h2 className="text-2xl font-semibold">Why HealthKey</h2>
  <p className="mt-3 text-white/80">Short bullets explaining benefits.</p>
</section>

<section id="about" className="py-20">
  <h2 className="text-2xl font-semibold">About Us</h2>
  <p className="mt-3 text-white/80">Founders, mission, contact details and links to resources.</p>
</section>

        <div className="mt-12 text-center text-white/60">
          © {new Date().getFullYear()} HealthKey India
        </div>
      </Container>
    </div>
  );
}
