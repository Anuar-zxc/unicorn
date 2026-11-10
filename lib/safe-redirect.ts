/**
 * Returns a same-origin relative path or the fallback.
 * Blocks protocol-relative ("//evil.com") and backslash ("/\\evil.com")
 * redirects, which browsers resolve to another origin.
 */
export function safeRedirectPath(
  value: string | null | undefined,
  fallback = "/dashboard"
) {
  if (!value || typeof value !== "string") return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.includes("\\")) return fallback;
  if (/[\u0000-\u001f]/.test(value)) return fallback;
  return value;
}
