"use client";

import React, { useState } from "react";
import {
  X,
  Phone,
  Mail,
  Building,
  MapPin,
  Calendar,
  Send,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  updateEnquiryStatusAction,
  addEnquiryNoteAction,
} from "@/server/actions/adminEnquiryActions";

interface EnquiryDetailModalProps {
  enquiry: {
    _id: string;
    type: "quote" | "service" | "amc" | "stamping" | "fabrication" | "contact";
    name: string;
    company?: string;
    email: string;
    phone: string;
    city?: string;
    message: string;
    status: "new" | "contacted" | "quoted" | "won" | "lost" | "closed";
    items?: {
      productName: string;
      quantity: number;
      note?: string;
    }[];
    internalNotes?: {
      text: string;
      by: string;
      at: string | Date;
    }[];
    sourcePage?: string;
    createdAt: string | Date;
  };
  onClose: () => void;
  onStatusChange?: (newStatus: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-[#1e5aa8] border-blue-200",
  contacted: "bg-amber-100 text-amber-800 border-amber-200",
  quoted: "bg-purple-100 text-purple-800 border-purple-200",
  won: "bg-emerald-100 text-emerald-800 border-emerald-200",
  lost: "bg-rose-100 text-rose-800 border-rose-200",
  closed: "bg-slate-100 text-slate-800 border-slate-200",
};

export function EnquiryDetailModal({
  enquiry,
  onClose,
  onStatusChange,
}: EnquiryDetailModalProps) {
  const [currentStatus, setCurrentStatus] = useState(enquiry.status);
  const [notes, setNotes] = useState(enquiry.internalNotes || []);
  const [newNoteText, setNewNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleStatusUpdate = async (
    newStatus: "new" | "contacted" | "quoted" | "won" | "lost" | "closed"
  ) => {
    setUpdatingStatus(true);
    setCurrentStatus(newStatus);
    try {
      await updateEnquiryStatusAction(enquiry._id, newStatus);
      if (onStatusChange) onStatusChange(newStatus);
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setSavingNote(true);
    try {
      const res = await addEnquiryNoteAction(enquiry._id, newNoteText);
      if (res.success) {
        setNotes((prev) => [
          ...prev,
          { text: newNoteText.trim(), by: "Admin", at: new Date().toISOString() },
        ]);
        setNewNoteText("");
      }
    } catch (err) {
      console.error("Add note error:", err);
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 px-6 sm:px-8 py-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${
                STATUS_COLORS[currentStatus]
              }`}
            >
              Status: {currentStatus}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ID: {enquiry._id.slice(-6)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              title="Print Enquiry Sheet"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Status Workflow Selector Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Workflow Stage:
              </span>
              <p className="text-[11px] text-slate-500">
                Update status to track sales and engineering followup.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(["new", "contacted", "quoted", "won", "lost", "closed"] as const).map(
                (st) => (
                  <button
                    key={st}
                    disabled={updatingStatus}
                    onClick={() => handleStatusUpdate(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                      currentStatus === st
                        ? "bg-[#1e5aa8] text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Client & Enquiry Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Client Contact Information
              </h3>
              <p className="text-base font-bold text-slate-900">{enquiry.name}</p>
              {enquiry.company && (
                <p className="text-xs text-slate-700 flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <strong>Company:</strong> {enquiry.company}
                </p>
              )}
              <p className="text-xs text-slate-700 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <a
                  href={`tel:${enquiry.phone}`}
                  className="font-bold text-[#1e5aa8] hover:underline"
                >
                  {enquiry.phone}
                </a>
              </p>
              <p className="text-xs text-slate-700 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <a
                  href={`mailto:${enquiry.email}`}
                  className="font-medium text-[#1e5aa8] hover:underline"
                >
                  {enquiry.email}
                </a>
              </p>
              {enquiry.city && (
                <p className="text-xs text-slate-700 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>{enquiry.city}</span>
                </p>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Submission Metadata
              </h3>
              <p className="text-xs text-slate-700 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  <strong>Date:</strong>{" "}
                  {new Date(enquiry.createdAt).toLocaleString()}
                </span>
              </p>
              <p className="text-xs text-slate-700">
                <strong>Enquiry Type:</strong>{" "}
                <span className="uppercase font-bold text-[#1e5aa8]">
                  {enquiry.type}
                </span>
              </p>
              {enquiry.sourcePage && (
                <p className="text-xs text-slate-700">
                  <strong>Source Page:</strong>{" "}
                  <span className="font-mono text-slate-500">
                    {enquiry.sourcePage}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Requested Items (Quote baskets) */}
          {enquiry.items && enquiry.items.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Requested Products ({enquiry.items.length} items)
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4 font-bold text-slate-700">Product Name</th>
                      <th className="py-2.5 px-4 font-bold text-slate-700 w-20">Quantity</th>
                      <th className="py-2.5 px-4 font-bold text-slate-700">Client Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiry.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-none">
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          {item.productName}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700 font-semibold">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500">{item.note || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Client Message */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Client Message / Notes
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {enquiry.message}
            </div>
          </div>

          {/* Internal Notes Log */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Internal Team Notes ({notes.length})
            </h3>

            {notes.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {notes.map((n, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs space-y-1"
                  >
                    <p className="text-slate-800">{n.text}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-600">{n.by}</span>
                      <span>•</span>
                      <span>{new Date(n.at).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No internal notes added yet.</p>
            )}

            {/* Note Composer */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Add internal note (e.g. Quoted ₹45,000 via email on 9th Oct)..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1e5aa8]"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={savingNote || !newNoteText.trim()}
                className="text-xs gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Add Note</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnquiryDetailModal;
