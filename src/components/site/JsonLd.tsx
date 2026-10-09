import React from "react";

interface OrganizationJsonLdProps {
  url?: string;
}

export function OrganizationJsonLd({ url = "https://jessenterprises.in" }: OrganizationJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Jess Enterprises",
    alternateName: "Jess Enterprises Goa",
    description:
      "Government Authorised Legal Metrology Service Provider, Laboratory Instruments Supplier, and Cleanroom Custom Fabrication Workshop.",
    url,
    logo: `${url}/logo.png`,
    image: `${url}/og-image.jpg`,
    telephone: ["+91-9158391519", "+91-9225901519"],
    email: "jess.enterprises14@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Goa",
      addressRegion: "Goa",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "15.2993",
      longitude: "74.1240",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:30",
      },
    ],
    identifier: [
      {
        "@type": "PropertyValue",
        name: "Legal Metrology Licence",
        value: "22000126-CLM",
      },
      {
        "@type": "PropertyValue",
        name: "GSTIN",
        value: "30AZCPG5317P1ZG",
      },
    ],
    knowsAbout: [
      "Legal Metrology Stamping and Verification",
      "Weighing Balance Calibration",
      "Laboratory Balances & Mass Comparators",
      "Spectrophotometers UV-Vis",
      "Dissolution Test Apparatus",
      "Custom Cleanroom SS 316 Fabrication",
      "HPLC Column Storage Systems",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProductJsonLdProps {
  name: string;
  description?: string;
  image?: string;
  slug: string;
  category?: string;
}

export function ProductJsonLd({
  name,
  description,
  image,
  slug,
  category,
}: ProductJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jessenterprises.in";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description:
      description || `${name} supplied and calibrated by Jess Enterprises.`,
    image: image || `${baseUrl}/og-image.jpg`,
    category,
    url: `${baseUrl}/products/${slug}`,
    brand: {
      "@type": "Brand",
      name: "Jess Enterprises",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${slug}`,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Jess Enterprises",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ServiceJsonLdProps {
  title: string;
  description: string;
  slug: string;
}

export function ServiceJsonLd({ title, description, slug }: ServiceJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jessenterprises.in";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description,
    provider: {
      "@type": "LocalBusiness",
      name: "Jess Enterprises",
      telephone: "+91-9158391519",
      email: "jess.enterprises14@gmail.com",
    },
    url: `${baseUrl}/services/${slug}`,
    areaServed: {
      "@type": "State",
      name: "Goa & Pan-India",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbsJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jessenterprises.in";

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
