import localFont from "next/font/local";

/** Brand script font (Tangerine) — used for the "Jess Enterprises" wordmark and accents. */
export const tangerine = localFont({
  src: [
    { path: "../fonts/Tangerine-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Tangerine-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-tangerine",
  display: "swap",
  preload: true,
});

/** Body/UI font. */
export const jakarta = localFont({
  src: "../fonts/PlusJakartaSans-Variable.woff2",
  weight: "200 800",
  variable: "--font-jakarta",
  display: "swap",
  preload: true,
});
