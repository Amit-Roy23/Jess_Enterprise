"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  createAdminUserAction,
  deleteAdminUserAction,
} from "@/server/actions/userActions";

interface UserRow {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  createdAt?: string;
  lastLoginAt?: string;
}

interface UsersManagerProps {
  initialUsers: UserRow[];
  currentUserId?: string;
}

export function UsersManager({ initialUsers, currentUserId }: UsersManagerProps) {
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor" as "admin" | "editor",
  });

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  const openCreateModal = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "editor",
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    startTransition(async () => {
      const res = await createAdminUserAction(formData);
      if (res.success) {
        setIsModalOpen(false);
        router.refresh();
      } else {
        setErrorMessage(res.message);
      }
    });
  };

  const handleDelete = async (user: UserRow) => {
    if (user._id === currentUserId) {
      alert("You cannot delete your own active account.");
      return;
    }

    if (!confirm(`Are you sure you want to delete administrator account "${user.name}" (${user.email})?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteAdminUserAction(user._id);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
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
          Showing <strong>{initialUsers.length}</strong> authorized admin users
        </p>
        <Button
          size="sm"
          variant="primary"
          onClick={openCreateModal}
          className="gap-1.5 font-bold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Admin User</span>
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1e5aa8]/10 text-[#1e5aa8] flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.name}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {user.email}
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge
                      variant={user.role === "admin" ? "primary" : "outline"}
                      className="text-[10px] uppercase font-bold"
                    >
                      {user.role}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {user._id !== currentUserId ? (
                      <button
                        onClick={() => handleDelete(user)}
                        disabled={isPending}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 disabled:opacity-50"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Current User</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Create Admin Account
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
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sales Manager"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="manager@jessenterprises.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#1e5aa8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password * (Min 8 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  System Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as "admin" | "editor" })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white"
                >
                  <option value="editor">Editor (Catalogue & Enquiry updates)</option>
                  <option value="admin">Super Admin (Full administrative access)</option>
                </select>
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
                  <span>{isPending ? "Creating..." : "Create Account"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
