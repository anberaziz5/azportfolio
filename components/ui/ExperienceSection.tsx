"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { FadeInSection } from "@/components/shared/FadeIn";

const experiences = [
  {
    id: 1,
    role: "Full-Stack & AI Developer",
    company: "Independent Projects",
    type: "self",
    period: "Jan 2026 — Present",
    location: "Open-Source · Freelance · Remote",
    tags: ["LLM Pipelines", "RAG Systems", "MERN", "Edge Inference", "Autonomous Agents"],
    bullets: [
      "Designing, building, and shipping AI-integrated web applications and backend services — production-grade LLM pipelines, RAG systems, ML-powered APIs.",
      "Maintaining public repositories covering autonomous agent orchestration, ML anomaly detection, edge-native inference, and developer tooling.",
      "Available for freelance in web dev, AI/ML integration, RAG pipelines, and cloud deployment on Vercel, Hugging Face, and Cloudflare.",
    ],
    badge: "ACTIVE",
    icon: "⬡",
  },
  {
    id: 2,
    role: "Web Development Intern",
    company: "NovaSole Pakistan",
    type: "work",
    period: "Jun 2024 — Sep 2024",
    location: "Kasur, Pakistan · E-Commerce",
    tags: ["Frontend", "Backend", "SEO", "Performance", "Cross-Browser"],
    bullets: [
      "Developed and maintained frontend and backend components of a live production e-commerce platform, improving UX and checkout reliability.",
      "Optimized performance via image compression and browser-level caching, achieving measurable reductions in page load time.",
      "Applied on-page SEO: structured metadata, semantic HTML, canonical URL management — growing organic search traffic measurably.",
      "Systematic cross-browser testing and debugging for consistent functionality across all major environments.",
    ],
    badge: "E-COMMERCE",
    icon: "◈",
  },
  {
    id: 3,
    role: "IT Infrastructure Intern",
    company: "MITE — Mubashar's Institute",
    type: "work",
    period: "May 2024 — Jun 2024",
    location: "Kasur, Pakistan · Network Admin",
    tags: ["Networking", "CCTV", "IT Support", "Infrastructure"],
    bullets: [
      "Supported installation and maintenance of campus-wide network infrastructure serving 230+ students and staff.",
      "Maintained CCTV surveillance systems and provided first-line technical support, minimizing downtime.",
    ],
    badge: "IT OPS",
    icon: "◉",
  },
];

const OrangeParticles = ({ dark }: { dark: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Using a ResizeObserver to handle canvas resizing better
    const updateSize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const W = canvas.width, H = canvas.height;
    const particles = Array.from({ length: 38 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.12,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        // Map to primary color if possible, keeping the orange essence
        ctx.fillStyle = `rgba(243, 128, 32, ${p.alpha})`; // #F38020
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateSize);
    };
  }, [dark]);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-50" />;
};

