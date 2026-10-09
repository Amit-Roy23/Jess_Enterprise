"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 sm:p-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-xs">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900">
            Something went wrong
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            An unexpected error occurred while processing your request. Please try refreshing or return to the main catalogue.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-slate-400">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            onClick={() => reset()}
            variant="primary"
            className="text-xs gap-2 font-bold justify-center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              className="text-xs gap-2 font-bold justify-center w-full"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
          Need immediate support? WhatsApp us at{" "}
          <a
            href="https://wa.me/919158391519"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#1e5aa8] hover:underline inline-flex items-center gap-1"
          >
            <MessageSquare className="w-3 h-3" />
            <span>9158391519</span>
          </a>
        </div>
      </div>
    </div>
  );
}
