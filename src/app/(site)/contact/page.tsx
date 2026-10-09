"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ShieldCheck,
  Building,
  User,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { submitEnquiryAction } from "@/server/actions/enquiryActions";

export default function ContactPage() {
  const [enquiryType, setEnquiryType] = useState<
    "quote" | "service" | "amc" | "stamping" | "fabrication" | "contact"
  >("contact");

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    instrumentType: "",
    makeModel: "",
    preferredDate: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});
    setSubmitting(true);

    try {
      // Compose full message including visit date or instrument make if provided
      let fullMessage = formData.message.trim();
      if (formData.instrumentType || formData.preferredDate) {
        fullMessage = `[Instrument: ${formData.instrumentType || "N/A"}] [Preferred Visit Date: ${formData.preferredDate || "N/A"}]\n\n${fullMessage}`;
      }

      const result = await submitEnquiryAction({
        type: enquiryType,
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        message: fullMessage || `${enquiryType.toUpperCase()} service request.`,
        sourcePage: "/contact",
        status: "new",
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(result.message || "Failed to submit request.");
        if (result.errors) {
          setFieldErrors(result.errors);
        }
      }
    } catch (err) {
      console.error("Enquiry submission error:", err);
      setErrorMessage("An unexpected error occurred. Please try again or call us.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary" className="uppercase tracking-wider font-bold">
          Contact & Technical Support
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Get in Touch with Jess Enterprises
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Whether you require a formal quotation, statutory Legal Metrology
          stamping, balance AMC calibration, or custom fabrication engineering,
          our team is here to assist you promptly.
        </p>
      </div>

      {/* Main Grid: Contact Info Cards (5 cols) + Form (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info & Statutory Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Contacts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Direct Contact Channels
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e5aa8] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400">
                    Mobile
                  </span>
                  <a
                    href="tel:9158391519"
                    className="block text-sm font-bold text-slate-900 hover:text-[#1e5aa8]"
                  >
                    +91 91583 91519
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e5aa8] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400">
                    Office / WhatsApp
                  </span>
                  <a
                    href="tel:9225901519"
                    className="block text-sm font-bold text-slate-900 hover:text-[#1e5aa8]"
                  >
                    +91 92259 01519
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e5aa8] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400">
                    Email Address
                  </span>
                  <a
                    href="mailto:jess.enterprises14@gmail.com"
                    className="block text-sm font-bold text-slate-900 hover:text-[#1e5aa8] break-all"
                  >
                    jess.enterprises14@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e5aa8] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400">
                    Location
                  </span>
                  <p className="text-sm font-bold text-slate-900">
                    Goa, India
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Serving Verna, Kundaim, Pilerne, Tuem, Madkai & all industrial zones
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e5aa8] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400">
                    Working Hours
                  </span>
                  <p className="text-sm font-bold text-slate-900">
                    Mon – Sat: 9:00 AM – 6:30 PM
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sunday: Closed (Emergency breakdown on request)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Card */}
          <div className="bg-[#0d2140] text-white rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Statutory Compliance Data</span>
            </div>
            <div className="space-y-2 text-xs border-t border-white/10 pt-3">
              <p className="flex justify-between">
                <span className="text-blue-200">Legal Metrology Licence:</span>
                <span className="font-mono font-bold text-white">22000126-CLM</span>
              </p>
              <p className="flex justify-between">
                <span className="text-blue-200">GSTIN:</span>
                <span className="font-mono font-bold text-white">30AZCPG5317P1ZG</span>
              </p>
              <p className="flex justify-between">
                <span className="text-blue-200">MSME Udyam:</span>
                <span className="font-mono font-bold text-white">UDYAM-GA-01-0024091</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Interactive Enquiry / Service Request Form (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Send an Enquiry or Service Request
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your enquiry category and submit technical requirements for immediate response.
              </p>
            </div>

            {/* Type Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "quote", label: "Quotation" },
                { id: "stamping", label: "Legal Metrology Stamping" },
                { id: "amc", label: "Balance AMC" },
                { id: "service", label: "Instrument Service" },
                { id: "fabrication", label: "Custom Fabrication" },
                { id: "contact", label: "General Enquiry" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setEnquiryType(tab.id as typeof enquiryType)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    enquiryType === tab.id
                      ? "bg-[#1e5aa8] text-white shadow-2xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {submitted ? (
              <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-xl border border-emerald-200 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Enquiry Successfully Submitted!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-900">{formData.name || "Customer"}</strong>. Our technical team at Jess Enterprises has received your {enquiryType} request and will contact you promptly.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                  className="mt-2"
                >
                  Submit Another Request
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Dr. Rajesh Naik"
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
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Glenmark / Cipla / Research QC"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
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

                {(enquiryType === "service" ||
                  enquiryType === "amc" ||
                  enquiryType === "stamping") && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Instrument Type & Make
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Analytical Balance (Mettler / Sartorius)"
                        value={formData.instrumentType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instrumentType: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Preferred Visit Date
                      </label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8] bg-white"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Location / City in Goa
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Verna Phase 2, Goa"
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
                    Detailed Message / Technical Requirement *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the instrument specs, number of units, AMC requirements, or fabrication dimensions..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className={`w-full p-3 rounded-lg border text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8] ${
                      fieldErrors.message ? "border-red-400 bg-red-50/30" : "border-slate-200"
                    }`}
                  />
                  {fieldErrors.message && (
                    <p className="text-[11px] text-red-600 mt-1">{fieldErrors.message[0]}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting}
                  className="w-full gap-2 font-bold shadow-md"
                >
                  {submitting ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit {enquiryType.toUpperCase()} Request</span>
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
