"use client";

import { BrainCircuit, Code2, Database, Globe2 } from "lucide-react";
import { FadeInSection } from "@/components/shared/FadeIn";

export function CapabilitiesSection() {
  return (
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
  );
}
