export const FREE_MONTHLY_LIMIT = 50;

export function canAnalyze(plan: string | null | undefined, monthlyUsage: number) {
  if (plan === "firm" || plan === "enterprise" || plan === "pro") return true;
  return monthlyUsage < FREE_MONTHLY_LIMIT;
}
