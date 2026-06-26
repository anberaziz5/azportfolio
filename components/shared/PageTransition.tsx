"use client";

import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className="flex-grow flex flex-col pt-24 animate-fade-in-up"
    >
      {children}
    </div>
  );
}
