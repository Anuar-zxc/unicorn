"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2 } from "lucide-react";
import {
  analyzeContractAction,
  type AnalyzeState
} from "@/lib/analysis-action";
import { Button } from "@/components/ui/button";

const initialState: AnalyzeState = { ok: false };

export function UploadContractForm({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
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
      <div
        className="grid cursor-pointer place-items-center rounded-xl border border-dashed border-[#3a3a40] bg-[#0C0C0E] p-10 text-center transition hover:border-[#1A56E8]"
        onClick={() => inputRef.current?.click()}
      >
        <FileUp className="h-10 w-10 text-[#1A56E8]" />
        <h2 className="mt-5 font-display text-2xl font-semibold">
          Upload client contract
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-6 text-white/50">
          PDF or DOCX only. Max 10MB. We extract the text, analyze risks, and
          save the report to your history.
        </p>
        <p className="mt-4 text-sm font-medium text-white/75">
          {fileName || "Choose file"}
        </p>
        <input
          ref={inputRef}
          type="file"
          name="contract"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
