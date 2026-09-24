"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { projectsData, Project } from "@/lib/data/projects-data";
import Code2 from "lucide-react/dist/esm/icons/code-2";
import ExternalLink from "lucide-react/dist/esm/icons/external-link";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import Brain from "lucide-react/dist/esm/icons/brain";
import Users from "lucide-react/dist/esm/icons/users";
import Network from "lucide-react/dist/esm/icons/network";
import Trees from "lucide-react/dist/esm/icons/trees";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";
import TrendingUp from "lucide-react/dist/esm/icons/trending-up";
import MapIcon from "lucide-react/dist/esm/icons/map";
import Search from "lucide-react/dist/esm/icons/search";
import BookOpen from "lucide-react/dist/esm/icons/book-open";
import Database from "lucide-react/dist/esm/icons/database";
import Zap from "lucide-react/dist/esm/icons/zap";
import Bot from "lucide-react/dist/esm/icons/bot";
import FileCheck from "lucide-react/dist/esm/icons/file-check";
import Layers from "lucide-react/dist/esm/icons/layers";
import Layout from "lucide-react/dist/esm/icons/layout";
import FileCode2 from "lucide-react/dist/esm/icons/file-code-2";
import { SiPython, SiReact, SiNodedotjs, SiMongodb, SiDocker, SiStreamlit, SiFastapi, SiGithub, SiFlask, SiVercel, SiDuckduckgo, SiCloudflare, SiSqlite, SiExpress, SiJavascript, SiCss } from "react-icons/si";
import { FaGithub, FaGlobe } from "react-icons/fa";
import Link from "next/link";
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
import { ProjectVisual } from "@/components/ui/ProjectVisual";

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
    case "cyberguard": return <PortfolioDiagram />; // Portfolio covers the full-stack security dashboard nicely
    default: return <TaskManagerDiagram />;
  }
};

// Mapping Tech Stack names to icons
const getTechIcon = (tech: string) => {
  const t = tech.toLowerCase();
  if (t.includes("python")) return <SiPython className="w-5 h-5" aria-label="Python icon" />;
  if (t.includes("react")) return <SiReact className="w-5 h-5" aria-label="React icon" />;
  if (t.includes("node")) return <SiNodedotjs className="w-5 h-5" aria-label="Node.js icon" />;
  if (t.includes("mongo")) return <SiMongodb className="w-5 h-5" aria-label="MongoDB icon" />;
  if (t.includes("docker")) return <SiDocker className="w-5 h-5" aria-label="Docker icon" />;
  if (t.includes("streamlit")) return <SiStreamlit className="w-5 h-5" aria-label="Streamlit icon" />;
  if (t.includes("fastapi")) return <SiFastapi className="w-5 h-5" aria-label="FastAPI icon" />;
  if (t.includes("github")) return <SiGithub className="w-5 h-5" aria-label="GitHub icon" />;
  if (t.includes("flask")) return <SiFlask className="w-5 h-5" aria-label="Flask icon" />;
  if (t.includes("vercel")) return <SiVercel className="w-5 h-5" aria-label="Vercel icon" />;
  if (t.includes("duckduckgo")) return <SiDuckduckgo className="w-5 h-5" aria-label="DuckDuckGo icon" />;
  if (t.includes("cloudflare")) return <SiCloudflare className="w-5 h-5" aria-label="Cloudflare icon" />;
  if (t.includes("sqlite")) return <SiSqlite className="w-5 h-5" aria-label="SQLite icon" />;
  if (t.includes("express")) return <SiExpress className="w-5 h-5" aria-label="Express icon" />;
  if (t.includes("javascript") || t.includes("js")) return <SiJavascript className="w-5 h-5" aria-label="JavaScript icon" />;
  if (t.includes("css")) return <SiCss className="w-5 h-5" aria-label="CSS icon" />;
  if (t.includes("gemini")) return <Sparkles className="w-5 h-5" aria-label="Gemini icon" />;
  if (t.includes("machine learning") || t.includes("ai")) return <Brain className="w-5 h-5" aria-label="AI icon" />;
  if (t.includes("role-based")) return <Users className="w-5 h-5" aria-label="Role-based icon" />;
  if (t.includes("microservices")) return <Network className="w-5 h-5" aria-label="Microservices icon" />;
  if (t.includes("isolation forest") || t.includes("xgboost")) return <Trees className="w-5 h-5" aria-label="Trees icon" />;
  if (t.includes("folium")) return <MapIcon className="w-5 h-5" aria-label="Map icon" />;
  if (t.includes("rag")) return <Search className="w-5 h-5" aria-label="Search icon" />;
  if (t.includes("arxiv")) return <BookOpen className="w-5 h-5" aria-label="Book icon" />;
  if (t.includes("qdrant") || t.includes("database")) return <Database className="w-5 h-5" aria-label="Database icon" />;
  if (t.includes("groq")) return <Zap className="w-5 h-5" aria-label="Groq icon" />;
  if (t.includes("llama")) return <Bot className="w-5 h-5" aria-label="Llama icon" />;
  if (t.includes("pydantic")) return <FileCheck className="w-5 h-5" aria-label="Pydantic icon" />;
  if (t.includes("mern stack")) return <Layers className="w-5 h-5" aria-label="MERN icon" />;
  if (t.includes("dom")) return <Layout className="w-5 h-5" aria-label="DOM icon" />;

  return <FileCode2 className="w-5 h-5" aria-label="Code icon" />;
};

