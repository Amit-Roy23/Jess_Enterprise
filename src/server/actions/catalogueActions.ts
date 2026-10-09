"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { runSeed } from "@/lib/seed";
import { Product } from "@/models";

/**
 * Adds any missing default products/clients/services and downloads photos for
 * products that have none. Never overwrites or deletes the admin's edits.
 */
export async function restoreCatalogueAction() {
  const session = await auth();
  if (!session?.user) return { success: false, message: "Unauthorized" };

  try {
    await connectDB();
    const before = await Product.countDocuments({ "images.0": { $exists: true } });
    await runSeed({ stockPhotos: true });
    const [total, withPhotos] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ "images.0": { $exists: true } }),
    ]);

    revalidatePath("/", "layout");
    return {
      success: true,
      message: `Catalogue ready: ${total} products, ${withPhotos} with photos (${withPhotos - before} new photos added).`,
    };
  } catch (err) {
    console.error("Error restoring catalogue:", err);
    return { success: false, message: "Could not update the catalogue. Check /api/health." };
  }
}
