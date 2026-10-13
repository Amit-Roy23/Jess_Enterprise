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
  const m = url.match(/https:\/\/static\.wixstatic\.com\/media\/([A-Za-z0-9_%~.-]+?\.(?:jpe?g|png|webp))/i);
  return m ? `https://static.wixstatic.com/media/${m[1]}` : null;
}

type ScrapeResult = { photos: string[]; error?: string };

/** Main product photo (and up to `max - 1` gallery photos) from a Wix product page. */
async function scrapeProductPhotos(pageUrl: string, max = 3): Promise<ScrapeResult> {
  try {
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": BROWSER_UA, Accept: "text/html,application/xhtml+xml", "Accept-Language": "en" },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return { photos: [], error: `page HTTP ${res.status}` };
    const html = await res.text();

    const found: string[] = [];
    const add = (u: string | null | undefined) => {
      if (!u) return;
      const clean = wixOriginal(u) || (/^https?:\/\//.test(u) ? u : null);
      if (clean && !found.includes(clean)) found.push(clean);
    };

    // 1. og:image = the product's main photo
    const og =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    add(og?.[1]);

    // 2. JSON-LD Product "image"
    for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
      try {
        const data = JSON.parse(m[1]);
        for (const node of Array.isArray(data) ? data : [data]) {
          const img = node?.image;
          const list = Array.isArray(img) ? img : [img];
          for (const i of list) add(typeof i === "string" ? i : i?.contentUrl || i?.url);
        }
      } catch {
        // ignore malformed JSON-LD
      }
    }

    // 3. Product gallery data (not logos/banners elsewhere on the page)
    for (const m of html.matchAll(/"fullUrl"\s*:\s*"(https:\/\/static\.wixstatic\.com\/media\/[^"]+)"/gi)) {
      add(m[1]);
    }

    return found.length ? { photos: found.slice(0, max) } : { photos: [], error: "no photo found on page" };
  } catch (err) {
    return { photos: [], error: err instanceof Error ? err.message : "fetch failed" };
  }
}

async function isImage(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": BROWSER_UA }, signal: AbortSignal.timeout(12000) });
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
      (img.publicId || "").startsWith("jess_enterprises/products/") && !(img.publicId || "").includes("-hd-")
  );
}

export interface SupplierImportReport {
  updated: string[];
  failed: { slug: string; reason: string }[];
  keptOwnPhotos: string[];
  alreadyHd: string[];
  remaining: number;
}

/**
 * Replaces the default low-resolution photos with the manufacturer's HD photos.
 * Photos the admin uploaded or pasted are never replaced. Stops starting new
 * products after `budgetMs` so it fits in one serverless request; run it again
 * to continue (finished products are skipped).
 */
export async function importSupplierPhotos(budgetMs = 45000): Promise<SupplierImportReport> {
  const { SUPPLIER_PAGES } = await import("@/lib/catalogue-data");
  const deadline = Date.now() + budgetMs;
  const products = await Product.find(
    { slug: { $in: Object.keys(SUPPLIER_PAGES) } },
    { slug: 1, name: 1, images: 1 }
  ).lean();
  const useCloudinary = cloudinaryConfigured();

  const isHd = (imgs: { url: string; publicId?: string }[] = []) =>
    imgs.length > 0 && imgs.every((i) => (i.publicId || "").includes("-hd-") || i.url.includes("wixstatic.com"));

  const report: SupplierImportReport = { updated: [], failed: [], keptOwnPhotos: [], alreadyHd: [], remaining: 0 };
  const queue: typeof products = [];
  for (const p of products) {
    if (isHd(p.images)) report.alreadyHd.push(p.slug);
    else if (!hasOnlyDefaultPhotos(p.images)) report.keptOwnPhotos.push(p.slug);
    else queue.push(p);
  }

  const worker = async () => {
    for (let product = queue.shift(); product; product = queue.shift()) {
      if (Date.now() > deadline) {
        report.remaining++;
        continue;
      }
      const pages = SUPPLIER_PAGES[product.slug] || [];
      const urls: string[] = [];
      let lastError = "";
      // Main page: main photo + 2 gallery photos; alternative models: main photo only
      for (const [idx, page] of pages.entries()) {
        const { photos, error } = await scrapeProductPhotos(page, idx === 0 ? 3 : 1);
        if (error) lastError = error;
        for (const u of photos) if (!urls.includes(u) && urls.length < 4) urls.push(u);
      }

      const images: { url: string; publicId: string; alt: string }[] = [];
      for (const [i, remote] of urls.entries()) {
        if (useCloudinary) {
          try {
            const up = await cloudinary.uploader.upload(remote, {
              folder: "jess_enterprises/products",
              public_id: `${product.slug}-hd-${i + 1}`,
              overwrite: true,
              transformation: [{ width: 1600, height: 1600, crop: "limit", quality: "auto" }],
            });
            images.push({ url: up.secure_url, publicId: up.public_id, alt: product.name });
          } catch (err) {
            lastError = `Cloudinary: ${err instanceof Error ? err.message : JSON.stringify(err)}`;
          }
        } else if (await isImage(remote)) {
          images.push({ url: remote, publicId: "", alt: product.name });
        }
      }

      if (images.length === 0) {
        report.failed.push({ slug: product.slug, reason: lastError || "no photos" });
        continue;
      }
      await Product.updateOne({ _id: product._id }, { $set: { images } });
      report.updated.push(product.slug);
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  return report;
}
