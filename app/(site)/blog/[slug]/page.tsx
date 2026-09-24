import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import FineTuningVsPromptingVsRAGDiagram from "@/components/blog/FineTuningVsPromptingVsRAGDiagram";
import { formatPostDate, getAllPosts, getPostBySlug, getPostUrl, SITE_URL } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const url = getPostUrl(post.slug);
  const image = `${SITE_URL}${post.cover}`;

  return {
    title: `${post.title} | Anber Aziz`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      siteName: "Anber Aziz",
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author],
      tags: post.keywords,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.coverAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = getPostUrl(post.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}${post.cover}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Anber Aziz",
      url: SITE_URL,
    },
    mainEntityOfPage: url,
    keywords: post.keywords.join(", "),
  };

  return (
    <article className="min-h-screen pt-32 pb-24 bg-background max-w-[100vw] overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {post.keywords.map((keyword) => (
              <span key={keyword} className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                {keyword}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-muted-foreground border-b border-border pb-8">
            <span className="font-medium text-foreground">{post.author}</span>
            <span>•</span>
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          </div>
        </header>

        {post.heroComponent === "FineTuningVsPromptingVsRAGDiagram" ? (
          <div className="relative w-full mb-16 overflow-hidden rounded-[2rem] border border-border bg-card">
            <FineTuningVsPromptingVsRAGDiagram />
          </div>
        ) : (
          <div className="relative w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden mb-16 border border-border">
            <Image
              src={post.cover}
              alt={post.coverAlt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <BlogMarkdown content={post.content} />
        </div>
      </div>
    </article>
  );
}
