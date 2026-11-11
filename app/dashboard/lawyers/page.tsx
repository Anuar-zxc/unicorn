import { LawyerMarketplace, type Lawyer } from "@/components/lawyers/LawyerMarketplace";
import { LawyersComingSoon } from "@/components/lawyers/LawyersComingSoon";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LawyersPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("lawyers")
    .select("id,name,email,bio,specialties,jurisdictions,price_per_session,rating,review_count,avatar_color,verified")
    .eq("verified", true)
    .eq("available", true)
    .order("rating", { ascending: false });

  // Only real, verified lawyers are bookable. The demo profiles used to be
  // shown (and paid for) as if they were real people.
  if (!data?.length) return <LawyersComingSoon />;

  const lawyers = data.map((lawyer) => ({ ...lawyer, rating: Number(lawyer.rating) })) as Lawyer[];
  return (
    <main className="p-4 md:p-6">
      <LawyerMarketplace lawyers={lawyers} />
    </main>
  );
}
