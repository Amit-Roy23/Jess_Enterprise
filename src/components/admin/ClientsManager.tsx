"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Building, Save, X, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  createClientAction,
  updateClientAction,
  deleteClientAction,
} from "@/server/actions/clientActions";

interface ClientRow {
  _id: string;
  name: string;
  logo?: string;
  location?: string;
  industry?: string;
  isFeatured?: boolean;
  order?: number;
}

interface ClientsManagerProps {
  initialClients: ClientRow[];
}

export function ClientsManager({ initialClients }: ClientsManagerProps) {
  const router = useRouter();
  const [clients, setClients] = useState<ClientRow[]>(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientRow | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    location: "Goa, India",
    industry: "Pharmaceutical & Healthcare",
    isFeatured: true,
    order: 0,
  });

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  const openCreateModal = () => {
    setEditingClient(null);
    setFormData({
      name: "",
      logo: "",
      location: "Goa, India",
      industry: "Pharmaceutical & Healthcare",
      isFeatured: true,
      order: clients.length + 1,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (client: ClientRow) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      logo: client.logo || "",
      location: client.location || "",
      industry: client.industry || "",
      isFeatured: client.isFeatured ?? true,
      order: client.order || 0,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    startTransition(async () => {
      if (editingClient) {
        const res = await updateClientAction(editingClient._id, formData);
        if (res.success) {
          setIsModalOpen(false);
          router.refresh();
        } else {
          setErrorMessage(res.message);
        }
      } else {
        const res = await createClientAction(formData);
        if (res.success) {
          setIsModalOpen(false);
          router.refresh();
        } else {
          setErrorMessage(res.message);
        }
      }
    });
  };

  const handleDelete = async (client: ClientRow) => {
    if (!confirm(`Are you sure you want to delete client "${client.name}"?`)) return;

    startTransition(async () => {
      const res = await deleteClientAction(client._id);
      if (res.success) {
        setClients((prev) => prev.filter((c) => c._id !== client._id));
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
          Showing <strong>{initialClients.length}</strong> enterprise clients in directory
        </p>
        <Button
          size="sm"
          variant="primary"
          onClick={openCreateModal}
          className="gap-1.5 font-bold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {initialClients.map((client) => (
          <div
            key={client._id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              {/* Logo / Brand Icon */}
              <div className="h-16 w-full rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 mb-3 relative overflow-hidden">
                {client.logo ? (
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={120}
                    height={48}
                    className="max-h-12 w-auto object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
                    <Building className="w-4 h-4 text-slate-300" />
                    <span className="truncate max-w-[120px]">{client.name}</span>
                  </div>
                )}
                {client.isFeatured && (
                  <span className="absolute top-1.5 right-1.5 bg-blue-100 text-[#1e5aa8] p-1 rounded-full">
                    <Sparkles className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-xs line-clamp-1">{client.name}</h3>
              {client.industry && (
                <p className="text-[11px] text-slate-500 line-clamp-1">{client.industry}</p>
              )}
              {client.location && (
                <p className="text-[10px] text-slate-400">{client.location}</p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">Order: {client.order ?? 0}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(client)}
                  className="p-1 text-slate-500 hover:text-[#1e5aa8] rounded-md hover:bg-slate-50"
                  title="Edit Client"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(client)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                  title="Delete Client"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {editingClient ? "Edit Client" : "Add Enterprise Client"}
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
                  Company / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Cipla Ltd / Glenmark Pharmaceuticals"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
                />
              </div>

              <ImageUploader
                value={formData.logo}
                onChange={(url) => setFormData({ ...formData, logo: url })}
                label="Company Logo (Optional — text fallback is used if omitted)"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g. Verna, Goa"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) =>
                      setFormData({ ...formData, industry: e.target.value })
                    }
                    placeholder="e.g. Pharma / Biotech"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900"
                  />
                </div>
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
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="rounded border-slate-300 text-[#1e5aa8]"
                  />
                  <span>Featured Client</span>
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
                  <span>{isPending ? "Saving..." : editingClient ? "Update Client" : "Add Client"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
