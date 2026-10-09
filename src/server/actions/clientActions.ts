"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Client } from "@/models";
import { clientSchema, type ClientInput } from "@/lib/validators";

export async function createClientAction(data: ClientInput) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, message: "Unauthorized" };

    const validated = clientSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, message: "Validation failed", errors: validated.error.flatten().fieldErrors };
    }

    await connectDB();
    await Client.create(validated.data);
    revalidatePath("/clients");
    revalidatePath("/", "layout");
    return { success: true, message: "Client added successfully" };
  } catch (err) {
    console.error("Error creating client:", err);
    return { success: false, message: "Database error adding client." };
  }
}

export async function updateClientAction(id: string, data: Partial<ClientInput>) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, message: "Unauthorized" };

    const validated = clientSchema.partial().safeParse(data);
    if (!validated.success) {
      return { success: false, message: "Validation failed", errors: validated.error.flatten().fieldErrors };
    }
    await connectDB();
    await Client.findByIdAndUpdate(id, validated.data, { runValidators: true });
    revalidatePath("/clients");
    revalidatePath("/", "layout");
    return { success: true, message: "Client updated successfully" };
  } catch (err) {
    console.error("Error updating client:", err);
    return { success: false, message: "Database error updating client." };
  }
}

export async function deleteClientAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, message: "Unauthorized" };

    await connectDB();
    await Client.findByIdAndDelete(id);
    revalidatePath("/clients");
    revalidatePath("/", "layout");
    return { success: true, message: "Client deleted successfully" };
  } catch (err) {
    console.error("Error deleting client:", err);
    return { success: false, message: "Database error deleting client." };
  }
}
