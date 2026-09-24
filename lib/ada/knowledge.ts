import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const KB_PATH = path.join(process.cwd(), "KnowledgeBase", "anber_rag_knowledge_base.md");
const SKIP_SECTIONS = new Set(["01", "13", "14"]);
const STOP = new Set([
  "the", "and", "for", "her", "she", "you", "your", "about", "with", "that",
  "this", "what", "have", "has", "was", "are", "from", "into", "can", "how",
  "who", "does", "did", "any", "all", "tell", "me", "please", "just",
]);

const SIMILARITY_THRESHOLD = 0.38;
const VECTOR_TIMEOUT_MS = 850;
const EMBED_MODEL = "jina-embeddings-v2-base-en";

type Section = { id: string; title: string; text: string; tokens: Map<string, number> };

const embedCache = new Map<string, number[]>();
const embedInflight = new Map<string, Promise<number[]>>();
let cachedSections: Section[] | null = null;

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

function tokenMap(text: string): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of tokenize(text)) map.set(t, (map.get(t) ?? 0) + 1);
  return map;
}

function stripMeta(content: string): string {
  return content
    .replace(/^#{1,6}\s+.+$/gm, "")
    .replace(/[=\-─━]{3,}/g, "")
    .replace(/Version\s+\d+\.\d+.*$/gm, "")
    .replace(/DOCUMENT INDEX/gi, "")
    .replace(/\|\s*Section\s*\|.*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function loadSections(): Section[] {
  if (cachedSections) return cachedSections;
  if (!fs.existsSync(KB_PATH)) {
    cachedSections = [];
    return cachedSections;
  }
  const raw = fs.readFileSync(KB_PATH, "utf8");
  const parts = raw.split(/^# SECTION /m).slice(1);
  cachedSections = parts
    .map((part) => {
      const nl = part.indexOf("\n");
      const heading = (nl === -1 ? part : part.slice(0, nl)).trim();
      const id = heading.slice(0, 2);
      const title = heading.replace(/^\d+\s*[—–-]\s*/, "");
      const text = stripMeta(nl === -1 ? "" : part.slice(nl + 1));
      return { id, title, text, tokens: tokenMap(`${title}\n${text}`) };
    })
    .filter((s) => s.text.length > 40 && !SKIP_SECTIONS.has(s.id));
  return cachedSections;
}

export function expandQuery(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  const extra: string[] = [];
  if (/project|built|portfolio|work|example/.test(lower)) {
    extra.push("projects portfolio CyberGuard OpenScholar Omni-Node applications");
  }
  if (/service|offer|hire|help|cost|price|rate/.test(lower)) {
    extra.push("services engineering consulting full stack pricing");
  }
  if (/skill|tech|stack|language|framework|experience/.test(lower)) {
    extra.push("skills programming Python React Next.js AI ML");
  }
  if (/background|about|who|story|education|study|university/.test(lower)) {
    extra.push("background education LCWU Pakistan engineer");
  }
  if (/contact|reach|email|book|meet|call|consult/.test(lower)) {
    extra.push("contact email io@anber.me booking consultation");
  }
  if (/phd|ms |master|research|fall 2027|usa/.test(lower)) {
    extra.push("MS PhD USA Fall 2027 research");
  }
  return extra.length ? `${userMessage} ${extra.join(" ")}` : userMessage;
}

function retrieveLocal(userMessage: string, maxChars: number): string {
  const sections = loadSections();
  if (sections.length === 0) return "";
  const queryTokens = tokenize(expandQuery(userMessage));
  const fallback = sections
    .filter((s) => s.id === "02" || s.id === "08" || s.id === "09")
    .map((s) => s.text)
    .join("\n\n")
    .slice(0, maxChars);

  if (queryTokens.length === 0) return fallback;

  const ranked = sections
    .map((section) => {
      let score = 0;
      for (const t of queryTokens) {
        const tf = section.tokens.get(t);
        if (tf) score += 1 + Math.log2(1 + tf);
        if (section.title.toLowerCase().includes(t)) score += 3;
      }
      return { section, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (ranked.length === 0) return fallback;

  let out = "";
  for (const { section } of ranked) {
    const next = out ? `${out}\n\n${section.text}` : section.text;
    if (next.length > maxChars) return next.slice(0, maxChars);
    out = next;
  }
  return out;
}

async function embedQuery(text: string): Promise<number[]> {
  const hit = embedCache.get(text);
  if (hit) return hit;

  const pending = embedInflight.get(text);
  if (pending) return pending;

  const work = (async () => {
    const res = await fetch("https://api.jina.ai/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.JINA_API_KEY}`,
      },
      body: JSON.stringify({
        input: [text],
        model: EMBED_MODEL,
      }),
      signal: AbortSignal.timeout(2500),
    });
    const data = (await res.json()) as { data?: { embedding: number[] }[] };
    const embedding = data.data?.[0]?.embedding;
    if (!embedding) throw new Error("Jina embedding failed");
    if (embedCache.size > 80) {
      const first = embedCache.keys().next().value;
      if (first) embedCache.delete(first);
    }
    embedCache.set(text, embedding);
    return embedding;
  })().finally(() => embedInflight.delete(text));

  embedInflight.set(text, work);
  return work;
}

async function retrieveFromPgvector(userMessage: string, maxChars: number): Promise<string> {
  const query = expandQuery(userMessage);
  const embedding = await embedQuery(query);
  const { data, error } = await supabase.rpc("match_chunks", {
    query_embedding: embedding,
    match_count: 6,
    match_threshold: SIMILARITY_THRESHOLD,
  });
  if (error) throw error;

  const chunks = (data || []) as { content?: string; similarity?: number }[];
  const text = chunks
    .map((row) => stripMeta(row.content || ""))
    .filter((c) => c.length > 40)
    .join("\n\n");
  return text.slice(0, maxChars);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retrieveContext(userMessage: string, maxChars = 2800): Promise<string> {
  const local = retrieveLocal(userMessage, maxChars);
  const vector = retrieveFromPgvector(userMessage, maxChars).catch((err) => {
    console.error("pgvector retrieve failed:", err);
    return "";
  });

  const raced = await Promise.race([
    vector.then((text) => ({ source: "vector" as const, text })),
    delay(VECTOR_TIMEOUT_MS).then(() => ({ source: "timeout" as const, text: "" })),
  ]);

  if (raced.source === "vector" && raced.text.length > 80) return raced.text;
  return local || raced.text;
}
