"use client";

import { useRef, useState } from "react";
import {
  BookOpen,
  Check,
  Copy,
  Download,
  FileDiff,
  FileText,
  FileUp,
  FolderKanban,
  Loader2,
  MessageSquareText,
  Play,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpgradePrompt } from "@/components/shared/UpgradePrompt";

const toolIcons = {
  research: BookOpen,
  draft: FileText,
  caseprep: FolderKanban,
  compare: FileDiff,
  client: MessageSquareText
} as const;

type Props = {
  title: string;
  eyebrow: string;
  description: string;
  endpoint: string;
  icon: keyof typeof toolIcons;
  inputLabel: string;
  inputPlaceholder: string;
  outputLabel: string;
  contextLabel?: string;
  contextPlaceholder?: string;
  secondaryLabel?: string;
  secondaryPlaceholder?: string;
  upload?: "single" | "double";
  samples?: string[];
};

export function ToolWorkspace(props: Props) {
  const [input, setInput] = useState("");
  const [secondaryInput, setSecondaryInput] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  async function run() {
    if (!input.trim() && files.length === 0) return setError("Add source material before running the tool.");
    if (props.upload === "double" && files.length < 2 && !secondaryInput.trim()) return setError("Add both contract versions to compare.");
    setLoading(true); setError(""); setLimitReached(false); setOutput("");
    try {
      let body: BodyInit;
      let headers: HeadersInit | undefined;
      if (files.length) {
        const data = new FormData();
        data.set("input", input);
        data.set("context", context);
        files.forEach((file) => data.append("files", file));
        body = data;
      } else {
        headers = { "Content-Type": "application/json" };
        body = JSON.stringify({ input, secondaryInput, context });
      }
      const response = await fetch(props.endpoint, { method: "POST", headers, body });
      if (!response.ok || !response.body) {
        const message = await response.text();
        if (response.status === 403 && message.includes("PLAN_LIMIT")) {
          setLimitReached(true);
          throw new Error("Your current plan limit has been reached.");
        }
        throw new Error(message || "The tool could not complete this request.");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setOutput(result);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally { setLoading(false); }
  }

  const Icon = toolIcons[props.icon];
  return (
    <main className="p-4 md:p-6">
      <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <section className="rounded-2xl border border-[#252b36] bg-[#131720] p-5 md:p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#4d7ef5]/20 bg-[#4d7ef5]/10 text-[#8fb0ff]"><Icon className="h-5 w-5" /></div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[.16em] text-[#8fb0ff]">{props.eyebrow}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">{props.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">{props.description}</p>

          {props.upload && <div className="mt-6"><input ref={fileRef} type="file" multiple={props.upload === "double"} accept=".pdf,.docx,.jpg,.jpeg,.png,.webp,.heic,.heif,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp,image/heic,image/heif" className="hidden" onChange={(event) => setFiles(Array.from(event.target.files ?? []).slice(0, props.upload === "double" ? 2 : 1))} /><button type="button" onClick={() => fileRef.current?.click()} className="flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-[#394150] bg-[#0b0e14] p-6 text-sm text-white/55 hover:border-[#4d7ef5] hover:text-white"><FileUp className="h-5 w-5 text-[#8fb0ff]" />{files.length ? files.map((file) => file.name).join(" · ") : props.upload === "double" ? "Upload two PDF, DOCX, or image versions" : "Upload PDF, DOCX, or image"}</button></div>}

          <label className="mt-6 block text-sm font-medium text-white/72">{props.inputLabel}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={props.inputPlaceholder} className="mt-2 min-h-40 w-full rounded-xl border border-[#252b36] bg-[#0b0e14] p-4 text-sm leading-6 outline-none placeholder:text-white/22 focus:border-[#4d7ef5]" />

          {props.secondaryLabel && <><label className="mt-5 block text-sm font-medium text-white/72">{props.secondaryLabel}</label><textarea value={secondaryInput} onChange={(e) => setSecondaryInput(e.target.value)} placeholder={props.secondaryPlaceholder} className="mt-2 min-h-32 w-full rounded-xl border border-[#252b36] bg-[#0b0e14] p-4 text-sm leading-6 outline-none placeholder:text-white/22 focus:border-[#4d7ef5]" /></>}
          {props.contextLabel && <><label className="mt-5 block text-sm font-medium text-white/72">{props.contextLabel}</label><input value={context} onChange={(e) => setContext(e.target.value)} placeholder={props.contextPlaceholder} className="mt-2 h-11 w-full rounded-xl border border-[#252b36] bg-[#0b0e14] px-4 text-sm outline-none placeholder:text-white/22 focus:border-[#4d7ef5]" /></>}
          {props.samples && <div className="mt-4 flex flex-wrap gap-2">{props.samples.map((sample) => <button key={sample} type="button" onClick={() => setInput(sample)} className="rounded-full border border-[#303744] px-3 py-1.5 text-xs text-white/48 hover:border-[#4d7ef5] hover:text-white">{sample}</button>)}</div>}
          {error && <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
          {limitReached && <UpgradePrompt feature={props.title.toLowerCase()} />}
          <Button className="mt-5 w-full" onClick={run} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}{loading ? "Lexo is working…" : `Run ${props.title}`}</Button>
        </section>

        <section className="rounded-2xl border border-[#252b36] bg-[#131720] p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-white/32">Attorney-ready deliverable</p><h2 className="mt-2 font-display text-2xl font-semibold">{props.outputLabel}</h2></div><div className="flex gap-2"><Button size="sm" variant="outline" disabled={!output} onClick={() => navigator.clipboard.writeText(output)}><Copy className="h-4 w-4" />Copy</Button><Button size="sm" variant="outline" disabled={!output}><Download className="h-4 w-4" />Export</Button></div></div>
          <div className="mt-5 min-h-[560px] rounded-xl border border-[#252b36] bg-[#0b0e14] p-5">
            {output ? <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-white/78">{output}</pre> : <div className="grid min-h-[510px] place-items-center text-center"><div><Icon className="mx-auto h-8 w-8 text-white/18" /><p className="mt-4 text-sm font-medium text-white/45">Your {props.outputLabel.toLowerCase()} will stream here.</p><p className="mt-2 text-xs text-white/28">Review, edit, and export before client delivery.</p></div></div>}
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-400/15 bg-amber-400/[.06] p-4 text-xs leading-5 text-amber-100/70"><Check className="mt-0.5 h-4 w-4 shrink-0" />AI-assisted analysis — attorney review recommended before client delivery.</div>
          {output && <button onClick={() => { setOutput(""); setError(""); }} className="mt-4 flex items-center gap-2 text-xs text-white/40 hover:text-white"><RotateCcw className="h-3.5 w-3.5" />Start a new matter</button>}
        </section>
      </div>
    </main>
  );
}
