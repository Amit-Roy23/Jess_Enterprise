"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Category } from "@/models";
import { categorySchema, type CategoryInput } from "@/lib/validators";

export async function createCategoryAction(data: CategoryInput) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, message: "Unauthorized" };

    const validated = categorySchema.safeParse(data);
    if (!validated.success) {
      return { success: false, message: "Validation failed", errors: validated.error.flatten().fieldErrors };
    }

    await connectDB();
    const existing = await Category.findOne({ slug: validated.data.slug });
    if (existing) return { success: false, message: "Slug already exists." };

    await Category.create(validated.data);
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true, message: "Category created successfully" };
  } catch (err) {
    console.error("Error creating category:", err);
    return { success: false, message: "Database error creating category." };
  }
}

export async function updateCategoryAction(id: string, data: Partial<CategoryInput>) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, message: "Unauthorized" };

    await connectDB();
    await Category.findByIdAndUpdate(id, data);
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true, message: "Category updated successfully" };
  } catch (err) {
    console.error("Error updating category:", err);
    return { success: false, message: "Database error updating category." };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, message: "Unauthorized" };

    await connectDB();
    await Category.findByIdAndDelete(id);
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true, message: "Category deleted successfully" };
  } catch (err) {
    console.error("Error deleting category:", err);
    return { success: false, message: "Database error deleting category." };
  }
}
