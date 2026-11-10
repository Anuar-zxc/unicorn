import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  // 303 makes the browser follow with GET instead of re-POSTing to "/".
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
