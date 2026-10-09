"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/admin/ImageUploader";
import { createProductAction, updateProductAction } from "@/server/actions/productActions";

interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  initialData?: {
    _id?: string;
    name: string;
    slug: string;
    category: string;
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
  };
  categories: CategoryOption[];
  isEditing?: boolean;
}

export function ProductForm({
  initialData,
  categories,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    category: initialData?.category || categories[0]?._id || "",
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    specs: initialData?.specs || [{ label: "", value: "" }],
    features: initialData?.features || [""],
    applications: initialData?.applications || [""],
    images: initialData?.images || [{ url: "", alt: "" }],
    isFeatured: initialData?.isFeatured ?? false,
    isActive: initialData?.isActive ?? true,
    needsReview: initialData?.needsReview ?? false,
    order: initialData?.order ?? 0,
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Auto-generate slug from name if new
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!isEditing) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, name, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, name }));
    }
  };

  // Specs Manager
  const addSpecRow = () => {
    setFormData((prev) => ({
      ...prev,
      specs: [...prev.specs, { label: "", value: "" }],
    }));
  };

  const updateSpec = (index: number, field: "label" | "value", value: string) => {
    setFormData((prev) => {
      const updated = [...prev.specs];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, specs: updated };
    });
  };

  const removeSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  // Features Manager
  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const updateFeature = (index: number, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.features];
      updated[index] = val;
      return { ...prev, features: updated };
    });
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Applications Manager
  const addApp = () => {
    setFormData((prev) => ({ ...prev, applications: [...prev.applications, ""] }));
  };

  const updateApp = (index: number, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.applications];
      updated[index] = val;
      return { ...prev, applications: updated };
    });
  };

  const removeApp = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      applications: prev.applications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Filter empty specs
    const cleanSpecs = formData.specs.filter(
      (s) => s.label.trim() && s.value.trim()
    );
    const cleanFeatures = formData.features.filter((f) => f.trim());
    const cleanApps = formData.applications.filter((a) => a.trim());
    const cleanImages = formData.images.filter((img) => img.url.trim());

    const payload = {
      ...formData,
      specs: cleanSpecs,
      features: cleanFeatures,
      applications: cleanApps,
      images: cleanImages,
    };

    try {
      if (isEditing && initialData?._id) {
        const res = await updateProductAction(initialData._id, payload);
        if (res.success) {
          setSuccessMessage("Product updated successfully.");
          router.refresh();
        } else {
          setErrorMessage(res.message);
        }
      } else {
        const res = await createProductAction(payload);
        if (res.success) {
          setSuccessMessage("Product created successfully.");
          router.push("/admin/products");
        } else {
          setErrorMessage(res.message);
        }
      }
    } catch (err) {
      console.error("Product save error:", err);
      setErrorMessage("An unexpected error occurred while saving product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products List</span>
        </Link>

        <Button
          type="submit"
          variant="primary"
          disabled={saving}
          className="gap-2 font-bold shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Product..." : isEditing ? "Save Changes" : "Create Product"}</span>
        </Button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Basic Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          1. General Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. UV-Vis Double Beam Spectrophotometer"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Unique URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="uv-vis-double-beam-spectrophotometer"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#1e5aa8]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-[#1e5aa8]"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Display Sort Order
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: Number(e.target.value) })
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Short Description (Catalogue cards)
          </label>
          <input
            type="text"
            value={formData.shortDescription}
            onChange={(e) =>
              setFormData({ ...formData, shortDescription: e.target.value })
            }
            placeholder="Brief 1-line overview of the equipment..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Full Product Description (Detail page)
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Detailed technical description and functional capabilities..."
            className="w-full p-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
          />
        </div>
      </div>

      {/* Image & Status Toggles Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          2. Product Image & Visibility Status
        </h2>

        <ImageUploader
          value={formData.images[0]?.url || ""}
          onChange={(url) =>
            setFormData({
              ...formData,
              images: [{ url, alt: formData.name }],
            })
          }
          label="Primary Product Photo"
        />

        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="rounded border-slate-300 text-[#1e5aa8] focus:ring-[#1e5aa8]"
            />
            <span>Active (Visible on public catalogue)</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
              className="rounded border-slate-300 text-[#1e5aa8] focus:ring-[#1e5aa8]"
            />
            <span>Featured on Home Page</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-amber-700 cursor-pointer bg-amber-50 p-2 rounded-lg border border-amber-200">
            <input
              type="checkbox"
              checked={formData.needsReview}
              onChange={(e) =>
                setFormData({ ...formData, needsReview: e.target.checked })
              }
              className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
            />
            <span>Mark as &quot;Needs Client Review&quot;</span>
          </label>
        </div>
      </div>

      {/* Technical Specifications Rows Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              3. Technical Specifications Table
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add key parameter rows (e.g. Readability, Capacity, Temperature Range)
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addSpecRow}
            className="text-xs gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Spec Row
          </Button>
        </div>

        <div className="space-y-3">
          {formData.specs.map((spec, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Label (e.g. Accuracy)"
                value={spec.label}
                onChange={(e) => updateSpec(idx, "label", e.target.value)}
                className="w-1/3 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 font-semibold"
              />
              <input
                type="text"
                placeholder="Value (e.g. 0.001 mg / 1 mg)"
                value={spec.value}
                onChange={(e) => updateSpec(idx, "value", e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900"
              />
              <button
                type="button"
                onClick={() => removeSpec(idx)}
                className="p-2 text-slate-400 hover:text-red-600 rounded-md"
                aria-label="Delete specification row"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Features & Applications */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          4. Features & Recommended Applications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Key Features (Bullet points)
              </label>
              <button
                type="button"
                onClick={addFeature}
                className="text-xs text-[#1e5aa8] font-bold hover:underline"
              >
                + Add Feature
              </button>
            </div>
            {formData.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feat}
                  onChange={(e) => updateFeature(idx, e.target.value)}
                  placeholder="e.g. Microprocessor PID control"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(idx)}
                  className="p-1 text-slate-400 hover:text-red-600"
                  aria-label="Remove feature"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Applications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Target Applications (Tags)
              </label>
              <button
                type="button"
                onClick={addApp}
                className="text-xs text-[#1e5aa8] font-bold hover:underline"
              >
                + Add Application
              </button>
            </div>
            {formData.applications.map((app, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={app}
                  onChange={(e) => updateApp(idx, e.target.value)}
                  placeholder="e.g. Pharma QC / Formulation"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => removeApp(idx)}
                  className="p-1 text-slate-400 hover:text-red-600"
                  aria-label="Remove application"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}

export default ProductForm;
