import React from "react";

/**
 * TaskManagerDiagram
 * React UI and Express API meeting at the task core, backed by
 * MongoDB and gated by JWT authentication.
 * Pure React + inline CSS/SVG, no extra dependencies.
 */
export default function TaskManagerDiagram() {
  return (
    <div className="tm-wrap">
      <style>{`
        .tm-wrap {
          position: relative; width: 100%; height: 100%; aspect-ratio: 16 / 9;
          border-radius: 20px;
          background: radial-gradient(circle at 28% 18%, #f8fafc 0%, #eef2ff 55%, #e6ebfb 100%);
          border: 1px solid #dde4f5;
          overflow: hidden; font-family: 'Inter', system-ui, -apple-system, sans-serif; box-sizing: border-box;
        }
        .tm-grid { position: absolute; inset: 0; z-index: 0;
          background-image: linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .tm-lines { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
        .tm-node {
          position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
          width: 70px; height: 70px; border-radius: 16px; background: #0f172a; color: #fff;
          font-size: 10px; font-weight: 700; letter-spacing: 0.04em; box-shadow: 0 6px 20px rgba(30,41,59,0.2);
          z-index: 2; animation: tm-breathe 4.5s ease-in-out infinite;
        }
        .tm-node .ic { font-size: 19px; line-height: 1; }
        .tm-node.react { top: 16%; left: 5%; border: 1.5px solid #38bdf8; box-shadow: 0 0 0 1px rgba(56,189,248,0.2), 0 0 20px rgba(56,189,248,0.4); animation-delay: 0s; }
        .tm-node.express { top: 12%; right: 7%; border: 1.5px solid #94a3b8; box-shadow: 0 0 0 1px rgba(148,163,184,0.2), 0 0 20px rgba(148,163,184,0.35); animation-delay: 1.1s; }
        .tm-node.mongo { bottom: 10%; left: 50%; transform: translateX(-50%); border: 1.5px solid #22c55e; box-shadow: 0 0 0 1px rgba(34,197,94,0.22), 0 0 22px rgba(34,197,94,0.45); animation-delay: 2.2s; }
        .tm-node.jwt { bottom: 4%; right: 4%; width: 54px; height: 54px; font-size: 8px; border: 1.5px solid #f59e0b; box-shadow: 0 0 0 1px rgba(245,158,11,0.18), 0 0 16px rgba(245,158,11,0.35); opacity: 0.95; animation-delay: 3.3s; }
        .tm-logo {
          position: absolute; top: 40%; left: 0%; width: 54px; height: 54px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 22px;
          background: #fff; border: 2px solid #3b82f6; color: #3b82f6; box-shadow: 0 0 18px rgba(59,130,246,0.35); z-index: 2;
        }
        .tm-hub { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 84px; height: 84px; z-index: 3; }
        .tm-hub-shape { width: 100%; height: 100%; background: #0f172a; clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 32px rgba(59,130,246,0.5); }
        .tm-hub-core { width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 0 16px 4px #3b82f6; animation: tm-pulse 1.8s ease-in-out infinite; }
        .tm-orbit { position: absolute; top: 50%; left: 50%; width: 160px; height: 160px; margin-top: -80px; margin-left: -80px; border: 1px dashed rgba(59,130,246,0.35); border-radius: 50%; z-index: 1; animation: tm-spin 16s linear infinite; }
        @keyframes tm-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.55; } }
        @keyframes tm-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes tm-breathe { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.25); } }
        .tm-status { position: absolute; left: 24px; bottom: 18px; z-index: 2; }
        .tm-status .l1 { color: #2563eb; font-size: 11px; font-weight: 700; letter-spacing: 0.03em; }
        .tm-status .l2 { color: #7d89a8; font-size: 9px; margin-top: 3px; letter-spacing: 0.02em; }
        @media (prefers-reduced-motion: reduce) { .tm-node, .tm-hub-core, .tm-orbit { animation: none !important; } }
      `}</style>

      <div className="tm-grid" />

      <svg className="tm-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="tm-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <line x1="4" y1="45" x2="11" y2="26" stroke="#3b82f6" strokeOpacity="0.5" strokeDasharray="0.6 1" strokeWidth="0.35" />

        <line x1="11" y1="26" x2="50" y2="50" stroke="#38bdf8" strokeOpacity="0.35" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#38bdf8" filter="url(#tm-glow)"><animateMotion dur="2.6s" repeatCount="indefinite" path="M11,26 L50,50" /></circle>

        <line x1="50" y1="50" x2="87" y2="22" stroke="#94a3b8" strokeOpacity="0.35" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#94a3b8" filter="url(#tm-glow)"><animateMotion dur="2.2s" repeatCount="indefinite" path="M50,50 L87,22" /></circle>

        <line x1="50" y1="50" x2="50" y2="80" stroke="#22c55e" strokeOpacity="0.4" strokeWidth="0.35" />
        <circle r="1" fill="#22c55e" filter="url(#tm-glow)"><animateMotion dur="1.8s" repeatCount="indefinite" path="M50,50 L50,80" /></circle>

        <line x1="50" y1="80" x2="90" y2="87" stroke="#f59e0b" strokeOpacity="0.4" strokeDasharray="0.5 1" strokeWidth="0.3" />
        <circle r="0.75" fill="#f59e0b" filter="url(#tm-glow)" opacity="0.85"><animateMotion dur="3.2s" repeatCount="indefinite" path="M50,80 L90,87" /></circle>
      </svg>

      <div className="tm-logo">✅</div>

      <div className="tm-node react"><span className="ic">⚛️</span>REACT</div>
      <div className="tm-node express"><span className="ic">🛰️</span>EXPRESS</div>
      <div className="tm-node mongo"><span className="ic">🍃</span>MONGODB</div>
      <div className="tm-node jwt"><span className="ic">🔐</span>JWT</div>

      <div className="tm-hub">
        <div className="tm-orbit" />
        <div className="tm-hub-shape"><div className="tm-hub-core" /></div>
      </div>

      <div className="tm-status">
        <div className="l1">TASK SYNC: LIVE</div>
        <div className="l2">JWT AUTH · REACT · EXPRESS · MONGODB</div>
      </div>
    </div>
  );
}
