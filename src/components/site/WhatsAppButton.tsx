"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone, X } from "lucide-react";
import { CONTACT, whatsappLink } from "@/lib/contact";

/** Builds a WhatsApp message that tells Jess Enterprises what the visitor was looking at. */
function buildMessage(pathname: string): string {
  const base = "Hello Jess Enterprises,";
  const heading = typeof document !== "undefined" ? document.querySelector("h1")?.textContent?.trim() : "";
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  if (pathname.startsWith("/products/") && heading) {
    return `${base} I am interested in "${heading}". Please share the price, specifications and availability.\n${pageUrl}`;
  }
  if (pathname.startsWith("/services/") && heading) {
    return `${base} I would like to know more about your "${heading}" service.\n${pageUrl}`;
  }
  if (pathname.startsWith("/fabrication")) {
    return `${base} I have a custom fabrication requirement (Acrylic / PVC / Teflon / Polycarbonate / SS / MS). Can we discuss?`;
  }
  if (pathname.startsWith("/quote")) {
    return `${base} I would like a quotation for some instruments.`;
  }
  return `${base} I would like to enquire about your products and services.`;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="currentColor">
      <path d="M16.004 3C8.832 3 3 8.83 3 16c0 2.29.6 4.53 1.74 6.5L3 29l6.67-1.75A12.94 12.94 0 0 0 16.004 29C23.17 29 29 23.17 29 16S23.17 3 16.004 3Zm0 23.64c-1.95 0-3.86-.52-5.53-1.52l-.4-.24-3.96 1.04 1.06-3.86-.26-.41A10.6 10.6 0 0 1 5.36 16c0-5.87 4.78-10.64 10.65-10.64 5.86 0 10.63 4.77 10.63 10.64 0 5.87-4.77 10.64-10.64 10.64Zm5.84-7.97c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66 0 1.57 1.14 3.09 1.3 3.3.16.21 2.25 3.43 5.44 4.81.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.15-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}

export function WhatsAppButton() {
  const pathname = usePathname() || "/";
  const [showBubble, setShowBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [href, setHref] = useState(() =>
    whatsappLink("Hello Jess Enterprises, I would like to enquire about your products and services.")
  );

  // Page-aware message (reads the page heading, so it runs after render)
  useEffect(() => {
    const t = setTimeout(() => setHref(whatsappLink(buildMessage(pathname))), 300);
    return () => clearTimeout(t);
  }, [pathname]);

  // Gently invite visitors to chat a few seconds after landing
  useEffect(() => {
    if (dismissed) return;
    const t = setTimeout(() => setShowBubble(true), 6000);
    return () => clearTimeout(t);
  }, [dismissed]);

  const openChat = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Compute the message at click time so it reflects the current page
    e.currentTarget.href = whatsappLink(buildMessage(pathname));
    setShowBubble(false);
    setDismissed(true);
  };

  return (
    <aside
      aria-label="Quick contact buttons"
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 print:hidden"
    >
      {showBubble && !dismissed && (
        <div className="relative max-w-[240px] rounded-2xl rounded-br-sm bg-white px-4 py-3 text-slate-800 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-200 animate-fade-up">
          <button
            onClick={() => {
              setShowBubble(false);
              setDismissed(true);
            }}
            className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
            aria-label="Close message"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <p className="pr-4 text-sm font-bold text-slate-900">Need a quick quote? 👋</p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
            Chat with our team on WhatsApp — we usually reply within minutes.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2.5">
        <a
          href={`tel:${CONTACT.office}`}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1e5aa8] text-white shadow-lg shadow-blue-900/30 transition-transform hover:scale-110 active:scale-95 sm:hidden"
          aria-label={`Call Jess Enterprises on ${CONTACT.office}`}
        >
          <Phone className="h-5 w-5" />
        </a>

        <a
          href={href}
          onClick={openChat}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-14 items-center gap-2 rounded-full bg-[#25D366] pl-3.5 pr-3.5 text-white shadow-xl shadow-emerald-900/30 transition-all duration-300 hover:scale-105 hover:bg-[#1ebe5b] active:scale-95 md:pr-5"
          aria-label={`Chat on WhatsApp with Jess Enterprises (+91 ${CONTACT.office})`}
        >
          <span className="absolute left-1 top-1 h-12 w-12 rounded-full bg-[#25D366] animate-ping-soft" aria-hidden="true" />
          <WhatsAppIcon className="relative h-7 w-7" />
          <span className="relative hidden text-sm font-bold tracking-wide md:inline">Chat with us</span>
        </a>
      </div>
    </aside>
  );
}

export default WhatsAppButton;
