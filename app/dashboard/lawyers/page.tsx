import { LawyerMarketplace, type Lawyer } from "@/components/lawyers/LawyerMarketplace";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const fallbackLawyers: Lawyer[] = [
  {
    id: "sarah-mitchell",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@lexo.ai",
    bio: "Former BigLaw attorney with 8 years in business contracts and employment law. Now helping SMBs get enterprise-quality legal advice.",
    specialties: ["Employment", "Business Contracts", "NDAs"],
    jurisdictions: ["California", "New York", "Federal"],
    price_per_session: 7900,
    rating: 4.9,
    review_count: 47,
    avatar_color: "#7C3AED",
    verified: true
  },
  {
    id: "james-chen",
    name: "James Chen",
    email: "james.chen@lexo.ai",
    bio: "IP and tech law specialist. Worked with 50+ startups on founder agreements, SaaS terms, and GDPR compliance.",
    specialties: ["IP & Copyright", "SaaS Contracts", "GDPR"],
    jurisdictions: ["California", "EU", "Federal"],
    price_per_session: 8900,
    rating: 4.8,
    review_count: 31,
    avatar_color: "#0D7A4E",
    verified: true
  },
  {
    id: "elena-vasquez",
    name: "Elena Vasquez",
    email: "elena.vasquez@lexo.ai",
    bio: "Bilingual attorney specializing in cross-border business law and real estate contracts across US and Latin America.",
    specialties: ["Real Estate", "Cross-border", "Business Law"],
    jurisdictions: ["Texas", "Florida", "Federal"],
    price_per_session: 6900,
    rating: 4.9,
    review_count: 52,
    avatar_color: "#C2410C",
    verified: true
  },
  {
    id: "david-park",
    name: "David Park",
    email: "david.park@lexo.ai",
    bio: "Employment law expert focused on protecting employees and freelancers. Former public defender turned business advocate.",
    specialties: ["Employment", "Freelance", "Disputes"],
    jurisdictions: ["New York", "New Jersey", "Federal"],
    price_per_session: 7400,
    rating: 4.7,
    review_count: 28,
    avatar_color: "#1A56E8",
    verified: true
  },
  {
    id: "anna-kowalski",
    name: "Anna Kowalski",
    email: "anna.kowalski@lexo.ai",
    bio: "EU law specialist covering GDPR, consumer protection, and cross-border commercial contracts for European businesses.",
    specialties: ["GDPR", "EU Law", "Consumer Protection"],
    jurisdictions: ["EU", "UK", "Germany"],
    price_per_session: 6500,
    rating: 4.8,
    review_count: 19,
    avatar_color: "#B45309",
    verified: true
  },
  {
    id: "michael-torres",
    name: "Michael Torres",
    email: "michael.torres@lexo.ai",
    bio: "Real estate and landlord-tenant specialist with 12 years handling commercial leases and property disputes.",
    specialties: ["Real Estate", "Landlord-Tenant", "Disputes"],
    jurisdictions: ["California", "Arizona", "Nevada"],
    price_per_session: 7900,
    rating: 5.0,
    review_count: 63,
    avatar_color: "#065F46",
    verified: true
  }
];

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
