import Link from "next/link";
import { Trash2 } from "lucide-react";
import { deleteAnalysisAction } from "@/lib/analysis-action";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HistoryPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: analyses } = await supabase
    .from("analyses")
    .select("id,file_name,created_at,result")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <main className="p-4 md:p-6">
      <div className="mb-6">
        <p className="text-sm text-white/42">Saved reports</p>
        <h1 className="font-display text-3xl font-semibold">Previous Analyses</h1>
      </div>

      {!analyses?.length ? (
        <section className="rounded-xl border border-[#252528] bg-[#141418] p-8 text-center">
          <h2 className="font-display text-2xl font-semibold">No reports yet</h2>
          <p className="mt-3 text-white/50">Upload your first contract to create a report.</p>
          <Link href="/dashboard/analyze" className="mt-5 inline-flex text-sm font-semibold text-[#8fb0ff]">
            Analyze a contract
          </Link>
        </section>
      ) : (
        <div className="grid gap-3">
          {analyses.map((analysis) => (
            <article key={analysis.id} className="flex flex-col gap-4 rounded-xl border border-[#252528] bg-[#141418] p-5 md:flex-row md:items-center md:justify-between">
              <Link href={`/dashboard/history/${analysis.id}`} className="min-w-0">
                <h2 className="truncate font-display text-xl font-semibold">{analysis.file_name}</h2>
                <p className="mt-2 line-clamp-1 text-sm text-white/50">
                  {analysis.result?.summary ?? "Contract risk report"}
                </p>
                <p className="mt-2 text-xs text-white/35">
                  {new Date(analysis.created_at).toLocaleDateString()}
                </p>
              </Link>
              <form action={deleteAnalysisAction}>
                <input type="hidden" name="id" value={analysis.id} />
                <button className="flex items-center gap-2 rounded-lg border border-[#252528] px-3 py-2 text-sm text-white/60 hover:border-red-500/40 hover:text-red-100">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
