import { test } from "node:test";
import assert from "node:assert/strict";
import { safeRedirectPath } from "../lib/safe-redirect.ts";

test("keeps same-origin paths", () => {
  assert.equal(safeRedirectPath("/dashboard/review"), "/dashboard/review");
  assert.equal(safeRedirectPath("/api/checkout?plan=solo&billing=monthly"), "/api/checkout?plan=solo&billing=monthly");
});

test("blocks open redirects", () => {
  for (const value of ["//evil.com", "/\\evil.com", "https://evil.com", "evil.com", "/\u0000x", "", null, undefined]) {
    assert.equal(safeRedirectPath(value as string), "/dashboard", String(value));
  }
});
