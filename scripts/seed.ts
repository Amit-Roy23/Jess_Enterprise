import dns from "dns";
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore if custom DNS cannot be set
}
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import mongoose from "mongoose";
import { runSeed, getAdminCredentials } from "../src/lib/seed";
import { AdminUser, Product } from "../src/models";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jess_enterprises";

async function main() {
  console.log("Connecting to MongoDB for seeding...");
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const { host, name } = mongoose.connection;
  console.log(`Connected to host "${host}", database "${name}".`);

  await runSeed({ resetAdminPassword: true });

  const creds = getAdminCredentials();
  const [products, admins] = await Promise.all([Product.countDocuments(), AdminUser.countDocuments()]);
  console.log("\nSeeding completed successfully!");
  console.log(`  Database : ${name} @ ${host}`);
  console.log(`  Products : ${products}`);
  console.log(`  Admins   : ${admins}`);
  console.log("\n  Admin login (password was just reset to this):");
  console.log(`    Email    : ${creds.email}`);
  console.log(`    Password : ${creds.password}${process.env.INITIAL_ADMIN_PASSWORD ? "   (from INITIAL_ADMIN_PASSWORD)" : ""}`);
  console.log("\n  Your live site must use the SAME MONGODB_URI (same cluster AND database name) to see this data.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
