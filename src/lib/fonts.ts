import localFont from "next/font/local";

/** Brand script font (Viner Hand ITC) — used for the "Jess Enterprises" wordmark and accents. */
export const brandScript = localFont({
  src: "../fonts/VinerHandITC.woff2",
  weight: "400",
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
