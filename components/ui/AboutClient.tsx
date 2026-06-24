"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { FadeInSection } from "@/components/shared/FadeIn";
import { ExperienceSection } from "@/components/ui/ExperienceSection";
import { CertificationsSection } from "@/components/ui/CertificationsSection";
import { 
  SiPython, SiJavascript, SiTypescript, SiCplusplus, 
  SiPytorch, SiTensorflow, SiScikitlearn, SiHuggingface,
  SiPandas, SiNumpy,
  SiNodedotjs, SiExpress, SiFastapi, SiDjango,
  SiReact, SiNextdotjs, SiTailwindcss, SiFramer,
  SiPostgresql, SiMongodb, SiRedis,
  SiDocker, SiVercel, SiGit
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

const techStack = [
  { icon: SiPython, name: "Python" },
  { icon: SiJavascript, name: "JavaScript" },
  { icon: SiTypescript, name: "TypeScript" },
  { icon: SiCplusplus, name: "C++" },
  { icon: SiPytorch, name: "PyTorch" },
  { icon: SiTensorflow, name: "TensorFlow" },
  { icon: SiScikitlearn, name: "Scikit-Learn" },
  { icon: SiHuggingface, name: "HuggingFace" },
  { icon: SiPandas, name: "Pandas" },
  { icon: SiNumpy, name: "NumPy" },
  { icon: SiNodedotjs, name: "Node.js" },
  { icon: SiExpress, name: "Express" },
  { icon: SiFastapi, name: "FastAPI" },
  { icon: SiDjango, name: "Django" },
  { icon: SiReact, name: "React" },
  { icon: SiNextdotjs, name: "Next.js" },
  { icon: SiTailwindcss, name: "Tailwind CSS" },
  { icon: SiFramer, name: "Framer Motion" },
  { icon: SiPostgresql, name: "PostgreSQL" },
  { icon: SiMongodb, name: "MongoDB" },
  { icon: SiRedis, name: "Redis" },
  { icon: SiDocker, name: "Docker" },
  { icon: FaAws, name: "AWS" },
  { icon: SiVercel, name: "Vercel" },
  { icon: SiGit, name: "Git" },
];

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.8, 1] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 0.5], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 0.5], [50, 0]);

  return (
    <div
      className="h-[40rem] md:h-[60rem] flex items-center justify-center relative p-2 md:p-10 w-full"
      ref={containerRef}
    >
      <div
        className="w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        {titleComponent && (
          <motion.div
            style={{ translateY: translate }}
            className="max-w-5xl mx-auto text-center mb-8"
          >
            {titleComponent}
          </motion.div>
        )}
        <motion.div
          style={{
            rotateX: rotate,
            scale,
            boxShadow:
              "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
          }}
          className="max-w-5xl mx-auto w-full border-4 border-border/50 p-2 md:p-4 bg-card rounded-[30px] shadow-2xl"
        >
          <div className="w-full overflow-hidden rounded-2xl bg-muted relative">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export function AboutClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Image 1: Normal Entrance (Removed scroll offset to prevent invisibility)
  // Replaced with Framer Motion initial/animate on the element directly.

  // Image 4: Fade/Blur Out
  const img4Ref = useRef(null);
  const { scrollYProgress: scroll4 } = useScroll({ target: img4Ref, offset: ["start center", "end start"] });
  const blur4 = useTransform(scroll4, [0, 1], ["blur(0px)", "blur(20px)"]);
  const opacity4 = useTransform(scroll4, [0, 1], [1, 0]);

  // Image 5: Mask Reveal (Bottom)
  const img5Ref = useRef(null);
  const isInView5 = useInView(img5Ref, { once: true, margin: "0px" });

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-card/50 border-b border-border">
        {/* Absolute Background Image for Hero (Right Side, Big Size) */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 lg:left-1/2 w-full lg:w-1/2 h-full z-0"
        >
          <Image src="/about1.webp" alt="Anber Aziz portrait" fill className="object-cover object-top lg:object-center" priority sizes="(max-width: 1024px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-background/80 lg:bg-transparent lg:bg-gradient-to-r from-card/50 via-transparent to-transparent" />
        </motion.div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 pt-32 pb-32 lg:py-0">
          <div className="max-w-2xl lg:pr-12">
            <FadeInSection>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6">
                About <span className="text-primary">Me.</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground text-balance leading-relaxed">
                I'm an aspiring AI/ML researcher and full-stack software engineer based in Pakistan, deeply passionate about building scalable, intelligent systems that solve real-world problems.
              </p>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <ExperienceSection />

      {/* Bio Section */}
      <section className="py-24 bg-transparent">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
            <div className="md:col-span-5 lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                <FadeInSection>
                  <h2 className="text-3xl font-bold mb-6">The Journey</h2>
                  <div className="w-20 h-1 bg-primary mb-8 rounded-full" />
                  <a
                    href="/Anber_Aziz_CV_2026.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg transition-transform hover:scale-105"
                  >
                    Download Full CV
                  </a>
                </FadeInSection>
              </div>
            </div>
            
            <div className="md:col-span-7 lg:col-span-8 space-y-12">
              <FadeInSection className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                  Currently pursuing my Bachelor of Science in Software Engineering at Lahore College for Women University (LCWU), I am actively preparing to apply for MS/PhD programs in the United States for Fall 2027. My long-term academic focus lies at the intersection of Machine Learning inference optimization, Autonomous Agent orchestration, and robust API infrastructure.
                </p>
              </FadeInSection>

              <div className="-mx-4 md:-mx-10 my-10">
                <ContainerScroll>
                  <img src="/about2.webp" alt="Anber Aziz working" className="w-full h-auto rounded-2xl" />
                </ContainerScroll>
              </div>

              <FadeInSection delay={0.2} className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                  My technical journey began with web development, where I mastered the MERN stack and Next.js, eventually realizing that the most powerful web applications are those that integrate predictive intelligence. I've since expanded my expertise into Python, XGBoost, LLMs (Gemini, Llama, Groq), and Vector Databases, allowing me to build end-to-end AI products.
                </p>
                <p>
                  Beyond academics, I am an active freelance developer and open-source contributor. I thrive in environments that challenge me to rapidly learn new frameworks—whether it's deploying serverless infrastructure on Vercel, training classification models, or crafting pixel-perfect, highly animated UIs.
                </p>
              </FadeInSection>

              <div className="-mx-4 md:-mx-10 my-10">
                <ContainerScroll>
                  <img src="/about3.webp" alt="Anber Aziz presenting" className="w-full h-auto rounded-2xl" />
                </ContainerScroll>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Logo Marquee */}
      <section className="py-24 bg-card/50 border-y border-border overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 mb-12 text-center">
          <FadeInSection>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Technical Arsenal</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              The languages, frameworks, and tools I use to build intelligent systems.
            </p>
          </FadeInSection>
        </div>

        <div className="relative flex w-full overflow-hidden">
          {/* Gradient Masks for smooth fade out on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-card/50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-card/50 to-transparent pointer-events-none" />
          
          <motion.div
            className="flex whitespace-nowrap py-8 gap-16 pr-16"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30, // Adjust speed here
            }}
          >
            {/* We duplicate the array to create a seamless infinite loop */}
            {[...techStack, ...techStack].map((Tech, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 opacity-70 hover:opacity-100 transition-opacity min-w-[100px]">
                <Tech.icon className="w-16 h-16 text-foreground" />
                <span className="text-sm font-medium">{Tech.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>



      {/* Education Timeline */}
      <section className="py-24 bg-transparent">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-12">
              <FadeInSection>
                <h2 className="text-4xl font-bold mb-2">Education</h2>
                <div className="w-20 h-1 bg-primary mb-12 rounded-full" />
              </FadeInSection>

              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                
                {/* BS */}
                <FadeInSection delay={0.1} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <span className="w-2 h-2 bg-primary-foreground rounded-full" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-xl text-primary">Bachelors in Science in Software Engineering</h3>
                    </div>
                    <time className="text-sm text-muted-foreground font-mono bg-muted px-2 py-1 rounded">2026</time>
                    <p className="mt-3 text-muted-foreground">CGPA: <span className="font-bold text-foreground">3.20/4.00</span></p>
                    <p className="mt-1 text-sm text-muted-foreground">Lahore College for Women University (LCWU)</p>
                  </div>
                </FadeInSection>

                {/* Inter */}
                <FadeInSection delay={0.2} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                    <h3 className="font-bold text-xl mb-1">Intermediate</h3>
                    <p className="mt-2 text-muted-foreground">Score: <span className="font-bold text-foreground">85%</span></p>
                    <p className="mt-1 text-sm text-muted-foreground">Board of Intermediate and Secondary Education, Lahore</p>
                  </div>
                </FadeInSection>

                {/* Matric */}
                <FadeInSection delay={0.3} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                    <h3 className="font-bold text-xl mb-1">Matric</h3>
                    <p className="mt-2 text-muted-foreground">Score: <span className="font-bold text-foreground">85%</span></p>
                    <p className="mt-1 text-sm text-muted-foreground">Board of Intermediate and Secondary Education, Lahore</p>
                  </div>
                </FadeInSection>

              </div>
            </div>

            <motion.div 
              ref={img4Ref}
              style={{ filter: blur4, opacity: opacity4 }}
              className="relative w-full aspect-square rounded-full overflow-hidden shadow-2xl ring-4 ring-border/50"
            >
              <Image src="/about4.webp" alt="Anber Aziz graduation" fill className="object-cover" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <CertificationsSection />

      {/* Bottom CTA & Final Image */}
      <section className="pt-24 pb-12 bg-transparent border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-8">
            <FadeInSection>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Let's collaborate.</h2>
              <p className="text-xl text-muted-foreground mt-4 mb-8">
                I'm actively seeking MS/PhD opportunities for Fall 2027, as well as freelance engineering roles.
              </p>
              <a
                href="/contact"
                className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                Get in Touch
              </a>
            </FadeInSection>

            <div ref={img5Ref} className="w-full mt-16 relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <motion.div 
                initial={{ x: "0%" }}
                animate={isInView5 ? { x: "100%" } : { x: "0%" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 z-20 bg-primary"
              />
              <Image src="/about5.webp" alt="Anber Aziz workspace" fill className="object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
