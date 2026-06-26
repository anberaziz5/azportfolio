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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const query = `*[_type == "post" && slug.current == $slug][0]`;
  const post = await client.fetch(query, { slug: resolvedParams.slug });
  
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Anber Aziz Blog`,
    description: post.metaDescription || "Read this article on Anber Aziz's blog.",
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    "author": author->name,
    mainImage,
    publishedAt,
    body,
    "categories": categories[]
  }`;
  
  const post = await client.fetch(query, { slug: resolvedParams.slug });

  if (!post) {
    notFound();
  }

  // Define components for Portable Text rendering
  const ptComponents = {
    block: {
      h1: ({ children }: any) => <h1 className="text-4xl md:text-5xl font-bold mt-12 mb-6 text-foreground">{children}</h1>,
      h2: ({ children }: any) => <h2 className="text-3xl md:text-4xl font-semibold mt-10 mb-5 text-foreground">{children}</h2>,
      h3: ({ children }: any) => <h3 className="text-2xl md:text-3xl font-medium mt-8 mb-4 text-foreground">{children}</h3>,
      h4: ({ children }: any) => <h4 className="text-xl md:text-2xl font-medium mt-6 mb-3 text-foreground">{children}</h4>,
      normal: ({ children }: any) => <p className="text-lg leading-relaxed text-muted-foreground mb-6">{children}</p>,
      blockquote: ({ children }: any) => <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 italic text-xl text-muted-foreground bg-primary/5 rounded-r-lg">{children}</blockquote>,
    },
    list: {
      bullet: ({ children }: any) => <ul className="list-disc list-inside space-y-3 mb-8 text-lg text-muted-foreground ml-4">{children}</ul>,
      number: ({ children }: any) => <ol className="list-decimal list-inside space-y-3 mb-8 text-lg text-muted-foreground ml-4">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }: any) => <li className="pl-2 marker:text-primary">{children}</li>,
      number: ({ children }: any) => <li className="pl-2 marker:text-primary">{children}</li>,
    },
    marks: {
      strong: ({ children }: any) => <strong className="font-bold text-foreground">{children}</strong>,
      em: ({ children }: any) => <em className="italic">{children}</em>,
      link: ({ children, value }: any) => (
        <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4 decoration-2">
          {children}
        </a>
      ),
    },
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
              loading="lazy"
              quality={80}
            />
          </div>
        )
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      richTable: ({ value }: any) => {
        if (!value?.rows || value.rows.length === 0) return null;
        return (
          <div className="overflow-x-auto my-8">
            <table className="w-full text-left border-collapse border border-border rounded-lg overflow-hidden">
              <tbody className="divide-y divide-border">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {value.rows.map((row: any, rIdx: number) => (
                  <tr key={row._key || rIdx} className="hover:bg-muted/10 transition-colors">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {row.cells?.map((cell: any, cIdx: number) => (
                      <td key={cell._key || cIdx} className="px-4 py-3 border-r border-border last:border-r-0 align-top">
                        {cell.content ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <PortableText value={cell.content} components={ptComponents} />
                          </div>
                        ) : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      },
      // Backwards compatibility for old @sanity/table plugin format
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      table: ({ value }: any) => {
        if (!value?.rows || value.rows.length === 0) return null;
        return (
          <div className="overflow-x-auto my-8">
            <table className="w-full text-left border-collapse border border-border rounded-lg overflow-hidden">
              <tbody className="divide-y divide-border">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {value.rows.map((row: any, rIdx: number) => (
                  <tr key={row._key || rIdx} className="hover:bg-muted/10 transition-colors">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {row.cells?.map((cell: any, cIdx: number) => (
                      <td key={cIdx} className="px-4 py-3 border-r border-border last:border-r-0 align-top">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          {cell}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }
  };

  return (
    <article className="min-h-screen pt-32 pb-24 bg-background max-w-[100vw] overflow-x-hidden">
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
