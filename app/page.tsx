import Link from "next/link";
import { LocalClock } from "@/components/local-clock";
import { getAllPosts } from "@/lib/posts";
import { PROJECTS } from "@/lib/projects";

const socials = [
  { label: "GitHub", href: "https://github.com/XenonAesir" },
  { label: "Email", href: "mailto:xenonaesir@foxmail.com" },
];

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <section className="hero-screen flex items-center">
        <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
          <div className="max-w-3xl">
            <p className="rise text-[0.68rem] font-light tracking-[0.32em] text-muted-foreground uppercase">
              <LocalClock />
            </p>

            <h1
              className="rise mt-9 inline-flex flex-col items-start gap-3.5"
              style={{ animationDelay: "120ms" }}
            >
              <span className="font-heading text-[clamp(1.6rem,3.6vw,2.4rem)] leading-none font-normal tracking-[0.24em] uppercase">
                Rain
              </span>
              <span className="title-rule self-center" />
              <span className="font-heading text-[clamp(1.6rem,3.6vw,2.4rem)] leading-none font-normal tracking-[0.24em] text-muted-foreground/45 uppercase">
                Land
              </span>
            </h1>

            <p className="rise mt-7" style={{ animationDelay: "240ms" }}>
              <span className="home-credit-label">Designed by</span>
              <span className="home-credit-sui">Xenon Aesir</span>
            </p>

            <p
              className="rise mt-10 font-heading text-lg leading-loose text-foreground sm:text-xl"
              style={{ animationDelay: "320ms" }}
            >
              写代码，也写字。
            </p>
            <p
              className="rise mt-2 max-w-md text-sm leading-7 font-light text-muted-foreground"
              style={{ animationDelay: "400ms" }}
            >
              正在开发中。
            </p>

            <div
              className="rise mt-10 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "480ms" }}
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-none border border-border bg-card/50 px-6 py-2.5 font-heading text-sm tracking-[0.12em] backdrop-blur-sm transition-all duration-300 hover:-translate-y-px hover:border-ring hover:bg-card/80"
              >
                阅读文章
              </Link>
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-none border border-transparent px-4 py-2.5 text-xs tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-10">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <h2 className="text-[0.68rem] tracking-[0.3em] text-muted-foreground uppercase">
            Selected Work
          </h2>
          <Link
            href="/projects"
            className="text-[0.68rem] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            全部 →
          </Link>
        </div>
        {PROJECTS.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group flex flex-col gap-2 border-b border-border/60 py-6"
          >
            <div className="flex items-baseline justify-between gap-6">
              <span className="font-heading text-xl font-normal tracking-wide transition-colors group-hover:text-primary sm:text-2xl">
                {project.name}
              </span>
              <span className="text-muted-foreground transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
            <span className="max-w-2xl text-sm leading-7 font-light text-muted-foreground">
              {project.summary}
            </span>
            <span className="text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
              {project.tags.join(" · ")}
            </span>
          </Link>
        ))}
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-28 sm:px-10">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <h2 className="text-[0.68rem] tracking-[0.3em] text-muted-foreground uppercase">
            Latest Writing
          </h2>
          <Link
            href="/blog"
            className="text-[0.68rem] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            全部 →
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="py-8 font-light text-muted-foreground">还没有文章。</p>
        ) : (
          <div>
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-1.5 border-b border-border/60 py-6 sm:flex-row sm:items-baseline sm:gap-8"
              >
                <time
                  dateTime={post.date}
                  className="shrink-0 text-[0.7rem] tracking-[0.16em] text-muted-foreground uppercase sm:w-24"
                >
                  {post.date}
                </time>
                <span className="font-heading text-xl font-normal tracking-wide transition-colors group-hover:text-primary sm:text-2xl">
                  {post.title}
                </span>
                <span className="ml-auto hidden text-muted-foreground transition-transform group-hover:translate-x-1 sm:block">
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
