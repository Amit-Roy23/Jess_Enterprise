import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSettings extends Document {
  companyName: string;
  tagline: string;
  phones: {
    mobile: string;
    office: string;
  };
  email: string;
  address: string;
  mapEmbedUrl?: string;
  licenceNumber: string;
  gstin: string;
  udyam: string;
  socialLinks: {
    whatsapp?: string;
    linkedin?: string;
    facebook?: string;
  };
  heroHeadline: string;
  heroSubheadline: string;
  businessHours: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    companyName: { type: String, default: "Jess Enterprises" },
    tagline: { type: String, default: "Innovative Services" },
    phones: {
      mobile: { type: String, default: "9158391519" },
      office: { type: String, default: "9225901519" },
    },
    email: { type: String, default: "jess.enterprises14@gmail.com" },
    address: { type: String, default: "Goa, India" },
    mapEmbedUrl: { type: String, default: "" },
    licenceNumber: { type: String, default: "22000126-CLM (Authorised)" },
    gstin: { type: String, default: "30AZCPG5317P1ZG" },
    udyam: { type: String, default: "UDYAM-GA-01-0024091 (Micro)" },
    socialLinks: {
      whatsapp: { type: String, default: "https://wa.me/919225901519" },
      linkedin: { type: String, default: "" },
      facebook: { type: String, default: "" },
    },
    heroHeadline: {
      type: String,
      default: "Precision Lab Instruments & Authorised Legal Metrology in Goa",
    },
    heroSubheadline: {
      type: String,
      default:
        "Jess Enterprises is a professional company established to deliver the best services to its clients, looking forward to mutually beneficial business associations with organisations.",
    },
    businessHours: { type: String, default: "Mon - Sat: 9:00 AM - 6:30 PM" },
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
