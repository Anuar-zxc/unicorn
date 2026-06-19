import { CustomerPortal } from "@polar-sh/nextjs";
import { NextResponse, type NextRequest } from "next/server";
import { getSiteUrl, POLAR_SERVER } from "@/lib/polar";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const portal = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN ?? "",
  server: POLAR_SERVER,
  returnUrl: `${getSiteUrl()}/dashboard/billing`,
  getCustomerId: async () => {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { data: profile } = await supabase
      .from("profiles")
      .select("polar_customer_id")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile?.polar_customer_id) throw new Error("No Polar customer.");
    return profile.polar_customer_id;
  }
});

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/auth/signin?next=/api/portal", getSiteUrl())
    );
  }

  if (!process.env.POLAR_ACCESS_TOKEN) {
    return NextResponse.redirect(
      new URL("/dashboard/billing?error=polar_not_configured", getSiteUrl())
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("polar_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.polar_customer_id) {
    return NextResponse.redirect(
      new URL("/dashboard/billing?error=no_subscription", getSiteUrl())
    );
  }

  return portal(request);
}
