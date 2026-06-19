import { UploadContractForm } from "@/components/analysis/UploadContractForm";
import { canAnalyze, monthlyAnalysisLimit } from "@/lib/plans";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AnalyzePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user?.id)
    .maybeSingle();

  const { count } = await supabase
    .from("analyses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user?.id)
    .or("tool_type.in.(review,analysis),tool_type.is.null")
    .gte("created_at", monthStart.toISOString());

  const plan = profile?.plan ?? "free";
  const usage = count ?? 0;
  const allowed = canAnalyze(plan, usage);
  const limit = monthlyAnalysisLimit(plan);

  return (
    <main className="p-4 md:p-6">
      <div className="mb-6">
        <p className="text-sm text-white/42">
          {limit === Infinity ? "Unlimited analyses" : `${usage} of ${limit} analyses used this month`}
        </p>
        <h1 className="font-display text-3xl font-semibold">Analyze Contract</h1>
      </div>
      <UploadContractForm disabled={!allowed} />
      {!allowed && (
        <p className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
          You have reached your monthly analysis limit. Upgrade your plan to continue.
        </p>
      )}
    </main>
  );
}
