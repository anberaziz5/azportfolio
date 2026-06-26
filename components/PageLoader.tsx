'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Handle initial page load
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoad(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle route changes
  useEffect(() => {
    if (initialLoad) return; // don't double-trigger on first load
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [pathname, initialLoad]);

  if (!loading && !initialLoad) return null;

  return (
    <>
      {/* Fullscreen overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--background)',
          transition: 'opacity 0.2s ease',
        }}
        className="loader-overlay"
      >
        {/* Gooey dot container */}
        <div
          className="loader-container"
          style={{
            filter: 'url(#goo)',
            display: 'flex',
            alignItems: 'center',
            gap: '0px',
            position: 'relative',
            height: '60px',
          }}
        >
          <div className="loader-dot loader-dot-1" />
          <div className="loader-dot loader-dot-2" />
          <div className="loader-dot loader-dot-3" />
        </div>

        {/* SVG filter — must be in DOM for goo effect to work */}
        <svg
          style={{ position: 'absolute', width: 0, height: 0 }}
          aria-hidden="true"
        >
          <defs>
            <filter id="goo">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
              />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Loader CSS — scoped via style tag */}
      <style>{`
        .loader-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #F6821F;
          position: absolute;
        }

        .loader-dot-1 {
          animation: loader-dot1 1.5s ease-in-out infinite;
        }

        .loader-dot-2 {
          animation: loader-dot2 1.5s ease-in-out infinite;
          animation-delay: 0.15s;
        }

        .loader-dot-3 {
          animation: loader-dot3 1.5s ease-in-out infinite;
          animation-delay: 0.3s;
        }

        @keyframes loader-dot1 {
          0%, 100% { transform: translateX(-24px) scale(0.8); opacity: 0.6; }
          50% { transform: translateX(0px) scale(1.2); opacity: 1; }
        }

        @keyframes loader-dot2 {
          0%, 100% { transform: translateX(0px) scale(1); opacity: 0.8; }
          50% { transform: translateX(0px) scale(0.9); opacity: 0.9; }
        }

        @keyframes loader-dot3 {
          0%, 100% { transform: translateX(24px) scale(0.8); opacity: 0.6; }
          50% { transform: translateX(0px) scale(1.2); opacity: 1; }
        }

        .loader-overlay {
          animation: loaderFadeIn 0.15s ease forwards;
        }

        @keyframes loaderFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
