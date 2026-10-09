"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Menu,
  X,
  FileText,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import { CONTACT } from "@/lib/contact";
import { getQuoteBasket } from "@/lib/quote-store";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Services", href: "/services" },
  { name: "Fabrication", href: "/fabrication" },
  { name: "Clients", href: "/clients" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quoteCount, setQuoteCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() || "/";

  useEffect(() => {
    const update = () =>
      setQuoteCount(getQuoteBasket().reduce((acc, item) => acc + (item.quantity || 1), 0));
    update();
    window.addEventListener("storage", update);
    window.addEventListener("basket-updated", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("basket-updated", update);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 w-full print:hidden">
      {/* Top contact bar */}
      <div
        className={cn(
          "bg-[#0b1f3a] text-slate-200 text-xs overflow-hidden transition-all duration-300",
          scrolled ? "max-h-0" : "max-h-12"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1.5 font-medium text-blue-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Govt. Authorised Legal Metrology
            <span className="hidden sm:inline text-slate-400">· Lic. No. 22000126-CLM</span>
          </span>
          <div className="flex items-center gap-4">
            <a href={`tel:${CONTACT.office}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-blue-300" />
              <span className="font-semibold">+91 92259 01519</span>
            </a>
            <a href={`tel:${CONTACT.mobile}`} className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-blue-300" />
              <span>+91 91583 91519</span>
            </a>
            <a href={`mailto:${CONTACT.email}`} className="hidden lg:flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-blue-300" />
              <span>{CONTACT.email}</span>
            </a>
            <span className="hidden xl:flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              Goa, India
            </span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div
        className={cn(
          "border-b transition-all duration-300",
          scrolled
            ? "bg-white/85 backdrop-blur-xl border-slate-200/80 shadow-[0_8px_30px_rgb(15_23_42/0.06)]"
            : "bg-white border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn("flex items-center justify-between transition-all duration-300", scrolled ? "h-16" : "h-20")}>
            <Logo size={scrolled ? "sm" : "md"} />

            <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-2 rounded-full text-sm font-semibold transition-colors",
                    isActive(link.href) ? "text-[#1e5aa8]" : "text-slate-600 hover:text-[#1e5aa8]"
                  )}
                >
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-blue-50 ring-1 ring-blue-100"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link.name}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/quote"
                className="relative p-2.5 text-slate-700 hover:text-[#1e5aa8] hover:bg-blue-50 rounded-full transition-colors"
                aria-label={`Quote basket (${quoteCount} items)`}
              >
                <FileText className="w-5 h-5" />
                {quoteCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#dc2626] text-white text-[10px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center ring-2 ring-white">
                    {quoteCount}
                  </span>
                )}
              </Link>

              <Link
                href="/quote"
                className="shine hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1e5aa8] to-[#2563eb] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-transform hover:-translate-y-0.5"
              >
                Get a Quote
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="lg:hidden p-2 rounded-full text-slate-700 hover:bg-slate-100"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden border-t border-slate-100 bg-white"
            >
              <div className="px-4 pt-3 pb-6 space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-3 rounded-xl text-base font-semibold",
                        isActive(link.href) ? "bg-blue-50 text-[#1e5aa8]" : "text-slate-800 hover:bg-slate-50"
                      )}
                    >
                      {link.name}
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4 grid grid-cols-2 gap-3">
                  <Link
                    href="/quote"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#1e5aa8] py-3 text-sm font-bold text-white"
                  >
                    <FileText className="w-4 h-4" /> Quote ({quoteCount})
                  </Link>
                  <a
                    href={`tel:${CONTACT.office}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-800"
                  >
                    <Phone className="w-4 h-4 text-[#1e5aa8]" /> Call Office
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Header;
