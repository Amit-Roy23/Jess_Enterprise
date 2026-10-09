import React from "react";
import { connectDB } from "@/lib/db";
import { Category } from "@/models";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = {
  title: "Add New Product | Jess Enterprises Admin",
};

export const dynamic = "force-dynamic";

interface CategoryOptionDoc {
  _id: string;
  name: string;
  slug: string;
}

export default async function NewProductPage() {
  let categories: CategoryOptionDoc[] = [];

  try {
    await connectDB();
    const rawCats = await Category.find().sort({ order: 1 }).lean();
    categories = JSON.parse(JSON.stringify(rawCats));
  } catch (error) {
    console.error("Failed to load categories for new product form:", error);
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Add New Equipment / Product
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Fill in the technical specifications, features, applications, and upload equipment imagery.
        </p>
      </div>

      <ProductForm categories={categories} isEditing={false} />
    </div>
  );
}
