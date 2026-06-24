"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { projectsData, Project } from "@/lib/data/projects-data";
import { ExternalLink, Code2 } from "lucide-react";
import { FaGithub, FaGlobe } from "react-icons/fa";

// Import all specific custom animations
import AIPRReviewerDiagram from "@/components/ProjectsAnimations/AIPRReviewerDiagram";
import AIResumeCheckerDiagram from "@/components/ProjectsAnimations/AIResumeCheckerDiagram";
import AutonomousAgentResearcherDiagram from "@/components/ProjectsAnimations/AutonomousAgentResearcherDiagram";
import FeatureFlagPlatformDiagram from "@/components/ProjectsAnimations/FeatureFlagPlatformDiagram";
import HypeWearDiagram from "@/components/ProjectsAnimations/HypeWearDiagram";
import LiveRagPipelineDiagram from "@/components/ProjectsAnimations/LiveRagPipelineDiagram";
import OmniNodeOpsDiagram from "@/components/ProjectsAnimations/OmniNodeOpsDiagram";
import PortfolioDiagram from "@/components/ProjectsAnimations/PortfolioDiagram";
import SupplyChainNervousSystemDiagram from "@/components/ProjectsAnimations/SupplyChainNervousSystemDiagram";
import SynthToxDiagram from "@/components/ProjectsAnimations/SynthToxDiagram";
import TaskManagerDiagram from "@/components/ProjectsAnimations/TaskManagerDiagram";

/* ─── DATA MAPPERS ───────────────────────────────────────────── */

const getProjectAnimation = (id: string) => {
  switch(id) {
    case "omni-node": return <OmniNodeOpsDiagram />;
    case "predictive-supply-chain": return <SupplyChainNervousSystemDiagram />;
    case "openscholar": return <LiveRagPipelineDiagram />;
    case "ai-pr-reviewer": return <AIPRReviewerDiagram />;
    case "resume-checker": return <AIResumeCheckerDiagram />;
    case "multi-agent-researcher": return <AutonomousAgentResearcherDiagram />;
    case "synthtox-engine": return <SynthToxDiagram />;
    case "feature-control": return <FeatureFlagPlatformDiagram />;
    case "hypewear": return <HypeWearDiagram />;
    case "cyberguard": return <PortfolioDiagram />;
    default: return <TaskManagerDiagram />;
  }
};

const getProjectColor = (id: string) => {
  switch(id) {
    case "omni-node": return { color: "#F38020", dim: "rgba(243,128,32,0.12)", glow: "rgba(243,128,32,0.4)" };
    case "cyberguard": return { color: "#e63946", dim: "rgba(230,57,70,0.12)", glow: "rgba(230,57,70,0.35)" };
    case "predictive-supply-chain": return { color: "#06d6a0", dim: "rgba(6,214,160,0.1)", glow: "rgba(6,214,160,0.35)" };
    case "openscholar": return { color: "#7b2d8b", dim: "rgba(123,45,139,0.12)", glow: "rgba(123,45,139,0.35)" };
    case "ai-pr-reviewer": return { color: "#F38020", dim: "rgba(243,128,32,0.1)", glow: "rgba(243,128,32,0.35)" };
    case "resume-checker": return { color: "#3a86ff", dim: "rgba(58,134,255,0.1)", glow: "rgba(58,134,255,0.35)" };
    case "multi-agent-researcher": return { color: "#06d6a0", dim: "rgba(6,214,160,0.1)", glow: "rgba(6,214,160,0.3)" };
    case "synthtox-engine": return { color: "#F38020", dim: "rgba(243,128,32,0.1)", glow: "rgba(243,128,32,0.4)" };
    case "feature-control": return { color: "#3a86ff", dim: "rgba(58,134,255,0.1)", glow: "rgba(58,134,255,0.3)" };
    case "hypewear": return { color: "#7b2d8b", dim: "rgba(123,45,139,0.1)", glow: "rgba(123,45,139,0.3)" };
    default: return { color: "#F38020", dim: "rgba(243,128,32,0.08)", glow: "rgba(243,128,32,0.3)" };
  }
};

const CATEGORIES = ["All", "ML/AI", "Full-Stack", "Research", "Infrastructure", "Open Source"];
const TIERS = ["All", "FLAGSHIP", "TOOL", "CAPSTONE"];

