import React from "react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import QuoteBasketView from "@/components/site/QuoteBasketView";

export const metadata: Metadata = {
  title: "Request a Quote Basket | Jess Enterprises Goa",
  description:
    "Review your selected laboratory instruments, certified weights, and custom fabrication works to submit a consolidated quote request.",
};

export default function QuotePage() {
  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="primary" className="uppercase tracking-wider font-bold">
          Quote Basket
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Consolidated B2B Quotation Request
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Review your selected laboratory equipment, adjust quantities, add custom
          parameters, and submit one consolidated inquiry to receive an official
          proposal with GST & dispatch schedules.
        </p>
      </div>

      {/* Interactive Basket View */}
      <QuoteBasketView />
    </div>
  );
}
