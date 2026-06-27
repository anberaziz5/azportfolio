import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import dynamic from 'next/dynamic';
import { ThemeProvider } from "@/components/ThemeProvider";
import PageLoader from "@/components/PageLoader";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/shared/PageTransition";


import { LazySpeedInsights, LazySVGScrollPath, LazySparklesCore } from "@/components/shared/ClientLoaders";
import AdaChat from "@/components/AdaChat";

const Navbar = dynamic(() => import("@/components/layout/Navbar").then(mod => mod.Navbar), { ssr: true });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.anber.me'),
  title: "Anber Aziz | AI Systems Engineer & Full-Stack Developer",
  description: "Portfolio of Anber Aziz. AI/ML Researcher & Full-Stack Engineer.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" as="image" href="/ada-mascot.svg" />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans transition-colors duration-300 relative overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="fixed inset-0 z-[-50] pointer-events-none">
            <LazySparklesCore
              id="tsparticles-global"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={100}
              className="w-full h-full"
              particleColor="#F6821F"
            />
          </div>
          <PageLoader />
          <LazySVGScrollPath />
          <Navbar />
          <PageTransition>
            <main className="flex-grow flex flex-col">{children}</main>
          </PageTransition>
          <Footer />
          <LazySpeedInsights />
        </ThemeProvider>
        <AdaChat />
      </body>
    </html>
  );
}
