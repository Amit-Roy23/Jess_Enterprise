import React from "react";
import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-100">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#1e5aa8]" />
        <p className="text-xs font-semibold">Loading admin workspace...</p>
      </div>
    </div>
  );
}
