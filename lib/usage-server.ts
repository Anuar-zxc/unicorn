import {
  canUseFeature,
  currentMonthStartISO,
  featureLimit,
  FEATURE_TOOL_TYPES,
  type UsageFeature
} from "@/lib/usage";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ServerSupabase = Awaited<ReturnType<typeof createSupabaseServerClient>>;

/**
 * Counts this month's usage for a feature.
 *
 * Primary source is the append-only `usage_events` table (users cannot delete
 * rows there, so deleting history no longer resets the quota). If the
 * migration has not been applied yet we fall back to the `analyses` table.
 */
export async function countMonthlyUsage(
  supabase: ServerSupabase,
  userId: string,
  feature: UsageFeature
) {
  const since = currentMonthStartISO();
  const toolTypes = FEATURE_TOOL_TYPES[feature];

  const events = await supabase
    .from("usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .in("tool_type", toolTypes)
    .gte("created_at", since);

  if (!events.error) return events.count ?? 0;

  let legacy = supabase
    .from("analyses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);
  legacy =
    feature === "analyses"
      ? legacy.or(`tool_type.in.(${toolTypes.join(",")}),tool_type.is.null`)
      : legacy.in("tool_type", toolTypes);
  const { count } = await legacy;
  return count ?? 0;
}

export async function getFeatureUsage(feature: UsageFeature) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { plan: "free", used: 0, limit: featureLimit("free", feature), allowed: false };
  const [{ data: profile }, used] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle(),
    countMonthlyUsage(supabase, user.id, feature)
  ]);
  const plan = profile?.plan ?? "free";
  return {
    plan,
    used,
    limit: featureLimit(plan, feature),
    allowed: canUseFeature(plan, feature, used)
  };
}

export async function authorizeFeature(feature: UsageFeature) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, status: 401, message: "AUTH_REQUIRED: Please sign in to use this tool." };
  }

  const [{ data: profile }, used] = await Promise.all([
    supabase.from("profiles").select("plan,ai_language,account_type").eq("id", user.id).maybeSingle(),
    countMonthlyUsage(supabase, user.id, feature)
  ]);

  if (!canUseFeature(profile?.plan, feature, used)) {
    return {
      ok: false as const,
      status: 403,
      message: "PLAN_LIMIT: You have reached this month's limit. Upgrade your plan to continue."
    };
  }

  return { ok: true as const, supabase, user, profile };
}

/** Appends a quota event. Never throws: billing bookkeeping must not break the answer. */
export async function recordUsageEvent(
  supabase: ServerSupabase,
  userId: string,
  toolType: string
) {
  const { error } = await supabase
    .from("usage_events")
    .insert({ user_id: userId, tool_type: toolType });
  if (error && error.code !== "42P01") {
    console.error("usage_events insert failed", error.message);
  }
}

export async function recordToolUsage({
  supabase,
  userId,
  toolType,
  input,
  output,
  title
}: {
  supabase: ServerSupabase;
  userId: string;
  toolType: string;
  input: string;
  output: string;
  title?: string;
}) {
  const [{ error }] = await Promise.all([
    supabase.from("analyses").insert({
      user_id: userId,
      type: toolType,
      tool_type: toolType,
      title: title ?? deriveTitle(input, toolType),
      input_text: input.slice(0, 30_000),
      output_text: output,
      status: "complete"
    }),
    recordUsageEvent(supabase, userId, toolType)
  ]);
  if (error) console.error("analyses insert failed", error.message);
}

/** Human-readable history title from the first meaningful line of the input. */
function deriveTitle(input: string, toolType: string) {
  const firstLine = input
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 3 && !line.startsWith("---"));
  if (!firstLine) return `${toolType} result`;
  return firstLine.length > 90 ? `${firstLine.slice(0, 87)}…` : firstLine;
}
