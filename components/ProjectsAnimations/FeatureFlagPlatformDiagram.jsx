import React from "react";

/**
 * FeatureFlagPlatformDiagram
 * Dev / Test / Prod environment toggles feeding the flag core,
 * persisted to MongoDB. Pastel glassmorphic palette to match
 * the platform's own stated UI design.
 * Pure React + inline CSS/SVG, no extra dependencies.
 */
export default function FeatureFlagPlatformDiagram() {
  return (
    <div className="ffp-wrap">
      <style>{`
        .ffp-wrap {
          position: relative; width: 100%; aspect-ratio: 16 / 9; min-height: 320px;
          border-radius: 20px;
          background: radial-gradient(circle at 28% 18%, #f9f7ff 0%, #f1ecff 55%, #e9e2ff 100%);
          border: 1px solid #ded3f7;
          overflow: hidden; font-family: 'Inter', system-ui, -apple-system, sans-serif; box-sizing: border-box;
        }
        .ffp-grid { position: absolute; inset: 0; z-index: 0;
          background-image: linear-gradient(rgba(124,111,220,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,111,220,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .ffp-lines { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
        .ffp-node {
          position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
          width: 70px; height: 70px; border-radius: 16px; background: #1c1730; color: #fff;
          font-size: 10px; font-weight: 700; letter-spacing: 0.04em; box-shadow: 0 6px 20px rgba(80,60,150,0.18);
          z-index: 2; animation: ffp-breathe 4.5s ease-in-out infinite;
        }
        .ffp-node .ic { font-size: 19px; line-height: 1; }
        .ffp-node.dev { top: 16%; left: 5%; border: 1.5px solid #60a5fa; box-shadow: 0 0 0 1px rgba(96,165,250,0.2), 0 0 20px rgba(96,165,250,0.4); animation-delay: 0s; }
        .ffp-node.test { top: 12%; right: 7%; border: 1.5px solid #fbbf24; box-shadow: 0 0 0 1px rgba(251,191,36,0.2), 0 0 20px rgba(251,191,36,0.4); animation-delay: 1.1s; }
        .ffp-node.prod { bottom: 10%; left: 50%; transform: translateX(-50%); border: 1.5px solid #34d399; box-shadow: 0 0 0 1px rgba(52,211,153,0.22), 0 0 22px rgba(52,211,153,0.45); animation-delay: 2.2s; }
        .ffp-node.mongo { bottom: 4%; right: 4%; width: 54px; height: 54px; font-size: 8px; border: 1.5px solid #10b981; box-shadow: 0 0 0 1px rgba(16,185,129,0.18), 0 0 16px rgba(16,185,129,0.35); opacity: 0.95; animation-delay: 3.3s; }
        .ffp-logo {
          position: absolute; top: 40%; left: 0%; width: 54px; height: 54px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 22px;
          background: #fff; border: 2px solid #7c6fdc; color: #7c6fdc; box-shadow: 0 0 18px rgba(124,111,220,0.35); z-index: 2;
        }
        .ffp-hub { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 84px; height: 84px; z-index: 3; }
        .ffp-hub-shape { width: 100%; height: 100%; background: #1c1730; clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 34px rgba(124,111,220,0.5); }
        .ffp-hub-core { width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 0 16px 4px #7c6fdc; animation: ffp-pulse 1.8s ease-in-out infinite; }
        .ffp-orbit { position: absolute; top: 50%; left: 50%; width: 160px; height: 160px; margin-top: -80px; margin-left: -80px; border: 1px dashed rgba(124,111,220,0.35); border-radius: 50%; z-index: 1; animation: ffp-spin 16s linear infinite; }
        @keyframes ffp-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.55; } }
        @keyframes ffp-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes ffp-breathe { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.25); } }
        .ffp-status { position: absolute; left: 24px; bottom: 18px; z-index: 2; }
        .ffp-status .l1 { color: #5b3fc4; font-size: 11px; font-weight: 700; letter-spacing: 0.03em; }
        .ffp-status .l2 { color: #8f86b8; font-size: 9px; margin-top: 3px; letter-spacing: 0.02em; }
        @media (prefers-reduced-motion: reduce) { .ffp-node, .ffp-hub-core, .ffp-orbit { animation: none !important; } }
      `}</style>

      <div className="ffp-grid" />

      <svg className="ffp-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="ffp-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <line x1="4" y1="45" x2="11" y2="26" stroke="#7c6fdc" strokeOpacity="0.5" strokeDasharray="0.6 1" strokeWidth="0.35" />

        <line x1="11" y1="26" x2="50" y2="50" stroke="#60a5fa" strokeOpacity="0.35" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#60a5fa" filter="url(#ffp-glow)"><animateMotion dur="2.6s" repeatCount="indefinite" path="M11,26 L50,50" /></circle>

        <line x1="50" y1="50" x2="87" y2="22" stroke="#fbbf24" strokeOpacity="0.35" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#fbbf24" filter="url(#ffp-glow)"><animateMotion dur="2.2s" repeatCount="indefinite" path="M50,50 L87,22" /></circle>

        <line x1="50" y1="50" x2="50" y2="80" stroke="#34d399" strokeOpacity="0.4" strokeWidth="0.35" />
        <circle r="1" fill="#34d399" filter="url(#ffp-glow)"><animateMotion dur="1.8s" repeatCount="indefinite" path="M50,50 L50,80" /></circle>

        <line x1="50" y1="80" x2="90" y2="87" stroke="#10b981" strokeOpacity="0.45" strokeDasharray="0.5 1" strokeWidth="0.3" />
        <circle r="0.75" fill="#10b981" filter="url(#ffp-glow)" opacity="0.85"><animateMotion dur="3.2s" repeatCount="indefinite" path="M50,80 L90,87" /></circle>
      </svg>

      <div className="ffp-logo">🚩</div>

      <div className="ffp-node dev"><span className="ic">🧪</span>DEV</div>
      <div className="ffp-node test"><span className="ic">🧰</span>TEST</div>
      <div className="ffp-node prod"><span className="ic">🟢</span>PROD</div>
      <div className="ffp-node mongo"><span className="ic">🍃</span>MONGODB</div>

      <div className="ffp-hub">
        <div className="ffp-orbit" />
        <div className="ffp-hub-shape"><div className="ffp-hub-core" /></div>
      </div>

      <div className="ffp-status">
        <div className="l1">FLAG SYNC: LIVE</div>
        <div className="l2">ZERO REDEPLOY · REAL-TIME TOGGLES</div>
      </div>
    </div>
  );
}
