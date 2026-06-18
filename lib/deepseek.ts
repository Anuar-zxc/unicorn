export const DEEPSEEK_MODEL =
  process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

export async function streamDeepSeek({
  system,
  user,
  maxTokens = 5000
}: {
  system: string;
  user: string;
  maxTokens?: number;
}) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      max_tokens: maxTokens,
      stream: true,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ]
    })
  });

  if (!response.ok || !response.body) {
    throw new Error(
      `DeepSeek API error ${response.status}: ${await response.text()}`
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      let buffer = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6).trim();
            if (!payload || payload === "[DONE]") continue;
            const data = JSON.parse(payload);
            const text = data.choices?.[0]?.delta?.content ?? "";
            if (text) controller.enqueue(encoder.encode(text));
          }
        }
      } finally {
        controller.close();
        reader.releaseLock();
      }
    }
  });
}

export async function completeDeepSeek({
  system,
  user,
  maxTokens = 3000,
  json = false
}: {
  system: string;
  user: string;
  maxTokens?: number;
  json?: boolean;
}) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      max_tokens: maxTokens,
      stream: false,
      ...(json ? { response_format: { type: "json_object" } } : {}),
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ]
    })
  });
  if (!response.ok) {
    throw new Error(
      `DeepSeek API error ${response.status}: ${await response.text()}`
    );
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content as string | undefined;
}
