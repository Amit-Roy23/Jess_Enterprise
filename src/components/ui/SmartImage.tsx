"use client";

import React from "react";
import Image, { type ImageLoaderProps, type ImageProps } from "next/image";
import { skipOptimization } from "@/lib/utils";

/** Let Cloudinary resize/compress its own images on its CDN (fast, no Vercel image quota). */
function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  return src.replace("/upload/", `/upload/f_auto,q_${quality ?? "auto"},c_limit,w_${width}/`);
}

/**
 * Drop-in replacement for next/image:
 * - Cloudinary URLs → resized by Cloudinary
 * - Wikimedia URLs → loaded directly by the browser
 * - everything else → Next.js image optimizer
 */
export default function SmartImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  if (src.includes("res.cloudinary.com/") && src.includes("/upload/")) {
    return <Image {...props} loader={cloudinaryLoader} unoptimized={false} />;
  }
  if (skipOptimization(src)) {
    return <Image {...props} unoptimized />;
  }
  return <Image {...props} />;
}
