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
    <div className="group flex flex-col justify-between bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200">
      {/* Top Image Container */}
      <Link href={`/products/${slug}`} className="relative block overflow-hidden">
        <div className="aspect-[4/3] w-full bg-slate-50 relative">
          {primaryImage?.url ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <ProductPlaceholder categorySlug={categorySlug} name={name} />
          )}

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
            {categoryName && (
              <Badge variant="primary" className="text-[10px] shadow-xs">
                {categoryName}
              </Badge>
            )}
            {needsReview && (
              <Badge variant="warning" className="text-[10px] shadow-xs font-semibold">
                Specs Pending Review
              </Badge>
            )}
          </div>
        </div>
      </Link>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/products/${slug}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1e5aa8] transition-colors line-clamp-2 leading-snug">
              {name}
            </h3>
          </Link>

          {shortDescription && (
            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
              {shortDescription}
            </p>
          )}

          {/* Key Specs (2-3 items) */}
          {specs && specs.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
              {specs.slice(0, 3).map((spec, idx) => (
                <div key={idx} className="flex items-start text-xs gap-1.5">
                  <span className="text-slate-400 font-medium shrink-0">
                    {spec.label}:
                  </span>
                  <span className="text-slate-700 font-semibold line-clamp-1">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
          <Button
            size="sm"
            variant={added ? "secondary" : "primary"}
            className="flex-1 text-xs gap-1.5 font-semibold"
            onClick={handleAddToQuote}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Added to Quote</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Quote</span>
              </>
            )}
          </Button>

          <Link href={`/products/${slug}`}>
            <Button
              size="sm"
              variant="outline"
              className="px-2.5 text-xs text-slate-700 hover:text-[#1e5aa8]"
              aria-label={`View details for ${name}`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
