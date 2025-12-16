import PublicLayout from "../components/PublicLayout";

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          About HealthKey
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          HealthKey is India’s digital health identity platform enabling secure,
          NFC-based, ABHA-ready access to patient medical records across hospitals.
        </p>
      </section>

      {/* Vision */}
      <section className="grid md:grid-cols-2 gap-10 mb-20">
        <div>
          <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
          <p className="text-slate-600">
            To become the backbone of India’s digital healthcare ecosystem by
            simplifying patient identification, improving emergency care access,
            and ensuring interoperability across hospitals.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Why HealthKey</h2>
          <ul className="space-y-2 text-slate-600 list-disc list-inside">
            <li>Instant patient identification via NFC</li>
            <li>ABHA & NDHM aligned architecture</li>
            <li>Hospital, doctor & patient dashboards</li>
            <li>Secure, audit-ready medical data</li>
          </ul>
        </div>
      </section>

      {/* Stats */}
      <section className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-8 rounded-xl">
        {[
          ["Hospitals", "100+"],
          ["Doctors", "2,000+"],
          ["Patients", "1M+"],
          ["Security", "HIPAA-Inspired"],
        ].map(([label, value]) => (
          <div key={label} className="text-center">
            <div className="text-3xl font-bold text-blue-600">{value}</div>
            <div className="text-slate-600">{label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
