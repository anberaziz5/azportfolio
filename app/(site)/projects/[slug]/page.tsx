import { projectsData } from "@/lib/data/projects-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.id === slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Anber Aziz`,
    description: project.description,
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.id === slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        <Link href="/projects" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        <header className="mb-16">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
              {project.year}
            </span>
            <span className="text-sm font-medium px-3 py-1 bg-secondary text-secondary-foreground rounded-full border border-border">
              {project.type}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            {project.title}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground text-balance">
            {project.description}
          </p>
        </header>

        {/* Tech Stack Bar */}
        <div className="py-8 border-y border-border mb-16">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Technologies Used</h3>
          <div className="flex flex-wrap gap-3">
            {project.techStack.map((tech, i) => (
              <span key={i} className="text-sm font-mono px-4 py-2 bg-card rounded-lg border border-border text-foreground">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Long Description */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
          {project.longDescription.map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Links */}
        {(project.githubUrl || project.liveUrl) && (
          <div className="flex flex-wrap gap-4 pt-8 border-t border-border">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <FaGithub className="w-4 h-4" aria-label="GitHub icon" />
                View Source Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
