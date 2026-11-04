import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

const socials = [
  { label: "GitHub", href: "https://github.com/XenonAesir" },
  { label: "Email", href: "mailto:xenonaesir@foxmail.com" },
];

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <section className="relative flex min-h-[calc(100vh-6rem)] items-center overflow-hidden">
        <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
          <div className="max-w-3xl">
            <p className="rise text-[0.68rem] font-light tracking-[0.32em] text-muted-foreground uppercase">
              Personal Site · Est. 2026
            </p>

            <h1 className="rise mt-10" style={{ animationDelay: "120ms" }}>
              <span className="block font-heading text-[clamp(3rem,9vw,7rem)] leading-[0.95] font-light tracking-[0.14em] uppercase">
                Xenon
              </span>
              <span className="my-6 block h-px w-28 bg-[linear-gradient(90deg,transparent,var(--ring),transparent)]" />
              <span className="block font-heading text-[clamp(3rem,9vw,7rem)] leading-[0.95] font-light tracking-[0.14em] text-muted-foreground/55 uppercase">
                Aesir
              </span>
            </h1>

            <p
              className="rise mt-12 font-heading text-xl leading-loose text-foreground sm:text-2xl"
              style={{ animationDelay: "260ms" }}
            >
              写代码，也写字。
            </p>
            <p
              className="rise mt-3 max-w-md text-sm leading-7 font-light text-muted-foreground"
              style={{ animationDelay: "340ms" }}
            >
              这里记录我做过的东西，和终于想明白的事。
            </p>

            <div
              className="rise mt-12 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "440ms" }}
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-6 py-2.5 font-heading text-sm tracking-[0.12em] backdrop-blur-sm transition-all duration-300 hover:-translate-y-px hover:border-ring hover:bg-card/80"
              >
                阅读文章
              </Link>
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-transparent px-4 py-2.5 text-xs tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
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
