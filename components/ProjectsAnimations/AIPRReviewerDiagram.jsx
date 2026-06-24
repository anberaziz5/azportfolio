import React from "react";

/**
 * AIPRReviewerDiagram
 * GitHub webhook -> FastAPI review engine -> Gemini analysis -> HF-hosted listener.
 * Pure React + inline CSS/SVG, no extra dependencies.
 */
export default function AIPRReviewerDiagram() {
  return (
    <div className="aipr-wrap">
      <style>{`
        .aipr-wrap {
          position: relative; width: 100%; aspect-ratio: 16 / 9; min-height: 320px;
          border-radius: 20px;
          background: radial-gradient(circle at 28% 18%, #161b22 0%, #0d1117 55%, #090c10 100%);
          border: 1px solid #21262d;
          overflow: hidden; font-family: 'Inter', system-ui, -apple-system, sans-serif; box-sizing: border-box;
        }
        .aipr-grid { position: absolute; inset: 0; z-index: 0;
          background-image: linear-gradient(rgba(88,166,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(88,166,255,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .aipr-lines { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
        .aipr-node {
          position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
          width: 70px; height: 70px; border-radius: 16px; background: #010409; color: #e6edf3;
          font-size: 10px; font-weight: 700; letter-spacing: 0.04em; box-shadow: 0 6px 20px rgba(0,0,0,0.4);
          z-index: 2; animation: aipr-breathe 4.5s ease-in-out infinite;
        }
        .aipr-node .ic { font-size: 19px; line-height: 1; }
        .aipr-node.github { top: 16%; left: 5%; border: 1.5px solid #3fb950; box-shadow: 0 0 0 1px rgba(63,185,80,0.18), 0 0 20px rgba(63,185,80,0.4); animation-delay: 0s; }
        .aipr-node.gemini { top: 12%; right: 7%; border: 1.5px solid #bc8cff; box-shadow: 0 0 0 1px rgba(188,140,255,0.18), 0 0 20px rgba(188,140,255,0.4); animation-delay: 1.1s; }
        .aipr-node.docker { bottom: 10%; left: 50%; transform: translateX(-50%); border: 1.5px solid #58a6ff; box-shadow: 0 0 0 1px rgba(88,166,255,0.2), 0 0 22px rgba(88,166,255,0.45); animation-delay: 2.2s; }
        .aipr-node.hf { bottom: 4%; right: 4%; width: 54px; height: 54px; font-size: 8px; border: 1.5px solid #f7c948; box-shadow: 0 0 0 1px rgba(247,201,72,0.16), 0 0 16px rgba(247,201,72,0.35); opacity: 0.95; animation-delay: 3.3s; }
        .aipr-logo {
          position: absolute; top: 40%; left: 0%; width: 54px; height: 54px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 22px;
          background: #0d1117; border: 2px solid #58a6ff; color: #58a6ff; box-shadow: 0 0 18px rgba(88,166,255,0.4); z-index: 2;
        }
        .aipr-hub { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 84px; height: 84px; z-index: 3; }
        .aipr-hub-shape { width: 100%; height: 100%; background: #010409; clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 34px rgba(88,166,255,0.55); }
        .aipr-hub-core { width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 0 16px 4px #58a6ff; animation: aipr-pulse 1.8s ease-in-out infinite; }
        .aipr-orbit { position: absolute; top: 50%; left: 50%; width: 160px; height: 160px; margin-top: -80px; margin-left: -80px; border: 1px dashed rgba(88,166,255,0.35); border-radius: 50%; z-index: 1; animation: aipr-spin 16s linear infinite; }
        @keyframes aipr-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.55; } }
        @keyframes aipr-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes aipr-breathe { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }
        .aipr-status { position: absolute; left: 24px; bottom: 18px; z-index: 2; }
        .aipr-status .l1 { color: #3fb950; font-size: 11px; font-weight: 700; letter-spacing: 0.03em; }
        .aipr-status .l2 { color: #8b949e; font-size: 9px; margin-top: 3px; letter-spacing: 0.02em; }
        @media (prefers-reduced-motion: reduce) { .aipr-node, .aipr-hub-core, .aipr-orbit { animation: none !important; } }
      `}</style>

      <div className="aipr-grid" />

      <svg className="aipr-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="aipr-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <line x1="4" y1="45" x2="11" y2="26" stroke="#58a6ff" strokeOpacity="0.45" strokeDasharray="0.6 1" strokeWidth="0.35" />

        <line x1="11" y1="26" x2="50" y2="50" stroke="#3fb950" strokeOpacity="0.3" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#3fb950" filter="url(#aipr-glow)"><animateMotion dur="2.6s" repeatCount="indefinite" path="M11,26 L50,50" /></circle>

        <line x1="50" y1="50" x2="87" y2="22" stroke="#bc8cff" strokeOpacity="0.3" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#bc8cff" filter="url(#aipr-glow)"><animateMotion dur="2.2s" repeatCount="indefinite" path="M50,50 L87,22" /></circle>

        <line x1="50" y1="50" x2="50" y2="80" stroke="#58a6ff" strokeOpacity="0.35" strokeWidth="0.35" />
        <circle r="1" fill="#58a6ff" filter="url(#aipr-glow)"><animateMotion dur="1.8s" repeatCount="indefinite" path="M50,50 L50,80" /></circle>

        <line x1="50" y1="80" x2="90" y2="87" stroke="#f7c948" strokeOpacity="0.4" strokeDasharray="0.5 1" strokeWidth="0.3" />
        <circle r="0.75" fill="#f7c948" filter="url(#aipr-glow)" opacity="0.85"><animateMotion dur="3.2s" repeatCount="indefinite" path="M50,80 L90,87" /></circle>
      </svg>

      <div className="aipr-logo">🚀</div>

      <div className="aipr-node github"><span className="ic">🐙</span>GITHUB</div>
      <div className="aipr-node gemini"><span className="ic">♊</span>GEMINI</div>
      <div className="aipr-node docker"><span className="ic">🐳</span>DOCKER</div>
      <div className="aipr-node hf"><span className="ic">🤗</span>HF SPACE</div>

      <div className="aipr-hub">
        <div className="aipr-orbit" />
        <div className="aipr-hub-shape"><div className="aipr-hub-core" /></div>
      </div>

      <div className="aipr-status">
        <div className="l1">WEBHOOK LISTENER: ACTIVE</div>
        <div className="l2">GEMINI REVIEW ON EVERY PR PUSH</div>
      </div>
    </div>
  );
}
