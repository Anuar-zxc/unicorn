import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/safe-redirect";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next");
  const requestedAccountType = searchParams.get("account_type");
  const accountType =
    requestedAccountType === "lawyer" ? "lawyer" : "individual";
  const next = safeRedirectPath(requestedNext);

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user && requestedAccountType) {
        await supabase
          .from("profiles")
          .update({ account_type: accountType })
          .eq("id", user.id);
      }
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  // Auth code exchange failed — redirect to sign in with an error flag
  return NextResponse.redirect(`${origin}/auth/signin?error=confirmation_failed`);
}
