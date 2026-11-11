import { redirect } from "next/navigation";
import { SettingsView } from "@/components/settings/SettingsView";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin?next=/dashboard/settings");
  const { data: profile } = await supabase
    .from("profiles")
    .select("polar_customer_id,account_type")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <SettingsView
      email={user.email ?? ""}
      accountType={profile?.account_type === "lawyer" ? "lawyer" : "individual"}
      hasBillingPortal={Boolean(profile?.polar_customer_id)}
    />
  );
}
