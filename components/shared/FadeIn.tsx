"use client";

import { motion } from "framer-motion";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  duration?: number;
}

export function FadeInSection({ children, className, delay = 0, y = 20, x = 0, duration = 0.6 }: FadeInProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function FadeInDiv({ children, className, delay = 0, y = 20, x = 0, duration = 0.6 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
