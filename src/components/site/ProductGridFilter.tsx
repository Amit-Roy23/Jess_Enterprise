"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, Filter, RotateCcw } from "lucide-react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";

interface CategoryData {
  _id?: unknown;
  name: string;
  slug: string;
  vertical: string;
}

interface ProductData {
  _id?: unknown;
  name: string;
  slug: string;
  category?: unknown;
  shortDescription?: string;
  specs?: { label: string; value: string }[];
  images?: { url: string; alt?: string }[];
  needsReview?: boolean;
}

interface ProductGridFilterProps {
  initialProducts: ProductData[];
  categories: CategoryData[];
  initialCategory?: string;
}

const VERTICAL_TABS = [
  { id: "all", label: "All Products" },
  { id: "lab-instruments", label: "Lab Instruments" },
  { id: "legal-metrology", label: "Legal Metrology & Weighing" },
  { id: "fabrication", label: "Custom Fabrication" },
];

/** Applies ?category= / ?vertical= / ?search= deep links (isolated so the grid itself still prerenders). */
function SearchParamsSync({ onParams }: { onParams: (p: URLSearchParams) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    onParams(new URLSearchParams(searchParams.toString()));
  }, [searchParams, onParams]);
  return null;
}

export function ProductGridFilter({
  initialProducts,
  categories,
  initialCategory,
}: ProductGridFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVertical, setSelectedVertical] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const applyParams = React.useCallback((p: URLSearchParams) => {
    const category = p.get("category");
    const vertical = p.get("vertical");
    const search = p.get("search");
    if (category) setSelectedCategory(category);
    if (vertical) setSelectedVertical(vertical);
    if (search) setSearchQuery(search);
  }, []);

  // Filtered categories based on active vertical
  const visibleCategories = useMemo(() => {
    if (selectedVertical === "all") return categories;
    return categories.filter((c) => c.vertical === selectedVertical);
  }, [categories, selectedVertical]);

  // Filter products by search, vertical, and category
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Vertical match
      const productCat =
        typeof product.category === "object" && product.category !== null
          ? (product.category as { _id?: unknown; name?: string; slug?: string; vertical?: string })
          : categories.find((c) => String(c._id) === String(product.category));

      const productVertical = productCat?.vertical;
      if (
        selectedVertical !== "all" &&
        productVertical !== selectedVertical
      ) {
        return false;
      }

      // 2. Category match
      if (selectedCategory !== "all") {
        if (productCat?.slug !== selectedCategory) {
          return false;
        }
      }

      // 3. Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchDesc = product.shortDescription
          ?.toLowerCase()
          .includes(query);
        const matchSpec = product.specs?.some(
          (s) =>
            s.label.toLowerCase().includes(query) ||
            s.value.toLowerCase().includes(query)
        );
        if (!matchName && !matchDesc && !matchSpec) {
          return false;
        }
      }

      return true;
    });
  }, [initialProducts, categories, selectedVertical, selectedCategory, searchQuery]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedVertical("all");
    setSelectedCategory("all");
  };

  return (
    <div className="space-y-8">
      <Suspense fallback={null}>
        <SearchParamsSync onParams={applyParams} />
      </Suspense>
      {/* Search and Top Vertical Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-5">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search laboratory balances, spectrophotometers, certified weights, fabrication works..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1e5aa8] focus:ring-2 focus:ring-[#1e5aa8]/20 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Vertical Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-100">
          {VERTICAL_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedVertical(tab.id);
                setSelectedCategory("all");
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                selectedVertical === tab.id
                  ? "bg-[#1e5aa8] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Categories:
          </span>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Categories
          </button>
          {visibleCategories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.slug
                  ? "bg-[#1e5aa8] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-600">
          Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span>{" "}
          instruments & solutions
        </p>

        {(searchQuery || selectedVertical !== "all" || selectedCategory !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs text-[#dc2626] hover:bg-red-50 gap-1.5 h-8"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </Button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, idx) => {
            const productCat =
              typeof product.category === "object" && product.category !== null
                ? (product.category as { _id?: unknown; name?: string; slug?: string; vertical?: string })
                : categories.find((c) => String(c._id) === String(product.category));

            return (
              <ProductCard
                key={String(product._id || idx)}
                id={String(product._id || idx)}
                name={product.name}
                slug={product.slug}
                categoryName={productCat?.name}
                categorySlug={productCat?.slug}
                shortDescription={product.shortDescription}
                specs={product.specs}
                images={product.images}
                needsReview={product.needsReview}
              />
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1e5aa8] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No instruments matched your filter</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Try adjusting your search keyword or resetting the category filter to explore our complete 25+ product catalogue.
          </p>
          <Button variant="primary" size="sm" onClick={resetFilters}>
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProductGridFilter;
