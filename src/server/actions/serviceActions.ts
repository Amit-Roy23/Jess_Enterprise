"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Service } from "@/models";
import { serviceSchema, type ServiceInput } from "@/lib/validators";

export async function createServiceAction(data: ServiceInput) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, message: "Unauthorized" };

    const validated = serviceSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, message: "Validation failed", errors: validated.error.flatten().fieldErrors };
    }

    await connectDB();
    await Service.create(validated.data);
    revalidatePath("/services");
    revalidatePath("/", "layout");
    return { success: true, message: "Service created successfully" };
  } catch (err) {
    console.error("Error creating service:", err);
    return { success: false, message: "Database error creating service." };
  }
}

export async function updateServiceAction(id: string, data: Partial<ServiceInput>) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, message: "Unauthorized" };

    const validated = serviceSchema.partial().safeParse(data);
    if (!validated.success) {
      return { success: false, message: "Validation failed", errors: validated.error.flatten().fieldErrors };
    }
    await connectDB();
    await Service.findByIdAndUpdate(id, validated.data, { runValidators: true });
    revalidatePath("/services");
    revalidatePath("/", "layout");
    return { success: true, message: "Service updated successfully" };
  } catch (err) {
    console.error("Error updating service:", err);
    return { success: false, message: "Database error updating service." };
  }
}

export async function deleteServiceAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, message: "Unauthorized" };

    await connectDB();
    await Service.findByIdAndDelete(id);
    revalidatePath("/services");
    revalidatePath("/", "layout");
    return { success: true, message: "Service deleted successfully" };
  } catch (err) {
    console.error("Error deleting service:", err);
    return { success: false, message: "Database error deleting service." };
  }
}
