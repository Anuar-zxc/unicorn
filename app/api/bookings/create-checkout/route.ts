import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ALLOWED_SESSION_MINUTES } from "@/lib/lawyers";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    lawyer?: { id?: unknown };
    lawyerId?: unknown;
    duration?: unknown;
    slot?: unknown;
    notes?: unknown;
  };
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in to book a consultation." }, { status: 401 });
  }

  const lawyerId = String(body.lawyerId ?? body.lawyer?.id ?? "");
  const duration = ALLOWED_SESSION_MINUTES.includes(Number(body.duration) as 30 | 60)
    ? Number(body.duration)
    : 30;
  const slot = String(body.slot ?? "").slice(0, 120);
  const notes = String(body.notes ?? "").slice(0, 2_000);

  // The price always comes from our data, never from the browser:
  // previously a client could send price_per_session: 1 and pay $0.01.
  // Only verified lawyers from the database can be booked.
  let lawyer: { id: string; name: string; price_per_session: number } | undefined;
  if (UUID.test(lawyerId)) {
    const { data } = await supabase
      .from("lawyers")
      .select("id,name,price_per_session")
      .eq("id", lawyerId)
      .eq("verified", true)
      .maybeSingle();
    if (data) lawyer = data;
  }
  if (!lawyer) {
    return NextResponse.json({ error: "Lawyer not found." }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
  let bookingId: string = crypto.randomUUID();

  const { data: booking } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      lawyer_id: lawyer.id,
      duration_minutes: duration,
      status: "pending",
      notes: `Slot: ${slot}\n${notes}`
    })
    .select("id")
    .maybeSingle();
  if (booking?.id) bookingId = booking.id;

  const stripe = getStripeClient();
  const amount = Math.round(lawyer.price_per_session * (duration / 30));
  const confirmation = `/dashboard/lawyers/booking-confirmed?booking=${bookingId}&lawyer=${encodeURIComponent(lawyer.name)}&slot=${encodeURIComponent(slot)}`;

  if (!stripe) {
    return NextResponse.json({ url: `${confirmation}&demo=true` });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: {
            name: `${duration}-min consultation with ${lawyer.name}`,
            description: "Lexo flat-fee lawyer consultation"
          }
        }
      }
    ],
    success_url: `${appUrl}${confirmation}`,
    cancel_url: `${appUrl}/dashboard/lawyers?cancelled=true`,
    metadata: {
      booking_id: bookingId,
      lawyer_id: lawyer.id,
      user_id: user.id,
      slot,
      duration: String(duration)
    }
  });

  await supabase
    .from("bookings")
    .update({ stripe_session_id: session.id })
    .eq("id", bookingId)
    .eq("user_id", user.id);

  return NextResponse.json({ url: session.url });
}
