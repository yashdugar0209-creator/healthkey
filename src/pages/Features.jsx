import PublicLayout from "../components/PublicLayout";

export default function Features() {
  const features = [
    {
      title: "NFC Health Cards",
      desc: "Tap-to-access patient profile, allergies, emergency data.",
    },
    {
      title: "ABHA Ready",
      desc: "Designed for ABDM & future government integrations.",
    },
    {
      title: "Hospital Dashboards",
      desc: "Admissions, beds, billing, analytics in one place.",
    },
    {
      title: "Doctor Workspace",
      desc: "Queue, consultations, prescriptions, telemedicine.",
    },
    {
      title: "Patient Control",
      desc: "Consent-based access to medical records.",
    },
    {
      title: "Security & Audit",
      desc: "Role-based access, logs, HIPAA-inspired controls.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <section className="mb-14">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Platform Features
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Everything hospitals need to deliver faster, safer, digital healthcare.
        </p>
      </section>

      {/* Feature Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="border rounded-xl p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-slate-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mt-20 bg-blue-600 text-white rounded-xl p-10 text-center">
        <h2 className="text-2xl font-bold mb-3">
          Ready to digitize your hospital?
        </h2>
        <p className="opacity-90 mb-6">
          Start with HealthKey NFC and dashboards today.
        </p>
        <a
          href="/register"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-medium"
        >
          Get Started
        </a>
      </section>
    </div>
  );
}
