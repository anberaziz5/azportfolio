"use client";

import Image from "next/image";
import { AdaVoiceWaves, type VoicePhase } from "@/components/AdaVoiceWaves";

export function AdaVoiceSession({
  phase,
  level,
  caption,
  onHangup,
}: {
  phase: VoicePhase;
  level: number;
  caption: string;
  onHangup: () => void;
}) {
  const label =
    phase === "listening"
      ? "Listening"
      : phase === "thinking"
        ? "Thinking"
        : "Speaking";

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(246,130,31,0.12), transparent 32%), radial-gradient(circle at 80% 80%, rgba(246,130,31,0.08), transparent 36%)",
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <div className="relative h-[240px] w-full max-w-[340px] sm:h-[280px]">
          <AdaVoiceWaves level={level} phase={phase} />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-primary/70">
              <Image src="/ada-icon.svg" alt="" width={48} height={48} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>

        <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-primary">
          Ada Live
        </p>
        <p className="mt-1 text-[18px] font-semibold tracking-tight text-foreground">{label}</p>
        <p className="mt-3 min-h-[44px] max-w-[280px] text-center text-[13px] leading-relaxed text-muted-foreground">
          {caption || (phase === "listening" ? "Go ahead, I'm listening." : " ")}
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-8 pb-8 pt-2">
        <button
          type="button"
          onClick={onHangup}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_rgba(246,130,31,0.45)] transition-transform hover:scale-105 active:scale-95"
          aria-label="End voice chat"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10.68 13.31a16 16 0 0 0 3.01 3.01l2.62-2.62a1 1 0 0 1 .97-.25 11.42 11.42 0 0 0 3.55.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.98a1 1 0 0 1 1 1 11.42 11.42 0 0 0 .57 3.55 1 1 0 0 1-.25.97z" transform="rotate(135 12 12)" />
          </svg>
        </button>
      </div>
    </div>
  );
}
