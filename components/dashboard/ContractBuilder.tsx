"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Download, FilePlus, Loader2, RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const examples = [
  "NDA with contractor",
  "Freelance agreement",
  "Co-founder agreement",
  "SaaS terms of service",
  "Employment contract",
  "Partnership agreement"
];

const sections = ["Parties & recitals", "Definitions", "Core obligations", "Governing law", "Signatures", "AI notes"];

export function ContractBuilder() {
  const [description, setDescription] = useState("");
  const [jurisdiction, setJurisdiction] = useState("United States (general)");
  const [clarifications, setClarifications] = useState("");
  const [contract, setContract] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  const progress = useMemo(() => {
    if (!contract) return 0;
    return Math.min(sections.length, Math.max(1, Math.floor(contract.length / 450)));
  }, [contract]);

  async function generate() {
    if (!description.trim()) {
      setError("Describe the contract you need first.");
      return;
    }

    setLoading(true);
    setError("");
    setContract("");

    try {
      const response = await fetch("/api/build-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, jurisdiction, clarifications })
      });

      if (!response.ok || !response.body) throw new Error("Could not generate the contract.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let output = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        output += decoder.decode(value);
        setContract(output);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-2xl border border-[#252528] bg-[#141418] p-5 md:p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
          <FilePlus className="h-6 w-6" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold">Build a contract</h1>
        <p className="mt-3 text-sm leading-6 text-white/55">
          Describe what you need in plain language. Lexo will draft a structured contract with placeholders and lawyer review notes.
        </p>

        <label className="mt-6 block text-sm font-medium text-white/70">What do you need?</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="I need an NDA between my startup and a contractor in Texas. It should cover 2 years, be mutual, and protect our code and client list."
          className="mt-2 min-h-44 w-full rounded-xl border border-[#252528] bg-[#0C0C0E] p-4 text-sm leading-6 outline-none ring-[#4D7EF5]/40 placeholder:text-white/25 focus:ring-4"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {examples.map((item) => (
            <button
              key={item}
              className="rounded-full border border-[#252528] bg-[#0C0C0E] px-3 py-1.5 text-xs font-medium text-white/60 hover:border-[#4D7EF5]/50 hover:text-white"
              onClick={() => setDescription(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        <label className="mt-5 block text-sm font-medium text-white/70">Jurisdiction</label>
        <select
          value={jurisdiction}
          onChange={(event) => setJurisdiction(event.target.value)}
          className="mt-2 w-full rounded-xl border border-[#252528] bg-[#0C0C0E] p-3 text-sm text-white outline-none"
        >
          <option>United States (general)</option>
          <option>California</option>
          <option>New York</option>
          <option>Texas</option>
          <option>United Kingdom</option>
          <option>European Union</option>
          <option>Kazakhstan</option>
        </select>

        <label className="mt-5 block text-sm font-medium text-white/70">Optional clarifications</label>
        <textarea
          value={clarifications}
          onChange={(event) => setClarifications(event.target.value)}
          placeholder="Any special terms, payment amounts, deadlines, renewal rules, or parties?"
          className="mt-2 min-h-24 w-full rounded-xl border border-[#252528] bg-[#0C0C0E] p-4 text-sm leading-6 outline-none ring-[#4D7EF5]/40 placeholder:text-white/25 focus:ring-4"
        />

        {error && <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-100">{error}</p>}

        <Button className="mt-5 w-full" onClick={generate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FilePlus className="h-4 w-4" />}
          {loading ? "Drafting contract..." : "Generate contract"}
        </Button>
      </section>

      <section className="rounded-2xl border border-[#252528] bg-[#141418] p-5 md:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-white/45">Generated document</p>
                <h2 className="font-display text-2xl font-semibold">Contract draft</h2>
              </div>
              <Button variant="outline" onClick={() => setEditing((value) => !value)} disabled={!contract}>
                {editing ? "Preview" : "Edit"}
              </Button>
            </div>

            {editing ? (
              <textarea
                value={contract}
                onChange={(event) => setContract(event.target.value)}
                className="mt-5 min-h-[560px] w-full rounded-xl border border-[#252528] bg-[#0C0C0E] p-5 font-serif text-sm leading-7 text-white/82 outline-none"
              />
            ) : (
              <pre className="mt-5 min-h-[560px] whitespace-pre-wrap rounded-xl border border-[#252528] bg-[#0C0C0E] p-5 font-serif text-sm leading-7 text-white/82">
                {contract || "Your contract will stream here in real time."}
              </pre>
            )}

            <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
              Professional AI draft — attorney review recommended before client delivery.
            </div>
          </div>

          <aside className="rounded-xl border border-[#252528] bg-[#0C0C0E] p-4">
            <p className="text-sm font-semibold">Generation progress</p>
            <div className="mt-4 space-y-3">
              {sections.map((section, index) => (
                <div key={section} className="flex items-center gap-2 text-sm">
                  {index < progress ? (
                    <Check className="h-4 w-4 text-emerald-300" />
                  ) : index === progress && loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#8FB0FF]" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-white/20" />
                  )}
                  <span className={index <= progress ? "text-white/80" : "text-white/35"}>{section}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-2">
              <Button variant="outline" disabled={!contract}>
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" disabled={!contract}>
                <Copy className="h-4 w-4" />
                Download DOCX
              </Button>
              <Button variant="outline" disabled={!contract}>
                <RefreshCw className="h-4 w-4" />
                Analyze draft
              </Button>
              <Button disabled={!contract}>
                <Send className="h-4 w-4" />
                Send to lawyer
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
