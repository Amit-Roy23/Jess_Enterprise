import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { Media } from "@/models";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return new Response("Not found", { status: 404 });
  }

  await connectDB();
  const media = await Media.findById(id);
  if (!media) {
    return new Response("Not found", { status: 404 });
  }

  const headers: Record<string, string> = {
    "Content-Type": media.contentType,
    // Uploaded files are immutable: a new upload always gets a new id
    "Cache-Control": "public, max-age=31536000, immutable",
  };
  if (media.contentType === "image/svg+xml") {
    headers["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'; sandbox";
  }
  return new Response(new Blob([new Uint8Array(media.data)]), { headers });
}
