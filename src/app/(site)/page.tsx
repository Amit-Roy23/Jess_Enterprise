import React from "react";
import Link from "next/link";
import {
  Scale,
  FlaskConical,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Phone,
  FileText,
  Award,
  Layers,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/site/ProductCard";
import ClientShowcase from "@/components/site/ClientShowcase";
import {
  getProducts,
  getClients,
  getSiteSettings,
} from "@/server/queries";

export const revalidate = 60; // Revalidate public homepage every 60s

export default async function HomePage() {
  const [featuredProducts, clients, settings] = await Promise.all([
    getProducts({ featuredOnly: true, limit: 8 }),
    getClients(),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0d2140] via-[#13335e] to-[#1e5aa8] text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* Compliance Licence Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  Authorised Legal Metrology Licence:{" "}
                  <strong className="text-white font-mono">
                    {settings.licenceNumber || "22000126-CLM"}
                  </strong>
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
                Precision Lab Instruments & Authorised Legal Metrology in Goa
              </h1>

              <p className="text-lg sm:text-xl text-blue-100 font-normal leading-relaxed max-w-2xl">
                {settings.tagline || "Innovative Services"} — Delivering
                certified laboratory balances, UV-Vis spectrophotometers, NABL
                standard weights, statutory stamping, and custom cleanroom
                fabrication across Goa and Western India.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-white text-[#1e5aa8] hover:bg-blue-50 font-bold px-7 shadow-lg"
                  >
                    <span>Browse Products</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                <Link href="/quote">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/40 text-white bg-white/10 hover:bg-white/20 font-semibold"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Request a Quote
                  </Button>
                </Link>

                <a href={`tel:${settings.phones?.mobile || "9158391519"}`}>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-white hover:bg-white/10"
                  >
                    <Phone className="w-4 h-4 mr-2 text-emerald-400" />
                    +91 {settings.phones?.mobile || "9158391519"}
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Quick Summary Card */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-200 border-b border-white/10 pb-3">
                Quick Service Credentials
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Authorised Legal Metrology:</strong>
                    <p className="text-blue-100">
                      Balance AMC & Govt. Stamping / Verification
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Certified Standards:</strong>
                    <p className="text-blue-100">
                      NABL accredited E1, E2, F1, F2 reference weights
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Bespoke Workshop:</strong>
                    <p className="text-blue-100">
                      SS, MS, Acrylic, PVC, Teflon, Polycarbonate fabrication
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between bg-white text-[#1e5aa8] border-none font-bold text-xs"
                  >
                    <span>Schedule an Engineer Visit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statutory Badges & Trust Strip */}
      <section className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 border-r border-slate-100 last:border-none">
            <p className="text-xl sm:text-2xl font-black text-[#1e5aa8]">
              22000126-CLM
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              Authorised Metrology Licence
            </p>
          </div>
          <div className="p-3 border-r border-slate-100 last:border-none">
            <p className="text-xl sm:text-2xl font-black text-[#1e5aa8]">
              30AZCPG5317P1ZG
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              GST Registered Compliance
            </p>
          </div>
          <div className="p-3 border-r border-slate-100 last:border-none">
            <p className="text-xl sm:text-2xl font-black text-[#1e5aa8]">
              UDYAM-GA-01
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              MSME Micro Enterprise
            </p>
          </div>
          <div className="p-3">
            <p className="text-xl sm:text-2xl font-black text-[#1e5aa8]">
              18+ Major Pharma
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              Trusted Industry Clients
            </p>
          </div>
        </div>
      </section>

      {/* 3. Three Dedicated Verticals */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="primary" className="mb-2 uppercase tracking-wider font-bold">
              Core Divisions
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Three Comprehensive Business Verticals
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              Serving pharmaceuticals, industrial manufacturing, QC labs, and research
              institutions across Goa with certified standards and custom engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vertical 1: Legal Metrology */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1e5aa8] flex items-center justify-center mb-6">
                  <Scale className="w-6 h-6" />
                </div>
                <Badge variant="accent" className="mb-3 text-[11px]">
                  Authorised Licence No. 22000126-CLM
                </Badge>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Legal Metrology Services
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Statutory government verification, periodic re-stamping, and Annual
                  Maintenance Contracts (AMC) for laboratory and industrial weighing balances.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Balance AMC & Preventive Calibration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Legal Metrology (L&M) Stamping & Verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>NABL Certified Standard Weights (E1, E2, F1, F2)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Anti-vibration pads & balance printers</span>
                  </li>
                </ul>
              </div>
              <Link href="/services#legal-metrology">
                <Button variant="primary" className="w-full justify-between">
                  <span>Explore Metrology Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Vertical 2: Lab Instruments */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1e5aa8] flex items-center justify-center mb-6">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <Badge variant="default" className="mb-3 text-[11px]">
                  Sales, Service & AMC
                </Badge>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Lab Instruments & Balances
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Supply and maintenance of high-precision spectrophotometers, TOC
                  analyzers, viscometers, polarimeters, refractometers, centrifuges, and gas
                  generators.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Nano Bio-Spectrophotometers (UV-Vis)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Ion / pH / Conductivity / TDS / DO Multi-meters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>N2 / H2 / Zero Air Laboratory Gas Generators</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Microprocessor Ice Flakers & Ultrasonic Baths</span>
                  </li>
                </ul>
              </div>
              <Link href="/products">
                <Button variant="primary" className="w-full justify-between">
                  <span>View Product Catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Vertical 3: Custom Fabrication */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1e5aa8] flex items-center justify-center mb-6">
                  <Wrench className="w-6 h-6" />
                </div>
                <Badge variant="secondary" className="mb-3 text-[11px]">
                  Custom Workshop Engineering
                </Badge>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Bespoke Fabrication Works
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Precision engineering in Acrylic, PVC, Teflon, Polycarbonate, Stainless
                  Steel (SS), and Mild Steel (MS) crafted exactly to customer drawings.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>HPLC Column Storage Cabinets (60 & 72 cols)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Anti-vibration Granite Balance Tables</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cleanroom SS Vessels, Drum Trolleys & Trays</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Transparent Acrylic Glove Boxes & Hoods</span>
                  </li>
                </ul>
              </div>
              <Link href="/fabrication">
                <Button variant="primary" className="w-full justify-between">
                  <span>Explore Fabrication Works</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Products Section */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <Badge variant="default" className="mb-2 uppercase tracking-wider font-bold">
                Featured Instruments
              </Badge>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                High-Precision Laboratory & Metrology Equipment
              </h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Selected analytical instruments and calibration standards ready for immediate quotation.
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="gap-2 font-semibold text-xs whitespace-nowrap">
                <span>View Full Catalogue (25+ Products)</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const cat = product.category as unknown as { name?: string; slug?: string } | undefined;
              return (
                <ProductCard
                  key={String(product._id || product.slug)}
                  id={String(product._id || product.slug)}
                  name={product.name}
                  slug={product.slug}
                  categoryName={cat?.name}
                  categorySlug={cat?.slug}
                  shortDescription={product.shortDescription}
                  specs={product.specs}
                  images={product.images}
                  needsReview={product.needsReview}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us / Value Proposition */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[#0d2140] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="accent" className="mb-2 uppercase tracking-wider font-bold">
              The Jess Advantage
            </Badge>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Why Pharma & Research Labs Trust Jess Enterprises
            </h2>
            <p className="text-blue-200 mt-3 text-sm">
              End-to-end technical reliability, statutory licensing, and custom workshop precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Authorised Legal Metrology Licence
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Direct government-authorised stamping and verification (Licence No. 22000126-CLM) ensures total compliance with statutory metrology laws and zero audit penalties.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                NABL Certified Reference Weights
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Every E1, E2, F1, and F2 class weight supplied is backed by accredited NABL calibration certificates for seamless acceptance during USFDA, MHRA, and WHO audits.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Local Goa AMC & Rapid Response
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Based locally in Goa, our trained engineers guarantee fast turnaround for preventive balance maintenance, calibration verification, and emergency service calls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Custom Fabrication Showcase Strip */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Badge variant="secondary" className="mb-2 uppercase tracking-wider font-bold">
                Custom Engineering
              </Badge>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Fabrication to Customer Specifications
              </h2>
              <p className="text-slate-600 mt-2 text-sm">
                Cleanroom HPLC storage cabinets, balance tables, sampling hoods, and chemical baths.
              </p>
            </div>
            <Link href="/fabrication">
              <Button variant="primary" size="sm" className="gap-2">
                <span>View Full Fabrication Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
            {["SS 304 / 316", "Mild Steel (MS)", "Acrylic (PMMA)", "Rigid PVC", "Virgin Teflon", "Polycarbonate"].map(
              (mat, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <Layers className="w-5 h-5 text-[#1e5aa8] mb-2" />
                  <span className="text-xs font-bold text-slate-800">{mat}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* 7. Trusted By Clients */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="outline" className="mb-2 uppercase tracking-wider font-bold">
              Industry Partnerships
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Trusted By Leading Pharma & Research Institutions
            </h2>
            <p className="text-slate-600 mt-2 text-sm">
              We proudly supply and service precision instruments for premier manufacturing and academic organizations across Goa and neighboring regions.
            </p>
          </div>

          <ClientShowcase clients={clients} />
        </div>
      </section>

      {/* 8. Final Call to Action Band */}
      <section className="bg-gradient-to-r from-[#13335e] via-[#1e5aa8] to-[#173f76] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Need a Formal Quotation or Legal Metrology Stamping?
            </h2>
            <p className="text-blue-100 text-sm">
              Our technical sales and metrology service engineers are ready to assist with rapid response and site visits.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-[#1e5aa8] hover:bg-blue-50 font-bold shadow-md">
                <FileText className="w-4 h-4 mr-2" />
                <span>Request a Quote</span>
              </Button>
            </Link>

            <a
              href={`https://wa.me/91${settings.phones?.mobile || "9158391519"}?text=Hello%20Jess%20Enterprises,%20I%20would%20like%20to%20request%20an%20instrument%20or%20service%20quotation.`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white bg-white/10 hover:bg-white/20 font-bold"
              >
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
