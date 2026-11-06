/** The production domain of the website. */
export const PRODUCTION_URL = "https://jesssenterprise.com";

/**
 * Public base URL used for SEO tags, sitemap, robots.txt and structured data.
 * NEXT_PUBLIC_APP_URL overrides it; placeholder or localhost values are ignored
 * in production builds so they can never leak into Google results.
 */
function resolveSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_APP_URL || "").trim().replace(/\/+$/, "");
  const isPlaceholder = !raw || /your-project|example\.com/i.test(raw);
  const isLocal = /localhost|127\.0\.0\.1/.test(raw);
  if (isPlaceholder) return PRODUCTION_URL;
  if (isLocal && process.env.NODE_ENV === "production" && process.env.VERCEL) return PRODUCTION_URL;
  return raw;
}

export const SITE_URL = resolveSiteUrl();
