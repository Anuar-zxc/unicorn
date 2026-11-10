export const GEMINI_MODEL =
  process.env.GEMINI_MODEL ?? "gemini-flash-lite-latest";

/** Optional second model used when the primary one is overloaded (429/5xx). */
const GEMINI_FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL ?? "";

const REQUEST_TIMEOUT_MS = 55_000;

type GeminiInlineDocument = {
  mimeType: string;
  dataUrl: string;
};

export class GeminiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "GeminiError";
  }
}

function dataUrlToInlineData(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image data.");
  return {
    mimeType: match[1],
    data: match[2]
  };
}

function extractGeminiText(data: unknown, trim = true): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const response = data as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  const text = response.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("");
  return trim ? text?.trim() : text;
}

function isRetryable(status: number) {
  return status === 429 || status === 500 || status === 503 || status === 504;
}

async function callModel(
  model: string,
  apiKey: string,
  body: string
): Promise<string | undefined> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      // Key goes in a header so it never appears in URLs, logs or error traces.
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    }
  );

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new GeminiError(`Gemini API error ${response.status}: ${detail}`, response.status);
  }

  return extractGeminiText(await response.json());
}

export async function completeGemini({
  system,
  prompt,
  inlineDocument,
  inlineDocuments,
  maxTokens = 3000,
  json = false
}: {
  system: string;
  prompt: string;
  inlineDocument?: GeminiInlineDocument;
  inlineDocuments?: GeminiInlineDocument[];
  maxTokens?: number;
  json?: boolean;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const documents = [
    ...(inlineDocument ? [inlineDocument] : []),
    ...(inlineDocuments ?? [])
  ];

  const parts: Array<
    | { text: string }
    | { inlineData: { mimeType: string; data: string } }
  > = [
    { text: prompt },
    ...documents.map((document) => ({
      inlineData: dataUrlToInlineData(document.dataUrl)
    }))
  ];

  const body = JSON.stringify({
    systemInstruction: {
      parts: [{ text: system }]
    },
    contents: [
      {
        role: "user",
        parts
      }
    ],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.2,
      ...(json ? { responseMimeType: "application/json" } : {})
    }
  });

  // One retry on the primary model, then the optional fallback model.
  const attempts = [GEMINI_MODEL, GEMINI_MODEL, GEMINI_FALLBACK_MODEL].filter(Boolean);
  let lastError: unknown;
  for (let index = 0; index < attempts.length; index += 1) {
    try {
      return await callModel(attempts[index], apiKey, body);
    } catch (error) {
      lastError = error;
      const retryable =
        error instanceof GeminiError
          ? isRetryable(error.status)
          : error instanceof Error && error.name === "TimeoutError"
            ? false
            : true;
      if (!retryable || index === attempts.length - 1) break;
      await new Promise((resolve) => setTimeout(resolve, 800 * (index + 1)));
    }
  }
  throw lastError;
}

/**
 * Streams Gemini output as plain text chunks (server-sent events under the hood).
 * Retries/fallback only happen before the first chunk is produced, so the
 * user never sees duplicated text.
 */
export async function* streamGemini({
  system,
  prompt,
  inlineDocuments = [],
  maxTokens = 3000
}: {
  system: string;
  prompt: string;
  inlineDocuments?: GeminiInlineDocument[];
  maxTokens?: number;
}): AsyncGenerator<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return;

  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          ...inlineDocuments.map((document) => ({
            inlineData: dataUrlToInlineData(document.dataUrl)
          }))
        ]
      }
    ],
    generationConfig: { maxOutputTokens: maxTokens, temperature: 0.2 }
  });

  const attempts = [GEMINI_MODEL, GEMINI_MODEL, GEMINI_FALLBACK_MODEL].filter(Boolean);
  let response: Response | undefined;
  let lastError: unknown;
  for (let index = 0; index < attempts.length; index += 1) {
    try {
      const candidate = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${attempts[index]}:streamGenerateContent?alt=sse`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body,
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
        }
      );
      if (candidate.ok && candidate.body) {
        response = candidate;
        break;
      }
      const detail = (await candidate.text()).slice(0, 500);
      lastError = new GeminiError(`Gemini API error ${candidate.status}: ${detail}`, candidate.status);
      if (!isRetryable(candidate.status)) break;
    } catch (error) {
      lastError = error;
    }
    if (index < attempts.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 800 * (index + 1)));
    }
  }
  if (!response?.body) throw lastError ?? new Error("Gemini stream unavailable.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split(/\r?\n\r?\n/);
    buffer = events.pop() ?? "";
    for (const event of events) {
      for (const line of event.split(/\r?\n/)) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          // Do not trim: whitespace between streamed chunks is meaningful.
          const text = extractGeminiText(JSON.parse(payload), false);
          if (text) yield text;
        } catch {
          // Ignore keep-alive or partial frames.
        }
      }
    }
  }
}
