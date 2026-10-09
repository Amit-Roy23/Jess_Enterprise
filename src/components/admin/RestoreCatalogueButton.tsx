"use client";

import React, { useState, useTransition } from "react";
import { ImageDown, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { restoreCatalogueAction } from "@/server/actions/catalogueActions";

export function RestoreCatalogueButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
      <div>
        <p className="text-sm font-bold text-slate-900">Default catalogue &amp; product photos</p>
        <p className="text-xs text-slate-500 mt-0.5">
          Adds any missing brochure products and downloads photos for products that have none. Your edits are never
          overwritten.
        </p>
        {result && (
          <p className={`mt-2 text-xs flex items-center gap-1.5 ${result.success ? "text-emerald-700" : "text-red-700"}`}>
            {result.success ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            {result.message}
          </p>
        )}
      </div>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(async () => setResult(await restoreCatalogueAction()))}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1e5aa8] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#173f76] disabled:opacity-60"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageDown className="w-4 h-4" />}
        {isPending ? "Working… (up to a minute)" : "Load products & fetch missing photos"}
      </button>
    </div>
  );
}

export default RestoreCatalogueButton;
