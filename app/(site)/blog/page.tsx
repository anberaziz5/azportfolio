import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { FadeInDiv } from "@/components/shared/FadeIn";
import FineTuningVsPromptingVsRAGDiagram from "@/components/blog/FineTuningVsPromptingVsRAGDiagram";
import { formatPostDate, getAllPosts, SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Anber Aziz",
  description:
    "Engineering notes on AI systems, full-stack architecture, and production software by Anber Aziz.",
  keywords: [
    "AI engineering",
    "Next.js",
    "full-stack",
    "RAG",
    "software architecture",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog | Anber Aziz",
    description:
      "Engineering notes on AI systems, full-stack architecture, and production software by Anber Aziz.",
    url: `${SITE_URL}/blog`,
    siteName: "Anber Aziz",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/blog/fine-tuning-vs-prompting-vs-rag.webp`,
        width: 1200,
        height: 630,
        alt: "Anber Aziz blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Anber Aziz",
    description:
      "Engineering notes on AI systems, full-stack architecture, and production software by Anber Aziz.",
    images: [`${SITE_URL}/blog/fine-tuning-vs-prompting-vs-rag.webp`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

function HeroPreview({ component, cover, coverAlt, title }: { component?: string; cover: string; coverAlt: string; title: string }) {
  if (component === "FineTuningVsPromptingVsRAGDiagram") {
    return (
      <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden bg-muted/20 border border-border">
        <FineTuningVsPromptingVsRAGDiagram />
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden bg-muted/20">
      <Image
        src={cover}
        alt={coverAlt || title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

export default function BlogPage() {
  const posts = getAllPosts();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Anber Aziz Blog",
    url: `${SITE_URL}/blog`,
    description:
      "Engineering notes on AI systems, full-stack architecture, and production software by Anber Aziz.",
    author: {
      "@type": "Person",
      name: "Anber Aziz",
      url: SITE_URL,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.date,
      description: post.description,
    })),
  };

  return (
    <div className="flex flex-col min-h-screen pt-32 pb-24 bg-background relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FadeInDiv className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            The <span className="text-primary">Blog.</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            Thoughts, tutorials, and research notes on Artificial Intelligence, Full-Stack Development, and Engineering Leadership.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="p-12 text-center bg-card border border-border rounded-[2rem]">
            <p className="text-xl font-medium text-muted-foreground mb-4">No posts found.</p>
            <p className="text-sm text-muted-foreground">Add a Markdown file to content/blog to publish.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group p-8 bg-card rounded-[2rem] border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow-md flex flex-col overflow-hidden"
              >
                <HeroPreview
                  component={post.heroComponent}
                  cover={post.cover}
                  coverAlt={post.coverAlt}
                  title={post.title}
                />

                <div className="mb-6 flex flex-wrap gap-2">
                  {post.keywords.map((keyword) => (
                    <span key={keyword} className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>

                <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>

                <p className="text-muted-foreground mb-8 line-clamp-3">{post.description}</p>

                <div className="mt-auto flex items-center justify-between text-sm font-medium text-muted-foreground border-t border-border pt-6">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                  <span className="text-primary group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Read More <span className="ml-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </FadeInDiv>
    </div>
  );
}
