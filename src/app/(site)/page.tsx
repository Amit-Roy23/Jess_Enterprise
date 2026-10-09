import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Scale,
  FlaskConical,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Phone,
  Award,
  Clock,
  Headphones,
  Truck,
  ClipboardCheck,
  MessageCircle,
  Receipt,
  Factory,
  Sparkles,
} from "lucide-react";
import ProductCard from "@/components/site/ProductCard";
import { ClientMarquee } from "@/components/site/ClientShowcase";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/Reveal";
import CountUp from "@/components/site/CountUp";
import { getProducts, getClients, getSiteSettings } from "@/server/queries";
import { CONTACT, whatsappLink } from "@/lib/contact";

export const revalidate = 60;

const VERTICALS = [
  {
    title: "Legal Metrology",
    badge: "Govt. Authorised",
    icon: Scale,
    image: "/products/precision-balance.webp",
    href: "/services/legal-metrology-stamping",
    accent: "from-blue-600 to-[#1e5aa8]",
    points: [
      "Balance AMC, L & M stamping",
      "Anti-vibration pad, table & printer",
      "New balances & moisture analyzers",
      "Weights with NABL certificate",
    ],
  },
  {
    title: "Lab Instruments",
    badge: "Sales & Service",
    icon: FlaskConical,
    image: "/products/spectrophotometer.webp",
    href: "/products",
    accent: "from-sky-500 to-blue-600",
    points: [
      "Spectrophotometer, TOC, N₂ / H₂ / Air generators",
      "Ice flaker, viscometer, circulating bath",
      "Polarimeter, turbidity meter & more",
      "Installation & after-sales support",
    ],
  },
  {
    title: "Fabrication Work",
    badge: "As per your spec",
    icon: Wrench,
    image: "/products/ss-vessel.webp",
    href: "/fabrication",
    accent: "from-rose-500 to-[#dc2626]",
    points: [
      "Acrylic, PVC & Polycarbonate",
      "Teflon (PTFE) machined parts",
      "SS & MS trolleys, tables, vessels",
      "HPLC column storage cabinets",
    ],
  },
];

const WHY = [
  { icon: ShieldCheck, title: "Authorised & compliant", text: "Legal Metrology licence 22000126-CLM with audit-ready documentation." },
  { icon: Award, title: "Certified accuracy", text: "E1–F2 class weights and calibration backed by NABL certificates." },
  { icon: Headphones, title: "Fast local support", text: "Goa-based engineers for breakdowns, AMC visits and installations." },
  { icon: Truck, title: "One-stop supply", text: "Instruments, accessories and custom fabrication from a single partner." },
];

const STEPS = [
  { icon: MessageCircle, title: "Share requirement", text: "Call, WhatsApp or add products to your quote basket." },
  { icon: ClipboardCheck, title: "Get a quotation", text: "We recommend the right model and send a detailed quote." },
  { icon: Truck, title: "Delivery & install", text: "Prompt delivery, installation and demonstration on site." },
  { icon: Headphones, title: "Lifetime support", text: "AMC, calibration, stamping and repairs whenever you need." },
];

