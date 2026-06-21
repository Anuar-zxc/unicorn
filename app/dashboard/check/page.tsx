import { UploadContractForm } from "@/components/analysis/UploadContractForm";
import { canAnalyze, monthlyAnalysisLimit } from "@/lib/plans";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function PersonalContractCheckPage() {
  const supabase = await createSupabaseServerClient();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [{ data: profile }, { count }] = await Promise.all([
    supabase.from("profiles").select("plan").maybeSingle(),
    supabase
      .from("analyses")
      .select("id", { count: "exact", head: true })
      .gte("created_at", monthStart.toISOString())
  ]);
  const plan = profile?.plan ?? "free";
  const usage = count ?? 0;
  const allowed = canAnalyze(plan, usage);
  const limit = monthlyAnalysisLimit(plan);

  return (
    <main className="mx-auto max-w-5xl p-4 md:p-6">
      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--accent)]">
          Plain-English contract check
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Know what you are signing.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          Upload a lease, employment offer, service agreement, or another contract. Lexo highlights costly obligations, unusual clauses, and questions to ask before signing.
        </p>
        <p className="mt-4 text-sm text-[var(--text-muted)]">
          {limit === Infinity ? "Unlimited checks" : `${usage} of ${limit} checks used this month`}
        </p>
      </section>
      <UploadContractForm disabled={!allowed} />
    </main>
  );
}
