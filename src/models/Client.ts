import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClient extends Document {
  name: string;
  logo?: string;
  website?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true, trim: true, index: true },
    logo: { type: String, default: "" },
    website: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Client: Model<IClient> =
  mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);

export default Client;
