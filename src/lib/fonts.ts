import localFont from "next/font/local";

/**
 * Brand script font (Viner Hand ITC, emboldened) — used for the "Jess Enterprises"
 * wordmark and accents. The original has no bold, so this file is a true bold
 * generated from VINERITC.TTF (outlines thickened in FontForge, Latin subset).
 */
export const brandScript = localFont({
  src: "../fonts/VinerHandITC-Bold.woff2",
  weight: "700",
  style: "normal",
  variable: "--font-brand-script",
  display: "swap",
  preload: true,
  fallback: ["cursive"],
});

/** Body/UI font. */
export const jakarta = localFont({
  src: "../fonts/PlusJakartaSans-Variable.woff2",
  weight: "200 800",
  variable: "--font-jakarta",
  display: "swap",
  preload: true,
});
