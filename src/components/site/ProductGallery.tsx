"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: { url: string; alt?: string }[];
  name: string;
}

/** Main product photo with clickable thumbnails. */
export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] || images[0];

  return (
    <div>
      <div className="group aspect-[4/3] w-full relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.url}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={current.url}
              alt={current.alt || name}
              fill
              priority={active === 0}
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto border-t border-slate-100 p-3">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-50 ring-2 transition-all",
                i === active ? "ring-[#1e5aa8]" : "ring-transparent opacity-70 hover:opacity-100"
              )}
              aria-label={`Show photo ${i + 1} of ${name}`}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-contain p-1 mix-blend-multiply" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
