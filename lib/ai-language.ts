import type { SupabaseClient } from "@supabase/supabase-js";

export type AILanguage = "en" | "ru";

export function normalizeAILanguage(value: unknown): AILanguage {
  return value === "ru" ? "ru" : "en";
}

export function getLanguageInstruction(language: AILanguage) {
  if (language === "ru") {
    return `OUTPUT LANGUAGE: Respond entirely in Russian. Translate every section heading and explanation into Russian. Use accurate Russian and Kazakhstan legal terminology where applicable. Do not mix English prose into the response. Universal risk markers must be written consistently as HIGH / MEDIUM / LOW, followed by a Russian explanation.`;
  }
  return `OUTPUT LANGUAGE: Respond entirely in English. Every section heading and explanation must be in English. Do not mix Russian prose into the response. Universal risk markers must be written consistently as HIGH / MEDIUM / LOW.`;
}

export function detectLanguageFromText(text: string): AILanguage {
  const cyrillic = (text.match(/[а-яА-ЯёЁ]/g) || []).length;
  const letters = (text.match(/[a-zA-Zа-яА-ЯёЁ]/g) || []).length;
  return letters > 0 && cyrillic / letters > 0.3 ? "ru" : "en";
}

export async function resolveAILanguage(
  supabase: SupabaseClient,
  userId: string,
  requested?: unknown
) {
  if (requested === "ru" || requested === "en") {
    return requested;
  }
  const { data } = await supabase
    .from("profiles")
    .select("ai_language")
    .eq("id", userId)
    .maybeSingle();
  return normalizeAILanguage(data?.ai_language);
}
