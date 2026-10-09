import React from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";

export interface ClientItem {
  _id?: unknown;
  name: string;
  logo?: string;
  website?: string;
}

function ClientTile({ client, compact = false }: { client: ClientItem; compact?: boolean }) {
  const body = client.logo ? (
    <div className={compact ? "relative h-14 w-36" : "relative h-16 w-full"}>
      <Image
        src={client.logo}
        alt={client.name}
        fill
        sizes="200px"
        className="object-contain transition-transform duration-300 group-hover:scale-110"
      />
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1e5aa8]">
        <Building2 className="h-4 w-4" />
      </span>
      <span className="text-sm font-bold text-slate-700 leading-tight line-clamp-2">{client.name}</span>
    </div>
  );

  const className =
    "group flex items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10 hover:ring-blue-200 " +
    (compact ? "h-24 w-52 shrink-0 px-6" : "h-32 p-6");

  return client.website ? (
    <a href={client.website} target="_blank" rel="noopener noreferrer" className={className} title={client.name}>
      {body}
    </a>
  ) : (
    <div className={className} title={client.name}>
      {body}
    </div>
  );
}

/** Responsive grid of client logos (used on /clients). */
export function ClientShowcase({ clients }: { clients: ClientItem[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {clients.map((client, idx) => (
        <ClientTile key={String(client._id || idx)} client={client} />
      ))}
    </div>
  );
}

/** Infinite, pause-on-hover logo marquee (used on the home page). */
export function ClientMarquee({ clients }: { clients: ClientItem[] }) {
  if (clients.length === 0) return null;
  const half = Math.ceil(clients.length / 2);
  const rows = clients.length > 8 ? [clients.slice(0, half), clients.slice(half)] : [clients];

  return (
    <div className="space-y-5">
      {rows.map((row, r) => (
        <div key={r} className="marquee mask-fade-x overflow-hidden py-2">
          <div className={`flex w-max gap-5 ${r % 2 === 0 ? "animate-marquee" : "animate-marquee-reverse"}`}>
            {[...row, ...row].map((client, idx) => (
              <div key={idx} aria-hidden={idx >= row.length}>
                <ClientTile client={client} compact />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ClientShowcase;
