"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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
import Link from 'next/link';

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

function AboutPhoto({
  src,
  alt,
  sizes,
  className,
  imgClassName,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={90}
        sizes={sizes}
        className={imgClassName ?? "object-cover"}
      />
    </div>
  );
}

export function AboutClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const img5Ref = useRef(null);
  const isInView5 = useInView(img5Ref, { once: true, margin: "0px" });

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-card/50 border-b border-border">
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 lg:left-1/2 w-full lg:w-1/2 h-full z-0"
        >
          <Image
            src="/about1.webp"
            alt="Anber Aziz portrait"
            fill
            priority
            quality={90}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-[center_18%] lg:object-[center_22%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/55 to-background/15 lg:from-card/70 lg:via-transparent lg:to-transparent" />
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
            <div className="md:col-span-5 lg:col-span-4 relative z-20">
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
            
            <div className="md:col-span-7 lg:col-span-8 space-y-12 relative z-10">
              <FadeInSection className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                I am currently doing a Bachelor of Science in Software Engineering at Lahore College for Women University (LCWU) and planning to apply for MS and PhD programs in the United States for Fall 2027. My academic interests include improving the performance of machine learning systems, working with AI agents, and building reliable APIs and backend systems.
                </p>
              </FadeInSection>

              <AboutPhoto
                src="/about2.webp"
                alt="Anber Aziz working at a desk"
                sizes="(max-width: 768px) 100vw, 720px"
                className="relative z-0 w-full aspect-[3/2] rounded-2xl ring-1 ring-border"
                imgClassName="object-cover object-[center_22%]"
              />

              <FadeInSection delay={0.2} className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                  My technical journey began with web development, where I mastered the MERN stack and Next.js, eventually realizing that the most powerful web applications are those that integrate predictive intelligence. I've since expanded my expertise into Python, XGBoost, LLMs (Gemini, Llama, Groq), and Vector Databases, allowing me to build end-to-end AI products.
                </p>
                <p>
                Along with my academic work, I am a freelance developer and open source contributor. I enjoy working on projects that push me to learn new technologies and solve real problems. My interests range from deploying web applications and developing machine learning solutions to building modern, user friendly interfaces with smooth and engaging user experiences.
                </p>
              </FadeInSection>

              <AboutPhoto
                src="/about3.webp"
                alt="Anber Aziz walking in a city"
                sizes="(max-width: 768px) 100vw, 420px"
                className="relative z-0 mx-auto w-full max-w-md aspect-[2/3] rounded-2xl ring-1 ring-border"
                imgClassName="object-cover object-top"
              />
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            
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
                    <p className="mt-2 text-muted-foreground">Score: <span className="font-bold text-foreground">87%</span></p>
                    <p className="mt-1 text-sm text-muted-foreground">Board of Intermediate and Secondary Education, Lahore</p>
                  </div>
                </FadeInSection>

                {/* Matric */}
                <FadeInSection delay={0.3} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                    <h3 className="font-bold text-xl mb-1">Matric</h3>
                    <p className="mt-2 text-muted-foreground">Score: <span className="font-bold text-foreground">87%</span></p>
                    <p className="mt-1 text-sm text-muted-foreground">Board of Intermediate and Secondary Education, Lahore</p>
                  </div>
                </FadeInSection>

              </div>
            </div>

            <AboutPhoto
              src="/about4.webp"
              alt="Anber Aziz presenting system architecture"
              sizes="(max-width: 1024px) 100vw, 560px"
              className="relative w-full aspect-[3/2] rounded-[2rem] overflow-hidden shadow-2xl ring-4 ring-border/50"
              imgClassName="object-cover object-[32%_center]"
            />

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
              <Link
                href="/contact"
                className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                Get in Touch
              </Link>
            </FadeInSection>

            <div ref={img5Ref} className="w-full mt-16 relative aspect-[5/4] rounded-3xl overflow-hidden shadow-2xl">
              <motion.div 
                initial={{ x: "0%" }}
                animate={isInView5 ? { x: "100%" } : { x: "0%" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 z-20 bg-primary"
              />
              <Image
                src="/about5.webp"
                alt="Anber Aziz working in a cafe"
                fill
                quality={90}
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover object-[center_18%]"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
