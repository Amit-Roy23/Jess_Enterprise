"use client";

import React, { useState } from "react";
import { Phone, MessageSquare, X } from "lucide-react";

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const whatsappUrl =
    "https://wa.me/919158391519?text=Hello%20Jess%20Enterprises,%20I%20would%20like%20to%20enquire%20about%20your%20products%20and%20services.";

  return (
    <aside
      aria-label="Quick contact buttons"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      {/* Tooltip on hover/click */}
      {showTooltip && (
        <div className="bg-white text-slate-800 text-xs px-3 py-2 rounded-lg shadow-xl border border-slate-200 max-w-[200px] mb-1 animate-in fade-in slide-in-from-bottom-2 duration-200 relative">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-1 right-1 text-slate-400 hover:text-slate-600"
            aria-label="Close tooltip"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="font-semibold text-slate-900">Chat with us on WhatsApp</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Instant quote & service assistance
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Mobile Quick Call Button */}
        <a
          href="tel:9158391519"
          className="sm:hidden flex items-center justify-center w-12 h-12 rounded-full bg-[#1e5aa8] text-white shadow-lg shadow-blue-900/30 hover:bg-[#173f76] transition-transform active:scale-95"
          aria-label="Call Jess Enterprises"
        >
          <Phone className="w-5 h-5" />
        </a>

        {/* WhatsApp Floating Action Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-900/20 transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Chat on WhatsApp with Jess Enterprises"
        >
          <MessageSquare className="w-5 h-5 fill-white" />
          <span className="font-bold text-sm hidden md:inline tracking-wide">
            Chat on WhatsApp
          </span>
        </a>
      </div>
    </aside>
  );
}

export default WhatsAppButton;
