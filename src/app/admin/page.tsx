import React from "react";
import Link from "next/link";
import {
  Package,
  Inbox,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Scale,
  FlaskConical,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { connectDB } from "@/lib/db";
import { Product, Enquiry } from "@/models";
import { auth } from "@/lib/auth";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import RestoreCatalogueButton from "@/components/admin/RestoreCatalogueButton";

export const revalidate = 0; // Dynamic dashboard
// Photo import (server action on this page) may take a while
export const maxDuration = 60;

export default async function AdminDashboardPage() {
  const session = await auth();

  await connectDB();

  // Fetch counts in parallel
  const [
    totalProducts,
    reviewProductsCount,
    totalEnquiries,
    newEnquiriesCount,
    latestEnquiries,
    enquiriesByType,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ needsReview: true }),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "new" }),
    Enquiry.find().sort({ createdAt: -1 }).limit(6).lean(),
    Enquiry.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]),
  ]);

  const typeCounts: Record<string, number> = {};
  enquiriesByType.forEach((item: { _id: string; count: number }) => {
    typeCounts[item._id] = item.count;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-100">
      <AdminHeader
        title="Dashboard Overview"
        subtitle="Manage product catalogue, legal metrology services, and client enquiries"
        userName={session?.user?.name || "Admin"}
        userRole={(session?.user as unknown as { role?: string })?.role || "admin"}
      />

      <main className="p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: New Enquiries */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                New Enquiries
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {newEnquiriesCount}
              </h3>
              <p className="text-[11px] text-blue-600 font-semibold mt-1">
                Pending response
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1e5aa8] flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Total Products */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Products
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {totalProducts}
              </h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                In catalogue
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Needs Review */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pending Review
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {reviewProductsCount}
              </h3>
              <p className="text-[11px] text-amber-600 font-semibold mt-1">
                Specs needed
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Total Lifetime Enquiries */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Lifetime Requests
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {totalEnquiries}
              </h3>
              <p className="text-[11px] text-purple-600 font-semibold mt-1">
                Quotes & services
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Enquiry Distribution by Type */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Enquiries by Service Vertical
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { key: "quote", label: "Product Quotes", icon: Package },
              { key: "stamping", label: "L&M Stamping", icon: Scale },
              { key: "amc", label: "Balance AMC", icon: Clock },
              { key: "service", label: "Instrument Service", icon: FlaskConical },
              { key: "fabrication", label: "Fabrication", icon: Wrench },
              { key: "contact", label: "General Contact", icon: Inbox },
            ].map((item) => (
              <div
                key={item.key}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1"
              >
                <span className="text-xs text-slate-500 font-semibold">{item.label}</span>
                <p className="text-2xl font-extrabold text-[#1e5aa8]">
                  {typeCounts[item.key] || 0}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Enquiries Inbox Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Latest Client Enquiries
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Incoming quotes, service calls, and custom fabrication requests
              </p>
            </div>
            <Link href="/admin/enquiries">
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <span>View Full Inbox</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6 font-bold text-slate-700">Client / Company</th>
                  <th className="py-3 px-6 font-bold text-slate-700">Type</th>
                  <th className="py-3 px-6 font-bold text-slate-700">Contact</th>
                  <th className="py-3 px-6 font-bold text-slate-700">Status</th>
                  <th className="py-3 px-6 font-bold text-slate-700">Date</th>
                  <th className="py-3 px-6 font-bold text-slate-700 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {latestEnquiries.length > 0 ? (
                  latestEnquiries.map((enq) => (
                    <tr
                      key={enq._id.toString()}
                      className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-6">
                        <p className="font-bold text-slate-900">{enq.name}</p>
                        {enq.company && (
                          <p className="text-[11px] text-slate-500">{enq.company}</p>
                        )}
                      </td>
                      <td className="py-3 px-6">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-[#1e5aa8]">
                          {enq.type}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-slate-600">
                        <p>{enq.phone}</p>
                        <p className="text-[11px] text-slate-400">{enq.email}</p>
                      </td>
                      <td className="py-3 px-6">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize bg-slate-100 text-slate-800">
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-slate-500 whitespace-nowrap">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-6 text-right">
                        <Link href="/admin/enquiries">
                          <Button size="sm" variant="ghost" className="text-xs text-[#1e5aa8]">
                            Inspect
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No enquiries received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <RestoreCatalogueButton />

        {/* Quick Management Links Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/products/new"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e5aa8] flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">
                  Add New Product
                </p>
                <p className="text-[11px] text-slate-500">
                  Upload specs & photo
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            href="/admin/products?needsReview=true"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-xs transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">
                  Items Needing Specs
                </p>
                <p className="text-[11px] text-slate-500">
                  {reviewProductsCount} pending review
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            href="/admin/settings"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">
                  Site Settings & Licences
                </p>
                <p className="text-[11px] text-slate-500">
                  Edit GST, Udyam & phones
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>
      </main>
    </div>
  );
}
