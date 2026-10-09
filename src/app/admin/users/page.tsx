import React from "react";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models";
import { UsersManager } from "@/components/admin/UsersManager";

export const metadata = {
  title: "Admin Users Management | Jess Enterprises Admin",
};

export const dynamic = "force-dynamic";

interface AdminUserDoc {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  createdAt?: string;
  lastLoginAt?: string;
}

export default async function AdminUsersPage() {
  const session = await auth();
  let users: AdminUserDoc[] = [];

  try {
    await connectDB();
    const raw = await AdminUser.find().select("-passwordHash").sort({ createdAt: -1 }).lean();
    users = JSON.parse(JSON.stringify(raw));
  } catch (error) {
    console.error("Failed to load users in admin:", error);
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Admin User Accounts & Security
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage staff accounts, administrative roles, and system credentials.
        </p>
      </div>

      <UsersManager initialUsers={users} currentUserId={session?.user?.id} />
    </div>
  );
}
