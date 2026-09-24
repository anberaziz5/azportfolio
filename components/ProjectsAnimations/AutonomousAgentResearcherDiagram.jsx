import React from "react";

/**
 * AutonomousAgentResearcherDiagram
 * Planner -> Researcher -> Synthesizer agent chain, with Gemini
 * as the underlying reasoning engine for all three.
 * Pure React + inline CSS/SVG, no extra dependencies.
 */
export default function AutonomousAgentResearcherDiagram() {
  return (
    <div className="age-wrap">
      <style>{`
        .age-wrap {
          position: relative; width: 100%; height: 100%; aspect-ratio: 16 / 9;
          border-radius: 20px;
          background: radial-gradient(circle at 28% 18%, #161233 0%, #0f0c24 55%, #0a0818 100%);
          border: 1px solid #231f4a;
          overflow: hidden; font-family: 'Inter', system-ui, -apple-system, sans-serif; box-sizing: border-box;
        }
        .age-grid { position: absolute; inset: 0; z-index: 0;
          background-image: linear-gradient(rgba(167,139,250,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .age-lines { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
        .age-node {
          position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
          width: 70px; height: 70px; border-radius: 16px; background: #07051a; color: #ece9ff;
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.03em; box-shadow: 0 6px 20px rgba(0,0,0,0.4);
          z-index: 2; animation: age-breathe 4.5s ease-in-out infinite; text-align: center;
        }
        .age-node .ic { font-size: 19px; line-height: 1; }
        .age-node.planner { top: 16%; left: 5%; border: 1.5px solid #22d3ee; box-shadow: 0 0 0 1px rgba(34,211,238,0.18), 0 0 20px rgba(34,211,238,0.4); animation-delay: 0s; }
        .age-node.researcher { top: 12%; right: 7%; border: 1.5px solid #34d399; box-shadow: 0 0 0 1px rgba(52,211,153,0.18), 0 0 20px rgba(52,211,153,0.4); animation-delay: 1.1s; }
        .age-node.synth { bottom: 10%; left: 50%; transform: translateX(-50%); border: 1.5px solid #fbbf24; box-shadow: 0 0 0 1px rgba(251,191,36,0.2), 0 0 22px rgba(251,191,36,0.45); animation-delay: 2.2s; }
        .age-node.gemini { bottom: 4%; right: 4%; width: 54px; height: 54px; font-size: 8px; border: 1.5px solid #c084fc; box-shadow: 0 0 0 1px rgba(192,132,252,0.16), 0 0 16px rgba(192,132,252,0.35); opacity: 0.95; animation-delay: 3.3s; }
        .age-logo {
          position: absolute; top: 40%; left: 0%; width: 54px; height: 54px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 22px;
          background: #0f0c24; border: 2px solid #a78bfa; color: #a78bfa; box-shadow: 0 0 18px rgba(167,139,250,0.4); z-index: 2;
        }
        .age-hub { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 84px; height: 84px; z-index: 3; }
        .age-hub-shape { width: 100%; height: 100%; background: #07051a; clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 34px rgba(167,139,250,0.55); }
        .age-hub-core { width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 0 16px 4px #a78bfa; animation: age-pulse 1.8s ease-in-out infinite; }
        .age-orbit { position: absolute; top: 50%; left: 50%; width: 160px; height: 160px; margin-top: -80px; margin-left: -80px; border: 1px dashed rgba(167,139,250,0.35); border-radius: 50%; z-index: 1; animation: age-spin 16s linear infinite; }
        @keyframes age-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.55; } }
        @keyframes age-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes age-breathe { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }
        .age-status { position: absolute; left: 24px; bottom: 18px; z-index: 2; }
        .age-status .l1 { color: #a78bfa; font-size: 11px; font-weight: 700; letter-spacing: 0.03em; }
        .age-status .l2 { color: #9893c2; font-size: 9px; margin-top: 3px; letter-spacing: 0.02em; }
        @media (prefers-reduced-motion: reduce) { .age-node, .age-hub-core, .age-orbit { animation: none !important; } }
      `}</style>

      <div className="age-grid" />

      <svg className="age-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="age-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <line x1="4" y1="45" x2="11" y2="26" stroke="#a78bfa" strokeOpacity="0.45" strokeDasharray="0.6 1" strokeWidth="0.35" />

        <line x1="11" y1="26" x2="50" y2="50" stroke="#22d3ee" strokeOpacity="0.3" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#22d3ee" filter="url(#age-glow)"><animateMotion dur="2.6s" repeatCount="indefinite" path="M11,26 L50,50" /></circle>

        <line x1="50" y1="50" x2="87" y2="22" stroke="#34d399" strokeOpacity="0.3" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#34d399" filter="url(#age-glow)"><animateMotion dur="2.2s" repeatCount="indefinite" path="M50,50 L87,22" /></circle>

        <line x1="50" y1="50" x2="50" y2="80" stroke="#fbbf24" strokeOpacity="0.35" strokeWidth="0.35" />
        <circle r="1" fill="#fbbf24" filter="url(#age-glow)"><animateMotion dur="1.8s" repeatCount="indefinite" path="M50,50 L50,80" /></circle>

        <line x1="50" y1="80" x2="90" y2="87" stroke="#c084fc" strokeOpacity="0.4" strokeDasharray="0.5 1" strokeWidth="0.3" />
        <circle r="0.75" fill="#c084fc" filter="url(#age-glow)" opacity="0.85"><animateMotion dur="3.2s" repeatCount="indefinite" path="M50,80 L90,87" /></circle>
      </svg>

      <div className="age-logo">🤖</div>

      <div className="age-node planner"><span className="ic">🧭</span>PLANNER</div>
      <div className="age-node researcher"><span className="ic">🌐</span>RESEARCH</div>
      <div className="age-node synth"><span className="ic">📝</span>SYNTH</div>
      <div className="age-node gemini"><span className="ic">♊</span>GEMINI</div>

      <div className="age-hub">
        <div className="age-orbit" />
        <div className="age-hub-shape"><div className="age-hub-core" /></div>
      </div>

      <div className="age-status">
        <div className="l1">MULTI-AGENT PIPELINE: ACTIVE</div>
        <div className="l2">PLANNER → RESEARCHER → SYNTHESIZER</div>
      </div>
    </div>
  );
}
