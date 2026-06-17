export const FREE_MONTHLY_LIMIT = 1;

export function canAnalyze(plan: string | null | undefined, monthlyUsage: number) {
  if (plan === "pro") return true;
  return monthlyUsage < FREE_MONTHLY_LIMIT;
}
