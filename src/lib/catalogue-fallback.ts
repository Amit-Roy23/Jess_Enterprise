import { createHash } from "crypto";
import {
  categoriesData,
  productsData,
  clientsList,
  servicesData,
  PRODUCT_IMAGES,
  CLIENT_LOGOS,
} from "@/lib/catalogue-data";

/**
 * Read-only copy of the default catalogue, shaped like the database documents.
 * Served when MongoDB is unreachable so visitors still see every product.
 */

/** Stable, valid ObjectId-style id derived from a slug (so quote requests still save). */
function stableId(key: string): string {
  return createHash("md5").update(key).digest("hex").slice(0, 24);
}

export const fallbackCategories = categoriesData.map((c) => ({ _id: stableId(`category:${c.slug}`), ...c }));

const categoryBySlug = new Map(fallbackCategories.map((c) => [c.slug, c]));

export const fallbackProducts = productsData
  .map((p) => {
    const { categorySlug, ...rest } = p;
    return {
      _id: stableId(`product:${p.slug}`),
      ...rest,
      category: categoryBySlug.get(categorySlug),
      images: (PRODUCT_IMAGES[p.slug] || []).map((f) => ({ url: `/products/${f}.webp`, alt: p.name })),
      tags: [p.name, categorySlug],
    };
  })
  .filter((p) => p.isActive !== false)
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export const fallbackClients = clientsList.map((name, i) => ({
  _id: stableId(`client:${name}`),
  name,
  logo: CLIENT_LOGOS[name] ? `/clients/${CLIENT_LOGOS[name]}.webp` : "",
  website: "",
  order: i + 1,
  isActive: true,
}));

export const fallbackServices = servicesData.map((s) => ({ _id: stableId(`service:${s.slug}`), ...s }));
