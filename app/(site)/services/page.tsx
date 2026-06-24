"use client";

import { useState, useRef, useEffect } from "react";
import { ServiceModal } from "@/components/ui/ServiceModal";
import { Brain, Code2, GitMerge, LineChart } from "lucide-react";

const SERVICES = [
  {
    id: "ai-ml",
    slug: "01",
    title: "AI & Machine Learning Engineering",
    category: "ENGINEERING",
    icon: <Brain className="w-8 h-8" />,
    color: "#F38020",
    colorDim: "rgba(243,128,32,0.12)",
    colorGlow: "rgba(243,128,32,0.35)",
    tagline: "Custom RAG pipelines, Agentic AI, LLM Guardrails, and Computer Vision integration into production environments.",
    bullets: [
      "Custom Retrieval-Augmented Generation (RAG)",
      "Agentic AI & Multi-Agent Systems",
      "LLM Security Guardrails",
      "Computer Vision Integration"
    ]
  },
  {
    id: "fullstack",
    slug: "02",
    title: "Full-Stack & Distributed Systems",
    category: "ARCHITECTURE",
    icon: <Code2 className="w-8 h-8" />,
    color: "#F38020",
    colorDim: "rgba(243,128,32,0.12)",
    colorGlow: "rgba(243,128,32,0.35)",
    tagline: "High-performance React/Next.js frontends, resilient API design, and highly scalable PostgreSQL/Supabase data modeling.",
    bullets: [
      "React/Next.js Frontend Architecture",
      "RESTful & GraphQL API Design",
      "PostgreSQL/Supabase Modeling",
      "Microservices & Serverless Edge"
    ]
  },
  {
    id: "workflow",
    slug: "03",
    title: "Enterprise Workflow Automation",
    category: "OPERATIONS",
    icon: <GitMerge className="w-8 h-8" />,
    color: "#F38020",
    colorDim: "rgba(243,128,32,0.12)",
    colorGlow: "rgba(243,128,32,0.35)",
    tagline: "Advanced n8n implementation, custom data pipelines, and automated invoicing/workflow systems.",
    bullets: [
      "n8n Automation Implementation",
      "Custom Data Engineering Pipelines",
      "Automated Invoicing Systems",
      "CRM & ERP Data Synchronization"
    ]
  },
  {
    id: "strategy",
    slug: "04",
    title: "Technical Product Strategy",
    category: "CONSULTING",
    icon: <LineChart className="w-8 h-8" />,
    color: "#F38020",
    colorDim: "rgba(243,128,32,0.12)",
    colorGlow: "rgba(243,128,32,0.35)",
    tagline: "B2B Architecture Consulting, Software BRD, PRD, and Systems Design Document (SDD) preparation.",
    bullets: [
      "B2B Architecture Consulting",
      "Business Requirements Documents (BRD)",
      "Product Requirements Documents (PRD)",
      "Systems Design Documents (SDD)"
    ]
  }
];

interface ServiceType {
  id: string;
  slug: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  colorDim: string;
  colorGlow: string;
  tagline: string;
  bullets: string[];
}

interface ServiceCardProps {
  service: ServiceType;
  index: number;
  onOpen: (title: string) => void;
}

