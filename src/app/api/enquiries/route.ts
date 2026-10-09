import { NextRequest, NextResponse } from "next/server";
import { submitEnquiryAction } from "@/server/actions/enquiryActions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await submitEnquiryAction(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("API enquiry submission error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while processing enquiry.",
      },
      { status: 500 }
    );
  }
}
