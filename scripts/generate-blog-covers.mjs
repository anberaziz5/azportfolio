import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const matter = require("gray-matter");

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const OUT_DIR = path.join(process.cwd(), "public", "blog");
const force = process.argv.includes("--force");

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapTitle(title, max = 22) {
  const words = title.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function svgFor({ kicker, title }) {
  const lines = wrapTitle(title);
  const titleMarkup = lines
    .map(
      (line, i) =>
        `<text x="80" y="${292 + i * 72}" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="56" font-weight="700">${escapeXml(line)}</text>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect x="0" y="0" width="18" height="630" fill="#F6821F"/>
  <circle cx="1040" cy="90" r="180" fill="#171717"/>
  <circle cx="1120" cy="540" r="140" fill="#111111"/>
  <text x="80" y="120" fill="#F6821F" font-family="JetBrains Mono, ui-monospace, monospace" font-size="22" letter-spacing="4">${escapeXml(kicker)}</text>
  ${titleMarkup}
  <text x="80" y="560" fill="#a3a3a3" font-family="Inter, Arial, sans-serif" font-size="22">Anber Aziz  ·  anber.me/blog</text>
</svg>`;
}

function isPostFile(filename) {
  return (
    filename.endsWith(".md") &&
    filename.toLowerCase() !== "readme.md" &&
    !filename.startsWith("_")
  );
}

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  if (!fs.existsSync(BLOG_DIR)) {
    console.log("no content/blog directory");
    return;
  }

  const files = fs.readdirSync(BLOG_DIR).filter(isPostFile);
  for (const filename of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
    const { data } = matter(raw);
    const slug = String(data.slug || filename.replace(/\.md$/, ""));
    const title = String(data.title || slug);
    const keywords = Array.isArray(data.keywords) ? data.keywords.map(String) : [];
    const kicker = String(keywords[0] || "BLOG").toUpperCase();
    const outPath = path.join(OUT_DIR, `${slug}.webp`);

    if (!force && fs.existsSync(outPath)) {
      console.log("skip existing", outPath);
      continue;
    }

    const svg = Buffer.from(svgFor({ kicker, title }));
    await sharp(svg, { density: 180 })
      .resize(1200, 630)
      .webp({ quality: 82, effort: 6 })
      .toFile(outPath);
    console.log("wrote", outPath);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
