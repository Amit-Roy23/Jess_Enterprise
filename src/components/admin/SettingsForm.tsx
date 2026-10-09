"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle, AlertCircle, Building, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateSiteSettingsAction } from "@/server/actions/settingsActions";
import type { SiteSettingsInput } from "@/lib/validators";

interface SiteSettingsData {
  companyName: string;
  tagline?: string;
  phones?: {
    whatsapp?: string;
    office?: string;
  };
  email?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  gstin?: string;
  legalMetrologyLicence?: string;
  googleMapsUrl?: string;
  officeHours?: string;
  quoteEmailRecipients?: string[];
}

interface SettingsFormProps {
  initialData: SiteSettingsData;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<SiteSettingsData>({
    companyName: initialData?.companyName || "Jess Enterprises",
    tagline: initialData?.tagline || "Innovative Services",
    phones: {
      whatsapp: initialData?.phones?.whatsapp || "9158391519",
      office: initialData?.phones?.office || "9225901519",
    },
    email: initialData?.email || "jess.enterprises14@gmail.com",
    address: {
      street: initialData?.address?.street || "",
      city: initialData?.address?.city || "Goa",
      state: initialData?.address?.state || "Goa",
      pincode: initialData?.address?.pincode || "",
      country: initialData?.address?.country || "India",
    },
    gstin: initialData?.gstin || "30AZCPG5317P1ZG",
    legalMetrologyLicence: initialData?.legalMetrologyLicence || "22000126-CLM",
    googleMapsUrl: initialData?.googleMapsUrl || "",
    officeHours: initialData?.officeHours || "Mon – Sat: 9:00 AM – 6:30 PM",
    quoteEmailRecipients: initialData?.quoteEmailRecipients || ["jess.enterprises14@gmail.com"],
  });

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    startTransition(async () => {
      const res = await updateSiteSettingsAction(formData as SiteSettingsInput);
      if (res.success) {
        setSuccessMessage("Site settings updated successfully.");
        router.refresh();
      } else {
        setErrorMessage(res.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-16">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Update global contact coordinates, compliance licence numbers, and notification recipients.
        </p>
        <Button
          type="submit"
          variant="primary"
          disabled={isPending}
          className="gap-2 font-bold shadow-xs"
        >
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

      {/* General & Legal Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Building className="w-4 h-4 text-[#1e5aa8]" />
          <h2 className="text-sm font-bold text-slate-900">
            Company & Compliance Registrations
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Company Name *
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) =>
                setFormData({ ...formData, tagline: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Legal Metrology Licence No. *
            </label>
            <input
              type="text"
              required
              value={formData.legalMetrologyLicence}
              onChange={(e) =>
                setFormData({ ...formData, legalMetrologyLicence: e.target.value })
              }
              placeholder="22000126-CLM"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#1e5aa8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              GSTIN *
            </label>
            <input
              type="text"
              required
              value={formData.gstin}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              placeholder="30AZCPG5317P1ZG"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#1e5aa8]"
            />
          </div>
        </div>
      </div>

      {/* Communication Coordinates */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Phone className="w-4 h-4 text-[#1e5aa8]" />
          <h2 className="text-sm font-bold text-slate-900">
            Contact Channels & Notifications
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mobile / WhatsApp Number
            </label>
            <input
              type="text"
              value={formData.phones?.whatsapp}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phones: { ...formData.phones, whatsapp: e.target.value },
                })
              }
              placeholder="9158391519"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Office Landline / Phone
            </label>
            <input
              type="text"
              value={formData.phones?.office}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phones: { ...formData.phones, office: e.target.value },
                })
              }
              placeholder="9225901519"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Primary Business Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jess.enterprises14@gmail.com"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Office Working Hours
            </label>
            <input
              type="text"
              value={formData.officeHours}
              onChange={(e) =>
                setFormData({ ...formData, officeHours: e.target.value })
              }
              placeholder="Mon – Sat: 9:00 AM – 6:30 PM"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Google Maps URL / Embed Link
            </label>
            <input
              type="text"
              value={formData.googleMapsUrl}
              onChange={(e) =>
                setFormData({ ...formData, googleMapsUrl: e.target.value })
              }
              placeholder="https://maps.google.com/..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
