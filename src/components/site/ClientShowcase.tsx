import React from "react";
import Image from "next/image";
import { Building } from "lucide-react";

export interface ClientItem {
  _id?: unknown;
  name: string;
  logo?: string;
  website?: string;
}

interface ClientShowcaseProps {
  clients: ClientItem[];
}

export function ClientShowcase({ clients }: ClientShowcaseProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {clients.map((client, idx) => (
        <div
          key={String(client._id || idx)}
          className="group bg-white rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center text-center h-28 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200"
        >
          {client.logo ? (
            <div className="relative w-full h-12 flex items-center justify-center">
              <Image
                src={client.logo}
                alt={client.name}
                fill
                sizes="150px"
                className="object-contain filter grayscale group-hover:grayscale-0 transition-all"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1.5 w-full">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1e5aa8] flex items-center justify-center group-hover:bg-[#1e5aa8] group-hover:text-white transition-colors">
                <Building className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#1e5aa8] transition-colors line-clamp-2 leading-tight px-1">
                {client.name}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ClientShowcase;
