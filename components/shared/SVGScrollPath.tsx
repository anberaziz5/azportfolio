"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function SVGScrollPath() {
  const { scrollYProgress } = useScroll();
  // Using a very tight spring so it tracks the scroll closely without "staying behind"
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 800,
    damping: 50,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden opacity-80">
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 0 12px var(--color-primary)) drop-shadow(0 0 24px var(--color-primary))" }}
      >
        <motion.path
          d="M 10 0 C 40 20, 10 40, 80 60 S 10 80, 50 100"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ pathLength: scaleY }}
        />
      </svg>
    </div>
  );
}
