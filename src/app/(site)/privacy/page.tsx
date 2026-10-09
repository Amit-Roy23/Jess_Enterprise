import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none space-y-4 text-slate-700">
        <p>
          At Jess Enterprises, we respect your privacy. This policy outlines how we handle enquiries, service requests, and data submitted through our website.
        </p>
        <h2 className="text-xl font-bold text-slate-900 mt-6">Information Collection</h2>
        <p>
          We collect business contact information (name, company, email, phone number, location) when you submit a quote, service AMC, or fabrication enquiry.
        </p>
        <h2 className="text-xl font-bold text-slate-900 mt-6">Use of Information</h2>
        <p>
          Your information is solely used to process official quotation proposals, schedule Legal Metrology service visits, and fulfill technical fabrication orders.
        </p>
      </div>
      <div className="mt-8">
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
