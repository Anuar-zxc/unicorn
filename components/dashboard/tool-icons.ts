import {
  BookOpen,
  FileCheck2,
  FileDiff,
  FileText,
  FolderKanban,
  MessageCircleQuestion,
  MessageSquareText,
  PenLine,
  ReceiptText,
  Scale,
  type LucideIcon
} from "lucide-react";

const TOOL_ICONS: Record<string, LucideIcon> = {
  review: FileCheck2,
  analysis: FileCheck2,
  check: FileCheck2,
  ask: MessageCircleQuestion,
  "seller-tax": ReceiptText,
  research: BookOpen,
  draft: PenLine,
  build: PenLine,
  compare: FileDiff,
  client: MessageSquareText,
  case: Scale,
  caseprep: FolderKanban
};

export function toolIconFor(type: string | null | undefined): LucideIcon {
  return TOOL_ICONS[type ?? "review"] ?? FileText;
}
