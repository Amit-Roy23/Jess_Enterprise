import mongoose, { Schema, Document, Model } from "mongoose";

export interface IService extends Document {
  title: string;
  slug: string;
  vertical: "legal-metrology" | "lab-instruments" | "fabrication";
  summary: string;
  description: string;
  highlights: string[];
  image?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    vertical: {
      type: String,
      enum: ["legal-metrology", "lab-instruments", "fabrication"],
      required: true,
      index: true,
    },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    highlights: { type: [String], default: [] },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
