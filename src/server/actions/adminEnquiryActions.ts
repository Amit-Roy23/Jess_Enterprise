"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Enquiry } from "@/models";

export async function updateEnquiryStatusAction(
  id: string,
  status: "new" | "contacted" | "quoted" | "won" | "lost" | "closed"
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    await connectDB();
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return { success: false, message: "Enquiry not found" };
    }

    enquiry.status = status;
    await enquiry.save();

    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");

    return { success: true, message: `Status updated to ${status}` };
  } catch (error) {
    console.error("Error updating enquiry status:", error);
    return { success: false, message: "Failed to update status." };
  }
}

export async function addEnquiryNoteAction(id: string, noteText: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    if (!noteText.trim()) {
      return { success: false, message: "Note text cannot be empty." };
    }

    await connectDB();
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return { success: false, message: "Enquiry not found" };
    }

    enquiry.internalNotes.push({
      text: noteText.trim(),
      by: session.user.name || session.user.email || "Admin",
      at: new Date(),
    });

    await enquiry.save();

    revalidatePath("/admin/enquiries");

    return { success: true, message: "Internal note added successfully." };
  } catch (error) {
    console.error("Error adding note:", error);
    return { success: false, message: "Failed to add internal note." };
  }
}

export async function deleteEnquiryAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return { success: false, message: "Only administrators can delete enquiries." };
    }

    await connectDB();
    await Enquiry.findByIdAndDelete(id);

    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");

    return { success: true, message: "Enquiry deleted successfully." };
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return { success: false, message: "Failed to delete enquiry." };
  }
}
