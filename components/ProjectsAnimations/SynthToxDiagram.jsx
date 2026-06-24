import React from "react";

/**
 * SynthToxDiagram
 * Groq multimodal vision extracts drug entities, matched against
 * Vectorize embeddings and resolved through D1, before the
 * temperature-zero Groq LPU call returns a locked triage token.
 * Pure React + inline CSS/SVG, no extra dependencies.
 */
export default function SynthToxDiagram() {
  return (
    <div className="stx-wrap">
      <style>{`
        .stx-wrap {
          position: relative; width: 100%; aspect-ratio: 16 / 9; min-height: 320px;
          border-radius: 20px;
          background: radial-gradient(circle at 28% 18%, #11161d 0%, #0a0e14 55%, #060809 100%);
          border: 1px solid #1c2329;
          overflow: hidden; font-family: 'Inter', system-ui, -apple-system, sans-serif; box-sizing: border-box;
        }
        .stx-grid { position: absolute; inset: 0; z-index: 0;
          background-image: linear-gradient(rgba(243,128,32,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(243,128,32,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .stx-lines { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
        .stx-node {
          position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
          width: 70px; height: 70px; border-radius: 16px; background: #050709; color: #ecf1f5;
          font-size: 9px; font-weight: 700; letter-spacing: 0.03em; box-shadow: 0 6px 20px rgba(0,0,0,0.45);
          z-index: 2; animation: stx-breathe 4.5s ease-in-out infinite; text-align: center;
        }
        .stx-node .ic { font-size: 19px; line-height: 1; }
        .stx-node.vision { top: 16%; left: 5%; border: 1.5px solid #f55036; box-shadow: 0 0 0 1px rgba(245,80,54,0.18), 0 0 20px rgba(245,80,54,0.4); animation-delay: 0s; }
        .stx-node.vectorize { top: 12%; right: 7%; border: 1.5px solid #38bdf8; box-shadow: 0 0 0 1px rgba(56,189,248,0.18), 0 0 20px rgba(56,189,248,0.4); animation-delay: 1.1s; }
        .stx-node.d1 { bottom: 10%; left: 50%; transform: translateX(-50%); border: 1.5px solid #cbd5e1; box-shadow: 0 0 0 1px rgba(203,213,225,0.18), 0 0 22px rgba(203,213,225,0.35); animation-delay: 2.2s; }
        .stx-node.lpu { bottom: 4%; right: 4%; width: 54px; height: 54px; font-size: 8px; border: 1.5px solid #f97316; box-shadow: 0 0 0 1px rgba(249,115,22,0.18), 0 0 16px rgba(249,115,22,0.4); opacity: 0.95; animation-delay: 3.3s; }
        .stx-logo {
          position: absolute; top: 40%; left: 0%; width: 54px; height: 54px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 22px;
          background: #0a0e14; border: 2px solid #f38020; color: #f38020; box-shadow: 0 0 18px rgba(243,128,32,0.4); z-index: 2;
        }
        .stx-hub { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 84px; height: 84px; z-index: 3; }
        .stx-hub-shape { width: 100%; height: 100%; background: #050709; clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 34px rgba(243,128,32,0.5); }
        .stx-hub-core { width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 0 16px 4px #f38020; animation: stx-pulse 1.8s ease-in-out infinite; }
        .stx-orbit { position: absolute; top: 50%; left: 50%; width: 160px; height: 160px; margin-top: -80px; margin-left: -80px; border: 1px dashed rgba(243,128,32,0.35); border-radius: 50%; z-index: 1; animation: stx-spin 16s linear infinite; }
        @keyframes stx-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.55; } }
        @keyframes stx-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes stx-breathe { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }
        .stx-status { position: absolute; left: 24px; bottom: 18px; z-index: 2; }
        .stx-status .l1 { color: #f38020; font-size: 11px; font-weight: 700; letter-spacing: 0.03em; }
        .stx-status .l2 { color: #93a0ad; font-size: 9px; margin-top: 3px; letter-spacing: 0.02em; }
        @media (prefers-reduced-motion: reduce) { .stx-node, .stx-hub-core, .stx-orbit { animation: none !important; } }
      `}</style>

      <div className="stx-grid" />

      <svg className="stx-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="stx-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <line x1="4" y1="45" x2="11" y2="26" stroke="#f38020" strokeOpacity="0.5" strokeDasharray="0.6 1" strokeWidth="0.35" />

        <line x1="11" y1="26" x2="50" y2="50" stroke="#f55036" strokeOpacity="0.3" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#f55036" filter="url(#stx-glow)"><animateMotion dur="2.6s" repeatCount="indefinite" path="M11,26 L50,50" /></circle>

        <line x1="50" y1="50" x2="87" y2="22" stroke="#38bdf8" strokeOpacity="0.3" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#38bdf8" filter="url(#stx-glow)"><animateMotion dur="2.2s" repeatCount="indefinite" path="M50,50 L87,22" /></circle>

        <line x1="50" y1="50" x2="50" y2="80" stroke="#cbd5e1" strokeOpacity="0.35" strokeWidth="0.35" />
        <circle r="1" fill="#cbd5e1" filter="url(#stx-glow)"><animateMotion dur="1.8s" repeatCount="indefinite" path="M50,50 L50,80" /></circle>

        <line x1="50" y1="80" x2="90" y2="87" stroke="#f97316" strokeOpacity="0.4" strokeDasharray="0.5 1" strokeWidth="0.3" />
        <circle r="0.75" fill="#f97316" filter="url(#stx-glow)" opacity="0.85"><animateMotion dur="3.2s" repeatCount="indefinite" path="M50,80 L90,87" /></circle>
      </svg>

      <div className="stx-logo">🧬</div>

      <div className="stx-node vision"><span className="ic">👁️</span>VISION</div>
      <div className="stx-node vectorize"><span className="ic">🧭</span>VECTORIZE</div>
      <div className="stx-node d1"><span className="ic">🗄️</span>D1</div>
      <div className="stx-node lpu"><span className="ic">⚙️</span>GROQ LPU</div>

      <div className="stx-hub">
        <div className="stx-orbit" />
        <div className="stx-hub-shape"><div className="stx-hub-core" /></div>
      </div>

      <div className="stx-status">
        <div className="l1">ZERO-HALLUCINATION GUARDRAILS: ENFORCED</div>
        <div className="l2">TEMP 0.0 · SUB-SECOND TRIAGE</div>
      </div>
    </div>
  );
}
