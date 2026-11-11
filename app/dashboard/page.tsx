import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { IndividualDashboard } from "@/components/dashboard/IndividualDashboard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { countMonthlyUsage } from "@/lib/usage-server";
import { featureLimit } from "@/lib/usage";

const HOME_FEATURES = ["analyses", "builds", "questions"] as const;

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const userId = user?.id ?? "";
  const [{ data: profile }, { count }, { data: recent }, ...usageCounts] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name,account_type,plan")
      .eq("id", userId)
      .maybeSingle(),
    supabase.from("analyses").select("id", { count: "exact", head: true }),
    supabase.from("analyses").select("id,file_name,title,type,status,created_at").order("created_at", { ascending: false }).limit(10),
    ...HOME_FEATURES.map((feature) => countMonthlyUsage(supabase, userId, feature))
  ]);
  const usage = HOME_FEATURES.map((label, index) => ({
    label,
    used: usageCounts[index] as number,
    limit: featureLimit(profile?.plan, label)
  }));
  const firstName = profile?.full_name?.split(" ")[0] || "";
  const reviewed = count ?? 0;
  if (profile?.account_type !== "lawyer") {
    return (
      <IndividualDashboard
        firstName={profile?.full_name?.split(" ")[0] || ""}
        reviewed={reviewed}
        recent={recent ?? []}
        usage={usage}
      />
    );
  }
  return <DashboardHome firstName={firstName} reviewed={reviewed} recent={recent ?? []} usage={usage} />;
}
