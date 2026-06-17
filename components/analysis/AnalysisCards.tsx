"use client";

import Link from "next/link";
import { Copy, Download, FilePlus, Scale, Send } from "lucide-react";
import type { AnalysisResult } from "@/lib/analysis-action";
import { Button } from "@/components/ui/button";

const riskTone = {
  High: "border-red-400/25 bg-red-400/10 text-red-100",
  Medium: "border-amber-400/25 bg-amber-400/10 text-amber-100",
  Low: "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
};

export function AnalysisCards({ result }: { result: AnalysisResult }) {
  const overallRisk =
    result.overallRisk ??
    (result.risks.some((risk) => risk.level === "High") ? "High" : result.risks.some((risk) => risk.level === "Medium") ? "Medium" : "Low");

  const negotiationRisks = result.risks.filter((risk) => risk.level !== "Low");

  return (
    <div className="space-y-5 pb-24">
      <section className="rounded-2xl border border-[#252528] bg-[#141418] p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm text-white/42">Executive Summary</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">Plain-English contract overview</h2>
          </div>
          <span className={`w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${riskTone[overallRisk]}`}>
            {overallRisk} Risk
          </span>
        </div>
        <p className="mt-5 text-lg leading-8 text-white/82">{result.summary}</p>
        <div className="mt-5 rounded-xl border border-[#252528] bg-[#0C0C0E] p-4 text-sm text-white/62">
          <span className="font-semibold text-white/85">Jurisdiction detected:</span>{" "}
          {result.jurisdiction ?? "Not detected. Confirm the governing law clause with a lawyer."}
        </div>
      </section>

      <section className="rounded-2xl border border-[#252528] bg-[#141418] p-5 md:p-6">
        <p className="text-sm text-white/42">Risk Breakdown</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Clauses that deserve attention</h2>
        <div className="mt-5 overflow-hidden rounded-xl border border-[#252528]">
          <div className="hidden grid-cols-[1fr_1.4fr_130px_1.4fr] gap-4 border-b border-[#252528] bg-[#0C0C0E] px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/40 md:grid">
            <span>Clause</span>
            <span>What it means</span>
            <span>Risk</span>
            <span>Our suggestion</span>
          </div>
          {result.risks.map((risk) => (
            <details key={risk.title} className="group border-b border-[#252528] last:border-0">
              <summary className="grid cursor-pointer gap-3 px-4 py-4 text-sm hover:bg-white/[0.03] md:grid-cols-[1fr_1.4fr_130px_1.4fr]">
                <span className="font-semibold">{risk.title}</span>
                <span className="text-white/62">{risk.explanation}</span>
                <span>
                  <span className={`rounded-full border px-2 py-1 text-xs font-bold ${riskTone[risk.level]}`}>{risk.level}</span>
                </span>
                <span className="text-white/62">{risk.recommendation}</span>
              </summary>
              <div className="border-t border-[#252528] bg-[#0C0C0E] px-4 py-4">
                <p className="text-xs font-bold uppercase tracking-wide text-white/35">Full clause text</p>
                <p className="mt-2 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm leading-6 text-red-100">
                  {risk.clauseText ?? "Clause text was not extracted. Re-run analysis with a clearer document scan."}
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#252528] bg-[#141418] p-5 md:p-6">
        <p className="text-sm text-white/42">Negotiation Playbook</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Counter-language you can propose</h2>
        <div className="mt-5 grid gap-4">
          {negotiationRisks.map((risk) => (
            <article key={risk.title} className="rounded-xl border border-[#252528] bg-[#0C0C0E] p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h3 className="font-display text-xl font-semibold">{risk.title}</h3>
                <span className={`w-fit rounded-full border px-2 py-1 text-xs font-bold ${riskTone[risk.level]}`}>{risk.level}</span>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-red-200/70">Current language</p>
                  <p className="mt-2 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm leading-6 text-red-100">
                    {risk.clauseText ?? risk.explanation}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-200/70">Suggested replacement</p>
                  <div className="mt-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm leading-6 text-emerald-100">
                    <p>{risk.replacementLanguage ?? risk.recommendation}</p>
                    <button className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-200 hover:text-white">
                      <Copy className="h-3 w-3" />
                      Copy language
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#252528] bg-[#141418] p-5 md:p-6">
        <p className="text-sm text-white/42">Questions to Ask Your Lawyer</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Smart questions that save billable time</h2>
        <ul className="mt-4 grid gap-3 text-sm leading-6 text-white/72 md:grid-cols-2">
          {result.lawyerQuestions.map((question) => (
            <li key={question} className="rounded-xl border border-[#252528] bg-[#0C0C0E] p-4">
              {question}
            </li>
          ))}
        </ul>
      </section>

      <p className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
        {result.disclaimer}
      </p>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#252528] bg-[#0C0C0E]/90 px-4 py-3 backdrop-blur-xl lg:left-60">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-2">
          <Button variant="outline"><Download className="h-4 w-4" />Download PDF report</Button>
          <Link href="/dashboard/build"><Button variant="outline"><FilePlus className="h-4 w-4" />Build counter-proposal</Button></Link>
          <Link href="/dashboard/lawyers"><Button variant="outline"><Scale className="h-4 w-4" />Find a Lawyer</Button></Link>
          <Button><Send className="h-4 w-4" />Export for my lawyer</Button>
        </div>
      </div>
    </div>
  );
}
