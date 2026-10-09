import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms & Conditions</h1>
      <div className="prose prose-slate max-w-none space-y-4 text-slate-700">
        <p>
          Welcome to Jess Enterprises. All quotations, Legal Metrology services, and custom fabrication orders are governed by formal purchase orders and statutory regulations.
        </p>
        <h2 className="text-xl font-bold text-slate-900 mt-6">Legal Metrology & Verification</h2>
        <p>
          Stamping and verification services are conducted under Government Authorised Licence No. 22000126-CLM.
        </p>
        <h2 className="text-xl font-bold text-slate-900 mt-6">Custom Fabrication</h2>
        <p>
          Fabricated goods (SS, MS, Acrylic, PVC, Teflon, Polycarbonate) are manufactured per client-approved specifications and engineering drawings.
        </p>
      </div>
      <div className="mt-8">
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
