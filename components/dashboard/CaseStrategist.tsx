"use client";

import { useMemo, useState } from "react";
import { Archive, Briefcase, CheckCircle2, Download, FileText, Loader2, Scale, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponseModeToggle } from "@/components/shared/ResponseModeToggle";
import type { ResponseMode } from "@/lib/ai-prompts";
import { LanguageModeToggle } from "@/components/shared/LanguageModeToggle";
import type { AILanguage } from "@/lib/ai-language";
import { useLanguage } from "@/components/providers/AppProviders";

const stages = ["Just started", "Got a legal notice", "Going to court", "Already in court"];
const progressSteps = [
  "Reading your documents...",
  "Identifying legal issues...",
  "Researching applicable laws...",
  "Analyzing your position...",
  "Building your strategy...",
  "Preparing your brief..."
];

const lawyers = [
  ["Maya Chen", "Employment Law · California", "Has handled 18+ cases like yours", "$89 / 30-min"],
  ["Daniel Hart", "Business Disputes · New York", "Breach-of-contract specialist", "$99 / 30-min"],
  ["Elena Volkova", "EU Contract Law · GDPR", "Cross-border SMB counsel", "$89 / 30-min"]
];

export function CaseStrategist() {
  const { locale } = useLanguage();
  const [situation, setSituation] = useState("");
  const [outcome, setOutcome] = useState("");
  const [stage, setStage] = useState(stages[0]);
  const [jurisdiction, setJurisdiction] = useState("California");
  const [documentsSummary, setDocumentsSummary] = useState("");
  const [strategy, setStrategy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<ResponseMode>("concise");
  const [language, setLanguage] = useState<AILanguage>(locale);

  const activeStep = useMemo(() => {
    if (!loading && strategy) return progressSteps.length;
    if (!loading) return 0;
    return Math.min(progressSteps.length - 1, Math.floor(strategy.length / 500));
  }, [loading, strategy]);

  async function generate() {
    if (!situation.trim() || !outcome.trim()) {
      setError("Tell us what happened and what outcome you want.");
      return;
    }

    setLoading(true);
    setError("");
    setStrategy("");

    try {
      const response = await fetch("/api/case-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation, outcome, stage, jurisdiction, documentsSummary, mode, language })
      });

      if (!response.ok || !response.body) throw new Error("Could not build strategy.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let output = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        output += decoder.decode(value);
        setStrategy(output);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="rounded-2xl border border-[#252528] bg-[#141418] p-5 md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <span className="rounded-full bg-[#4D7EF5] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">New</span>
            <h1 className="mt-2 font-display text-3xl font-semibold">Case Strategist</h1>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-white/55">
          Tell Lexo what happened. It will identify legal issues, cite relevant law where possible, build arguments, prepare a demand letter, and package a brief for a lawyer.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <ResponseModeToggle mode={mode} onChange={setMode} />
          <LanguageModeToggle language={language} onChange={setLanguage} />
        </div>

        <label className="mt-6 block text-sm font-medium text-white/70">What happened?</label>
        <textarea
          value={situation}
          onChange={(event) => setSituation(event.target.value)}
          placeholder="Describe the situation in your own words. Don't worry about legal language — just tell us what happened."
          className="mt-2 min-h-36 w-full rounded-xl border border-[#252528] bg-[#0C0C0E] p-4 text-sm leading-6 outline-none ring-[#4D7EF5]/40 placeholder:text-white/25 focus:ring-4"
        />

        <label className="mt-5 block text-sm font-medium text-white/70">What outcome do you want?</label>
        <textarea
          value={outcome}
          onChange={(event) => setOutcome(event.target.value)}
          placeholder="Get my money back, keep my job, protect my business, stop the other side from doing something..."
          className="mt-2 min-h-24 w-full rounded-xl border border-[#252528] bg-[#0C0C0E] p-4 text-sm leading-6 outline-none ring-[#4D7EF5]/40 placeholder:text-white/25 focus:ring-4"
        />

        <p className="mt-5 text-sm font-medium text-white/70">What stage is this at?</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {stages.map((item) => (
            <button
              key={item}
              className={`rounded-xl border px-3 py-3 text-sm font-medium ${stage === item ? "border-[#4D7EF5] bg-[#4D7EF5]/15 text-white" : "border-[#252528] bg-[#0C0C0E] text-white/55 hover:text-white"}`}
              onClick={() => setStage(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        <label className="mt-5 block text-sm font-medium text-white/70">Location / jurisdiction</label>
        <select
          value={jurisdiction}
          onChange={(event) => setJurisdiction(event.target.value)}
          className="mt-2 w-full rounded-xl border border-[#252528] bg-[#0C0C0E] p-3 text-sm text-white outline-none"
        >
          <option>California</option>
          <option>New York</option>
          <option>Texas</option>
          <option>United Kingdom</option>
          <option>European Union</option>
          <option>Kazakhstan</option>
          <option>Other / unsure</option>
        </select>

        <label className="mt-5 block text-sm font-medium text-white/70">Relevant documents summary</label>
        <textarea
          value={documentsSummary}
          onChange={(event) => setDocumentsSummary(event.target.value)}
          placeholder="Optional: summarize contracts, notices, emails, screenshots, letters, or files you have."
          className="mt-2 min-h-20 w-full rounded-xl border border-[#252528] bg-[#0C0C0E] p-4 text-sm leading-6 outline-none ring-[#4D7EF5]/40 placeholder:text-white/25 focus:ring-4"
        />

        <div className="mt-5 rounded-xl border border-[#252528] bg-[#0C0C0E] p-4">
          <p className="text-sm font-semibold">What Lexo will do</p>
          <div className="mt-3 grid gap-2 text-sm text-white/55">
            {["Read your facts", "Identify legal issues", "Find strongest arguments", "Build a strategic brief", "Prepare lawyer handoff"].map((item) => (
              <p key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />{item}</p>
            ))}
          </div>
        </div>

        {error && <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-100">{error}</p>}

        <Button className="mt-5 w-full" onClick={generate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scale className="h-4 w-4" />}
          {loading ? "Building strategy..." : "Build my strategy"}
        </Button>
      </section>

      <section className="rounded-2xl border border-[#252528] bg-[#141418] p-5 md:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_230px]">
          <div>
            <p className="text-sm text-white/45">Lawyer-ready deliverable</p>
            <h2 className="font-display text-2xl font-semibold">Strategy brief</h2>
            <pre className="mt-5 min-h-[620px] whitespace-pre-wrap rounded-xl border border-[#252528] bg-[#0C0C0E] p-5 text-sm leading-7 text-white/80">
              {strategy || "Your case strategy will stream here: legal framework, strongest arguments, risks, action plan, demand letter, and lawyer questions."}
            </pre>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-[#252528] bg-[#0C0C0E] p-4">
              <p className="text-sm font-semibold">Research progress</p>
              <div className="mt-4 space-y-3">
                {progressSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-2 text-sm">
                    {index < activeStep ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    ) : index === activeStep && loading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-[#8FB0FF]" />
                    ) : (
                      <span className="h-4 w-4 rounded-full border border-white/20" />
                    )}
                    <span className={index <= activeStep ? "text-white/80" : "text-white/35"}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#252528] bg-[#0C0C0E] p-4">
              <p className="mb-3 text-sm font-semibold">Export for your lawyer</p>
              <div className="grid gap-2">
                <Button variant="outline" disabled={!strategy}><Download className="h-4 w-4" />PDF Brief</Button>
                <Button variant="outline" disabled={!strategy}><FileText className="h-4 w-4" />DOCX</Button>
                <Button variant="outline" disabled={!strategy}><Archive className="h-4 w-4" />Copy summary</Button>
              </div>
              <p className="mt-3 text-xs leading-5 text-white/40">
                This can save your lawyer 1-2 hours of intake work.
              </p>
            </div>

            <div className="rounded-xl border border-violet-400/20 bg-violet-400/10 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-violet-100"><Users className="h-4 w-4" />Matched lawyers</p>
              <div className="mt-3 space-y-3">
                {lawyers.map(([name, specialty, proof, price]) => (
                  <div key={name} className="rounded-lg bg-black/20 p-3">
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="mt-1 text-xs text-white/55">{specialty}</p>
                    <p className="mt-1 text-xs text-white/45">{proof}</p>
                    <button className="mt-2 w-full rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#0C0C0E]">
                      Book {price}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
          Professional AI analysis — attorney review recommended before client delivery.
        </div>
      </section>
    </div>
  );
}
