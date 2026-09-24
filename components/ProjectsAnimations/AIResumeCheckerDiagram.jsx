import React from "react";

/**
 * AIResumeCheckerDiagram
 * Injection scanner + PII redactor guard the Groq inference call,
 * with Pydantic schema validation locking down the output.
 * Pure React + inline CSS/SVG, no extra dependencies.
 */
export default function AIResumeCheckerDiagram() {
  return (
    <div className="res-wrap">
      <style>{`
        .res-wrap {
          position: relative; width: 100%; height: 100%; aspect-ratio: 16 / 9;
          border-radius: 20px;
          background: radial-gradient(circle at 28% 18%, #1b2147 0%, #131a3a 55%, #0b0f24 100%);
          border: 1px solid #232b54;
          overflow: hidden; font-family: 'Inter', system-ui, -apple-system, sans-serif; box-sizing: border-box;
        }
        .res-grid { position: absolute; inset: 0; z-index: 0;
          background-image: linear-gradient(rgba(56,189,248,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .res-lines { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
        .res-node {
          position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
          width: 70px; height: 70px; border-radius: 16px; background: #060914; color: #e6edf3;
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.03em; box-shadow: 0 6px 20px rgba(0,0,0,0.4);
          z-index: 2; animation: res-breathe 4.5s ease-in-out infinite; text-align: center;
        }
        .res-node .ic { font-size: 19px; line-height: 1; }
        .res-node.scanner { top: 16%; left: 5%; border: 1.5px solid #fb7185; box-shadow: 0 0 0 1px rgba(251,113,133,0.18), 0 0 20px rgba(251,113,133,0.4); animation-delay: 0s; }
        .res-node.pii { top: 12%; right: 7%; border: 1.5px solid #fbbf24; box-shadow: 0 0 0 1px rgba(251,191,36,0.18), 0 0 20px rgba(251,191,36,0.4); animation-delay: 1.1s; }
        .res-node.groq { bottom: 10%; left: 50%; transform: translateX(-50%); border: 1.5px solid #f97316; box-shadow: 0 0 0 1px rgba(249,115,22,0.2), 0 0 22px rgba(249,115,22,0.45); animation-delay: 2.2s; }
        .res-node.schema { bottom: 4%; right: 4%; width: 54px; height: 54px; font-size: 8px; border: 1.5px solid #34d399; box-shadow: 0 0 0 1px rgba(52,211,153,0.16), 0 0 16px rgba(52,211,153,0.35); opacity: 0.95; animation-delay: 3.3s; }
        .res-logo {
          position: absolute; top: 40%; left: 0%; width: 54px; height: 54px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 22px;
          background: #0b0f24; border: 2px solid #38bdf8; color: #38bdf8; box-shadow: 0 0 18px rgba(56,189,248,0.4); z-index: 2;
        }
        .res-hub { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 84px; height: 84px; z-index: 3; }
        .res-hub-shape { width: 100%; height: 100%; background: #060914; clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 34px rgba(56,189,248,0.55); }
        .res-hub-core { width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 0 16px 4px #38bdf8; animation: res-pulse 1.8s ease-in-out infinite; }
        .res-orbit { position: absolute; top: 50%; left: 50%; width: 160px; height: 160px; margin-top: -80px; margin-left: -80px; border: 1px dashed rgba(56,189,248,0.35); border-radius: 50%; z-index: 1; animation: res-spin 16s linear infinite; }
        @keyframes res-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.55; } }
        @keyframes res-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes res-breathe { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }
        .res-status { position: absolute; left: 24px; bottom: 18px; z-index: 2; }
        .res-status .l1 { color: #38bdf8; font-size: 11px; font-weight: 700; letter-spacing: 0.03em; }
        .res-status .l2 { color: #93a0c4; font-size: 9px; margin-top: 3px; letter-spacing: 0.02em; }
        @media (prefers-reduced-motion: reduce) { .res-node, .res-hub-core, .res-orbit { animation: none !important; } }
      `}</style>

      <div className="res-grid" />

      <svg className="res-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="res-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <line x1="4" y1="45" x2="11" y2="26" stroke="#38bdf8" strokeOpacity="0.45" strokeDasharray="0.6 1" strokeWidth="0.35" />

        <line x1="11" y1="26" x2="50" y2="50" stroke="#fb7185" strokeOpacity="0.3" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#fb7185" filter="url(#res-glow)"><animateMotion dur="2.6s" repeatCount="indefinite" path="M11,26 L50,50" /></circle>

        <line x1="50" y1="50" x2="87" y2="22" stroke="#fbbf24" strokeOpacity="0.3" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#fbbf24" filter="url(#res-glow)"><animateMotion dur="2.2s" repeatCount="indefinite" path="M50,50 L87,22" /></circle>

        <line x1="50" y1="50" x2="50" y2="80" stroke="#f97316" strokeOpacity="0.35" strokeWidth="0.35" />
        <circle r="1" fill="#f97316" filter="url(#res-glow)"><animateMotion dur="1.8s" repeatCount="indefinite" path="M50,50 L50,80" /></circle>

        <line x1="50" y1="80" x2="90" y2="87" stroke="#34d399" strokeOpacity="0.4" strokeDasharray="0.5 1" strokeWidth="0.3" />
        <circle r="0.75" fill="#34d399" filter="url(#res-glow)" opacity="0.85"><animateMotion dur="3.2s" repeatCount="indefinite" path="M50,80 L90,87" /></circle>
      </svg>

      <div className="res-logo">🛡️</div>

      <div className="res-node scanner"><span className="ic">🚫</span>SCANNER</div>
      <div className="res-node pii"><span className="ic">🕵️</span>PII GUARD</div>
      <div className="res-node groq"><span className="ic">🚀</span>GROQ</div>
      <div className="res-node schema"><span className="ic">✅</span>SCHEMA</div>

      <div className="res-hub">
        <div className="res-orbit" />
        <div className="res-hub-shape"><div className="res-hub-core" /></div>
      </div>

      <div className="res-status">
        <div className="l1">GUARDRAIL GATEWAY: ENFORCED</div>
        <div className="l2">GROQ LLAMA 3.3 · SUB-SECOND INFERENCE</div>
      </div>
    </div>
  );
}
