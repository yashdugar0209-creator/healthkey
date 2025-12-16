export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-2">HealthKey</h3>
          <p className="text-sm text-slate-400">
            India’s digital health identity platform enabling NFC, ABHA-ready,
            secure patient data access across hospitals.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-medium mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-white">About us</a></li>
            <li><a href="/features" className="hover:text-white">Features</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Solutions */}
        <div>
          <h4 className="text-white font-medium mb-3">Solutions</h4>
          <ul className="space-y-2 text-sm">
            <li>Hospitals</li>
            <li>Doctors</li>
            <li>Patients</li>
            <li>NFC Health Cards</li>
          </ul>
        </div>

        {/* Compliance */}
        <div>
          <h4 className="text-white font-medium mb-3">Compliance</h4>
          <ul className="space-y-2 text-sm">
            <li>ABHA Ready</li>
            <li>NDHM Aligned</li>
            <li>Data Security</li>
            <li>HIPAA-inspired</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-700 text-center text-xs py-4 text-slate-500">
        © {new Date().getFullYear()} HealthKey. All rights reserved.
      </div>
    </footer>
  );
}
