"use client";

import { useEffect, useRef } from "react";

export type VoicePhase = "listening" | "thinking" | "speaking";

export function AdaVoiceWaves({
  level,
  phase,
}: {
  level: number;
  phase: VoicePhase;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const levelRef = useRef(level);
  const phaseRef = useRef(phase);
  levelRef.current = level;
  phaseRef.current = phase;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      const cx = w / 2;
      const cy = h / 2;
      const phaseNow = phaseRef.current;
      t += phaseNow === "thinking" ? 0.012 : 0.022;
      const mic = Math.min(1, levelRef.current);
      const energy =
        phaseNow === "speaking"
          ? 0.5 + Math.sin(t * 4.4) * 0.24
          : phaseNow === "thinking"
            ? 0.2 + Math.sin(t * 1.5) * 0.07
            : 0.16 + mic * 1.15;

      ctx.clearRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.min(w, h) * 0.46);
      glow.addColorStop(0, `rgba(246,130,31,${0.2 + energy * 0.3})`);
      glow.addColorStop(0.5, `rgba(246,130,31,${0.07 + energy * 0.1})`);
      glow.addColorStop(1, "rgba(10,10,10,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      for (let r = 0; r < 3; r++) {
        const radius = 58 + r * 30 + energy * 24 + Math.sin(t * 2.1 + r) * 7;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(246,130,31,${0.24 - r * 0.06 + energy * 0.1})`;
        ctx.lineWidth = 1.15;
        ctx.stroke();
      }

      const layers = [
        { amp: 0.95, freq: 1.12, speed: 1.0, alpha: 0.9, width: 2.5 },
        { amp: 0.64, freq: 1.72, speed: 1.32, alpha: 0.5, width: 1.65 },
        { amp: 0.4, freq: 2.4, speed: 1.85, alpha: 0.3, width: 1.15 },
      ];
      const baseAmp = 18 + energy * 62;

      layers.forEach((layer, i) => {
        ctx.beginPath();
        ctx.lineWidth = layer.width;
        ctx.strokeStyle = `rgba(246,130,31,${layer.alpha})`;
        ctx.shadowColor = "#F6821F";
        ctx.shadowBlur = 18 + energy * 16;
        for (let x = 0; x <= w; x += 2) {
          const nx = (x - cx) / w;
          const y =
            cy +
            Math.sin(nx * Math.PI * 2 * layer.freq + t * layer.speed * 2.15 + i) *
              baseAmp *
              layer.amp +
            Math.sin(nx * Math.PI * 5.5 + t * 1.35) * (7 + energy * 9);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      ctx.beginPath();
      ctx.arc(cx, cy, 24 + energy * 9, 0, Math.PI * 2);
      const orb = ctx.createRadialGradient(cx - 7, cy - 9, 3, cx, cy, 34);
      orb.addColorStop(0, "#ffc48a");
      orb.addColorStop(0.45, "#F6821F");
      orb.addColorStop(1, "#7a3406");
      ctx.fillStyle = orb;
      ctx.shadowColor = "#F6821F";
      ctx.shadowBlur = 30 + energy * 22;
      ctx.fill();
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
