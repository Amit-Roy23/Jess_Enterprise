import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import Logo from "./Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-slate-300 border-t border-slate-800">
      {/* Registration & Trust Banner */}
      <div className="bg-[#13335e] border-b border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3 bg-[#0d2140]/60 p-4 rounded-lg border border-blue-900/50">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Legal Metrology Authorised
              </h4>
              <p className="text-xs text-blue-200 mt-1">
                Govt. Licence No:{" "}
                <span className="font-mono font-bold text-white">
                  22000126-CLM
                </span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Stamping, Verification & AMC Services
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#0d2140]/60 p-4 rounded-lg border border-blue-900/50">
            <Award className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                GST Registered
              </h4>
              <p className="text-xs text-blue-200 mt-1">
                GSTIN:{" "}
                <span className="font-mono font-bold text-white">
                  30AZCPG5317P1ZG
                </span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Compliant B2B Invoicing & E-Way Bills
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#0d2140]/60 p-4 rounded-lg border border-blue-900/50">
            <CheckCircle2 className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                MSME Udyam Registered
              </h4>
              <p className="text-xs text-blue-200 mt-1">
                Udyam:{" "}
                <span className="font-mono font-bold text-white">
                  UDYAM-GA-01-0024091
                </span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Micro Enterprise • Goa, India
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: About & Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="footer" size="lg" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Jess Enterprises is a trusted Goa-based supplier of high-precision
              laboratory instruments, government-authorised Legal Metrology
              services, and custom engineering fabrication (SS, MS, Acrylic,
              PVC, Teflon, Polycarbonate).
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Serving Pharma, Chemical, Research & Industrial Units across Goa</span>
              </div>
            </div>
          </div>

          {/* Col 2: Verticals */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Our Verticals
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/services#legal-metrology"
                  className="hover:text-white transition-colors"
                >
                  Legal Metrology Services
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  Lab Instruments & Balances
                </Link>
              </li>
              <li>
                <Link
                  href="/services#amc"
                  className="hover:text-white transition-colors"
                >
                  Balance AMC & Calibration
                </Link>
              </li>
              <li>
                <Link
                  href="/fabrication"
                  className="hover:text-white transition-colors"
                >
                  Custom Fabrication Works
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=weights-calibration"
                  className="hover:text-white transition-colors"
                >
                  E1, E2, F1, F2 Certified Weights
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Our Company
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  Product Catalogue
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  Service Offerings
                </Link>
              </li>
              <li>
                <Link
                  href="/fabrication"
                  className="hover:text-white transition-colors"
                >
                  Fabrication Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/clients"
                  className="hover:text-white transition-colors"
                >
                  Trusted Clients
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-white transition-colors">
                  Request a Quote Basket
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Contact Us
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Mobile / WhatsApp:</p>
                <a
                  href="tel:9158391519"
                  className="text-white hover:text-blue-300 font-semibold flex items-center gap-1.5 mt-0.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  +91 91583 91519
                </a>
              </div>

              <div>
                <p className="text-xs text-slate-400">Office Phone:</p>
                <a
                  href="tel:9225901519"
                  className="text-white hover:text-blue-300 font-semibold flex items-center gap-1.5 mt-0.5"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  +91 92259 01519
                </a>
              </div>

              <div>
                <p className="text-xs text-slate-400">Email Address:</p>
                <a
                  href="mailto:jess.enterprises14@gmail.com"
                  className="text-white hover:text-blue-300 break-all flex items-center gap-1.5 mt-0.5"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  jess.enterprises14@gmail.com
                </a>
              </div>

              <div className="pt-1">
                <p className="text-xs text-slate-400">Location:</p>
                <p className="text-white flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  Goa, India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {currentYear} Jess Enterprises. All rights reserved. Innovative
            Services.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link
              href="/admin/login"
              className="hover:text-slate-300 text-slate-500 transition-colors flex items-center gap-1"
            >
              <span>Admin</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
