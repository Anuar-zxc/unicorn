"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileImage, FileText, FileUp, Loader2 } from "lucide-react";
import {
  analyzeContractAction,
  type AnalyzeState
} from "@/lib/analysis-action";
import { Button } from "@/components/ui/button";
import { ResponseModeToggle } from "@/components/shared/ResponseModeToggle";
import type { ResponseMode } from "@/lib/ai-prompts";

const initialState: AnalyzeState = { ok: false };

export function UploadContractForm({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [mode, setMode] = useState<ResponseMode>("concise");
  const [state, formAction, pending] = useActionState(
    analyzeContractAction,
    initialState
  );

  useEffect(() => {
    if (state.ok && state.analysisId) {
      router.push(`/dashboard/history/${state.analysisId}`);
    }
  }, [router, state]);

  return (
    <form action={formAction} className="rounded-xl border border-[#252528] bg-[#141418] p-5 md:p-8">
      <input type="hidden" name="mode" value={mode} />
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-white/70">Response style</p>
        <ResponseModeToggle mode={mode} onChange={setMode} />
      </div>
      <div
        className="grid cursor-pointer place-items-center rounded-xl border border-dashed border-[#3a3a40] bg-[#0C0C0E] p-10 text-center transition hover:border-[#1A56E8]"
        onClick={() => inputRef.current?.click()}
      >
        <FileUp className="h-10 w-10 text-[#1A56E8]" strokeWidth={2.6} />
        <h2 className="mt-5 font-display text-2xl font-semibold">
          Upload contract, scan, or legal photo
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-6 text-white/50">
          PDF, DOCX, JPG, PNG, WEBP, HEIC. Max 10MB. Lexo extracts the text,
          reads scans with vision, highlights risks, and saves the report.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs font-semibold text-white/55">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
            <FileText className="h-3.5 w-3.5" /> PDF/DOCX
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
            <FileImage className="h-3.5 w-3.5" /> Photos & scans
          </span>
        </div>
        <p className="mt-4 text-sm font-medium text-white/75">
          {fileName || "Choose file"}
        </p>
        <input
          ref={inputRef}
          type="file"
          name="contract"
          accept=".pdf,.docx,.jpg,.jpeg,.png,.webp,.heic,.heif,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp,image/heic,image/heif"
          className="hidden"
          disabled={disabled || pending}
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
        />
      </div>

      {state.error && (
        <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">
          {state.error}
        </p>
      )}

      <Button className="mt-5 w-full" disabled={disabled || pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing contract...
          </>
        ) : (
          "Review client contract"
        )}
      </Button>
    </form>
  );
}
