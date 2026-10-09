import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FileUp, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FabricationGallery from "@/components/site/FabricationGallery";
import { getGalleryItems } from "@/server/queries";

export const metadata: Metadata = {
  title: "Custom Cleanroom Fabrication Works (SS, MS, Acrylic, Teflon) in Goa",
  description:
    "Bespoke fabrication in Stainless Steel, Mild Steel, Acrylic, PVC, Teflon, and Polycarbonate. HPLC column storage cabinets, balance tables, and cleanroom furniture.",
};

export const revalidate = 60;

export default async function FabricationPage() {
  const galleryItems = await getGalleryItems();

  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="secondary" className="uppercase tracking-wider font-bold">
          Custom Fabrication Workshop
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Precision Custom Engineering in SS, MS, Acrylic & Engineering Polymers
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          From 60 & 72 column HPLC storage cabinets to heavy-duty anti-vibration
          weighing tables, SS 316 vessels, and acrylic balance hoods — built exactly
          to your CAD specifications.
        </p>
      </div>

      {/* Interactive Material Filter & Gallery */}
      <FabricationGallery initialItems={galleryItems} />

      {/* "Send Your Drawing" Specification Callout */}
      <div className="bg-gradient-to-r from-[#13335e] via-[#1e5aa8] to-[#173f76] text-white rounded-3xl p-8 sm:p-12 shadow-md flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tailored Workshop Orders</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            Have a Custom Drawing or Dimensional Specification?
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Send us your schematic, sample photo, or dimensional requirements. Our engineering team will review tolerances and provide an itemized fabrication quote.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <Link href="/quote">
            <Button size="lg" className="bg-white text-[#1e5aa8] hover:bg-blue-50 font-bold gap-2">
              <FileUp className="w-4 h-4" />
              <span>Submit Custom Drawing</span>
            </Button>
          </Link>
          <a
            href="https://wa.me/919225901519?text=Hello%20Jess%20Enterprises,%20I%20have%20a%20custom%20fabrication%20drawing%20to%20share."
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-white/10 hover:bg-white/20 font-semibold"
            >
              WhatsApp Drawing
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
