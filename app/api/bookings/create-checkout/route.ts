import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { lawyer, duration, slot, notes } = await req.json();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let bookingId = crypto.randomUUID();

  if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const { data } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        lawyer_id: /^[0-9a-f-]{36}$/i.test(lawyer.id) ? lawyer.id : null,
        duration_minutes: duration,
        status: "pending",
        notes: `Slot: ${slot}\n${notes ?? ""}`
      })
      .select("id")
      .maybeSingle();

    if (data?.id) bookingId = data.id;
  }

  const stripe = getStripeClient();
  const amount = Math.round((lawyer.price_per_session ?? 7900) * ((duration ?? 30) / 30));

  if (!stripe) {
    return NextResponse.json({
      url: `/dashboard/lawyers/booking-confirmed?lawyer=${encodeURIComponent(lawyer.name)}&slot=${encodeURIComponent(slot)}&demo=true`
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user?.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: {
            name: `${duration ?? 30}-min consultation with ${lawyer.name}`,
            description: "Lexo flat-fee lawyer consultation"
          }
        }
      }
    ],
    success_url: `${appUrl}/dashboard/lawyers/booking-confirmed?booking=${bookingId}&lawyer=${encodeURIComponent(lawyer.name)}&slot=${encodeURIComponent(slot)}`,
    cancel_url: `${appUrl}/dashboard/lawyers?cancelled=true`,
    metadata: {
      booking_id: bookingId,
      lawyer_id: lawyer.id,
      user_id: user?.id ?? "",
      slot,
      duration: String(duration ?? 30)
    }
  });

  if (user && bookingId) {
    await supabase
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", bookingId)
      .eq("user_id", user.id);
  }

  return NextResponse.json({ url: session.url });
}
