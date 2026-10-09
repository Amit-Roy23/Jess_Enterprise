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
import { runSeed, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from "../src/lib/seed";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jess_enterprises";

async function main() {
  console.log("Connecting to MongoDB for seeding...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully to MongoDB.");
  await runSeed({ resetAdminPassword: true });
  console.log("Seeding completed successfully!");
  console.log(
    `Admin login: ${process.env.INITIAL_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL} / ${
      process.env.INITIAL_ADMIN_PASSWORD ? "(INITIAL_ADMIN_PASSWORD)" : DEFAULT_ADMIN_PASSWORD
    }`
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
