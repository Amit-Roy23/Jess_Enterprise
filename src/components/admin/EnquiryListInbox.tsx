"use client";

import React, { useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  Building,
  FileSpreadsheet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EnquiryDetailModal from "@/components/admin/EnquiryDetailModal";
import { deleteEnquiryAction } from "@/server/actions/adminEnquiryActions";

type EnquiryStatus = "new" | "contacted" | "quoted" | "won" | "lost" | "closed";

interface EnquiryRow {
  _id: string;
  type: "quote" | "service" | "amc" | "stamping" | "fabrication" | "contact";
  name: string;
  company?: string;
  email: string;
  phone: string;
  city?: string;
  message: string;
  status: EnquiryStatus;
  items?: { productName: string; quantity: number; note?: string }[];
  internalNotes?: { text: string; by: string; at: string | Date }[];
  sourcePage?: string;
  createdAt: string | Date;
}

interface EnquiryListInboxProps {
  initialEnquiries: EnquiryRow[];
}

const STATUS_TABS = [
  { id: "all", label: "All Enquiries" },
  { id: "new", label: "New Leads" },
  { id: "contacted", label: "Contacted" },
  { id: "quoted", label: "Quoted" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
  { id: "closed", label: "Closed" },
];

export function EnquiryListInbox({ initialEnquiries }: EnquiryListInboxProps) {
  const [enquiries, setEnquiries] = useState<EnquiryRow[]>(initialEnquiries);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [activeEnquiry, setActiveEnquiry] = useState<EnquiryRow | null>(null);

  // Status counters
  const counts = {
    all: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    contacted: enquiries.filter((e) => e.status === "contacted").length,
    quoted: enquiries.filter((e) => e.status === "quoted").length,
    won: enquiries.filter((e) => e.status === "won").length,
    lost: enquiries.filter((e) => e.status === "lost").length,
    closed: enquiries.filter((e) => e.status === "closed").length,
  };

  const filteredEnquiries = enquiries.filter((enquiry) => {
    // Status tab filter
    if (activeTab !== "all" && enquiry.status !== activeTab) return false;

    // Type filter
    if (selectedType !== "all" && enquiry.type !== selectedType) return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = enquiry.name.toLowerCase().includes(q);
      const matchEmail = enquiry.email.toLowerCase().includes(q);
      const matchPhone = enquiry.phone.toLowerCase().includes(q);
      const matchCompany = enquiry.company?.toLowerCase().includes(q);
      const matchMsg = enquiry.message.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchCompany && !matchMsg) return false;
    }

    return true;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete enquiry from ${name}?`)) return;

    try {
      const res = await deleteEnquiryAction(id);
      if (res.success) {
        setEnquiries((prev) => prev.filter((e) => e._id !== id));
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error("Delete enquiry error:", err);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (activeEnquiry) {
      setEnquiries((prev) =>
        prev.map((e) => (e._id === activeEnquiry._id ? { ...e, status: newStatus as EnquiryStatus } : e))
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search enquiries by name, company, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1e5aa8]"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-[#1e5aa8]"
          >
            <option value="all">All Types</option>
            <option value="quote">Quote Requests</option>
            <option value="stamping">Legal Metrology Stamping</option>
            <option value="service">Equipment Service / AMC</option>
            <option value="fabrication">Cleanroom Fabrication</option>
            <option value="contact">General Contact</option>
          </select>

          {/* Export to CSV Button */}
          <a
            href="/api/admin/enquiries/export"
            download
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </a>
        </div>

        {/* Status Tabs Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
          {STATUS_TABS.map((tab) => {
            const count = counts[tab.id as keyof typeof counts] || 0;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#1e5aa8] text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Enquiries List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Client / Company</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No enquiries found under this filter.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enquiry) => (
                  <tr
                    key={enquiry._id}
                    onClick={() => setActiveEnquiry(enquiry)}
                    className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                  >
                    {/* Client & Company */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{enquiry.name}</div>
                      {enquiry.company && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span>{enquiry.company}</span>
                        </div>
                      )}
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        {enquiry.type}
                      </Badge>
                      {enquiry.items && enquiry.items.length > 0 && (
                        <div className="text-[10px] text-slate-500 mt-1">
                          {enquiry.items.length} item(s) in basket
                        </div>
                      )}
                    </td>

                    {/* Contact details */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{enquiry.phone}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {enquiry.email}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${
                          enquiry.status === "new"
                            ? "bg-blue-100 text-[#1e5aa8]"
                            : enquiry.status === "contacted"
                            ? "bg-amber-100 text-amber-800"
                            : enquiry.status === "quoted"
                            ? "bg-purple-100 text-purple-800"
                            : enquiry.status === "won"
                            ? "bg-emerald-100 text-emerald-800"
                            : enquiry.status === "lost"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveEnquiry(enquiry)}
                          title="View Details"
                          className="p-1.5 text-slate-500 hover:text-[#1e5aa8] rounded-md hover:bg-slate-100"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(enquiry._id, enquiry.name)}
                          title="Delete Enquiry"
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {activeEnquiry && (
        <EnquiryDetailModal
          enquiry={activeEnquiry}
          onClose={() => setActiveEnquiry(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
