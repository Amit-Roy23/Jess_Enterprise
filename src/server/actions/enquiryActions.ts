"use server";

import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Enquiry } from "@/models";
import { enquirySchema, type EnquiryInput } from "@/lib/validators";
import {
  sendBusinessEnquiryNotification,
  sendCustomerAcknowledgement,
} from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

export interface ActionResponse {
  success: boolean;
  message: string;
  enquiryId?: string;
  errors?: Record<string, string[]>;
}

export async function submitEnquiryAction(
  rawData: EnquiryInput & { turnstileToken?: string }
): Promise<ActionResponse> {
  try {
    // 1. Get client IP for rate limiting
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // 2. Check Rate Limit (Max 5 submissions per minute per IP)
    const rateLimit = checkRateLimit(ip, 5, 60000);
    if (!rateLimit.success) {
      return {
        success: false,
        message:
          "Too many requests from this device. Please wait a minute before submitting another enquiry.",
      };
    }

    // 3. Verify Turnstile Spam Protection
    const turnstile = await verifyTurnstileToken(rawData.turnstileToken, ip);
    if (!turnstile.success) {
      return {
        success: false,
        message: turnstile.message || "Security verification failed.",
      };
    }

    // 4. Validate Input with Zod
    const validated = enquirySchema.safeParse(rawData);
    if (!validated.success) {
      const formattedErrors = validated.error.flatten().fieldErrors;
      return {
        success: false,
        message: "Please correct the highlighted errors in the form.",
        errors: formattedErrors,
      };
    }

    // 5. Connect to MongoDB and create Enquiry document
    await connectDB();
    const enquiryDoc = await Enquiry.create({
      type: validated.data.type,
      items: validated.data.items || [],
      name: validated.data.name.trim(),
      company: validated.data.company?.trim() || "",
      email: validated.data.email.trim().toLowerCase(),
      phone: validated.data.phone.trim(),
      city: validated.data.city?.trim() || "",
      message: validated.data.message.trim(),
      attachments: validated.data.attachments || [],
      status: "new",
      internalNotes: [],
      sourcePage: validated.data.sourcePage || "",
    });

    // 6. Trigger Asynchronous Email Notifications (do not block user response on email fail)
    Promise.allSettled([
      sendBusinessEnquiryNotification({
        type: validated.data.type,
        name: validated.data.name,
        company: validated.data.company,
        email: validated.data.email,
        phone: validated.data.phone,
        city: validated.data.city,
        message: validated.data.message,
        items: validated.data.items,
        sourcePage: validated.data.sourcePage,
      }),
      sendCustomerAcknowledgement({
        type: validated.data.type,
        name: validated.data.name,
        company: validated.data.company,
        email: validated.data.email,
        phone: validated.data.phone,
        city: validated.data.city,
        message: validated.data.message,
        items: validated.data.items,
      }),
    ]).catch((err) => {
      console.error("Enquiry notification email dispatch error:", err);
    });

    return {
      success: true,
      message:
        "Your enquiry has been received successfully. Our sales engineering team will reach out to you shortly.",
      enquiryId: enquiryDoc._id.toString(),
    };
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return {
      success: false,
      message:
        "An unexpected error occurred while processing your request. Please call us directly at +91 91583 91519.",
    };
  }
}
