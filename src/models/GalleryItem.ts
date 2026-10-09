import mongoose, { Schema, Document, Model } from "mongoose";
import { IProductImage } from "./Product";

export interface IGalleryItem extends Document {
  title: string;
  material: "SS" | "MS" | "Acrylic" | "PVC" | "Teflon" | "Polycarbonate";
  description?: string;
  images: IProductImage[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    title: { type: String, required: true, trim: true },
    material: {
      type: String,
      enum: ["SS", "MS", "Acrylic", "PVC", "Teflon", "Polycarbonate"],
      required: true,
      index: true,
    },
    description: { type: String, default: "" },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
        alt: { type: String, default: "" },
      },
    ],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const GalleryItem: Model<IGalleryItem> =
  mongoose.models.GalleryItem ||
  mongoose.model<IGalleryItem>("GalleryItem", GalleryItemSchema);

export default GalleryItem;
