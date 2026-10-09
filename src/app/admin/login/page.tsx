"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 selection:bg-[#1e5aa8] selection:text-white">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-slate-100 space-y-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1e5aa8]/10 text-[#1e5aa8] mb-2 font-black text-xl">
            JE
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Jess Enterprises
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Management Portal & Enquiry Dispatch
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@jessenterprises.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#1e5aa8] focus:ring-2 focus:ring-[#1e5aa8]/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#1e5aa8] focus:ring-2 focus:ring-[#1e5aa8]/20 transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-xs gap-2 shadow-lg shadow-[#1e5aa8]/25 hover:shadow-none transition-all mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>Sign In to Admin</span>
            )}
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-400">
            Authorised personnel only. Legal Metrology Licence 22000126-CLM.
          </p>
        </div>
      </div>
    </div>
  );
}
