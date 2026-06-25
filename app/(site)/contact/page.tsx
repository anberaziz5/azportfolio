"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { Mail, MapPin } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

/* ══════════════════════════════════════════════════════════════
   SIGNAL TRANSMISSION — the signature animation
══════════════════════════════════════════════════════════════ */
function SignalTransmission({ triggered }: { triggered: boolean }) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [phase, setPhase] = useState(0); // 0=idle 1=traveling 2=received 3=done
  const [packetX, setPacketX] = useState(0);

  useEffect(() => {
    if (!triggered) { setPhase(0); setPacketX(0); return; }
    setPhase(1); setPacketX(0);
    let start: number | null = null;
    const dur = 1200;
    const anim = (ts: number) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / dur, 1);
      setPacketX(prog);
      if (prog < 1) requestAnimationFrame(anim);
      else { setPhase(2); setTimeout(() => setPhase(3), 600); }
    };
    requestAnimationFrame(anim);
  }, [triggered]);

  const surfaceColor = "var(--card)";

  return (
    <div className="relative w-full h-12 mb-3 overflow-visible">
      <svg width="100%" height="48" style={{ overflow:"visible" }}>
        {/* Wire */}
        <line x1="20" y1="24" x2="calc(100% - 20px)" y2="24"
          stroke={phase >= 1 ? "#F38020" : "currentColor"}
          className="text-border transition-all duration-400"
          strokeWidth="1.5" strokeDasharray={phase === 1 ? "6 4" : "none"}
        />
        {/* Source node */}
        <circle cx="20" cy="24" r="7" fill={phase >= 1 ? "#F38020" : surfaceColor} stroke="#F38020" strokeWidth="1.5" />
        <text x="20" y="28" textAnchor="middle" fill={phase>=1?"#fff":"#F38020"} fontSize="8" className="font-mono">TX</text>
        {/* Destination node */}
        <circle cx="calc(100% - 20px)" cy="24" r="7"
          fill={phase >= 2 ? "#F38020" : surfaceColor}
          stroke="#F38020" strokeWidth="1.5"
          className="transition-colors duration-300" />
        <text x="calc(100% - 20px)" y="28" textAnchor="middle" fill={phase>=2?"#fff":"#F38020"} fontSize="8" className="font-mono">RX</text>
        {/* Traveling packet */}
        {phase === 1 && (
          <rect
            x={`calc(${packetX * 100}% - 10px)`} y="18" width="16" height="12" rx="2"
            fill="#F38020" style={{ filter:"drop-shadow(0 0 6px rgba(243,128,32,0.9))" }}
          />
        )}
        {/* Received burst */}
        {phase === 2 && [0,60,120,180,240,300].map((deg, i) => (
          <circle key={i}
            cx={`calc(100% - ${20 - Math.cos(deg*Math.PI/180)*18}px)`}
            cy={24 + Math.sin(deg*Math.PI/180)*18}
            r="2.5" fill="#ffb169" opacity="0.8"
            style={{ animation:`burstDot 0.5s ease ${i*0.04}s both` }}
          />
        ))}
      </svg>
      {/* Status text */}
      <div className={`absolute bottom-[-4px] left-0 right-0 text-center font-mono text-[9px] tracking-[0.12em] transition-colors duration-300 ${phase===0 ? 'text-muted-foreground' : phase===1 ? 'text-[#ffb169]' : 'text-green-500'}`}>
        {phase===0 && "READY TO TRANSMIT"}
        {phase===1 && "⟶ PACKET IN TRANSIT..."}
        {phase>=2 && "✓ MESSAGE RECEIVED"}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LIVE CLOCK
══════════════════════════════════════════════════════════════ */
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const iv = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(iv); }, []);
  const h = time.toLocaleTimeString("en-PK", { hour:"2-digit", minute:"2-digit", second:"2-digit", timeZone:"Asia/Karachi" });
  return (
    <div className="flex flex-col gap-[2px]">
      <div className="font-mono text-[22px] font-bold text-[#F38020] tracking-wider leading-none">{h}</div>
      <div className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase mt-1">PKT (UTC+5) · Lahore, Pakistan</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   AVAILABILITY BEACON
══════════════════════════════════════════════════════════════ */
function AvailBeacon() {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3.5 rounded border border-green-500/25 bg-green-500/5">
      <div className="relative w-2.5 h-2.5 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
        <div className="absolute -inset-1 rounded-full border-[1.5px] border-green-500/40 animate-pulseBeacon" />
      </div>
      <div>
        <div className="font-mono text-[10px] font-bold text-green-500 tracking-[0.08em]">AVAILABLE FOR FREELANCE</div>
        <div className="font-mono text-[9px] text-muted-foreground mt-px">Web dev · AI/ML · RAG · Cloud</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CONTACT CHANNEL CARD
══════════════════════════════════════════════════════════════ */
function ChannelCard({ icon, label, value, href, index }: any) {
  const [hov, setHov] = useState(false);
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <a
      ref={ref} href={href} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ease-out bg-card hover:bg-[#F38020]/10"
      style={{
        borderColor: hov ? "rgba(243,128,32,0.5)" : "var(--border)",
        transform: vis ? (hov ? "translateX(6px)" : "translateX(0)") : "translateX(-20px)",
        opacity: vis ? 1 : 0,
        transitionDelay: !vis ? `${index*0.08}s` : "0s",
        boxShadow: hov ? "0 4px 20px rgba(243,128,32,0.12)" : "none",
      }}
    >
      <span className="shrink-0 transition-all duration-200" style={{ filter: hov ? "drop-shadow(0 0 5px rgba(243,128,32,0.7))" : "none", color: hov ? "#F38020" : "currentColor" }}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-0.5">{label}</div>
        <div className="font-mono text-[11.5px] font-semibold truncate transition-colors duration-200" style={{ color: hov ? "#F38020" : "var(--foreground)" }}>{value}</div>
      </div>
      <span className="text-[12px] transition-all duration-200" style={{ color: hov ? "#F38020" : "var(--muted-foreground)", transform: hov ? "translateX(3px)" : "none" }}>→</span>
    </a>
  );
}

/* ══════════════════════════════════════════════════════════════
   ANIMATED FORM FIELD
══════════════════════════════════════════════════════════════ */
function Field({ label, name, type="text", placeholder, value, onChange, error, multiline=false, rows=5 }: any) {
  const [foc, setFoc] = useState(false);
  
  const baseClass = `w-full box-border bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-3 text-foreground placeholder:text-muted-foreground/50 text-base focus:border-[#F38020] focus:ring-0 focus:outline-none transition-colors duration-300 resize-none ${error ? "border-red-500" : ""}`;
  
  return (
    <div className="mb-6">
      <label className={`block mb-2 text-sm font-medium transition-colors duration-200 ${error ? "text-red-500" : foc ? "text-[#F38020]" : "text-muted-foreground"}`}>
        {label}
        {error && <span className="ml-2 font-normal normal-case tracking-normal">{error}</span>}
      </label>
      <div className="relative">
        {foc && (
          <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] pointer-events-none z-10 animate-circuitTrace" 
               style={{ background:"linear-gradient(90deg, transparent, #F38020 20%, #ffb169 50%, #F38020 80%, transparent)" }} />
        )}
        {multiline
          ? <textarea name={name} rows={rows} placeholder={placeholder} value={value} onChange={onChange}
              onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
              className={baseClass} />
          : <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange}
              onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
              className={baseClass} />
        }
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [errors, setErrors] = useState<any>({});
  const [submitState, setSubmitState] = useState("idle"); // idle | sending | sent | error
  const [signalTriggered, setSignalTriggered] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const onChange = useCallback((e: any) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er: any) => ({ ...er, [name]: "" }));
  }, [errors]);

  const validate = () => {
    const e: any = {};
    if (!form.name.trim()) e.name = "· required";
    if (!form.email.trim()) e.email = "· required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "· invalid email";
    if (!form.subject.trim()) e.subject = "· required";
    if (!form.message.trim()) e.message = "· required";
    else if (form.message.trim().length < 20) e.message = "· too short";
    return e;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    setSubmitState("sending");
    setSignalTriggered(true);

    try {
      // Swapped out local broken API with optimized Web3Forms direct endpoint
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ 
          access_key: "d73c2de6-da58-4fab-a5e8-bd537f7fa8bb", 
          subject: `New Portfolio Message: ${form.subject}`,
          from_name: "Portfolio Contact Desk",
          name: form.name, 
          email: form.email, 
          message: form.message 
        }),
      });

      const result = await res.json();

      if (!result.success) throw new Error(result.message || "Failed to send");
      
      setTimeout(() => {
        setSubmitState("sent");
        setForm({ name:"", email:"", subject:"", message:"" });
        setTimeout(() => { setSignalTriggered(false); setSubmitState("idle"); }, 4000);
      }, 1500); // Retains your processing signal delay beautifully
    } catch (err) {
      console.error("Web3Forms submission error:", err);
      alert("Transmission failed. Please verify configurations and try again.");
      setSubmitState("idle");
      setSignalTriggered(false);
    }
  };

  const channels = [
    { icon: <Mail className="w-5 h-5" aria-label="Email icon" />, label:"Email", value: "anberaziz6@gmail.com", href:"mailto:anberaziz6@gmail.com" },
    { icon: <FaGithub className="w-5 h-5" aria-label="GitHub icon" />, label:"GitHub", value: "github.com/AnberAziz5", href:"https://github.com/AnberAziz5" },
    { icon: <FaLinkedin className="w-5 h-5" aria-label="LinkedIn icon" />, label:"LinkedIn", value: "linkedin.com/in/anber-aziz", href:"https://linkedin.com/in/anber-aziz-70b028266" },
    { icon: <MapPin className="w-5 h-5" aria-label="Location icon" />, label:"Location", value: "Lahore, Pakistan", href:"https://maps.google.com/?q=Lahore,Pakistan" },
  ];

  return (
    <div className="min-h-screen bg-transparent text-foreground relative pt-24 md:pt-32 pb-24 overflow-hidden">
      <style>{`
        @keyframes pulseBeacon { 0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.5);opacity:0} }
        @keyframes circuitTrace { from{width:0;opacity:0;left:50%}to{width:100%;opacity:1;left:0} }
        @keyframes burstDot { from{transform:scale(0);opacity:0}50%{transform:scale(1.4);opacity:1}to{transform:scale(1);opacity:0.7} }
        @keyframes sentBounce { 0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1} }
        @keyframes rotateRing { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        @keyframes rotateRingRev { from{transform:rotate(0deg)}to{transform:rotate(-360deg)} }
        @keyframes scanLine { 0%{top:0%;opacity:0}5%{opacity:1}90%{opacity:1}100%{top:100%;opacity:0} }
      `}</style>

      {/* ── PAGE CONTENT ── */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-8">

        {/* ── HERO ── */}
        <div 
          className="mb-16 md:mb-24 transition-all duration-1000 ease-out"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)" }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-[#F38020] shadow-[0_0_10px_rgba(243,128,32,0.9)]" />
              <div className="absolute -inset-1 rounded-full border-[1.5px] border-[#F38020]/40 animate-pulseBeacon" />
            </div>
            <span className="font-mono text-[10px] font-bold text-[#F38020] uppercase tracking-[0.18em]">
              Open Channel
            </span>
            <div className="flex-1 max-w-[200px] h-[1px] bg-gradient-to-r from-[#F38020]/50 to-transparent" />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground mb-6">
            Let's build<br />
            <span className="text-[#F38020] relative">
              something real.
              {/* Underline accent */}
              <svg viewBox="0 0 400 12" className="absolute -bottom-1.5 left-0 w-full h-3 overflow-visible">
                <path d="M0 8 Q100 2 200 8 Q300 14 400 8" fill="none" stroke="#F38020" strokeWidth="2" strokeOpacity="0.45" strokeLinecap="round"
                  style={{ strokeDasharray:420, strokeDashoffset: mounted?0:420, transition:"stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1) 0.6s" }} />
              </svg>
            </span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground text-balance">
            Full-stack engineer and AI systems builder — available for freelance engagements in web development, LLM integration, RAG pipelines, and cloud deployment.
          </p>
        </div>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 md:gap-16 items-start">

          {/* ── LEFT: Identity + Channels ── */}
          <div 
            className="xl:col-span-5 transition-all duration-1000 ease-out delay-200"
            style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateX(-20px)" }}
          >
            {/* Clock + Availability */}
            <div className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm mb-6">
              <div className="mb-6">
                <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.12em] mb-2">Local Time</div>
                <LiveClock />
              </div>
              <div className="h-[1px] bg-gradient-to-r from-[#F38020]/20 to-transparent mb-6" />
              <AvailBeacon />
            </div>

            {/* Response time chip */}
            <div className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card/30 mb-8">
              <span className="text-2xl drop-shadow-[0_0_8px_rgba(243,128,32,0.5)]">⚡</span>
              <div>
                <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.1em]">Avg. Response Time</div>
                <div className="font-mono text-[11px] text-[#F38020] font-bold mt-1">Within 24 hours</div>
              </div>
            </div>

            {/* Channels */}
            <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.14em] mb-4">Contact Channels</div>
            <div className="flex flex-col gap-4">
              {channels.map((ch, i) => <ChannelCard key={ch.label} {...ch} index={i} />)}
            </div>

            {/* Stack badges */}
            <div className="mt-12">
              <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.14em] mb-4">Specializations</div>
              <div className="flex flex-wrap gap-2">
                {["Full-Stack","AI / LLM","RAG Pipelines","Edge / Cloudflare","MERN","Python","Freelance"].map(s => (
                  <span key={s} className="px-3 py-1 font-mono text-[9.5px] border border-[#F38020]/25 rounded text-[#F38020] bg-[#F38020]/5 uppercase">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Form ── */}
          <div 
            className="xl:col-span-7 transition-all duration-1000 ease-out delay-300 relative"
            style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateX(20px)" }}
          >
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-md overflow-hidden relative shadow-2xl">
              {/* Scan line on sending */}
              {submitState === "sending" && (
                <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F38020] to-transparent pointer-events-none z-10 animate-scanLine" />
              )}

              {/* Form header */}
              <div className="p-8 md:p-10 border-b border-border flex items-center justify-between">
                <div>
                  <div className="font-mono text-[9px] text-[#F38020] uppercase tracking-[0.14em] mb-2">New Message</div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Send a Message</h2>
                </div>
                {/* Corner hex */}
                <span className="text-4xl text-[#F38020]/30 font-mono" style={{ animation: "rotateRing 12s linear infinite" }}>⬡</span>
              </div>

              {/* Signal transmission strip */}
              <div className="px-8 pt-8 pb-4">
                <SignalTransmission triggered={signalTriggered} />
              </div>

              {/* Form body */}
              <div className="p-8 md:p-10 pt-4">
                {submitState === "sent" ? (
                  <div className="text-center py-20 animate-sentBounce">
                    <div className="w-20 h-20 mx-auto rounded-full border-2 border-green-500 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                      <span className="text-green-500 text-3xl">✓</span>
                    </div>
                    <div className="text-2xl font-bold mb-3">Message transmitted.</div>
                    <div className="font-mono text-xs text-green-500 tracking-wider">I'll respond within 24 hours.</div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                      <Field label="Your Name" name="name" placeholder="Ada Lovelace" value={form.name} onChange={onChange} error={errors.name} />
                      <Field label="Email Address" name="email" type="email" placeholder="ada@lab.io" value={form.email} onChange={onChange} error={errors.email} />
                    </div>
                    <Field label="Subject" name="subject" placeholder="Freelance · Collaboration · Inquiry" value={form.subject} onChange={onChange} error={errors.subject} />
                    <Field label="Message" name="message" placeholder="Describe your project, timeline, and goals..." value={form.message} onChange={onChange} error={errors.message} multiline rows={6} />

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitState === "sending"}
                      className={`w-full h-14 rounded-xl border-none text-sm font-bold tracking-wide uppercase flex items-center justify-center gap-3 transition-all duration-300 ${
                        submitState === "sending" 
                          ? "bg-foreground/50 text-background cursor-not-allowed shadow-none" 
                          : "bg-foreground text-background hover:bg-[#F38020] hover:text-white shadow-xl hover:shadow-[#F38020]/20"
                      }`}
                    >
                      {submitState === "sending" ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                          Transmitting…
                        </>
                      ) : (
                        <>
                          <span className="text-sm">⬡</span>
                          Transmit Message
                        </>
                      )}
                    </button>

                    {/* Privacy note */}
                    <p className="mt-6 text-center font-mono text-[9px] text-muted-foreground tracking-[0.06em]">
                      Your information is never shared or stored beyond this message.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Below-form quick links */}
            <div className="flex gap-4 mt-6">
              {[
                { label:"View Projects →", href:"/projects" },
                { label:"View Services →", href:"/services" },
              ].map(l => (
                <a key={l.label} href={l.href} className="flex-1 py-4 text-center rounded-xl border border-border bg-card/30 text-muted-foreground font-mono text-[10px] tracking-[0.08em] hover:border-[#F38020]/40 hover:text-[#F38020] hover:bg-[#F38020]/5 transition-all duration-200">
                  {l.label}
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}