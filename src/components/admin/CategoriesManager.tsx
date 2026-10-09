"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, FolderPlus, Save, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/server/actions/categoryActions";

type VerticalType = "legal-metrology" | "lab-instruments" | "fabrication";

interface CategoryRow {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  vertical?: VerticalType;
  order?: number;
  isActive?: boolean;
}

interface CategoriesManagerProps {
  initialCategories: CategoryRow[];
  productCounts: Record<string, number>;
}

export function CategoriesManager({
  initialCategories,
  productCounts,
}: CategoriesManagerProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryRow[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    vertical: "lab-instruments" as VerticalType,
    description: "",
    image: "",
    order: 0,
    isActive: true,
  });

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      vertical: "lab-instruments",
      description: "",
      image: "",
      order: categories.length + 1,
      isActive: true,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryRow) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      vertical: cat.vertical || "lab-instruments",
      description: cat.description || "",
      image: cat.image || "",
      order: cat.order || 0,
      isActive: cat.isActive !== false,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!editingCategory) {
      const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, name, slug }));
    } else {
      setFormData((prev) => ({ ...prev, name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    startTransition(async () => {
      if (editingCategory) {
        const res = await updateCategoryAction(editingCategory._id, formData);
        if (res.success) {
          setIsModalOpen(false);
          router.refresh();
        } else {
          setErrorMessage(res.message);
        }
      } else {
        const res = await createCategoryAction(formData);
        if (res.success) {
          setIsModalOpen(false);
          router.refresh();
        } else {
          setErrorMessage(res.message);
        }
      }
    });
  };

  const handleDelete = async (cat: CategoryRow) => {
    const count = productCounts[cat._id] || 0;
    if (count > 0) {
      alert(`Cannot delete category "${cat.name}" because it contains ${count} products. Reassign or delete those products first.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    startTransition(async () => {
      const res = await deleteCategoryAction(cat._id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c._id !== cat._id));
        router.refresh();
      } else {
        alert(res.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Showing <strong>{initialCategories.length}</strong> categories configured
        </p>
        <Button
          size="sm"
          variant="primary"
          onClick={openCreateModal}
          className="gap-1.5 font-bold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </Button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {initialCategories.map((cat) => {
          const count = productCounts[cat._id] || 0;

          return (
            <div
              key={cat._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Category Cover Image */}
                <div className="h-36 bg-slate-100 relative overflow-hidden border-b border-slate-100">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                      <FolderPlus className="w-8 h-8 opacity-40 mb-1" />
                      <span className="text-[11px]">No cover photo</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-700 shadow-xs">
                    Order: {cat.order ?? 0}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{cat.name}</h3>
                    <span className="shrink-0 bg-blue-50 text-[#1e5aa8] px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                      {count} items
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">/{cat.slug}</p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {cat.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase ${
                    cat.isActive !== false ? "text-emerald-700" : "text-slate-400"
                  }`}
                >
                  {cat.isActive !== false ? "Active" : "Inactive"}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-slate-600 hover:text-[#1e5aa8] rounded-md hover:bg-white transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-white transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Weighing Balances & Mass Comparators"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="weighing-balances"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#1e5aa8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Business Vertical *
                  </label>
                  <select
                    value={formData.vertical}
                    onChange={(e) =>
                      setFormData({ ...formData, vertical: e.target.value as VerticalType })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white"
                  >
                    <option value="lab-instruments">Lab Instruments</option>
                    <option value="legal-metrology">Legal Metrology</option>
                    <option value="fabrication">Custom Fabrication</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category overview summary..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
                />
              </div>

              <ImageUploader
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Category Cover Photo"
              />

              <div className="flex items-center justify-between pt-2">
                <div className="w-32">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-4">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-slate-300 text-[#1e5aa8]"
                  />
                  <span>Active Category</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isPending}
                  className="gap-1.5 font-bold"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isPending ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
