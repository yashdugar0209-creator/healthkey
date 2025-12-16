import React from 'react';
import { Heart, Shield, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold">HealthKey</span>
                <span className="text-slate-300">.in</span>
              </div>
            </div>
            <p className="text-slate-300 mb-6">
              India's first NFC-based unified health record system. 
              Empowering patients with digital health sovereignty.
            </p>
            <div className="flex items-center gap-2 text-slate-300">
              <Shield className="w-5 h-5" />
              <span className="text-sm">GDPR & HIPAA Compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="text-slate-300 hover:text-white transition-colors">
                  Hospitals
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-slate-300 hover:text-white transition-colors">
                  Doctors
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/digital-health-card" className="text-slate-300 hover:text-white transition-colors">
                  Digital Health Card
                </Link>
              </li>
              <li>
                <Link to="/services/medical-records" className="text-slate-300 hover:text-white transition-colors">
                  Medical Records
                </Link>
              </li>
              <li>
                <Link to="/services/telemedicine" className="text-slate-300 hover:text-white transition-colors">
                  Telemedicine
                </Link>
              </li>
              <li>
                <Link to="/services/emergency" className="text-slate-300 hover:text-white transition-colors">
                  Emergency Access
                </Link>
              </li>
              <li>
                <Link to="/services/insurance" className="text-slate-300 hover:text-white transition-colors">
                  Insurance Integration
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-1" />
                <span className="text-slate-300">
                  HealthKey India,<br />
                  New Delhi, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300">+91 1800-123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300">support@healthkey.in</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="font-bold mb-3">Follow Us</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 hover:bg-sky-500 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm">
              © {currentYear} HealthKey India. All rights reserved.
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-slate-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-slate-400 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-slate-400 hover:text-white text-sm">
                Cookie Policy
              </Link>
              <Link to="/security" className="text-slate-400 hover:text-white text-sm">
                Security
              </Link>
            </div>
          </div>
        </div>

        {/* Government Compliance */}
        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-slate-300 text-center md:text-left mb-4 md:mb-0">
              HealthKey is compliant with the Government of India's Digital Health Mission 
              and follows all healthcare data protection guidelines.
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs text-slate-400">ISO Certified</div>
                <div className="font-bold">27001:2013</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400">HIPAA</div>
                <div className="font-bold">Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400">NDHM</div>
                <div className="font-bold">Aligned</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;