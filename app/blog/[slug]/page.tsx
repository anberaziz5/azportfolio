import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { PortableText } from '@portabletext/react';

// Revalidate every 60 seconds
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const query = `*[_type == "post"]{ slug }`;
    const posts = await client.fetch(query);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return posts.map((post: any) => ({
      slug: post.slug.current,
    }));
  } catch (error) {
    console.warn("Sanity project not configured yet. Skipping static blog routes.");
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const query = `*[_type == "post" && slug.current == $slug][0]`;
  const post = await client.fetch(query, { slug: params.slug });
  
  if (!post) return { title: "Post Not Found" };

  return {
    title: `\${post.title} | Anber Aziz Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    author,
    mainImage,
    publishedAt,
    body,
    "categories": categories[]
  }`;
  
  const post = await client.fetch(query, { slug: params.slug });

  if (!post) {
    notFound();
  }

  // Define components for Portable Text rendering
  const ptComponents = {
    types: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      image: ({ value }: any) => {
        if (!value?.asset?._ref) {
          return null
        }
        return (
          <div className="my-8 relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
            <Image
              src={urlForImage(value).url()}
              alt={value.alt || 'Blog image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )
      }
    }
  };

  return (
    <article className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        
        <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {post.categories?.map((cat: any, idx: number) => (
              <span key={idx} className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                {cat}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-muted-foreground border-b border-border pb-8">
            {post.author && (
              <span className="font-medium text-foreground">{post.author}</span>
            )}
            {post.author && <span>•</span>}
            <span>{new Date(post.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </header>

        {post.mainImage && (
          <div className="relative w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden mb-16 shadow-lg border border-border">
            <Image
              src={urlForImage(post.mainImage).url()}
              alt={post.mainImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {post.body ? (
            <PortableText value={post.body} components={ptComponents} />
          ) : (
            <p>No content available.</p>
          )}
        </div>

      </div>
    </article>
  );
}
