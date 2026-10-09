"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-xs">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-slate-900">
              Application Error
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              We encountered a critical problem loading the application.
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => reset()}
              variant="primary"
              className="text-xs gap-2 font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </Button>
            <Link
              href="/"
              className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200"
            >
              Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
