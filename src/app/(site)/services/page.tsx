import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Scale,
  FlaskConical,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getServices } from "@/server/queries";

export const metadata: Metadata = {
  title: "Authorised Legal Metrology & Balance AMC Services in Goa",
  description:
    "Government-authorised Legal Metrology verification, balance annual maintenance contracts (AMC), NABL certified standard weights, and custom cleanroom fabrication in Goa.",
};

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getServices();

  const getServiceIcon = (slug: string) => {
    if (slug.includes("metrology") || slug.includes("stamping") || slug.includes("weights")) {
      return <Scale className="w-6 h-6 text-[#1e5aa8]" />;
    }
    if (slug.includes("fabrication")) {
      return <Wrench className="w-6 h-6 text-[#1e5aa8]" />;
    }
    return <FlaskConical className="w-6 h-6 text-[#1e5aa8]" />;
  };

  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary" className="uppercase tracking-wider font-bold">
          Services & Compliance
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Government Authorised Metrology & Technical Laboratory Services
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Operating under Legal Metrology Licence No. <strong>22000126-CLM</strong>,
          we ensure your weighing balances, analytical instruments, and cleanroom
          equipment maintain peak accuracy and audit compliance.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.slug}
            id={service.slug}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                {getServiceIcon(service.slug)}
              </div>

              <Badge variant="secondary" className="mb-3 text-[10px] uppercase font-bold">
                {service.vertical.replace("-", " ")}
              </Badge>

              <h2 className="text-xl font-bold text-slate-900 mb-3 leading-snug">
                {service.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                {service.summary}
              </p>

              {/* Highlights List */}
              {service.highlights && service.highlights.length > 0 && (
                <div className="space-y-2 mb-6 pt-4 border-t border-slate-100">
                  {service.highlights.slice(0, 3).map((h, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <Link href={`/services/${service.slug}`} className="flex-1">
                <Button variant="primary" size="sm" className="w-full justify-between font-semibold text-xs">
                  <span>View Full Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>

              <Link href="/contact">
                <Button variant="outline" size="sm" className="text-xs">
                  Request Visit
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Callout */}
      <div className="bg-gradient-to-r from-[#0d2140] to-[#1e5aa8] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Licence No. 22000126-CLM</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold">
            Need Scheduled Balance AMC or Emergency Calibration?
          </h3>
          <p className="text-xs text-blue-100 leading-relaxed">
            Our Goa-based service team handles routine calibration, preventative maintenance contracts, and official departmental stamping with zero downtime.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/contact">
            <Button size="lg" className="bg-white text-[#1e5aa8] hover:bg-blue-50 font-bold">
              Schedule Service
            </Button>
          </Link>
          <a href="tel:9158391519">
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-white/10 hover:bg-white/20 font-bold"
            >
              <Phone className="w-4 h-4 mr-1.5 text-emerald-400" />
              Call Engineer
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
