"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Product } from "@/models";
import { productSchema, type ProductInput } from "@/lib/validators";

export async function createProductAction(data: ProductInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const validated = productSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    await connectDB();

    // Check unique slug
    const existing = await Product.findOne({ slug: validated.data.slug });
    if (existing) {
      return { success: false, message: "A product with this slug already exists." };
    }

    const product = await Product.create(validated.data);

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${product.slug}`);

    return { success: true, message: "Product created successfully", id: product._id.toString() };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, message: "Database error while creating product." };
  }
}

export async function updateProductAction(id: string, data: Partial<ProductInput>) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    await connectDB();
    const product = await Product.findById(id);
    if (!product) {
      return { success: false, message: "Product not found" };
    }

    Object.assign(product, data);
    await product.save();

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${product.slug}`);

    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, message: "Database error while updating product." };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    await connectDB();
    const product = await Product.findByIdAndDelete(id);

    if (product) {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath(`/products/${product.slug}`);
    }

    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: "Database error while deleting product." };
  }
}
