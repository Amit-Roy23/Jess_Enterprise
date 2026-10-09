import dns from "dns";
import mongoose from "mongoose";
import { AdminUser, SiteSettings } from "@/models";
import { runSeed, ensureAdminUser } from "@/lib/seed";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore in serverless/edge environments where setServers is unavailable
}

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable (e.g. in .env.local)"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(async (mongooseInstance) => {
        await bootstrapDatabase();
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

/**
 * First-run bootstrap: on an empty database, load the full catalogue (products,
 * clients, services, settings) and create the admin login, so a fresh MongoDB
 * works without running `pnpm seed`. Never overwrites existing content.
 */
async function bootstrapDatabase() {
  try {
    const hasSettings = await SiteSettings.exists({});
    if (!hasSettings) {
      console.log("[db] Empty database detected — seeding default content...");
      await runSeed();
      console.log("[db] Default content seeded.");
    } else if (!(await AdminUser.exists({}))) {
      await ensureAdminUser();
    }
  } catch (err) {
    console.error("[db] Bootstrap failed:", err);
  }
}

export default connectDB;
