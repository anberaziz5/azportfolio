import { HeartHandshake, Globe, BookOpen } from "lucide-react";
import { FadeInDiv } from "@/components/shared/FadeIn";

export const metadata = {
  title: "My Story | Anber Aziz",
  description: "The personal journey, philanthropic work, and humanitarian efforts of Anber Aziz.",
};

export default function MyStoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <FadeInDiv className="container mx-auto px-4 md:px-6 pt-32 pb-24 relative z-10 max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
            <HeartHandshake className="w-4 h-4 mr-2" />
            Beyond the Code
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            My <span className="text-primary">Story.</span>
          </h1>
        </div>

        <article className="prose prose-lg dark:prose-invert max-w-none relative z-10">
          <div className="bg-card/60 backdrop-blur-md border border-border rounded-[2rem] p-8 md:p-12 shadow-sm mb-12">
            <h2 className="text-3xl font-bold mt-0 mb-6 flex items-center gap-3">
              <Globe className="text-primary w-8 h-8" />
              The Drive to Build
            </h2>
            <p className="leading-relaxed">
              My journey into software engineering wasn't just about learning syntax or mastering frameworks; it was driven by a deep-seated belief that technology is the most powerful lever we have for scaleable impact. Growing up in Pakistan, I witnessed firsthand how access to information, efficient systems, and intelligent automation could drastically alter the trajectory of communities.
            </p>
            <p className="leading-relaxed">
              I didn't want to just be a consumer of these technologies—I wanted to be the architect. This led me to pursue a BS in Software Engineering at LCWU, where I quickly discovered my passion for Artificial Intelligence. AI isn't just a buzzword to me; it's a fundamental shift in how we approach problem-solving, moving from deterministic logic to probabilistic understanding.
            </p>
          </div>

          <div className="bg-background/60 backdrop-blur-md border border-border rounded-[2rem] p-8 md:p-12 shadow-sm mb-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            <h2 className="text-3xl font-bold mt-0 mb-6 flex items-center gap-3">
              <HeartHandshake className="text-primary w-8 h-8" />
              Humanitarian & Volunteer Work
            </h2>
            <p className="leading-relaxed">
              While code runs on servers, its impact is felt by humans. I have always believed that technical expertise is a privilege that must be shared.
            </p>
            <p className="leading-relaxed">
              Over the years, I have actively participated in local humanitarian initiatives, focusing on digital literacy and educational access. By volunteering my time to mentor junior students and organizing local coding workshops, I aim to demystify technology for those who might not have traditional pathways into the tech industry.
            </p>
            <p className="leading-relaxed">
              During my time at LCWU, I've leveraged my technical skills to support community-driven projects, understanding that the best engineering solutions are those that center empathy and human needs. I view my academic pursuit of MS/PhD programs not just as personal advancement, but as a way to acquire the advanced tools needed to tackle systemic, large-scale challenges through applied AI.
            </p>
          </div>

          <div className="bg-card/60 backdrop-blur-md border border-border rounded-[2rem] p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl font-bold mt-0 mb-6 flex items-center gap-3">
              <BookOpen className="text-primary w-8 h-8" />
              Looking Forward
            </h2>
            <p className="leading-relaxed mb-0">
              As I target MS/PhD assistantships for Fall 2027, my goal is to dive deeper into the theoretical foundations of Machine Learning while maintaining my edge in practical, full-stack engineering. I want to research how autonomous agents and RAG systems can be made more resilient, unbiased, and accessible. In the interim, I continue to build, freelance, and contribute to open-source—always striving to engineer solutions that matter.
            </p>
          </div>
        </article>
      </FadeInDiv>
    </div>
  );
}
