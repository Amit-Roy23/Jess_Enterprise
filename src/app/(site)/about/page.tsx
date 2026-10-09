import React from "react";
import type { Metadata } from "next";
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  MapPin,
  Scale,
  FlaskConical,
  Wrench,
  Phone,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us | Jess Enterprises Goa",
  description:
    "Learn about Jess Enterprises, Goa's trusted supplier of laboratory instruments, government-authorised Legal Metrology service provider, and custom fabrication workshop.",
};

export default function AboutPage() {
  const industrialZones = [
    "Verna Industrial Estate",
    "Kundaim Industrial Estate",
    "Pilerne Industrial Estate",
    "Tuem Electronic City",
    "Madkai Industrial Estate",
    "Corlim Industrial Estate",
    "Sancoale Industrial Estate",
    "Tivim Industrial Estate",
    "Bicholim Industrial Estate",
    "Margao & Vasco Commercial Centers",
  ];

  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* 1. Header & Company Mission */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Badge variant="primary" className="uppercase tracking-wider font-bold">
          About Jess Enterprises
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Delivering Innovative Services & Precision Standards in Goa
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-2">
          Jess Enterprises is a professional company established to deliver the best
          services to its clients, looking forward to mutually beneficial business
          associations with organisations.
        </p>
      </div>

      {/* 2. Statutory Registrations & Credentials Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="secondary" className="mb-2 uppercase text-[10px] font-bold">
            Compliance & Registrations
          </Badge>
          <h2 className="text-2xl font-bold text-slate-900">
            Official Statutory Accreditations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fully certified and authorized to conduct official weights & measures operations across Goa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
            <ShieldCheck className="w-8 h-8 text-[#1e5aa8]" />
            <div>
              <span className="text-xs font-bold text-[#1e5aa8] uppercase tracking-wider">
                Government Licence
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Legal Metrology Authorised
              </h3>
            </div>
            <p className="font-mono text-sm font-bold text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-blue-200 inline-block">
              22000126-CLM
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Officially authorised for statutory weighing balance stamping, verification, and calibration.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <Award className="w-8 h-8 text-blue-600" />
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tax Compliance
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                GST Registered Enterprise
              </h3>
            </div>
            <p className="font-mono text-sm font-bold text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 inline-block">
              30AZCPG5317P1ZG
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compliant B2B invoicing, E-Way bills, and input tax credit benefits for all corporate accounts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
            <CheckCircle2 className="w-8 h-8 text-amber-600" />
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Government of India
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                MSME Udyam Registration
              </h3>
            </div>
            <p className="font-mono text-sm font-bold text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-amber-200 inline-block">
              UDYAM-GA-01-0024091
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Registered Micro Enterprise providing agile local support and rapid delivery turnaround.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Three Business Verticals Breakdown */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Our Three Dedicated Divisions
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Integrated capabilities bridging high-precision instrumentation, statutory metrology, and custom fabrication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1e5aa8] flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              1. Legal Metrology – Authorised
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Balance AMC contracts, Legal Metrology (L&M) statutory stamping /
              verification, anti-vibration balance tables, balance printers, new
              balances and moisture analyzers, new weights, and weights with NABL
              calibration certificates.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1e5aa8] flex items-center justify-center">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              2. Lab Instruments & Accessories
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sales, service and AMC of lab and industrial balances, instruments
              and accessories including UV-Vis spectrophotometers, TOC analyzers,
              N2/H2/air generators, ice flakers, viscometers, polarimeters, and
              centrifuges.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1e5aa8] flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              3. Custom Fabrication Work
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Acrylic, PVC, Teflon, Polycarbonate, SS (Stainless Steel) and MS (Mild
              Steel) fabrication to customer specifications: 60/72 HPLC column
              storage cabinets, trays, balance enclosures, weighing tables, and SS
              vessels.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Service Area */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Local Service Reach</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Serving Industrial Belts Across Goa and Neighboring Regions
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Our service engineers provide on-site calibration visits, emergency breakdown assistance, and direct delivery across all major industrial estates in Goa:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {industrialZones.map((zone, idx) => (
            <div
              key={idx}
              className="bg-white/10 rounded-xl p-3 text-xs font-semibold text-slate-200 border border-white/10 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>{zone}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Contact Call to Action */}
      <div className="text-center bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 space-y-6 max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-slate-900">
          Partner with Jess Enterprises
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Contact our office in Goa to discuss annual maintenance contracts, statutory Legal Metrology verification, or bespoke fabrication projects.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="tel:9158391519">
            <Button variant="primary" className="gap-2">
              <Phone className="w-4 h-4" />
              <span>Call +91 91583 91519</span>
            </Button>
          </a>
          <a href="mailto:jess.enterprises14@gmail.com">
            <Button variant="outline" className="gap-2">
              <Mail className="w-4 h-4" />
              <span>Email Our Office</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
