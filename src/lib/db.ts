import dns from "dns";
import mongoose from "mongoose";
import { AdminUser, SiteSettings } from "@/models";
import { runSeed, ensureAdminUser } from "@/lib/seed";

/**
 * Some ISPs/routers can't resolve the SRV records used by "mongodb+srv://" URIs.
 * We use the system resolver first (works on Vercel) and only switch to public
 * DNS servers if that lookup fails.
 */
function usePublicDns(): boolean {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    return true;
  } catch {
    return false;
  }
}

function isDnsError(err: unknown): boolean {
  const msg = err instanceof Error ? `${err.message} ${(err as { code?: string }).code || ""}` : String(err);
  return /querySrv|queryTxt|ENOTFOUND|ECONNREFUSED.*53|ETIMEOUT|EAI_AGAIN/i.test(msg);
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
      // Fail fast (instead of hanging the page) when the database is unreachable
      serverSelectionTimeoutMS: 8000,
    };

    const uri = MONGODB_URI;
    cached.promise = mongoose
      .connect(uri, opts)
      .catch(async (err) => {
        if (uri.startsWith("mongodb+srv://") && isDnsError(err) && usePublicDns()) {
          console.warn("[db] SRV lookup failed with system DNS, retrying with public DNS...");
          return mongoose.connect(uri, opts);
        }
        throw err;
      })
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
      // Photos are fetched later (seed script / admin dashboard) to keep this request fast
      await runSeed({ stockPhotos: false });
      console.log("[db] Default content seeded.");
    } else if (!(await AdminUser.exists({}))) {
      await ensureAdminUser();
    }
  } catch (err) {
    console.error("[db] Bootstrap failed:", err);
  }
}

export default connectDB;
