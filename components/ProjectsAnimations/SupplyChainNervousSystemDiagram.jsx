import React from "react";

/**
 * SupplyChainNervousSystemDiagram
 * XGBoost risk scoring and Folium radar mapping feed the triage
 * core, which dispatches Gemini for mitigation directives surfaced
 * in the Streamlit command center.
 * Pure React + inline CSS/SVG, no extra dependencies.
 */
export default function SupplyChainNervousSystemDiagram() {
  return (
    <div className="scn-wrap">
      <style>{`
        .scn-wrap {
          position: relative; width: 100%; aspect-ratio: 16 / 9; min-height: 320px;
          border-radius: 20px;
          background: radial-gradient(circle at 28% 18%, #181c1d 0%, #101314 55%, #0a0c0c 100%);
          border: 1px solid #232828;
          overflow: hidden; font-family: 'Inter', system-ui, -apple-system, sans-serif; box-sizing: border-box;
        }
        .scn-grid { position: absolute; inset: 0; z-index: 0;
          background-image: linear-gradient(rgba(52,211,153,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .scn-lines { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
        .scn-node {
          position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
          width: 70px; height: 70px; border-radius: 16px; background: #060807; color: #e7f5ee;
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.03em; box-shadow: 0 6px 20px rgba(0,0,0,0.45);
          z-index: 2; animation: scn-breathe 4.5s ease-in-out infinite; text-align: center;
        }
        .scn-node .ic { font-size: 19px; line-height: 1; }
        .scn-node.xgb { top: 16%; left: 5%; border: 1.5px solid #fbbf24; box-shadow: 0 0 0 1px rgba(251,191,36,0.18), 0 0 20px rgba(251,191,36,0.4); animation-delay: 0s; }
        .scn-node.folium { top: 12%; right: 7%; border: 1.5px solid #2dd4bf; box-shadow: 0 0 0 1px rgba(45,212,191,0.18), 0 0 20px rgba(45,212,191,0.4); animation-delay: 1.1s; }
        .scn-node.gemini { bottom: 10%; left: 50%; transform: translateX(-50%); border: 1.5px solid #60a5fa; box-shadow: 0 0 0 1px rgba(96,165,250,0.2), 0 0 22px rgba(96,165,250,0.45); animation-delay: 2.2s; }
        .scn-node.streamlit { bottom: 4%; right: 4%; width: 54px; height: 54px; font-size: 8px; border: 1.5px solid #fb7185; box-shadow: 0 0 0 1px rgba(251,113,133,0.16), 0 0 16px rgba(251,113,133,0.35); opacity: 0.95; animation-delay: 3.3s; }
        .scn-logo {
          position: absolute; top: 40%; left: 0%; width: 54px; height: 54px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 22px;
          background: #0a0c0c; border: 2px solid #34d399; color: #34d399; box-shadow: 0 0 18px rgba(52,211,153,0.4); z-index: 2;
        }
        .scn-hub { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 84px; height: 84px; z-index: 3; }
        .scn-hub-shape { width: 100%; height: 100%; background: #060807; clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 34px rgba(52,211,153,0.55); }
        .scn-hub-core { width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 0 16px 4px #34d399; animation: scn-pulse 1.8s ease-in-out infinite; }
        .scn-orbit { position: absolute; top: 50%; left: 50%; width: 160px; height: 160px; margin-top: -80px; margin-left: -80px; border: 1px dashed rgba(52,211,153,0.35); border-radius: 50%; z-index: 1; animation: scn-spin 16s linear infinite; }
        @keyframes scn-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.55; } }
        @keyframes scn-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scn-breathe { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }
        .scn-status { position: absolute; left: 24px; bottom: 18px; z-index: 2; }
        .scn-status .l1 { color: #34d399; font-size: 11px; font-weight: 700; letter-spacing: 0.03em; }
        .scn-status .l2 { color: #8da89c; font-size: 9px; margin-top: 3px; letter-spacing: 0.02em; }
        @media (prefers-reduced-motion: reduce) { .scn-node, .scn-hub-core, .scn-orbit { animation: none !important; } }
      `}</style>

      <div className="scn-grid" />

      <svg className="scn-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="scn-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <line x1="4" y1="45" x2="11" y2="26" stroke="#34d399" strokeOpacity="0.5" strokeDasharray="0.6 1" strokeWidth="0.35" />

        <line x1="11" y1="26" x2="50" y2="50" stroke="#fbbf24" strokeOpacity="0.3" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#fbbf24" filter="url(#scn-glow)"><animateMotion dur="2.6s" repeatCount="indefinite" path="M11,26 L50,50" /></circle>

        <line x1="50" y1="50" x2="87" y2="22" stroke="#2dd4bf" strokeOpacity="0.3" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#2dd4bf" filter="url(#scn-glow)"><animateMotion dur="2.2s" repeatCount="indefinite" path="M50,50 L87,22" /></circle>

        <line x1="50" y1="50" x2="50" y2="80" stroke="#60a5fa" strokeOpacity="0.4" strokeWidth="0.35" />
        <circle r="1" fill="#60a5fa" filter="url(#scn-glow)"><animateMotion dur="1.8s" repeatCount="indefinite" path="M50,50 L50,80" /></circle>

        <line x1="50" y1="80" x2="90" y2="87" stroke="#fb7185" strokeOpacity="0.4" strokeDasharray="0.5 1" strokeWidth="0.3" />
        <circle r="0.75" fill="#fb7185" filter="url(#scn-glow)" opacity="0.85"><animateMotion dur="3.2s" repeatCount="indefinite" path="M50,80 L90,87" /></circle>
      </svg>

      <div className="scn-logo">⚡</div>

      <div className="scn-node xgb"><span className="ic">📊</span>XGBOOST</div>
      <div className="scn-node folium"><span className="ic">🗺️</span>RADAR</div>
      <div className="scn-node gemini"><span className="ic">♊</span>GEMINI</div>
      <div className="scn-node streamlit"><span className="ic">🎛️</span>COMMAND</div>

      <div className="scn-hub">
        <div className="scn-orbit" />
        <div className="scn-hub-shape"><div className="scn-hub-core" /></div>
      </div>

      <div className="scn-status">
        <div className="l1">PREDICTIVE TRIAGE: ACTIVE</div>
        <div className="l2">XGBOOST RISK SCORE → GEMINI MITIGATION</div>
      </div>
    </div>
  );
}
