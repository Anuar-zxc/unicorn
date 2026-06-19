import { notFound } from "next/navigation";
import { AnalysisCards } from "@/components/analysis/AnalysisCards";
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
    .select("file_name,created_at,result")
    .eq("id", id)
    .maybeSingle();

  if (!analysis) notFound();

  return (
    <main className="p-4 md:p-6">
      <div className="mb-6">
        <p className="text-sm text-white/42">
          {new Date(analysis.created_at).toLocaleString()}
        </p>
        <h1 className="font-display text-3xl font-semibold">{analysis.file_name}</h1>
      </div>
      <AnalysisCards result={analysis.result as AnalysisResult} />
    </main>
  );
}
