import React from "react";
import Link from "next/link";
import { Home, ArrowRight, Package, Wrench, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Page Not Found | Jess Enterprises",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="space-y-3">
          <span className="text-6xl sm:text-7xl font-black text-[#1e5aa8] tracking-tight">
            404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            The equipment model, service page, or document you requested might have been updated or moved.
          </p>
        </div>

        {/* Popular destination cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <Link
            href="/products"
            className="group p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all space-y-1"
          >
            <div className="flex items-center justify-between text-[#1e5aa8]">
              <Package className="w-5 h-5" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1e5aa8] group-hover:translate-x-0.5 transition-all" />
            </div>
            <h3 className="font-bold text-xs text-slate-900 group-hover:text-[#1e5aa8]">
              Equipment Catalogue
            </h3>
            <p className="text-[11px] text-slate-500">
              Browse 30+ precision lab balances & instruments
            </p>
          </Link>

          <Link
            href="/services"
            className="group p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all space-y-1"
          >
            <div className="flex items-center justify-between text-[#1e5aa8]">
              <Wrench className="w-5 h-5" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1e5aa8] group-hover:translate-x-0.5 transition-all" />
            </div>
            <h3 className="font-bold text-xs text-slate-900 group-hover:text-[#1e5aa8]">
              Legal Metrology Services
            </h3>
            <p className="text-[11px] text-slate-500">
              Government stamping, calibration & AMCs
            </p>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/">
            <Button variant="primary" className="text-xs font-bold gap-2 justify-center w-full">
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Button>
          </Link>

          <Link href="/contact">
            <Button variant="outline" className="text-xs font-bold gap-2 justify-center w-full">
              <Phone className="w-4 h-4" />
              <span>Contact Support Desk</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
