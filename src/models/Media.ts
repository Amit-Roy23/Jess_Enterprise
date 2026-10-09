import mongoose, { Schema, Document, Model } from "mongoose";

/** Images uploaded from the admin panel when Cloudinary is not configured. */
export interface IMedia extends Document {
  filename: string;
  contentType: string;
  size: number;
  data: Buffer;
  createdAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: { type: String, default: "" },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);

export default Media;
