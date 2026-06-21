import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { IndividualDashboard } from "@/components/dashboard/IndividualDashboard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const [{ data: profile }, { count }, { data: recent }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name,account_type")
      .eq("id", user?.id ?? "")
      .maybeSingle(),
    supabase.from("analyses").select("id", { count: "exact", head: true }),
    supabase.from("analyses").select("id,file_name,title,type,status,created_at").order("created_at", { ascending: false }).limit(10)
  ]);
  const firstName = profile?.full_name?.split(" ")[0] || "Counsel";
  const reviewed = count ?? 0;
  if (profile?.account_type !== "lawyer") {
    return (
      <IndividualDashboard
        firstName={profile?.full_name?.split(" ")[0] || "there"}
        reviewed={reviewed}
        recent={recent ?? []}
      />
    );
  }
  return <DashboardHome firstName={firstName} reviewed={reviewed} recent={recent ?? []} />;
}
