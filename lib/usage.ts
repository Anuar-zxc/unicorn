export const PLAN_LIMITS = {
  free: {
    analyses: 1,
    builds: 1,
    caseStrategies: 0,
    teamMembers: 1
  },
  solo: {
    analyses: 50,
    builds: 50,
    caseStrategies: 2,
    teamMembers: 1
  },
  firm: {
    analyses: Infinity,
    builds: Infinity,
    caseStrategies: Infinity,
    teamMembers: 5
  },
  enterprise: {
    analyses: Infinity,
    builds: Infinity,
    caseStrategies: Infinity,
    teamMembers: Infinity
  }
} as const;

export type PlanName = keyof typeof PLAN_LIMITS;
export type UsageFeature = keyof (typeof PLAN_LIMITS)["free"];

export function normalizePlan(plan: string | null | undefined): PlanName {
  if (plan === "solo" || plan === "firm" || plan === "enterprise") return plan;
  // Compatibility with the old internal names.
  if (plan === "pro") return "solo";
  if (plan === "business") return "firm";
  return "free";
}

export function canUseFeature(
  plan: string | null | undefined,
  feature: UsageFeature,
  currentUsage: number
) {
  return currentUsage < PLAN_LIMITS[normalizePlan(plan)][feature];
}

export function featureLimit(
  plan: string | null | undefined,
  feature: UsageFeature
) {
  return PLAN_LIMITS[normalizePlan(plan)][feature];
}
