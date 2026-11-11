import { redirect } from "next/navigation";

// The old standalone case strategist duplicated Case Prep (English-only,
// placeholder lawyer matches, non-working exports). Case Prep is the
// maintained version of this tool.
export default function CasePage() {
  redirect("/dashboard/caseprep");
}