/* ─── ANIMATED CANVAS BACKGROUND ───────────────────────────── */
function NeuralCanvas({ dark }: { dark: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    
    const resize = () => { 
      canvas.width = canvas.offsetWidth; 
      canvas.height = canvas.offsetHeight; 
    };
    resize();
    window.addEventListener("resize", resize);
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nodes = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1,
    }));
    
    let raf: number;
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      
      const themeRGB = dark ? "243,128,32" : "0,0,0"; // Cloudflare Orange or Black
      
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${themeRGB},${0.08 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${themeRGB},0.18)`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    
    draw();
    return () => { 
      cancelAnimationFrame(raf); 
      window.removeEventListener("resize", resize); 
    };
  }, [dark]);
  
  return <canvas ref={ref} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
}

/* ─── HEX GRID ──────────────────────────────────────────────── */
function HexGrid({ dark }: { dark: boolean }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <svg width="100%" height="100%" style={{ opacity: dark ? 0.035 : 0.045 }}>
        <defs>
          <pattern id="hexbg" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
            <polygon points="30,4 54,17 54,35 30,48 6,35 6,17" fill="none" stroke={dark ? "#ffffff" : "#000000"} strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexbg)" />
      </svg>
    </div>
  );
}

/* ─── TYPED HEADLINE ────────────────────────────────────────── */
function TypedHeadline({ text, delay = 0 }: { text: string; delay?: number }) {
  const [shown, setShown] = useState("");
  const [go, setGo] = useState(false);
  
  useEffect(() => { 
    const t = setTimeout(() => setGo(true), delay); 
    return () => clearTimeout(t); 
  }, [delay]);
  
  useEffect(() => {
    if (!go) return;
    let i = 0; setShown("");
    const iv = setInterval(() => { 
      i++; 
      setShown(text.slice(0, i)); 
      if (i >= text.length) clearInterval(iv); 
    }, 35);
    return () => clearInterval(iv);
  }, [go, text]);
  
  return (
    <span>
      {shown}
      {shown.length < text.length && <span className="text-[#F38020] animate-pulse">█</span>}
    </span>
  );
}

/* ─── STAT COUNTER ──────────────────────────────────────────── */
function Counter({ to, delay = 0, suffix = "" }: { to: number; delay?: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const t = setTimeout(() => {
        let cur = 0;
        const step = Math.ceil(to / 40);
        const iv = setInterval(() => { 
          cur = Math.min(cur + step, to); 
          setVal(cur); 
          if (cur >= to) clearInterval(iv); 
        }, 30);
      }, delay);
      return () => clearTimeout(t);
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, delay]);
  
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── PROJECT CARD ──────────────────────────────────────────── */
function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: (p: Project) => void }) {
  const [hov, setHov] = useState(false);
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const theme = getProjectColor(project.id);
  
  const status = project.liveUrl ? "LIVE" : "SHIPPED";
  const tier = project.featured ? "FLAGSHIP" : project.type.includes("Capstone") ? "CAPSTONE" : "TOOL";
  const slug = (index + 1).toString().padStart(2, "0");
  const ghLink = project.githubUrl || "https://github.com/anberaziz5";
  const webLink = project.liveUrl || "https://github.com/anberaziz5";

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { 
      if (e.isIntersecting) setVis(true); 
    }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={() => onOpen(project)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        transform: vis ? (hov ? "translateY(-5px) scale(1.012)" : "translateY(0)") : "translateY(30px)",
        opacity: vis ? 1 : 0,
        transition: `transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 0.055}s, opacity 0.55s ease ${index * 0.055}s, border-color 0.3s, box-shadow 0.3s`,
        boxShadow: hov ? `0 16px 48px ${theme.glow}, 0 0 0 1px ${theme.color}30` : "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)",
        border: `1px solid ${hov ? theme.color + "55" : "var(--border)"}`,
      }}
      className="relative cursor-pointer overflow-hidden flex flex-col group bg-card sm:rounded-2xl shadow-2xl"
    >
      {/* Mini Animation Diagram inside Card Header */}
      <div className="relative w-full h-[180px] sm:h-[220px] md:h-[250px] bg-background border-b border-border/50 overflow-hidden flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(243,128,32,0.05)_0%,transparent_70%)] pointer-events-none z-10" />
        <div className="absolute inset-0 flex items-center justify-center transform scale-[0.6] sm:scale-[0.7] md:scale-[0.8] origin-center dark:filter-none filter invert hue-rotate-180 contrast-125 saturate-150">
          <div className="w-[100%]">
             {getProjectAnimation(project.id)}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-5 lg:p-6 border-b border-border/50 flex-1">
        <div className="flex flex-col gap-1">
          <span style={{ color: theme.color }} className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em]">
            {project.year} • {project.type}
          </span>
          <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">
            {project.title}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1 line-clamp-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {project.techStack.slice(0, 4).map(s => (
            <span key={s} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-muted text-muted-foreground">
              {s}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded text-muted-foreground/60">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>
      </div>

        {/* Action Buttons */}
        <div className="flex w-full items-center gap-3 p-4 lg:p-6 bg-muted/10 mt-auto border-t border-border/50">
          <Link
            href={ghLink}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-secondary text-xs font-bold uppercase tracking-[0.1em] text-secondary-foreground transition-colors hover:bg-[#F38020] hover:text-white shadow-sm"
          >
            <FaGithub className="h-4 w-4" /> GitHub
          </Link>
          
          <Link
            href={webLink}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-[#F38020] hover:text-white shadow-lg shadow-primary/20"
          >
            <FaGlobe className="h-4 w-4" /> Website
          </Link>
        </div>
    </div>
  );
}

/* ─── DRAWER / MODAL ────────────────────────────────────────── */
function ProjectDrawer({ project, onClose }: { project: Project; onClose: () => void }) {
  const [vis, setVis] = useState(false);
  const theme = getProjectColor(project.id);
  const tier = project.featured ? "FLAGSHIP" : project.type.includes("Capstone") ? "CAPSTONE" : "TOOL";
  const status = project.liveUrl ? "LIVE" : "SHIPPED";
  const ghLink = project.githubUrl || "https://github.com/anberaziz5";
  const webLink = project.liveUrl || "https://github.com/anberaziz5";

  useEffect(() => { 
    requestAnimationFrame(() => setVis(true)); 
  }, []);
  
  const close = () => { 
    setVis(false); 
    setTimeout(onClose, 350); 
  };

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  if (!project) return null;
  return (
    <div
      onClick={close}
      style={{
        background: `rgba(0,0,0,${vis ? 0.75 : 0})`,
        backdropFilter: vis ? "blur(6px)" : "none",
        transition: "background 0.35s, backdrop-filter 0.35s",
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          transform: vis ? "translateY(0) scale(1)" : "translateY(40px) scale(0.96)",
          opacity: vis ? 1 : 0,
          transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease",
        }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card text-foreground shadow-2xl border border-border"
      >
        {/* Header content with Diagram! */}
        <div className="relative w-full bg-background border-b border-border flex flex-col md:flex-row">
           <div className="w-full md:w-1/2 flex flex-col justify-center p-6 lg:p-10 border-b md:border-b-0 md:border-r border-border">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F38020]">
                  {project.year} • {tier}
                </span>
                <button
                  onClick={close}
                  className="bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground rounded-full p-2 transition-colors -mt-2 -mr-2"
                >✕</button>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3">
                {project.title}
              </h2>
              <p className="text-sm text-muted-foreground font-medium">{project.type}</p>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                 <Link href={ghLink} target="_blank" className="flex-1 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider bg-secondary text-secondary-foreground hover:bg-[#F38020] hover:text-white h-12 rounded-lg transition-colors shadow-sm">
                   <FaGithub className="w-4 h-4" /> GitHub
                 </Link>
                 <Link href={webLink} target="_blank" className="flex-1 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-[#F38020] hover:text-white h-12 rounded-lg transition-colors shadow-lg shadow-primary/20">
                   <FaGlobe className="w-4 h-4" /> Website
                 </Link>
              </div>
           </div>

           {/* Full Animation Component display inside Drawer */}
           <div className="w-full md:w-1/2 min-h-[250px] flex items-center justify-center p-4 bg-background/50 overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(243,128,32,0.05)_0%,transparent_70%)]" />
              <div className="w-[120%] transform scale-[0.75] md:scale-[0.85] origin-center flex items-center justify-center pointer-events-none dark:filter-none filter invert hue-rotate-180 contrast-125 saturate-150">
                 {getProjectAnimation(project.id)}
              </div>
           </div>
        </div>

        {/* Body */}
        <div className="p-6 lg:p-10 flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F38020] mb-5">Architecture & Engineering</h4>
            <ul className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
              {project.longDescription?.map((b, i) => (
                <li key={i} style={{ animation: `fadeUp 0.4s ease ${i * 0.07 + 0.1}s both` }} className="flex gap-3">
                  <span className="text-[#F38020] shrink-0 mt-0.5">▸</span>
                  <span className="font-sans">{b}</span>
                </li>
              ))}
              {(!project.longDescription || project.longDescription.length === 0) && (
                <li className="flex gap-3">
                  <span className="text-[#F38020] shrink-0 mt-0.5">▸</span>
                  <span className="font-sans">{project.description}</span>
                </li>
              )}
            </ul>
          </div>
          
          <div className="lg:w-1/3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F38020] mb-4">Tech Stack Topology</h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map(s => (
                <span key={s} className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded bg-muted text-muted-foreground border border-border">
                  {s}
                </span>
              ))}
            </div>
            
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F38020] mt-10 mb-4">Project Meta</h4>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Category</span>
                <span className="font-medium text-foreground">{project.tags[0]}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Year</span>
                <span className="font-medium text-foreground">{project.year}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Status</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{status}</span>
                  <div className={`w-2 h-2 rounded-full ${status === 'LIVE' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-[#F38020]'}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── FILTER BAR ────────────────────────────────────────────── */
function FilterBar({ 
  activeCat, setActiveCat, 
  activeTier, setActiveTier, 
  search, setSearch, 
  count, total 
}: any) {
  return (
    <div className="mb-10 relative z-10">
      {/* Search */}
      <div className="relative mb-6 text-foreground">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F38020] text-[13px] pointer-events-none">⌕</span>
        <input
          type="text"
          placeholder="Search projects, stack, keywords..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full box-border py-3 pl-10 pr-16 bg-muted/10 border border-border rounded-[4px] font-mono text-[13px] focus:outline-none focus:border-[#F38020]/60 transition-colors"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-muted-foreground/50">
          {count}/{total}
        </span>
      </div>

      {/* Tier filter */}
      <div className="flex gap-2 flex-wrap mb-4">
        {TIERS.map(t => (
          <button
            key={t}
            onClick={() => setActiveTier(t)}
            style={{
              border: `1px solid ${activeTier === t ? "#F38020" : "var(--border)"}`,
              background: activeTier === t ? "#F38020" : "transparent",
              color: activeTier === t ? "#000000" : "var(--foreground)",
            }}
            className="px-3 py-1 text-[10px] font-mono font-bold tracking-[0.1em] rounded-[2px] cursor-pointer transition-all hover:border-[#F38020]/50"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Category scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            style={{
              border: `1px solid ${activeCat === c ? "rgba(243,128,32,0.6)" : "var(--border)"}`,
              background: activeCat === c ? "rgba(243,128,32,0.12)" : "transparent",
              color: activeCat === c ? "#F38020" : "var(--muted-foreground)",
            }}
            className="px-2.5 py-1 text-[10px] font-mono whitespace-nowrap rounded-[2px] cursor-pointer transition-all hover:border-[#F38020]/40"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── HERO SECTION ──────────────────────────────────────────── */
function Hero() {
  const [mount, setMount] = useState(false);
  useEffect(() => { setTimeout(() => setMount(true), 100); }, []);

  return (
    <div className="pt-8 md:pt-16 pb-12 relative z-10">
      {/* Top eyebrow */}
      <div style={{
        opacity: mount ? 1 : 0, 
        transform: mount ? "none" : "translateY(-14px)",
      }} className="flex items-center gap-3 mb-6 transition-all duration-700 ease-in-out">
        <div className="w-2 h-2 rounded-full bg-[#F38020] shadow-[0_0_10px_rgba(243,128,32,0.8)] animate-pulse" />
        <span className="font-mono text-[10px] font-bold text-[#F38020] uppercase tracking-[0.18em]">
          Project Archive
        </span>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-[#F38020]/50 to-transparent" />
      </div>

      {/* Title */}
      <h1 style={{
        opacity: mount ? 1 : 0,
        transform: mount ? "none" : "translateY(20px)",
      }} className="m-0 mb-5 text-[clamp(36px,6vw,72px)] font-extrabold tracking-tighter leading-[1.0] text-foreground transition-all duration-800 ease-out delay-100">
        <TypedHeadline text="Things I've" delay={200} />
        <br />
        <span className="text-[#F38020]">
          <TypedHeadline text="Built & Shipped." delay={700} />
        </span>
      </h1>

      {/* Sub */}
      <p style={{
        opacity: mount ? 1 : 0,
      }} className="m-0 mb-10 text-[15px] leading-[1.8] max-w-[600px] text-muted-foreground transition-opacity duration-900 ease-out delay-500">
        {projectsData.length} production projects spanning AI pipelines, edge inference, RAG systems, autonomous agents, and full-stack applications — all documented, deployed, and live.
      </p>

      {/* Stat row */}
      <div style={{ opacity: mount ? 1 : 0 }} className="flex gap-8 flex-wrap transition-opacity duration-900 ease-out delay-700">
        {[
          { label: "Total Projects", val: projectsData.length, suffix: "" },
          { label: "Flagship Systems", val: projectsData.filter(p => p.featured).length, suffix: "" },
          { label: "Tech Stack Items", val: 40, suffix: "+" },
          { label: "Years Active", val: 2, suffix: "+" },
        ].map(({ label, val, suffix }, i) => (
          <div key={label}>
            <div className="text-[28px] font-extrabold text-[#F38020] leading-none">
              <Counter to={val} delay={i * 150} suffix={suffix} />
            </div>
            <div className="text-[9.5px] font-mono text-muted-foreground/80 mt-1 uppercase tracking-[0.1em]">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE COMPONENT ─────────────────────────────────────────────── */
export function ProjectsPageClient() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const [selected, setSelected] = useState<Project | null>(null);
  
  const [activeCat, setActiveCat] = useState("All");
  const [activeTier, setActiveTier] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = projectsData.filter(p => {
    const pTier = p.featured ? "FLAGSHIP" : p.type.includes("Capstone") ? "CAPSTONE" : "TOOL";
    const catOk = activeCat === "All" || p.tags.includes(activeCat as any);
    const tierOk = activeTier === "All" || pTier === activeTier;
    const q = search.toLowerCase();
    const searchOk = !q || 
      p.title.toLowerCase().includes(q) || 
      p.type.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) || 
      p.techStack.some(s => s.toLowerCase().includes(q));
    return catOk && tierOk && searchOk;
  });

  return (
    <div className="min-h-screen bg-transparent text-foreground relative overflow-hidden pt-20">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        @keyframes shimmerSlide { from{opacity:0;transform:translateX(-100%)}to{opacity:1;transform:translateX(100%)} }
      `}</style>

      {/* Dynamic Backgrounds */}
      <NeuralCanvas dark={dark} />
      <HexGrid dark={dark} />

      {/* Ambient glow blobs */}
      <div className="fixed -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full pointer-events-none z-0 bg-[radial-gradient(circle,rgba(243,128,32,0.06)_0%,transparent_70%)]" />
      <div className="fixed -bottom-[200px] -left-[100px] w-[500px] h-[500px] rounded-full pointer-events-none z-0 bg-[radial-gradient(circle,rgba(123,45,139,0.05)_0%,transparent_70%)]" />

      {/* Content wrapper */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-8 pb-20">
        <Hero />

        <FilterBar
          activeCat={activeCat} setActiveCat={setActiveCat}
          activeTier={activeTier} setActiveTier={setActiveTier}
          search={search} setSearch={setSearch}
          count={filtered.length} total={projectsData.length}
        />

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground/50 font-mono text-xs">
            No projects match — try adjusting filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} onOpen={setSelected} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-20 flex items-center gap-6 pt-8 border-t border-[#F38020]/10">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#F38020]/20" />
          <a
            href="https://github.com/anberaziz"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-[3px] bg-[#F38020] text-black font-mono text-[11px] font-bold tracking-[0.1em] uppercase shadow-[0_4px_20px_rgba(243,128,32,0.4)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(243,128,32,0.55)]"
          >
            <Code2 className="w-4 h-4" /> View All on GitHub
          </a>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#F38020]/20" />
        </div>
      </div>

      {/* Drawer */}
      {selected && <ProjectDrawer project={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
