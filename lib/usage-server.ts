import { canUseFeature, type UsageFeature } from "@/lib/usage";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const FEATURE_TOOL_TYPES: Record<UsageFeature, string[]> = {
  analyses: ["review", "analysis"],
  builds: ["draft", "compare", "research", "client", "build"],
  caseStrategies: ["case", "caseprep"],
  teamMembers: ["team-member"]
};

export async function authorizeFeature(feature: UsageFeature) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, status: 401, message: "Please sign in to use this tool." };
  }

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [{ data: profile }, { count }] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle(),
    supabase
      .from("analyses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .in("tool_type", FEATURE_TOOL_TYPES[feature])
      .gte("created_at", monthStart.toISOString())
  ]);

  if (!canUseFeature(profile?.plan, feature, count ?? 0)) {
    return {
      ok: false as const,
      status: 403,
      message: "PLAN_LIMIT: You have reached this month's limit. Upgrade your plan to continue."
    };
  }

  return { ok: true as const, supabase, user };
}

export async function recordToolUsage({
  supabase,
  userId,
  toolType,
  input,
  output
}: {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  userId: string;
  toolType: string;
  input: string;
  output: string;
}) {
  const { error } = await supabase.from("analyses").insert({
    user_id: userId,
    type: toolType,
    tool_type: toolType,
    title: `${toolType} result`,
    input_text: input.slice(0, 30_000),
    output_text: output,
    status: "complete"
  });
  if (error) throw error;
}
