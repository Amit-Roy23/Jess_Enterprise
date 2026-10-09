import React from "react";

export default function FabricationLoading() {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-pulse">
      <div className="h-44 bg-slate-200/80 rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="h-52 bg-slate-200 rounded-xl" />
            <div className="h-5 bg-slate-200 rounded w-2/3" />
            <div className="h-3 bg-slate-100 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
