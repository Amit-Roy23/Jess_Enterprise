import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { AdminUser, Category, Client, Product } from "@/models";

export const dynamic = "force-dynamic";

/** Turns a MongoDB connection error into a plain-English fix. */
function hintFor(message: string): string {
  if (/bad auth|authentication failed/i.test(message))
    return "Wrong database username or password in MONGODB_URI. Re-copy the connection string from Atlas (Database → Connect) and check the password (special characters like @ # % must be URL-encoded).";
  if (/whitelist|not allowed to access|IP address|ServerSelection|Could not connect to any servers|timed out/i.test(message))
    return "Atlas is blocking this server. In MongoDB Atlas → Security → Network Access → Add IP Address → 'Allow access from anywhere' (0.0.0.0/0), wait 1–2 minutes, then reload.";
  if (/querySrv|ENOTFOUND|EAI_AGAIN/i.test(message))
    return "The cluster address in MONGODB_URI could not be found. Check the host part (…@cluster0.xxxxx.mongodb.net) is copied exactly.";
  if (/MONGODB_URI/i.test(message))
    return "MONGODB_URI is not set. Add it in Vercel → Project → Settings → Environment Variables, then redeploy.";
  return "See the error message above.";
}

/** Public, read-only status check: is the site connected to MongoDB and does it have data? */
export async function GET() {
  const env = {
    MONGODB_URI: Boolean(process.env.MONGODB_URI),
    AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
    CLOUDINARY: Boolean(
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
    ),
  };

  try {
    await connectDB();
    const [products, productsWithPhotos, categories, clients, admins] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ "images.0": { $exists: true } }),
      Category.countDocuments(),
      Client.countDocuments(),
      AdminUser.countDocuments(),
    ]);
    return NextResponse.json(
      {
        ok: true,
        database: { connected: true, name: mongoose.connection.name },
        counts: { products, productsWithPhotos, categories, clients, admins },
        env,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return NextResponse.json(
      {
        ok: false,
        database: { connected: false, error: message.slice(0, 300), fix: hintFor(message) },
        env,
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
