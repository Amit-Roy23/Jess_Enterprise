"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/server/actions/productActions";

interface ProductRow {
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

interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
}

interface ProductListTableProps {
  initialProducts: ProductRow[];
  categories: CategoryOption[];
}

export function ProductListTable({ initialProducts, categories }: ProductListTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterReview, setFilterReview] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const reviewCount = initialProducts.filter((p) => p.needsReview).length;

  const filteredProducts = initialProducts.filter((product) => {
    // Review filter
    if (filterReview && !product.needsReview) return false;

    // Category filter
    if (selectedCategory !== "all") {
      const catId = typeof product.category === "object" ? product.category._id : product.category;
      if (catId !== selectedCategory) return false;
    }

    // Search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = product.name.toLowerCase().includes(term);
      const matchSlug = product.slug.toLowerCase().includes(term);
      const matchDesc = product.shortDescription?.toLowerCase().includes(term);
      if (!matchName && !matchSlug && !matchDesc) return false;
    }

    return true;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    startTransition(async () => {
      const res = await deleteProductAction(id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.message);
      }
      setDeletingId(null);
    });
  };

  return (
    <div className="space-y-4">
      {/* Action Header & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by name, slug or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1e5aa8]"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-[#1e5aa8]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Needs Review toggle */}
          <button
            onClick={() => setFilterReview(!filterReview)}
            className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-colors ${
              filterReview
                ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Needs Review</span>
            {reviewCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  filterReview ? "bg-white text-amber-700" : "bg-amber-100 text-amber-800"
                }`}
              >
                {reviewCount}
              </span>
            )}
          </button>

          {/* Add Product Button */}
          <Link href="/admin/products/new">
            <Button size="sm" variant="primary" className="gap-1.5 font-bold shadow-xs whitespace-nowrap">
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Button>
          </Link>
        </div>

        {/* Status count info */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of{" "}
            <strong>{initialProducts.length}</strong> products
          </div>
          {reviewCount > 0 && (
            <div className="text-amber-700 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{reviewCount} products seeded with &quot;Needs Review&quot; flag</span>
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Flags</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No products found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const catName =
                    typeof product.category === "object"
                      ? product.category?.name
                      : categories.find((c) => c._id === product.category)?.name || "Uncategorized";

                  const primaryImage = product.images?.[0]?.url;

                  return (
                    <tr key={product._id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Product details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                            {primaryImage ? (
                              <Image
                                src={primaryImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                No Pic
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{product.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono line-clamp-1">
                              /{product.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 font-semibold text-slate-600">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px]">
                          {catName}
                        </span>
                      </td>

                      {/* Active Status */}
                      <td className="py-3.5 px-4">
                        {product.isActive !== false ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-bold text-[11px]">
                            <XCircle className="w-3.5 h-3.5" />
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Flags (Featured / Needs Review) */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {product.needsReview && (
                            <Badge variant="warning" className="text-[10px] py-0 px-1.5">
                              Needs Review
                            </Badge>
                          )}
                          {product.isFeatured && (
                            <Badge variant="primary" className="text-[10px] py-0 px-1.5 flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            title="View on Live Site"
                            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/admin/products/${product._id}`}
                            title="Edit Product"
                            className="p-1.5 text-slate-500 hover:text-[#1e5aa8] rounded-md hover:bg-slate-100"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            disabled={deletingId === product._id || isPending}
                            title="Delete Product"
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
