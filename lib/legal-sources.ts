export const TRUSTED_LEGAL_SOURCES = {
  kazakhstan: [
    "adilet.zan.kz",
    "kgd.gov.kz",
    "sud.gov.kz",
    "zakon.kz",
    "paragraph.kz"
  ],
  usa: ["law.cornell.edu", "justia.com", "courtlistener.com"],
  eu: ["eur-lex.europa.eu"],
  uk: ["legislation.gov.uk"]
} as const;

export type TrustedSearchResult = {
  title: string;
  url: string;
  content: string;
};

export function getSourcesForJurisdiction(jurisdiction: string): readonly string[] {
  const key = jurisdiction.toLowerCase();
  if (
    key.includes("kazakh") ||
    key.includes("қазақстан") ||
    key.includes("казахстан") ||
    key.includes("kz")
  ) {
    return TRUSTED_LEGAL_SOURCES.kazakhstan;
  }
  if (key.includes("eu") || key.includes("europe")) {
    return TRUSTED_LEGAL_SOURCES.eu;
  }
  if (key.includes("uk") || key.includes("britain")) {
    return TRUSTED_LEGAL_SOURCES.uk;
  }
  return TRUSTED_LEGAL_SOURCES.usa;
}

export async function searchTrustedLegalSources(
  query: string,
  jurisdiction: string
): Promise<TrustedSearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];

  let response: Response;
  try {
    response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        include_domains: getSourcesForJurisdiction(jurisdiction),
        max_results: 5,
        search_depth: "advanced"
      }),
      signal: AbortSignal.timeout(12_000)
    });
  } catch {
    return [];
  }

  if (!response.ok) return [];
  const data = (await response.json()) as {
    results?: Array<{ title?: string; url?: string; content?: string }>;
  };

  return (data.results ?? [])
    .filter((result) => result.url && result.content)
    .map((result) => ({
      title: result.title || result.url || "Legal source",
      url: result.url || "",
      content: result.content || ""
    }));
}

export function formatTrustedSources(results: TrustedSearchResult[]) {
  if (!results.length) return "";
  return `RETRIEVED TRUSTED SOURCES:
${results
  .map(
    (result, index) =>
      `[${index + 1}] ${result.title}\nURL: ${result.url}\n${result.content}`
  )
  .join("\n\n---\n\n")}

Use bracket citations and include a final "Sources" section with the actual URLs. If the sources do not support a claim, say that it could not be verified.`;
}

export async function getTrustedLegalContext(
  query: string,
  jurisdiction: string
) {
  const webResults = await searchTrustedLegalSources(query, jurisdiction);
  if (webResults.length) return formatTrustedSources(webResults);

  const domains = getSourcesForJurisdiction(jurisdiction);
  if (!domains.includes("adilet.zan.kz")) return "";

  try {
    const localResults = await retrieveKzLaw(`${query} ${jurisdiction}`, 5);
    return formatTrustedSources(
      localResults.map((result) => ({
        title: `${result.title} — ${result.article}`,
        url: result.url,
        content: result.text
      }))
    );
  } catch {
    return "";
  }
}
import { retrieveKzLaw } from "@/lib/kz-rag";
