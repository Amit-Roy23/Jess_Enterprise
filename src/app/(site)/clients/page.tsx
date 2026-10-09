import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Award, Building, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ClientShowcase from "@/components/site/ClientShowcase";
import { getClients } from "@/server/queries";

export const metadata: Metadata = {
  title: "Trusted Clients & Pharma Partners | Jess Enterprises Goa",
  description:
    "Trusted by premier pharmaceutical companies, research institutes, and chemical manufacturers across Goa including Glenmark, Geno Pharma, Cipla, and NIO Goa.",
};

export const revalidate = 60;

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="outline" className="uppercase tracking-wider font-bold">
          Client Relationships
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Trusted By Premier Pharmaceuticals & Research Institutions
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Jess Enterprises is privileged to partner with industry leaders in
          pharmaceutical manufacturing, chemical formulation, and academic research.
        </p>
      </div>

      {/* Clients Grid */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200">
        <ClientShowcase clients={clients} />
      </div>

      {/* Client Trust Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e5aa8] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Audit-Ready Documentation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All calibration certificates, NABL traceability reports, and Legal Metrology stamping papers comply fully with stringent USFDA, MHRA, and WHO GLP/GMP requirements.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e5aa8] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">High Reliability AMC</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Guaranteed uptime for analytical and precision balances with scheduled preventative visits, corner-load testing, and swift breakdown resolution.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e5aa8] flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Custom Engineering Support</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Direct collaboration with QA/QC and engineering teams to design bespoke cleanroom furniture, HPLC storage solutions, and containment accessories.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 space-y-4">
        <h3 className="text-xl font-bold text-slate-900">
          Looking for a Mutually Beneficial Business Association?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Contact our corporate sales team to discuss vendor registration, annual rate contracts, and statutory balance stamping.
        </p>
        <Link href="/contact">
          <Button variant="primary" className="gap-2">
            <span>Connect with Corporate Sales</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