const HexGrid = ({ dark }: { dark: boolean }) => (
  <svg className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity ${dark ? 'opacity-5' : 'opacity-[0.03]'}`} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="hex" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
        <polygon points="28,4 50,16 50,32 28,44 6,32 6,16" fill="none" stroke="currentColor" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hex)" className="text-foreground" />
  </svg>
);

const ScanLine = () => {
  const [y, setY] = useState(-10);
  useEffect(() => {
    let frame: number;
    let val = -10;
    const animate = () => {
      val = (val + 0.4) % 110;
      setY(val);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <div 
      className="absolute left-0 right-0 h-[2px] pointer-events-none z-[1] transition-all duration-75 ease-linear"
      style={{
        top: `${y}%`,
        background: `linear-gradient(90deg, transparent 0%, rgba(243,128,32,0.18) 30%, rgba(243,128,32,0.55) 50%, rgba(243,128,32,0.18) 70%, transparent 100%)`,
      }} 
    />
  );
};

const Card = ({ exp, index, dark, active, onClick }: { exp: any, index: number, dark: boolean, active: number | null, onClick: (id: number) => void }) => {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const isActive = active === exp.id;

  return (
    <div
      ref={ref}
      onClick={() => onClick(exp.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 mb-4 border ${
        isActive 
          ? 'border-primary bg-primary/5 shadow-[0_0_0_1px_rgba(243,128,32,0.2),0_8px_40px_rgba(243,128,32,0.1)]' 
          : 'border-border bg-card hover:border-primary/40 hover:shadow-[0_4px_24px_rgba(243,128,32,0.08)]'
      }`}
      style={{
        transform: visible
          ? isActive ? "translateX(6px)" : hovered ? "translateX(3px)" : "translateX(0)"
          : "translateX(-32px)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${index * 0.1}s`,
      }}
    >
      {/* Left accent bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 bg-gradient-to-b from-primary to-orange-400 transition-all duration-300 ease-out"
        style={{ width: isActive ? "4px" : "0px" }} 
      />

      {/* Shimmer on hover */}
      {hovered && !isActive && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-[80%] animate-[shimmer-move_0.8s_ease_forwards]" />
      )}

      <div className="p-6 md:p-8 pl-8 md:pl-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xl transition-all ${isActive ? 'text-primary drop-shadow-[0_0_6px_rgba(243,128,32,0.6)]' : 'text-primary'}`}>{exp.icon}</span>
              <h3 className="text-xl font-bold tracking-tight">{exp.role}</h3>
            </div>
            <p className="font-mono text-sm font-semibold text-primary uppercase tracking-wider">{exp.company}</p>
          </div>
          <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-1">
            <span className={`inline-block px-3 py-1 rounded text-xs font-bold font-mono tracking-widest border transition-all ${
              isActive 
                ? 'bg-primary border-primary text-primary-foreground' 
                : 'bg-transparent border-primary/30 text-primary'
            }`}>
              {exp.badge}
            </span>
            <span className="font-mono text-xs text-muted-foreground">{exp.period}</span>
          </div>
        </div>

        <p className="font-mono text-xs text-muted-foreground flex items-center gap-2 mb-4">
          <span className="text-primary text-[10px]">◆</span>
          {exp.location}
        </p>

        <div className={`flex flex-wrap gap-2 transition-all ${isActive ? 'mb-6' : 'mb-0'}`}>
          {exp.tags.map((tag: string) => (
            <span key={tag} className="font-mono text-[10px] sm:text-xs font-medium text-muted-foreground bg-muted border border-border px-2.5 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        <div 
          className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ maxHeight: isActive ? "500px" : "0" }}
        >
          <div className="border-t border-border pt-6 mt-2 space-y-4">
            {exp.bullets.map((b: string, i: number) => (
              <div 
                key={i} 
                className="flex gap-3 transition-all duration-500"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateY(0)" : "translateY(8px)",
                  transitionDelay: `${i * 0.1 + 0.1}s`,
                }}
              >
                <span className="text-primary text-xs mt-1 shrink-0">▸</span>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Timeline = ({ dark }: { dark: boolean }) => {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let p = 0;
        const iv = setInterval(() => { 
          p = Math.min(p + 1, 100); 
          setProgress(p); 
          if (p >= 100) clearInterval(iv); 
        }, 12);
      }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="p-6 rounded-2xl border border-border bg-card shadow-sm mb-8">
      <p className="font-mono text-[10px] text-primary uppercase tracking-widest mb-6">Timeline · 2024 → Present</p>
      <div className="relative h-1.5 bg-muted rounded-full">
        <div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all duration-100 ease-out"
          style={{ width: `${progress}%`, boxShadow: progress > 0 ? '0 0 10px rgba(243,128,32,0.5)' : 'none' }} 
        />
        {[{ label: "May '24", pos: 0 }, { label: "Jun '24", pos: 33 }, { label: "Sep '24", pos: 66 }, { label: "Jan '26", pos: 85 }, { label: "Now", pos: 100 }].map(p => (
          <div key={p.pos} className="absolute top-[-5px] -translate-x-1/2" style={{ left: `${p.pos}%` }}>
            <div 
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                progress >= p.pos 
                  ? 'border-primary bg-primary shadow-[0_0_8px_rgba(243,128,32,0.6)]' 
                  : 'border-muted-foreground/30 bg-card'
              }`} 
            />
            <span className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-muted-foreground whitespace-nowrap">
              {p.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatPanel = ({ dark }: { dark: boolean }) => {
  const stats = [
    { label: "Years Active", val: "2+", sub: "since 2024" },
    { label: "Projects", val: "∞", sub: "open-source" },
    { label: "Stack", val: "Full", sub: "AI to Edge" },
    { label: "Status", val: "Open", sub: "for freelance" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 mb-8">
      {stats.map(s => (
        <div key={s.label} className="p-4 rounded-xl border border-border bg-card shadow-sm">
          <div className="text-2xl md:text-3xl font-bold text-primary leading-none mb-2">{s.val}</div>
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
          <div className="font-mono text-[10px] text-muted-foreground/60 mt-0.5">{s.sub}</div>
        </div>
      ))}
    </div>
  );
};

export function ExperienceSection() {
  const { resolvedTheme } = useTheme();
  const [active, setActive] = useState<number | null>(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-transparent" />;

  const dark = resolvedTheme === "dark";

  const handleCard = (id: number) => setActive(a => a === id ? null : id);

  return (
    <section className="py-24 bg-transparent relative overflow-hidden w-full border-t border-border">
      <style>{`
        @keyframes shimmer-move { 0%{left:-80%} 100%{left:130%} }
        @keyframes pulse-ring { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.35);opacity:0} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>

      {/* Background Physics Layers */}
      <HexGrid dark={dark} />
      <OrangeParticles dark={dark} />
      <ScanLine />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Standardized Header */}
        <FadeInSection>
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Professional <span className="text-primary">Experience</span>
            </h2>
            <div className="w-20 h-1 bg-primary mb-6 rounded-full" />
            <p className="text-lg text-muted-foreground max-w-2xl">
              AI systems, production infrastructure, and full-stack applications — shipped independently and at companies.
            </p>
          </div>
        </FadeInSection>

        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8 xl:gap-12 items-start">
          
          {/* Cards Column */}
          <div className="flex flex-col w-full">
            <FadeInSection delay={0.1}>
              {experiences.map((exp, i) => (
                <Card key={exp.id} exp={exp} index={i} dark={dark} active={active} onClick={handleCard} />
              ))}
            </FadeInSection>
          </div>

          {/* Sidebar Column */}
          <div className="w-full sticky top-32">
            <FadeInSection delay={0.2}>
              <StatPanel dark={dark} />
              <Timeline dark={dark} />

              {/* CF badge */}
              <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 animate-[float_4s_ease-in-out_infinite] shadow-sm mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl text-primary drop-shadow-[0_0_5px_rgba(243,128,32,0.5)]">⬡</span>
                  <span className="font-mono text-xs text-primary tracking-widest uppercase font-bold">Cloudflare Stack</span>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                  Workers · Pages<br />
                  KV · D1 · R2<br />
                  AI Gateway · RAG
                </p>
              </div>

              {/* Hire CTA */}
              <div 
                className="p-5 rounded-2xl bg-gradient-to-br from-primary to-orange-500 cursor-pointer shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                onClick={() => window.location.href = '/contact'}
              >
                <div className="font-mono text-xs font-bold text-white tracking-widest uppercase">Available for Freelance</div>
                <div className="font-mono text-[11px] text-white/80 mt-1">Remote · Worldwide</div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>
    </section>
  );
}
