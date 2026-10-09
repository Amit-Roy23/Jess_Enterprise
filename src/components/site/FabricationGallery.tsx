"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Wrench, Eye, X, ArrowRight, FileUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GalleryItemData {
  _id?: unknown;
  title: string;
  material: "SS" | "MS" | "Acrylic" | "PVC" | "Teflon" | "Polycarbonate";
  description?: string;
  images?: { url: string; alt?: string }[];
}

interface FabricationGalleryProps {
  initialItems: GalleryItemData[];
}

const MATERIALS = [
  "ALL",
  "SS",
  "MS",
  "Acrylic",
  "PVC",
  "Teflon",
  "Polycarbonate",
] as const;

export function FabricationGallery({ initialItems }: FabricationGalleryProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string>("ALL");
  const [activeModalItem, setActiveModalItem] = useState<GalleryItemData | null>(null);

  const filteredItems =
    selectedMaterial === "ALL"
      ? initialItems
      : initialItems.filter((item) => item.material === selectedMaterial);

  const getMaterialColor = (material: string) => {
    switch (material) {
      case "SS":
        return "bg-blue-100 text-[#1e5aa8] border-blue-200";
      case "MS":
        return "bg-slate-200 text-slate-800 border-slate-300";
      case "Acrylic":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "PVC":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Teflon":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Polycarbonate":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-10">
      {/* Material Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {MATERIALS.map((mat) => (
          <button
            key={mat}
            onClick={() => setSelectedMaterial(mat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedMaterial === mat
                ? "bg-[#1e5aa8] text-white shadow-sm scale-105"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {mat === "ALL" ? "All Materials" : `${mat} Works`}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={String(item._id || idx)}
            onClick={() => setActiveModalItem(item)}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            {/* Visual Header */}
            <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative flex items-center justify-center p-6 group-hover:from-blue-50 group-hover:to-slate-100 transition-colors">
              {/* Technical Pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(#1e5aa8 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />
              {item.images?.[0]?.url ? (
                <Image
                  src={item.images[0].url}
                  alt={item.images[0].alt || item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wrench className="w-7 h-7 text-[#1e5aa8]" />
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getMaterialColor(
                    item.material
                  )}`}
                >
                  {item.material}
                </span>
              </div>
              <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white/95 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#1e5aa8]" />
                  Inspect Spec
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#1e5aa8] transition-colors leading-snug">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1e5aa8]">
                <span>Custom Engineering</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Modal */}
      {activeModalItem && (
        <div onClick={() => setActiveModalItem(null)} className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] overflow-y-auto bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Badge variant="primary" className="text-xs font-bold">
                {activeModalItem.material} Fabrication
              </Badge>
            </div>

            {activeModalItem.images && activeModalItem.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {activeModalItem.images.slice(0, 4).map((img, i) => (
                  <div
                    key={img.url + i}
                    className={`relative overflow-hidden rounded-xl bg-slate-100 ${
                      activeModalItem.images!.length === 1 ? "col-span-2 aspect-[4/3]" : "aspect-square"
                    }`}
                  >
                    <Image src={img.url} alt={img.alt || activeModalItem.title} fill sizes="300px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            <h3 className="text-xl font-bold text-slate-900 leading-snug">
              {activeModalItem.title}
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              {activeModalItem.description}
            </p>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <Link href="/quote" className="flex-1">
                <Button variant="primary" className="w-full gap-2">
                  <FileUp className="w-4 h-4" />
                  <span>Request Fabrication Quote</span>
                </Button>
              </Link>
              <a
                href={`https://wa.me/919225901519?text=${encodeURIComponent(
                  `Hello Jess Enterprises, I would like custom fabrication for: ${activeModalItem.title} (${activeModalItem.material})`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  WhatsApp Inquiry
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FabricationGallery;
