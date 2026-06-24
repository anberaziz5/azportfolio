import { RotatingEarth } from "@/components/ui/RotatingEarth";
import { CTASection } from "@/components/ui/CTASection";
import { ScheduleMeet } from "@/components/ui/ScheduleMeet";
import { ProjectsSection } from "@/components/ui/ProjectsSection";
import Link from "next/link";
import { ArrowRight, Code2, Database, BrainCircuit, Globe2 } from "lucide-react";
import { FadeInSection, FadeInDiv } from "@/components/shared/FadeIn";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <FadeInSection className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10">
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 flex items-center justify-center pointer-events-none">
          <RotatingEarth width={800} height={800} className="w-[150%] md:w-[100%] h-auto max-w-none" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center gap-8">
          <div className="flex flex-col items-center max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Open to Fall 2027 MS/PhD Opportunities
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
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
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
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
      </FadeInSection>

      {/* Capabilities Overview */}
      <FadeInSection delay={0.2} y={30} className="py-24 bg-card/50 relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Capabilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
              I specialize in bridging the gap between theoretical machine learning and applied software engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BrainCircuit className="w-8 h-8 text-primary" />,
                title: "Applied AI & ML",
                desc: "Designing RAG pipelines, training predictive models with XGBoost, and orchestrating multi-agent LLM systems."
              },
              {
                icon: <Code2 className="w-8 h-8 text-primary" />,
                title: "Full-Stack Dev",
                desc: "Building highly interactive, responsive, and performance-optimized web applications using React and Next.js."
              },
              {
                icon: <Database className="w-8 h-8 text-primary" />,
                title: "Backend Systems",
                desc: "Architecting resilient microservices, robust APIs with FastAPI/Node, and complex database schemas."
              },
              {
                icon: <Globe2 className="w-8 h-8 text-primary" />,
                title: "Edge & Cloud",
                desc: "Deploying high-availability infrastructure on Vercel, Cloudflare Workers, and Hugging Face Spaces."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow group">
                <div className="mb-4 inline-flex p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* CTA Section with Shaders */}
      <FadeInDiv duration={0.8}>
        <CTASection />
      </FadeInDiv>

      {/* Projects Section (Sticky Scrolling) */}
      <ProjectsSection />

      {/* Schedule a Meet Component (Adapted WaitlistHero) */}
      <ScheduleMeet />
    </div>
  );
}
