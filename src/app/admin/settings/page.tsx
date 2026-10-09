import React from "react";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata = {
  title: "Site Settings & Compliance | Jess Enterprises Admin",
};

export const dynamic = "force-dynamic";

interface SiteSettingsDoc {
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

export default async function AdminSettingsPage() {
  let settings: SiteSettingsDoc | null = null;

  try {
    await connectDB();
    const raw = await SiteSettings.findOne().lean();
    settings = raw ? JSON.parse(JSON.stringify(raw)) : null;
  } catch (error) {
    console.error("Failed to load site settings in admin:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Global Settings & Compliance Registrations
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure business details, Legal Metrology licence numbers, GSTIN, and notification routing.
        </p>
      </div>

      <SettingsForm initialData={settings || { companyName: "Jess Enterprises" }} />
    </div>
  );
}
