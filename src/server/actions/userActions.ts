"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models";
import { adminUserSchema } from "@/lib/validators";

export async function createAdminUserAction(data: {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "editor";
}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return { success: false, message: "Only super administrators can create users." };
    }

    const validated = adminUserSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, message: "Validation failed", errors: validated.error.flatten().fieldErrors };
    }

    await connectDB();
    const existing = await AdminUser.findOne({ email: validated.data.email.toLowerCase() });
    if (existing) {
      return { success: false, message: "User with this email already exists." };
    }

    const passwordHash = await bcrypt.hash(validated.data.password, 10);
    await AdminUser.create({
      name: validated.data.name,
      email: validated.data.email.toLowerCase(),
      passwordHash,
      role: validated.data.role || "editor",
    });

    revalidatePath("/admin/users");
    return { success: true, message: "User created successfully." };
  } catch (err) {
    console.error("Error creating user:", err);
    return { success: false, message: "Database error creating user." };
  }
}

export async function deleteAdminUserAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return { success: false, message: "Only administrators can delete users." };
    }

    await connectDB();
    if (session.user.id === id) {
      return { success: false, message: "You cannot delete your own account." };
    }

    await AdminUser.findByIdAndDelete(id);
    revalidatePath("/admin/users");
    return { success: true, message: "User deleted successfully." };
  } catch (err) {
    console.error("Error deleting user:", err);
    return { success: false, message: "Database error deleting user." };
  }
}
