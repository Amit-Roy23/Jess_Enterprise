"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { GalleryItem } from "@/models";
import { galleryItemSchema, type GalleryItemInput } from "@/lib/validators";

export async function createGalleryItemAction(data: GalleryItemInput) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, message: "Unauthorized" };

    const validated = galleryItemSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, message: "Validation failed", errors: validated.error.flatten().fieldErrors };
    }

    await connectDB();
    await GalleryItem.create(validated.data);
    revalidatePath("/fabrication");
    revalidatePath("/");
    return { success: true, message: "Gallery item created successfully" };
  } catch (err) {
    console.error("Error creating gallery item:", err);
    return { success: false, message: "Database error creating gallery item." };
  }
}

export async function updateGalleryItemAction(id: string, data: Partial<GalleryItemInput>) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, message: "Unauthorized" };

    await connectDB();
    await GalleryItem.findByIdAndUpdate(id, data);
    revalidatePath("/fabrication");
    revalidatePath("/");
    return { success: true, message: "Gallery item updated successfully" };
  } catch (err) {
    console.error("Error updating gallery item:", err);
    return { success: false, message: "Database error updating gallery item." };
  }
}

export async function deleteGalleryItemAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, message: "Unauthorized" };

    await connectDB();
    await GalleryItem.findByIdAndDelete(id);
    revalidatePath("/fabrication");
    revalidatePath("/");
    return { success: true, message: "Gallery item deleted successfully" };
  } catch (err) {
    console.error("Error deleting gallery item:", err);
    return { success: false, message: "Database error deleting gallery item." };
  }
}
