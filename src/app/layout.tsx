import type { Metadata } from "next";
import "./globals.css";
import { tangerine, jakarta } from "@/lib/fonts";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jessenterprises.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | Jess Enterprises",
    default: "Jess Enterprises | Lab Instruments, Legal Metrology & Custom Fabrication",
  },
  description:
    "Jess Enterprises — Authorised Legal Metrology service provider (Licence 22000126-CLM), laboratory instruments supplier, and custom acrylic, SS & MS fabrication workshop in Goa, India.",
  keywords: [
    "Legal Metrology Goa",
    "Legal Metrology Stamping 22000126-CLM",
    "Lab Instruments Goa",
    "Weighing Balance AMC Goa",
    "Spectrophotometer Supplier Goa",
    "HPLC Column Storage Cabinet",
    "Custom SS 316 Cleanroom Fabrication",
    "Weighing Scales Calibration Goa",
    "E1 E2 F1 F2 Class Weights",
    "Pharma QC Instruments Goa",
    "Jess Enterprises",
  ],
  authors: [{ name: "Jess Enterprises", url: siteUrl }],
  creator: "Jess Enterprises",
  publisher: "Jess Enterprises",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    title: "Jess Enterprises | Lab Instruments & Legal Metrology Services",
    description:
      "Authorised Legal Metrology service provider, precision lab equipment supplier, and cleanroom custom fabrication in Goa.",
    siteName: "Jess Enterprises",
    images: [
      {
        url: "/brand/jess-logo-512.png",
        width: 512,
        height: 512,
        alt: "Jess Enterprises — Innovative Services",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Jess Enterprises | Lab Instruments & Legal Metrology Services",
    description:
      "Authorised Legal Metrology service provider, precision lab equipment supplier, and cleanroom custom fabrication in Goa.",
    images: ["/brand/jess-logo-512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${jakarta.variable} ${tangerine.variable}`}>
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900 antialiased selection:bg-[#1e5aa8] selection:text-white">
        {children}
      </body>
    </html>
  );
}
