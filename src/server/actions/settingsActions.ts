"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validators";

export async function updateSiteSettingsAction(data: SiteSettingsInput) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, message: "Unauthorized" };

    const validated = siteSettingsSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, message: "Validation failed", errors: validated.error.flatten().fieldErrors };
    }

    await connectDB();
    await SiteSettings.findOneAndUpdate({}, validated.data, {
      upsert: true,
      new: true,
    });

    revalidatePath("/", "layout");
    return { success: true, message: "Site settings updated successfully." };
  } catch (err) {
    console.error("Error updating site settings:", err);
    return { success: false, message: "Database error updating site settings." };
  }
}
