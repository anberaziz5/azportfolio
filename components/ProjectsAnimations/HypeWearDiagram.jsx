import React from "react";

/**
 * HypeWearDiagram
 * Filtration matrix and cart state feeding the zero-dependency
 * render engine, with local data as the source of truth.
 * Palette pulled from HypeWear's own design tokens
 * (deep charcoal, warm cream, raw ochre, muted sage).
 * Pure React + inline CSS/SVG, no extra dependencies.
 */
export default function HypeWearDiagram() {
  return (
    <div className="hwr-wrap">
      <style>{`
        .hwr-wrap {
          position: relative; width: 100%; height: 100%; aspect-ratio: 16 / 9;
          border-radius: 20px;
          background: radial-gradient(circle at 28% 18%, #1a1a1a 0%, #121212 55%, #0d0d0d 100%);
          border: 1px solid #2a2a2a;
          overflow: hidden; font-family: 'Inter', system-ui, -apple-system, sans-serif; box-sizing: border-box;
        }
        .hwr-grid { position: absolute; inset: 0; z-index: 0;
          background-image: linear-gradient(rgba(245,245,240,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,240,0.05) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .hwr-lines { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
        .hwr-node {
          position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
          width: 70px; height: 70px; border-radius: 16px; background: #060606; color: #f5f5f0;
          font-size: 10px; font-weight: 700; letter-spacing: 0.04em; box-shadow: 0 6px 20px rgba(0,0,0,0.45);
          z-index: 2; animation: hwr-breathe 4.5s ease-in-out infinite;
        }
        .hwr-node .ic { font-size: 19px; line-height: 1; }
        .hwr-node.filter { top: 16%; left: 5%; border: 1.5px solid #8aa085; box-shadow: 0 0 0 1px rgba(138,160,133,0.2), 0 0 20px rgba(138,160,133,0.4); animation-delay: 0s; }
        .hwr-node.cart { top: 12%; right: 7%; border: 1.5px solid #c97b3d; box-shadow: 0 0 0 1px rgba(201,123,61,0.2), 0 0 20px rgba(201,123,61,0.4); animation-delay: 1.1s; }
        .hwr-node.dom { bottom: 10%; left: 50%; transform: translateX(-50%); border: 1.5px solid #f5f5f0; box-shadow: 0 0 0 1px rgba(245,245,240,0.18), 0 0 22px rgba(245,245,240,0.35); animation-delay: 2.2s; }
        .hwr-node.data { bottom: 4%; right: 4%; width: 54px; height: 54px; font-size: 8px; border: 1.5px solid #8aa085; box-shadow: 0 0 0 1px rgba(138,160,133,0.16), 0 0 16px rgba(138,160,133,0.3); opacity: 0.95; animation-delay: 3.3s; }
        .hwr-logo {
          position: absolute; top: 40%; left: 0%; width: 54px; height: 54px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 22px;
          background: #f5f5f0; border: 2px solid #c97b3d; color: #c97b3d; box-shadow: 0 0 18px rgba(201,123,61,0.4); z-index: 2;
        }
        .hwr-hub { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 84px; height: 84px; z-index: 3; }
        .hwr-hub-shape { width: 100%; height: 100%; background: #060606; clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 34px rgba(201,123,61,0.5); }
        .hwr-hub-core { width: 14px; height: 14px; border-radius: 50%; background: #f5f5f0; box-shadow: 0 0 16px 4px #c97b3d; animation: hwr-pulse 1.8s ease-in-out infinite; }
        .hwr-orbit { position: absolute; top: 50%; left: 50%; width: 160px; height: 160px; margin-top: -80px; margin-left: -80px; border: 1px dashed rgba(201,123,61,0.35); border-radius: 50%; z-index: 1; animation: hwr-spin 16s linear infinite; }
        @keyframes hwr-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.55; } }
        @keyframes hwr-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes hwr-breathe { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }
        .hwr-status { position: absolute; left: 24px; bottom: 18px; z-index: 2; font-style: italic; }
        .hwr-status .l1 { color: #c97b3d; font-size: 11px; font-weight: 700; letter-spacing: 0.03em; font-family: Georgia, 'Cormorant Garamond', serif; }
        .hwr-status .l2 { color: #9a9a92; font-size: 9px; margin-top: 3px; letter-spacing: 0.02em; }
        @media (prefers-reduced-motion: reduce) { .hwr-node, .hwr-hub-core, .hwr-orbit { animation: none !important; } }
      `}</style>

      <div className="hwr-grid" />

      <svg className="hwr-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="hwr-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <line x1="4" y1="45" x2="11" y2="26" stroke="#c97b3d" strokeOpacity="0.5" strokeDasharray="0.6 1" strokeWidth="0.35" />

        <line x1="11" y1="26" x2="50" y2="50" stroke="#8aa085" strokeOpacity="0.35" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#8aa085" filter="url(#hwr-glow)"><animateMotion dur="2.6s" repeatCount="indefinite" path="M11,26 L50,50" /></circle>

        <line x1="50" y1="50" x2="87" y2="22" stroke="#c97b3d" strokeOpacity="0.35" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#c97b3d" filter="url(#hwr-glow)"><animateMotion dur="2.2s" repeatCount="indefinite" path="M50,50 L87,22" /></circle>

        <line x1="50" y1="50" x2="50" y2="80" stroke="#f5f5f0" strokeOpacity="0.3" strokeWidth="0.35" />
        <circle r="1" fill="#f5f5f0" filter="url(#hwr-glow)"><animateMotion dur="1.8s" repeatCount="indefinite" path="M50,50 L50,80" /></circle>

        <line x1="50" y1="80" x2="90" y2="87" stroke="#8aa085" strokeOpacity="0.4" strokeDasharray="0.5 1" strokeWidth="0.3" />
        <circle r="0.75" fill="#8aa085" filter="url(#hwr-glow)" opacity="0.85"><animateMotion dur="3.2s" repeatCount="indefinite" path="M50,80 L90,87" /></circle>
      </svg>

      <div className="hwr-logo">🧥</div>

      <div className="hwr-node filter"><span className="ic">🔍</span>FILTER</div>
      <div className="hwr-node cart"><span className="ic">🛍️</span>CART</div>
      <div className="hwr-node dom"><span className="ic">🖥️</span>DOM</div>
      <div className="hwr-node data"><span className="ic">🗂️</span>DATA</div>

      <div className="hwr-hub">
        <div className="hwr-orbit" />
        <div className="hwr-hub-shape"><div className="hwr-hub-core" /></div>
      </div>

      <div className="hwr-status">
        <div className="l1">ZERO-DEPENDENCY RUNTIME: LIVE</div>
        <div className="l2">Vanilla JS · No Framework Overhead</div>
      </div>
    </div>
  );
}
