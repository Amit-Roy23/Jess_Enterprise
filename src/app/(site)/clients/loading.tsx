import React from "react";

export default function ClientsLoading() {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-pulse">
      <div className="h-44 bg-slate-200/80 rounded-3xl" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(18)].map((_, i) => (
          <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-center">
            <div className="h-8 bg-slate-200 rounded w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
