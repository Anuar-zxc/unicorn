"use client";

import { useRef, useState } from "react";
import { Check, Copy, FileDown, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/shared/Markdown";
import { useLanguage } from "@/components/providers/AppProviders";
import { copyToClipboard, downloadMarkdown, downloadWord } from "@/lib/export";

/** Renders a saved AI answer (markdown) from history with copy/export actions. */
export function SavedOutput({ title, output }: { title: string; output: string }) {
  const { locale } = useLanguage();
  const ru = locale === "ru";
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  return (
    <section className="print-area rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
      <div className="no-print flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={async () => {
            if (await copyToClipboard(output)) {
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            }
          }}
        >
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? (ru ? "Скопировано" : "Copied") : ru ? "Копировать" : "Copy"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => downloadWord(title, ref.current?.innerHTML ?? "")}>
          <FileDown className="h-4 w-4" aria-hidden />Word
        </Button>
        <Button size="sm" variant="outline" onClick={() => downloadMarkdown(title, output)}>
          <FileDown className="h-4 w-4" aria-hidden />Markdown
        </Button>
        <Button size="sm" variant="outline" onClick={() => window.print()}>
          <Printer className="h-4 w-4" aria-hidden />{ru ? "Печать / PDF" : "Print / PDF"}
        </Button>
      </div>
      <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--bg-page)] p-5 md:p-6">
        <Markdown ref={ref}>{output}</Markdown>
      </div>
    </section>
  );
}
