import { UploadContractForm } from "@/components/analysis/UploadContractForm";
import { FREE_MONTHLY_LIMIT, canAnalyze } from "@/lib/plans";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ContractReviewPage() {
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
    .gte("created_at", monthStart.toISOString());

  const plan = profile?.plan ?? "free";
  const usage = count ?? 0;
  const allowed = canAnalyze(plan, usage);

  return (
    <main className="p-4 md:p-6">
      <div className="mb-6 rounded-2xl border border-[#252b36] bg-[#131720] p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8fb0ff]">
          Contract intelligence
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Review PDF, DOCX, scans, and legal photos
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
          Upload a client contract or scan. Lexo extracts text, reads images
          with vision when Gemini is configured, highlights risk, and saves the
          report to matter history.
        </p>
        <p className="mt-4 text-sm text-white/42">
          {plan === "pro"
            ? "Pro plan: unlimited analyses"
            : `${usage} of ${FREE_MONTHLY_LIMIT} free analyses used this month`}
        </p>
      </div>

      <UploadContractForm disabled={!allowed} />

      {!allowed && (
        <p className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
          You have used your free monthly analysis. Upgrade to Pro for unlimited
          analyses.
        </p>
      )}
    </main>
  );
}
