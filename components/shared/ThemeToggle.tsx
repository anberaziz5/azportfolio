"use client";


import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    if (resolvedTheme === "light") {
      setTheme("dark");
      return;
    }
    setTheme("light");
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        className="relative isolate flex items-center rounded-full p-1 border cursor-pointer transition-colors duration-400 ease-in-out"
        style={{
          height: 40,
          width: 80,
          backgroundColor: resolvedTheme === "light" ? "#ffffff" : "#272727",
          borderColor: resolvedTheme === "light" ? "#e5e7eb" : "#3f3f46"
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleTheme();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleTheme();
        }}
      >
        <div
          className="absolute left-0 -z-10 flex w-full justify-between text-xs font-medium tracking-wide px-2 transition-colors duration-400"
          style={{ color: resolvedTheme === "light" ? "#797979" : "#A2A2A2" }}
        >
          <span className="flex w-full justify-center">L</span>
          <span className="flex w-full justify-center">D</span>
        </div>

        <div
          className="flex aspect-square h-full rounded-full border-2 p-0.5 shadow-sm transition-all duration-400 ease-in-out"
          style={{
            backgroundColor: resolvedTheme === "light" ? "#ffffff" : "#363636",
            borderColor: resolvedTheme === "light" ? "#D8D8D8" : "#535353",
            transform: resolvedTheme === "light" ? "translateX(40px)" : "translateX(0px)",
          }}
        >
          <div
            className="h-full w-full rounded-full transition-all duration-400"
            style={{
              backgroundColor: resolvedTheme === "light" ? "#f3f4f6" : "#464646",
              boxShadow:
                resolvedTheme === "light"
                  ? "inset 1px 1px 2px rgba(0,0,0,0.1)"
                  : "inset 1px 1px 2px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      </button>
    </div>
  );
}
