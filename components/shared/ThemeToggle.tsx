"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      return;
    }
    setTheme("light");
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center">
      <MotionConfig
        transition={{
          duration: 0.4,
          type: "tween",
          ease: "easeInOut",
        }}
      >
        <AnimatePresence initial={false}>
          <motion.button
            className={`relative isolate flex items-center rounded-full p-1 border ${
              theme === "light" ? "justify-end" : "justify-start"
            }`}
            style={{
              height: 40,
              width: 80,
            }}
            animate={{
              backgroundColor: theme === "light" ? "#ffffff" : "#272727",
              borderColor: theme === "light" ? "#e5e7eb" : "#3f3f46"
            }}
            onClick={toggleTheme}
          >
            <motion.div
              className="absolute left-0 -z-10 flex w-full justify-between text-xs font-medium tracking-wide px-2"
              animate={{ color: theme === "light" ? "#797979" : "#A2A2A2" }}
            >
              <span className="flex w-full justify-center">L</span>
              <span className="flex w-full justify-center">D</span>
            </motion.div>

            <motion.div
              layout
              className="flex aspect-square h-full rounded-full border-2 p-0.5 shadow-sm"
              animate={{
                backgroundColor: theme === "light" ? "#ffffff" : "#363636",
                borderColor: theme === "light" ? "#D8D8D8" : "#535353",
              }}
            >
              <motion.div
                className="h-full w-full rounded-full"
                animate={{
                  backgroundColor: theme === "light" ? "#f3f4f6" : "#464646",
                  boxShadow:
                    theme === "light"
                      ? "inset 1px 1px 2px rgba(0,0,0,0.1)"
                      : "inset 1px 1px 2px rgba(0,0,0,0.5)",
                }}
              />
            </motion.div>
          </motion.button>
        </AnimatePresence>
      </MotionConfig>
    </div>
  );
}
