import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileCheck2,
  GitCompareArrows,
  MessageCircleQuestion,
  PenLine,
  SearchCheck
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const tools = [
  { icon: FileCheck2, title: "Contract Review", desc: "Analyze PDF, DOCX, scans, and photos", href: "/dashboard/review", tone: "blue" },
  { icon: SearchCheck, title: "Case Research", desc: "Statutes, precedents, legal memos", href: "/dashboard/research", tone: "indigo" },
  { icon: PenLine, title: "Draft Generator", desc: "Contracts, motions, demand letters", href: "/dashboard/draft", tone: "green" },
  { icon: BriefcaseBusiness, title: "Case Prep", desc: "Intake memos and strategy prep", href: "/dashboard/caseprep", tone: "purple" },
  { icon: GitCompareArrows, title: "Redline Compare", desc: "Compare two contract versions", href: "/dashboard/compare", tone: "amber" },
  { icon: MessageCircleQuestion, title: "Client Summary", desc: "Plain-language client briefs", href: "/dashboard/client", tone: "rose" }
];

const toneClasses: Record<string, string> = {
  blue: "border-blue-400/20 bg-blue-400/10 text-blue-300",
  indigo: "border-indigo-400/20 bg-indigo-400/10 text-indigo-300",
  green: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  purple: "border-violet-400/20 bg-violet-400/10 text-violet-300",
  amber: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  rose: "border-rose-400/20 bg-rose-400/10 text-rose-300"
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const [{ data: profile }, { count }, { data: recent }] = await Promise.all([
    supabase.from("profiles").select("full_name").maybeSingle(),
    supabase.from("analyses").select("id", { count: "exact", head: true }),
    supabase.from("analyses").select("id,file_name,title,type,status,created_at").order("created_at", { ascending: false }).limit(10)
  ]);
  const firstName = profile?.full_name?.split(" ")[0] || "Counsel";
  const reviewed = count ?? 0;
  return (
    <main className="p-4 md:p-6">
      <section className="rounded-2xl border border-[#252b36] bg-[#131720] p-6 md:p-8">
        <p className="text-sm text-white/45">Good morning, {firstName}.</p>
        <h1 className="mt-2 max-w-3xl font-display text-3xl font-semibold tracking-tight md:text-4xl">Your legal work, accelerated.</h1>
          <p className="mt-3 text-sm text-white/50">You have {recent?.filter((item) => item.status === "pending").length ?? 0} documents pending review.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <Stat label="Documents this month" value={String(reviewed)} />
          <Stat label="Hours saved" value={`${Math.round(reviewed * 1.8)}h`} />
          <Stat label="Active matters" value={String(Math.max(1, Math.ceil(reviewed / 3)))} />
        </div>
      </section>
      <section className="mt-6">
        <div className="flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-white/35">Workspace</p><h2 className="mt-2 font-display text-2xl font-semibold">Start with a tool</h2></div></div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => <Link key={tool.title} href={tool.href} className="group rounded-2xl border border-[#252b36] bg-[#131720] p-5 transition hover:-translate-y-0.5 hover:border-[#4d7ef5]/50 hover:bg-[#151b27]"><div className="flex items-start justify-between gap-3"><div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${toneClasses[tool.tone]}`}><tool.icon className="h-5 w-5" strokeWidth={2.65} /></div><span className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">Works now</span></div><h3 className="mt-5 font-display text-xl font-semibold">{tool.title}</h3><p className="mt-2 text-sm text-white/48">{tool.desc}</p><span className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#8fb0ff]">Run tool <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>)}
        </div>
      </section>
      <section className="mt-6 rounded-2xl border border-[#252b36] bg-[#131720] p-5">
        <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-white/35">Recent work</p><h2 className="mt-2 font-display text-xl font-semibold">Matter activity</h2></div><Link href="/dashboard/docs" className="text-sm font-semibold text-[#8fb0ff]">View all</Link></div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-[#252b36] text-xs uppercase tracking-[.1em] text-white/30"><tr><th className="pb-3 font-medium">File name</th><th className="pb-3 font-medium">Tool used</th><th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Status</th><th className="pb-3 text-right font-medium">Actions</th></tr></thead>
            <tbody className="divide-y divide-[#252b36]">
              {(recent ?? []).map((item) => <tr key={item.id}><td className="py-4 font-medium">{item.file_name || item.title || "Untitled matter"}</td><td className="py-4 text-white/50">{toolLabel(item.type)}</td><td className="py-4 text-white/50">{new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td><td className="py-4"><span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">{item.status || "Complete"}</span></td><td className="py-4 text-right"><Link href={`/dashboard/history/${item.id}`} className="font-medium text-[#8fb0ff]">Open</Link></td></tr>)}
            </tbody>
          </table>
          {!recent?.length && <div className="py-10 text-center text-sm text-white/40">No work yet. Choose a tool above to start your first matter.</div>}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-[#252b36] bg-[#0b0e14] p-4"><p className="text-xs text-white/38">{label}</p><p className="mt-2 font-display text-2xl font-semibold">{value}</p></div>; }
function toolLabel(type: string) { return ({ analyze: "Contract Review", build: "Draft Generator", case: "Case Prep", review: "Contract Review", research: "Case Research", draft: "Draft Generator", caseprep: "Case Prep", compare: "Redline Compare", client: "Client Summary" } as Record<string, string>)[type] ?? "Legal AI"; }
