import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BlogCover } from "@/components/blog/BlogCover";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import FineTuningVsPromptingVsRAGDiagram from "@/components/blog/FineTuningVsPromptingVsRAGDiagram";
import { formatPostDate, getAllPosts, getPostBySlug, getPostUrl, SITE_URL } from "@/lib/blog";

const authorLd = {
  "@type": "Person",
  name: "Anber Aziz",
  url: SITE_URL,
  jobTitle: "AI Systems Engineer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
    addressCountry: "PK",
  },
};

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
    authors: [{ name: post.author, url: SITE_URL }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      siteName: "Anber Aziz",
      locale: "en_US",
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
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}${post.cover}`,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "en",
    author: authorLd,
    publisher: authorLd,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: post.keywords.join(", "),
    about: post.keywords.map((keyword) => ({
      "@type": "Thing",
      name: keyword,
    })),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2"],
    },
  };

  const faqLd =
    post.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <article className="min-h-screen pt-32 pb-24 bg-background max-w-[100vw] overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}
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

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground border-b border-border pb-8">
            <span className="font-medium text-foreground">{post.author}</span>
            <span>•</span>
            <span>Lahore, Pakistan</span>
            <span>•</span>
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          </div>
        </header>

        <BlogCover
          src={post.cover}
          alt={post.coverAlt}
          priority
          className="mb-10 rounded-[2rem] border border-border"
        />

        {post.heroComponent === "FineTuningVsPromptingVsRAGDiagram" ? (
          <div className="relative w-full mb-16 overflow-hidden rounded-[2rem] border border-border bg-card">
            <FineTuningVsPromptingVsRAGDiagram />
          </div>
        ) : null}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <BlogMarkdown content={post.content} />
        </div>
      </div>
    </article>
  );
}
