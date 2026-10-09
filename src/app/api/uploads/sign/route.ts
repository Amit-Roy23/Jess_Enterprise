import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateUploadSignature } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      !process.env.CLOUDINARY_API_SECRET ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    ) {
      // Cloudinary not configured: client falls back to MongoDB storage (/api/uploads)
      return NextResponse.json({ enabled: false });
    }

    const body = await req.json().catch(() => ({}));
    const folder = body.folder || "jess_enterprises";

    const signatureData = generateUploadSignature(folder);
    return NextResponse.json({ enabled: true, ...signatureData });
  } catch (error) {
    console.error("Upload signing error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}
