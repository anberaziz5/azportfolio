import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const SITE_URL = "https://www.anber.me";

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  keywords: string[];
  author: string;
  cover: string;
  coverAlt: string;
  heroComponent?: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

function isPostFile(filename: string) {
  return (
    filename.endsWith(".md") &&
    filename.toLowerCase() !== "readme.md" &&
    !filename.startsWith("_")
  );
}

function parsePost(filename: string): BlogPost {
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const slug = (data.slug as string) || filename.replace(/\.md$/, "");

  return {
    slug,
    title: String(data.title ?? ""),
    date: String(data.date ?? ""),
    description: String(data.description ?? ""),
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
    author: String(data.author ?? "Anber Aziz"),
    cover: String(data.cover ?? `/blog/${slug}.webp`),
    coverAlt: String(data.coverAlt ?? data.title ?? slug),
    heroComponent: data.heroComponent ? String(data.heroComponent) : undefined,
    content: content.trim(),
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter(isPostFile)
    .map(parsePost)
    .filter((post) => post.title && post.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPostUrl(slug: string) {
  return `${SITE_URL}/blog/${slug}`;
}

export function formatPostDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export { SITE_URL };
