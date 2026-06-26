"use client";

import { useInView } from "@/hooks/useInView";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  duration?: number;
}

export function FadeInSection({ children, className = "", delay = 0, duration = 0.6 }: FadeInProps) {
  const { ref, inView } = useInView({ rootMargin: "-50px" });
  
  return (
    <section
      ref={ref}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
      className={`${className} ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
    >
      {children}
    </section>
  );
}

export function FadeInDiv({ children, className = "", delay = 0, duration = 0.6 }: FadeInProps) {
  const { ref, inView } = useInView({ rootMargin: "-50px" });

  return (
    <div
      ref={ref}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
      className={`${className} ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
    >
      {children}
    </div>
  );
}
