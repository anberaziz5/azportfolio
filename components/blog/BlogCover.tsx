import Image from "next/image";

export function BlogCover({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 768px",
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <div className={`relative w-full aspect-[1200/630] overflow-hidden bg-muted ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={90}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
