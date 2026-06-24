"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ExternalLink, CheckCircle } from "lucide-react";
import { FadeInSection } from "@/components/shared/FadeIn";

export function CertificationsSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-transparent" />;

  const dark = resolvedTheme === "dark";

  return (
    <section className="py-24 bg-transparent relative overflow-hidden w-full border-t border-border">
      <style>{`
        @keyframes orbit1 { from{transform:rotate(0deg) translateX(44px) rotate(0deg)} to{transform:rotate(360deg) translateX(44px) rotate(-360deg)} }
        @keyframes orbit2 { from{transform:rotate(120deg) translateX(44px) rotate(-120deg)} to{transform:rotate(480deg) translateX(44px) rotate(-480deg)} }
        @keyframes orbit3 { from{transform:rotate(240deg) translateX(44px) rotate(-240deg)} to{transform:rotate(600deg) translateX(44px) rotate(-600deg)} }
        @keyframes spin-ring { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes spin-ring-rev { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes float-card { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 12px 2px rgba(246,130,31,0.2)} 50%{box-shadow:0 0 24px 6px rgba(246,130,31,0.4)} }
        @keyframes scan { 0%{top:-2px;opacity:0} 5%{opacity:1} 90%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes shimmer-move { 0%{left:-80%} 100%{left:130%} }
        @keyframes tick-in { from{transform:scale(0) rotate(-90deg);opacity:0} to{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes ring-draw { from{stroke-dashoffset:220} to{stroke-dashoffset:0} }
        @keyframes particle-float {
          0%{transform:translate(0,0) scale(1);opacity:0.7}
          50%{transform:translate(var(--px),var(--py)) scale(1.4);opacity:0.4}
          100%{transform:translate(0,0) scale(1);opacity:0.7}
        }

        .orbital-system { position:relative; width:120px; height:120px; flex-shrink:0; animation:float-card 4s ease-in-out infinite; }
        .orbital-core { position:absolute; inset:50%; transform:translate(-50%,-50%); width:48px; height:48px; border-radius:50%; background:hsl(var(--primary)); display:flex; align-items:center; justify-content:center; animation:pulse-glow 2.5s ease-in-out infinite; z-index:3; }
        .orbital-core svg { width:24px; height:24px; }
        .ring { position:absolute; inset:50%; border-radius:50%; border:1px dashed hsl(var(--primary)/0.35); transform-origin:center; }
        .ring-1 { width:80px; height:80px; margin:-40px; animation:spin-ring 8s linear infinite; }
        .ring-2 { width:110px; height:110px; margin:-55px; animation:spin-ring-rev 12s linear infinite; border-style:solid; border-color:hsl(var(--primary)/0.15); }
        .dot { position:absolute; width:8px; height:8px; border-radius:50%; background:hsl(var(--primary)); top:50%; left:50%; margin:-4px; }
        .dot-1 { animation:orbit1 8s linear infinite; }
        .dot-2 { animation:orbit2 8s linear infinite; }
        .dot-3 { animation:orbit3 8s linear infinite; }

        .cert-card { position:relative; overflow:hidden; transition:transform 0.3s, border-color 0.3s; display: flex; flex-direction: column; }
        .cert-card:hover { transform:translateY(-4px); border-color:hsl(var(--primary)/0.5); }
        .cert-card:hover .card-shimmer { animation:shimmer-move 0.7s ease forwards; }
        .cert-card:hover .scan-line { animation:scan 1.4s ease forwards; }

        .card-shimmer { position:absolute; top:0; bottom:0; width:70px; background:linear-gradient(105deg,transparent,hsl(var(--primary)/0.1),transparent); pointer-events:none; z-index:2; left:-80%; }
        .scan-line { position:absolute; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,hsl(var(--primary)/0.5),transparent); pointer-events:none; z-index:3; opacity:0; }

        .verify-ring { width:32px; height:32px; position:relative; flex-shrink:0; }
        .verify-ring svg { position:absolute; inset:0; }
        .ring-bg { stroke:hsl(var(--primary)/0.15); }
        .ring-fg { stroke:hsl(var(--primary)); stroke-dasharray:220; stroke-dashoffset:0; animation:ring-draw 1.2s cubic-bezier(0.22,1,0.36,1) both; transform-origin:center; }
        .tick-icon { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; animation:tick-in 0.5s cubic-bezier(0.22,1,0.36,1) both; }

        .particles { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
        .particle { position:absolute; width:3px; height:3px; border-radius:50%; background:hsl(var(--primary)); opacity:0; animation:particle-float var(--dur,4s) ease-in-out var(--delay,0s) infinite; }
      `}</style>

      <div className="container mx-auto px-4 md:px-6">
        <FadeInSection>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16">
            <div className="orbital-system" aria-hidden="true">
              <div className="ring ring-2"></div>
              <div className="ring ring-1">
                <div className="dot dot-1"></div>
                <div className="dot dot-2"></div>
                <div className="dot dot-3"></div>
              </div>
              <div className="orbital-core">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Verified <span className="text-primary">Credentials</span></h2>
              <div className="w-20 h-1 bg-primary mb-6 rounded-full mx-auto md:mx-0" />
              <p className="text-muted-foreground text-lg max-w-2xl">
                Industry certifications from Google & IBM via Coursera — fully verified, active, and battle-tested.
              </p>
            </div>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FadeInSection delay={0.1}>
            <div className="cert-card p-6 bg-card border border-border rounded-2xl shadow-sm h-full">
              <div className="particles">
                <div className="particle" style={{ left: "15%", top: "30%", "--px": "-12px", "--py": "-18px", "--dur": "3.8s", "--delay": "0s" } as React.CSSProperties}></div>
                <div className="particle" style={{ left: "75%", top: "60%", "--px": "10px", "--py": "-22px", "--dur": "4.2s", "--delay": "1s" } as React.CSSProperties}></div>
              </div>
              <div className="card-shimmer"></div>
              <div className="scan-line"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  G
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">Google</div>
                  <div className="text-xs text-muted-foreground/60">via Coursera</div>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-2 text-foreground">IT Support Professional</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1">
                Covered fundamentals of computer networking, systems administration, and IT security, providing a rock-solid foundation for infrastructure.
              </p>

              <div className="flex items-center justify-between border-t border-border pt-4 mb-6">
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded">2024</span>
                <div className="verify-ring">
                  <svg viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="13" strokeWidth="2" className="ring-bg"/>
                    <circle cx="16" cy="16" r="13" strokeWidth="2" strokeLinecap="round" className="ring-fg" transform="rotate(-90 16 16)" style={{ animationDelay: '0.4s' }}/>
                  </svg>
                  <div className="tick-icon" style={{ animationDelay: '0.8s' }}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7l3 3 6-6"/></svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-all hover:brightness-110 active:scale-95" onClick={() => window.open('https://www.coursera.org', '_blank')}>
                  <CheckCircle className="w-4 h-4" /> Verify Credential
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-transparent text-foreground border border-border py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-muted active:scale-95" onClick={() => console.log('Details: Google IT')}>
                  <ExternalLink className="w-4 h-4" /> View Details
                </button>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <div className="cert-card p-6 bg-card border border-border rounded-2xl shadow-sm h-full">
              <div className="particles">
                <div className="particle" style={{ left: "20%", top: "50%", "--px": "14px", "--py": "-16px", "--dur": "4.1s", "--delay": "0.3s" } as React.CSSProperties}></div>
                <div className="particle" style={{ left: "80%", top: "25%", "--px": "-10px", "--py": "18px", "--dur": "3.7s", "--delay": "0.8s" } as React.CSSProperties}></div>
              </div>
              <div className="card-shimmer"></div>
              <div className="scan-line"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm bg-blue-900/10 text-blue-700 dark:text-blue-400 border border-blue-900/20 tracking-tighter">
                  IBM
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">IBM</div>
                  <div className="text-xs text-muted-foreground/60">via Coursera</div>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-2 text-foreground">Data Analysis Using Python</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1">
                Mastered data wrangling, exploratory data analysis (EDA), and predictive modeling using Pandas, NumPy, and Scikit-Learn.
              </p>

              <div className="flex items-center justify-between border-t border-border pt-4 mb-6">
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded">2026</span>
                <div className="verify-ring">
                  <svg viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="13" strokeWidth="2" className="ring-bg"/>
                    <circle cx="16" cy="16" r="13" strokeWidth="2" strokeLinecap="round" className="ring-fg" transform="rotate(-90 16 16)" style={{ animationDelay: '0.5s' }}/>
                  </svg>
                  <div className="tick-icon" style={{ animationDelay: '0.9s' }}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7l3 3 6-6"/></svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-all hover:brightness-110 active:scale-95" onClick={() => window.open('https://www.coursera.org', '_blank')}>
                  <CheckCircle className="w-4 h-4" /> Verify Credential
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-transparent text-foreground border border-border py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-muted active:scale-95" onClick={() => console.log('Details: IBM Python')}>
                  <ExternalLink className="w-4 h-4" /> View Details
                </button>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.3}>
            <div className="cert-card p-6 bg-card border border-border rounded-2xl shadow-sm h-full">
              <div className="particles">
                <div className="particle" style={{ left: "30%", top: "40%", "--px": "-16px", "--py": "12px", "--dur": "3.9s", "--delay": "0.5s" } as React.CSSProperties}></div>
                <div className="particle" style={{ left: "70%", top: "70%", "--px": "12px", "--py": "-18px", "--dur": "4.3s", "--delay": "1.1s" } as React.CSSProperties}></div>
              </div>
              <div className="card-shimmer"></div>
              <div className="scan-line"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm bg-blue-900/10 text-blue-700 dark:text-blue-400 border border-blue-900/20 tracking-tighter">
                  IBM
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">IBM</div>
                  <div className="text-xs text-muted-foreground/60">via Coursera</div>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-2 text-foreground">Data Visualization</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1">
                Advanced techniques for visual storytelling and dashboarding using Matplotlib, Seaborn, Folium, and Plotly in production.
              </p>

              <div className="flex items-center justify-between border-t border-border pt-4 mb-6">
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded">2026</span>
                <div className="verify-ring">
                  <svg viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="13" strokeWidth="2" className="ring-bg"/>
                    <circle cx="16" cy="16" r="13" strokeWidth="2" strokeLinecap="round" className="ring-fg" transform="rotate(-90 16 16)" style={{ animationDelay: '0.6s' }}/>
                  </svg>
                  <div className="tick-icon" style={{ animationDelay: '1.0s' }}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7l3 3 6-6"/></svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-all hover:brightness-110 active:scale-95" onClick={() => window.open('https://www.coursera.org', '_blank')}>
                  <CheckCircle className="w-4 h-4" /> Verify Credential
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-transparent text-foreground border border-border py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-muted active:scale-95" onClick={() => console.log('Details: IBM Vis')}>
                  <ExternalLink className="w-4 h-4" /> View Details
                </button>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
