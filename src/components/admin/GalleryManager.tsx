"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Save, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  createGalleryItemAction,
  updateGalleryItemAction,
  deleteGalleryItemAction,
} from "@/server/actions/galleryActions";

type MaterialGrade = "SS" | "MS" | "Acrylic" | "PVC" | "Teflon" | "Polycarbonate";

interface GalleryRow {
  _id: string;
  title: string;
  description?: string;
  material: MaterialGrade;
  images?: { url: string; alt?: string }[];
  order?: number;
  isActive?: boolean;
}

interface GalleryManagerProps {
  initialItems: GalleryRow[];
}

const MATERIALS: { value: MaterialGrade; label: string }[] = [
  { value: "SS", label: "SS 304 / SS 316 Stainless Steel" },
  { value: "MS", label: "MS Mild Steel Powder Coated" },
  { value: "Acrylic", label: "Acrylic / Perspex" },
  { value: "PVC", label: "PVC Industrial Grade" },
  { value: "Teflon", label: "PTFE / Teflon" },
  { value: "Polycarbonate", label: "Polycarbonate Cleanroom Grade" },
];

export function GalleryManager({ initialItems }: GalleryManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState<GalleryRow[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryRow | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    material: "SS" as MaterialGrade,
    order: 0,
    isActive: true,
  });

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      image: "",
      material: "SS",
      order: items.length + 1,
      isActive: true,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryRow) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      image: item.images?.[0]?.url || "",
      material: item.material || "SS",
      order: item.order || 0,
      isActive: item.isActive !== false,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image.trim()) {
      setErrorMessage("Please upload an image for the fabrication work.");
      return;
    }
    setErrorMessage("");

    const payload = {
      title: formData.title,
      description: formData.description,
      material: formData.material,
      images: [{ url: formData.image, alt: formData.title }],
      order: formData.order,
      isActive: formData.isActive,
    };

    startTransition(async () => {
      if (editingItem) {
        const res = await updateGalleryItemAction(editingItem._id, payload);
        if (res.success) {
          setIsModalOpen(false);
          router.refresh();
        } else {
          setErrorMessage(res.message);
        }
      } else {
        const res = await createGalleryItemAction(payload);
        if (res.success) {
          setIsModalOpen(false);
          router.refresh();
        } else {
          setErrorMessage(res.message);
        }
      }
    });
  };

  const handleDelete = async (item: GalleryRow) => {
    if (!confirm(`Are you sure you want to delete "${item.title}" from fabrication gallery?`)) return;

    startTransition(async () => {
      const res = await deleteGalleryItemAction(item._id);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i._id !== item._id));
        router.refresh();
      } else {
        alert(res.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Showing <strong>{initialItems.length}</strong> fabrication showcase projects
        </p>
        <Button
          size="sm"
          variant="primary"
          onClick={openCreateModal}
          className="gap-1.5 font-bold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Fabrication Project</span>
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {initialItems.map((item) => {
          const pic = item.images?.[0]?.url;

          return (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Picture */}
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  {pic ? (
                    <Image
                      src={pic}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No Photo
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {item.material}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase ${
                    item.isActive !== false ? "text-emerald-700" : "text-slate-400"
                  }`}
                >
                  {item.isActive !== false ? "Active" : "Hidden"}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-slate-600 hover:text-[#1e5aa8] rounded-md hover:bg-white"
                    title="Edit Item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-white"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {editingItem ? "Edit Fabrication Project" : "Add Fabrication Project"}
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
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. SS 316 Dynamic Pass Box with Interlocking"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Material *
                </label>
                <select
                  value={formData.material}
                  onChange={(e) =>
                    setFormData({ ...formData, material: e.target.value as MaterialGrade })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white"
                >
                  {MATERIALS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <ImageUploader
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Fabrication Photo *"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Details of welding, finish (mirror / matte #4), UV lighting, interlock mechanism..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="w-32">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-4">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="rounded border-slate-300 text-[#1e5aa8]"
                  />
                  <span>Active Showcase</span>
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
                  <span>{isPending ? "Saving..." : editingItem ? "Update Project" : "Create Project"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
