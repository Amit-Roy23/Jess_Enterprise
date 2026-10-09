"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  FileText,
  ArrowRight,
  Send,
  Building2,
  Phone,
  Mail,
  User,
  MapPin,
  MessageSquare,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getQuoteBasket,
  updateQuoteItemQuantity,
  updateQuoteItemNote,
  removeFromQuoteBasket,
  clearQuoteBasket,
  type QuoteBasketItem,
} from "@/lib/quote-store";
import { submitEnquiryAction } from "@/server/actions/enquiryActions";

export function QuoteBasketView() {
  const [basket, setBasket] = useState<QuoteBasketItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setBasket(getQuoteBasket());
    setLoading(false);

    const handleUpdate = () => {
      setBasket(getQuoteBasket());
    };

    window.addEventListener("basket-updated", handleUpdate);
    return () => window.removeEventListener("basket-updated", handleUpdate);
  }, []);

  const totalItemsCount = basket.reduce((acc, item) => acc + item.quantity, 0);

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    if (basket.length === 0) {
      setErrorMessage("Your quote basket is empty. Please add at least one product.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitEnquiryAction({
        type: "quote",
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        message:
          formData.message.trim() ||
          `Consolidated quote request for ${totalItemsCount} items.`,
        items: basket.map((b) => ({
          productId: b.productId,
          productName: b.name,
          quantity: b.quantity,
          note: b.note || "",
        })),
        sourcePage: "/quote",
        status: "new",
      });

      if (result.success) {
        setSubmitted(true);
        clearQuoteBasket();
      } else {
        setErrorMessage(result.message || "Failed to submit quote request.");
        if (result.errors) {
          setFieldErrors(result.errors);
        }
      }
    } catch (err) {
      console.error("Quote submission error:", err);
      setErrorMessage("An unexpected error occurred. Please try again or call us.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#1e5aa8] border-t-transparent rounded-full mx-auto" />
        <p className="text-xs text-slate-500 mt-4">Loading your quote basket...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-emerald-200 p-8 sm:p-12 text-center space-y-6 shadow-sm animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <Badge variant="success" className="text-xs">
          Quote Request Received
        </Badge>
        <h2 className="text-2xl font-bold text-slate-900">
          Thank you, {formData.name || "Customer"}!
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
          Our sales engineering team at Jess Enterprises has received your quotation
          inquiry and will prepare a formal commercial proposal with GST and delivery
          timelines within 24 business hours.
        </p>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5 text-left max-w-md mx-auto">
          <p>
            <span className="font-semibold text-slate-900">Contact:</span>{" "}
            {formData.phone} • {formData.email}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Need urgent dispatch?</span>{" "}
            Call us directly at <span className="font-bold text-[#1e5aa8]">+91 91583 91519</span>
          </p>
        </div>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link href="/products">
            <Button variant="primary">Browse More Instruments</Button>
          </Link>
          <a
            href={`https://wa.me/919158391519?text=${encodeURIComponent(
              `Hello Jess Enterprises, I just submitted a quote request for ${totalItemsCount} items under the name: ${formData.name}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="border-emerald-600 text-emerald-700">
              WhatsApp Follow-up
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Basket Items (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Items in Your Quote</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Adjust quantities or add specific customisation notes per item.
            </p>
          </div>
          {basket.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearQuoteBasket}
              className="text-xs text-[#dc2626] hover:bg-red-50 gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </Button>
          )}
        </div>

        {basket.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1e5aa8] flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Your quote basket is currently empty
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Explore our laboratory instruments catalogue, Legal Metrology standard weights, and custom fabrication works to add items for a formal quotation.
            </p>
            <Link href="/products">
              <Button variant="primary" className="gap-2">
                <span>Browse Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {basket.map((item) => (
              <div
                key={item.slug}
                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {item.categoryName && (
                      <Badge variant="secondary" className="text-[10px] mb-1">
                        {item.categoryName}
                      </Badge>
                    )}
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {item.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromQuoteBasket(item.slug)}
                    className="p-1.5 text-slate-400 hover:text-[#dc2626] hover:bg-red-50 rounded-md transition-colors"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantity Controls & Note */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-semibold">Qty:</span>
                    <div className="flex items-center border border-slate-300 rounded-md bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuoteItemQuantity(item.slug, item.quantity - 1)
                        }
                        className="p-1.5 text-slate-600 hover:bg-slate-100"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuoteItemQuantity(item.slug, item.quantity + 1)
                        }
                        className="p-1.5 text-slate-600 hover:bg-slate-100"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Item Customization Note */}
                  <input
                    type="text"
                    placeholder="Add special note (e.g. NABL cert / 230V specs)..."
                    value={item.note || ""}
                    onChange={(e) =>
                      updateQuoteItemNote(item.slug, e.target.value)
                    }
                    className="w-full sm:w-auto flex-1 text-xs px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
                  />
                </div>
              </div>
            ))}

            <div className="pt-2 flex justify-between items-center text-xs">
              <Link
                href="/products"
                className="text-[#1e5aa8] font-bold hover:underline flex items-center gap-1"
              >
                <span>+ Add more products from catalogue</span>
              </Link>
              <span className="text-slate-500">
                Total Products: <strong className="text-slate-900">{totalItemsCount} units</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Customer Details & Submit Form (5 Cols) */}
      <div className="lg:col-span-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Submit Quote Request
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Receive official B2B quotation with GST breakdown and delivery timelines.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmitQuote} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Naik"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8] ${
                    fieldErrors.name ? "border-red-400 bg-red-50/30" : "border-slate-200"
                  }`}
                />
              </div>
              {fieldErrors.name && (
                <p className="text-[11px] text-red-600 mt-1">{fieldErrors.name[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company / Organization
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Glenmark / Cipla / Research Lab"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="purchase@company.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8] ${
                      fieldErrors.email ? "border-red-400 bg-red-50/30" : "border-slate-200"
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.email[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="9158391519"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8] ${
                      fieldErrors.phone ? "border-red-400 bg-red-50/30" : "border-slate-200"
                    }`}
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.phone[0]}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location / City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Verna Industrial Estate, Goa"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Additional Requirements / Notes
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <textarea
                  rows={3}
                  placeholder="Specify delivery timeline, IQ/OQ requirements, or custom fabrication parameters..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting || basket.length === 0}
              className="w-full gap-2 font-bold shadow-md"
            >
              {submitting ? (
                <span>Submitting Request...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Official Quote Request</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default QuoteBasketView;
