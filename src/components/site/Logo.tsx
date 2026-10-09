import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "light" | "footer";
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { mark: 40, text: "text-[1.9rem]", tag: "text-[9px]" },
  md: { mark: 50, text: "text-[2.35rem]", tag: "text-[10px]" },
  lg: { mark: 64, text: "text-[2.9rem]", tag: "text-[11px]" },
};

export function Logo({ className, variant = "default", size = "md" }: LogoProps) {
  const isLight = variant === "light" || variant === "footer";
  const s = SIZES[size];

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 group select-none", className)}
      aria-label="Jess Enterprises - Home"
    >
      <span
        className={cn(
          "relative shrink-0 rounded-full bg-white transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-105",
          isLight ? "ring-2 ring-white/30 shadow-lg shadow-black/20" : "shadow-md shadow-blue-900/10 ring-1 ring-slate-200"
        )}
        style={{ width: s.mark, height: s.mark }}
      >
        <Image
          src="/brand/jess-logo-256.png"
          alt="Jess Enterprises logo"
          width={s.mark}
          height={s.mark}
          priority
          className="rounded-full"
        />
      </span>

      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-script font-bold whitespace-nowrap -mb-0.5",
            s.text,
            isLight ? "text-white" : "text-[#1e5aa8]"
          )}
        >
          Jess Enterprises
        </span>
        <span
          className={cn(
            "font-semibold tracking-[0.28em] uppercase pl-0.5",
            s.tag,
            isLight ? "text-blue-200" : "text-[#dc2626]"
          )}
        >
          Innovative Services
        </span>
      </span>
    </Link>
  );
}

export default Logo;
