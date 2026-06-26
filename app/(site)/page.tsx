"use client";

import Link from "next/link";
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useInView } from "@/hooks/useInView";

function LazySection({ children, minHeight }: { children: React.ReactNode, minHeight: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{ minHeight: inView ? 'auto' : minHeight }}>
      {inView ? children : null}
    </div>
  );
}

const HeroTorus = dynamic(
  () => import("@/components/ui/HeroTorus").then(mod => mod.HeroTorus),
  {
    ssr: false,
    loading: () => null,
  }
);

const CapabilitiesSection = dynamic(
  () => import("@/components/ui/CapabilitiesSection").then(mod => mod.CapabilitiesSection),
  {
    ssr: true,
    loading: () => <div style={{ minHeight: '600px' }} aria-hidden="true" />
  }
);

const ProjectsSection = dynamic(
  () => import("@/components/ui/ProjectsSection").then(mod => mod.ProjectsSection),
  {
    ssr: true,
    loading: () => <div style={{ minHeight: '800px' }} aria-hidden="true" />
  }
);

const ScheduleMeet = dynamic(
  () => import("@/components/ui/ScheduleMeet").then(mod => mod.ScheduleMeet),
  {
    ssr: true,
    loading: () => <div style={{ minHeight: '400px' }} aria-hidden="true" />
  }
);

const CTASection = dynamic(
  () => import("@/components/ui/CTASection").then(mod => mod.CTASection),
  {
    ssr: true,
    loading: () => <div style={{ minHeight: '300px' }} aria-hidden="true" />
  }
);

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10">
        <div className="absolute top-0 left-0 w-full h-[100vh] z-0 pointer-events-none">
          {showAnimation && <HeroTorus />}
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center gap-8">
          <div className="flex flex-col items-center max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Open to Fall 2027 MS/PhD Opportunities
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6" style={{ opacity: 1 }}>
              AI Systems Engineer <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                & Full-Stack Dev.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl text-balance">
              Building intelligent, scalable, and beautiful web experiences. 
              Bridging the gap between bleeding-edge AI models and production-grade software architectures.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/projects"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                View My Work
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background/50 backdrop-blur-sm px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Overview - First section after hero, so load normally per EXCEPTION */}
      <CapabilitiesSection />
      
      {/* Below-fold content wrapped in LazySection */}
      <LazySection minHeight="300px">
        <CTASection />
      </LazySection>

      <LazySection minHeight="800px">
        <ProjectsSection />
      </LazySection>

      <LazySection minHeight="400px">
        <ScheduleMeet />
      </LazySection>
    </div>
  );
}