export default async function HomePage() {
  const [featured, allProducts, clients, settings] = await Promise.all([
    getProducts({ featuredOnly: true }),
    getProducts(),
    getClients(),
    getSiteSettings(),
  ]);

  // Show featured products with photos first
  const withPhotos = (list: typeof allProducts) =>
    [...list].sort((a, b) => Number(b.images?.length > 0) - Number(a.images?.length > 0));
  const products = withPhotos(featured.length > 0 ? featured : allProducts).slice(0, 8);

  return (
    <div className="flex flex-col overflow-x-clip">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#0b1f3a] text-white">
        <div className="absolute inset-0 bg-grid-light" aria-hidden="true" />
        <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#1e5aa8]/50 blur-3xl animate-blob" aria-hidden="true" />
        <div className="absolute top-1/3 -right-40 h-[26rem] w-[26rem] rounded-full bg-sky-500/25 blur-3xl animate-blob [animation-delay:-6s]" aria-hidden="true" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-[#dc2626]/20 blur-3xl animate-blob [animation-delay:-12s]" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-24 lg:pt-20 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
            <div className="lg:col-span-7">
              <div className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-blue-100 ring-1 ring-white/15 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-ping-soft" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Authorised Legal Metrology · Lic. {settings.licenceNumber?.replace(" (Authorised)", "") || "22000126-CLM"}
              </div>

              <h1 className="mt-6 animate-fade-up [animation-delay:120ms]">
                <span className="block font-script font-bold text-[4.2rem] sm:text-[5.5rem] lg:text-[6.6rem] leading-[0.85] text-gradient-brand drop-shadow-sm">
                  Jess Enterprises
                </span>
                <span className="mt-4 block text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-[1.15]">
                  {settings.heroHeadline || (
                    <>
                      Precision lab instruments, <span className="text-sky-300">calibration</span> &amp; custom fabrication.
                    </>
                  )}
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-blue-100/90 animate-fade-up [animation-delay:240ms]">
                {settings.heroSubheadline ||
                  "Sales, service & AMC of lab and industrial balances, instruments and accessories — plus Acrylic, Polycarbonate, Teflon, SS & MS fabrication as per customer requirement."}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3 animate-fade-up [animation-delay:360ms]">
                <Link
                  href="/products"
                  className="shine inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#0b1f3a] shadow-xl shadow-black/20 transition-transform hover:-translate-y-0.5"
                >
                  Explore Products <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={whatsappLink("Hello Jess Enterprises, I would like a quotation.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-900/30 transition-transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Quote
                </a>
                <a
                  href={`tel:${CONTACT.office}`}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-white ring-1 ring-white/25 transition-colors hover:bg-white/10"
                >
                  <Phone className="h-4 w-4 text-sky-300" /> +91 92259 01519
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-blue-100/80 animate-fade-up [animation-delay:480ms]">
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> NABL certified weights</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> GMP / GLP documentation</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> MSME registered</span>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative lg:col-span-5 h-[420px] sm:h-[480px] animate-fade-up [animation-delay:200ms]">
              <div className="absolute inset-0 m-auto h-72 w-72 sm:h-80 sm:w-80 rounded-full border border-dashed border-white/20 animate-spin-slow" aria-hidden="true" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 sm:h-52 sm:w-52 rounded-full bg-white p-1.5 shadow-2xl shadow-black/40 ring-8 ring-white/10">
                <Image src="/brand/jess-logo-512.png" alt="Jess Enterprises seal" fill sizes="210px" priority className="rounded-full object-contain p-1" />
              </div>

              <div className="absolute left-0 top-4 w-40 sm:w-48 rounded-2xl bg-white p-2 shadow-2xl shadow-black/30 animate-float">
                <div className="relative aspect-[4/3]">
                  <Image src="/products/precision-balance.webp" alt="Precision balance" fill sizes="200px" priority className="object-contain mix-blend-multiply" />
                </div>
                <p className="px-1 pb-1 text-[11px] font-bold text-slate-800">Lab &amp; Industrial Balances</p>
              </div>

              <div className="absolute right-0 top-16 w-40 sm:w-48 rounded-2xl bg-white p-2 shadow-2xl shadow-black/30 animate-float-delayed">
                <div className="relative aspect-[4/3]">
                  <Image src="/products/nano-spectrophotometer.webp" alt="Spectrophotometer" fill sizes="200px" className="object-contain mix-blend-multiply" />
                </div>
                <p className="px-1 pb-1 text-[11px] font-bold text-slate-800">Spectrophotometers</p>
              </div>

              <div className="absolute bottom-2 left-8 w-40 sm:w-48 rounded-2xl bg-white p-2 shadow-2xl shadow-black/30 animate-float-delayed">
                <div className="relative aspect-[4/3]">
                  <Image src="/products/hplc-cabinet.webp" alt="HPLC column storage cabinet" fill sizes="200px" className="object-contain" />
                </div>
                <p className="px-1 pb-1 text-[11px] font-bold text-slate-800">HPLC Column Cabinets</p>
              </div>

              <div className="absolute bottom-10 right-2 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/20 backdrop-blur-md animate-float">
                <p className="text-2xl font-extrabold leading-none">{allProducts.length || 25}+</p>
                <p className="mt-1 text-[11px] font-medium text-blue-100">Instruments &amp; solutions</p>
              </div>
            </div>
          </div>
        </div>

        {/* curved bottom */}
        <svg className="absolute bottom-0 left-0 w-full text-slate-50" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0 60h1440V20C1200 55 960 60 720 40S240 0 0 30Z" />
        </svg>
      </section>

      {/* ================= STATS ================= */}
      <section className="relative z-10 -mt-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 rounded-3xl bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/70 divide-x divide-y md:divide-y-0 divide-slate-100">
          {[
            { n: allProducts.length || 25, s: "+", label: "Products & solutions" },
            { n: clients.length || 18, s: "+", label: "Industry clients" },
            { n: 3, s: "", label: "Business verticals" },
            { n: 100, s: "%", label: "Audit-ready reports" },
          ].map((stat) => (
            <div key={stat.label} className="p-6 text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#1e5aa8]">
                <CountUp to={stat.n} suffix={stat.s} />
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= VERTICALS ================= */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <p className="font-script text-5xl font-bold text-[#dc2626]">What we do</p>
            <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Three verticals. One trusted partner.
            </h2>
            <p className="mt-4 text-slate-600">
              From statutory stamping to spectrophotometers to stainless-steel trolleys — everything your lab and plant needs.
            </p>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {VERTICALS.map((v) => (
              <RevealItem key={v.title}>
                <Link
                  href={v.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/15"
                >
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
                    <Image
                      src={v.image}
                      alt={v.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain p-4 mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className={`absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${v.accent} px-3 py-1 text-[11px] font-bold text-white shadow-lg`}>
                      <v.icon className="h-3.5 w-3.5" /> {v.badge}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-xl font-extrabold text-slate-900">{v.title}</h3>
                    <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                      {v.points.map((p) => (
                        <li key={p} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1e5aa8]" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto pt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#1e5aa8]">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                    </span>
                  </div>
                  <span className={`absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r ${v.accent} transition-transform duration-500 group-hover:scale-x-100`} />
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white bg-dots">
        <div className="max-w-7xl mx-auto">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="font-script text-5xl font-bold text-[#dc2626]">Sales products</p>
              <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Instruments trusted by leading labs
              </h2>
              <p className="mt-3 text-slate-600">
                Add instruments to your quote basket and receive a consolidated quotation within a working day.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 self-start md:self-auto rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 transition-colors hover:border-[#1e5aa8] hover:text-[#1e5aa8]"
            >
              View all {allProducts.length > 0 ? allProducts.length : ""} products <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          {products.length > 0 ? (
            <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.06}>
              {products.map((product) => {
                const category = product.category as unknown as { name?: string; slug?: string } | undefined;
                return (
                  <RevealItem key={String(product._id)} className="h-full">
                    <ProductCard
                      id={String(product._id)}
                      name={product.name}
                      slug={product.slug}
                      categoryName={category?.name}
                      categorySlug={category?.slug}
                      shortDescription={product.shortDescription}
                      specs={product.specs}
                      images={product.images}
                      needsReview={product.needsReview}
                    />
                  </RevealItem>
                );
              })}
            </RevealGroup>
          ) : (
            <p className="text-center text-slate-500 py-12">Products will appear here shortly.</p>
          )}

          {allProducts.length > 0 && (
            <Reveal className="mt-14 rounded-3xl bg-slate-50 p-6 sm:p-8 ring-1 ring-slate-200/70">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Sparkles className="h-4 w-4 text-[#dc2626]" /> Complete range
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {allProducts.map((p) => (
                  <Link
                    key={String(p._id)}
                    href={`/products/${p.slug}`}
                    className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:bg-[#1e5aa8] hover:text-white hover:ring-[#1e5aa8]"
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ================= CLIENTS ================= */}
      <section className="py-20 lg:py-24 bg-slate-50 overflow-hidden">
        <Reveal className="text-center max-w-2xl mx-auto mb-12 px-4">
          <p className="font-script text-5xl font-bold text-[#dc2626]">Our precious customers</p>
          <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Trusted by pharma, research &amp; industry
          </h2>
        </Reveal>
        <ClientMarquee clients={clients} />
        <div className="mt-10 text-center">
          <Link href="/clients" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1e5aa8] hover:underline">
            See all clients <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ================= WHY + PROCESS ================= */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <Reveal x={-30} y={0}>
            <p className="font-script text-5xl font-bold text-[#dc2626]">Why Jess?</p>
            <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Precision you can certify. Service you can count on.
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              We look forward to a mutually beneficial business association with your esteemed organisation — built on
              accurate instruments, honest advice and quick turnaround.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {WHY.map((w) => (
                <div key={w.title} className="group rounded-2xl p-5 ring-1 ring-slate-200/80 transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-blue-200">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1e5aa8] transition-colors group-hover:bg-[#1e5aa8] group-hover:text-white">
                    <w.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-bold text-slate-900">{w.title}</h3>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">{w.text}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal x={30} y={0} delay={0.1} className="relative rounded-3xl bg-[#0b1f3a] p-8 sm:p-10 text-white overflow-hidden">
            <div className="absolute inset-0 bg-grid-light" aria-hidden="true" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#1e5aa8]/50 blur-3xl" aria-hidden="true" />
            <div className="relative">
              <h3 className="text-2xl font-extrabold">How it works</h3>
              <ol className="mt-8 space-y-7">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                      <s.icon className="h-5 w-5 text-sky-300" />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#dc2626] text-[10px] font-bold">
                        {i + 1}
                      </span>
                    </span>
                    <div>
                      <p className="font-bold">{s.title}</p>
                      <p className="mt-0.5 text-sm text-blue-100/80">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-9 flex items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <Clock className="h-5 w-5 text-sky-300 shrink-0" />
                <p className="text-sm text-blue-100">
                  {settings.businessHours || "Monday – Saturday: 9:00 AM – 6:30 PM"}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= REGISTRATIONS ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 bg-white">
        <RevealGroup className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: ShieldCheck, label: "Legal Metrology Licence", value: "22000126-CLM", tone: "text-emerald-600 bg-emerald-50" },
            { icon: Receipt, label: "GST Number", value: settings.gstin || "30AZCPG5317P1ZG", tone: "text-blue-600 bg-blue-50" },
            { icon: Factory, label: "MSME (Micro)", value: "UDYAM-GA-01-0024091", tone: "text-amber-600 bg-amber-50" },
          ].map((r) => (
            <RevealItem key={r.label}>
              <div className="flex items-center gap-4 rounded-2xl p-5 ring-1 ring-slate-200/80 bg-white">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${r.tone}`}>
                  <r.icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{r.label}</p>
                  <p className="font-mono text-sm sm:text-base font-bold text-slate-900">{r.value}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 bg-white">
        <Reveal className="relative max-w-7xl mx-auto overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1e5aa8] via-[#1a4c8f] to-[#0b1f3a] px-6 py-14 sm:px-14 text-white shadow-2xl shadow-blue-900/30">
          <div className="absolute inset-0 bg-grid-light" aria-hidden="true" />
          <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-sky-400/30 blur-3xl animate-blob" aria-hidden="true" />
          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <p className="font-script text-5xl font-bold text-sky-200">Let&apos;s work together</p>
              <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight">
                Feel free to contact us any time.
              </h2>
              <p className="mt-3 text-blue-100 max-w-xl">
                Thanking you and assuring our best services to you at all times.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href={whatsappLink("Hello Jess Enterprises, I would like to request a quotation.")}
                target="_blank"
                rel="noopener noreferrer"
                className="shine inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#0b1f3a] shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Request a Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ring-1 ring-white/30 hover:bg-white/10"
              >
                {CONTACT.email}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
