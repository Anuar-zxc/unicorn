/**
 * Public contact addresses. Set NEXT_PUBLIC_CONTACT_EMAIL / NEXT_PUBLIC_SALES_EMAIL
 * in Vercel to a mailbox you actually own.
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@lexo.ai";
export const SALES_EMAIL = process.env.NEXT_PUBLIC_SALES_EMAIL ?? CONTACT_EMAIL;

/** Facts about the legal knowledge base, shown on the landing page. */
export const KNOWLEDGE_BASE = {
  acts: 7,
  articles: 2338,
  contractTypes: 10
};
