import { Checkout } from "@polar-sh/nextjs";
import { NextRequest, NextResponse } from "next/server";
import {
  getSiteUrl,
  isPaidPlan,
  PLAN_ANNUAL_PRODUCTS,
  PLAN_PRODUCTS,
  POLAR_SERVER
} from "@/lib/polar";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const checkout = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  successUrl: `${getSiteUrl()}/dashboard/billing/success?checkout_id={CHECKOUT_ID}`,
  returnUrl: `${getSiteUrl()}/dashboard/billing`,
  server: POLAR_SERVER,
  theme: "dark"
});

export async function GET(request: NextRequest) {
  const plan = request.nextUrl.searchParams.get("plan");
  if (!isPaidPlan(plan)) {
    return NextResponse.redirect(
      new URL("/dashboard/billing?error=invalid_plan", getSiteUrl())
    );
  }

  const billing = request.nextUrl.searchParams.get("billing");
  const productId =
    billing === "annual"
      ? PLAN_ANNUAL_PRODUCTS[plan]
      : PLAN_PRODUCTS[plan];

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    const next = encodeURIComponent(
      `/api/checkout?plan=${plan}${billing === "annual" ? "&billing=annual" : ""}`
    );
    return NextResponse.redirect(
      new URL(`/auth/signin?next=${next}`, getSiteUrl())
    );
  }

  if (!process.env.POLAR_ACCESS_TOKEN || !productId) {
    return NextResponse.redirect(
      new URL("/dashboard/billing?error=polar_not_configured", getSiteUrl())
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("polar_subscription_id,subscription_status")
    .eq("id", user.id)
    .maybeSingle();

  if (
    profile?.polar_subscription_id &&
    profile.subscription_status !== "expired"
  ) {
    return NextResponse.redirect(new URL("/api/portal", getSiteUrl()));
  }

  const checkoutUrl = new URL(request.url);
  checkoutUrl.search = "";
  checkoutUrl.searchParams.set("products", productId);
  checkoutUrl.searchParams.set("customerExternalId", user.id);
  if (user.email) checkoutUrl.searchParams.set("customerEmail", user.email);

  return checkout(new NextRequest(checkoutUrl, request));
}
