import { canUseFeature, featureLimit } from "@/lib/usage";

export function canAnalyze(plan: string | null | undefined, monthlyUsage: number) {
  return canUseFeature(plan, "analyses", monthlyUsage);
}

export function monthlyAnalysisLimit(plan: string | null | undefined) {
  return featureLimit(plan, "analyses");
}
