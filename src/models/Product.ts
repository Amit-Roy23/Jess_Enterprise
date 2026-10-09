import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProductSpec {
  label: string;
  value: string;
}

export interface IProductImage {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface IProductSeo {
  title?: string;
  description?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: Types.ObjectId;
  shortDescription?: string;
  description?: string;
  specs: IProductSpec[];
  features: string[];
  applications: string[];
  images: IProductImage[];
  brochurePdf?: string;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  needsReview: boolean;
  order: number;
  seo?: IProductSeo;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSpecSchema = new Schema<IProductSpec>(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const ProductSeoSchema = new Schema<IProductSeo>(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    specs: { type: [ProductSpecSchema], default: [] },
    features: { type: [String], default: [] },
    applications: { type: [String], default: [] },
    images: { type: [ProductImageSchema], default: [] },
    brochurePdf: { type: String, default: "" },
    tags: { type: [String], default: [], index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    needsReview: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
    seo: { type: ProductSeoSchema, default: () => ({}) },
  },
  { timestamps: true }
);

// Compound and text indexes
ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ category: 1, isActive: 1, order: 1 });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
