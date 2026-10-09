import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "accent"
    | "danger";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const variantStyles = {
      default:
        "bg-[#1e5aa8] text-white hover:bg-[#173f76] focus-visible:ring-[#1e5aa8]",
      primary:
        "bg-[#1e5aa8] text-white hover:bg-[#173f76] shadow-sm focus-visible:ring-[#1e5aa8]",
      secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400",
      outline:
        "border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 focus-visible:ring-[#1e5aa8]",
      ghost:
        "hover:bg-slate-100 hover:text-slate-900 text-slate-700",
      accent:
        "bg-[#dc2626] text-white hover:bg-[#b91c1c] shadow-sm focus-visible:ring-[#dc2626]",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
    };

    const sizeStyles = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-12 rounded-md px-6 text-base font-semibold",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        type={type}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
