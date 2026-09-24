import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ws from "ws";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const kbPath = path.join(__dirname, "..", "KnowledgeBase", "anber_rag_knowledge_base.md");
const SOURCE = "anber_rag_knowledge_base.md";
const SKIP = new Set(["01", "13", "14"]);
const MODEL = "jina-embeddings-v2-base-en";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
const JINA_API_KEY = process.env.JINA_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !JINA_API_KEY) {
  throw new Error("Missing SUPABASE_URL, SUPABASE_SERVICE_KEY/ANON, or JINA_API_KEY");
}

if (!process.env.SUPABASE_SERVICE_KEY) {
  console.warn(
    "SUPABASE_SERVICE_KEY is not set. Ingest needs the service role key to write embeddings (anon is blocked by RLS)."
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: { transport: ws },
});

function stripMeta(content) {
  return content
    .replace(/[=\-─━]{3,}/g, "")
    .replace(/Version\s+\d+\.\d+.*$/gm, "")
    .replace(/DOCUMENT INDEX/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitLong(text, size = 900, overlap = 120) {
  const parts = [];
  let i = 0;
  while (i < text.length) {
    parts.push(text.slice(i, i + size).trim());
    i += size - overlap;
  }
  return parts.filter(Boolean);
}

function chunkKnowledge(raw) {
  const sections = raw.split(/^# SECTION /m).slice(1);
  const chunks = [];
  for (const part of sections) {
    const nl = part.indexOf("\n");
    const heading = (nl === -1 ? part : part.slice(0, nl)).trim();
    const id = heading.slice(0, 2);
    if (SKIP.has(id)) continue;
    const title = heading.replace(/^\d+\s*[—–-]\s*/, "");
    const body = nl === -1 ? "" : part.slice(nl + 1);
    const subs = body.split(/^## /m);
    for (const sub of subs) {
      const block = stripMeta(sub.startsWith("#") ? sub : `## ${sub}`);
      if (block.length < 80) continue;
      const labeled = `${title}\n\n${block}`;
      const pieces = labeled.length <= 1100 ? [labeled] : splitLong(labeled);
      for (const content of pieces) {
        chunks.push({ content, section: id, title });
      }
    }
  }
  return chunks;
}

async function embedBatch(texts) {
  const response = await fetch("https://api.jina.ai/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JINA_API_KEY}`,
    },
    body: JSON.stringify({ input: texts, model: MODEL }),
  });
  const data = await response.json();
  if (!data.data) throw new Error(JSON.stringify(data));
  return data.data
    .sort((a, b) => a.index - b.index)
    .map((row) => row.embedding);
}

async function ingest() {
  const raw = fs.readFileSync(kbPath, "utf8");
  const chunks = chunkKnowledge(raw);
  console.log(`Prepared ${chunks.length} semantic chunks from ${SOURCE}`);

  const { error: delError } = await supabase
    .from("knowledge_chunks")
    .delete()
    .filter("metadata->>source", "eq", SOURCE);

  if (delError) {
    console.error("Could not replace existing chunks:", delError.message);
    console.error("Add SUPABASE_SERVICE_KEY to .env (service_role, not anon) and re-run: npm run kb:ingest");
    process.exit(1);
  }

  const batchSize = 8;
  let stored = 0;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    console.log(`Embedding ${i + 1}–${Math.min(i + batch.length, chunks.length)} / ${chunks.length}`);
    const embeddings = await embedBatch(batch.map((c) => c.content));
    const rows = batch.map((chunk, idx) => ({
      content: chunk.content,
      embedding: embeddings[idx],
      metadata: {
        chunk_index: i + idx,
        source: SOURCE,
        section: chunk.section,
        title: chunk.title,
      },
    }));
    const { error } = await supabase.from("knowledge_chunks").insert(rows);
    if (error) throw error;
    stored += rows.length;
    await new Promise((r) => setTimeout(r, 150));
  }

  console.log(`Ingestion complete. Stored ${stored} chunks in knowledge_chunks.`);
}

ingest().catch((err) => {
  console.error(err);
  process.exit(1);
});
