import React from "react";

/**
 * LiveRagPipelineDiagram
 * -----------------------
 * An animated "system status" diagram for OpenScholar, styled after the
 * multi-cloud sync visual you shared: a glowing central hub, satellite
 * nodes for each service, and dots that travel along the connector lines
 * to suggest live data flow.
 *
 * Pure React + inline CSS/SVG — no extra libraries, no Tailwind config
 * needed, so you can drop this straight into the OpenScholar frontend
 * (or any Vite/React project) and it will just work.
 *
 * Customize:
 * - Swap the emoji in each .osd-node for an <img> or lucide-react icon.
 * - Edit the four node labels / colors below to match new services.
 * - Edit the two lines in .osd-status to change the status copy.
 */
export default function LiveRagPipelineDiagram() {
  return (
    <div className="osd-wrap">
      <style>{`
        .osd-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          min-height: 320px;
          border-radius: 20px;
          background: radial-gradient(circle at 28% 18%, #fff8f1 0%, #fdeee3 45%, #fbe4d6 100%);
          border: 1px solid #f1d6c2;
          overflow: hidden;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
        }

        .osd-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(180,110,80,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,110,80,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
          z-index: 0;
        }

        .osd-lines { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }

        .osd-node {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          width: 70px;
          height: 70px;
          border-radius: 16px;
          background: #0b0d12;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          box-shadow: 0 6px 20px rgba(0,0,0,0.20);
          z-index: 2;
          animation: osd-breathe 4.5s ease-in-out infinite;
        }
        .osd-node .ic { font-size: 19px; line-height: 1; }

        .osd-node.arxiv {
          top: 16%; left: 5%;
          border: 1.5px solid #34d399;
          box-shadow: 0 0 0 1px rgba(52,211,153,0.18), 0 0 20px rgba(52,211,153,0.4), 0 6px 20px rgba(0,0,0,0.2);
          animation-delay: 0s;
        }
        .osd-node.qdrant {
          top: 12%; right: 7%;
          border: 1.5px solid #a78bfa;
          box-shadow: 0 0 0 1px rgba(167,139,250,0.18), 0 0 20px rgba(167,139,250,0.4), 0 6px 20px rgba(0,0,0,0.2);
          animation-delay: 1.1s;
        }
        .osd-node.groq {
          bottom: 10%; left: 50%; transform: translateX(-50%);
          border: 1.5px solid #fbbf24;
          box-shadow: 0 0 0 1px rgba(251,191,36,0.2), 0 0 22px rgba(251,191,36,0.45), 0 6px 20px rgba(0,0,0,0.2);
          animation-delay: 2.2s;
        }
        .osd-node.gemini {
          bottom: 4%; right: 4%;
          width: 54px; height: 54px;
          font-size: 8px;
          border: 1.5px solid #c4b5fd;
          box-shadow: 0 0 0 1px rgba(196,181,253,0.16), 0 0 16px rgba(196,181,253,0.35);
          opacity: 0.95;
          animation-delay: 3.3s;
        }

        .osd-logo {
          position: absolute;
          top: 40%; left: 0%;
          width: 54px; height: 54px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          background: #fff;
          border: 2px solid #f4845f;
          color: #f4845f;
          box-shadow: 0 0 18px rgba(244,132,95,0.4);
          z-index: 2;
        }

        .osd-hub { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 84px; height: 84px; z-index: 3; }
        .osd-hub-shape {
          width: 100%; height: 100%;
          background: #0b0d12;
          clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 34px rgba(244,132,95,0.55);
        }
        .osd-hub-core {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 16px 4px #f4845f;
          animation: osd-pulse 1.8s ease-in-out infinite;
        }
        .osd-orbit {
          position: absolute; top: 50%; left: 50%;
          width: 160px; height: 160px;
          margin-top: -80px; margin-left: -80px;
          border: 1px dashed rgba(244,132,95,0.35);
          border-radius: 50%;
          z-index: 1;
          animation: osd-spin 16s linear infinite;
        }

        @keyframes osd-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.55; }
        }
        @keyframes osd-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes osd-breathe {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }

        .osd-status { position: absolute; left: 24px; bottom: 18px; z-index: 2; }
        .osd-status .l1 { color: #1f9e6e; font-size: 11px; font-weight: 700; letter-spacing: 0.03em; }
        .osd-status .l2 { color: #a9826c; font-size: 9px; margin-top: 3px; letter-spacing: 0.02em; }

        @media (prefers-reduced-motion: reduce) {
          .osd-node, .osd-hub-core, .osd-orbit { animation: none !important; }
          .osd-lines circle animateMotion { display: none; }
        }
      `}</style>

      <div className="osd-grid" />

      {/* Connector lines + traveling glow dots. Coordinates are in a 0-100
          unit square so they track the percentage-based node positions
          above regardless of the container's actual pixel size. */}
      <svg className="osd-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="osd-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* logo -> arXiv (static dashed) */}
        <line x1="4" y1="45" x2="11" y2="26" stroke="#f4845f" strokeOpacity="0.45" strokeDasharray="0.6 1" strokeWidth="0.35" />

        {/* arXiv -> hub */}
        <line x1="11" y1="26" x2="50" y2="50" stroke="#34d399" strokeOpacity="0.3" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#34d399" filter="url(#osd-glow)">
          <animateMotion dur="2.6s" repeatCount="indefinite" path="M11,26 L50,50" />
        </circle>

        {/* hub -> Qdrant */}
        <line x1="50" y1="50" x2="87" y2="22" stroke="#a78bfa" strokeOpacity="0.3" strokeDasharray="0.5 1.2" strokeWidth="0.3" />
        <circle r="0.9" fill="#a78bfa" filter="url(#osd-glow)">
          <animateMotion dur="2.2s" repeatCount="indefinite" path="M50,50 L87,22" />
        </circle>

        {/* hub -> Groq (primary, solid) */}
        <line x1="50" y1="50" x2="50" y2="80" stroke="#fbbf24" strokeOpacity="0.35" strokeWidth="0.35" />
        <circle r="1" fill="#fbbf24" filter="url(#osd-glow)">
          <animateMotion dur="1.8s" repeatCount="indefinite" path="M50,50 L50,80" />
        </circle>

        {/* Groq -> Gemini (fallback route) */}
        <line x1="50" y1="80" x2="90" y2="87" stroke="#c4b5fd" strokeOpacity="0.4" strokeDasharray="0.5 1" strokeWidth="0.3" />
        <circle r="0.75" fill="#c4b5fd" filter="url(#osd-glow)" opacity="0.85">
          <animateMotion dur="3.2s" repeatCount="indefinite" path="M50,80 L90,87" />
        </circle>
      </svg>

      <div className="osd-logo">🖧</div>

      <div className="osd-node arxiv"><span className="ic">📥</span>ARXIV</div>
      <div className="osd-node qdrant"><span className="ic">🗄️</span>QDRANT</div>
      <div className="osd-node groq"><span className="ic">🚀</span>GROQ</div>
      <div className="osd-node gemini"><span className="ic">♊</span>GEMINI</div>

      <div className="osd-hub">
        <div className="osd-orbit" />
        <div className="osd-hub-shape">
          <div className="osd-hub-core" />
        </div>
      </div>

      <div className="osd-status">
        <div className="l1">LIVE RAG PIPELINE: ACTIVE</div>
        <div className="l2">GROQ PRIMARY · GEMINI FALLBACK READY</div>
      </div>
    </div>
  );
}
