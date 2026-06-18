export const GEMINI_MODEL =
  process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite";

type GeminiInlineDocument = {
  mimeType: string;
  dataUrl: string;
};

function dataUrlToInlineData(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image data.");
  return {
    mimeType: match[1],
    data: match[2]
  };
}

function extractGeminiText(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const response = data as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  return response.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();
}

export async function completeGemini({
  system,
  prompt,
  inlineDocument,
  maxTokens = 3000,
  json = false
}: {
  system: string;
  prompt: string;
  inlineDocument?: GeminiInlineDocument;
  maxTokens?: number;
  json?: boolean;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const parts: Array<
    | { text: string }
    | { inlineData: { mimeType: string; data: string } }
  > = [{ text: prompt }];

  if (inlineDocument) {
    parts.push({
      inlineData: dataUrlToInlineData(inlineDocument.dataUrl)
    });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      `Gemini API error ${response.status}: ${await response.text()}`
    );
  }

  return extractGeminiText(await response.json());
}
