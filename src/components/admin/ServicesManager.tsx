"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit2,
  Trash2,
  Wrench,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
} from "@/server/actions/serviceActions";

type ServiceVertical = "legal-metrology" | "lab-instruments" | "fabrication";

interface ServiceRow {
  _id: string;
  title: string;
  slug: string;
  vertical?: ServiceVertical;
  summary?: string;
  description?: string;
  highlights?: string[];
  image?: string;
  order?: number;
  isActive?: boolean;
}

interface ServicesManagerProps {
  initialServices: ServiceRow[];
}

export function ServicesManager({ initialServices }: ServicesManagerProps) {
  const router = useRouter();
  const [services, setServices] = useState<ServiceRow[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRow | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    vertical: "legal-metrology" as ServiceVertical,
    summary: "",
    description: "",
    highlights: [""],
    image: "",
    order: 0,
    isActive: true,
  });

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: "",
      slug: "",
      vertical: "legal-metrology",
      summary: "",
      description: "",
      highlights: [""],
      image: "",
      order: services.length + 1,
      isActive: true,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (svc: ServiceRow) => {
    setEditingService(svc);
    setFormData({
      title: svc.title,
      slug: svc.slug,
      vertical: svc.vertical || "legal-metrology",
      summary: svc.summary || "",
      description: svc.description || "",
      highlights: svc.highlights?.length ? svc.highlights : [""],
      image: svc.image || "",
      order: svc.order || 0,
      isActive: svc.isActive !== false,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!editingService) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, title, slug }));
    } else {
      setFormData((prev) => ({ ...prev, title }));
    }
  };

  const addHighlight = () => {
    setFormData((prev) => ({ ...prev, highlights: [...prev.highlights, ""] }));
  };

  const updateHighlight = (index: number, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.highlights];
      updated[index] = val;
      return { ...prev, highlights: updated };
    });
  };

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanHighlights = formData.highlights.filter((d) => d.trim());
    const payload = { ...formData, highlights: cleanHighlights };

    startTransition(async () => {
      if (editingService) {
        const res = await updateServiceAction(editingService._id, payload);
        if (res.success) {
          setIsModalOpen(false);
          router.refresh();
        } else {
          setErrorMessage(res.message);
        }
      } else {
        const res = await createServiceAction(payload);
        if (res.success) {
          setIsModalOpen(false);
          router.refresh();
        } else {
          setErrorMessage(res.message);
        }
      }
    });
  };

  const handleDelete = async (svc: ServiceRow) => {
    if (!confirm(`Are you sure you want to delete service "${svc.title}"?`)) return;

    startTransition(async () => {
      const res = await deleteServiceAction(svc._id);
      if (res.success) {
        setServices((prev) => prev.filter((s) => s._id !== svc._id));
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
          Showing <strong>{initialServices.length}</strong> technical services configured
        </p>
        <Button
          size="sm"
          variant="primary"
          onClick={openCreateModal}
          className="gap-1.5 font-bold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {initialServices.map((svc) => (
          <div
            key={svc._id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e5aa8] flex items-center justify-center font-bold">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{svc.title}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">/{svc.slug}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md uppercase">
                  {svc.vertical || "Service"}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {svc.summary}
              </p>

              {svc.highlights && svc.highlights.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Key Highlights:
                  </span>
                  <ul className="space-y-1">
                    {svc.highlights.slice(0, 3).map((d, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{d}</span>
                      </li>
                    ))}
                    {svc.highlights.length > 3 && (
                      <li className="text-[11px] text-slate-400 italic">
                        +{svc.highlights.length - 3} more highlights
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span
                className={`text-[10px] font-bold uppercase ${
                  svc.isActive !== false ? "text-emerald-700" : "text-slate-400"
                }`}
              >
                {svc.isActive !== false ? "Active" : "Inactive"}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(svc)}
                  className="p-1.5 text-slate-600 hover:text-[#1e5aa8] rounded-md hover:bg-slate-50 transition-colors"
                  title="Edit Service"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(svc)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {editingService ? "Edit Service" : "Add New Technical Service"}
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
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Legal Metrology Stamping & Verification"
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
                    placeholder="legal-metrology-stamping"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#1e5aa8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Vertical *
                  </label>
                  <select
                    value={formData.vertical}
                    onChange={(e) =>
                      setFormData({ ...formData, vertical: e.target.value as ServiceVertical })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white"
                  >
                    <option value="legal-metrology">Legal Metrology</option>
                    <option value="lab-instruments">Lab Instruments</option>
                    <option value="fabrication">Custom Fabrication</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Short Summary *
                </label>
                <input
                  type="text"
                  required
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  placeholder="Brief 1-sentence overview of the service..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Service Scope / Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Comprehensive service scope, regulatory compliance notes, methodologies..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
                />
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Service Highlights / Key Deliverables
                  </label>
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="text-xs font-bold text-[#1e5aa8] hover:underline"
                  >
                    + Add Item
                  </button>
                </div>
                {formData.highlights.map((d, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={d}
                      onChange={(e) => updateHighlight(idx, e.target.value)}
                      placeholder="e.g. Issuance of Government Verification Certificate"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => removeHighlight(idx)}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
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
                  <span>Active Service</span>
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
                  <span>{isPending ? "Saving..." : editingService ? "Update Service" : "Create Service"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
