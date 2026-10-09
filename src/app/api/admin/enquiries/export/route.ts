import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Enquiry } from "@/models";

interface EnquiryExportDoc {
  _id: { toString(): string };
  createdAt: string | Date;
  type: string;
  status: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  city?: string;
  message?: string;
  items?: { productName: string; quantity: number }[];
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();
    const enquiries = (await Enquiry.find().sort({ createdAt: -1 }).lean()) as unknown as EnquiryExportDoc[];

    // CSV header
    const headers = [
      "ID",
      "Date",
      "Type",
      "Status",
      "Name",
      "Company",
      "Email",
      "Phone",
      "City",
      "Message",
      "Items Count",
      "Items List",
    ];

    const rows = enquiries.map((enquiry) => {
      const escape = (text: string = "") => `"${String(text).replace(/"/g, '""')}"`;

      const itemsList = enquiry.items
        ? enquiry.items.map((i) => `${i.productName} (Qty: ${i.quantity})`).join("; ")
        : "";

      return [
        escape(enquiry._id.toString()),
        escape(new Date(enquiry.createdAt).toISOString().split("T")[0]),
        escape(enquiry.type),
        escape(enquiry.status),
        escape(enquiry.name),
        escape(enquiry.company || ""),
        escape(enquiry.email),
        escape(enquiry.phone),
        escape(enquiry.city || ""),
        escape(enquiry.message || ""),
        escape(String(enquiry.items?.length || 0)),
        escape(itemsList),
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\r\n");

    const dateStr = new Date().toISOString().split("T")[0];
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="jess_enquiries_export_${dateStr}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting enquiries CSV:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
