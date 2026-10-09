import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageSquare,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getServiceBySlug, getServices } from "@/server/queries";
import { ServiceJsonLd, BreadcrumbsJsonLd } from "@/components/site/JsonLd";

export const revalidate = 60;

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: "Service Not Found | Jess Enterprises" };
  }

  return {
    title: `${service.title} | Jess Enterprises Goa`,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const allServices = await getServices();
  const otherServices = allServices.filter((s) => s.slug !== service.slug);

  const whatsappUrl = `https://wa.me/919158391519?text=${encodeURIComponent(
    `Hello Jess Enterprises, I would like to request service assistance regarding: ${service.title}`
  )}`;

  return (
    <>
      <ServiceJsonLd
        title={service.title}
        description={service.summary}
        slug={service.slug}
      />
      <BreadcrumbsJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: service.title, url: `/services/${service.slug}` },
        ]}
      />

      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto pb-1"
        >
          <Link href="/" className="hover:text-slate-900">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/services" className="hover:text-slate-900">
            Services
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate">
            {service.title}
          </span>
        </nav>

        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#1e5aa8] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <Badge variant="primary" className="bg-white/20 text-white border-white/20">
              Government Authorised Provider
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {service.title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {service.summary}
            </p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900">Service Scope & Overview</h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {service.description}
              </div>
            </div>

            {/* Highlights / Deliverables */}
            {service.highlights && service.highlights.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900">What We Deliver</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.highlights.map((h: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Compliance Guarantee */}
            <div className="bg-blue-50/60 rounded-2xl border border-blue-100 p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1e5aa8] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">
                  Authorised Legal Metrology Compliance
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  All weighing balance verifications and stamping operations are executed under
                  Government Legal Metrology Licence No. <strong>22000126-CLM</strong>, ensuring full audit readiness for pharmaceutical quality control labs.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar CTA & Other Services */}
          <div className="space-y-6">
            {/* Quick Consultation Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-bold text-slate-900">
                Request Service Assistance
              </h3>
              <p className="text-xs text-slate-600">
                Speak directly with our technical team in Goa for quotes, on-site stamping appointments, or annual maintenance contracts.
              </p>

              <div className="space-y-2 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button
                    variant="primary"
                    className="w-full justify-center gap-2 font-bold text-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Service Desk</span>
                  </Button>
                </a>

                <Link href="/contact" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 font-bold text-xs"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Submit Service Enquiry</span>
                  </Button>
                </Link>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Office: +91 9225901519</span>
              </div>
            </div>

            {/* Other Services */}
            {otherServices.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Other Specialized Services
                </h4>
                <div className="space-y-2">
                  {otherServices.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-xs font-semibold text-slate-700"
                    >
                      <span className="group-hover:text-[#1e5aa8] transition-colors">
                        {s.title}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1e5aa8] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
