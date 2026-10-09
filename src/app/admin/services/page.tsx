import React from "react";
import { connectDB } from "@/lib/db";
import { Service } from "@/models";
import { ServicesManager } from "@/components/admin/ServicesManager";

export const metadata = {
  title: "Services Management | Jess Enterprises Admin",
};

export const dynamic = "force-dynamic";

type ServiceVertical = "legal-metrology" | "lab-instruments" | "fabrication";

interface ServiceDoc {
  _id: string;
  title: string;
  slug: string;
  vertical?: ServiceVertical;
  summary?: string;
  description?: string;
  highlights?: string[];
  image?: string;
  order?: number;
  isActive?: boolean;
}

export default async function AdminServicesPage() {
  let services: ServiceDoc[] = [];

  try {
    await connectDB();
    const rawServices = await Service.find().sort({ order: 1 }).lean();
    services = JSON.parse(JSON.stringify(rawServices));
  } catch (error) {
    console.error("Failed to load services in admin:", error);
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Services & Compliance Offerings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage service descriptions, deliverables, turnaround times, and Legal Metrology verification scopes.
        </p>
      </div>

      <ServicesManager initialServices={services} />
    </div>
  );
}
