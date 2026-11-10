import { notFound } from "next/navigation";
import { AnalysisCards } from "@/components/analysis/AnalysisCards";
import { SavedOutput } from "@/components/dashboard/SavedOutput";
import { HistoryItemHeader } from "@/components/dashboard/HistoryItemHeader";
import type { AnalysisResult } from "@/lib/analysis-action";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AnalysisDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: analysis } = await supabase
    .from("analyses")
    .select("file_name,title,tool_type,created_at,result,output_text")
    .eq("id", id)
    .maybeSingle();

  if (!analysis) notFound();

  const result = analysis.result as AnalysisResult | null;
  const hasStructuredReport = Boolean(result && typeof result === "object" && "summary" in result);

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-6">
      <HistoryItemHeader
        fileName={analysis.file_name}
        title={analysis.title}
        toolType={analysis.tool_type}
        createdAt={analysis.created_at}
      />
      {hasStructuredReport && result ? (
        <AnalysisCards result={result} title={analysis.file_name ?? analysis.title ?? undefined} />
      ) : analysis.output_text ? (
        <SavedOutput title={analysis.title ?? analysis.file_name ?? "Lexo"} output={analysis.output_text} />
      ) : (
        <p className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 text-sm text-[var(--text-secondary)]">
          Этот отчёт пуст. / This report is empty.
        </p>
      )}
    </main>
  );
}
