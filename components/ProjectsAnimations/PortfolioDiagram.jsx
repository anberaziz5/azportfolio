import React from "react";

/**
 * PortfolioDiagram
 * React UI and Express API meeting at the portfolio's data core,
 * backed by MongoDB and seeded reference data.
 * Palette pulled from the portfolio's own stated theme:
 * Deep Obsidian & Neon Cyberpunk.
 * Pure React + inline CSS/SVG, no extra dependencies.
 */
export default function PortfolioDiagram() {
  return (
    <div className="pf-wrap">
      <style>{`
        .pf-wrap {
          position: relative; width: 100%; aspect-ratio: 16 / 9; min-height: 320px;
          border-radius: 20px;
          background: radial-gradient(circle at 28% 18%, #0d0d16 0%, #05050a 55%, #020203 100%);
          border: 1px solid #1a1a26;
          overflow: hidden; font-family: 'Inter', system-ui, -apple-system, sans-serif; box-sizing: border-box;
        }
        .pf-grid { position: absolute; inset: 0; z-index: 0;
          background-image: linear-gradient(rgba(255,63,164,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .pf-lines { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
        .pf-node {
          position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
          width: 70px; height: 70px; border-radius: 16px; background: #000; color: #f0eaff;
          font-size: 10px; font-weight: 700; letter-spacing: 0.04em; box-shadow: 0 6px 20px rgba(0,0,0,0.5);
          z-index: 2; animation: pf-breathe 4.5s ease-in-out infinite;
        }
        .pf-node .ic { font-size: 19px; line-height: 1; }
        .pf-node.react { top: 16%; left: 5%; border: 1.5px solid #22d3ee; box-shadow: 0 0 0 1px rgba(34,211,238,0.22), 0 0 22px rgba(34,211,238,0.5); animation-delay: 0s; }
        .pf-node.express { top: 12%; right: 7%; border: 1.5px solid #ff3fa4; box-shadow: 0 0 0 1px rgba(255,63,164,0.22), 0 0 22px rgba(255,63,164,0.5); animation-delay: 1.1s; }
        .pf-node.mongo { bottom: 10%; left: 50%; transform: translateX(-50%); border: 1.5px solid #39ff88; box-shadow: 0 0 0 1px rgba(57,255,136,0.22), 0 0 24px rgba(57,255,136,0.5); animation-delay: 2.2s; }
        .pf-node.seed { bottom: 4%; right: 4%; width: 54px; height: 54px; font-size: 8px; border: 1.5px solid #a855f7; box-shadow: 0 0 0 1px rgba(168,85,247,0.2), 0 0 18px rgba(168,85,247,0.4); opacity: 0.95; animation-delay: 3.3s; }
        .pf-logo {
          position: absolute; top: 40%; left: 0%; width: 54px; height: 54px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 22px;
          background: #050507; border: 2px solid #ff3fa4; color: #ff3fa4; box-shadow: 0 0 20px rgba(255,63,164,0.5); z-index: 2;
        }
        .pf-hub { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 84px; height: 84px; z-index: 3; }
        .pf-hub-shape { width: 100%; height: 100%; background: #000; clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 36px rgba(34,211,238,0.6); }
        .pf-hub-core { width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 0 18px 4px #22d3ee; animation: pf-pulse 1.8s ease-in-out infinite; }
        .pf-orbit { position: absolute; top: 50%; left: 50%; width: 160px; height: 160px; margin-top: -80px; margin-left: -80px; border: 1px dashed rgba(34,211,238,0.35); border-radius: 50%; z-index: 1; animation: pf-spin 16s linear infinite; }
        @keyframes pf-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.55; } }
        @keyframes pf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pf-breathe { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.35); } }
        .pf-status { position: absolute; left: 24px; bottom: 18px; z-index: 2; }
        .pf-status .l1 { color: #22d3ee; font-size: 11px; font-weight: 700; letter-spacing: 0.03em; }
        .pf-status .l2 { color: #8d8aa8; font-size: 9px; margin-top: 3px; letter-spacing: 0.02em; }
        @media (prefers-reduced-motion: reduce) { .pf-node, .pf-hub-core, .pf-orbit { animation: none !important; } }
      `}</style>

      <div className="pf-grid" />

      <svg className="pf-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="pf-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <line x1="4" y1="45" x2="11" y2="26" stroke="#ff3fa4" strokeOpacity="0.55" strokeDasharray="0.6 1" strokeWidth="0.35" />

        <line x1="11" y1="26" x2="50" y2="50" stroke="#22d3ee" strokeOpacity="0.35" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#22d3ee" filter="url(#pf-glow)"><animateMotion dur="2.6s" repeatCount="indefinite" path="M11,26 L50,50" /></circle>

        <line x1="50" y1="50" x2="87" y2="22" stroke="#ff3fa4" strokeOpacity="0.35" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#ff3fa4" filter="url(#pf-glow)"><animateMotion dur="2.2s" repeatCount="indefinite" path="M50,50 L87,22" /></circle>

        <line x1="50" y1="50" x2="50" y2="80" stroke="#39ff88" strokeOpacity="0.4" strokeWidth="0.35" />
        <circle r="1" fill="#39ff88" filter="url(#pf-glow)"><animateMotion dur="1.8s" repeatCount="indefinite" path="M50,50 L50,80" /></circle>

        <line x1="50" y1="80" x2="90" y2="87" stroke="#a855f7" strokeOpacity="0.45" strokeDasharray="0.5 1" strokeWidth="0.3" />
        <circle r="0.75" fill="#a855f7" filter="url(#pf-glow)" opacity="0.85"><animateMotion dur="3.2s" repeatCount="indefinite" path="M50,80 L90,87" /></circle>
      </svg>

      <div className="pf-logo">🧑‍💻</div>

      <div className="pf-node react"><span className="ic">⚛️</span>REACT</div>
      <div className="pf-node express"><span className="ic">🛰️</span>EXPRESS</div>
      <div className="pf-node mongo"><span className="ic">🍃</span>MONGODB</div>
      <div className="pf-node seed"><span className="ic">🌱</span>SEED DATA</div>

      <div className="pf-hub">
        <div className="pf-orbit" />
        <div className="pf-hub-shape"><div className="pf-hub-core" /></div>
      </div>

      <div className="pf-status">
        <div className="l1">PORTFOLIO SYNC: LIVE</div>
        <div className="l2">REACT · EXPRESS · MONGODB</div>
      </div>
    </div>
  );
}
