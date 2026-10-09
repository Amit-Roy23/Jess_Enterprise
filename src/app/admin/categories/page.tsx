import React from "react";
import { connectDB } from "@/lib/db";
import { Category, Product } from "@/models";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export const metadata = {
  title: "Categories Management | Jess Enterprises Admin",
};

export const dynamic = "force-dynamic";

interface CategoryDoc {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order?: number;
  isActive?: boolean;
}

export default async function AdminCategoriesPage() {
  let categories: CategoryDoc[] = [];
  const productCounts: Record<string, number> = {};

  try {
    await connectDB();
    const rawCategories = await Category.find().sort({ order: 1 }).lean();
    categories = JSON.parse(JSON.stringify(rawCategories));

    // Get count of products in each category
    const products = await Product.find({}, "category").lean();
    products.forEach((p: { category?: { toString(): string } }) => {
      const catId = p.category?.toString();
      if (catId) {
        productCounts[catId] = (productCounts[catId] || 0) + 1;
      }
    });
  } catch (error) {
    console.error("Failed to load categories in admin:", error);
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Product Categories
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Organize laboratory instruments into navigation categories with cover photos and descriptions.
        </p>
      </div>

      <CategoriesManager initialCategories={categories} productCounts={productCounts} />
    </div>
  );
}
