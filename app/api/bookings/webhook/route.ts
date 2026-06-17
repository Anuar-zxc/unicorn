import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripeClient } from "@/lib/stripe";

export async function POST(req: Request) {
  const stripe = getStripeClient();
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !signature || !webhookSecret) {
    return NextResponse.json({ received: true, skipped: "stripe_not_configured" });
  }

  const rawBody = await req.text();
  const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata?.booking_id;

    if (
      bookingId &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      await supabase
        .from("bookings")
        .update({
          status: "confirmed",
          stripe_session_id: session.id
        })
        .eq("id", bookingId);
    }
  }

  return NextResponse.json({ received: true });
}
