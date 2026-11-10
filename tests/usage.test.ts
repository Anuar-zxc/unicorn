import { test } from "node:test";
import assert from "node:assert/strict";
import { canUseFeature, currentMonthStartISO, FEATURE_TOOL_TYPES, normalizePlan, PLAN_LIMITS } from "../lib/usage.ts";

test("free plan matches the pricing page", () => {
  assert.equal(PLAN_LIMITS.free.analyses, 1);
  assert.equal(PLAN_LIMITS.free.builds, 1);
  assert.equal(PLAN_LIMITS.free.questions, 5);
});

test("every metered tool type belongs to exactly one quota", () => {
  const seen = new Map<string, string>();
  for (const [feature, types] of Object.entries(FEATURE_TOOL_TYPES)) {
    for (const type of types) {
      assert.ok(!seen.has(type), `${type} is counted twice (${seen.get(type)} and ${feature})`);
      seen.set(type, feature);
    }
  }
  for (const type of ["ask", "seller-tax", "review", "draft", "build", "research", "compare", "client", "case", "caseprep"]) {
    assert.ok(seen.has(type), `${type} is not metered`);
  }
});

test("limits and legacy plan names", () => {
  assert.equal(canUseFeature("free", "questions", 4), true);
  assert.equal(canUseFeature("free", "questions", 5), false);
  assert.equal(canUseFeature("enterprise", "analyses", 10_000), true);
  assert.equal(normalizePlan("pro"), "solo");
  assert.equal(normalizePlan("business"), "firm");
  assert.equal(normalizePlan("hacker"), "free");
});

test("month boundary is UTC midnight on the 1st", () => {
  assert.equal(currentMonthStartISO(new Date("2026-11-30T23:30:00+05:00")), "2026-11-01T00:00:00.000Z");
});
