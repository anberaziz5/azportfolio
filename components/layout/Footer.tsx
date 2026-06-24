import Link from "next/link";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-transparent py-12 relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2 text-center md:text-left flex flex-col items-center md:items-start">
            <Link href="/" className="inline-block mb-4">
              <span className="font-mono text-2xl font-bold tracking-tighter">
                Anber<span className="text-primary">.</span>Aziz
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              AI Systems Engineer & Full-Stack Developer. Building intelligent, scalable, and beautiful web experiences.
            </p>
          </div>

          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h3 className="font-medium mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h3 className="font-medium mb-4">Connect</h3>
            <div className="flex gap-4 justify-center md:justify-start">
              <a href="https://github.com/AnberAziz5" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <FaGithub size={20} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://linkedin.com/in/anber-aziz-70b028266" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <FaLinkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="mailto:io@anber.me" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail size={20} />
                <span className="sr-only">Email</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <FaTwitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50 text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Anber Aziz. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-primary transition-colors">Terms & Conditions</Link>
          </div>
          <p className="flex items-center gap-1">
            Built with Next.js & <span className="text-primary">☕</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
