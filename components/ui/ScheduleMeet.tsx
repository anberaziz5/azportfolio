"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ScheduleMeet() {
  const [formData, setFormData] = useState({ name: "", datetime: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.datetime) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule meeting");
      }

      setStatus("success");
      fireConfetti();
      
      // Reset after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setFormData({ name: "", datetime: "", email: "" });
      }, 6000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- Confetti Logic ---
  const fireConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const particles: any[] = [];
    const colors = ["#F6821F", "#10b981", "#fbbf24", "#ffffff"];

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const createParticle = () => {
      return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 2) * 10,
        life: 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
      };
    };

    for (let i = 0; i < 50; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      if (particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5; // Gravity
        p.life -= 2;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life / 100);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  };

  return (
    <div className="w-full relative py-24 flex items-center justify-center overflow-hidden bg-transparent">
      {/* Animation Styles */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 60s linear infinite;
        }
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes success-pulse {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes success-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(246, 130, 31, 0.4); }
          50% { box-shadow: 0 0 60px rgba(246, 130, 31, 0.8), 0 0 100px rgba(246, 130, 31, 0.4); }
        }
        @keyframes checkmark-draw {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes celebration-ring {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        .animate-success-pulse {
          animation: success-pulse 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-success-glow {
          animation: success-glow 2s ease-in-out infinite;
        }
        .animate-checkmark {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: checkmark-draw 0.4s ease-out 0.3s forwards;
        }
        .animate-ring {
          animation: celebration-ring 0.8s ease-out forwards;
        }
      `}</style>

      {/* Background Decorative Layer */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20 dark:opacity-40"
        style={{
          perspective: "1200px",
          transform: "perspective(1200px) rotateX(15deg)",
          transformOrigin: "center bottom",
        }}
      >
        <div className="absolute inset-0 animate-spin-slow">
          <div
            className="absolute top-1/2 left-1/2 rounded-full border border-primary/20 border-dashed"
            style={{
              width: "1200px",
              height: "1200px",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        <div className="absolute inset-0 animate-spin-slow-reverse">
          <div
            className="absolute top-1/2 left-1/2 rounded-full border border-primary/40 border-dotted"
            style={{
              width: "800px",
              height: "800px",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-background via-background/80 to-transparent" />

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 rounded-2xl shadow-lg overflow-hidden mb-2 ring-1 ring-border bg-muted flex items-center justify-center">
          <span className="text-3xl">☕</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-center tracking-tight text-foreground">
          Let's Build Something.
        </h2>

        <p className="text-lg font-medium text-muted-foreground text-center max-w-lg">
          I'm currently accepting new freelance projects and open to Fall 2027 academic opportunities. Schedule a meet to discuss your ideas.
        </p>

        {/* Form / Success Container */}
        <div className="w-full max-w-2xl mt-4 relative perspective-1000 min-h-[300px] flex justify-center items-center">
          <canvas
            ref={canvasRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-50"
          />

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, rotateX: -90, scale: 0.95 }}
                animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                exit={{ opacity: 0, rotateX: 90, scale: 0.95 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                className="w-full max-w-xl min-h-[200px] p-8 flex flex-col items-center justify-center rounded-3xl shadow-2xl relative z-30 overflow-hidden"
                style={{ backgroundColor: "#F6821F" }}
              >
                <div className="absolute top-1/2 left-1/2 w-full h-full rounded-3xl border-2 border-orange-300 animate-ring" style={{ animationDelay: "0s" }} />
                <div className="absolute top-1/2 left-1/2 w-full h-full rounded-3xl border-2 border-orange-200 animate-ring" style={{ animationDelay: "0.15s" }} />
                
                <div className="flex flex-col items-center gap-4 text-white font-semibold relative z-10">
                  <div className="bg-white/20 p-3 rounded-full mb-2">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path className="animate-checkmark" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-3xl tracking-tight">Meeting Scheduled!</p>
                    <p className="text-lg opacity-90 font-medium">We'll see you on {formData.datetime ? new Date(formData.datetime).toLocaleString() : ""}.</p>
                    <p className="text-sm opacity-75 font-normal">Please check your email for confirmation.</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, rotateX: 90, scale: 0.95 }}
                animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                exit={{ opacity: 0, rotateX: -90, scale: 0.95 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                className="w-full max-w-4xl p-6 md:p-8 bg-background/40 backdrop-blur-xl border border-border shadow-2xl rounded-3xl relative z-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      disabled={status === "loading"}
                      onChange={handleChange}
                      className="w-full h-[50px] px-4 rounded-xl outline-none transition-all duration-200 placeholder-muted-foreground disabled:opacity-70 disabled:cursor-not-allowed bg-background text-foreground shadow-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      disabled={status === "loading"}
                      onChange={handleChange}
                      className="w-full h-[50px] px-4 rounded-xl outline-none transition-all duration-200 placeholder-muted-foreground disabled:opacity-70 disabled:cursor-not-allowed bg-background text-foreground shadow-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1">Date & Time</label>
                    <input
                      type="datetime-local"
                      name="datetime"
                      required
                      value={formData.datetime}
                      disabled={status === "loading"}
                      onChange={handleChange}
                      className="w-full h-[50px] px-4 rounded-xl outline-none transition-all duration-200 placeholder-muted-foreground disabled:opacity-70 disabled:cursor-not-allowed bg-background text-foreground shadow-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {status === "error" && (
                  <p className="text-destructive text-sm text-center mb-4">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full h-[60px] rounded-xl font-bold text-white text-lg transition-all active:scale-[0.98] hover:brightness-110 disabled:hover:brightness-100 disabled:active:scale-100 disabled:cursor-wait flex items-center justify-center bg-[#F6821F] shadow-[0_0_20px_rgba(246,130,31,0.3)] hover:shadow-[0_0_30px_rgba(246,130,31,0.5)]"
                >
                  {status === "loading" ? (
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    "Schedule the Meeting"
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
