import React from "react";
import { connectDB } from "@/lib/db";
import { Client } from "@/models";
import { ClientsManager } from "@/components/admin/ClientsManager";

export const metadata = {
  title: "Clients Directory | Jess Enterprises Admin",
};

export const dynamic = "force-dynamic";

interface ClientDoc {
  _id: string;
  name: string;
  logo?: string;
  location?: string;
  industry?: string;
  isFeatured?: boolean;
  order?: number;
}

export default async function AdminClientsPage() {
  let clients: ClientDoc[] = [];

  try {
    await connectDB();
    const rawClients = await Client.find().sort({ order: 1 }).lean();
    clients = JSON.parse(JSON.stringify(rawClients));
  } catch (error) {
    console.error("Failed to load clients in admin:", error);
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Client Directory & Logo Showcase
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage pharmaceutical, laboratory, and institutional clients displayed on the public website.
        </p>
      </div>

      <ClientsManager initialClients={clients} />
    </div>
  );
}
