import React from "react";
import { connectDB } from "@/lib/db";
import { GalleryItem } from "@/models";
import { GalleryManager } from "@/components/admin/GalleryManager";

export const metadata = {
  title: "Fabrication Gallery Management | Jess Enterprises Admin",
};

export const dynamic = "force-dynamic";

type MaterialGrade = "SS" | "MS" | "Acrylic" | "PVC" | "Teflon" | "Polycarbonate";

interface GalleryDoc {
  _id: string;
  title: string;
  description?: string;
  material: MaterialGrade;
  images?: { url: string; alt?: string }[];
  order?: number;
  isActive?: boolean;
}

export default async function AdminGalleryPage() {
  let items: GalleryDoc[] = [];

  try {
    await connectDB();
    const rawItems = await GalleryItem.find().sort({ order: 1 }).lean();
    items = JSON.parse(JSON.stringify(rawItems));
  } catch (error) {
    console.error("Failed to load fabrication gallery in admin:", error);
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Custom Fabrication Showcase
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage stainless steel cleanroom fabrication photos, technical material grades, and workshop portfolio items.
        </p>
      </div>

      <GalleryManager initialItems={items} />
    </div>
  );
}