function TechStackMarquee({ techStack }: { techStack: string[] }) {
  const stack = [...techStack, ...techStack, ...techStack];

  return (
    <div className="relative flex w-full overflow-hidden border-y border-border/50 bg-muted/20 py-3 mask-edges">
      <motion.div
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ ease: "linear", duration: 15, repeat: Infinity }}
        className="flex w-max items-center gap-6 px-4"
      >
        {stack.map((tech, i) => (
          <div
            key={i}
            className="group relative flex cursor-default items-center justify-center text-muted-foreground transition-none hover:text-[#F38020]"
          >
            {getTechIcon(tech)}
            {/* Tooltip */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-[10px] font-bold tracking-widest text-background opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
              {tech.toUpperCase()}
            </span>
          </div>
        ))}
      </motion.div>
      <style jsx>{`
        .mask-edges {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </div>
  );
}

const StickyProjectCard = ({
  i,
  project,
  progress,
  range,
  targetScale,
}: {
  i: number;
  project: Project;
  progress: any;
  range: [number, number];
  targetScale: number;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);
  const ghLink = project.githubUrl || "https://github.com/anberaziz5";
  const webLink = project.liveUrl || "https://github.com/anberaziz5";

  return (
    <div ref={container} className="sticky top-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 mb-24">
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 15 + 120}px)`,
        }}
        className="relative -top-1/4 flex origin-top flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card shadow-2xl
                   h-auto w-[320px] 
                   sm:w-[480px] 
                   md:w-[600px] 
                   lg:w-[700px]"
      >
        <div className="relative w-full aspect-video shrink-0 overflow-hidden bg-background border-b border-border/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(243,128,32,0.05)_0%,transparent_70%)] pointer-events-none z-10" />
          <div className="absolute inset-0 pointer-events-none dark:filter-none filter invert hue-rotate-180 contrast-125 saturate-150">
            <ProjectVisual>{getProjectAnimation(project.id)}</ProjectVisual>
          </div>
        </div>

        {/* Below Picture: Tech Stack Marquee (Icons Only) */}
        <TechStackMarquee techStack={project.techStack} />

        {/* Below Marquee: Description and Title */}
        <div className="flex flex-col gap-2 p-5 lg:p-6 border-b border-border/50">
          <div className="flex flex-col gap-1">
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F38020]">
              {project.year} • {project.type}
            </span>
            <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">
              <Link href={ghLink} target="_blank" className="hover:text-[#F38020] transition-colors decoration-muted hover:underline underline-offset-4">
                {project.title}
              </Link>
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1 line-clamp-4">
            {project.longDescription ? project.longDescription.join(" ") : project.description}
          </p>
        </div>

        {/* Below Description: Buttons */}
        <div className="flex w-full items-center gap-3 p-4 lg:p-6 bg-muted/10">
          <Link
            href={ghLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-secondary text-xs font-bold uppercase tracking-[0.1em] text-secondary-foreground transition-none hover:bg-[#F38020] hover:text-white"
          >
            <FaGithub className="h-4 w-4" aria-label="GitHub icon" /> GitHub
          </Link>
          
          <Link
            href={webLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-xs font-bold uppercase tracking-[0.1em] text-white transition-none hover:bg-[#F38020] hover:text-white shadow-lg shadow-primary/20"
          >
            <FaGlobe className="h-4 w-4" aria-label="Website icon" /> View Live Deployment
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export const ProjectsSection = () => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <section className="bg-transparent pt-24 border-t border-border/50 relative z-10">
      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center">
        <div className="text-center mb-24 max-w-2xl">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 uppercase">
            System <span className="text-[#F38020]">Architectures</span>
          </h2>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-[0.2em]">
            // End-To-End Machine Learning & Full-Stack Deployments
          </p>
        </div>
      </div>

      <main
        ref={container}
        className="relative flex w-full flex-col items-center justify-center 
                     pb-[20vh] pt-[5vh] 
                     sm:pb-[30vh] sm:pt-[8vh] 
                     lg:pb-[40vh] lg:pt-[10vh]"
      >
        {projectsData.map((project, i) => {
          const targetScale = Math.max(0.6, 1 - (projectsData.length - i - 1) * 0.05);
          return (
            <StickyProjectCard
              key={project.id}
              i={i}
              project={project}
              progress={scrollYProgress}
              range={[i * (1 / projectsData.length), 1]}
              targetScale={targetScale}
            />
          );
        })}
      </main>
    </section>
  );
};
