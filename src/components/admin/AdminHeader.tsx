import React from "react";
import Link from "next/link";
import { User, ExternalLink } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  userRole?: string;
}

export function AdminHeader({
  title,
  subtitle,
  userName = "Admin User",
  userRole = "admin",
}: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="text-xs text-slate-600 hover:text-[#1e5aa8] flex items-center gap-1.5 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1e5aa8] flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-900 leading-tight">{userName}</p>
            <span className="text-[10px] uppercase font-bold text-[#1e5aa8]">
              {userRole}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
