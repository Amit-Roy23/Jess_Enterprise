import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, ShieldCheck, Receipt, Factory, ArrowUpRight, Clock } from "lucide-react";
import Logo from "./Logo";
import { CONTACT, whatsappLink } from "@/lib/contact";

const SERVICES = [
  { name: "Legal Metrology Stamping", href: "/services/legal-metrology-stamping" },
  { name: "Balance AMC & Repairs", href: "/services/balance-amc" },
  { name: "Certified Standard Weights", href: "/services/calibration-certified-weights" },
  { name: "Lab Instrument Sales", href: "/products" },
  { name: "Custom Fabrication", href: "/fabrication" },
];

const COMPANY = [
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Our Clients", href: "/clients" },
  { name: "Request a Quote", href: "/quote" },
  { name: "Contact", href: "/contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#0b1f3a] text-slate-300 print:hidden">
      <div className="absolute inset-0 bg-grid-light opacity-60" aria-hidden="true" />
      <div
        className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#1e5aa8]/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-5">
            <Logo variant="footer" size="lg" />
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              A professional company established to deliver the best services to its clients — lab
              instruments, legal metrology and custom fabrication, all under one roof in Goa.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Lic. 22000126-CLM
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
                <Receipt className="h-3.5 w-3.5 text-blue-300" /> GST 30AZCPG5317P1ZG
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
                <Factory className="h-3.5 w-3.5 text-amber-300" /> MSME UDYAM-GA-01-0024091
              </span>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Services</h3>
            <ul className="space-y-2.5 text-sm">
              {SERVICES.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group inline-flex items-center gap-1 hover:text-white transition-colors">
                    {l.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              {COMPANY.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Get in touch</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${CONTACT.office}`} className="flex items-start gap-3 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 mt-0.5 text-blue-300 shrink-0" />
                  <span>
                    +91 92259 01519 <span className="text-slate-500">(Office)</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT.mobile}`} className="flex items-start gap-3 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 mt-0.5 text-blue-300 shrink-0" />
                  <span>+91 91583 91519</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-start gap-3 hover:text-white transition-colors break-all">
                  <Mail className="h-4 w-4 mt-0.5 text-blue-300 shrink-0" />
                  <span>{CONTACT.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-red-400 shrink-0" />
                <span>Goa, India</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-0.5 text-blue-300 shrink-0" />
                <span>Mon – Sat: 9:00 AM – 6:30 PM</span>
              </li>
            </ul>
            <a
              href={whatsappLink("Hello Jess Enterprises, I would like to enquire about your products and services.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition-transform hover:-translate-y-0.5"
            >
              WhatsApp us
            </a>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {year} Jess Enterprises, Goa. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms</Link>
            <Link href="/admin/login" className="hover:text-slate-300">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
