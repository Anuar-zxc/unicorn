import { Polar } from "@polar-sh/sdk";

export const POLAR_SERVER =
  process.env.POLAR_ENVIRONMENT === "production" ? "production" : "sandbox";

export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN ?? "",
  server: POLAR_SERVER
});

export const PLAN_PRODUCTS = {
  solo:
    process.env.POLAR_SOLO_PRODUCT_ID ??
    process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID ??
    "",
  firm:
    process.env.POLAR_FIRM_PRODUCT_ID ??
    process.env.NEXT_PUBLIC_POLAR_BUSINESS_PRODUCT_ID ??
    ""
} as const;

export const PLAN_ANNUAL_PRODUCTS = {
  solo: process.env.POLAR_SOLO_ANNUAL_PRODUCT_ID ?? "",
  firm: process.env.POLAR_FIRM_ANNUAL_PRODUCT_ID ?? ""
} as const;

export type PaidPlan = keyof typeof PLAN_PRODUCTS;

export function isPaidPlan(value: string | null): value is PaidPlan {
  return value === "solo" || value === "firm";
}

export function getPlanFromProductId(productId: string) {
  if (
    productId &&
    (productId === PLAN_PRODUCTS.solo ||
      productId === PLAN_ANNUAL_PRODUCTS.solo)
  ) return "solo";
  if (
    productId &&
    (productId === PLAN_PRODUCTS.firm ||
      productId === PLAN_ANNUAL_PRODUCTS.firm)
  ) return "firm";
  return "free";
}

export function getSiteUrl() {
  // VERCEL_PROJECT_PRODUCTION_URL is set automatically on Vercel, so OG images,
  // sitemap and checkout return URLs stay correct even without NEXT_PUBLIC_SITE_URL.
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined;
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    vercelUrl ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}
