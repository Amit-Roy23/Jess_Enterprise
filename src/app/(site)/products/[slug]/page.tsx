import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  FileCheck,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  FlaskConical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductPlaceholder from "@/components/site/ProductPlaceholder";
import AddToQuoteButton from "@/components/site/AddToQuoteButton";
import ProductCard from "@/components/site/ProductCard";
import ProductGallery from "@/components/site/ProductGallery";
import { getProductBySlug, getRelatedProducts } from "@/server/queries";

export const revalidate = 60;

// Pages are rendered on first visit, then served from cache (ISR)
export async function generateStaticParams() {
  return [];
}

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Jess Enterprises",
    };
  }

  return {
    title: product.seo?.title || `${product.name} | Jess Enterprises`,
    description:
      product.seo?.description ||
      product.shortDescription ||
      `Official technical specifications and quotation for ${product.name} from Jess Enterprises Goa.`,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    String(product.category._id),
    String(product._id),
    4
  );

  const primaryImage = product.images?.[0];

  // JSON-LD Structured Data for Product SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    category: product.category?.name,
    brand: {
      "@type": "Brand",
      name: "Jess Enterprises",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      price: "0",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Jess Enterprises",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto pb-1"
        >
          <Link href="/" className="hover:text-slate-900">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/products" className="hover:text-slate-900">
            Products
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          {product.category && (
            <>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-slate-900"
              >
                {product.category.name}
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </>
          )}
          <span className="text-slate-900 font-semibold truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Top Product Hero Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Product Image / Visual Container (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {product.images?.length ? (
              <ProductGallery images={product.images} name={product.name} />
            ) : (
              <div className="aspect-[4/3] w-full relative bg-slate-50">
                <ProductPlaceholder
                  categorySlug={product.category?.slug}
                  name={product.name}
                />
              </div>
            )}

            {/* Statutory Compliance Footer Banner */}
            <div className="p-4 bg-blue-50/50 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-700">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">Legal Metrology & NABL Compliant:</span>
                <p className="text-[11px] text-slate-500">
                  Supplied with standard verification certificates and warranty support.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Product Info & Actions (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {product.category && (
                  <Badge variant="primary" className="text-xs font-bold">
                    {product.category.name}
                  </Badge>
                )}
                {product.needsReview && (
                  <Badge variant="warning" className="text-xs font-semibold">
                    Specs Pending Review
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge variant="accent" className="text-xs">
                    Featured
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Add to Quote Basket and WhatsApp Trigger */}
            <AddToQuoteButton
              productId={String(product._id)}
              productName={product.name}
              productSlug={product.slug}
              categoryName={product.category?.name}
              imageUrl={primaryImage?.url}
            />

            {/* Quick Assurance Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <FileCheck className="w-4 h-4 text-[#1e5aa8] shrink-0" />
                <span className="font-semibold text-slate-800">GST B2B Invoicing</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">NABL / AMC Support</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs col-span-2 sm:col-span-1">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-semibold text-slate-800">Goa Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table & Detailed Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Specs (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Technical Specs Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                <Layers className="w-5 h-5 text-[#1e5aa8]" />
                <h2 className="text-xl font-bold text-slate-900">
                  Technical Specifications
                </h2>
              </div>

              {product.specs && product.specs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left border-collapse">
                    <tbody>
                      {product.specs.map((spec, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? "bg-slate-50" : "bg-white"}
                        >
                          <td className="py-3 px-4 font-bold text-slate-700 w-1/3 border-b border-slate-100">
                            {spec.label}
                          </td>
                          <td className="py-3 px-4 text-slate-800 border-b border-slate-100 font-medium">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <p className="font-bold">Specification Sheet Pending Client Review</p>
                  <p>
                    Please contact our technical team at <strong className="text-[#1e5aa8]">+91 91583 91519</strong> or request a quote for custom technical parameters.
                  </p>
                </div>
              )}
            </div>

            {/* Description & Overview */}
            {product.description && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Product Overview</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Features & Highlights */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Key Features & Benefits</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar: Applications & Service Request Callout (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Target Applications */}
            {product.applications && product.applications.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <FlaskConical className="w-4 h-4 text-[#1e5aa8]" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Recommended Applications
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.applications.map((app, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {app}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Service & AMC Callout */}
            <div className="bg-gradient-to-br from-[#13335e] to-[#1e5aa8] text-white rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="text-base font-bold">
                Need Balance Stamping or AMC for this Equipment?
              </h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                Jess Enterprises provides government-authorised Legal Metrology verification (Licence No. 22000126-CLM) and comprehensive AMC across Goa.
              </p>
              <Link href="/services#amc">
                <Button
                  size="sm"
                  className="w-full bg-white text-[#1e5aa8] hover:bg-blue-50 font-bold"
                >
                  Explore AMC Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900">
                Related Equipment & Standards
              </h3>
              <Link
                href={`/products?category=${product.category?.slug}`}
                className="text-xs font-bold text-[#1e5aa8] hover:underline flex items-center gap-1"
              >
                <span>View all in {product.category?.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={String(rel._id || rel.slug)}
                  id={String(rel._id || rel.slug)}
                  name={rel.name}
                  slug={rel.slug}
                  categoryName={product.category?.name}
                  categorySlug={product.category?.slug}
                  shortDescription={rel.shortDescription}
                  specs={rel.specs}
                  images={rel.images}
                  needsReview={rel.needsReview}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
