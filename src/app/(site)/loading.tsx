import React from "react";

export default function SiteLoading() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Hero Banner Skeleton */}
      <div className="h-64 rounded-3xl bg-slate-200/80 w-full" />

      {/* Grid Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="h-44 rounded-xl bg-slate-200/70 w-full" />
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
            <div className="h-8 bg-slate-100 rounded-lg w-full mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
