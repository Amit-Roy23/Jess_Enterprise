import { Product } from "@/models";
import { STOCK_PHOTOS } from "@/lib/catalogue-data";
import { cloudinary } from "@/lib/cloudinary";

const USER_AGENT = `JessEnterprisesWebsite/1.0 (+${process.env.NEXT_PUBLIC_APP_URL || "https://jessenterprises.in"})`;

function cloudinaryConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

/** Resolves a Commons file name to a direct ~800px image URL, or null if it doesn't download. */
async function resolveCommonsImage(fileName: string): Promise<string | null> {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=800`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const type = res.headers.get("content-type") || "";
    await res.body?.cancel().catch(() => {});
    if (!res.ok || !type.startsWith("image/")) return null;
    return res.url;
  } catch {
    return null;
  }
}

export interface StockPhotoResult {
  slug: string;
  status: "added" | "skipped" | "failed";
  url?: string;
}

/**
 * Gives every product that has no photo a stock photo from Wikimedia Commons.
 * When Cloudinary is configured the photo is copied into Cloudinary (fast CDN, no hotlinking).
 * Products that already have photos are never touched.
 */
export async function fillMissingStockPhotos(): Promise<StockPhotoResult[]> {
  const slugs = Object.keys(STOCK_PHOTOS);
  const missing = await Product.find(
    { slug: { $in: slugs }, $or: [{ images: { $size: 0 } }, { images: { $exists: false } }] },
    { slug: 1, name: 1 }
  ).lean();

  const useCloudinary = cloudinaryConfigured();

  const results = await Promise.all(
    missing.map(async (product): Promise<StockPhotoResult> => {
      for (const file of STOCK_PHOTOS[product.slug] || []) {
        const remote = await resolveCommonsImage(file);
        if (!remote) continue;

        let finalUrl = remote;
        let publicId = "";
        if (useCloudinary) {
          try {
            const uploaded = await cloudinary.uploader.upload(remote, {
              folder: "jess_enterprises/products",
              public_id: product.slug,
              overwrite: true,
            });
            finalUrl = uploaded.secure_url;
            publicId = uploaded.public_id;
          } catch (err) {
            console.error(`[stock-photos] Cloudinary upload failed for ${product.slug}:`, err);
          }
        }

        await Product.updateOne(
          { _id: product._id, $or: [{ images: { $size: 0 } }, { images: { $exists: false } }] },
          { $set: { images: [{ url: finalUrl, publicId, alt: `${product.name} (photo: Wikimedia Commons)` }] } }
        );
        return { slug: product.slug, status: "added", url: finalUrl };
      }
      return { slug: product.slug, status: "failed" };
    })
  );

  return results;
}

// ---------------------------------------------------------------------------
// High-quality photos from the manufacturer's (Labman Scientific) product pages
// ---------------------------------------------------------------------------

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

/** Full-resolution Wix media URL (strips the /v1/fit/... resize suffix). */
function wixOriginal(url: string): string | null {
  const m = url.match(/https:\/\/static\.wixstatic\.com\/media\/([A-Za-z0-9_%-]+~mv2\.(?:jpe?g|png|webp))/i);
  return m ? `https://static.wixstatic.com/media/${m[1]}` : null;
}

/** Main product photo (and up to `max - 1` extra gallery photos) from a Wix product page. */
async function scrapeProductPhotos(pageUrl: string, max = 3): Promise<string[]> {
  try {
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": BROWSER_UA, Accept: "text/html" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    const html = await res.text();

    const found: string[] = [];
    const add = (u: string | null) => {
      if (u && !found.includes(u)) found.push(u);
    };
    // og:image is the product's main photo
    const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (og) add(wixOriginal(og[1]) || og[1]);
    // Extra photos from the product's own gallery data (not logos/banners elsewhere on the page)
    for (const m of html.matchAll(/"fullUrl"\s*:\s*"(https:\/\/static\.wixstatic\.com\/media\/[^"]+)"/gi)) {
      if (found.length >= max) break;
      add(wixOriginal(m[1]));
    }
    return found.slice(0, max);
  } catch {
    return [];
  }
}

async function isImage(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": BROWSER_UA }, signal: AbortSignal.timeout(15000) });
    const ok = res.ok && (res.headers.get("content-type") || "").startsWith("image/");
    await res.body?.cancel().catch(() => {});
    return ok;
  } catch {
    return false;
  }
}

/** True when a product only has the low-res photos we shipped (brochure crops / Commons). */
function hasOnlyDefaultPhotos(images: { url: string; publicId?: string }[] = []): boolean {
  return images.every(
    (img) =>
      img.url.startsWith("/products/") ||
      img.url.includes("upload.wikimedia.org") ||
      (img.publicId || "").startsWith("jess_enterprises/products/")
  );
}

/**
 * Replaces the default low-resolution photos with the manufacturer's HD photos.
 * Photos the admin uploaded or pasted are never replaced.
 */
export async function importSupplierPhotos(): Promise<StockPhotoResult[]> {
  const { SUPPLIER_PAGES } = await import("@/lib/catalogue-data");
  const products = await Product.find({ slug: { $in: Object.keys(SUPPLIER_PAGES) } }, { slug: 1, name: 1, images: 1 }).lean();
  const useCloudinary = cloudinaryConfigured();

  const queue = products.filter((p) => hasOnlyDefaultPhotos(p.images));
  const results: StockPhotoResult[] = products
    .filter((p) => !queue.includes(p))
    .map((p) => ({ slug: p.slug, status: "skipped" as const }));

  // Small worker pool: polite to the supplier site and fits in one serverless request
  const worker = async () => {
    for (let product = queue.shift(); product; product = queue.shift()) {
      const pages = SUPPLIER_PAGES[product.slug] || [];
      const urls: string[] = [];
      for (const page of pages) {
        for (const u of await scrapeProductPhotos(page, pages.length > 1 ? 2 : 3)) {
          if (!urls.includes(u)) urls.push(u);
        }
      }

      const images: { url: string; publicId: string; alt: string }[] = [];
      for (const [i, remote] of urls.slice(0, 4).entries()) {
        if (!(await isImage(remote))) continue;
        let url = remote;
        let publicId = "";
        if (useCloudinary) {
          try {
            const up = await cloudinary.uploader.upload(remote, {
              folder: "jess_enterprises/products",
              public_id: `${product.slug}-${i + 1}`,
              overwrite: true,
              transformation: [{ width: 1600, height: 1600, crop: "limit", quality: "auto" }],
            });
            url = up.secure_url;
            publicId = up.public_id;
          } catch (err) {
            console.error(`[supplier-photos] Cloudinary upload failed for ${product.slug}:`, err);
          }
        }
        images.push({ url, publicId, alt: product.name });
      }

      if (images.length === 0) {
        results.push({ slug: product.slug, status: "failed" });
        continue;
      }
      await Product.updateOne({ _id: product._id }, { $set: { images } });
      results.push({ slug: product.slug, status: "added", url: images[0].url });
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  return results;
}
