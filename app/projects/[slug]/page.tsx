import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { CodePre } from "@/components/code-pre";
import { PROJECTS } from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((item) => item.slug === slug);
  return project ? { title: project.name, description: project.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((item) => item.slug === slug);
  if (!project) notFound();

  const content = fs.readFileSync(
    path.join(process.cwd(), "content/projects", `${slug}.md`),
    "utf8",
  );

  return (
    <article className="mx-auto w-full max-w-3xl px-6 pt-10 pb-20">
      <header className="mb-10 space-y-4">
        <h1 className="font-heading text-3xl font-light tracking-wide sm:text-4xl">
          {project.name}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">
          {project.tags.map((tag) => (
            <span key={tag} className="border border-border px-2 py-0.5">
              {tag}
            </span>
          ))}
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub ↗
          </a>
        </div>
        <div className="hairline" />
      </header>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <MDXRemote
          source={content}
          components={{
            pre: CodePre,
            // 静态导出没有 next/image 的优化能力，直接用 img
            img: ({ alt, ...props }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img {...props} alt={alt ?? ""} loading="lazy" decoding="async" />
            ),
          }}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                [
                  rehypePrettyCode,
                  {
                    theme: { light: "github-light", dark: "github-dark" },
                    keepBackground: false,
                  },
                ],
              ],
            },
          }}
        />
      </div>

      <nav className="mt-16 border-t border-border/60 pt-6">
        <Link
          href="/projects"
          className="text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          ← 全部作品
        </Link>
      </nav>
    </article>
  );
}
