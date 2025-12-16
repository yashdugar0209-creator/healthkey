import PublicLayout from "../components/PublicLayout";

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-slate-600">
          Reach out to HealthKey for demos, partnerships, or support.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">HealthKey HQ</h2>
          <ul className="space-y-3 text-slate-600">
            <li><strong>Email:</strong> contact@healthkey.in</li>
            <li><strong>Phone:</strong> +91-XXXXXXXXXX</li>
            <li><strong>Location:</strong> India</li>
          </ul>

          <div className="mt-8">
            <h3 className="font-semibold mb-2">Business Enquiries</h3>
            <p className="text-slate-600">
              Hospitals, enterprises & government partnerships welcome.
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="bg-slate-50 p-8 rounded-xl space-y-4">
          <input
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Your name"
          />
          <input
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Email address"
          />
          <input
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Organization"
          />
          <textarea
            rows="4"
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Message"
          />
          <button
            type="button"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
}
