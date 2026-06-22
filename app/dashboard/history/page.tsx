import { HistoryHeading, HistoryList } from "@/components/dashboard/HistoryList";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HistoryPage() {
  const supabase = await createSupabaseServerClient();

  const { data: analyses } = await supabase
    .from("analyses")
    .select("id,file_name,created_at,result")
    .order("created_at", { ascending: false });

  return (
    <main className="p-4 md:p-6">
      <HistoryHeading />
      <HistoryList initialItems={analyses ?? []} />
    </main>
  );
}
