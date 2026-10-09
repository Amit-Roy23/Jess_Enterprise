import React from "react";
import { connectDB } from "@/lib/db";
import { Enquiry } from "@/models";
import { EnquiryListInbox } from "@/components/admin/EnquiryListInbox";

export const metadata = {
  title: "Enquiries & Lead Management | Jess Enterprises Admin",
};

export const dynamic = "force-dynamic";

interface EnquiryDoc {
  _id: string;
  type: "quote" | "service" | "amc" | "stamping" | "fabrication" | "contact";
  name: string;
  company?: string;
  email: string;
  phone: string;
  city?: string;
  message: string;
  status: "new" | "contacted" | "quoted" | "won" | "lost" | "closed";
  items?: { productName: string; quantity: number; note?: string }[];
  internalNotes?: { text: string; by: string; at: string | Date }[];
  sourcePage?: string;
  createdAt: string | Date;
}

export default async function AdminEnquiriesPage() {
  let enquiries: EnquiryDoc[] = [];

  try {
    await connectDB();
    const raw = await Enquiry.find().sort({ createdAt: -1 }).lean();
    enquiries = JSON.parse(JSON.stringify(raw));
  } catch (error) {
    console.error("Failed to load enquiries in admin:", error);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Client Enquiries & Quote Requests
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review incoming leads from quote baskets, Legal Metrology stamping forms, AMC requests, and fabrication quotes.
        </p>
      </div>

      <EnquiryListInbox initialEnquiries={enquiries} />
    </div>
  );
}
