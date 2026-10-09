import mongoose from "mongoose";
import { fillMissingStockPhotos } from "@/lib/stock-photos";
import bcrypt from "bcryptjs";
import {
  Category,
  Product,
  Service,
  GalleryItem,
  Client,
  SiteSettings,
  AdminUser,
} from "@/models";
import {
  categoriesData,
  servicesData,
  productsData,
  clientsList,
  galleryData,
  PRODUCT_IMAGES,
  CLIENT_LOGOS,
  GALLERY_IMAGES,
} from "@/lib/catalogue-data";

/**
 * Default admin login. Override with INITIAL_ADMIN_EMAIL / INITIAL_ADMIN_PASSWORD
 * env vars, and change the password from Admin → Users after the first login.
 */
export const DEFAULT_ADMIN_EMAIL = "jess.enterprises14@gmail.com";
export const DEFAULT_ADMIN_PASSWORD = "Jess@Admin2026";

/** The admin login the seed creates (env vars override the defaults). */
export function getAdminCredentials() {
  return {
    email: (process.env.INITIAL_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase().trim(),
    name: process.env.INITIAL_ADMIN_NAME || "Jess Admin",
    password: process.env.INITIAL_ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD,
  };
}

/** Creates the admin account if missing. Returns true when an account was created. */
export async function ensureAdminUser(resetPassword = false): Promise<boolean> {
  const { email, name, password } = getAdminCredentials();

  const existing = await AdminUser.findOne({ email });
  if (existing && !resetPassword) return false;

  const passwordHash = await bcrypt.hash(password, 10);
  await AdminUser.findOneAndUpdate(
    { email },
    { name, email, passwordHash, role: "admin" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return !existing;
}

/**
 * Idempotent content seed. Only inserts missing records (never overwrites or
 * deletes what the admin has edited), so it is safe to run repeatedly.
 */
export async function runSeed(opts: { resetAdminPassword?: boolean; stockPhotos?: boolean } = {}) {

  // 1. Seed Site Settings (Singleton)
  console.log("Seeding Site Settings...");
  await SiteSettings.findOneAndUpdate(
    {},
    {
      $setOnInsert: {
      companyName: "Jess Enterprises",
      tagline: "Innovative Services",
      phones: {
        mobile: "9158391519",
        office: "9225901519",
      },
      email: "jess.enterprises14@gmail.com",
      address: "Goa, India",
      licenceNumber: "22000126-CLM (Authorised)",
      gstin: "30AZCPG5317P1ZG",
      udyam: "UDYAM-GA-01-0024091 (Micro)",
      socialLinks: {
        whatsapp: "https://wa.me/919225901519",
        linkedin: "",
        facebook: "",
      },
      heroHeadline:
        "Precision Lab Instruments & Authorised Legal Metrology in Goa",
      heroSubheadline:
        "Jess Enterprises is a professional company established to deliver the best services to its clients, looking forward to mutually beneficial business associations with organisations.",
      businessHours: "Monday – Saturday: 9:00 AM – 6:30 PM",
    } },
    { upsert: true, new: true }
  );

  // 2. Seed Admin User (password is only (re)set on create or when explicitly asked)
  await ensureAdminUser(opts.resetAdminPassword);

  // 3. Seed Categories
  console.log("Seeding Categories...");

  const categoryMap = new Map<string, mongoose.Types.ObjectId>();
  for (const cat of categoriesData) {
    const doc = await Category.findOneAndUpdate(
      { slug: cat.slug },
      { $setOnInsert: cat },
      { upsert: true, new: true }
    );
    categoryMap.set(cat.slug, doc._id as mongoose.Types.ObjectId);
  }

  // 4. Seed Services
  console.log("Seeding Services...");

  for (const s of servicesData) {
    await Service.findOneAndUpdate({ slug: s.slug }, { $setOnInsert: s }, {
      upsert: true,
      new: true,
    });
  }

  // 5. Seed Products (25 table products + profile named instruments)
  console.log("Seeding Products...");

  for (const p of productsData) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) continue;

    await Product.findOneAndUpdate(
      { slug: p.slug },
      { $setOnInsert: {
        name: p.name,
        slug: p.slug,
        category: categoryId,
        shortDescription: p.shortDescription,
        description: p.description,
        specs: p.specs,
        features: p.features,
        applications: p.applications,
        isFeatured: p.isFeatured,
        isActive: p.isActive,
        needsReview: p.needsReview,
        order: p.order,
        tags: [p.name, p.categorySlug],
        seo: {
          title: `${p.name} | Jess Enterprises Goa`,
          description: p.shortDescription,
        },
      } },
      { upsert: true, new: true }
    );

    // Attach default photos only when the admin hasn't set any yet
    const photos = PRODUCT_IMAGES[p.slug];
    if (photos?.length) {
      await Product.updateOne(
        { slug: p.slug, "images.0": { $exists: false } },
        { $set: { images: photos.map((f) => ({ url: `/products/${f}.webp`, alt: p.name })) } }
      );
    }
  }

  // 6. Seed Clients (all 18 clients as text names only)
  console.log("Seeding Clients...");

  let clientOrder = 1;
  for (const clientName of clientsList) {
    const logo = CLIENT_LOGOS[clientName];
    await Client.findOneAndUpdate(
      { name: clientName },
      {
        $set: { name: clientName, order: clientOrder++ },
        $setOnInsert: { logo: logo ? `/clients/${logo}.webp` : "", website: "", isActive: true },
      },
      { upsert: true, new: true }
    );
    if (logo) {
      await Client.updateOne(
        { name: clientName, $or: [{ logo: "" }, { logo: { $exists: false } }] },
        { $set: { logo: `/clients/${logo}.webp` } }
      );
    }
  }

  // 7. Seed Sample Gallery Items for Custom Fabrication
  console.log("Seeding Gallery Items...");

  for (const item of galleryData) {
    await GalleryItem.findOneAndUpdate({ title: item.title }, { $setOnInsert: item }, {
      upsert: true,
      new: true,
    });
    const photos = GALLERY_IMAGES[item.title];
    if (photos?.length) {
      await GalleryItem.updateOne(
        { title: item.title, "images.0": { $exists: false } },
        { $set: { images: photos.map((f) => ({ url: `/products/${f}.webp`, alt: item.title })) } }
      );
    }
  }


  // 8. Download stock photos for products that still have none (needs internet)
  if (opts.stockPhotos === false) return;
  console.log("Adding photos for products without one...");
  const photos = await fillMissingStockPhotos();
  const added = photos.filter((p) => p.status === "added").length;
  if (photos.length) console.log(`  ${added}/${photos.length} product photos added.`);
}
