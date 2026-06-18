"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, FileSearch, Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const practiceAreas = ["Corporate", "Litigation", "Employment", "IP", "Real Estate", "Criminal", "Other"];
const timeSinks = ["Contract review", "Legal research", "Document drafting", "Client communication"];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [step, setStep] = useState(1);
  const [areas, setAreas] = useState<string[]>([]);
  const [jurisdiction, setJurisdiction] = useState("");
  const [firmSize, setFirmSize] = useState("Solo");
  const [timeSink, setTimeSink] = useState("");
  const [saving, setSaving] = useState(false);

  function toggleArea(area: string) { setAreas((current) => current.includes(area) ? current.filter((item) => item !== area) : [...current, area]); }
  async function finish() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from("profiles").update({ practice_areas: areas, jurisdiction, firm_size: firmSize, biggest_time_sink: timeSink, onboarding_completed: true }).eq("id", user.id);
    router.push("/dashboard/review");
    router.refresh();
  }

  return (
    <main className="grid min-h-[calc(100vh-64px)] place-items-center p-4 md:p-8">
      <section className="w-full max-w-2xl rounded-2xl border border-[#252b36] bg-[#131720] p-6 md:p-9">
        <div className="flex gap-2">{[1,2,3].map((item) => <span key={item} className={cn("h-1.5 flex-1 rounded-full bg-white/10", item <= step && "bg-[#4d7ef5]")} />)}</div>
        {step === 1 && <>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[.16em] text-[#8fb0ff]">Step 1 of 3</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Welcome to Lexo. Let’s set up your workspace.</h1>
          <p className="mt-6 text-sm font-medium text-white/70">Practice areas</p>
          <div className="mt-3 flex flex-wrap gap-2">{practiceAreas.map((area) => <button key={area} onClick={() => toggleArea(area)} className={cn("rounded-full border border-[#303744] px-4 py-2 text-sm text-white/55", areas.includes(area) && "border-[#4d7ef5] bg-[#4d7ef5]/15 text-white")}>{area}</button>)}</div>
          <label className="mt-6 block text-sm font-medium text-white/70">Primary jurisdiction</label>
          <input value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} placeholder="State, country, or court system" className="mt-2 h-11 w-full rounded-xl border border-[#252b36] bg-[#0b0e14] px-4 text-sm outline-none focus:border-[#4d7ef5]" />
          <label className="mt-5 block text-sm font-medium text-white/70">Firm size</label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">{["Solo", "2-5", "6-20", "20+"].map((size) => <button key={size} onClick={() => setFirmSize(size)} className={cn("rounded-xl border border-[#303744] p-3 text-sm text-white/55", firmSize === size && "border-[#4d7ef5] bg-[#4d7ef5]/15 text-white")}>{size}</button>)}</div>
          <Button className="mt-7 w-full" onClick={() => setStep(2)} disabled={!areas.length || !jurisdiction}>Continue</Button>
        </>}
        {step === 2 && <>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[.16em] text-[#8fb0ff]">Step 2 of 3</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">What’s your biggest time sink?</h1>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">{timeSinks.map((item) => <button key={item} onClick={() => setTimeSink(item)} className={cn("flex items-center justify-between rounded-xl border border-[#303744] bg-[#0b0e14] p-4 text-left text-sm font-medium text-white/60", timeSink === item && "border-[#4d7ef5] text-white")}><span>{item}</span>{timeSink === item && <Check className="h-4 w-4 text-[#8fb0ff]" />}</button>)}</div>
          <Button className="mt-7 w-full" onClick={() => setStep(3)} disabled={!timeSink}>Continue</Button>
        </>}
        {step === 3 && <>
          <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#4d7ef5]/15 text-[#8fb0ff]"><FileSearch className="h-6 w-6" /></div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[.16em] text-[#8fb0ff]">Step 3 of 3</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Try it now — review a contract.</h1>
          <p className="mt-4 text-sm leading-6 text-white/50">Your workspace is ready. Upload a client contract or begin with a sample agreement to see Lexo’s attorney-grade analysis.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2"><Button onClick={finish} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Upload a contract</Button><Button variant="outline" onClick={finish} disabled={saving}>Use sample contract</Button></div>
        </>}
      </section>
    </main>
  );
}
