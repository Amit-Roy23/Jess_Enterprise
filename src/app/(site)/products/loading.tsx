import React from "react";

export default function ProductsLoading() {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Title */}
      <div className="space-y-2">
        <div className="h-8 bg-slate-200 rounded-lg w-64" />
        <div className="h-4 bg-slate-100 rounded w-96" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="h-16 bg-white rounded-2xl border border-slate-200" />

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="h-48 rounded-xl bg-slate-200/70" />
            <div className="h-4 bg-slate-200 rounded w-4/5" />
            <div className="h-3 bg-slate-100 rounded w-2/3" />
            <div className="h-8 bg-slate-100 rounded-lg w-full mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
