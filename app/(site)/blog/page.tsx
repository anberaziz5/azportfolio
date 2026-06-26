import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { FadeInDiv } from "@/components/shared/FadeIn";
import { DynamicBlogComponent } from "@/components/blog/DynamicBlogComponent";

export const metadata = {
  title: "Blog | Anber Aziz",
  description: "Writings on AI, Software Engineering, and Tech by Anber Aziz.",
};

// Next.js Revalidation
export const revalidate = 60; // revalidate every 60 seconds

async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    mainComponent,
    publishedAt,
    metaDescription,
    "categories": categories[]
  }`;
  
  try {
    const posts = await client.fetch(query);
    return posts;
  } catch (error) {
    console.error("Error fetching Sanity posts:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="flex flex-col min-h-screen pt-32 pb-24 bg-background relative overflow-hidden">
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
            <p className="text-sm text-muted-foreground">Add posts in Sanity Studio to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {posts.map((post: any) => (
              <Link 
                key={post._id} 
                href={`/blog/${post.slug.current}`}
                className="group p-8 bg-card rounded-[2rem] border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow-md flex flex-col overflow-hidden"
              >
                {post.mainComponent ? (
                  <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden bg-muted/20 border border-border">
                    <DynamicBlogComponent componentName={post.mainComponent} />
                  </div>
                ) : post.mainImage ? (
                  <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden bg-muted/20">
                    <Image 
                      src={urlForImage(post.mainImage).url()} 
                      alt={post.mainImage.alt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading="lazy"
                      quality={80}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                
                <div className="mb-6 flex flex-wrap gap-2">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {post.categories?.map((cat: any, idx: number) => (
                    <span key={idx} className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                      {cat}
                    </span>
                  ))}
                </div>
                
                <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-muted-foreground mb-8 line-clamp-3">
                  {post.metaDescription || "No description provided."}
                </p>
                
                <div className="mt-auto flex items-center justify-between text-sm font-medium text-muted-foreground border-t border-border pt-6">
                  <span>{new Date(post.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
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
