import Link from "next/link";
import {
  ArrowRight,
  FilePlus,
  FileSearch,
  Scale,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const modes = [
  {
    icon: FileSearch,
    title: "Analyze a contract",
    description: "Upload any contract. Get risks, plain-English summary, and negotiation tips.",
    cta: "Upload contract",
    href: "/dashboard/analyze",
    color: "blue"
  },
  {
    icon: FilePlus,
    title: "Build a contract",
    description: "Describe what you need. Lexo drafts a proper contract in minutes.",
    cta: "Start building",
    href: "/dashboard/build",
    color: "green"
  },
  {
    icon: Scale,
    title: "Get case strategy",
    description: "Facing a legal problem? Get laws, arguments, next steps, and a lawyer-ready brief.",
    cta: "Describe my situation",
    href: "/dashboard/case",
    color: "purple",
    badge: "New"
  }
];

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { count } = await supabase
    .from("analyses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user?.id);

  const { data: recent } = await supabase
    .from("analyses")
    .select("id,file_name,created_at")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="p-4 md:p-6">
      <section className="relative overflow-hidden rounded-2xl border border-[#252528] bg-[#141418] p-6 md:p-8">
        <div className="absolute right-8 top-8 hidden h-28 w-28 rounded-full bg-[#4D7EF5]/20 blur-3xl md:block" />
        <p className="flex items-center gap-2 text-sm text-white/50">
          <Sparkles className="h-4 w-4 text-[#4D7EF5]" />
          Good morning. Your legal workspace.
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold md:text-5xl">
          Analyze, draft, and prepare legal strategy in one place.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 md:text-base">
          Lexo now has three AI modes: contract risk analysis, contract drafting, and case strategy briefs built for lawyer handoff.
        </p>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {modes.map((mode) => (
          <ModeCard key={mode.title} {...mode} />
        ))}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-[#252528] bg-[#141418] p-5">
          <p className="text-sm text-white/45">Workspace stats</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat label="Analyses saved" value={String(count ?? 0)} />
            <Stat label="AI modes" value="3" />
            <Stat label="Lawyer-ready exports" value="PDF/DOCX" />
            <Stat label="Plan" value="Free" />
          </div>
        </div>

        <div className="rounded-2xl border border-[#252528] bg-[#141418] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/45">Recent activity</p>
            <Link href="/dashboard/history" className="text-sm font-medium text-[#8FB0FF] hover:text-white">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {(recent ?? []).length > 0 ? (
              recent?.map((item) => (
                <Link
                  key={item.id}
                  href={`/dashboard/history/${item.id}`}
                  className="flex items-center justify-between rounded-xl border border-[#252528] bg-[#0C0C0E] p-4 hover:border-[#4D7EF5]/50"
                >
                  <div>
                    <p className="font-medium">{item.file_name}</p>
                    <p className="mt-1 text-xs text-white/40">{new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/35" />
                </Link>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-[#34343A] bg-[#0C0C0E] p-6 text-sm leading-6 text-white/50">
                No documents yet. Start with an analysis, build a contract, or describe a legal problem.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function ModeCard({
  icon: Icon,
  title,
  description,
  cta,
  href,
  color,
  badge
}: (typeof modes)[number]) {
  const tone =
    color === "green"
      ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/20"
      : color === "purple"
        ? "bg-violet-400/10 text-violet-300 border-violet-400/20"
        : "bg-[#4D7EF5]/10 text-[#8FB0FF] border-[#4D7EF5]/20";

  return (
    <Link href={href} className="card group rounded-2xl border border-[#252528] bg-[#141418] p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${tone}`}>
          <Icon className="h-6 w-6" />
        </div>
        {badge && <span className="rounded-full bg-[#4D7EF5] px-3 py-1 text-xs font-bold text-white">{badge}</span>}
      </div>
      <h2 className="mt-6 font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-3 min-h-16 text-sm leading-6 text-white/55">{description}</p>
      <Button className="mt-5 w-full">
        {cta}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </Button>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#252528] bg-[#0C0C0E] p-4">
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
