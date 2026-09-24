import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "KnowledgeBase", "anber_rag_knowledge_base.md");
const dest = path.join(root, "lib", "ada", "kb-markdown.ts");

const raw = fs.readFileSync(src, "utf8");
const banner =
  "// Generated from KnowledgeBase/anber_rag_knowledge_base.md — do not edit by hand.\n" +
  "// Run `npm run kb:bundle` after changing the knowledge base.\n";
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, `${banner}export const KB_MARKDOWN = ${JSON.stringify(raw)};\n`);
console.log("bundled", dest, `(${raw.length} chars)`);
