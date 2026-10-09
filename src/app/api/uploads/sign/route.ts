import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateUploadSignature } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const folder = body.folder || "jess_enterprises";

    const signatureData = generateUploadSignature(folder);
    return NextResponse.json(signatureData);
  } catch (error) {
    console.error("Upload signing error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}
