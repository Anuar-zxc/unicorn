import { LawyerMarketplace, type Lawyer } from "@/components/lawyers/LawyerMarketplace";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fallbackLawyers } from "@/lib/lawyers";

export default async function LawyersPage() {
  let lawyers = fallbackLawyers;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("lawyers")
      .select("id,name,email,bio,specialties,jurisdictions,price_per_session,rating,review_count,avatar_color,verified")
      .eq("verified", true)
      .eq("available", true)
      .order("rating", { ascending: false });

    if (data?.length) {
      lawyers = data.map((lawyer) => ({
        ...lawyer,
        rating: Number(lawyer.rating)
      })) as Lawyer[];
    }
  }

  return (
    <main className="p-4 md:p-6">
      <div className="mb-6">
        <p className="text-sm text-white/42">Human handoff</p>
        <h1 className="font-display text-3xl font-semibold">Find a Lawyer</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
          Verified attorneys for flat-fee consultations. No surprises. Your Lexo brief can be shared before the call.
        </p>
      </div>
      <LawyerMarketplace lawyers={lawyers} />
    </main>
  );
}
