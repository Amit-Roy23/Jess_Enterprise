"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { runSeed } from "@/lib/seed";
import { importSupplierPhotos, fillMissingStockPhotos } from "@/lib/stock-photos";
import { productsData } from "@/lib/catalogue-data";
import { Product } from "@/models";

/**
 * Adds any missing default products, replaces default low-res photos with the
 * manufacturer's HD photos, then fills remaining gaps with stock photos.
 * Never overwrites photos the admin uploaded. Safe to click repeatedly.
 */
export async function restoreCatalogueAction() {
  const session = await auth();
  if (!session?.user) return { success: false, message: "Unauthorized" };

  try {
    await connectDB();

    // Only re-run the (slow) seed when default products are missing
    const existing = await Product.countDocuments({ slug: { $in: productsData.map((p) => p.slug) } });
    if (existing < productsData.length) {
      await runSeed({ stockPhotos: false });
    }

    const hd = await importSupplierPhotos(40000);
    const stock = hd.remaining === 0 ? await fillMissingStockPhotos() : [];

    revalidatePath("/", "layout");

    const parts = [
      `${hd.updated.length} products updated with HD photos`,
      hd.alreadyHd.length ? `${hd.alreadyHd.length} already HD` : "",
      hd.keptOwnPhotos.length ? `${hd.keptOwnPhotos.length} kept your own photos` : "",
      stock.filter((s) => s.status === "added").length
        ? `${stock.filter((s) => s.status === "added").length} stock photos added`
        : "",
    ].filter(Boolean);
    let message = parts.join(" · ") + ".";
    if (hd.remaining > 0) message += ` ${hd.remaining} still to do — click the button again to continue.`;
    if (hd.failed.length) {
      message += ` Could not fetch: ${hd.failed.map((f) => `${f.slug} (${f.reason})`).join("; ")}.`;
    }

    return { success: hd.failed.length === 0, message };
  } catch (err) {
    console.error("Error restoring catalogue:", err);
    return {
      success: false,
      message: `Could not update the catalogue: ${err instanceof Error ? err.message : "unknown error"}. Check /api/health.`,
    };
  }
}
