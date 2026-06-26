"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../shared/ThemeToggle";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Home from "lucide-react/dist/esm/icons/home";
import User from "lucide-react/dist/esm/icons/user";
import Briefcase from "lucide-react/dist/esm/icons/briefcase";
import Layers from "lucide-react/dist/esm/icons/layers";
import PenTool from "lucide-react/dist/esm/icons/pen-tool";
import Mail from "lucide-react/dist/esm/icons/mail";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";

const navLinks = [
  { name: "home", path: "/", icon: <Home className="w-5 h-5" /> },
  { name: "about", path: "/about", icon: <User className="w-5 h-5" /> },
  { name: "projects", path: "/projects", icon: <Briefcase className="w-5 h-5" /> },
  { name: "services", path: "/services", icon: <Layers className="w-5 h-5" /> },
  { name: "blog", path: "/blog", icon: <PenTool className="w-5 h-5" /> },
  { name: "my story", path: "/mystory", icon: <Sparkles className="w-5 h-5" /> },
  { name: "contact", path: "/contact", icon: <Mail className="w-5 h-5" /> },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="group relative z-50 flex items-center gap-2">
            <span className="font-mono text-xl font-bold tracking-tighter">
              A<span className="text-primary">.</span>A
            </span>
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-border/50 bg-background/50 px-2 py-0.5 text-xs backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
              </span>
              <span className="text-muted-foreground">Available</span>
            </div>
          </Link>

          {/* Desktop Sliding Pill Nav added */}
          <div className="hidden lg:flex flex-1 justify-center relative h-14 items-center">
            <ul className="flex h-10 items-center justify-center p-1 bg-background/50 border border-border/50 rounded-full backdrop-blur-md shadow-sm">
              {navLinks.map((link) => {
                const isActive = pathname === link.path || (link.path !== "/" && pathname.startsWith(link.path));
                return (
                  <li
                    key={link.path}
                    className="relative flex items-center justify-center capitalize font-semibold text-sm mx-1"
                  >
                    <Link
                      href={link.path}
                      className={cn(
                        "relative z-20 px-5 py-2 transition-colors duration-300 rounded-full",
                        isActive ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {link.name}
                    </Link>
                    {isActive && (
                      <div
                        className="absolute inset-0 bg-primary rounded-full z-10 shadow-md animate-fade-in"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center gap-4 z-50">
            <ThemeToggle />

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden">
              <label className="flex cursor-pointer items-center justify-center text-foreground hover:text-primary transition-colors">
                <input
                  className="hidden"
                  type="checkbox"
                  onChange={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  checked={isMobileMenuOpen}
                />
                <svg
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 32 32"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn("size-6 transition-transform duration-500 ease-out", isMobileMenuOpen && "-rotate-45")}
                >
                  <path
                    className={cn(
                      "transition-all duration-500 ease-out",
                      isMobileMenuOpen ? "[stroke-dasharray:20_300] [stroke-dashoffset:-32.42px]" : "[stroke-dasharray:12_63]"
                    )}
                    d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                  />
                  <path d="M7 16 27 16" />
                </svg>
              </label>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "lg:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-border shadow-lg transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <ul className="flex flex-col pt-4 pb-8 px-6 max-h-[80vh] overflow-y-auto">
          {navLinks.map((link, index) => {
            const isActive = pathname === link.path || (link.path !== "/" && pathname.startsWith(link.path));
            return (
              <li
                key={link.path}
                className={cn("border-b border-border/50 last:border-0", isMobileMenuOpen && "animate-fade-in")}
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <Link
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-4 py-4 text-lg font-medium tracking-tight transition-colors",
                    isActive ? "text-primary" : "text-foreground hover:text-primary"
                  )}
                >
                  <div className={cn("p-2 rounded-lg", isActive ? "bg-primary/10" : "bg-muted")}>
                    {link.icon}
                  </div>
                  {link.name}
                </Link>
              </li>
            );
          })}
          <li
            className={cn("mt-6 flex justify-center pt-6 border-t border-border/50", isMobileMenuOpen && "animate-fade-in")}
            style={{ animationDelay: `${0.05 * navLinks.length}s` }}
          >
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </header>
  );
}
