import React from "react";

/**
 * FineTuningVsPromptingVsRAGDiagram
 * A query hits the decision core and routes to one of three strategies.
 * RAG is given a fourth, secondary node (Vector DB) to visually show
 * it's the only path that drags extra infrastructure along with it,
 * which is the central tradeoff the post argues.
 * Pure React + inline CSS/SVG, no extra dependencies.
 */
export default function FineTuningVsPromptingVsRAGDiagram() {
  return (
    <div className="dfr-wrap">
      <style>{`
        .dfr-wrap {
          position: relative; width: 100%; aspect-ratio: 16 / 9; min-height: 320px;
          border-radius: 20px;
          background: radial-gradient(circle at 28% 18%, #111827 0%, #0b1220 55%, #060911 100%);
          border: 1px solid #1f2937;
          overflow: hidden; font-family: 'Inter', system-ui, -apple-system, sans-serif; box-sizing: border-box;
        }
        .dfr-grid { position: absolute; inset: 0; z-index: 0;
          background-image: linear-gradient(rgba(56,189,248,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .dfr-lines { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
        .dfr-node {
          position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
          width: 70px; height: 70px; border-radius: 16px; background: #060a12; color: #e8eef7;
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.03em; box-shadow: 0 6px 20px rgba(0,0,0,0.45);
          z-index: 2; animation: dfr-breathe 4.5s ease-in-out infinite; text-align: center;
        }
        .dfr-node .ic { font-size: 19px; line-height: 1; }
        .dfr-node.prompt { top: 16%; left: 5%; border: 1.5px solid #38bdf8; box-shadow: 0 0 0 1px rgba(56,189,248,0.2), 0 0 20px rgba(56,189,248,0.4); animation-delay: 0s; }
        .dfr-node.finetune { top: 12%; right: 7%; border: 1.5px solid #f59e0b; box-shadow: 0 0 0 1px rgba(245,158,11,0.2), 0 0 20px rgba(245,158,11,0.4); animation-delay: 1.1s; }
        .dfr-node.rag { bottom: 10%; left: 50%; transform: translateX(-50%); border: 1.5px solid #a78bfa; box-shadow: 0 0 0 1px rgba(167,139,250,0.22), 0 0 22px rgba(167,139,250,0.45); animation-delay: 2.2s; }
        .dfr-node.vecdb { bottom: 4%; right: 4%; width: 54px; height: 54px; font-size: 8px; border: 1.5px solid #22d3ee; box-shadow: 0 0 0 1px rgba(34,211,238,0.18), 0 0 16px rgba(34,211,238,0.4); opacity: 0.95; animation-delay: 3.3s; }
        .dfr-logo {
          position: absolute; top: 40%; left: 0%; width: 54px; height: 54px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 22px;
          background: #0b1220; border: 2px solid #2dd4bf; color: #2dd4bf; box-shadow: 0 0 18px rgba(45,212,191,0.4); z-index: 2;
        }
        .dfr-hub { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 84px; height: 84px; z-index: 3; }
        .dfr-hub-shape { width: 100%; height: 100%; background: #060a12; clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 34px rgba(45,212,191,0.5); }
        .dfr-hub-core { width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 0 16px 4px #2dd4bf; animation: dfr-pulse 1.8s ease-in-out infinite; }
        .dfr-orbit { position: absolute; top: 50%; left: 50%; width: 160px; height: 160px; margin-top: -80px; margin-left: -80px; border: 1px dashed rgba(45,212,191,0.35); border-radius: 50%; z-index: 1; animation: dfr-spin 16s linear infinite; }
        @keyframes dfr-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.55; } }
        @keyframes dfr-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes dfr-breathe { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }
        .dfr-status { position: absolute; left: 24px; bottom: 18px; z-index: 2; }
        .dfr-status .l1 { color: #2dd4bf; font-size: 11px; font-weight: 700; letter-spacing: 0.03em; }
        .dfr-status .l2 { color: #8d98ab; font-size: 9px; margin-top: 3px; letter-spacing: 0.02em; }
        @media (prefers-reduced-motion: reduce) { .dfr-node, .dfr-hub-core, .dfr-orbit { animation: none !important; } }
      `}</style>

      <div className="dfr-grid" />

      <svg className="dfr-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="dfr-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <line x1="4" y1="45" x2="11" y2="26" stroke="#2dd4bf" strokeOpacity="0.5" strokeDasharray="0.6 1" strokeWidth="0.35" />

        <line x1="11" y1="26" x2="50" y2="50" stroke="#38bdf8" strokeOpacity="0.3" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#38bdf8" filter="url(#dfr-glow)"><animateMotion dur="2.6s" repeatCount="indefinite" path="M11,26 L50,50" /></circle>

        <line x1="50" y1="50" x2="87" y2="22" stroke="#f59e0b" strokeOpacity="0.3" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#f59e0b" filter="url(#dfr-glow)"><animateMotion dur="2.2s" repeatCount="indefinite" path="M50,50 L87,22" /></circle>

        <line x1="50" y1="50" x2="50" y2="80" stroke="#a78bfa" strokeOpacity="0.4" strokeWidth="0.35" />
        <circle r="1" fill="#a78bfa" filter="url(#dfr-glow)"><animateMotion dur="1.8s" repeatCount="indefinite" path="M50,50 L50,80" /></circle>

        <line x1="50" y1="80" x2="90" y2="87" stroke="#22d3ee" strokeOpacity="0.45" strokeDasharray="0.5 1" strokeWidth="0.3" />
        <circle r="0.75" fill="#22d3ee" filter="url(#dfr-glow)" opacity="0.85"><animateMotion dur="3.2s" repeatCount="indefinite" path="M50,80 L90,87" /></circle>
      </svg>

      <div className="dfr-logo">🧠</div>

      <div className="dfr-node prompt"><span className="ic">💬</span>PROMPT</div>
      <div className="dfr-node finetune"><span className="ic">🎯</span>FINE-TUNE</div>
      <div className="dfr-node rag"><span className="ic">📚</span>RAG</div>
      <div className="dfr-node vecdb"><span className="ic">🗄️</span>VECTOR DB</div>

      <div className="dfr-hub">
        <div className="dfr-orbit" />
        <div className="dfr-hub-shape"><div className="dfr-hub-core" /></div>
      </div>

      <div className="dfr-status">
        <div className="l1">DECISION ENGINE: CONTEXT-AWARE ROUTING</div>
        <div className="l2">PROMPT · RAG · FINE-TUNE</div>
      </div>
    </div>
  );
}
