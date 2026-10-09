"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle, AlertCircle, Building, Phone, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateSiteSettingsAction } from "@/server/actions/settingsActions";
import type { SiteSettingsInput } from "@/lib/validators";

export interface SiteSettingsData {
  companyName?: string;
  tagline?: string;
  phones?: { mobile?: string; office?: string };
  email?: string;
  address?: string;
  mapEmbedUrl?: string;
  licenceNumber?: string;
  gstin?: string;
  udyam?: string;
  socialLinks?: { whatsapp?: string; linkedin?: string; facebook?: string };
  heroHeadline?: string;
  heroSubheadline?: string;
  businessHours?: string;
}

interface SettingsFormProps {
  initialData: SiteSettingsData;
}

type FormState = Required<Omit<SiteSettingsData, "phones" | "socialLinks">> & {
  phones: { mobile: string; office: string };
  socialLinks: { whatsapp: string; linkedin: string; facebook: string };
};

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#1e5aa8] focus:ring-2 focus:ring-blue-100";
const labelClass = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5";

export function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    companyName: initialData?.companyName || "Jess Enterprises",
    tagline: initialData?.tagline || "Innovative Services",
    phones: {
      mobile: initialData?.phones?.mobile || "9158391519",
      office: initialData?.phones?.office || "9225901519",
    },
    email: initialData?.email || "jess.enterprises14@gmail.com",
    address: initialData?.address || "Goa, India",
    mapEmbedUrl: initialData?.mapEmbedUrl || "",
    licenceNumber: initialData?.licenceNumber || "22000126-CLM (Authorised)",
    gstin: initialData?.gstin || "30AZCPG5317P1ZG",
    udyam: initialData?.udyam || "UDYAM-GA-01-0024091 (Micro)",
    socialLinks: {
      whatsapp: initialData?.socialLinks?.whatsapp || "https://wa.me/919225901519",
      linkedin: initialData?.socialLinks?.linkedin || "",
      facebook: initialData?.socialLinks?.facebook || "",
    },
    heroHeadline: initialData?.heroHeadline || "",
    heroSubheadline: initialData?.heroSubheadline || "",
    businessHours: initialData?.businessHours || "Monday – Saturday: 9:00 AM – 6:30 PM",
  });

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    startTransition(async () => {
      const res = await updateSiteSettingsAction(form as SiteSettingsInput);
      if (res.success) {
        setSuccessMessage("Site settings updated successfully. The website will show the changes right away.");
        router.refresh();
      } else {
        const fieldErrors = "errors" in res && res.errors ? Object.keys(res.errors).join(", ") : "";
        setErrorMessage(fieldErrors ? `${res.message}: check ${fieldErrors}` : res.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-16">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          Update company details, contact numbers and registrations shown across the website.
        </p>
        <Button type="submit" variant="primary" disabled={isPending} className="gap-2 font-bold shadow-xs">
          <Save className="w-4 h-4" />
          <span>{isPending ? "Saving..." : "Save Settings"}</span>
        </Button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Building className="w-4 h-4 text-[#1e5aa8]" />
          <h2 className="text-sm font-bold text-slate-900">Company &amp; Registrations</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Company Name *</label>
            <input required className={inputClass} value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input className={inputClass} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Legal Metrology Licence</label>
            <input className={inputClass} value={form.licenceNumber} onChange={(e) => set("licenceNumber", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>GSTIN</label>
            <input className={inputClass} value={form.gstin} onChange={(e) => set("gstin", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>MSME / Udyam Number</label>
            <input className={inputClass} value={form.udyam} onChange={(e) => set("udyam", e.target.value)} />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Phone className="w-4 h-4 text-[#1e5aa8]" />
          <h2 className="text-sm font-bold text-slate-900">Contact Details</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Office Phone</label>
            <input
              className={inputClass}
              value={form.phones.office}
              placeholder="9225901519"
              onChange={(e) => set("phones", { ...form.phones, office: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Mobile Phone</label>
            <input
              className={inputClass}
              value={form.phones.mobile}
              placeholder="9158391519"
              onChange={(e) => set("phones", { ...form.phones, mobile: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <input type="email" required className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Business Hours</label>
            <input className={inputClass} value={form.businessHours} onChange={(e) => set("businessHours", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Address</label>
            <textarea rows={2} className={inputClass} value={form.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Google Maps Embed URL (optional)</label>
            <input
              className={inputClass}
              value={form.mapEmbedUrl}
              placeholder="https://www.google.com/maps/embed?pb=..."
              onChange={(e) => set("mapEmbedUrl", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>WhatsApp Link</label>
            <input
              className={inputClass}
              value={form.socialLinks.whatsapp}
              onChange={(e) => set("socialLinks", { ...form.socialLinks, whatsapp: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input
              className={inputClass}
              value={form.socialLinks.linkedin}
              onChange={(e) => set("socialLinks", { ...form.socialLinks, linkedin: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Facebook URL</label>
            <input
              className={inputClass}
              value={form.socialLinks.facebook}
              onChange={(e) => set("socialLinks", { ...form.socialLinks, facebook: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Megaphone className="w-4 h-4 text-[#1e5aa8]" />
          <h2 className="text-sm font-bold text-slate-900">Home Page Text</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Hero Headline</label>
            <input className={inputClass} value={form.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Hero Description (shown under the headline)</label>
            <textarea rows={3} className={inputClass} value={form.heroSubheadline} onChange={(e) => set("heroSubheadline", e.target.value)} />
          </div>
        </div>
      </section>
    </form>
  );
}

export default SettingsForm;
