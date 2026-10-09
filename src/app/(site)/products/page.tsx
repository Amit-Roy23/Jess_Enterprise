import React from "react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import ProductGridFilter from "@/components/site/ProductGridFilter";
import { getProducts, getCategories } from "@/server/queries";

export const metadata: Metadata = {
  title: "Product Catalogue | Laboratory Instruments & Standard Weights",
  description:
    "Explore Jess Enterprises catalogue of precision spectrophotometers, pH meters, moisture analyzers, certified reference weights (E1, E2, F1, F2), and custom fabrication equipment.",
};

export const revalidate = 60;

// All products are loaded once (static + revalidated) and filtered instantly in the browser
export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="primary" className="uppercase tracking-wider font-bold">
          Product Catalogue
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Precision Laboratory Instruments & Certified Metrology Standards
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Browse our complete selection of analytical instruments, balances, NABL
          certified weights, and custom cleanroom fabrication works. Add items to
          your quote basket for immediate pricing proposals.
        </p>
      </div>

      {/* Interactive Filter and Grid Component */}
      <ProductGridFilter initialProducts={products} categories={categories} />
    </div>
  );
}
