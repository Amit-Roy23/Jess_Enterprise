import React from "react";
import {
  FlaskConical,
  Scale,
  Wrench,
  Layers,
  Thermometer,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductPlaceholderProps {
  categorySlug?: string;
  name: string;
  className?: string;
}

export function ProductPlaceholder({
  categorySlug,
  name,
  className,
}: ProductPlaceholderProps) {
  const getIcon = () => {
    if (categorySlug === "weighing" || name.toLowerCase().includes("balance") || name.toLowerCase().includes("scale")) {
      return <Scale className="w-12 h-12 text-[#1e5aa8]" />;
    }
    if (categorySlug === "weights-calibration" || name.toLowerCase().includes("weight")) {
      return <ShieldCheck className="w-12 h-12 text-emerald-600" />;
    }
    if (categorySlug === "fabrication" || name.toLowerCase().includes("fabrication") || name.toLowerCase().includes("cabinet")) {
      return <Wrench className="w-12 h-12 text-slate-700" />;
    }
    if (categorySlug === "weighing-accessories") {
      return <Layers className="w-12 h-12 text-amber-600" />;
    }
    if (name.toLowerCase().includes("bath") || name.toLowerCase().includes("furnace") || name.toLowerCase().includes("incubator")) {
      return <Thermometer className="w-12 h-12 text-orange-600" />;
    }
    if (categorySlug === "analytical-instruments") {
      return <FlaskConical className="w-12 h-12 text-[#1e5aa8]" />;
    }
    return <Cpu className="w-12 h-12 text-blue-600" />;
  };

  return (
    <div
      className={cn(
        "relative w-full h-full min-h-[180px] bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 flex flex-col items-center justify-center p-6 overflow-hidden border border-slate-100 select-none group",
        className
      )}
    >
      {/* Precision Blueprint Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #1e5aa8 1px, transparent 1px), linear-gradient(to bottom, #1e5aa8 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
        {getIcon()}
      </div>

      <span className="relative z-10 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-3 text-center line-clamp-1 px-2">
        {categorySlug ? categorySlug.replace("-", " ") : "Lab Equipment"}
      </span>
    </div>
  );
}

export default ProductPlaceholder;
