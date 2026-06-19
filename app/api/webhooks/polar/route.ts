import { Webhooks } from "@polar-sh/nextjs";
import { createClient } from "@supabase/supabase-js";
import { getPlanFromProductId } from "@/lib/polar";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase admin credentials are missing.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

async function syncSubscription(
  subscription: {
    id: string;
    productId: string;
    customerId: string;
    customer: { externalId?: string | null };
    status: string;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
  },
  options?: { revoke?: boolean }
) {
  const userId = subscription.customer.externalId;
  if (!userId) throw new Error(`Polar customer ${subscription.customerId} has no externalId.`);

  const plan = options?.revoke
    ? "free"
    : getPlanFromProductId(subscription.productId);
  if (!options?.revoke && plan === "free") {
    throw new Error(`Unknown Polar product: ${subscription.productId}`);
  }

  const { error } = await getAdminClient()
    .from("profiles")
    .update({
      plan,
      polar_customer_id: subscription.customerId,
      polar_subscription_id: options?.revoke ? null : subscription.id,
      subscription_status: options?.revoke ? "expired" : subscription.status,
      current_period_end: subscription.currentPeriodEnd.toISOString(),
      cancel_at_period_end: options?.revoke
        ? false
        : subscription.cancelAtPeriodEnd
    })
    .eq("id", userId);

  if (error) throw error;
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET ?? "missing-polar-secret",
  onSubscriptionActive: async ({ data }) => {
    await syncSubscription(data);
  },
  onSubscriptionUpdated: async ({ data }) => {
    await syncSubscription(data);
  },
  onSubscriptionCanceled: async ({ data }) => {
    await syncSubscription(data);
  },
  onSubscriptionRevoked: async ({ data }) => {
    await syncSubscription(data, { revoke: true });
  },
  onSubscriptionUncanceled: async ({ data }) => {
    await syncSubscription(data);
  },
  onOrderPaid: async ({ data }) => {
    console.info("Polar order paid", { orderId: data.id, productId: data.productId });
  }
});