function ServiceCard({ service, index, onOpen }: ServiceCardProps) {
  const [hov, setHov] = useState(false);
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card transition-all duration-500 ease-out p-8 md:p-12"
      style={{
        borderColor: hov ? `${service.color}66` : "var(--border)",
        background: hov ? `color-mix(in srgb, ${service.color} 5%, var(--card))` : "var(--card)",
        transform: vis ? (hov ? "translateY(-5px) scale(1.01)" : "translateY(0)") : "translateY(40px)",
        opacity: vis ? 1 : 0,
        boxShadow: hov ? `0 20px 60px ${service.colorGlow}, 0 0 0 1px ${service.color}30` : "none",
        transitionDelay: `${index * 0.1}s`
      }}
    >
      {/* Top Accent Line */}
      <div 
        className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-500" 
        style={{ 
          background: hov ? `linear-gradient(90deg, ${service.color}, transparent)` : "transparent" 
        }} 
      />

      {/* Shimmer Effect */}
      {hov && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(115deg, transparent 30%, ${service.color}10 55%, transparent 80%)`,
            animation: "shimmerSlide 0.65s ease forwards",
          }} 
        />
      )}

      <div className="flex flex-col flex-1 z-10">
        <div className="flex justify-between items-center mb-8">
          <span className="font-mono text-sm font-bold opacity-70 tracking-[0.2em]" style={{ color: service.color }}>
            {service.slug}
          </span>
          <span 
            className="font-mono text-[11px] font-bold tracking-[0.2em] px-3 py-1 rounded-sm border uppercase"
            style={{ 
              borderColor: `${service.color}40`, 
              color: service.color, 
              background: service.colorDim 
            }}
          >
            {service.category}
          </span>
        </div>

        <div className="flex items-start gap-5 mb-6">
          <span className="shrink-0 transition-all duration-300 mt-1" style={{ color: service.color, filter: hov ? `drop-shadow(0 0 8px ${service.color})` : "none" }}>
            {service.icon}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-foreground">
            {service.title}
          </h2>
        </div>

        <p className="text-muted-foreground leading-relaxed text-[16px] mb-8 font-sans">
          {service.tagline}
        </p>

        <ul className="space-y-4 mb-12 flex-1">
          {service.bullets.map((b: string, i: number) => (
            <li key={i} className="flex items-start gap-4">
              <span style={{ color: service.color }} className="font-bold text-sm mt-1">▸</span>
              <span className="text-[15px] text-foreground/80">{b}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={() => onOpen(service.title)}
          className="mt-auto flex h-14 w-full items-center justify-center gap-2 rounded-lg border border-border bg-foreground text-background font-bold uppercase tracking-[0.2em] text-xs transition-all hover:bg-[#F38020] hover:text-white hover:border-[#F38020] shadow-xl hover:shadow-[#F38020]/20"
        >
          Request Architecture
        </button>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setTimeout(() => setMount(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-foreground relative pt-24 md:pt-32 pb-24">
      <style>{`
        @keyframes shimmerSlide { from{opacity:0;transform:translateX(-100%)}to{opacity:1;transform:translateX(100%)} }
      `}</style>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <div 
            className="flex items-center gap-3 mb-6 transition-all duration-700 ease-in-out"
            style={{ opacity: mount ? 1 : 0, transform: mount ? "none" : "translateY(-10px)" }}
          >
            <div className="w-2 h-2 rounded-full bg-[#F38020] shadow-[0_0_10px_rgba(243,128,32,0.8)] animate-pulse" />
            <span className="font-mono text-xs font-bold text-[#F38020] uppercase tracking-[0.2em]">
              Capabilities
            </span>
            <div className="flex-1 max-w-[200px] h-[1px] bg-gradient-to-r from-[#F38020]/50 to-transparent" />
          </div>

          <h1 
            className="text-[clamp(40px,7vw,80px)] font-extrabold tracking-tighter leading-[1.0] text-foreground transition-all duration-800 ease-out delay-100"
            style={{ opacity: mount ? 1 : 0, transform: mount ? "none" : "translateY(20px)" }}
          >
            Enterprise Grade <br className="hidden md:block" />
            <span className="text-[#F38020]">
              Engineering.
            </span>
          </h1>
          
          <p 
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed transition-all duration-1000 delay-300"
            style={{ opacity: mount ? 1 : 0 }}
          >
            From autonomous multi-agent systems to hyper-scalable React/Next.js architectures. 
            I build systems that solve impossible problems.
          </p>
        </div>

        {/* Massive 2x2 Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10">
          {SERVICES.map((srv, idx) => (
            <ServiceCard 
              key={srv.id} 
              service={srv} 
              index={idx} 
              onOpen={setSelectedService} 
            />
          ))}
        </div>
      </div>

      <ServiceModal 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)} 
        serviceTitle={selectedService || ""} 
      />
    </div>
  );
}
