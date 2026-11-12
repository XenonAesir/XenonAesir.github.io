import Link from "next/link";
import { PROJECTS } from "@/lib/projects";

export const metadata = { title: "作品" };

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-10 pb-20">
      <h1 className="font-heading text-3xl font-light tracking-wide sm:text-4xl">作品</h1>
      <div className="hairline mt-6" />

      <div>
        {PROJECTS.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group flex flex-col gap-2 border-b border-border/60 py-7"
          >
            <div className="flex items-baseline justify-between gap-6">
              <span className="font-heading text-xl font-normal tracking-wide transition-colors group-hover:text-primary sm:text-2xl">
                {project.name}
              </span>
              <span className="text-muted-foreground transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
            <span className="text-sm leading-7 font-light text-muted-foreground">
              {project.summary}
            </span>
            <span className="text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
              {project.tags.join(" · ")}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
