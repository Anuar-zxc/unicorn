"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/providers/AppProviders";
import { itemTitle, TOOL_LABELS } from "@/components/dashboard/HistoryList";

export function HistoryItemHeader({
  fileName,
  title,
  toolType,
  createdAt
}: {
  fileName: string | null;
  title: string | null;
  toolType: string | null;
  createdAt: string;
}) {
  const { locale } = useLanguage();
  const ru = locale === "ru";
  return (
    <div className="no-print mb-6">
      <Link href="/dashboard/history" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {ru ? "Все документы" : "All documents"}
      </Link>
      <p className="mt-4 text-sm text-[var(--text-muted)]">
        {TOOL_LABELS[toolType ?? "review"]?.[ru ? "ru" : "en"] ?? toolType} ·{" "}
        {new Date(createdAt).toLocaleString(ru ? "ru-RU" : "en-US", { dateStyle: "long", timeStyle: "short" })}
      </p>
      <h1 className="mt-1 break-words font-display text-3xl font-bold">
        {itemTitle({ file_name: fileName, title, tool_type: toolType }, ru)}
      </h1>
    </div>
  );
}
