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
