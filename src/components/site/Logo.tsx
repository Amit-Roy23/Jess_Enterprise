import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "light" | "footer";
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, variant = "default", size = "md" }: LogoProps) {
  const isLight = variant === "light" || variant === "footer";

  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const markSizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-3 group select-none", className)}
      aria-label="Jess Enterprises - Home"
    >
      {/* jE Mark */}
      <div
        className={cn(
          "rounded-lg font-black flex items-center justify-center tracking-tighter shadow-sm transition-transform group-hover:scale-105",
          markSizes[size],
          isLight
            ? "bg-white text-[#1e5aa8] border border-white/20"
            : "bg-[#1e5aa8] text-white"
        )}
      >
        <span className="font-extrabold">j</span>
        <span className="font-black text-[#dc2626]">E</span>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <span
          className={cn(
            "font-extrabold tracking-tight leading-none uppercase",
            sizeClasses[size],
            isLight ? "text-white" : "text-slate-900"
          )}
        >
          Jess Enterprises
        </span>
        <span
          className={cn(
            "text-[10px] sm:text-xs font-semibold tracking-widest uppercase mt-0.5",
            isLight ? "text-blue-200" : "text-[#1e5aa8]"
          )}
        >
          Innovative Services
        </span>
      </div>
    </Link>
  );
}

export default Logo;
