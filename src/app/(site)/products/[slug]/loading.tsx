import React from "react";

export default function ProductDetailLoading() {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 bg-slate-200 rounded w-48" />

      {/* Main product showcase grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="h-96 rounded-3xl bg-slate-200/80" />
        <div className="space-y-4">
          <div className="h-4 bg-blue-100 rounded w-28" />
          <div className="h-8 bg-slate-200 rounded-lg w-3/4" />
          <div className="h-4 bg-slate-100 rounded w-full" />
          <div className="h-4 bg-slate-100 rounded w-5/6" />
          <div className="h-12 bg-slate-200 rounded-xl w-48 mt-6" />
        </div>
      </div>

      {/* Specs table skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
        <div className="h-6 bg-slate-200 rounded w-48" />
        <div className="space-y-2 pt-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-slate-50 rounded border border-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
