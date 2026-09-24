import React from "react";

/**
 * OmniNodeOpsDiagram
 * Isolation Forest anomaly detection feeds Gemini for autonomous
 * remediation, with every decision logged to MongoDB and streamed
 * to the React command center.
 * Pure React + inline CSS/SVG, no extra dependencies.
 */
export default function OmniNodeOpsDiagram() {
  return (
    <div className="ono-wrap">
      <style>{`
        .ono-wrap {
          position: relative; width: 100%; height: 100%; aspect-ratio: 16 / 9;
          border-radius: 20px;
          background: radial-gradient(circle at 28% 18%, #14181c 0%, #0a0d10 55%, #060808 100%);
          border: 1px solid #1f2629;
          overflow: hidden; font-family: 'Inter', system-ui, -apple-system, sans-serif; box-sizing: border-box;
        }
        .ono-grid { position: absolute; inset: 0; z-index: 0;
          background-image: linear-gradient(rgba(52,211,153,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .ono-lines { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
        .ono-node {
          position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
          width: 70px; height: 70px; border-radius: 16px; background: #040608; color: #e6f3ec;
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.03em; box-shadow: 0 6px 20px rgba(0,0,0,0.45);
          z-index: 2; animation: ono-breathe 4.5s ease-in-out infinite; text-align: center;
        }
        .ono-node .ic { font-size: 19px; line-height: 1; }
        .ono-node.ml { top: 16%; left: 5%; border: 1.5px solid #a78bfa; box-shadow: 0 0 0 1px rgba(167,139,250,0.18), 0 0 20px rgba(167,139,250,0.4); animation-delay: 0s; }
        .ono-node.gemini { top: 12%; right: 7%; border: 1.5px solid #60a5fa; box-shadow: 0 0 0 1px rgba(96,165,250,0.18), 0 0 20px rgba(96,165,250,0.4); animation-delay: 1.1s; }
        .ono-node.mongo { bottom: 10%; left: 50%; transform: translateX(-50%); border: 1.5px solid #34d399; box-shadow: 0 0 0 1px rgba(52,211,153,0.2), 0 0 22px rgba(52,211,153,0.45); animation-delay: 2.2s; }
        .ono-node.react { bottom: 4%; right: 4%; width: 54px; height: 54px; font-size: 8px; border: 1.5px solid #38bdf8; box-shadow: 0 0 0 1px rgba(56,189,248,0.16), 0 0 16px rgba(56,189,248,0.35); opacity: 0.95; animation-delay: 3.3s; }
        .ono-logo {
          position: absolute; top: 40%; left: 0%; width: 54px; height: 54px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 22px;
          background: #0a0d10; border: 2px solid #34d399; color: #34d399; box-shadow: 0 0 18px rgba(52,211,153,0.4); z-index: 2;
        }
        .ono-hub { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 84px; height: 84px; z-index: 3; }
        .ono-hub-shape { width: 100%; height: 100%; background: #040608; clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 34px rgba(52,211,153,0.55); }
        .ono-hub-core { width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 0 16px 4px #34d399; animation: ono-pulse 1.8s ease-in-out infinite; }
        .ono-orbit { position: absolute; top: 50%; left: 50%; width: 160px; height: 160px; margin-top: -80px; margin-left: -80px; border: 1px dashed rgba(52,211,153,0.35); border-radius: 50%; z-index: 1; animation: ono-spin 16s linear infinite; }
        @keyframes ono-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.55; } }
        @keyframes ono-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes ono-breathe { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }
        .ono-status { position: absolute; left: 24px; bottom: 18px; z-index: 2; }
        .ono-status .l1 { color: #34d399; font-size: 11px; font-weight: 700; letter-spacing: 0.03em; }
        .ono-status .l2 { color: #8da89c; font-size: 9px; margin-top: 3px; letter-spacing: 0.02em; }
        @media (prefers-reduced-motion: reduce) { .ono-node, .ono-hub-core, .ono-orbit { animation: none !important; } }
      `}</style>

      <div className="ono-grid" />

      <svg className="ono-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="ono-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <line x1="4" y1="45" x2="11" y2="26" stroke="#34d399" strokeOpacity="0.5" strokeDasharray="0.6 1" strokeWidth="0.35" />

        <line x1="11" y1="26" x2="50" y2="50" stroke="#a78bfa" strokeOpacity="0.3" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#a78bfa" filter="url(#ono-glow)"><animateMotion dur="2.6s" repeatCount="indefinite" path="M11,26 L50,50" /></circle>

        <line x1="50" y1="50" x2="87" y2="22" stroke="#60a5fa" strokeOpacity="0.3" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#60a5fa" filter="url(#ono-glow)"><animateMotion dur="2.2s" repeatCount="indefinite" path="M50,50 L87,22" /></circle>

        <line x1="50" y1="50" x2="50" y2="80" stroke="#34d399" strokeOpacity="0.4" strokeWidth="0.35" />
        <circle r="1" fill="#34d399" filter="url(#ono-glow)"><animateMotion dur="1.8s" repeatCount="indefinite" path="M50,50 L50,80" /></circle>

        <line x1="50" y1="80" x2="90" y2="87" stroke="#38bdf8" strokeOpacity="0.4" strokeDasharray="0.5 1" strokeWidth="0.3" />
        <circle r="0.75" fill="#38bdf8" filter="url(#ono-glow)" opacity="0.85"><animateMotion dur="3.2s" repeatCount="indefinite" path="M50,80 L90,87" /></circle>
      </svg>

      <div className="ono-logo">⚡</div>

      <div className="ono-node ml"><span className="ic">🧠</span>ML ENGINE</div>
      <div className="ono-node gemini"><span className="ic">♊</span>GEMINI</div>
      <div className="ono-node mongo"><span className="ic">🍃</span>AUDIT DB</div>
      <div className="ono-node react"><span className="ic">⚛️</span>DASHBOARD</div>

      <div className="ono-hub">
        <div className="ono-orbit" />
        <div className="ono-hub-shape"><div className="ono-hub-core" /></div>
      </div>

      <div className="ono-status">
        <div className="l1">SELF-HEALING MESH: ACTIVE</div>
        <div className="l2">ANOMALY → GEMINI → AUTO REMEDIATION</div>
      </div>
    </div>
  );
}
