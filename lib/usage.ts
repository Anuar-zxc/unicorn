export const PLAN_LIMITS = {
  free: {
    analyses: 1,
    builds: 1,
    caseStrategies: 0,
    questions: 5,
    teamMembers: 1
  },
  solo: {
    analyses: 50,
    builds: 50,
    caseStrategies: 2,
    questions: 200,
    teamMembers: 1
  },
  firm: {
    analyses: 250,
    builds: 250,
    caseStrategies: 25,
    questions: 1000,
    teamMembers: 5
  },
  enterprise: {
    analyses: Infinity,
    builds: Infinity,
    caseStrategies: Infinity,
    questions: Infinity,
    teamMembers: Infinity
  }
} as const;

export type PlanName = keyof typeof PLAN_LIMITS;
export type UsageFeature = keyof (typeof PLAN_LIMITS)["free"];

/**
 * Which recorded tool types count against each monthly quota.
 * Every AI call must record one of these types, otherwise it is free forever.
 */
export const FEATURE_TOOL_TYPES: Record<UsageFeature, string[]> = {
  analyses: ["review", "analysis", "check"],
  builds: ["draft", "compare", "research", "client", "build"],
  caseStrategies: ["case", "caseprep"],
  questions: ["ask", "seller-tax"],
  teamMembers: ["team-member"]
};

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

/** First day of the current month, 00:00 UTC — same boundary everywhere. */
export function currentMonthStartISO(now = new Date()) {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  ).toISOString();
}
