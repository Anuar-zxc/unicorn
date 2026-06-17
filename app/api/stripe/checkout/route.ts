import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/auth/signin", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
  }

  const stripe = getStripeClient();
  const price = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!stripe || !price) {
    return NextResponse.redirect(new URL("/dashboard/billing?error=stripe_not_configured", appUrl));
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    customer_email: user.email,
    success_url: `${appUrl}/dashboard/billing?upgraded=true`,
    cancel_url: `${appUrl}/dashboard/billing?cancelled=true`,
    metadata: { user_id: user.id }
  });

  return NextResponse.redirect(session.url ?? `${appUrl}/dashboard/billing`);
}
