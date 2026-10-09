import React from "react";
import { connectDB } from "@/lib/db";
import { Product, Category } from "@/models";
import { ProductListTable } from "@/components/admin/ProductListTable";

export const metadata = {
  title: "Products Management | Jess Enterprises Admin",
};

export const dynamic = "force-dynamic";

interface ProductRowDoc {
  _id: string;
  name: string;
  slug: string;
  category: { _id: string; name: string; slug: string } | string;
  shortDescription?: string;
  images?: { url: string; alt?: string }[];
  isFeatured?: boolean;
  isActive?: boolean;
  needsReview?: boolean;
  updatedAt?: string;
}

interface CategoryOptionDoc {
  _id: string;
  name: string;
  slug: string;
}

export default async function AdminProductsPage() {
  let products: ProductRowDoc[] = [];
  let categories: CategoryOptionDoc[] = [];

  try {
    await connectDB();
    const [rawProducts, rawCats] = await Promise.all([
      Product.find().populate("category", "name slug").sort({ updatedAt: -1 }).lean(),
      Category.find().sort({ order: 1 }).lean(),
    ]);

    products = JSON.parse(JSON.stringify(rawProducts));
    categories = JSON.parse(JSON.stringify(rawCats));
  } catch (error) {
    console.error("Failed to load products in admin:", error);
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Equipment & Instruments Catalogue
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage, create, and configure technical specifications and images for all laboratory equipment.
        </p>
      </div>

      {/* Interactive Table */}
      <ProductListTable initialProducts={products} categories={categories} />
    </div>
  );
}
