import React from "react";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Product, Category } from "@/models";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = {
  title: "Edit Product | Jess Enterprises Admin",
};

export const dynamic = "force-dynamic";

interface ProductDoc {
  _id: string;
  name: string;
  slug: string;
  category: { _id: string; name: string } | string;
  shortDescription?: string;
  description?: string;
  specs?: { label: string; value: string }[];
  features?: string[];
  applications?: string[];
  images?: { url: string; alt?: string }[];
  isFeatured?: boolean;
  isActive?: boolean;
  needsReview?: boolean;
  order?: number;
}

interface CategoryOptionDoc {
  _id: string;
  name: string;
  slug: string;
}

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  let product: ProductDoc | null = null;
  let categories: CategoryOptionDoc[] = [];

  try {
    await connectDB();
    const [rawProduct, rawCats] = await Promise.all([
      Product.findById(id).lean(),
      Category.find().sort({ order: 1 }).lean(),
    ]);

    if (!rawProduct) {
      notFound();
    }

    product = JSON.parse(JSON.stringify(rawProduct));
    categories = JSON.parse(JSON.stringify(rawCats));
  } catch (error) {
    console.error("Failed to load product for editing:", error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  const catId = typeof product.category === "object" ? product.category._id : product.category;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Edit &ldquo;{product.name}&rdquo;
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Update specifications, change visibility flags, or replace instrument photos.
        </p>
      </div>

      <ProductForm
        initialData={{
          ...product,
          _id: product._id,
          category: catId,
        }}
        categories={categories}
        isEditing={true}
      />
    </div>
  );
}
