# Polar subscription setup

Lexo uses Polar as Merchant of Record for subscriptions. Stripe remains in the
codebase only for lawyer marketplace bookings.

## Sandbox setup

1. Create a seller organization at `https://sandbox.polar.sh`.
2. Create recurring products matching the existing Lexo prices:
   - Solo: $49/month and optionally $468/year ($39/month billed annually).
   - Firm: $149/month and optionally $1,428/year ($119/month billed annually).
3. Create an organization access token.
4. Register this webhook:
   - Production URL: `https://lexo-ai-kz.vercel.app/api/webhooks/polar`
   - Local forwarding target: `http://localhost:3000/api/webhooks/polar`
5. Subscribe it to:
   - `subscription.active`
   - `subscription.updated`
   - `subscription.canceled`
   - `subscription.revoked`
   - `subscription.uncanceled`
   - `order.paid`
6. Add the variables documented in `.env.example` locally and in Vercel.
7. Run the updated `supabase/schema.sql` in the Supabase SQL editor.

If annual products are not configured, keep the annual selector out of
production or add `POLAR_SOLO_ANNUAL_PRODUCT_ID` and
`POLAR_FIRM_ANNUAL_PRODUCT_ID` before accepting annual checkouts.

## Verification

1. Sign in to Lexo.
2. Open `/dashboard/billing`.
3. Start a Solo sandbox checkout.
4. Confirm the browser lands on `/dashboard/billing/success`.
5. Verify `profiles.plan`, `subscription_status`,
   `polar_customer_id`, and `polar_subscription_id` were updated.
6. Open `/api/portal`, cancel at period end, and confirm the webhook updates
   `cancel_at_period_end`.
7. Revoke the subscription and confirm the profile returns to `free`.

Do not switch `POLAR_ENVIRONMENT` to `production` until the merchant review,
live products, live token, and live webhook secret are ready.
