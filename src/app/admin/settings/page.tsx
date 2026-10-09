import React from "react";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models";
import { SettingsForm, type SiteSettingsData } from "@/components/admin/SettingsForm";

export const metadata = {
  title: "Site Settings & Compliance | Jess Enterprises Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let settings: SiteSettingsData | null = null;

  try {
    await connectDB();
    const raw = await SiteSettings.findOne().lean();
    settings = raw ? JSON.parse(JSON.stringify(raw)) : null;
  } catch (error) {
    console.error("Failed to load site settings in admin:", error);
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
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
