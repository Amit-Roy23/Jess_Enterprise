import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IEnquiryItem {
  productId?: Types.ObjectId | string;
  productName: string;
  quantity: number;
  note?: string;
}

export interface IInternalNote {
  text: string;
  by: string;
  at: Date;
}

export interface IEnquiry extends Document {
  type: "quote" | "service" | "amc" | "stamping" | "fabrication" | "contact";
  items: IEnquiryItem[];
  name: string;
  company?: string;
  email: string;
  phone: string;
  city?: string;
  message: string;
  attachments: string[];
  status: "new" | "contacted" | "quoted" | "won" | "lost" | "closed";
  internalNotes: IInternalNote[];
  sourcePage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquiryItemSchema = new Schema<IEnquiryItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    note: { type: String, default: "" },
  },
  { _id: false }
);

const InternalNoteSchema = new Schema<IInternalNote>(
  {
    text: { type: String, required: true },
    by: { type: String, required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const EnquirySchema = new Schema<IEnquiry>(
  {
    type: {
      type: String,
      enum: ["quote", "service", "amc", "stamping", "fabrication", "contact"],
      required: true,
      index: true,
    },
    items: { type: [EnquiryItemSchema], default: [] },
    name: { type: String, required: true, trim: true },
    company: { type: String, default: "" },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, default: "" },
    message: { type: String, required: true },
    attachments: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "won", "lost", "closed"],
      default: "new",
      index: true,
    },
    internalNotes: { type: [InternalNoteSchema], default: [] },
    sourcePage: { type: String, default: "" },
  },
  { timestamps: true }
);

// Compound index on status and createdAt for inbox sorting & filtering
EnquirySchema.index({ status: 1, createdAt: -1 });

export const Enquiry: Model<IEnquiry> =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);

export default Enquiry;
