import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function BlogMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => (
          <h2 className="text-3xl md:text-4xl font-semibold mt-10 mb-5 text-foreground">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-2xl md:text-3xl font-medium mt-8 mb-4 text-foreground">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-xl md:text-2xl font-medium mt-6 mb-3 text-foreground">{children}</h4>
        ),
        p: ({ children }) => (
          <p className="text-lg leading-relaxed text-muted-foreground mb-6">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-foreground">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 italic text-xl text-muted-foreground bg-primary/5 rounded-r-lg">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-3 mb-8 text-lg text-muted-foreground ml-4">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-3 mb-8 text-lg text-muted-foreground ml-4">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="pl-2 marker:text-primary">{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-primary hover:underline underline-offset-4 decoration-2"
          >
            {children}
          </a>
        ),
        img: ({ src, alt }) => {
          if (!src || typeof src !== "string") return null;
          return (
            <span className="block my-8 relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border">
              <Image
                src={src}
                alt={alt || "Blog image"}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </span>
          );
        },
        table: ({ children }) => (
          <div className="overflow-x-auto my-8">
            <table className="w-full text-left border-collapse border border-border rounded-lg overflow-hidden">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 border border-border bg-muted/30 text-foreground font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 border border-border align-top text-muted-foreground">
            {children}
          </td>
        ),
        pre: ({ children }) => (
          <pre className="mb-8 overflow-x-auto rounded-2xl border border-border bg-card p-4 text-sm">
            {children}
          </pre>
        ),
        code: ({ className, children }) => {
          const isBlock = Boolean(className);
          if (isBlock) {
            return <code className="font-mono text-[13px] leading-relaxed text-foreground">{children}</code>;
          }
          return (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
              {children}
            </code>
          );
        },
        hr: () => <hr className="my-10 border-border" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
