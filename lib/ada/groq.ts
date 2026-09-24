const GROQ = "https://api.groq.com/openai/v1";

export const GROQ_CHAT_MODEL = "qwen/qwen3.8-27b";
export const GROQ_CHAT_FALLBACK_MODEL = "allam-2-7b";
export const GROQ_STT_MODEL = "whisper-large-v3-turbo";
export const GROQ_TTS_MODEL = "canopylabs/orpheus-v1-english";
export const GROQ_TTS_VOICE = "hannah";

function groqKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is not configured");
  return key;
}

export type ChatTurn = { role: "user" | "assistant"; content: string };

async function groqChatRequest(
  model: string,
  systemPrompt: string,
  userMessage: string,
  history: ChatTurn[],
  maxTokens: number
): Promise<ReadableStream<Uint8Array>> {
  const qwen = model.includes("qwen");
  const res = await fetch(`${GROQ}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${groqKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: qwen ? 0.4 : 0.2,
      max_completion_tokens: maxTokens,
      stream: true,
      ...(qwen ? { reasoning_effort: "none" } : {}),
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-8),
        { role: "user", content: userMessage },
      ],
    }),
    signal: AbortSignal.timeout(6000),
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Groq chat ${res.status}: ${detail.slice(0, 200)}`);
  }

  return res.body;
}

export async function groqChatStream(
  systemPrompt: string,
  userMessage: string,
  history: ChatTurn[],
  opts: { maxTokens: number }
): Promise<ReadableStream<Uint8Array>> {
  try {
    return await groqChatRequest(
      GROQ_CHAT_MODEL,
      systemPrompt,
      userMessage,
      history,
      opts.maxTokens
    );
  } catch (err) {
    console.warn(
      "Primary Groq model unavailable, falling back:",
      err instanceof Error ? err.message.slice(0, 160) : err
    );
    return groqChatRequest(
      GROQ_CHAT_FALLBACK_MODEL,
      systemPrompt,
      userMessage,
      history,
      opts.maxTokens
    );
  }
}

export async function* readGroqContent(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let pending = "";
  let hidingThink = false;

  const flushVisible = function* (chunk: string): Generator<string> {
    pending += chunk;
    while (pending.length) {
      if (hidingThink) {
        const end = pending.search(/<\/think>/i);
        if (end === -1) {
          pending = pending.slice(-16);
          return;
        }
        pending = pending.slice(end + 8);
        hidingThink = false;
        continue;
      }
      const start = pending.search(/<think>/i);
      if (start === -1) {
        const hold = Math.min(16, pending.length);
        const emit = pending.slice(0, pending.length - hold);
        pending = pending.slice(pending.length - hold);
        if (emit) yield emit;
        return;
      }
      if (start > 0) yield pending.slice(0, start);
      pending = pending.slice(start + 7);
      hidingThink = true;
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const json = JSON.parse(payload) as {
          choices?: { delta?: { content?: string; reasoning?: string } }[];
        };
        const piece = json.choices?.[0]?.delta?.content;
        if (piece) yield* flushVisible(piece);
      } catch {
        // ignore keepalives / partial JSON
      }
    }
  }

  if (!hidingThink && pending.trim()) yield pending;
}

export async function groqTranscribe(file: Blob, filename: string): Promise<string> {
  const form = new FormData();
  form.append("file", file, filename);
  form.append("model", GROQ_STT_MODEL);
  form.append("language", "en");
  form.append("response_format", "text");
  form.append(
    "prompt",
    "Ada, Anber Aziz, LCWU, Pakistan, Groq, Next.js, RAG, portfolio"
  );
  form.append("temperature", "0");

  const res = await fetch(`${GROQ}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${groqKey()}` },
    body: form,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Groq STT ${res.status}: ${detail.slice(0, 200)}`);
  }

  return (await res.text()).trim();
}

export function textForSpeech(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/[_`#]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "anber.me")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 400);
}

export async function groqSpeak(text: string): Promise<{ audio: ArrayBuffer; contentType: string }> {
  const spoken = textForSpeech(text);
  if (!spoken) throw new Error("Nothing to speak");

  const res = await fetch(`${GROQ}/audio/speech`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${groqKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_TTS_MODEL,
      voice: GROQ_TTS_VOICE,
      input: `[friendly] ${spoken}`,
      response_format: "wav",
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Groq TTS ${res.status}: ${detail.slice(0, 280)}`);
  }

  return {
    audio: await res.arrayBuffer(),
    contentType: res.headers.get("content-type") || "audio/wav",
  };
}
