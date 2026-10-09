import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional().default(""),
  icon: z.string().optional().default(""),
  image: z.string().optional().default(""),
  vertical: z.enum(["legal-metrology", "lab-instruments", "fabrication"]),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type CategoryInput = z.input<typeof categorySchema>;
export type CategoryOutput = z.output<typeof categorySchema>;

export const productSpecSchema = z.object({
  label: z.string().min(1, "Spec label is required"),
  value: z.string().min(1, "Spec value is required"),
});

/** Absolute http(s) link (e.g. from Google Images) or a site path like /products/x.webp or /api/media/<id>. */
export const imageUrlSchema = z
  .string()
  .trim()
  .refine((v) => /^https?:\/\/\S+$/i.test(v) || /^\/(?!\/)\S*$/.test(v), "Valid image URL required");

export const productImageSchema = z.object({
  url: imageUrlSchema,
  publicId: z.string().optional().default(""),
  alt: z.string().optional().default(""),
});

export const productSeoSchema = z.object({
  title: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  shortDescription: z.string().optional().default(""),
  description: z.string().optional().default(""),
  specs: z.array(productSpecSchema).default([]),
  features: z.array(z.string()).default([]),
  applications: z.array(z.string()).default([]),
  images: z.array(productImageSchema).default([]),
  brochurePdf: z.string().optional().default(""),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  needsReview: z.boolean().default(false),
  order: z.number().int().default(0),
  seo: productSeoSchema.optional().default({}),
});

export type ProductInput = z.input<typeof productSchema>;

export const serviceSchema = z.object({
  title: z.string().min(2, "Service title is required"),
  slug: z.string().min(2, "Slug is required"),
  vertical: z.enum(["legal-metrology", "lab-instruments", "fabrication"]),
  summary: z.string().min(5, "Summary is required"),
  description: z.string().min(10, "Description is required"),
  highlights: z.array(z.string()).default([]),
  image: z.string().optional().default(""),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type ServiceInput = z.input<typeof serviceSchema>;

export const galleryItemSchema = z.object({
  title: z.string().min(2, "Title is required"),
  material: z.enum(["SS", "MS", "Acrylic", "PVC", "Teflon", "Polycarbonate"]),
  description: z.string().optional().default(""),
  images: z.array(productImageSchema).default([]),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type GalleryItemInput = z.input<typeof galleryItemSchema>;

export const clientSchema = z.object({
  name: z.string().min(2, "Client name is required"),
  logo: imageUrlSchema.optional().or(z.literal("")).default(""),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type ClientInput = z.input<typeof clientSchema>;

export const testimonialSchema = z.object({
  name: z.string().min(2, "Name is required"),
  designation: z.string().optional().default(""),
  company: z.string().min(2, "Company is required"),
  message: z.string().min(10, "Message is required"),
  isActive: z.boolean().default(true),
});

export type TestimonialInput = z.input<typeof testimonialSchema>;

export const enquiryItemSchema = z.object({
  productId: z.string().optional(),
  productName: z.string().min(1, "Product name required"),
  quantity: z.number().int().min(1).default(1),
  note: z.string().optional().default(""),
});

export const enquirySchema = z.object({
  type: z.enum(["quote", "service", "amc", "stamping", "fabrication", "contact"]),
  items: z.array(enquiryItemSchema).optional().default([]),
  name: z.string().min(2, "Full name is required"),
  company: z.string().optional().default(""),
  email: z.string().email("Valid email address required"),
  phone: z.string().min(10, "Valid 10-digit phone number required"),
  city: z.string().optional().default(""),
  message: z.string().min(5, "Please provide more details in your message"),
  attachments: z.array(z.string()).optional().default([]),
  status: z
    .enum(["new", "contacted", "quoted", "won", "lost", "closed"])
    .default("new"),
  internalNotes: z
    .array(
      z.object({
        text: z.string(),
        by: z.string(),
        at: z.date().or(z.string()),
      })
    )
    .optional()
    .default([]),
  sourcePage: z.string().optional().default(""),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryOutput = z.output<typeof enquirySchema>;

export const siteSettingsSchema = z.object({
  companyName: z.string().default("Jess Enterprises"),
  tagline: z.string().default("Innovative Services"),
  phones: z.object({
    mobile: z.string().default("9158391519"),
    office: z.string().default("9225901519"),
  }),
  email: z.string().email().default("jess.enterprises14@gmail.com"),
  address: z.string().default("Goa, India"),
  mapEmbedUrl: z.string().optional().default(""),
  licenceNumber: z.string().default("22000126-CLM (Authorised)"),
  gstin: z.string().default("30AZCPG5317P1ZG"),
  udyam: z.string().default("UDYAM-GA-01-0024091 (Micro)"),
  socialLinks: z
    .object({
      whatsapp: z.string().optional().default("https://wa.me/919225901519"),
      linkedin: z.string().optional().default(""),
      facebook: z.string().optional().default(""),
    })
    .default({}),
  heroHeadline: z
    .string()
    .default("Precision Lab Instruments & Authorised Legal Metrology in Goa"),
  heroSubheadline: z
    .string()
    .default(
      "Jess Enterprises is a professional company established to deliver the best services to its clients, looking forward to mutually beneficial business associations with organisations."
    ),
  businessHours: z.string().default("Mon - Sat: 9:00 AM - 6:30 PM"),
});

export type SiteSettingsInput = z.input<typeof siteSettingsSchema>;

export const adminUserSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "editor"]).default("admin"),
});

export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password is required"),
});
