"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Services", href: "/services" },
  { name: "Fabrication", href: "/fabrication" },
  { name: "Clients", href: "/clients" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quoteCount, setQuoteCount] = useState(0);
  const pathname = usePathname();

  // Load quote basket count from localStorage safely
  useEffect(() => {
    const updateBasketCount = () => {
      try {
        const basket = localStorage.getItem("jess_quote_basket");
        if (basket) {
          const items = JSON.parse(basket);
          if (Array.isArray(items)) {
            const count = items.reduce(
              (acc: number, item: { quantity?: number }) =>
                acc + (item.quantity || 1),
              0
            );
            setQuoteCount(count);
          }
        } else {
          setQuoteCount(0);
        }
      } catch {
        setQuoteCount(0);
      }
    };

    updateBasketCount();
    window.addEventListener("storage", updateBasketCount);
    window.addEventListener("basket-updated", updateBasketCount);

    return () => {
      window.removeEventListener("storage", updateBasketCount);
      window.removeEventListener("basket-updated", updateBasketCount);
    };
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-[#13335e] text-slate-100 text-xs py-2 px-4 border-b border-[#1e5aa8]/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          {/* Compliance & Licence */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Govt. Authorised Legal Metrology
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-slate-300">
              Licence: <span className="font-mono text-white">22000126-CLM</span>
            </span>
          </div>

          {/* Contact Direct */}
          <div className="flex items-center gap-4 text-xs">
            <a
              href="tel:9158391519"
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-medium">+91 91583 91519</span>
            </a>
            <a
              href="mailto:jess.enterprises14@gmail.com"
              className="hidden md:flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>jess.enterprises14@gmail.com</span>
            </a>
            <span className="hidden lg:flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>Goa, India</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-semibold transition-colors",
                    isActive
                      ? "text-[#1e5aa8] bg-blue-50/80 font-bold"
                      : "text-slate-700 hover:text-[#1e5aa8] hover:bg-slate-50"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Quote Basket & CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/quote"
              className="relative p-2 text-slate-700 hover:text-[#1e5aa8] hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Quote Basket"
            >
              <FileText className="w-5 h-5" />
              {quoteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#dc2626] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-xs">
                  {quoteCount}
                </span>
              )}
            </Link>

            <Link href="/quote">
              <Button variant="primary" size="default" className="gap-2 font-semibold">
                <span>Request a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/quote"
              className="relative p-2 text-slate-700 hover:text-[#1e5aa8] rounded-lg"
              aria-label="Quote Basket"
            >
              <FileText className="w-5 h-5" />
              {quoteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#dc2626] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {quoteCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-semibold",
                    isActive
                      ? "bg-blue-50 text-[#1e5aa8] font-bold"
                      : "text-slate-800 hover:bg-slate-50"
                  )}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
            <Link
              href="/quote"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button variant="primary" className="w-full justify-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Request a Quote ({quoteCount} items)</span>
              </Button>
            </Link>

            <a href="tel:9158391519" className="w-full">
              <Button
                variant="outline"
                className="w-full justify-center gap-2 border-slate-300"
              >
                <Phone className="w-4 h-4 text-[#1e5aa8]" />
                <span>Call +91 91583 91519</span>
              </Button>
            </a>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                Licence No. 22000126-CLM
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                MSME Registered
              </Badge>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
