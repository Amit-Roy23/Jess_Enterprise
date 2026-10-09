"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Plus, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductPlaceholder from "./ProductPlaceholder";
import { addToQuoteBasket } from "@/lib/quote-store";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  categoryName?: string;
  categorySlug?: string;
  shortDescription?: string;
  specs?: { label: string; value: string }[];
  images?: { url: string; alt?: string }[];
  needsReview?: boolean;
}

export function ProductCard({
  id,
  name,
  slug,
  categoryName,
  categorySlug,
  shortDescription,
  specs = [],
  images = [],
  needsReview,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const handleAddToQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToQuoteBasket({
      productId: id,
      name,
      slug,
      categoryName,
      quantity: 1,
      imageUrl: images[0]?.url || "",
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const primaryImage = images && images.length > 0 ? images[0] : null;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-900/10 hover:ring-blue-200">
      <Link href={`/products/${slug}`} className="relative block overflow-hidden" tabIndex={-1}>
        <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-slate-50 to-blue-50/50">
          {primaryImage?.url ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-3 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-110"
            />
          ) : (
            <ProductPlaceholder categorySlug={categorySlug} name={name} />
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {categoryName && (
              <Badge variant="primary" className="text-[10px] shadow-sm backdrop-blur">
                {categoryName}
              </Badge>
            )}
            {needsReview && (
              <Badge variant="warning" className="text-[10px] shadow-sm font-semibold">
                Specs on request
              </Badge>
            )}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/products/${slug}`}>
          <h3 className="text-[15px] font-bold leading-snug text-slate-900 line-clamp-2 transition-colors group-hover:text-[#1e5aa8]">
            {name}
          </h3>
        </Link>

        {shortDescription && (
          <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">{shortDescription}</p>
        )}

        {specs && specs.length > 0 && (
          <ul className="mt-4 space-y-1.5 border-t border-dashed border-slate-200 pt-3">
            {specs.slice(0, 2).map((spec, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-xs">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#dc2626]" />
                <span className="text-slate-400 shrink-0">{spec.label}:</span>
                <span className="font-semibold text-slate-700 line-clamp-1">{spec.value}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center gap-2 pt-5">
          <Button
            size="sm"
            variant={added ? "secondary" : "primary"}
            className="flex-1 gap-1.5 rounded-full text-xs font-semibold"
            onClick={handleAddToQuote}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Quote</span>
              </>
            )}
          </Button>

          <Link
            href={`/products/${slug}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-all hover:border-[#1e5aa8] hover:bg-[#1e5aa8] hover:text-white group-hover:rotate-45"
            aria-label={`View details for ${name}`}
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
