import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "outline"
    | "accent"
    | "success"
    | "warning";
}

function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-[#1e5aa8]/10 text-[#1e5aa8] border-[#1e5aa8]/20",
    primary: "bg-[#1e5aa8] text-white border-transparent",
    secondary: "bg-slate-100 text-slate-800 border-slate-200",
    outline: "text-slate-800 border-slate-300 bg-transparent",
    accent: "bg-[#dc2626]/10 text-[#dc2626] border-[#dc2626]/20 font-semibold",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
