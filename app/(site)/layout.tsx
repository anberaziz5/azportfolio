import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SVGScrollPath } from "@/components/shared/SVGScrollPath";
import { PageTransition } from "@/components/shared/PageTransition";
import { SparklesCore } from "@/components/ui/SparklesCore";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AdaChat from "@/components/AdaChat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans transition-colors duration-300 relative overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="fixed inset-0 z-[-50] pointer-events-none">
            <SparklesCore
              id="tsparticles-global"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={100}
              className="w-full h-full"
              particleColor="#F6821F"
            />
          </div>
          <LoadingScreen />
          <SVGScrollPath />
          <Navbar />
          <PageTransition>
            <main className="flex-grow flex flex-col">{children}</main>
          </PageTransition>
          <Footer />
          <SpeedInsights />
        </ThemeProvider>
        <AdaChat />
      </body>
    </html>
  );
}
